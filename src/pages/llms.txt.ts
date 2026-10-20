import { SITE } from '../config';
import { allEssays, allNotes, type Post } from '../lib/content';

export async function GET() {
  const line = (kind: string, p: Post) =>
    `- [${p.data.title}](${SITE.url}/${kind}/${p.id}): ${p.data.description}`;
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'Personal site of Krishnadev Kashid (also written Krishna Kashid), Mumbai. Views are personal.',
    '',
    '## Essays',
    ...(await allEssays()).map((p) => line('essays', p)),
    '',
    '## Notes',
    ...(await allNotes()).map((p) => line('notes', p)),
    '',
    '## About',
    `- [About](${SITE.url}/about)`,
    `- [Start here](${SITE.url}/start-here)`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
