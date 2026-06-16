import { Pool } from "pg";

let pool: Pool | null = null;

// ── Connection ────────────────────────────────────────────────────────

export function getPool(): Pool {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — cannot connect to PostgreSQL");
  }
  pool = new Pool({ connectionString: url });
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// ── image_generations ─────────────────────────────────────────────────

export interface ImageGenerationRow {
  id: string;
  workspace_id: string;
  prompt: string;
  negative_prompt: string | null;
  model: string | null;
  parameters: Record<string, unknown>;
  output_path: string | null;
  status: string;
  seed: number | null;
  width: number | null;
  height: number | null;
  created_at: Date;
}

export interface CreateImageGeneration {
  id?: string;
  workspace_id?: string;
  prompt: string;
  negative_prompt?: string;
  model?: string;
  parameters?: Record<string, unknown>;
  output_path?: string;
  status?: string;
  seed?: number;
  width?: number;
  height?: number;
}

export async function createImageGeneration(
  data: CreateImageGeneration,
): Promise<ImageGenerationRow> {
  const pool = getPool();
  const result = await pool.query<ImageGenerationRow>(
    `INSERT INTO image_generations
       (id, workspace_id, prompt, negative_prompt, model, parameters, output_path, status, seed, width, height)
     VALUES
       (COALESCE($1::text, gen_random_uuid()::text), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      data.id ?? null,
      data.workspace_id ?? "default",
      data.prompt,
      data.negative_prompt ?? null,
      data.model ?? null,
      JSON.stringify(data.parameters ?? {}),
      data.output_path ?? null,
      data.status ?? "pending",
      data.seed ?? null,
      data.width ?? null,
      data.height ?? null,
    ],
  );
  return result.rows[0];
}

export async function getImageGeneration(id: string): Promise<ImageGenerationRow | null> {
  const pool = getPool();
  const result = await pool.query<ImageGenerationRow>(
    "SELECT * FROM image_generations WHERE id = $1",
    [id],
  );
  return result.rows[0] ?? null;
}

export async function listImageGenerations(opts: {
  workspace_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<ImageGenerationRow[]> {
  const pool = getPool();
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (opts.workspace_id) {
    conditions.push(`workspace_id = $${idx++}`);
    params.push(opts.workspace_id);
  }
  if (opts.status) {
    conditions.push(`status = $${idx++}`);
    params.push(opts.status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  const result = await pool.query<ImageGenerationRow>(
    `SELECT * FROM image_generations ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset],
  );
  return result.rows;
}

export async function updateImageGeneration(
  id: string,
  patch: Partial<Omit<ImageGenerationRow, "id" | "created_at">>,
): Promise<ImageGenerationRow | null> {
  const pool = getPool();
  const sets: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(patch)) {
    if (val === undefined) continue;
    if (key === "parameters") {
      sets.push(`${key} = $${idx++}`);
      params.push(JSON.stringify(val));
    } else {
      sets.push(`${key} = $${idx++}`);
      params.push(val);
    }
  }

  if (!sets.length) return getImageGeneration(id);

  params.push(id);
  const result = await pool.query<ImageGenerationRow>(
    `UPDATE image_generations SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
    params,
  );
  return result.rows[0] ?? null;
}

export async function deleteImageGeneration(id: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query("DELETE FROM image_generations WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

// ── image_sessions ────────────────────────────────────────────────────

export interface ImageSessionRow {
  id: string;
  workspace_id: string;
  title: string | null;
  mode: string | null;
  node_count: number;
  settings: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface CreateImageSession {
  id?: string;
  workspace_id?: string;
  title?: string;
  mode?: string;
  node_count?: number;
  settings?: Record<string, unknown>;
}

export async function createImageSession(data: CreateImageSession): Promise<ImageSessionRow> {
  const pool = getPool();
  const result = await pool.query<ImageSessionRow>(
    `INSERT INTO image_sessions
       (id, workspace_id, title, mode, node_count, settings)
     VALUES
       (COALESCE($1::text, gen_random_uuid()::text), $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.id ?? null,
      data.workspace_id ?? "default",
      data.title ?? "Untitled",
      data.mode ?? null,
      data.node_count ?? 0,
      JSON.stringify(data.settings ?? {}),
    ],
  );
  return result.rows[0];
}

export async function getImageSession(id: string): Promise<ImageSessionRow | null> {
  const pool = getPool();
  const result = await pool.query<ImageSessionRow>(
    "SELECT * FROM image_sessions WHERE id = $1",
    [id],
  );
  return result.rows[0] ?? null;
}

