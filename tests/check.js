// Static checks for the portfolio site.
// Verifies every required section/anchor exists and all local asset
// references (css, js, images) point at files that exist in src/.
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src");
const html = fs.readFileSync(path.join(SRC, "index.html"), "utf8");

let failures = 0;
const check = (cond, label) => {
  if (!cond) { console.error("FAIL:", label); failures++; }
  else { console.log("ok:", label); }
};

// Required section anchors (reel flow: hero → about → skills → work →
// learning → experience → achievements → contact)
["about", "skills", "work", "learning", "experience", "achievements", "contact"].forEach((id) =>
  check(html.includes(`id="${id}"`), `section #${id} present`));

// Nav links match sections
["#about", "#skills", "#work", "#experience", "#achievements", "#contact"].forEach((href) =>
  check(html.includes(`href="${href}"`), `nav link ${href} present`));

// Strip HTML comments before scanning so doc-comments don't fake refs
const scannable = html.replace(/<!--[\s\S]*?-->/g, "");

// Local asset references resolve to real files
const refs = [...scannable.matchAll(/(?:href|src)="([^"#]+)"/g)]
  .map((m) => m[1])
  .filter((r) => !r.startsWith("http") && !r.startsWith("data:") && !r.startsWith("mailto:") && !r.startsWith("#"));
check(refs.length > 0, "has local asset references");
refs.forEach((r) =>
  check(fs.existsSync(path.join(SRC, r)), `asset exists: ${r}`));

// No external RESOURCE loads (scripts/styles/images) — self-hosted purity.
// Anchor hrefs to LinkedIn/GitHub are fine.
const extRes = [...scannable.matchAll(/<(?:script|link|img)[^>]*(?:href|src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
check(extRes.length === 0, `no external resources (found: ${extRes.join(", ") || "none"})`);

// Contact facts present
check(html.includes("prajwaldas.io@gmail.com"), "contact email present");
check(html.includes("linkedin.com/in/prajwal-das"), "linkedin link present");
check(html.includes("Prajwal Premdas"), "name present");

// JS wires the periodic table, family filters, the ID card flip,
// the work panels, the journey timeline, and the achievements strip
const js = fs.readFileSync(path.join(SRC, "app.js"), "utf8");
check(js.includes("ELEMENTS"), "periodic table data present");
check(js.includes("FAMILIES"), "family filter tabs present");
check(js.includes("idcard"), "ID card flip present");
check(js.includes("PROJECTS"), "work panels data present");
check(js.includes("STOPS"), "journey timeline data present");
check(js.includes("achStrip"), "achievements strip present");

// Self-hosted serif font present (no external font loads)
check(fs.existsSync(path.join(SRC, "fonts", "Fraunces-VF.woff2")), "serif font present");
check(html.includes("Fraunces-VF.woff2"), "font preloaded");

if (failures) { console.error(`\n${failures} check(s) failed`); process.exit(1); }
console.log("\nAll checks passed.");
