import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { user_items, type IItem } from "~/schemas/user_items";
import {
	createInventoryItemNotExistActionRow,
	createInventoryItemNotExistEmbed,
} from "./inventory_item";

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
	if (!item) {
		await interaction.editReply({
			embeds: [createInventoryItemNotExistEmbed()],
			components: [createInventoryItemNotExistActionRow()],
		});
	} else {
		await db
			.update(user_items)
			.set({
				equipped: 0,
			})
			.where(eq(user_items.itemId, item.id));
		await interaction.editReply({
			embeds: [createUnequipItemEmbed(item)],
			components: [createUnequipItemActionRow()],
		});
	}

	return item;
};
