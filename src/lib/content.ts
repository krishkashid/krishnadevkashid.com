import { getCollection, type CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';

export type Post = CollectionEntry<'essays'> | CollectionEntry<'notes'>;

const isLive = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export async function allEssays() {
  return (await getCollection('essays', isLive)).sort((a, b) => +b.data.pubDate - +a.data.pubDate);
}
export async function allNotes() {
  return (await getCollection('notes', isLive)).sort((a, b) => +b.data.pubDate - +a.data.pubDate);
}
export async function allReads() {
  return (await getCollection('reads', isLive)).sort((a, b) => +b.data.pubDate - +a.data.pubDate);
}

export const minutes = (body = '') => Math.max(1, Math.round(readingTime(body).minutes));

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
