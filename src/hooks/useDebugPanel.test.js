import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isEditableTarget, useDebugPanel } from './useDebugPanel.js';

// The debug panel's frame-rate monitor used to start another requestAnimationFrame
// loop every second and never stop the old ones, and each stale loop then called
// setState on every frame: ~2k callbacks in the first 5 s, 1.8M in the 25-30 s
// window, a whole-app re-render per frame, on a page where the panel was closed.
// These drive the hook against a manual frame clock so a regression shows up as a
// number, not as a laptop fan.

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let clock;
let pending;
let nextId;
let executed;
let api;
let root;
let container;

const Probe = () => {
  api = useDebugPanel();
  return null;
};

/** Run every callback queued for the next frame, `n` times, 1/60 s apart. */
async function runFrames(n, onFrame) {
  for (let i = 0; i < n; i++) {
    clock += 1000 / 60;
    const batch = [...pending.values()];
    pending.clear();
    await act(async () => {
      for (const cb of batch) {
        executed += 1;
        cb(clock);
      }
    });
    onFrame?.();
  }
}

const key = (init, target = document.body) =>
  act(async () => {
    target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
  });

beforeEach(async () => {
  clock = 1000;
  pending = new Map();
  nextId = 1;
  executed = 0;

  vi.spyOn(performance, 'now').mockImplementation(() => clock);
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    const id = nextId++;
    pending.set(id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id) => pending.delete(id));

  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(React.createElement(Probe)));
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('frame monitor', () => {
  it('runs no animation-frame loop at all while the panel is closed', async () => {
    expect(pending.size).toBe(0);
    await runFrames(300); // five seconds
    expect(executed).toBe(0);
    expect(pending.size).toBe(0);
  });

  it('runs exactly one loop while the panel is open, however long it stays open', async () => {
    await key({ key: '`', ctrlKey: true });
    expect(api.debugState.isVisible).toBe(true);

    let widest = 0;
    await runFrames(300, () => {
      widest = Math.max(widest, pending.size);
    });

    // The bug: a new loop each second, none of the old ones cancelled.
    expect(widest).toBe(1);
    expect(pending.size).toBe(1);
    // One callback per frame: 300 frames, plus the one that was queued on open.
    expect(executed).toBeLessThanOrEqual(301);
    // And it still measures: the loop publishes an fps reading once a second.
    expect(api.debugState.performanceMetrics.fps).toBeGreaterThan(0);
  });

  it('stops the loop when the panel closes', async () => {
    await key({ key: '`', ctrlKey: true });
    await runFrames(90);
    expect(pending.size).toBe(1);

    await key({ key: '`', ctrlKey: true });
    expect(api.debugState.isVisible).toBe(false);
    expect(pending.size).toBe(0);
  });

  it('stops the loop when the component unmounts', async () => {
    await key({ key: '`', ctrlKey: true });
    await runFrames(10);
    expect(pending.size).toBe(1);

    await act(async () => root.unmount());
    expect(pending.size).toBe(0);

    // afterEach unmounts again; give it a root to unmount.
    root = createRoot(container);
  });
});

describe('keyboard shortcut', () => {
  it('does not fire for a bare backtick, which is a character someone may be typing', async () => {
    const event = { key: '`', bubbles: true, cancelable: true };
    await act(async () => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', event));
    });
    expect(api.debugState.isVisible).toBe(false);
  });

  it('leaves a backtick or tilde typed into the search field alone, and does not swallow it', async () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    const tilde = new KeyboardEvent('keydown', { key: '~', bubbles: true, cancelable: true });
    await act(async () => {
      input.dispatchEvent(tilde);
    });
    expect(tilde.defaultPrevented).toBe(false);
    expect(api.debugState.isVisible).toBe(false);

    // Not even with the modifier: in a text field the keystroke belongs to the field.
    const withCtrl = new KeyboardEvent('keydown', { key: '`', ctrlKey: true, bubbles: true, cancelable: true });
    await act(async () => {
      input.dispatchEvent(withCtrl);
    });
    expect(withCtrl.defaultPrevented).toBe(false);
    expect(api.debugState.isVisible).toBe(false);

    input.remove();
  });

  it('toggles on Ctrl or Cmd + backtick elsewhere on the page, and Escape closes it', async () => {
    await key({ key: '`', metaKey: true });
    expect(api.debugState.isVisible).toBe(true);

    await key({ key: 'Escape' });
    expect(api.debugState.isVisible).toBe(false);
  });
});

describe('isEditableTarget', () => {
  const make = (html) => {
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host);
    return host;
  };

  it('is true for the things you can type in', () => {
    const host = make('<input id="i"><textarea id="t"></textarea><select id="s"></select><div id="c" contenteditable="true"><b id="inner">x</b></div>');
    for (const id of ['i', 't', 's', 'c', 'inner']) {
      expect(isEditableTarget(host.querySelector(`#${id}`)), id).toBe(true);
    }
    host.remove();
  });

  it('is false for everything else', () => {
    const host = make('<button id="b">b</button><div id="d" contenteditable="false">d</div><p id="p">p</p>');
    for (const id of ['b', 'd', 'p']) {
      expect(isEditableTarget(host.querySelector(`#${id}`)), id).toBe(false);
    }
    expect(isEditableTarget(document.body)).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(window)).toBe(false);
    host.remove();
  });
});
