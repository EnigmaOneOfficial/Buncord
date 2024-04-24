import {
	ModalBuilder,
	type ButtonInteraction,
	ActionRowBuilder,
	TextInputBuilder,
	ButtonStyle,
	TextInputStyle,
	ButtonBuilder,
	EmbedBuilder,
} from "discord.js";
import { removeItemFromInventory } from "~/db";
import type { IItem } from "~/schemas/user_items";

export const createDeleteItemModal = (item: IItem) => {
	const modal = new ModalBuilder()
		.setCustomId("delete_item")
		.setTitle(item.name)
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId("quantity")
					.setLabel("Quantity")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("Enter quantity (Default: All)")
					.setRequired(false),
			),
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

export const createItemDeletedEmbed = (item: IItem, quantity?: number) => {
	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setDescription(
			`You have deleted ${quantity ? quantity : "all"} ${item.name}.`,
		)
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
			const quantity = i.fields.getTextInputValue("quantity");
			const id = field?.customId.split("_").pop();

			if (!text || !id) {
				return;
			}
			if (text === "confirm") {
				await removeItemFromInventory(
					interaction.user.id,
					Number(id),
					Number(quantity),
				);
				await interaction.editReply({
					embeds: [
						quantity
							? createItemDeletedEmbed(item, Number(quantity))
							: createItemDeletedEmbed(item),
					],
					components: [createItemDeletedActionRow()],
				});
			}
		});
};
