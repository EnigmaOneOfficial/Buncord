import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { NonNullableTable } from "../../types/utility";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	username: text("name").default("Unknown"),
	avatar: text("avatar").default(""),
});

export type IUsers = NonNullableTable<typeof users.$inferSelect>;
