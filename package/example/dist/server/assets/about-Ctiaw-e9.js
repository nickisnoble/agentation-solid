import { ssr, ssrHydrationKey, ssrStyleProperty } from "solid-js/web";
var _tmpl$ = ["<div", '><h1 style="', '">About</h1><p style="', '">This is a second page to verify the toolbar persists across client-side navigation.</p><div style="', '"><h2 style="', '">What is Agentation?</h2><p style="', '">A floating toolbar for annotating web pages and collecting structured feedback for AI coding agents. Click elements to annotate them, add comments, and export structured feedback that agents can act on.</p></div></div>'];
function AboutPage() {
  return ssr(_tmpl$, ssrHydrationKey(), ssrStyleProperty("font-size:", "2rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "#666") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("background:", "#fff") + ssrStyleProperty(";border:", "1px solid #eee") + ssrStyleProperty(";border-radius:", "12px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";box-shadow:", "0 1px 3px rgba(0,0,0,0.06)"), ssrStyleProperty("font-size:", "1.125rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";margin-bottom:", "0.75rem"), ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "#444") + ssrStyleProperty(";line-height:", "1.7"));
}
export {
  AboutPage as component
};
