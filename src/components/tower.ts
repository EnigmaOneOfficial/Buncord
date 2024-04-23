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
import type { IUserStats } from "~/schemas/user_stats";

export const createTowerEmbed = ({
	stats,
}: {
	stats: IUserStats;
}) => {
	const embed = new EmbedBuilder()
		.setTitle("Tower")
		.setColor("#FFD700")
		.setTimestamp()
		.setDescription("Challenge the tower to earn rewards and become stronger!")
		.addFields(
			{
				name: "Current Floor",
				value: stats.currentDungeon.toString(),
				inline: true,
			},
			{
				name: "Highest Floor Reached",
				value: stats.highestDungeon.toString(),
				inline: true,
			},
		);

	return embed;
};

export const createTowerActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("enter_tower")
			.setLabel("Enter Tower")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("leaderboard")
			.setLabel("Leaderboard")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleTowerInteraction = async (
	interaction: ButtonInteraction,
) => {
	const user = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createTowerEmbed(user)],
		components: [createTowerActionRow(), createMainMenuActionRow("tower")],
	});
};
