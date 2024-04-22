import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import type { IItem } from "~/schemas/inventories";
import { addItemToInventory, db, getUser } from "~/db";
import { shop_items } from "./shop";
import { users } from "~/schemas/users";
import { eq } from "drizzle-orm";

export const createBuyItemEmbed = (item: IItem) => {
	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setDescription(item.description)
		.addFields({
			name: "Congratulations",
			value: `You have received a ${item.name}!`,
			inline: true,
		})
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createNotEnoughGoldEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Not enough gold!")
		.setDescription("You do not have enough gold to purchase this item.")
		.setColor("#FF0000")
		.setTimestamp();

	return embed;
};

export const createBuyItemNotExistEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Item not found!")
		.setDescription("The item you are trying to buy does not exist.")
		.setColor("#FF0000")
		.setTimestamp();

	return embed;
};

export const createNotEnoughGoldActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createBuyItemNotExistActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createBuyItemActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleBuyItemInteraction = async (
	interaction: ButtonInteraction,
	item?: IItem,
) => {
	if (!item) {
		await interaction.editReply({
			embeds: [createBuyItemNotExistEmbed()],
			components: [createBuyItemNotExistActionRow()],
		});
	} else {
		const user = await getUser(interaction.user.id);
		const gold = user.gold;
		const price =
			shop_items.find((shopItem) => shopItem.id === item.id)?.price || 0;
		if (gold < price) {
			await interaction.editReply({
				embeds: [createNotEnoughGoldEmbed()],
				components: [createNotEnoughGoldActionRow()],
			});
		} else {
			await db
				.update(users)
				.set({ gold: gold - price })
				.where(eq(users.id, user.id));
			await addItemToInventory(user.id, item.id);
			await interaction.editReply({
				embeds: [createBuyItemEmbed(item)],
				components: [createBuyItemActionRow()],
			});
		}
	}
};
