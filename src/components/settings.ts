import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import type { IUsers } from "~/schemas/users";

export const createSettingsEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Settings`)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createSettingsActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("customize_profile")
			.setLabel("Customize Profile")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("notifications")
			.setLabel("Notifications")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("sound_effects")
			.setLabel("Sound Effects")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleSettingsInteraction = async (
	interaction: ButtonInteraction,
	user: IUsers,
) => {
	await interaction.editReply({
		embeds: [createSettingsEmbed(user)],
		components: [createSettingsActionRow()],
	});
};