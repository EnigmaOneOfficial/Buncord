import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import type { NonNullableTable, PrimitiveTable } from "../../types/utility";

export const inventories = sqliteTable("inventories", {
	id: integer("id").primaryKey(),
	userId: text("user_id").references(() => users.id),
	itemId: integer("item_id").default(0),
	equipped: integer("equipped").default(0),
	quantity: integer("quantity").default(1),
	locked: integer("locked").default(0),
});

export type IInventories = NonNullableTable<
	typeof inventories.$inferSelect & {
		details: IItem;
	}
>;
export const DefaultItem: IItem = {
	id: 0,
	name: "Unknown",
	description: "An unknown item.",
	rarity: "Bug",
	stackable: true,
};
export type IItem = {
	id: number;
	name: string;
	description: string;
	rarity: string;
	stackable: boolean;
} & PrimitiveTable;
