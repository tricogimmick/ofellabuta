// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Import Zod
import { z } from 'astro/zod';

// 4. Define a `loader` and `schema` for each collection
const articlesCollection = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
      title: z.string(),
      createdAt: z.date(),
      description: z.string(),
      tags: z.array(z.string()),
      style: z.string().optional(),
  }),
});

const quotesCollection = defineCollection({
  loader: glob({ base: './src/content/quotes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    createdAt: z.date(),
    source: z.string(),
    description: z.string(),
  }),
});

const restroomInComicsCollection = defineCollection({
  loader: glob({ base: './src/content/restroom_in_comics', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    media: z.string(),
    createdAt: z.date(),
    description: z.string(),
  }),
});


// 5. Export a single `collections` object to register your collection(s)
export const collections = { articlesCollection, quotesCollection, restroomInComicsCollection };