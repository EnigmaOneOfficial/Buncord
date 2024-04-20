import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import config from "./config";
import { eq } from "drizzle-orm";
import { Glob } from "bun";
import { error } from "~/util/log";
import { Collection } from "discord.js";
import {
	DefaultItem,
	inventories,
	type IInventories,
	type IItem,
} from "./schemas/inventories";
import { users, type IUsers } from "./schemas/users";

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

export const items = new Collection<number, IItem>();

for (const file of new Glob("*.ts").scanSync("src/items/")) {
	const itemModule = await import(`./items/${file}`);
	const item = itemModule.default as IItem;

	if (!item || !item.id) {
		error(`Invalid item file: ${file}`);
		continue;
	}

	if (items.has(item.id)) {
		error(`Duplicate item id: ${item.name} and ${items.get(item.id)?.name}`);
		continue;
	}

	items.set(item.id, item);
}

export const getInventory = async (userId: string) => {
	const inventory = (await db
		.select()
		.from(inventories)
		.where(eq(inventories.userId, userId))
		.then((res) => res)) as IInventories[];

	const itemsWithDetails = inventory.map((item) => ({
		...item,
		details: items.get(item.itemId) || DefaultItem,
	}));

	return itemsWithDetails;
};

export const addItemToInventory = async (userId: string, itemId: number) => {
	const inventory = await getInventory(userId);
	const item = inventory.find((i) => i.itemId === itemId);
	if (item?.details?.stackable) {
		await db
			.update(inventories)
			.set({ quantity: item.quantity + 1 })
			.where(eq(inventories.userId, userId) && eq(inventories.itemId, itemId));
	} else {
		await db.insert(inventories).values({ userId, itemId }).returning();
	}
};

export const removeItemFromInventory = async (
	userId: string,
	itemId: number,
) => {
	const inventory = await getInventory(userId);
	const item = inventory.find((i) => i.itemId === itemId);
	if (item) {
		if (item.quantity === 1) {
			await db
				.delete(inventories)
				.where(
					eq(inventories.userId, userId) && eq(inventories.itemId, itemId),
				);
		} else {
			await db
				.update(inventories)
				.set({ quantity: item.quantity - 1 })
				.where(
					eq(inventories.userId, userId) && eq(inventories.itemId, itemId),
				);
		}
	}
};
