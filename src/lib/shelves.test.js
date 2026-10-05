import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearShelves, loadShelf, parseShelf } from './shelves.js';

const MD = `# Shelf

## Section

| Tool | Description |
|---|---|
| [Alpha](https://example.com/a) | First. |
| [Beta](https://example.com/b) | Second. |
`;

const ok = (body = MD) => ({ ok: true, status: 200, statusText: 'OK', text: () => Promise.resolve(body) });
const notOk = () => ({ ok: false, status: 404, statusText: 'Not Found', text: () => Promise.resolve('') });

afterEach(() => clearShelves());

describe('parseShelf', () => {
  it('derives the html, the search lines and the face summary in one pass', () => {
    const shelf = parseShelf(MD);
    expect(shelf.html).toContain('<table>');
    expect(shelf.lines).toContain('Alpha — First.');
    expect(shelf.summary).toMatchObject({ tools: 2, sections: 1, examples: ['Alpha', 'Beta'] });
  });

  it('gives a shelf with no table no number on its face, not an error', () => {
    expect(parseShelf('# Empty\n\nNothing yet.').summary).toBeNull();
  });
});

describe('loadShelf', () => {
  it('fetches a path once however many callers ask: the search index and the card share it', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(ok()));
    vi.stubGlobal('fetch', fetchMock);

    const [a, b, c] = await Promise.all([loadShelf('/markdown/x.md'), loadShelf('/markdown/x.md'), loadShelf('/markdown/x.md')]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it('keeps different paths apart', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(ok()));
    vi.stubGlobal('fetch', fetchMock);

    await Promise.all([loadShelf('/markdown/x.md'), loadShelf('/markdown/y.md')]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejects with the status when the file is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(notOk())));
    await expect(loadShelf('/markdown/missing.md')).rejects.toThrow(/404/);
  });

  it('does not cache a failure: the next caller gets a fresh attempt', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(notOk()).mockResolvedValueOnce(ok());
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadShelf('/markdown/x.md')).rejects.toThrow();
    // The eviction runs in a catch handler on the same promise; let it settle.
    await Promise.resolve();
    await expect(loadShelf('/markdown/x.md')).resolves.toMatchObject({ summary: { tools: 2 } });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
