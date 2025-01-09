import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({ 
    type: 'content', // v2.5.0以降
    schema: z.object({
      title: z.string(),
      createdAt: z.date(),
      description: z.string(),
      tags: z.array(z.string()),
    }),
});

const quotesCollection = defineCollection({ 
  type: 'content', // v2.5.0以降
  schema: z.object({
    title: z.string(),
    createdAt: z.date(),
    source: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  'articles': articlesCollection,
  'quotes': quotesCollection,
};