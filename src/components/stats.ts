import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import { getUser } from "~/db";
import { createMainMenuActionRow } from "./main_menu";
import type { IUserStats } from "~/schemas/user_stats";
import { log } from "~/util/log";

export const createStatsEmbed = (stats: IUserStats) => {
	log("Called?");
	const embed = new EmbedBuilder()
		.setTitle("Stats")
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
			{ name: "Points", value: stats.statPoints.toString() },
		)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createStatsActionRows = () => {
	const actionRow1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("add_strength")
			.setLabel("+ Strength")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("add_defense")
			.setLabel("+ Defense")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("add_intelligence")
			.setLabel("+ Intelligence")
			.setStyle(ButtonStyle.Primary),
	);
	const actionRow2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("add_dexterity")
			.setLabel("+ Dexterity")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("add_constitution")
			.setLabel("+ Constitution")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("add_luck")
			.setLabel("+ Luck")
			.setStyle(ButtonStyle.Primary),
	);
	const actionRow3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("profile")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return [actionRow1, actionRow2, actionRow3];
};

export const handleStatsInteraction = async (
	interaction: ButtonInteraction,
) => {
	await interaction.deferUpdate();
	const { stats } = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createStatsEmbed(stats)],
		components: [
			...createStatsActionRows(),
			createMainMenuActionRow("profile"),
		],
	});
};
