import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import { getUser } from "~/db";
import type { IUsers } from "~/schemas/users";
import { createProfileActionRow } from "./profile";

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
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleStatsInteraction = async (
	interaction: ButtonInteraction,
) => {
	const { user } = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createStatsEmbed(user)],
		components: [createStatsActionRow(), createProfileActionRow("stats")],
	});
};
