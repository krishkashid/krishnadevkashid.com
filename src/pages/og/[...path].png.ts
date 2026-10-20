import type { APIRoute } from 'astro';
import { ogPng } from '../../lib/og';
import { allEssays, allNotes, type Post } from '../../lib/content';
import { PILLARS, SITE } from '../../config';

export async function getStaticPaths() {
  const entry = (kind: string, p: Post) => ({
    params: { path: `${kind}/${p.id}` },
    props: { title: p.data.title, kicker: PILLARS[p.data.pillar].title },
  });
  return [
    { params: { path: 'default' }, props: { title: SITE.tagline, kicker: SITE.name } },
    ...(await allEssays()).map((p) => entry('essays', p)),
    ...(await allNotes()).map((p) => entry('notes', p)),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const { title, kicker } = props as { title: string; kicker: string };
  return new Response(await ogPng(title, kicker), { headers: { 'Content-Type': 'image/png' } });
};
