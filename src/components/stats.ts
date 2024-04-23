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

export const createStatsEmbed = ({
	user,
	stats,
}: {
	user: IUsers;
	stats: IUserStats;
}) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Stats`)
		.addFields(
			{ name: "Strength", value: stats.strength.toString(), inline: true },
			{ name: "Defense", value: stats.defense.toString(), inline: true },
			{
				name: "Intelligence",
				value: stats.intelligence.toString(),
				inline: true,
			},
			{ name: "Dexterity", value: stats.dexterity.toString(), inline: true },
			{
				name: "Constitution",
				value: stats.constitution.toString(),
				inline: true,
			},
			{ name: "Luck", value: stats.luck.toString(), inline: true },
		)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createStatsActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("profile")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleStatsInteraction = async (
	interaction: ButtonInteraction,
) => {
	const user = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createStatsEmbed(user)],
		components: [createStatsActionRow(), createMainMenuActionRow("profile")],
	});
};
