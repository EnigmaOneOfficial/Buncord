import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { createMainMenuActionRow } from "./main_menu";
import type { IUserItem } from "~/schemas/user_items";
import { getInventory } from "~/db";

export const createLootboxEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Lootboxes")
		.setColor("#FFD700")
		.setDescription("Open lootboxes to get random items.")
		.setTimestamp();

	return embed;
};

export const createLootboxActionRow = (inventory: IUserItem[]) => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("open_lootbox")
			.setLabel("Open Lootbox")
			.setDisabled(
				inventory.find(
					(item) => item.details.name === "Level Up Mystery Box",
				) === undefined,
			)
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
	await interaction.deferUpdate();
	await interaction.editReply({
		embeds: [createLootboxEmbed()],
		components: [
			createLootboxActionRow(await getInventory(interaction.user.id)),
			createMainMenuActionRow("market"),
		],
	});
};
