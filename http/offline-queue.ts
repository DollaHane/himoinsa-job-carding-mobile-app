import * as SQLite from "expo-sqlite";

const DB_NAME = "offline_queue.db";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS pending_jobcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0
      );`,
    );
  }
  return db;
}

type PendingType = "create" | "complete";

export type { PendingType };

export interface PendingRecord {
  id: number;
  type: PendingType;
  payload: string;
  created_at: string;
  retry_count: number;
}

export async function enqueuePending(
  type: PendingType,
  payload: Record<string, any>,
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    "INSERT INTO pending_jobcards (type, payload, created_at) VALUES (?, ?, ?)",
    [type, JSON.stringify(payload), new Date().toISOString()],
  );
}

export async function getPendingQueue(
  type?: PendingType,
): Promise<PendingRecord[]> {
  const database = await getDb();
  if (type) {
    return (await database.getAllAsync(
      "SELECT * FROM pending_jobcards WHERE type = ? ORDER BY created_at ASC",
      [type],
    )) as PendingRecord[];
  }
  return (await database.getAllAsync(
    "SELECT * FROM pending_jobcards ORDER BY created_at ASC",
  )) as PendingRecord[];
}

export async function removePending(id: number): Promise<void> {
  const database = await getDb();
  await database.runAsync("DELETE FROM pending_jobcards WHERE id = ?", [id]);
}

export async function incrementRetry(id: number): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    "UPDATE pending_jobcards SET retry_count = retry_count + 1 WHERE id = ?",
    [id],
  );
}

export async function getPendingCount(type?: PendingType): Promise<number> {
  const database = await getDb();
  const query = type
    ? "SELECT COUNT(*) as count FROM pending_jobcards WHERE type = ?"
    : "SELECT COUNT(*) as count FROM pending_jobcards";
  const result = (await database.getFirstAsync(query, type ? [type] : [])) as {
    count: number;
  } | null;
  return result?.count ?? 0;
}

export async function flushPending(): Promise<void> {
  const database = await getDb();
  await database.runAsync("DELETE FROM pending_jobcards");
}
