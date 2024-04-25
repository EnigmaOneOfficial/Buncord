import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import type { NonNullableTable } from "../../types/utility";

export const user_stats = sqliteTable("user_stats", {
	id: integer("id").primaryKey(),
	userId: text("user_id").references(() => users.id),
	level: integer("level").default(1),
	experience: integer("experience").default(0),
	gold: integer("gold").default(0),
	currentDungeon: integer("current_dungeon").default(0),
	highestDungeon: integer("highest_dungeon_level").default(0),
	class: text("class").default("None"),
	title: text("title").default(""),
	guild: text("guild").default("None"),
	guildRank: text("guild_rank").default("None"),
	strength: integer("strength").default(1),
	defense: integer("defense").default(1),
	intelligence: integer("intelligence").default(1),
	dexterity: integer("dexterity").default(1),
	constitution: integer("constitution").default(1),
	luck: integer("luck").default(1),
	statPoints: integer("stat_points").default(0),
});

export type IUserStats = NonNullableTable<typeof user_stats.$inferSelect>;
