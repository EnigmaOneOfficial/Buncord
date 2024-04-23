import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { NonNullableTable } from "../../types/utility";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	username: text("name").default("Unknown"),
	avatar: text("avatar"),
	messageCount: integer("message_count").default(0),
	level: integer("level").default(1),
	experience: integer("experience").default(0),
	gold: integer("gold").default(0),
	currentDungeon: integer("current_dungeon").default(0),
	highestDungeon: integer("highest_dungeon_level").default(0),
	joinedAt: integer("joined_at").default(0),
	lastActive: integer("last_active").default(0),
	class: text("class").default("Adventurer"),
	title: text("title").default(""),
	guild: text("guild").default(""),
	guildRank: text("guild_rank").default("Member"),
	guildContribution: integer("guild_contribution").default(0),
	pvpWins: integer("pvp_wins").default(0),
	pvpLosses: integer("pvp_losses").default(0),
	npcsKilled: integer("npcs_killed").default(0),
	bossesDefeated: integer("bosses_defeated").default(0),
	questsCompleted: integer("quests_completed").default(0),
});

export type IUsers = NonNullableTable<typeof users.$inferSelect>;
