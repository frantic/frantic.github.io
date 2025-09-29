---
title: Alex Kotliarskyi
image: /assets/og-image.jpg
layout: page
url: /
---

I'm a software engineer based in Seattle. I work at OpenAI on making GPUs do useful things. I like building products, obsessing over UX and little details, and connecting the dots.

In the past I cofounded [Secta AI](https://secta.ai/), worked at [Replit](https://replit.com/site/careers) and [Facebook](/leaving-facebook) building mobile apps, developer efficiency tools, React Native, Oculus and Messenger.

I write about technology and side projects. Here are a few of the latest blog posts:

{% assign latest = site.posts | slice: 0, 5 %}

<div class="related-posts">
  <ul>
    {% for post in latest %}
    <li>
       <a href="{{ post.url }}">{{ post.title }} </a>
    </li>
    {% endfor %}
  </ul>
</div>

<a href="/blog">View all</a> {{ site.posts | size }} posts, [subscribe](/subscribe) or check out blog [analytics](https://u.frantic.im/share/PdxrhczkbRQVIp61/frantic.im).

{% include footer.html %}
