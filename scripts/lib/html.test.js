const assert = require("node:assert/strict");
const test = require("node:test");
const html = require("./html");

test("escapes interpolations but not the literal markup", () => {
  const label = `Alex's "A&B" <post>`;
  assert.equal(
    String(html`<a title="${label}">${label}</a>`),
    '<a title="Alex&#39;s &quot;A&amp;B&quot; &lt;post&gt;">' +
      "Alex&#39;s &quot;A&amp;B&quot; &lt;post&gt;</a>"
  );
});

test("composes fragments, arrays, and optional values without double escaping", () => {
  const items = ["A & B", "<C>"].map(label => html`<li>${label}</li>`);
  assert.equal(
    String(html`<ul>${items}${null}${undefined}${html.raw("<li>D</li>")}</ul>`),
    "<ul><li>A &amp; B</li><li>&lt;C&gt;</li><li>D</li></ul>"
  );
  assert.equal(String(html`${String(items[0])}`), "&lt;li&gt;A &amp;amp; B&lt;/li&gt;");
});
