---
layout: post
title: Replacing Jekyll for my blog
image: /figma/og_replace_jekyll.png
excerpt: How I replaced Jekyll with 200 lines of JavaScript
tags:
  - jekyll
---

I [started this blog](/hello-world) in 2016. At the time, "static blogging" was becoming very popular and getting started was easy. I simply used [Jekyll](https://jekyllrb.com/) with GitHub pages.

But then I got a new laptop and the simplicity turned into a nighmare. A new Ruby version, an incompatible Jekyll gem version, cryptic C++ compilation errors of one of Jekyll's dependencies. I've tried RVM, I've tried Bundler, I've tried Docker.

At this point, blogging felt more like fighting with the tools.

After I upgraded to M1 Mac, the setup broke again and I decided to take a different path.

I looked for Jekyll alternatives but didn't find anything that I liked. Here's what I need:

- Easy to install, indeally a single binary (supporting ARM & x86)
- Compatible with my Jekyll templates
- Hackable, without the need to install compiler toolchain

Sometime in 2021 I re-implemented parts of Jekyll I cared about in JavaScript in ~200 lines of code. It only needs NodeJS, all the dependencies are vendored-in (so there's no package.json, yarn, npm, pnpn or whatever). It only uses JS syntax that's been stable for years, so there's no TypeScript or Babel needed.

I got to keep all the custom Jekyll theme files. Even the fancy `related.html` template that renders "Related posts" section at the bottom works without changes!

On top of that, I added a few features that make it easier for me to write. I start by typing `blog` in my terminal, and I see this:

```
$ blog
...
Building pages/subscribe.md
Building pages/talks.html
Listening on http://localhost:9099/

Things you can do:
  n [title] - Create a new file in _posts
  p         - Commit & push to GitHub
  e         - Edit in VSCode
  w         - Open in browser
```

This little menu let's me take the most common actions right from the console. For example, the first command converts "Fancy Blog Title" into "2022-08-08-fancy-blog-title.md", creates this file in the right place from the template and opens it in the editor.

It's amazing how much these little inconveniences prevented me from writing!

However, I can't say I'm completely happy with the static blog setup. Here's a few areas for improvement:

- Make it easier to insert images. Currently I have to put the png in the right place and manually link it from the blog's content. When image is not found I get no errors. There's no way to cleanup unused images. I wish I could just Cmd+V an image from the clipboard or use a tag that fetches it directly from Figma.
- Automatically generate OG image. The social previews are very important for attracting attention and branding. I want my blog engine to generate these based on post's title during the build phase.
- Validate links. Currently the blog can be full of invalid links and I don't even know it. At the build time, it should make sure that at least local links are working.
- Private sections & posts. I have plenty of topics I would like to share only with a limited set of subscribers. I want to wrap parts of the posts in `<private>` tag and have it hidden from the public internet. This also includes "preview" posts I can share with some friends
- Grammarly & Hemingway App integration. When the post is ready, I want a simple, automated way to send it to an AI that can help me fix typos and adjust my writing style.

At this time, I'm not planning to turn this into a standalone product. I like that it's just a part of this blog and I can keep it very simple and very specific to my needs.
