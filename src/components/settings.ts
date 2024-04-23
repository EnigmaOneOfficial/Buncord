import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import { getUser } from "~/db";
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
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleSettingsInteraction = async (
	interaction: ButtonInteraction,
) => {
	const { user } = await getUser(interaction.user.id);
	await interaction.editReply({
		embeds: [createSettingsEmbed(user)],
		components: [createSettingsActionRow()],
	});
};
