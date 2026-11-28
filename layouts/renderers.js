const { footer, header, related, subscribeInline } = require('../includes/partials');

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const twoDigits = (number) => String(number).padStart(2, '0');
const siteRoot = (site) => `${site.url ?? ''}${site.baseurl ?? ''}`;

function pageDescription(site, page) {
  let description;
  if (page.excerpt != null && page.excerpt !== false) {
    description = String(page.excerpt).replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, '');
  } else if (page.auto_excerpt != null && page.auto_excerpt !== false) {
    description = String(page.auto_excerpt);
  } else {
    return String(site.description ?? '');
  }
  description = description.replace(/\n/g, '');
  return description.length > 160 ? `${description.slice(0, 157)}...` : description;
}

function ogImage(page) {
  return page.image || `/assets/og/${page.url.replace('/', '')}.png`;
}

function jsonLd({ page, site, description, image }) {
  const date = new Date(page.date);
  const datePublished = Number.isNaN(date.getTime())
    ? String(page.date)
    : `${date.getUTCFullYear()}-${twoDigits(date.getUTCMonth() + 1)}-${twoDigits(date.getUTCDate())}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.title,
    description,
    datePublished,
    url: `${site.url}${page.url}`,
    image: `${site.url}${image}`,
    author: { '@type': 'Person', name: site.author, url: `${site.url}/about/` },
  };
  // Keep strings containing HTML from being interpreted as markup inside the script element.
  return html.raw(JSON.stringify(data).replace(/</g, '\\u003c'));
}

function defaultLayout({ site, page, content, styles }) {
  const root = siteRoot(site);
  const description = pageDescription(site, page);
  const image = ogImage(page);
  const canonical = page.url.replaceAll('index.html', '');
  return html`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    ${''}
    <title>${page.title ? html`${page.title} / ` : ''}${site.title}</title>
    <meta name="author" content="${site.author}">
    <meta name="description" content="${description}">

    <link rel="canonical" href="${root}${canonical}">
    <link rel="alternate" type="application/rss+xml" title="${site.title}" href="${root}/feed.xml">
    ${page.feed ? html`<link rel="alternate" type="application/atom+xml" title="${page.feed_title}" href="${root}${page.feed}">` : ''}

    <meta property="og:title" content="${page.title}">
    ${''}
    <meta property="og:image" content="${root}${image}">
    <meta property="og:description" content="${description}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@alex_frantic">
    <meta name="twitter:creator" content="@alex_frantic">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${root}${image}">

    ${page.date && page.title ? html`
    <script type="application/ld+json">
    ${jsonLd({ page, site, description, image })}
    </script>
    ` : ''}
    <link id="favicon" rel="icon" type="image/png" href="/favicon.png">
    <script>
      if ('ethereum' in window) {
        document.getElementById('favicon').href = '/assets/favicon-hex.png';
      }
    </script>

    <style type="text/css" media="screen">
      ${html.raw(styles ?? '')}
      ${html.raw(page.css ?? '')}
    </style>
  </head>

  <body>
    ${content}

    ${site.dev ? html`
    <script>
      new EventSource('/changes').addEventListener('change', () => window.location.reload());
    </script>
    ` : html`
    <script async src="https://u.frantic.im/script.js" data-website-id="cd2ea49a-5998-477e-8f35-a6ab8d2df514"></script>
    `}
  </body>
</html>
`;
}

function pageLayout({ site, page, content, styles }) {
  return defaultLayout({ site, page, styles, content: html`<div class="container">
  ${header({ site })}

  <main>
    <article class="article ">
      <h1 class="article-title">
        <a href="${page.url}"> ${page.title} </a>
      </h1>
      <div class="article-content">${content}</div>
    </article>
  </main>
</div>` });
}

function displayDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function postLayout({ site, page, content, styles }) {
  const image = ogImage(page);
  return defaultLayout({ site, page, styles, content: html`<div class="container">
  ${header({ site })}

  <main>
    <article class="article ">
      <h1 class="article-title" data-nosnippet>
        <a href="${page.url}"> ${page.title} </a>
      </h1>
      ${page.date ? html`
      <div class="article-meta" data-nosnippet>
        ${displayDate(page.date)} by ${site.author}
      </div>
      ` : ''}
      ${page.image
        ? html`<img class="article-og article-og--custom" src="${image}" alt="" />`
        : html`<img class="article-og" src="${image}" alt="" width="1200" height="630" />`}
      ${''}
      <div class="article-content">${content}</div>
      ${subscribeInline({ page })}
    </article>

    ${related({ site, page })}
  </main>

  ${footer({ site })}
</div>` });
}

const defaultDraftCSS = `.draft {
  color: red;
}
`;

function draftLayout({ site, page, styles }) {
  return defaultLayout({ site, page: { css: defaultDraftCSS, ...page }, styles, content: html`<article>
  <header>
    <em>Not published yet</em>
    <h1 class="draft">${page.title}</h1>
  </header>
  <p class="draft">${page.excerpt}</p>
  <p>
    This post is a draft. Follow updates to this blog via <a href="${siteRoot(site)}/feed.xml">RSS</a> and <a href="${site.twitter}">X</a> to learn when it's published.
  </p>
</article>` });
}

module.exports = {
  default: defaultLayout,
  page: pageLayout,
  post: postLayout,
  draft: draftLayout,
};
