import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import type { IUsers } from "~/schemas/users";

export const createStatsEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Stats`)
		.addFields(
			{ name: "Level", value: user.level.toString(), inline: true },
			{ name: "Experience", value: user.experience.toString(), inline: true },
		)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createStatsActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("achievements")
			.setLabel("Achievements")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleStatsInteraction = async (
	interaction: ButtonInteraction,
	user: IUsers,
) => {
	await interaction.editReply({
		embeds: [createStatsEmbed(user)],
		components: [createStatsActionRow()],
	});
};
