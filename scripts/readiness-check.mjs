import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
try {
  const result = await pool.query(`SELECT
    EXISTS(SELECT 1 FROM integration_credentials WHERE key='google-mail') AS gmail_authorization_saved,
    (SELECT count(*) FROM users WHERE active=true) AS active_users,
    (SELECT count(*) FROM projects) AS server_projects,
    (SELECT count(*) FROM tasks) AS server_tasks,
    to_regclass('password_reset_tokens') IS NOT NULL AS password_reset_schema,
    to_regclass('auth_rate_limits') IS NOT NULL AS rate_limit_schema`);
  console.log(JSON.stringify(result.rows[0], null, 2));
  console.log(JSON.stringify({ storageConfigured: Boolean(process.env.S3_BUCKET && process.env.S3_REGION), whatsappAutomaticEnabled: process.env.WHATSAPP_ALLOW_SEND === "true" }));
} finally { await pool.end(); }
