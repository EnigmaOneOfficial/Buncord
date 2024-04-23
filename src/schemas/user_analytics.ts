import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import type { NonNullableTable } from "../../types/utility";

export const user_analytics = sqliteTable("user_analytics", {
	id: integer("id").primaryKey(),
	userId: text("user_id").references(() => users.id),
});

export type IUserAnalytics = NonNullableTable<
	typeof user_analytics.$inferSelect
>;
