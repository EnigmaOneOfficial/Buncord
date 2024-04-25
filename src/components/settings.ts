import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { getUser } from "~/db";
import type { IUsers } from "~/schemas/users";
import { createMainMenuActionRow } from "./main_menu";

export const createSettingsEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle("Settings")
		.setColor("#FFD700")
		.setDescription("Change your settings and manage your account.")
		.setTimestamp();

	return embed;
};

export const createSettingsActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("reset_user")
			.setLabel("Reset User")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleSettingsInteraction = async (
	interaction: ButtonInteraction,
) => {
	await interaction.deferUpdate();
	const { user } = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createSettingsEmbed(user)],
		components: [
			createSettingsActionRow(),
			createMainMenuActionRow("settings"),
		],
	});
};
