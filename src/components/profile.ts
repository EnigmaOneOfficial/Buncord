import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { getRequiredXPForNextLevel, getUser } from "~/db";
import type { IUserAnalytics } from "~/schemas/user_analytics";
import type { IUserStats } from "~/schemas/user_stats";
import type { IUsers } from "~/schemas/users";
import { createMainMenuActionRow } from "./main_menu";

export const createProfileEmbed = ({
	stats,
	user,
	analytics,
}: {
	stats: IUserStats;
	user: IUsers;
	analytics: IUserAnalytics;
}) => {
	const embed = new EmbedBuilder()
		.setTitle("Profile")
		.setThumbnail(user.avatar)
		.setColor("#7289DA")
		.addFields(
			{
				name: "Username",
				value: user.username,
				inline: true,
			},
			{
				name: "Level",
				value: `${stats.level}`,
				inline: true,
			},
			{
				name: "Experience",
				value: `${stats.experience}/${getRequiredXPForNextLevel(stats.level)}`,
				inline: true,
			},
			{
				name: "Gold",
				value: `${stats.gold}`,
				inline: true,
			},
			{
				name: "Messages",
				value: `${analytics.messages}`,
				inline: true,
			},
			{
				name: "Interactions",
				value: `${analytics.interactions}`,
				inline: true,
			},
		)
		.setTimestamp();

	return embed;
};

export const createProfileActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("stats")
			.setLabel("Stats")
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId("inventory")
			.setLabel("Inventory")
			.setStyle(ButtonStyle.Success),
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

export const handleProfileInteraction = async (
	interaction: ButtonInteraction,
) => {
	await interaction.deferUpdate();
	await interaction.editReply({
		embeds: [createProfileEmbed(await getUser(interaction.user.id))],
		components: [createProfileActionRow(), createMainMenuActionRow("profile")],
	});
};
