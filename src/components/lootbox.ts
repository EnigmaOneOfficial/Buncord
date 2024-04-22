import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";

export const createLootboxEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Lootboxes")
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createLootboxActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("open_lootbox")
			.setLabel("Open Lootbox")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleLootboxInteraction = async (
	interaction: ButtonInteraction,
) => {
	await interaction.editReply({
		embeds: [createLootboxEmbed()],
		components: [createLootboxActionRow()],
	});
};
