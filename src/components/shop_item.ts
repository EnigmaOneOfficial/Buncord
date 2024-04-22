import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type StringSelectMenuInteraction,
} from "discord.js";
import type { IItem } from "~/schemas/inventories";

export const createShopItemEmbed = (item: IItem, price: number) => {
	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setDescription(item.description)
		.addFields(
			{ name: "Price", value: price.toString(), inline: true },
			{ name: "Rarity", value: item.rarity, inline: true },
		)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createShopItemActionRow = (item: IItem) => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("buy_item")
			.setLabel("Buy")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("regular_shop")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleShopItemInteraction = async (
	interaction: StringSelectMenuInteraction,
	item: IItem,
	price: number,
) => {
	await interaction.editReply({
		embeds: [createShopItemEmbed(item, price)],
		components: [createShopItemActionRow(item)],
	});
};
