const required = ["DATABASE_URL"];
const missing = required.filter((key) => !process.env[key]);

if (process.env.NODE_ENV === "production" && missing.length) {
  console.error(`Missing required production environment variable(s): ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Production preflight passed.");
