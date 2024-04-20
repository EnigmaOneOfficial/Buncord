import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import config from "../config";
import { eq } from "drizzle-orm";
import { inventories, users } from "./schema";
import type { IUsers, IInventories } from "../../types/db";

const sqlite = new Database(
	`${config.database.name}.${config.database.version.toString()}.db`,
);
export const db = drizzle(sqlite);

export const getUser = async (id: string) => {
	const user = (await db
		.select()
		.from(users)
		.where(eq(users.id, id))
		.then((res) => res[0])) as IUsers;

	if (!user) {
		return await db
			.insert(users)
			.values({ id })
			.returning()
			.then((res) => res[0] as IUsers);
	}

	return user;
};

export const getInventory = async (userId: string) =>
	(await db
		.select()
		.from(inventories)
		.where(eq(inventories.userId, userId))
		.then((res) => res)) as IInventories[];

export const addItemToInventory = async (userId: string, itemId: number) => {
	const inventory = await getInventory(userId);
	const item = inventory.find((i) => i.itemId === itemId);
	if (item) {
		await db
			.update(inventories)
			.set({ quantity: item.quantity + 1 })
			.where(eq(inventories.userId, userId) && eq(inventories.itemId, itemId));
	} else {
		await db.insert(inventories).values({ userId, itemId }).returning();
	}
};
