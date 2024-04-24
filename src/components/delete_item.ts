import {
	ModalBuilder,
	type ButtonInteraction,
	ActionRowBuilder,
	TextInputBuilder,
	type ModalSubmitInteraction,
	ButtonStyle,
	TextInputStyle,
	ButtonBuilder,
	EmbedBuilder,
	InteractionCollector,
	type Message,
} from "discord.js";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { user_items, type IItem } from "~/schemas/user_items";
import type { IClient } from "../../types/bot";

export const createDeleteItemModal = (item: IItem) => {
	const modal = new ModalBuilder()
		.setCustomId("delete_item")
		.setTitle(item.name)
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(`confirm_delete_item_${item.id}`)
					.setLabel("Confirm")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("Type 'confirm' to delete the item.")
					.setRequired(true),
			),
		);

	return modal;
};

export const createDeleteItemNotExistEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Item not found!")
		.setDescription("The item you are trying to select does not exist.")
		.setColor("#FF0000")
		.setTimestamp();

	return embed;
};

export const createDeleteItemNotExistActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("inventory")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const createItemDeletedEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Item deleted")
		.setDescription("The item has been deleted.")
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createItemDeletedActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("inventory")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

export const handleDeleteItem = async (
	interaction: ButtonInteraction,
	item?: IItem,
) => {
	if (!item) {
		await interaction.deferUpdate();
		return await interaction.editReply({
			embeds: [createDeleteItemNotExistEmbed()],
			components: [createDeleteItemNotExistActionRow()],
		});
	}

	await interaction.showModal(createDeleteItemModal(item));
	await interaction
		.awaitModalSubmit({
			time: 120000,
			filter: (i) => {
				i.deferUpdate();
				return i.user.id === interaction.user.id;
			},
		})
		.then(async (i) => {
			const field = i.fields.fields.find((_, field) =>
				field.startsWith("confirm_delete_item_"),
			);
			const text = field?.value;
			const id = field?.customId.split("_").pop();

			if (!text || !id) {
				return;
			}
			if (text === "confirm") {
				await db.delete(user_items).where(eq(user_items.itemId, Number(id)));
				await interaction.editReply({
					embeds: [createItemDeletedEmbed()],
					components: [createItemDeletedActionRow()],
				});
			}
		});
};
