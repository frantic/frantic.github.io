const entities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

class Fragment {
  #markup;

  constructor(markup) {
    this.#markup = markup;
  }

  toString() {
    return this.#markup;
  }
}

// Only for trusted markup, such as the output of our Markdown renderer.
export function raw(markup) {
  return new Fragment(String(markup));
}

function interpolate(value) {
  if (value == null) return "";
  if (value instanceof Fragment) return String(value);
  if (Array.isArray(value)) return value.map(interpolate).join("");
  return String(value).replace(/[&<>"']/g, char => entities[char]);
}

// Interpolations are escaped as text or for quoted attributes. For other
// contexts (scripts, styles, URLs), handle the value at the call site.
export function html(strings, ...values) {
  return raw(strings.reduce(
    (markup, chunk, i) => markup + interpolate(values[i - 1]) + chunk,
    ""
  ));
}
