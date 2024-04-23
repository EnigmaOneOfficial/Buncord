import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { createMainMenuActionRow } from "./main_menu";

export const createLootboxEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Lootboxes")
		.setColor("#FFD700")
		.setDescription("Open lootboxes to get random items.")
		.setTimestamp();

	return embed;
};

export const createLootboxActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("open_lootbox")
			.setLabel("Open Lootbox")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleLootboxInteraction = async (
	interaction: ButtonInteraction,
) => {
	await interaction.editReply({
		embeds: [createLootboxEmbed()],
		components: [createLootboxActionRow(), createMainMenuActionRow("market")],
	});
};
