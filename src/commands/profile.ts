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
import { handleShopInteraction, shop_items } from "~/components/shop";
import { handleOpenLootboxInteraction } from "~/components/open_lootbox";
import type { IInventories, IItem } from "~/schemas/inventories";
import { handleShopItemInteraction } from "~/components/shop_item";
import { handleUnavailableInteraction } from "~/components/unavailable";

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
			case "equip":
				// TODO
				break;
			case "unequip":
				// TODO
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
				handleShopInteraction(buttonInteraction);
				break;
			case "buy_item":
				// TODO
				break;
			case "tower":
				handleTowerInteraction(buttonInteraction);
				break;
			case "leaderboard":
				// TODO
				break;
			case "settings":
				handleSettingsInteraction(buttonInteraction);
				break;
			case "home":
				await interaction.editReply({
					embeds: [createProfileEmbed(user)],
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
					await handleItemInteraction(selectionInteraction);
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
