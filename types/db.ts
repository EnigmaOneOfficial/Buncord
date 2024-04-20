import type { inventories } from "~/db/schemas/inventories";
import type { users } from "~/db/schemas/users";
import type { NonNullableTable } from "./utility";

export type IInventories = NonNullableTable<typeof inventories.$inferSelect>;
export type IUsers = NonNullableTable<typeof users.$inferSelect>;
