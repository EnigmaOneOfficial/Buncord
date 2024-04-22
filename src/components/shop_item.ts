import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type StringSelectMenuInteraction,
} from "discord.js";
import { items } from "~/db";
import type { IItem } from "~/schemas/inventories";
import { handleUnavailableInteraction } from "./unavailable";
import { shop_items } from "./shop";

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
	interaction: StringSelectMenuInteraction,
) => {
	const item = items.find((item) => item.id === Number(interaction.values[0]));
	if (!item) {
		await handleUnavailableInteraction(interaction);
	} else {
		await interaction.editReply({
			embeds: [createShopItemEmbed(item)],
			components: [createShopItemActionRow()],
		});
	}

	return item;
};
