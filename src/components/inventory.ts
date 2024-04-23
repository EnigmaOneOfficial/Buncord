import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	type ButtonInteraction,
} from "discord.js";
import { getInventory, getUser } from "~/db";
import type { IUserItem } from "~/schemas/user_items";
import type { IUsers } from "~/schemas/users";
import { createMainMenuActionRow } from "./main_menu";

const MAX_ITEMS_PER_PAGE = 5;

export const createInventoryEmbed = (
	user: IUsers,
	inventory: IUserItem[],
	page: number,
) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Inventory`)
		.setColor("#FFD700")
		.setTimestamp();

	if (inventory.length === 0) {
		embed.setDescription("Your inventory is empty.");
	} else {
		const inventoryList = inventory
			.map((item) => `${item.details.name} x${item.quantity}`)
			.slice(
				page * MAX_ITEMS_PER_PAGE,
				page * MAX_ITEMS_PER_PAGE + MAX_ITEMS_PER_PAGE,
			)
			.join("\n");

		embed.setDescription(inventoryList);
	}

	return embed;
};

export const createInventoryActionRow = (
	inventory: IUserItem[],
	page: number,
) => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("inventory_previous_page")
			.setLabel("Previous Page")
			.setDisabled(page === 0)
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("inventory_next_page")
			.setLabel("Next Page")
			.setDisabled(
				page * MAX_ITEMS_PER_PAGE + MAX_ITEMS_PER_PAGE >= inventory.length,
			)
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("profile")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createInventorySelectionRow = (
	inventory: IUserItem[],
	page: number,
) => {
	const actionRow =
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId("inventory_select")
				.setPlaceholder("Select an item")
				.addOptions(
					inventory
						.map((item) => ({
							label: item.details.name,
							value: item.id.toString(),
						}))
						.slice(
							page * MAX_ITEMS_PER_PAGE,
							page * MAX_ITEMS_PER_PAGE + MAX_ITEMS_PER_PAGE,
						),
				),
		);

	return actionRow;
};

export const handleInventoryInteraction = async (
	interaction: ButtonInteraction,
	page: number,
) => {
	const { user } = await getUser(interaction.user.id);
	const inventory = await getInventory(user.id);
	await interaction.editReply({
		embeds: [createInventoryEmbed(user, inventory, page)],
		components:
			inventory.length === 0
				? [
						createInventoryActionRow(inventory, page),
						createMainMenuActionRow("profile"),
					]
				: [
						createInventorySelectionRow(inventory, page),
						createInventoryActionRow(inventory, page),
						createMainMenuActionRow("profile"),
					],
	});
};
