import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PILLAR_KEYS } from './config';

const source = z.object({
  title: z.string(),
  url: z.url(),
  publisher: z.string(),
});

const post = z.object({
  title: z.string().max(70),
  description: z.string().min(80).max(160),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  pillar: z.enum(PILLAR_KEYS),
  tags: z.array(z.string()).default([]),
  sources: z.array(source).default([]),
  aiAssisted: z.boolean().default(true),
  draft: z.boolean().default(false),
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: post.extend({ sources: z.array(source).min(2) }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: post,
});

const reads = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reads' }),
  schema: z.object({
    week: z.string().regex(/^\d{4}-W\d{2}$/),
    title: z.string(),
    description: z.string().min(80).max(160),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    items: z
      .array(
        z.object({
          title: z.string(),
          url: z.url(),
          source: z.string(),
          author: z.string().optional(),
          pillar: z.enum(PILLAR_KEYS),
          commentary: z.string().min(40),
        }),
      )
      .min(3),
  }),
});

export const collections = { essays, notes, reads };
