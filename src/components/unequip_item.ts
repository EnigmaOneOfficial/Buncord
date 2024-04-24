import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { items, unequipItem } from "~/db";
import type { IItem } from "~/schemas/user_items";
import {
	createInventoryItemNotExistActionRow,
	createInventoryItemNotExistEmbed,
} from "./inventory_item";
import { createMainMenuActionRow } from "./main_menu";

export const createUnequipItemEmbed = (item: IItem) => {
	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setDescription(`You have unequipped ${item.name}.`)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createUnequipItemActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("inventory_select")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleUnequipItemInteraction = async (
	interaction: ButtonInteraction,
	item?: IItem,
) => {
	await interaction.deferUpdate();
	if (!item) {
		await interaction.editReply({
			embeds: [createInventoryItemNotExistEmbed()],
			components: [
				createInventoryItemNotExistActionRow(),
				createMainMenuActionRow("item"),
			],
		});
	} else {
		const updatedItem = await unequipItem(interaction.user.id, item.id);

		await interaction.editReply({
			embeds: [createUnequipItemEmbed(item)],
			components: [
				createUnequipItemActionRow(),
				createMainMenuActionRow("item"),
			],
		});

		return items.find((item) => item.id === updatedItem?.itemId);
	}
};
