import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, 10);

  return rss({
    title: 'frantic.im',
    description: 'Occasional posts on technology and stuff',
    site: context.site ?? 'https://frantic.im',
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt ?? post.body.slice(0, 280),
      link: `/${post.slug}`,
      pubDate: post.data.pubDate,
      content: post.body
    }))
  });
}
