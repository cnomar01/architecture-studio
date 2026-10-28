const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./load-ts.cjs");
const helper = loadTs("lib/server/ownerEmailMigration.ts", { "./db": {} });

test("owner email migration token uses strict constant-time matching", () => {
  const previous = process.env.OWNER_EMAIL_MIGRATION_TOKEN;
  process.env.OWNER_EMAIL_MIGRATION_TOKEN = "a".repeat(64);
  try {
    assert.equal(helper.matchesOwnerEmailMigrationToken("a".repeat(64)), true);
    assert.equal(helper.matchesOwnerEmailMigrationToken("b".repeat(64)), false);
    assert.equal(helper.matchesOwnerEmailMigrationToken("short"), false);
  } finally {
    if (previous === undefined) delete process.env.OWNER_EMAIL_MIGRATION_TOKEN;
    else process.env.OWNER_EMAIL_MIGRATION_TOKEN = previous;
  }
});
