The source code for https://frantic.im/

Build with `./scripts/build`, or run `node scripts/make.js --dev` to serve
and live-reload content on port 9099. Restart the dev server after editing
JavaScript renderers.

Posts and notes use Markdown with YAML front matter. Layouts, partials,
and dynamic pages are plain JavaScript render functions in `layouts/`,
`includes/`, and `pages/`. The `html` tag escapes interpolations; use
`raw()` only for trusted markup.