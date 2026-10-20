// Fails CI when content breaks house rules. Runs on src/content/**.
// Forbidden terms are stored as SHA-256 fingerprints (repo is public); see forbidden-hashes.json.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../src/content/', import.meta.url).pathname;
const hashes = new Set(existsSync(new URL('./forbidden-hashes.json', import.meta.url))
  ? JSON.parse(readFileSync(new URL('./forbidden-hashes.json', import.meta.url), 'utf8')) : []);
const SLOP = ['delve', 'in today\'s fast-paced', 'game-changer', 'game changer', 'unlock the power', 'revolutionize', 'it\'s important to note', 'tapestry', 'in the ever-evolving'];
const ADVICE = [/\b(you should|buy|sell|invest in)\b.{0,40}\b(stock|shares|mutual fund|scheme|nifty|sensex)\b/i, /\bguaranteed returns?\b/i];

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = existsSync(ROOT) ? walk(ROOT).filter((f) => /\.(md|mdx)$/.test(f)) : [];
const sha = (s) => createHash('sha256').update(s).digest('hex');

let errors = 0, warnings = 0;
const err = (f, m) => { errors++; console.error(`ERROR ${f.replace(ROOT, '')}: ${m}`); };
const warn = (f, m) => { warnings++; console.warn(`warn  ${f.replace(ROOT, '')}: ${m}`); };

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const words = text.toLowerCase().match(/[a-z0-9][a-z0-9&.'-]*/g) ?? [];
  for (let n = 1; n <= 3; n++) {
    for (let i = 0; i + n <= words.length; i++) {
      if (hashes.has(sha(words.slice(i, i + n).join(' ')))) err(f, `contains a forbidden term (fingerprint match near word ${i})`);
    }
  }
  for (const s of SLOP) if (text.toLowerCase().includes(s)) warn(f, `slop phrase: "${s}"`);
  for (const re of ADVICE) if (re.test(text)) err(f, `reads like investment advice: ${re}`);
  if (/!\[\s*\]\(/.test(text)) err(f, 'image without alt text');
  if (f.includes('/essays/') && !/^---[\s\S]*?\nsources:/m.test(text)) err(f, 'essay is missing a sources block');
  if (/\bTODO\b|\bLOREM\b|\bXXX\b/.test(text)) err(f, 'placeholder text left in');
}
console.log(`content-guard: ${files.length} files, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
