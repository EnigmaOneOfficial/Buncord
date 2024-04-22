import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	type StringSelectMenuInteraction,
} from "discord.js";

export const createUnavailableEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Non-Exist")
		.setColor("#FFD700")
		.setDescription("The item selected is unavailable.")
		.setTimestamp();

	return embed;
};

export const createUnavailableActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);
	return actionRow;
};

export const handleUnavailableInteraction = async (
	interaction: ButtonInteraction | StringSelectMenuInteraction,
) => {
	await interaction.editReply({
		embeds: [createUnavailableEmbed()],
		components: [createUnavailableActionRow()],
	});
};
