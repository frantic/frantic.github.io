const { footer, subscribe } = require('../includes/partials');
const { renderFeed, renderLinksFeed } = require('./feeds');

const talks = [
  {
    title: 'CS47: Managing Application State with Redux',
    type: 'slides',
    location: 'Stanford University',
    date: '2018-11-01',
    url: '/cs47/',
  },
  {
    title: 'Building stellar user experiences with React Native',
    type: 'video',
    location: 'Chain React',
    date: '2017-07-18',
    url: 'https://www.youtube.com/watch?v=fjS5ssBn3fA',
  },
  {
    title: 'Software Development in Silicon Valley',
    type: 'video',
    location: 'Kyiv Polytechnic Institute',
    date: '2016-12-03',
    url: 'https://www.youtube.com/watch?v=5n9vuCuKA-Q',
  },
  {
    title: 'React Native Intro Class',
    type: 'video',
    location: 'Airbnb',
    date: '2016-09-13',
    url: 'https://www.youtube.com/watch?v=I8b0v0uFXLs',
  },
  {
    title: 'React Native: Under the Hood',
    type: 'video',
    location: 'You Gotta Love Frontend Conference',
    date: '2015-08-12',
    url: 'https://www.youtube.com/watch?v=hDviGU-57lU',
  },
  {
    title: 'React Native Tutorial',
    type: 'video',
    location: 'React NYC Meetup',
    date: '2015-03-26',
    url: 'https://speakerdeck.com/frantic/react-native-tutorial-nyc-15',
  },
];

function talkDate(date) {
  const [year, month, day] = date.split('-');
  return `${Number(month)}/${Number(day)}/${year}`;
}

const renderBlog = ({ site }) => html`<p>All ${site.posts.length} posts since 2016. Starred (★) are my favorites. See also blog <a href="https://u.frantic.im/share/PdxrhczkbRQVIp61/frantic.im">analytics</a>.</p>

<div class="related-posts">
  <ul>
    ${site.posts.map(post => html`
    <li>
      <a href="${post.url}">${post.title}</a>${post.featured ? html` <span class="featured-star" title="Featured">★</span>` : null}
    </li>
    `)}
  </ul>
</div>

${subscribe()}

${footer({ site })}`;

const renderLinks = ({ site }) => html`<p>Websites and blog posts I found interesting. You can subscribe via a separate <a href="/links/feed.xml">RSS feed</a>.</p>

<ul class="links-list">
  ${site.links.map(link => html`
  <li class="links-item">
    <a href="${link.url}" target="_blank" rel="noopener">${link.title}</a>
    ${link.note ? html`<span class="links-note">— ${link.note}</span>` : null}
    <span class="links-meta">Added <time>${link.date.slice(0, 10)}</time> · ${link.domain}</span>
  </li>
  `)}
</ul>

${footer({ site })}`;

const renderTalks = ({ page }) => html`<p>I used to enjoy traveling and speaking at conferences.</p>

<ul>
  ${page.talks.map(talk => html`
  <li>
    <a href="${talk.url}">${talk.title}</a>
    <span class="date">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
        />
      </svg>
      ${talk.location} ${talkDate(talk.date)}</span
    >
  </li>
  `)}
</ul>`;

const renderRobots = ({ site }) => `# Don't crawl unpublished posts
User-agent: *
${site.posts.filter(post => post.layout === 'draft').map(post => `Disallow: ${post.url}\n`).join('')}`;

const dynamicPages = [
  {
    filename: 'blog.html',
    page: { url: '/blog/', title: 'Blog' },
    layout: 'page',
    render: renderBlog,
  },

  {
    filename: 'feed.xml',
    page: { url: 'feed' },
    layout: null,
    render: renderFeed,
  },
  {
    filename: 'links-feed.xml',
    page: { url: '/links/feed.xml' },
    layout: null,
    render: renderLinksFeed,
  },
  {
    filename: 'links.html',
    page: {
      url: '/links/',
      title: 'Links',
      feed: '/links/feed.xml',
      feed_title: 'frantic.im — Links',
    },
    layout: 'page',
    render: renderLinks,
  },
  {
    filename: 'robots.txt',
    page: { url: 'robots.txt' },
    layout: null,
    render: renderRobots,
  },
  {
    filename: 'talks.html',
    page: { url: '/talks/', title: 'Talks', talks },
    layout: 'post',
    render: renderTalks,
  },
];

const markdownRenderers = {
  index: ({ site, content }) => html`${content}<div class="related-posts">
  <ul>
    ${site.posts.filter(post => post.featured).map(post => html`
    <li>
       <a href="${post.url}">${post.title}</a>
    </li>
    `)}
  </ul>
</div>
<p><a href="/blog">View all</a> ${site.posts.length} posts, <a href="/subscribe">subscribe</a> or\u00a0check out blog <a href="https://u.frantic.im/share/PdxrhczkbRQVIp61/frantic.im">analytics</a>.</p>
${footer({ site })}`,
  subscribe: ({ site, content }) => html`${subscribe()}${content}${footer({ site })}`,
};

module.exports = { dynamicPages, markdownRenderers };
