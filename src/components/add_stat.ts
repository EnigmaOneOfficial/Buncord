import type { ButtonInteraction } from "discord.js";
import { getUser, updateStats } from "~/db";
import type { IUserStats } from "~/schemas/user_stats";
import { createStatsActionRows, createStatsEmbed } from "./stats";
import { createMainMenuActionRow } from "./main_menu";

export const handleAddStat = async (interaction: ButtonInteraction) => {
	await interaction.deferUpdate();
	const { stats } = await getUser(interaction.user.id);
	const stat = interaction.customId.split("_").pop() as keyof IUserStats;
	if (stats.statPoints === 0) return;
	const updatedStats = await updateStats(interaction.user.id, {
		[stat]: Number(stats[stat]) + 1,
		statPoints: stats.statPoints - 1,
	});
	await interaction.editReply({
		embeds: [createStatsEmbed(updatedStats)],
		components: [
			...createStatsActionRows(),
			createMainMenuActionRow("profile"),
		],
	});
};
