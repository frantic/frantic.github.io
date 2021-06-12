#!/usr/bin/env node

// TODO: ]]> will break RSS

const fs = require('fs');
const path = require('path');
const yaml = require('./lib/js-yaml.min');
const hljs = require('./lib/highlight.min');
const MarkdownIt = require('./lib/markdown-it.min');
const {Liquid} = require('./lib/liquid.browser.umd');

const md = new MarkdownIt({
  html: true,
  typographer: true,
  xhtmlOut: true,
  highlight: (code, language) => {
   if (language && hljs.getLanguage(language)) {
     try {
       return hljs.highlight(code, {language}).value;
     } catch (__) {}
   }
   return '';
  },
});

const liquid = new Liquid({
  fs: {
    readFileSync: (file) => fs.readFileSync(file, 'utf8'),
    existsSync: (file) => fs.existsSync(file),
    resolve: (root, file, ext) => path.resolve(root, ext ? file + ext : file),
  },
  root: path.resolve(__dirname, '..', '_includes/'),
  dynamicPartials: false,
});

liquid.registerTag('post_url', {
    parse: function(tagToken, remainTokens) {
        this.file = tagToken.args; // the name of the markdown file to link to
    },
    render: async function(ctx) {
        return this.file; // TODO: Proper implementation
    }
});

liquid.registerFilter('group_by_year', (posts) => { 
  const items = new Map();
  for (const post of posts) {
    const date = post.date.split('-')[0];
    if (!items.has(date)) {
      items.set(date, []);
    }
    items.get(date).push(post);
  }

  return [...items.entries()].map(([name, items]) => ({name, items}));
})

function inferFromFileName(fileName) {
  const basename = path.basename(fileName).split('.')[0];
  const match = basename.match(/^(\d\d\d\d-\d\d-\d\d)-(.*)$/);
  if (!match) {
    return { url: basename };
  }
  return {
    url:  '/' + match[2],
    date: match[1] + 'T12:00:00+00:00',
  };
}

function load(fileName) {
  const content = fs.readFileSync(fileName, 'utf8');
  const format = fileName.endsWith('.md') ? (content) => md.render(content) : (content) => content;
  if (content.startsWith('---\n')) {
    const [_, rawHeader, rawBody] = content.split(/^---$/gm);
    return {
      header: {
        ...inferFromFileName(fileName),
        ...yaml.load(rawHeader),
      },
      body: format(rawBody.trim()),
    }
  } else {
    return {
      header: {},
      body: format(content),
    }
  }
}

function render(fileName, data = {}) {
  let {header: {layout, ...page}, body} = load(fileName);
  
  data = {...data, page: {...page, ...data.page}};
  body = liquid.parseAndRenderSync(body, data);

  if (layout) {
    return render(path.join(__dirname, '..', '_layouts', layout + '.html'), {...data, content: body});
  }

  return body;
}

const site = yaml.load(fs.readFileSync('_config.yml', 'utf8'));
site.time = new Date().toISOString();

site.posts = fs.readdirSync('_posts')
  .map(file => {
    const {header, body} = load(path.join('_posts', file));
    return {...header, content: body};
  })
  .sort((p1, p2) => p2.date.localeCompare(p1.date));

function renderDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (!['.html', '.md', '.txt', '.xml'].includes(path.extname(file))) {
      continue;
    }

    const source = path.join(dir, file);
    process.stdout.write(`Building ${source}\n`);
    const {header: {url}} = load(source);

    const destination = ['.md', '.html'].includes(path.extname(file)) 
      ? path.join('_build', url, 'index.html')
      : path.join('_build', file);

    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.writeFileSync(destination, render(path.join(dir, file), {site}));
  }
}

renderDir('_posts');
renderDir('pages');