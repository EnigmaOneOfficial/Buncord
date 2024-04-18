import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import config from "../config";
import { log } from "./log";

const sqlite = new Database(
	`${config.database.name}.${config.database.version.toString()}.db`,
);
const db = drizzle(sqlite);
await migrate(db, { migrationsFolder: "./drizzle" });

log("Database migration complete");
