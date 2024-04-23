import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { eq } from "drizzle-orm";
import { db, items } from "~/db";
import { user_items, type IItem } from "~/schemas/user_items";
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
	if (!item) {
		await interaction.editReply({
			embeds: [createInventoryItemNotExistEmbed()],
			components: [
				createInventoryItemNotExistActionRow(),
				createMainMenuActionRow("item"),
			],
		});
	} else {
		const updatedItem = await db
			.update(user_items)
			.set({
				equipped: 1,
			})
			.where(eq(user_items.itemId, item.id))
			.returning()
			.then((rows) => rows[0]);
		await interaction.editReply({
			embeds: [createEquipItemEmbed(item)],
			components: [createEquipItemActionRow(), createMainMenuActionRow("item")],
		});

		return items.find((item) => item.id === updatedItem?.itemId);
	}
};
