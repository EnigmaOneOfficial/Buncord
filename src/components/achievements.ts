import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import { getUser } from "~/db";
import type { IUsers } from "~/schemas/users";
import { createMainMenuActionRow } from "./main_menu";

export const createAchievementsEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Achievements`)
		.setDescription("Achievements are not yet implemented. Check back later!")
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createAchievementsActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("profile")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleAchievementsInteraction = async (
	interaction: ButtonInteraction,
) => {
	const { user } = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createAchievementsEmbed(user)],
		components: [
			createAchievementsActionRow(),
			createMainMenuActionRow("profile"),
		],
	});
};
