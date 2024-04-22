import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import type { IUsers } from "~/schemas/users";

export const createProfileEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Profile`)
		.setThumbnail(user.avatar)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createProfileActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("stats")
			.setLabel("Stats")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("inventory")
			.setLabel("Inventory")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Market")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("tower")
			.setLabel("Tower")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("settings")
			.setLabel("Settings")
			.setStyle(ButtonStyle.Primary),
	);

	return actionRow;
};
