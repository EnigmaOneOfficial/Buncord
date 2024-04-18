import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import config from "../config";

const sqlite = new Database(`${config.database.name}.${config.database.version.toString()}.db`);
export const db = drizzle(sqlite);