export async function listImageSessions(opts: {
  workspace_id?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<ImageSessionRow[]> {
  const pool = getPool();
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (opts.workspace_id) {
    conditions.push(`workspace_id = $${idx++}`);
    params.push(opts.workspace_id);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  const result = await pool.query<ImageSessionRow>(
    `SELECT * FROM image_sessions ${where} ORDER BY updated_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset],
  );
  return result.rows;
}

export async function updateImageSession(
  id: string,
  patch: Partial<Omit<ImageSessionRow, "id" | "created_at" | "updated_at">>,
): Promise<ImageSessionRow | null> {
  const pool = getPool();
  const sets: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(patch)) {
    if (val === undefined) continue;
    if (key === "settings") {
      sets.push(`${key} = $${idx++}`);
      params.push(JSON.stringify(val));
    } else {
      sets.push(`${key} = $${idx++}`);
      params.push(val);
    }
  }

  if (!sets.length) return getImageSession(id);

  params.push(id);
  const result = await pool.query<ImageSessionRow>(
    `UPDATE image_sessions SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
    params,
  );
  return result.rows[0] ?? null;
}

export async function deleteImageSession(id: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query("DELETE FROM image_sessions WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

// ── files ─────────────────────────────────────────────────────────────

export interface FileRow {
  id: string;
  workspace_id: string;
  service: string;
  file_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface RegisterFile {
  id?: string;
  workspace_id?: string;
  service: string;
  file_type: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  metadata?: Record<string, unknown>;
}

export async function registerFile(data: RegisterFile): Promise<FileRow> {
  const pool = getPool();
  const result = await pool.query<FileRow>(
    `INSERT INTO files
       (id, workspace_id, service, file_type, file_name, file_path, file_size, mime_type, metadata)
     VALUES
       (COALESCE($1::text, gen_random_uuid()::text), $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.id ?? null,
      data.workspace_id ?? "default",
      data.service,
      data.file_type,
      data.file_name,
      data.file_path,
      data.file_size ?? null,
      data.mime_type ?? null,
      JSON.stringify(data.metadata ?? {}),
    ],
  );
  return result.rows[0];
}

export async function getFile(id: string): Promise<FileRow | null> {
  const pool = getPool();
  const result = await pool.query<FileRow>(
    "SELECT * FROM files WHERE id = $1",
    [id],
  );
  return result.rows[0] ?? null;
}

export async function listFiles(opts: {
  workspace_id?: string;
  service?: string;
  file_type?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<FileRow[]> {
  const pool = getPool();
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (opts.workspace_id) {
    conditions.push(`workspace_id = $${idx++}`);
    params.push(opts.workspace_id);
  }
  if (opts.service) {
    conditions.push(`service = $${idx++}`);
    params.push(opts.service);
  }
  if (opts.file_type) {
    conditions.push(`file_type = $${idx++}`);
    params.push(opts.file_type);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  const result = await pool.query<FileRow>(
    `SELECT * FROM files ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset],
  );
  return result.rows;
}

export async function deleteFile(id: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query("DELETE FROM files WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

// ── activity_logs ─────────────────────────────────────────────────────

export interface ActivityLogRow {
  id: number;
  workspace_id: string | null;
  user_id: string | null;
  service: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: Date;
}

export interface LogActivity {
  workspace_id?: string;
  user_id?: string;
  service: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
}

export async function logActivity(data: LogActivity): Promise<ActivityLogRow> {
  const pool = getPool();
  const result = await pool.query<ActivityLogRow>(
    `INSERT INTO activity_logs
       (workspace_id, user_id, service, action, resource_type, resource_id, details, ip_address)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.workspace_id ?? null,
      data.user_id ?? null,
      data.service,
      data.action,
      data.resource_type ?? null,
      data.resource_id ?? null,
      JSON.stringify(data.details ?? {}),
      data.ip_address ?? null,
    ],
  );
  return result.rows[0];
}

export async function listActivityLogs(opts: {
  workspace_id?: string;
  service?: string;
  action?: string;
  resource_type?: string;
  limit?: number;
  offset?: number;
  since?: Date;
} = {}): Promise<ActivityLogRow[]> {
  const pool = getPool();
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (opts.workspace_id) {
    conditions.push(`workspace_id = $${idx++}`);
    params.push(opts.workspace_id);
  }
  if (opts.service) {
    conditions.push(`service = $${idx++}`);
    params.push(opts.service);
  }
  if (opts.action) {
    conditions.push(`action = $${idx++}`);
    params.push(opts.action);
  }
  if (opts.resource_type) {
    conditions.push(`resource_type = $${idx++}`);
    params.push(opts.resource_type);
  }
  if (opts.since) {
    conditions.push(`created_at >= $${idx++}`);
    params.push(opts.since);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = opts.limit ?? 100;
  const offset = opts.offset ?? 0;

  const result = await pool.query<ActivityLogRow>(
    `SELECT * FROM activity_logs ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset],
  );
  return result.rows;
}
