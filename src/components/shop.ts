import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
	StringSelectMenuBuilder,
} from "discord.js";

const MAX_ITEMS_PER_PAGE = 5;

export const shop_items = [
	{
		name: "Item 1",
		id: 1,
		price: 100,
	},
	{
		name: "Item 2",
		id: 2,
		price: 200,
	},
	{
		name: "Item 3",
		id: 8,
		price: 300,
	},
	{
		name: "Item 4",
		id: 4,
		price: 400,
	},
	{
		name: "Item 5",
		id: 5,
		price: 500,
	},
	{
		name: "Item 6",
		id: 6,
		price: 600,
	},
	{
		name: "Item 7",
		id: 7,
		price: 700,
	},
	{
		name: "Item 8",
		id: 8,
		price: 800,
	},
	{
		name: "Item 9",
		id: 9,
		price: 900,
	},
	{
		name: "Item 10",
		id: 10,
		price: 1000,
	},
	{
		name: "Item 11",
		id: 11,
		price: 1100,
	},
	{
		name: "Item 12",
		id: 12,
		price: 1200,
	},
	{
		name: "Item 13",
		id: 13,
		price: 1300,
	},
	{
		name: "Item 14",
		id: 14,
		price: 1400,
	},
	{
		name: "Item 15",
		id: 15,
		price: 1500,
	},
	{
		name: "Item 16",
		id: 16,
		price: 1600,
	},
	{
		name: "Item 17",
		id: 17,
		price: 1700,
	},
	{
		name: "Item 18",
		id: 18,
		price: 1800,
	},
	{
		name: "Item 19",
		id: 19,
		price: 1900,
	},
	{
		name: "Item 20",
		id: 20,
		price: 2000,
	},
	{
		name: "Item 21",
		id: 21,
		price: 2100,
	},
	{
		name: "Item 22",
		id: 22,
		price: 2200,
	},
	{
		name: "Item 23",
		id: 23,
		price: 2300,
	},
	{
		name: "Item 24",
		id: 24,
		price: 2400,
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
					name: item.name,
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
					label: item.name,
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
	await interaction.editReply({
		embeds: [createShopEmbed(page)],
		components:
			shop_items.length === 0
				? [createShopActionRow(page)]
				: [createShopSelectionRow(page), createShopActionRow(page)],
	});
};
