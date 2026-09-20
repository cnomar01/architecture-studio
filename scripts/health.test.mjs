import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = fs.readFileSync(new URL("../app/api/health/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

async function health(env, query) {
  const context = {
    exports: {}, process: { env },
    require(name) {
      if (name === "next/server") return { NextResponse: { json: (body, options) => ({ body, ...options }) } };
      if (name === "@/lib/server/db") return { query };
      throw new Error(`Unexpected import: ${name}`);
    },
  };
  vm.runInNewContext(compiled, context);
  return context.exports.GET();
}

test("missing mandatory database configuration fails health check", async () => {
  const result = await health({}, () => { throw new Error("Should not query without configuration"); });
  assert.equal(result.status, 503);
  assert.equal(result.body.ok, false);
  assert.equal(result.body.database, "not_configured");
});

test("connected database passes health check", async () => {
  const result = await health({ DATABASE_URL: "configured" }, async () => ({}));
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.database, "connected");
});

test("unreachable database fails health check", async () => {
  const result = await health({ DATABASE_URL: "configured" }, async () => { throw new Error("Unavailable"); });
  assert.equal(result.status, 503);
  assert.equal(result.body.ok, false);
  assert.equal(result.body.database, "error");
});
