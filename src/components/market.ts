import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type MessageComponentInteraction,
} from "discord.js";
import { createMainMenuActionRow } from "./main_menu";

export const createMarketEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Market")
		.setColor("#FFD700")
		.setDescription(
			"The market is where you can buy/sell items, open lootboxes, and more!",
		)
		.addFields(
			{
				name: "Shop",
				value: "Buy items from the shop.",
				inline: true,
			},
			{
				name: "Lootboxes",
				value: "Open lootboxes to get random items.",
				inline: true,
			},
		)
		.setTimestamp();

	return embed;
};

export const createMarketActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Shop")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("lootboxes")
			.setLabel("Lootboxes")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};
export const handleMarketInteraction = async (
	interaction: MessageComponentInteraction,
) => {
	await interaction.editReply({
		embeds: [createMarketEmbed()],
		components: [createMarketActionRow(), createMainMenuActionRow("market")],
	});
};
