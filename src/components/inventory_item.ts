import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type StringSelectMenuInteraction,
} from "discord.js";
import type { IInventories } from "~/schemas/inventories";
import { handleUnavailableInteraction } from "./unavailable";
import { getInventory } from "~/db";

export const createItemEmbed = (item: IInventories) => {
	const embed = new EmbedBuilder()
		.setTitle(item.details.name)
		.setDescription(item.details.description)
		.addFields({ name: "Rarity", value: item.details.rarity, inline: true })
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createItemActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("equip_item")
			.setLabel("Equip")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("unequip_item")
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
) => {
	const inventory = await getInventory(interaction.user.id);
	const item = inventory.find((i) => i.id === Number(interaction.values[0]));
	if (!item) {
		await handleUnavailableInteraction(interaction);
	} else {
		await interaction.editReply({
			embeds: [createItemEmbed(item)],
			components: [createItemActionRow()],
		});
	}

	return item;
};
