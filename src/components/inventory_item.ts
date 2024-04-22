import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type StringSelectMenuInteraction,
} from "discord.js";
import type { IInventories } from "~/schemas/inventories";

export const createItemEmbed = (item: IInventories) => {
	const embed = new EmbedBuilder()
		.setTitle(item.details.name)
		.setDescription(item.details.description)
		.addFields({ name: "Rarity", value: item.details.rarity, inline: true })
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createItemActionRow = (item: IInventories) => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId(`equip_${item.id}`)
			.setLabel("Equip")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId(`unequip_${item.id}`)
			.setLabel("Unequip")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("inventory")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleItemInteraction = async (
	interaction: StringSelectMenuInteraction,
	item?: IInventories,
) => {
	if (!item) {
		return;
	}
	await interaction.editReply({
		embeds: [createItemEmbed(item)],
		components: [createItemActionRow(item)],
	});
};
