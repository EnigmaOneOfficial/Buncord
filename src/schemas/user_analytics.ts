import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import type { NonNullableTable } from "../../types/utility";

export const user_analytics = sqliteTable("user_analytics", {
	id: integer("id").primaryKey(),
	userId: text("user_id").references(() => users.id),
	messages: integer("messages_sent").default(0),
	interactions: integer("interactions_sent").default(0),
	joinedAt: integer("joined_at").default(0),
	lastActive: integer("last_active").default(0),
});

export type IUserAnalytics = NonNullableTable<
	typeof user_analytics.$inferSelect
>;
