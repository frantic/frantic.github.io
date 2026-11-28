// Post-processing applied to rendered Markdown. The same rules live in the
// blog notes app (blogapp/srv/render.go) so previews match the site.

// An image followed by a line of text becomes a figure with a caption:
//   ![alt](src)
//   Caption text
function figureCaptions(html) {
  return html.replace(
    /<p>(<img [^>]*>)(?:<br ?\/?>)?\n([\s\S]*?)<\/p>/g,
    (m, img, caption) =>
      // Images on consecutive lines are not captions
      caption.trim() && !caption.includes("<img")
        ? `<figure>${img}<figcaption>${caption}</figcaption></figure>`
        : m
  );
}

const NBSP = "\u00a0";
const TAG = /<[^>]*>/g;
const SKIP = /^<(\/?)(pre|code|script|style|textarea|kbd)\b/i;
// Short words that shouldn't be left dangling at the end of a line.
const SHORT_WORD =
  /(^|[\s(\["';\u00a0])(a|an|as|and|&amp;|at|but|by|for|in|no|not|of|or|per|the|to)[ \n]+/gi;
// Dashes shouldn't start a line.
const DASH = / +(\u2014|\u2013|&mdash;|&ndash;)/g;

function typesetText(s) {
  if (!s.trim()) return s;
  // Repeat so consecutive short words ("of the") all get glued.
  for (let i = 0; i < 5; i++) {
    const next = s.replace(SHORT_WORD, `$1$2${NBSP}`);
    if (next === s) break;
    s = next;
  }
  return s.replace(DASH, `${NBSP}$1`);
}

// Glue short words to the next word and dashes to the previous one with
// non-breaking spaces, leaving code and raw blocks untouched.
function typeset(html) {
  let out = "";
  let skip = 0;
  let last = 0;
  for (const m of html.matchAll(TAG)) {
    const text = html.slice(last, m.index);
    out += skip > 0 ? text : typesetText(text);
    const tag = m[0];
    const s = tag.match(SKIP);
    if (s) {
      if (s[1] === "/") skip = Math.max(0, skip - 1);
      else if (!tag.endsWith("/>")) skip++;
    }
    out += tag;
    last = m.index + tag.length;
  }
  const rest = html.slice(last);
  return out + (skip > 0 ? rest : typesetText(rest));
}

module.exports = { typeset, figureCaptions };
