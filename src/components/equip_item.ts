import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { equipItem, items } from "~/db";
import type { IItem } from "~/schemas/user_items";
import {
	createInventoryItemNotExistEmbed,
	createInventoryItemNotExistActionRow,
} from "./inventory_item";
import { createMainMenuActionRow } from "./main_menu";

export const createEquipItemEmbed = (item: IItem) => {
	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setDescription(`You have equipped ${item.name}.`)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createEquipItemActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("inventory_select")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleEquipItemInteraction = async (
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
		const updatedItem = await equipItem(interaction.user.id, item.id);
		await interaction.editReply({
			embeds: [createEquipItemEmbed(item)],
			components: [createEquipItemActionRow(), createMainMenuActionRow("item")],
		});

		return items.find((item) => item.id === updatedItem?.itemId);
	}
};
