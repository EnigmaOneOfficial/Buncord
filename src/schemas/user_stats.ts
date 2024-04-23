import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import type { NonNullableTable } from "../../types/utility";

export const user_stats = sqliteTable("user_stats", {
	id: integer("id").primaryKey(),
	userId: text("user_id").references(() => users.id),
});

export type IUserStats = NonNullableTable<typeof user_stats.$inferSelect>;
