#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { execSync } = require("child_process");
const yaml = require("./lib/js-yaml.min");
const hljs = require("./lib/highlight.min");
const MarkdownIt = require("./lib/markdown-it.min");
const { Liquid } = require("./lib/liquid.browser.umd");

const md = new MarkdownIt({
  html: true,
  typographer: true,
  xhtmlOut: true,
  highlight: (code, language) => {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value;
      } catch (__) { }
    }
    return "";
  },
});

const liquid = new Liquid({
  fs: {
    readFileSync: (file) => fs.readFileSync(file, "utf8"),
    existsSync: (file) => fs.existsSync(file),
    resolve: (root, file, ext) => path.resolve(root, ext ? file + ext : file),
  },
  root: path.resolve(__dirname, "..", "_includes/"),
  dynamicPartials: false,
});

liquid.registerFilter("group_by_year", (posts) => {
  const items = new Map();
  for (const post of posts) {
    const date = post.date.split("-")[0];
    if (!items.has(date)) {
      items.set(date, []);
    }
    items.get(date).push(post);
  }

  return [...items.entries()].map(([name, items]) => ({ name, items }));
});

liquid.registerFilter("sample", (posts, num) => {
  const shuffled = [...posts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Number(num));
});

function inferFromFileName(fileName) {
  const basename = path.basename(fileName).split(".")[0];
  const match = basename.match(/^(\d\d\d\d-\d\d-\d\d)-(.*)$/);
  if (!match) {
    return { url: basename };
  }
  return {
    url: "/" + match[2],
    date: match[1] + "T12:00:00+00:00",
  };
}

function load(fileName) {
  const content = fs.readFileSync(fileName, "utf8");
  const format = fileName.endsWith(".md")
    ? (content) => md.render(content)
    : (content) => content;
  if (content.startsWith("---\n")) {
    const [_, rawHeader, rawBody] = content.split(/^---$/gm);
    return {
      header: {
        ...inferFromFileName(fileName),
        ...yaml.load(rawHeader),
      },
      body: format(rawBody.trim()),
    };
  } else {
    return {
      header: {},
      body: format(content),
    };
  }
}

function render(fileName, data = {}) {
  let {
    header: { layout, ...page },
    body,
  } = load(fileName);

  data = { ...data, page: { ...page, ...data.page } };
  body = liquid.parseAndRenderSync(body, data);

  if (layout) {
    return render(path.join(__dirname, "..", "_layouts", layout + ".html"), {
      ...data,
      content: body,
    });
  }

  return body;
}

const site = yaml.load(fs.readFileSync("_config.yml", "utf8"));
site.time = new Date().toISOString();

function rebuildPostsList() {
  site.posts = fs
    .readdirSync("_posts")
    .map((file) => {
      const { header, body } = load(path.join("_posts", file));
      return { ...header, content: body };
    })
    .sort((p1, p2) => p2.date.localeCompare(p1.date));
}

function renderFile(dir, file) {
  if (![".html", ".md", ".txt", ".xml"].includes(path.extname(file))) {
    return;
  }

  const source = path.join(dir, file);
  process.stdout.write(`Building ${source}\n`);
  const {
    header: { url },
  } = load(source);

  const destination = [".md", ".html"].includes(path.extname(file))
    ? path.join("_build", url, "index.html")
    : path.join("_build", file);

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, render(path.join(dir, file), { site }));
}

function renderDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    renderFile(dir, file);
  }
}

rebuildPostsList();
renderDir("_posts");
renderDir("pages");

if (process.argv[2] == "--dev") {
  const folders = ["_drafts", "_includes", "_layouts", "_posts", "pages"];
  for (const folder of folders) {
    fs.watch(folder, (ev, file) => {
      if (ev === "change") {
        try {
          rebuildPostsList();
          renderDir("_posts");
          renderDir("pages");
        } catch (e) {
        }
      }
    });
  }

  http
    .createServer((req, res) => {
      let fileName = __dirname + "/../_build" + req.url;
      if (fs.statSync(fileName).isDirectory()) {
        fileName += "/index.html";
      }
      fs.readFile(fileName, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    })
    .listen(9099);

  console.log("Listening on http://localhost:9099/");
  console.log("");
  console.log("Things you can do:");
  console.log("  n [title] - Create a new file in _posts");
  console.log("  p         - Commit & push to GitHub");
  console.log("  e         - Edit in VSCode");
  console.log("  w         - Open in browser");
  console.log("  d         - Show git diff");
  console.log("  f         - Download images from Figma");
  console.log("");

  process.stdin.on("data", (data) => {
    const command = data.toString("utf-8").trim();

    if (command.startsWith("n ")) {
      const name = command.substring(2);
      const slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-zA-Z0-9 -]/g, "");
      console.log(`New post "${name}": http://localhost:9099/${slug}`);
      const date = new Date();
      const prefix = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
      const content = fs.readFileSync(
        path.join(__dirname, ".post-template"),
        "utf-8"
      );
      const fileName = `_posts/${prefix}-${slug}.md`;
      fs.writeFileSync(fileName, content.replace("$TILE", name));
      console.log("Created", fileName);
      execSync(`code ${fileName}`);
    } else if (command === "e") {
      execSync(`code .`);
    } else if (command === "d") {
      execSync(`git diff -w --color >&2`);
    } else if (command === "w") {
      execSync(`open http://localhost:9099/blog`);
    } else if (command === "f") {
      download();
    } else if (command === "p") {
      console.log("Publishing");
      execSync(`git add -A .`);
      execSync(`git commit -m "Publishing changes"`);
      execSync(`git push origin master`);
      console.log("https://github.com/frantic/frantic.github.io/actions");
      console.log("Done! https://frantic.im/");
    }
  });
}

function figma(url) {
  const figmaToken = process.env.FIGMA_TOKEN;

  return new Promise((resolve, reject) => {
    https.get(
      {
        path: url,
        host: "api.figma.com",
        headers: { "X-Figma-Token": figmaToken },
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Figma replied with status code ${res.statusCode}`));
        }

        const chunks = [];
        res.on("data", (data) => chunks.push(data));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }
    );
  }).then((data) => JSON.parse(data.toString()));
}

async function store(url, fileName) {
  return new Promise((resolve, reject) => {
    console.log("Downloading", url, "to", fileName);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Non-ok status code ${res.statusCode}`));
      }

      const file = fs.createWriteStream(fileName);
      res.pipe(file);
      res.on("end", () => resolve());
      res.on("error", reject);
    });
  });
}

async function download() {
  console.log("Downloading images from Figma");
  const file = await figma("/v1/files/Nf5B58hyoTotF6XCs1AjHD?depth=2");
  const frames = {};
  const page1 = file.document.children[0];
  for (const frame of page1.children) {
    frames[frame.id] = frame.name;
  }

  const ids = Object.keys(frames).join(",");
  const exports = await figma(
    `/v1/images/Nf5B58hyoTotF6XCs1AjHD?scale=2&ids=${ids}`
  );

  console.log(frames, exports);

  await Promise.all(
    Object.entries(frames).map(([id, name]) =>
      store(exports.images[id], path.join("figma", name + ".png"))
    )
  );

  const buildScript = path.join(__dirname, "build");
  execSync(buildScript);
}
