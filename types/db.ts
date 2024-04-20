import type { inventories } from "~/schemas/inventories";
import type { NonNullableTable } from "./utility";
import type { users } from "~/schemas/users";

export type IInventory = NonNullableTable<typeof inventories.$inferSelect>;
export type IUser = NonNullableTable<typeof users.$inferSelect>;
