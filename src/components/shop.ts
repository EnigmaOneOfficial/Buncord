import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
	StringSelectMenuBuilder,
} from "discord.js";
import { createMainMenuActionRow } from "./main_menu";
import { items } from "~/db";

const MAX_ITEMS_PER_PAGE = 10;

export const shop_items = [
	{
		id: 1,
		price: 5,
	},
];

export const createShopEmbed = (page: number) => {
	const embed = new EmbedBuilder()
		.setTitle("Shop")
		.setColor("#FFD700")
		.setDescription("Welcome to the shop! Here you can buy items.")
		.addFields(
			shop_items
				.map((item) => ({
					name: items.get(item.id)?.name ?? "Unknown Item",
					value: `${item.price} coins`,
				}))
				.slice(
					page * MAX_ITEMS_PER_PAGE,
					page * MAX_ITEMS_PER_PAGE + MAX_ITEMS_PER_PAGE,
				),
		)
		.setTimestamp();

	return embed;
};

export const createShopActionRow = (page: number) => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop_previous_page")
			.setLabel("Previous Page")
			.setDisabled(page === 0)
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("shop_next_page")
			.setLabel("Next Page")
			.setDisabled(
				page * MAX_ITEMS_PER_PAGE + MAX_ITEMS_PER_PAGE >= shop_items.length,
			)
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createShopSelectionRow = (page: number) => {
	const selectMenu = new StringSelectMenuBuilder()
		.setCustomId("shop_select")
		.setPlaceholder("Select an item to buy")
		.addOptions(
			shop_items
				.map((item) => ({
					label: items.get(item.id)?.name ?? "Unknown Item",
					value: item.id.toString(),
				}))
				.slice(
					page * MAX_ITEMS_PER_PAGE,
					page * MAX_ITEMS_PER_PAGE + MAX_ITEMS_PER_PAGE,
				),
		);

	return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		selectMenu,
	);
};

export const handleShopInteraction = async (
	interaction: ButtonInteraction,
	page: number,
) => {
	await interaction.deferUpdate();
	await interaction.editReply({
		embeds: [createShopEmbed(page)],
		components:
			shop_items.length === 0
				? [createShopActionRow(page), createMainMenuActionRow("market")]
				: [
						createShopSelectionRow(page),
						createShopActionRow(page),
						createMainMenuActionRow("market"),
					],
	});
};
