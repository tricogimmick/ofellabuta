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
export const collections = {
  'articles': articlesCollection,
};