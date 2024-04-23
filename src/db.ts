import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import config from "./config";
import { eq } from "drizzle-orm";
import { Glob } from "bun";
import { error, log } from "~/util/log";
import { Collection } from "discord.js";
import { users, type IUsers } from "./schemas/users";
import {
	type IItem,
	type IUserItem,
	DefaultItem,
	user_items,
} from "./schemas/user_items";
import { type IUserAnalytics, user_analytics } from "./schemas/user_analytics";
import { type IUserStats, user_stats } from "./schemas/user_stats";

const sqlite = new Database(
	`${config.database.name}.${config.database.version.toString()}.db`,
);
export const db = drizzle(sqlite);

export const getUser = async (id: string) => {
	let user = (await db
		.select()
		.from(users)
		.where(eq(users.id, id))
		.then((res) => res[0])) as IUsers;

	if (!user) {
		user = await db
			.insert(users)
			.values({ id })
			.returning()
			.then((res) => res[0] as IUsers);
	}

	let analytics = (await db
		.select()
		.from(user_analytics)
		.where(eq(user_analytics.userId, id))
		.then((res) => res[0])) as IUserAnalytics;

	if (!analytics) {
		analytics = await db
			.insert(user_analytics)
			.values({ userId: id, joinedAt: Date.now(), lastActive: Date.now() })
			.returning()
			.then((res) => res[0] as IUserAnalytics);
	}

	let stats = (await db
		.select()
		.from(user_stats)
		.where(eq(user_stats.userId, id))
		.then((res) => res[0])) as IUserStats;

	if (!stats) {
		stats = await db
			.insert(user_stats)
			.values({ userId: id })
			.returning()
			.then((res) => res[0] as IUserStats);
	}

	return {
		user,
		analytics,
		stats,
	};
};

export const updateUser = async (id: string, data: Partial<IUsers>) => {
	return await db.update(users).set(data).where(eq(users.id, id)).returning();
};

export const updateStats = async (id: string, data: Partial<IUserStats>) => {
	return await db
		.update(user_stats)
		.set(data)
		.where(eq(user_stats.userId, id))
		.returning();
};

export const updateAnalytics = async (
	id: string,
	data: Partial<IUserAnalytics>,
) => {
	return await db
		.update(user_analytics)
		.set(data)
		.where(eq(user_analytics.userId, id))
		.returning();
};

export const getRequiredXPForNextLevel = (level: number) =>
	Math.ceil(0.1 * level ** 2 + 10 * level + 10);

export const gainXP = async (id: string, xp: number) => {
	const { stats } = await getUser(id);
	const requiredXP = getRequiredXPForNextLevel(stats.level);
	const newXP = stats.experience + xp;
	if (newXP >= requiredXP) {
		const newLevel = stats.level + 1;
		const newExperience = newXP - requiredXP;
		await updateStats(id, { level: newLevel, experience: newExperience });
		return { level: newLevel, experience: newExperience };
	}
	await updateStats(id, { experience: newXP });
	return { level: stats.level, experience: newXP };
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
		.from(user_items)
		.where(eq(user_items.userId, userId))
		.then((res) => res)) as IUserItem[];

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
		return await db
			.update(user_items)
			.set({ quantity: item.quantity + 1 })
			.where(eq(user_items.userId, userId) && eq(user_items.itemId, itemId))
			.returning()
			.then((res) => res[0]);
	}
	return await db
		.insert(user_items)
		.values({ userId, itemId })
		.returning()
		.then((res) => res[0]);
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
				.delete(user_items)
				.where(eq(user_items.userId, userId) && eq(user_items.itemId, itemId));
		} else {
			await db
				.update(user_items)
				.set({ quantity: item.quantity - 1 })
				.where(eq(user_items.userId, userId) && eq(user_items.itemId, itemId));
		}
	}
};
