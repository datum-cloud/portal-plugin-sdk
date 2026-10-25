import { readFileSync } from 'node:fs';

const version = process.argv[2];
if (!version) {
  console.error('usage: release-notes.mjs <version>');
  process.exit(2);
}

const lines = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8').split('\n');
const start = lines.findIndex((line) => line.trim() === `## ${version}`);
if (start === -1) {
  console.error(`CHANGELOG.md has no section for ${version}`);
  process.exit(1);
}
const end = lines.findIndex((line, index) => index > start && line.startsWith('## '));
const body = lines.slice(start + 1, end === -1 ? undefined : end).join('\n').trim();
console.log(body);
