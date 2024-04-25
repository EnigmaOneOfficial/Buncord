import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import type { IItem, IUserItem } from "~/schemas/user_items";
import {
	addItemToInventory,
	getInventory,
	getUser,
	items,
	removeItemFromInventory,
} from "~/db";
import { createMainMenuActionRow } from "./main_menu";

export const createOpenLootboxEmbed = (item?: IItem) => {
	const embed = new EmbedBuilder()
		.setTitle("Opened Lootbox")
		.setColor("#FFD700")
		.setTimestamp()
		.setDescription(`You have received a ${item?.name}!`);

	return embed;
};

export const createOpenLootboxActionRow = (inventory: IUserItem[]) => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("open_lootbox")
			.setLabel("Open Another")
			.setDisabled(
				inventory.find(
					(item) => item.details.name === "Level Up Mystery Box",
				) === undefined,
			)
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("lootboxes")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);
	return actionRow;
};

export const handleOpenLootboxInteraction = async (
	interaction: ButtonInteraction,
) => {
	await interaction.deferUpdate();
	const { user } = await getUser(interaction.user.id);
	const inventory = await getInventory(user.id);
	const random = Math.ceil(items.size * Math.random());
	const mysteryBox = inventory.find(
		(item) => item.details.name === "Level Up Mystery Box",
	);
	if (mysteryBox === undefined) return;
	await addItemToInventory(user.id, random);
	await removeItemFromInventory(user.id, mysteryBox.itemId);
	await interaction.editReply({
		embeds: [createOpenLootboxEmbed(items.get(random))],
		components: [
			createOpenLootboxActionRow(inventory),
			createMainMenuActionRow("lootboxes"),
		],
	});
};
