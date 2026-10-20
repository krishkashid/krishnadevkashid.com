import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '../config';

const font = (w: 400 | 700) =>
  fs.readFileSync(path.join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${w}-normal.woff`));
const fonts = [
  { name: 'Inter', data: font(400), weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: font(700), weight: 700 as const, style: 'normal' as const },
];

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

export async function ogPng(title: string, kicker: string) {
  const size = title.length > 80 ? 52 : title.length > 50 ? 64 : 76;
  const tree = el('div', { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#141311', color: '#ece8df', fontFamily: 'Inter' }, [
    el('div', { fontSize: 28, color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase' }, kicker),
    el('div', { fontSize: size, fontWeight: 700, lineHeight: 1.15, letterSpacing: -1.5 }, title),
    el('div', { fontSize: 30, color: '#a39d92' }, `${SITE.name} · krishnadevkashid.com`),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}
