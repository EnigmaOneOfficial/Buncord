import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import type { IItem } from "~/schemas/inventories";
import { addItemToInventory, getUser, items } from "~/db";

export const createOpenLootboxEmbed = (item?: IItem) => {
	const embed = new EmbedBuilder()
		.setTitle("Opened Lootbox")
		.setColor("#FFD700")
		.setTimestamp()
		.setDescription(`You have received a ${item?.name}!`);

	return embed;
};

export const createOpenLootboxActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("open_lootbox")
			.setLabel("Open Another")
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
	const user = await getUser(interaction.user.id);
	const random = Math.ceil(items.size * Math.random());
	await addItemToInventory(user.id, random);
	await interaction.editReply({
		embeds: [createOpenLootboxEmbed(items.get(random))],
		components: [createOpenLootboxActionRow()],
	});
};
