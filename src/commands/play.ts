import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
	ComponentType,
} from "discord.js";
import type { ICommand, ICommandData, ICommandExecute } from "../../types/bot";
import { getUser } from "~/db";
import { handleMarketInteraction } from "~/components/market";
import { handleStatsInteraction } from "~/components/stats";
import { handleInventoryInteraction } from "~/components/inventory";
import { handleTowerInteraction } from "~/components/tower";
import { handleSettingsInteraction } from "~/components/settings";
import { handleAchievementsInteraction } from "~/components/achievements";
import { handleLootboxInteraction } from "~/components/lootbox";
import { handleShopInteraction } from "~/components/shop";
import { handleOpenLootboxInteraction } from "~/components/open_lootbox";
import type { IItem } from "~/schemas/user_items";
import { handleShopItemInteraction } from "~/components/shop_item";
import { handleBuyItemInteraction } from "~/components/buy_item";
import { handleInventoryItemInteraction } from "~/components/inventory_item";
import { handleEquipItemInteraction } from "~/components/equip_item";
import { handleUnequipItemInteraction } from "~/components/unequip_item";
import {
	createMainMenuActionRow,
	createMainMenuEmbed,
	handleMainMenuInteraction,
} from "~/components/main_menu";
import { handleProfileInteraction } from "~/components/profile";
import { log } from "~/util/log";

const COLLECTOR_TIME = 120000;

const data: ICommandData = {
	name: "play",
	description: "Displays the main menu.",
	cooldown: 5,
};

const builder = new SlashCommandBuilder()
	.setName(data.name)
	.setDescription(data.description);

const onInteraction: ICommandExecute<ChatInputCommandInteraction> = async (
	client,
	interaction,
) => {
	const message = await interaction.reply({
		embeds: [createMainMenuEmbed(await getUser(interaction.user.id))],
		components: [createMainMenuActionRow()],
		fetchReply: true,
	});

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: COLLECTOR_TIME,
	});

	const selectionCollector = message.createMessageComponentCollector({
		componentType: ComponentType.StringSelect,
		time: COLLECTOR_TIME,
	});

	let inventoryPage = 0;
	let shopPage = 0;
	let selectedInventoryItem: IItem | undefined = undefined;
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
		switch (buttonInteraction.customId) {
			case "profile":
				await handleProfileInteraction(buttonInteraction);
				break;
			case "stats":
				await handleStatsInteraction(buttonInteraction);
				break;
			case "achievements":
				await handleAchievementsInteraction(buttonInteraction);
				break;
			case "inventory":
				await handleInventoryInteraction(buttonInteraction, inventoryPage);
				break;
			case "inventory_next_page":
				inventoryPage++;
				await handleInventoryInteraction(buttonInteraction, inventoryPage);
				break;
			case "inventory_previous_page":
				inventoryPage--;
				await handleInventoryInteraction(buttonInteraction, inventoryPage);
				break;
			case "inventory_select":
				await handleInventoryItemInteraction(
					buttonInteraction,
					selectedInventoryItem,
				);
				break;
			case "equip_item": {
				const updatedItem = await handleEquipItemInteraction(
					buttonInteraction,
					selectedInventoryItem,
				);
				if (updatedItem) {
					selectedInventoryItem = updatedItem;
				}
				break;
			}
			case "unequip_item":
				selectedInventoryItem = await handleUnequipItemInteraction(
					buttonInteraction,
					selectedInventoryItem,
				);
				break;
			case "market":
				await handleMarketInteraction(buttonInteraction);
				break;
			case "lootboxes":
				await handleLootboxInteraction(buttonInteraction);
				break;
			case "open_lootbox":
				await handleOpenLootboxInteraction(buttonInteraction);
				break;
			case "shop":
				await handleShopInteraction(buttonInteraction, shopPage);
				break;
			case "shop_next_page":
				shopPage++;
				await handleShopInteraction(buttonInteraction, shopPage);
				break;
			case "shop_previous_page":
				shopPage--;
				await handleShopInteraction(buttonInteraction, shopPage);
				break;
			case "shop_select":
				await handleShopItemInteraction(buttonInteraction, selectedShopItem);
				break;
			case "buy_item":
				selectedShopItem = await handleBuyItemInteraction(
					buttonInteraction,
					selectedShopItem,
				);
				break;
			case "tower":
				await handleTowerInteraction(buttonInteraction);
				break;
			case "enter_tower":
				// TODO
				break;
			case "leaderboard":
				// TODO
				break;
			case "settings":
				await handleSettingsInteraction(buttonInteraction);
				break;
			case "home":
				await handleMainMenuInteraction(buttonInteraction);
				break;
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

		switch (selectionInteraction.customId) {
			case "inventory_select": {
				selectedInventoryItem =
					await handleInventoryItemInteraction(selectionInteraction);
				break;
			}
			case "shop_select": {
				selectedShopItem =
					await handleShopItemInteraction(selectionInteraction);
				break;
			}
		}
	});

	collector.on("end", async () => {
		await interaction.deleteReply();
	});
};

const play: ICommand = {
	builder,
	data,
	onInteraction,
};

export default play;
