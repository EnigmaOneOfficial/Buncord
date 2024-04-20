import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const inventories = sqliteTable("inventories", {
	id: integer("id").primaryKey(),
	userId: text("user_id").references(() => users.id),
	itemId: integer("item_id").default(0),
	quantity: integer("quantity").default(1),
});
