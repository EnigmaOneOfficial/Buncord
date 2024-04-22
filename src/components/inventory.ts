import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	type ButtonInteraction,
} from "discord.js";
import { getInventory } from "~/db";
import type { IInventories } from "~/schemas/inventories";
import type { IUsers } from "~/schemas/users";

const MAX_ITEMS_PER_PAGE = 5;

export const createInventoryEmbed = (
	user: IUsers,
	inventory: IInventories[],
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
	inventory: IInventories[],
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
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createInventorySelectionRow = (
	inventory: IInventories[],
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
	user: IUsers,
	page: number,
) => {
	const inventory = await getInventory(user.id);
	await interaction.editReply({
		embeds: [createInventoryEmbed(user, inventory, page)],
		components:
			inventory.length === 0
				? [createInventoryActionRow(inventory, page)]
				: [
						createInventorySelectionRow(inventory, page),
						createInventoryActionRow(inventory, page),
					],
	});
};