import { html } from '../scripts/lib/html.mjs';

export function header({ site }) {
  return html`<header class="site-header" data-nosnippet>
  <a href="/">
    <h1 class="site-title">frantic.im</h1>
  </a>
  <nav class="nav">
    <ul class="nav-list">
      ${(site.data?.menu ?? []).map((item) => html`
      <li><a href="${item.link}" class="nav-link">${item.name}</a></li>
      `)}
    </ul>
  </nav>
</header>
`;
}

export function footer({ site }) {
  const year = new Date(site.time).getUTCFullYear();
  return html`<footer class="site-footer">
  <div class="footer-bottom">
    <p class="footer-copyright">
      ©&nbsp;${year} Alex&nbsp;Kotliarskyi. All&nbsp;rights&nbsp;reserved.
    </p>
    <p class="footer-colophon social-links">
      <a target="_blank" href="https://x.com/alex_frantic">X</a>
      <a target="_blank" href="https://www.linkedin.com/in/alex-kotliarskyi/">LinkedIn</a>
      <a target="_blank" href="https://bsky.app/profile/frantic.im">Bluesky</a>
      <a target="_blank" href="https://github.com/frantic">GitHub</a>
    </p>
  </div>
</footer>
`;
}

export function related({ site, page }) {
  const relatedPosts = site.related?.[page.url];
  const hasRelated = relatedPosts?.length > 0;
  const posts = hasRelated
    ? relatedPosts
    : (site.posts ?? []).filter((post) => post.featured && post.url !== page.url).slice(0, 4);
  const label = hasRelated ? 'Related Posts' : 'Featured Posts';
  const entries = posts.map((post) => html`${hasRelated ? '' : '\n        '}
        <li>
          <a href="${site.baseurl}${post.url}" class="footer-link">
            ${post.title}
          </a>
        </li>
        `);

  return html`


    <div class="related-posts">
      <p class="related-posts-label">${label}</p>
      <ul>
        ${entries}
      </ul>
    </div>

${hasRelated ? '' : '  '}`;
}

export function subscribeInline({ page }) {
  return html`<form class="post-subscribe" action="https://buttondown.email/api/emails/embed-subscribe/frantic" method="post" target="popupwindow" onsubmit="window.open('https://buttondown.email/frantic', 'popupwindow')" data-umami-event="subscribe" data-umami-event-post="${page.url}">
  <p class="post-subscribe-text">Thanks for reading. If you want more, I'll email you when I write the next one. <span class="nowrap">Or use <a href="/feed.xml">RSS</a>.</span></p>
  <div class="post-subscribe-row">
    <input type="email" name="email" placeholder="your@email.com" aria-label="Email address" required />
    <button type="submit">Subscribe</button>
  </div>
</form>
`;
}

export function subscribe() {
  return html`<section class="subscribe-section">
  <div class="subscribe-content">
    <h2 class="subscribe-title">Get New Posts via Email</h2>
    <p class="subscribe-text">
      A cron job sends an email every time I publish a new blog post. Usually
      once every 2 months.
    </p>
    <form
      class="subscribe-form"
      action="https://buttondown.email/api/emails/embed-subscribe/frantic"
      method="post"
      target="popupwindow"
      onsubmit="window.open('https://buttondown.email/frantic', 'popupwindow')"
    >
      <input
        type="email"
        name="email"
        id="bd-email"
        placeholder="your@email.com"
        class="subscribe-input"
        aria-label="Email address"
      />
      <button type="submit" class="subscribe-button">Subscribe</button>
    </form>
    <p class="subscribe-footnote">
      No spam. One click to unsubscribe. Powered by
      <a href="https://buttondown.email/refer/frantic" target="_blank">
        Buttondown
      </a>
    </p>
  </div>
</section>
`;
}
