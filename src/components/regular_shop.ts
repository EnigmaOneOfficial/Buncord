import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
	StringSelectMenuBuilder,
} from "discord.js";

export const regular_shop_items = [
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
		id: 3,
		price: 300,
	},
];

export const createRegularShopEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Regular Shop")
		.setColor("#FFD700")
		.setDescription(
			"Welcome to the regular shop! Here you can buy regular items.",
		)
		.addFields(
			regular_shop_items.map((item) => ({
				name: item.name,
				value: `${item.price} coins`,
			})),
		)
		.setTimestamp();

	return embed;
};

export const createRegularShopActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createRegularShopSelectionRow = () => {
	const selectMenu = new StringSelectMenuBuilder()
		.setCustomId("regular_shop_select")
		.setPlaceholder("Select an item to buy")
		.addOptions(
			regular_shop_items.map((item) => ({
				label: item.name,
				value: item.id.toString(),
			})),
		);

	return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		selectMenu,
	);
};

export const handleRegularShopInteraction = async (
	interaction: ButtonInteraction,
) => {
	await interaction.editReply({
		embeds: [createRegularShopEmbed()],
		components: [createRegularShopActionRow(), createRegularShopSelectionRow()],
	});
};
