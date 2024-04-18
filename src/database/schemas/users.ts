import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	username: text("name").default("Unknown"),
	avatar: text("avatar"),
	messageCount: integer("message_count").default(0),
	random: integer("random").default(0),
});
