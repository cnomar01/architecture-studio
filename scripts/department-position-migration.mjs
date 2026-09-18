import process from "node:process";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
});

const departments = [
  ["DEP-001", "ARC", "Architecture"],
  ["DEP-002", "INT", "Interior Design"],
  ["DEP-003", "ENG", "Engineering"],
  ["DEP-004", "EXE", "Execution"],
  ["DEP-005", "OPS", "Operations"],
  ["DEP-006", "FIN", "Finance"],
  ["DEP-007", "BD", "Business Development"],
  ["DEP-008", "PRC", "Procurement"],
  ["DEP-009", "QA", "Quality & Safety"],
];

const positions = [
  ["POS-001", "DEP-001", "SARCH", "Senior Architect"],
  ["POS-002", "DEP-001", "ARCH", "Architect"],
  ["POS-003", "DEP-001", "JARCH", "Junior Architect"],
  ["POS-004", "DEP-001", "AINTERN", "Architectural Intern"],

  ["POS-005", "DEP-002", "SINT", "Senior Interior Designer"],
  ["POS-006", "DEP-002", "INTDES", "Interior Designer"],
  ["POS-007", "DEP-002", "3DV", "3D Visualizer"],

  ["POS-008", "DEP-003", "STR", "Structural Engineer"],
  ["POS-009", "DEP-003", "MEP", "MEP Engineer"],
  ["POS-010", "DEP-003", "SITEENG", "Site Engineer"],

  ["POS-011", "DEP-004", "PM", "Project Manager"],
  ["POS-012", "DEP-004", "SM", "Site Manager"],
  ["POS-013", "DEP-004", "FOREMAN", "Foreman"],
  ["POS-014", "DEP-004", "QS", "Quantity Surveyor"],

  ["POS-015", "DEP-005", "OM", "Operations Manager"],
  ["POS-016", "DEP-005", "COORD", "Operations Coordinator"],
  ["POS-017", "DEP-005", "ADMIN", "Administrator"],

  ["POS-018", "DEP-006", "ACC", "Accountant"],
  ["POS-019", "DEP-006", "FC", "Financial Controller"],

  ["POS-020", "DEP-007", "BDM", "BD Manager"],
  ["POS-021", "DEP-007", "CR", "Client Relations"],

  ["POS-022", "DEP-008", "PROC", "Procurement Specialist"],

  ["POS-023", "DEP-009", "QAQC", "QA/QC Engineer"],
  ["POS-024", "DEP-009", "HSE", "HSE Engineer"],
];

try {
  console.log("Starting Department / Position migration...");

  // Departments
  await pool.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL UNIQUE,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Positions
  await pool.query(`
    CREATE TABLE IF NOT EXISTS positions (
      id TEXT PRIMARY KEY,
      department_id TEXT NOT NULL
        REFERENCES departments(id)
        ON DELETE CASCADE,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (department_id, name),
      UNIQUE (department_id, code)
    );
  `);

  // Users additions — preserve existing users table
  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS department_id TEXT;
  `);

  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS position_id TEXT;
  `);

  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS avatar_url TEXT;
  `);

  // Foreign keys only if they don't already exist
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_department_id_fkey'
      ) THEN
        ALTER TABLE users
          ADD CONSTRAINT users_department_id_fkey
          FOREIGN KEY (department_id)
          REFERENCES departments(id)
          ON DELETE SET NULL;
      END IF;
    END
    $$;
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_position_id_fkey'
      ) THEN
        ALTER TABLE users
          ADD CONSTRAINT users_position_id_fkey
          FOREIGN KEY (position_id)
          REFERENCES positions(id)
          ON DELETE SET NULL;
      END IF;
    END
    $$;
  `);

  // Seed departments
  for (const [id, code, name] of departments) {
    await pool.query(
      `
      INSERT INTO departments (id, code, name, active)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (id)
      DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        active = true,
        updated_at = NOW()
      `,
      [id, code, name]
    );
  }

  // Seed positions
  for (const [id, departmentId, code, name] of positions) {
    await pool.query(
      `
      INSERT INTO positions (
        id,
        department_id,
        code,
        name,
        active
      )
      VALUES ($1, $2, $3, $4, true)
      ON CONFLICT (id)
      DO UPDATE SET
        department_id = EXCLUDED.department_id,
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        active = true,
        updated_at = NOW()
      `,
      [id, departmentId, code, name]
    );
  }

  console.log("");
  console.log("Migration completed successfully.");
  console.log(`Departments: ${departments.length}`);
  console.log(`Positions: ${positions.length}`);
} catch (error) {
  console.error("");
  console.error("MIGRATION FAILED:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}