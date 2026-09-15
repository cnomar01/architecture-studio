import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "app/layout.tsx", "app/error.tsx", "app/global-error.tsx", "app/not-found.tsx",
  "app/api/health/route.ts", "app/api/leads/route.ts", "app/robots.ts", "app/sitemap.ts",
  "next.config.ts", "package.json",
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error("Production QA failed. Missing:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}
console.log(`Production QA passed: ${required.length} required files verified.`);
