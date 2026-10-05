import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

// dev-tools/lint-content.mjs on shelves that are deliberately wrong. The shipped
// shelves are checked by `node dev-tools/lint-content.mjs` itself.

const SCRIPT = resolve(process.cwd(), 'dev-tools/lint-content.mjs');
const HEADER = '| Tool | Description | Platforms | Notes |\n| --- | --- | --- | --- |';

let dir;

function lint(rows) {
  dir = mkdtempSync(join(tmpdir(), 'spellbook-lint-'));
  writeFileSync(join(dir, 'shelf.md'), `# Shelf\n\n> A blurb.\n\n## Section\n\n${HEADER}\n${rows}\n`);
  try {
    return { status: 0, out: execFileSync('node', [SCRIPT, dir], { encoding: 'utf8' }) };
  } catch (e) {
    return { status: e.status, out: String(e.stdout) };
  }
}

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = undefined;
});

describe('lint-content', () => {
  it('passes a well-formed shelf', () => {
    const { status } = lint('| [A](https://example.com/a) | Does a thing. | Web | MIT. |');
    expect(status).toBe(0);
  });

  it('fails on raw HTML in a description', () => {
    const { status, out } = lint('| [A](https://example.com/a) | Click <a href="https://evil.test">here</a>. | Web | MIT. |');
    expect(status).toBe(1);
    expect(out).toMatch(/raw HTML/);
  });

  it('fails on a script tag in the notes', () => {
    const { status, out } = lint('| [A](https://example.com/a) | Fine. | Web | <script>alert(1)</script> |');
    expect(status).toBe(1);
    expect(out).toMatch(/raw HTML/);
  });

  it('allows angle brackets inside inline code', () => {
    const { status } = lint('| [A](https://example.com/a) | Runs `<div>` templates. | Web | MIT. |');
    expect(status).toBe(0);
  });

  it('fails on an http:// link', () => {
    const { status, out } = lint('| [A](http://example.com/a) | Does a thing. | Web | MIT. |');
    expect(status).toBe(1);
    expect(out).toMatch(/not https: http:\/\/example\.com\/a/);
  });

  it('fails on a javascript: link, wherever it is in the row', () => {
    const { status, out } = lint('| [A](https://example.com/a) | See [this](javascript:alert(1)). | Web | MIT. |');
    expect(status).toBe(1);
    expect(out).toMatch(/not https: javascript:alert/);
  });
});
