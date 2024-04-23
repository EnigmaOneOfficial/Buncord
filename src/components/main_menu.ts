import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction,
} from "discord.js";
import type { IUserAnalytics } from "~/schemas/user_analytics";
import type { IUserStats } from "~/schemas/user_stats";
import type { IUsers } from "~/schemas/users";
import type { Menu } from "../../types/components";
import { getRequiredXPForNextLevel, getUser } from "~/db";

export const createMainMenuEmbed = ({
	user,
	analytics,
	stats,
}: { user: IUsers; analytics: IUserAnalytics; stats: IUserStats }) => {
	const embed = new EmbedBuilder()
		.setTitle("Game Menu")
		.setThumbnail(user.avatar)
		.setColor("#7289DA")
		.setDescription(`Welcome, ${user.username}!`)
		.addFields(
			{
				name: "Profile",
				value: "Access stats, inventory, and achievements.",
			},
			{
				name: "Market",
				value: "Acquire or sell items.",
			},
			{
				name: "Tower",
				value: "Challenge the tower!",
			},
			{
				name: "Settings",
				value: "Change your settings.",
			},
		)
		.setTimestamp();

	return embed;
};

export const createMainMenuActionRow = (selected?: Menu) => {
	const buttons = {
		profile: new ButtonBuilder()
			.setCustomId("profile")
			.setLabel("Profile")
			.setStyle(ButtonStyle.Success),
		market: new ButtonBuilder()
			.setCustomId("market")
			.setLabel("Market")
			.setStyle(ButtonStyle.Success),
		tower: new ButtonBuilder()
			.setCustomId("tower")
			.setLabel("Tower")
			.setStyle(ButtonStyle.Danger),
		settings: new ButtonBuilder()
			.setCustomId("settings")
			.setLabel("Settings")
			.setStyle(ButtonStyle.Secondary),
	};
	for (const key in buttons) {
		if (key === selected) {
			buttons[key as keyof typeof buttons]
				.setCustomId("selected")
				.setDisabled(true);
		}
	}
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		Object.keys(buttons).map((key) => buttons[key as keyof typeof buttons]),
	);

	return actionRow;
};

export const handleMainMenuInteraction = async (
	interaction: ButtonInteraction,
) => {
	return await interaction.editReply({
		embeds: [createMainMenuEmbed(await getUser(interaction.user.id))],
		components: [createMainMenuActionRow()],
	});
};
