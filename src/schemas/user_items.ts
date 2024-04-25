import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import type { NonNullableTable, PrimitiveTable } from "../../types/utility";

export const user_items = sqliteTable("user_items", {
	id: integer("id").primaryKey(),
	userId: text("user_id").references(() => users.id),
	itemId: integer("item_id").default(0),
	equipped: integer("equipped").default(0),
	quantity: integer("quantity").default(1),
	locked: integer("locked").default(0),
});

export type IUserItem = NonNullableTable<
	typeof user_items.$inferSelect & {
		details: IItem;
	}
>;

export type EquippableItemKind =
	| "Head"
	| "Chest"
	| "Legs"
	| "Feet"
	| "Hands"
	| "Main Hand"
	| "Off Hand"
	| "Neck"
	| "Ring"
	| "Trinket"
	| "Consumable";
export type NonEquippableItemKind = "Material" | "Key" | "Currency" | "Unknown";

export const DefaultItem: IItem = {
	id: 0,
	name: "Unknown",
	description: "An unknown item.",
	rarity: "Bug",
	equippable: false,
	kind: "Unknown",
	stackable: true,
};
export type IItem = {
	id: number;
	name: string;
	description: string;
	equippable: boolean;
	rarity:
		| "Common"
		| "Uncommon"
		| "Rare"
		| "Epic"
		| "Legendary"
		| "Mythic"
		| "Unobtainable"
		| "Bug"
		| "Unknown"
		| "Unique"
		| "Set"
		| "Event"
		| "Special"
		| "Artifact"
		| "Relic"
		| "Heirloom";
	stackable: boolean;
	kind: EquippableItemKind | NonEquippableItemKind;
} & PrimitiveTable;
