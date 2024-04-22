import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
	StringSelectMenuBuilder,
} from "discord.js";

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
];

export const createShopEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle(" Shop")
		.setColor("#FFD700")
		.setDescription("Welcome to the  shop! Here you can buy  items.")
		.addFields(
			shop_items.map((item) => ({
				name: item.name,
				value: `${item.price} coins`,
			})),
		)
		.setTimestamp();

	return embed;
};

export const createShopActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createShopSelectionRow = () => {
	const selectMenu = new StringSelectMenuBuilder()
		.setCustomId("_shop_select")
		.setPlaceholder("Select an item to buy")
		.addOptions(
			shop_items.map((item) => ({
				label: item.name,
				value: item.id.toString(),
			})),
		);

	return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		selectMenu,
	);
};

export const handleShopInteraction = async (interaction: ButtonInteraction) => {
	await interaction.editReply({
		embeds: [createShopEmbed()],
		components: [createShopActionRow(), createShopSelectionRow()],
	});
};
