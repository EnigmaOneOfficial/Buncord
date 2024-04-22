import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
	ComponentType,
} from "discord.js";
import type { ICommand, ICommandData, ICommandExecute } from "../../types/bot";
import { getInventory, getUser, items } from "~/db";
import { handleMarketInteraction } from "~/components/market";
import { handleStatsInteraction } from "~/components/stats";
import { handleInventoryInteraction } from "~/components/inventory";
import {
	createProfileEmbed,
	createProfileActionRow,
} from "~/components/profile";
import { handleTowerInteraction } from "~/components/tower";
import { handleSettingsInteraction } from "~/components/settings";
import { handleAchievementsInteraction } from "~/components/achievements";
import { handleItemInteraction } from "~/components/inventory_item";
import { handleLootboxInteraction } from "~/components/lootbox";
import {
	handleRegularShopInteraction,
	regular_shop_items,
} from "~/components/regular_shop";
import { handleOpenLootboxInteraction } from "~/components/open_lootbox";
import type { IInventories, IItem } from "~/schemas/inventories";
import { handleShopItemInteraction } from "~/components/shop_item";

const builder = new SlashCommandBuilder()
	.setName("profile")
	.setDescription("Displays your profile information.");

const data: ICommandData = {
	name: "profile",
	description: "Displays your profile information.",
	cooldown: 5,
};

const onInteraction: ICommandExecute<ChatInputCommandInteraction> = async (
	client,
	interaction,
) => {
	const user = await getUser(interaction.user.id);
	if (!user) return;

	const profileEmbed = createProfileEmbed(user);
	const profileActionRow = createProfileActionRow();

	const message = await interaction.reply({
		embeds: [profileEmbed],
		components: [profileActionRow],
		fetchReply: true,
	});

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 60000,
	});

	const selectionCollector = message.createMessageComponentCollector({
		componentType: ComponentType.StringSelect,
		time: 60000,
	});

	let inventoryPage = 0;
	let selectedInventoryItem: IInventories | undefined = undefined;
	let selectedShopItem: IItem | undefined = undefined;
	collector.on("collect", async (buttonInteraction) => {
		if (buttonInteraction.user.id !== interaction.user.id) {
			await buttonInteraction.reply({
				content: "You cannot use this button.",
				ephemeral: true,
			});
			return;
		}

		await buttonInteraction.deferUpdate();

		const handlers = {
			stats: async () => handleStatsInteraction(buttonInteraction, user),
			achievements: async () =>
				handleAchievementsInteraction(buttonInteraction, user),
			inventory: async () =>
				handleInventoryInteraction(buttonInteraction, user, inventoryPage),
			inventory_next_page: async () => {
				inventoryPage++;
				await handleInventoryInteraction(
					buttonInteraction,
					user,
					inventoryPage,
				);
			},
			inventory_previous_page: async () => {
				inventoryPage--;
				await handleInventoryInteraction(
					buttonInteraction,
					user,
					inventoryPage,
				);
			},
			equip: async () => {}, // TODO
			unequip: async () => {}, // TODO
			market: async () => handleMarketInteraction(buttonInteraction),
			lootboxes: async () => handleLootboxInteraction(buttonInteraction),
			open_lootbox: async () =>
				handleOpenLootboxInteraction(buttonInteraction, user),
			regular_shop: async () => handleRegularShopInteraction(buttonInteraction),
			buy_item: async () => {}, // TODO
			tower: async () => handleTowerInteraction(buttonInteraction, user),
			settings: async () => handleSettingsInteraction(buttonInteraction, user),
			home: async () => {
				await interaction.editReply({
					embeds: [createProfileEmbed(user)],
					components: [createProfileActionRow()],
				});
			},
		};

		const handler =
			handlers[buttonInteraction.customId as keyof typeof handlers];
		if (handler) {
			await handler();
		}

		collector.resetTimer();
		selectionCollector.resetTimer();
	});

	selectionCollector.on("collect", async (selectionInteraction) => {
		if (selectionInteraction.user.id !== interaction.user.id) {
			await selectionInteraction.reply({
				content: "You cannot use this select menu.",
				ephemeral: true,
			});
			return;
		}

		await selectionInteraction.deferUpdate();

		const handlers = {
			inventory_select: async () => {
				const inventory = await getInventory(user.id);
				const item = inventory.find(
					(item) => item.id === Number(selectionInteraction.values[0]),
				);
				if (!item) return;

				selectedInventoryItem = item;
				await handleItemInteraction(
					selectionInteraction,
					selectedInventoryItem,
				);
			},
			regular_shop_select: async () => {
				const item = items.find(
					(item) => item.id === Number(selectionInteraction.values[0]),
				);
				if (!item) return;

				selectedShopItem = item;
				await handleShopItemInteraction(
					selectionInteraction,
					selectedShopItem,
					regular_shop_items.find((i) => i.id === item.id)?.price || 0,
				);
			},
		};

		const handler =
			handlers[selectionInteraction.customId as keyof typeof handlers];
		if (handler) {
			await handler();
		}
	});

	collector.on("end", async () => {
		await interaction.editReply({
			components: [],
		});
	});
};

const profile: ICommand = {
	builder,
	data,
	onInteraction,
};

export default profile;
