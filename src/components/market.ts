import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type MessageComponentInteraction,
} from "discord.js";

export const createMarketEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Market")
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createMarketActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Shop")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("lootboxes")
			.setLabel("Lootboxes")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("home")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};
export const handleMarketInteraction = async (
	interaction: MessageComponentInteraction,
) => {
	await interaction.editReply({
		embeds: [createMarketEmbed()],
		components: [createMarketActionRow()],
	});
};
