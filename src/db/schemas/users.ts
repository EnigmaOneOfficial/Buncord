import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	username: text("name").default("Unknown"),
	avatar: text("avatar"),
	messageCount: integer("message_count").default(0),
	level: integer("level").default(1),
	experience: integer("experience").default(0),
	gold: integer("gold").default(0),
	currentDungeon: text("current_dungeon").default("None"),
	highestDungeonLevel: integer("highest_dungeon_level").default(0),
});
