import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	StringSelectMenuInteraction,
} from "discord.js";
import { items } from "~/db";
import type { IItem } from "~/schemas/user_items";
import { shop_items } from "./shop";
import {
	createBuyItemNotExistActionRow,
	createBuyItemNotExistEmbed,
} from "./buy_item";
import { createMainMenuActionRow } from "./main_menu";

export const createShopItemEmbed = (item: IItem) => {
	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setDescription(item.description)
		.addFields(
			{
				name: "Price",
				value:
					shop_items
						.find((shopItem) => shopItem.id === item.id)
						?.price.toString() || "Unavailable",
				inline: true,
			},
			{ name: "Rarity", value: item.rarity, inline: true },
		)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createShopItemActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("buy_item")
			.setLabel("Buy")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleShopItemInteraction = async (
	interaction: StringSelectMenuInteraction | ButtonInteraction,
	selectedItem?: IItem,
) => {
	const item =
		interaction instanceof StringSelectMenuInteraction
			? items.find((item) => item.id === Number(interaction.values[0]))
			: selectedItem;
	if (!item) {
		await interaction.editReply({
			embeds: [createBuyItemNotExistEmbed()],
			components: [
				createBuyItemNotExistActionRow(),
				createMainMenuActionRow("shop"),
			],
		});
	} else {
		await interaction.editReply({
			embeds: [createShopItemEmbed(item)],
			components: [createShopItemActionRow(), createMainMenuActionRow("shop")],
		});
	}

	return item;
};
