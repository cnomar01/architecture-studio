const required = ["DATABASE_URL"];
const missing = required.filter((key) => !process.env[key]);

const warnings = [];
if (process.env.NODE_ENV === "production" && process.env.DATABASE_SSL === "false") {
  warnings.push("DATABASE_SSL=false: production database traffic should use TLS.");
}
if (process.env.NODE_ENV === "production" && !process.env.S3_BUCKET) {
  warnings.push("S3_BUCKET is not configured: file uploads will be unavailable.");
}

if (process.env.NODE_ENV === "production" && missing.length) {
  console.error(`Missing required production environment variable(s): ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Production preflight passed.");
for (const warning of warnings) console.warn(`Production warning: ${warning}`);
