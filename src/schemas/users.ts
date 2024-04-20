import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { NonNullableTable } from "../../types/utility";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	username: text("name").default("Unknown"),
	avatar: text("avatar"),
	messageCount: integer("message_count").default(0),
	level: integer("level").default(1),
	experience: integer("experience").default(0),
	nextLevelExp: integer("next_level_exp").default(100),
	gold: integer("gold").default(0),
	currentHealth: integer("current_health").default(100),
	maxHealth: integer("max_health").default(100),
	currentStamina: integer("current_stamina").default(50),
	maxStamina: integer("max_stamina").default(50),
	strength: integer("strength").default(10),
	agility: integer("agility").default(10),
	luck: integer("luck").default(5),
	currentDungeon: text("current_dungeon").default("None"),
	highestDungeonLevel: integer("highest_dungeon_level").default(0),
});
