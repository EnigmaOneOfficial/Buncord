import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import type { IItem } from "~/schemas/user_items";
import { addItemToInventory, db, getUser, items, updateStats } from "~/db";
import { shop_items } from "./shop";
import { users } from "~/schemas/users";
import { eq } from "drizzle-orm";
import { user_stats } from "~/schemas/user_stats";
import { createMainMenuActionRow } from "./main_menu";

export const createBuyItemEmbed = (item: IItem) => {
	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setDescription(item.description)
		.addFields({
			name: "Congratulations",
			value: `You have received a ${item.name}!`,
			inline: true,
		})
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createBuyItemNotExistEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Item not found!")
		.setDescription("The item you are trying to buy does not exist.")
		.setColor("#FF0000")
		.setTimestamp();

	return embed;
};

export const createBuyItemNotExistActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createBuyItemActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleBuyItemInteraction = async (
	interaction: ButtonInteraction,
	item?: IItem,
) => {
	await interaction.deferUpdate();
	if (!item) {
		await interaction.editReply({
			embeds: [createBuyItemNotExistEmbed()],
			components: [createBuyItemNotExistActionRow()],
		});
	} else {
		const { user, stats } = await getUser(interaction.user.id);
		const gold = stats.gold;
		const price =
			shop_items.find((shopItem) => shopItem.id === item.id)?.price || 0;
		if (gold < price) {
			return;
		}
		await updateStats(user.id, { gold: gold - price });
		const newItem = await addItemToInventory(user.id, item.id);
		await interaction.editReply({
			embeds: [createBuyItemEmbed(item)],
			components: [createBuyItemActionRow(), createMainMenuActionRow("shop")],
		});

		return items.find((item) => item.id === newItem?.itemId);
	}
};
