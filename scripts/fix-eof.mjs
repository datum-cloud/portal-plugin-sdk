// tsdown/rolldown don't guarantee a trailing newline on emitted files.
// Since dist/ is committed (see the "commit built dist/" changeset), run this
// after every build so generated files pass a plain end-of-file-newline check.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
const TEXT_EXTENSIONS = new Set(['.js', '.d.ts', '.map']);

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (![...TEXT_EXTENSIONS].some((ext) => path.endsWith(ext))) continue;
    const content = readFileSync(path, 'utf8');
    if (!content.endsWith('\n')) {
      writeFileSync(path, `${content}\n`);
    }
  }
}

walk(DIST);
