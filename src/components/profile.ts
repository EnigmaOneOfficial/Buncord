import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import type { IUserAnalytics } from "~/schemas/user_analytics";
import type { IUserStats } from "~/schemas/user_stats";
import type { IUsers } from "~/schemas/users";
import type { Menu } from "../../types/components";

export const createProfileEmbed = ({
	user,
	analytics,
	stats,
}: { user: IUsers; analytics: IUserAnalytics; stats: IUserStats }) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Profile`)
		.setThumbnail(user.avatar)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createProfileActionRow = (selected?: Menu) => {
	const buttons = {
		stats: new ButtonBuilder()
			.setCustomId("stats")
			.setLabel("Stats")
			.setStyle(ButtonStyle.Primary),
		inventory: new ButtonBuilder()
			.setCustomId("inventory")
			.setLabel("Inventory")
			.setStyle(ButtonStyle.Primary),
		market: new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Market")
			.setStyle(ButtonStyle.Primary),
		tower: new ButtonBuilder()
			.setCustomId("tower")
			.setLabel("Tower")
			.setStyle(ButtonStyle.Primary),
		settings: new ButtonBuilder()
			.setCustomId("settings")
			.setLabel("Settings")
			.setStyle(ButtonStyle.Primary),
	};
	const nonSelectedButtons = Object.keys(buttons).filter(
		(key) => key !== selected,
	);
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		nonSelectedButtons.map((key) => buttons[key as keyof typeof buttons]),
	);

	return actionRow;
};
