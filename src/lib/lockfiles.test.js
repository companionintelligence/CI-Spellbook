import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { checkLockfiles } from '../../scripts/check-lockfiles.mjs';

const ROOT = resolve(process.cwd());

describe('lockfiles', () => {
  it('package.json, package-lock.json and deno.lock list the same direct dependencies', () => {
    expect(checkLockfiles(ROOT)).toEqual([]);
  });

  describe('notice drift', () => {
    let tmp;

    const withPackageJson = (edit) => {
      tmp = mkdtempSync(join(tmpdir(), 'spellbook-locks-'));
      for (const f of ['package.json', 'package-lock.json', 'deno.lock']) cpSync(join(ROOT, f), join(tmp, f));
      const pkg = JSON.parse(readFileSync(join(tmp, 'package.json'), 'utf8'));
      edit(pkg);
      writeFileSync(join(tmp, 'package.json'), JSON.stringify(pkg));
      return checkLockfiles(tmp);
    };

    afterEach(() => {
      if (tmp) rmSync(tmp, { recursive: true, force: true });
      tmp = undefined;
    });

    it('a dependency added to package.json but not to deno.lock, the way #68 left it', () => {
      const problems = withPackageJson((pkg) => {
        pkg.dependencies['@companionintelligence/new-thing'] = '^1.0.0';
      });
      expect(problems.join('\n')).toContain('deno.lock does not record @companionintelligence/new-thing');
      expect(problems.join('\n')).toContain('package-lock.json has @companionintelligence/new-thing@(nothing)');
    });

    it('a dependency removed from package.json but still locked', () => {
      const problems = withPackageJson((pkg) => {
        delete pkg.dependencies.classnames;
      });
      expect(problems.join('\n')).toContain('deno.lock records classnames, which package.json no longer lists');
    });

    it('a range changed in package.json: npm notices (the npm lockfile records ranges as written)', () => {
      const problems = withPackageJson((pkg) => {
        pkg.dependencies.react = '^19.0.0';
      });
      expect(problems.join('\n')).toContain('package-lock.json has react@^18.2.0, package.json wants ^19.0.0');
    });
  });
});
