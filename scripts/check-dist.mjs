import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const sensitive = [
  /hf_[A-Za-z0-9]{20,}/,
  /(?:rpa|rps)_[A-Za-z0-9_-]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { await inspect(path); continue; }
    if (/^(\.env|paper\.md|poster\.md)|\.map$/.test(entry.name)) throw new Error(`Unexpected release file: ${path}`);
    const contents = await readFile(path, 'utf8');
    if (sensitive.some(pattern => pattern.test(contents))) throw new Error(`Possible credential in build: ${path}`);
  }
}
await inspect('dist');
const html = await readFile('dist/index.html', 'utf8');
if (/\b(?:src|href)="\/(?:assets|favicon)/.test(html)) throw new Error('Root-relative asset would break project Pages.');
console.log('Build artifact checks passed: no detected credential patterns or research dumps; portable asset URLs.');
