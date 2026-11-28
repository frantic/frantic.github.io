const XML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeXml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => XML_ENTITIES[char]);
}

function cdata(html) {
  return html.replaceAll(']]>', ']]]]><![CDATA[>');
}

function absolutePostContent(content, siteUrl) {
  return cdata((content ?? '')
    .replaceAll('src="/assets/', () => `src="${siteUrl}/assets/`)
    .replaceAll('href="/', () => `href="${siteUrl}/`));
}

export function renderFeed({ site }) {
  const base = `${site.url}${site.baseurl ?? ''}`;
  // Keep the legacy limit before filtering out non-post layouts.
  const entries = site.posts.slice(0, 10)
    .filter(post => post.layout === 'post')
    .map(post => {
      const url = escapeXml(`${base}${post.url}`);
      return `
    <entry>
      <id>${url}</id>
      <title>${escapeXml(post.title)}</title>
      <updated>${escapeXml(post.date)}</updated>

      <link rel="alternate" href="${url}" />
      <summary>${escapeXml(post.excerpt)}</summary>
      <content type="html"><![CDATA[
        ${absolutePostContent(post.content, site.url)}
      ]]></content>
    </entry>
  `;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(site.url)}/</id>
  <title>${escapeXml(site.title)}</title>
  <link rel="self" href="${escapeXml(base)}/feed.xml" />
  <icon>${escapeXml(base)}/favicon.png</icon>
  <subtitle>${escapeXml(site.description)}</subtitle>
  <updated>${escapeXml(site.time)}</updated>
  <author>
    <name>${escapeXml(site.author)}</name>
  </author>

  ${entries.join('')}
</feed>`;
}

export function renderLinksFeed({ site }) {
  const base = escapeXml(`${site.url}${site.baseurl ?? ''}`);
  const entries = site.links.slice(0, 100).map(link => {
    const url = escapeXml(link.url);
    const title = escapeXml(link.title);
    const note = escapeXml(link.note);
    const content = `<a href="${url}">${title}</a>
        ${link.note ? `<p>${note}</p>` : ''}`;
    return `
    <entry>
      <id>${url}</id>
      <title>${title}</title>
      <updated>${escapeXml(link.date)}T12:00:00Z</updated>
      <link rel="alternate" href="${url}" />
      ${link.note ? `<summary>${note}</summary>` : ''}
      <content type="html"><![CDATA[
        ${cdata(content)}
      ]]></content>
    </entry>
  `;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(site.url)}/links/</id>
  <title>${escapeXml(site.title)} — Links</title>
  <link rel="self" href="${base}/links/feed.xml" />
  <link rel="alternate" href="${base}/links/" />
  <icon>${base}/favicon.png</icon>
  <subtitle>Interesting stuff from around the internet</subtitle>
  <updated>${escapeXml(site.time)}</updated>
  <author>
    <name>${escapeXml(site.author)}</name>
  </author>

  ${entries.join('')}
</feed>`;
}
