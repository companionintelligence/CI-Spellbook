import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [ios, android] = await Promise.all([
  readFile(new URL('./ios/capacitor.config.ts', import.meta.url), 'utf8'),
  readFile(new URL('./android/capacitor.config.ts', import.meta.url), 'utf8'),
]);

test('Spellbook mobile shells use matching app identity and bundled catalog', () => {
  for (const config of [ios, android]) {
    assert.match(config, /appId:\s*'com\.companionintelligence\.spellbook'/);
    assert.match(config, /appName:\s*'Companion Spellbook'/);
    assert.match(config, /webDir:\s*'\.\.\/\.\.\/dist'/);
    assert.match(config, /process\.env\.CAP_SERVER_URL/);
  }
});

test('Spellbook ships a bundled webview by default, not a remote development URL', () => {
  assert.match(ios, /server:\s*\{\s*\.\.\./s);
  assert.match(android, /server:\s*\{\s*androidScheme:\s*'https'/s);
  assert.match(ios, /CAP_SERVER_URL\s*\?/);
  assert.match(android, /CAP_SERVER_URL\s*\?/);
});
