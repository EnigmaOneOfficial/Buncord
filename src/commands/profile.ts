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
import {
	createProfileEmbed,
	createProfileActionRow,
} from "~/components/profile";
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

const data: ICommandData = {
	name: "profile",
	description: "Displays your profile information.",
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
		embeds: [createProfileEmbed(await getUser(interaction.user.id))],
		components: [createProfileActionRow()],
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
			case "stats":
				handleStatsInteraction(buttonInteraction);
				break;
			case "achievements":
				handleAchievementsInteraction(buttonInteraction);
				break;
			case "inventory":
				handleInventoryInteraction(buttonInteraction, inventoryPage);
				break;
			case "inventory_next_page":
				inventoryPage++;
				handleInventoryInteraction(buttonInteraction, inventoryPage);
				break;
			case "inventory_previous_page":
				inventoryPage--;
				handleInventoryInteraction(buttonInteraction, inventoryPage);
				break;
			case "inventory_select":
				handleInventoryItemInteraction(
					buttonInteraction,
					selectedInventoryItem,
				);
				break;
			case "equip_item":
				handleEquipItemInteraction(buttonInteraction, selectedInventoryItem);
				break;
			case "unequip_item":
				handleUnequipItemInteraction(buttonInteraction, selectedInventoryItem);
				break;
			case "market":
				handleMarketInteraction(buttonInteraction);
				break;
			case "lootboxes":
				handleLootboxInteraction(buttonInteraction);
				break;
			case "open_lootbox":
				handleOpenLootboxInteraction(buttonInteraction);
				break;
			case "shop":
				handleShopInteraction(buttonInteraction, shopPage);
				break;
			case "shop_next_page":
				shopPage++;
				handleShopInteraction(buttonInteraction, shopPage);
				break;
			case "shop_previous_page":
				shopPage--;
				handleShopInteraction(buttonInteraction, shopPage);
				break;
			case "shop_select":
				handleShopItemInteraction(buttonInteraction, selectedShopItem);
				break;
			case "buy_item":
				handleBuyItemInteraction(buttonInteraction, selectedShopItem);
				break;
			case "tower":
				handleTowerInteraction(buttonInteraction);
				break;
			case "enter_tower":
				// TODO
				break;
			case "leaderboard":
				// TODO
				break;
			case "settings":
				handleSettingsInteraction(buttonInteraction);
				break;
			case "home":
				await interaction.editReply({
					embeds: [createProfileEmbed(await getUser(interaction.user.id))],
					components: [createProfileActionRow()],
				});
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

const profile: ICommand = {
	builder,
	data,
	onInteraction,
};

export default profile;
