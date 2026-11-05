/**
 * Liston të dhënat që mungojnë ("TODO:") në skedarët e përmbajtjes.
 * `node scripts/check-content.ts`         → paralajmërim (exit 0)
 * `node scripts/check-content.ts --strict` → dështon nëse ka TODO (për publikimin final)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(import.meta.dirname, '..');
const dirs = ['src/app/data', 'src/content'].map((d) => join(root, d));
const strict = process.argv.includes('--strict');

function* files(dir: string): Generator<string> {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (/\.(ts|json|md)$/.test(name) && !name.endsWith('.spec.ts')) yield path;
  }
}

const todos: string[] = [];
for (const dir of dirs) {
  for (const file of files(dir)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const at = line.indexOf('TODO:');
        if (at >= 0) todos.push(`${relative(root, file)}:${i + 1}  ${line.slice(at).trim()}`);
      });
  }
}

if (todos.length) {
  console.warn(`\n⚠ ${todos.length} të dhëna mungojnë (TODO):\n  ${todos.join('\n  ')}\n`);
  if (strict) process.exit(1);
} else {
  console.log('check-content: asnjë TODO');
}
