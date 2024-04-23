import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import { getUser } from "~/db";
import type { IUsers } from "~/schemas/users";

export const createTowerEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle("Tower")
		.setColor("#FFD700")
		.setTimestamp()
		.addFields(
			{
				name: "Current Floor",
				value: user.currentDungeon.toString(),
				inline: true,
			},
			{
				name: "Highest Floor Reached",
				value: user.highestDungeon.toString(),
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
	const { user } = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createTowerEmbed(user)],
		components: [createTowerActionRow()],
	});
};
