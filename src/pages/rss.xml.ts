import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { marked } from 'marked';
import { SITE } from '../config';
import { allEssays, allNotes } from '../lib/content';

export async function GET(context: APIContext) {
  const items = [
    ...(await allEssays()).map((p) => ({ p, kind: 'essays' })),
    ...(await allNotes()).map((p) => ({ p, kind: 'notes' })),
  ]
    .sort((a, b) => +b.p.data.pubDate - +a.p.data.pubDate)
    .map(({ p, kind }) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/${kind}/${p.id}`,
      categories: [p.data.pillar, ...p.data.tags],
      content: marked.parse(p.body ?? '', { async: false }) as string,
    }));
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: '<language>en-in</language>',
    trailingSlash: false,
  });
}
