import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = fs.readFileSync(new URL("../lib/core/authStore.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function loginWith(response) {
  const context = { exports: {}, fetch: async () => response };
  vm.runInNewContext(compiled, context);
  return context.exports.databaseLogin(" test@example.invalid ", "test-password");
}

test("successful authentication returns the server user", async () => {
  const user = { id: "test-user", role: "Owner" };
  assert.equal(await loginWith({ ok: true, json: async () => ({ user }) }), user);
});

test("credential rejection retains its specific message", async () => {
  await assert.rejects(loginWith({ ok: false, status: 401, json: async () => ({}) }), /Invalid email or password/);
});

test("non-JSON server failure is not reported as incorrect credentials", async () => {
  await assert.rejects(loginWith({ ok: false, status: 502, json: async () => { throw new SyntaxError(); } }), /temporarily unavailable/);
});

test("server-provided errors are preserved", async () => {
  await assert.rejects(loginWith({ ok: false, status: 400, json: async () => ({ error: "Email and password are required." }) }), /Email and password are required/);
});

test("malformed successful response is reported as a service problem", async () => {
  await assert.rejects(loginWith({ ok: true, json: async () => ({}) }), /invalid response/);
});
