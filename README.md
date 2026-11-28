The source code for https://frantic.im/

Build with `./scripts/build`, or run `node scripts/make.js --dev` to serve
and live-reload content and templates on port 9099.

Posts and notes use Markdown with YAML front matter. Layouts, partials,
and dynamic pages are plain `.js` files in `layouts/`, `includes/`, and
`pages/`. The builder provides the `html` tag without an import. It escapes
interpolations by default; use `html.raw()` only for trusted markup.