import {
	ActionRowBuilder,
	type ButtonInteraction,
	EmbedBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { resetUser } from "~/db";
import type { IUsers } from "~/schemas/users";

export const createResetUserModal = () => {
	const modal = new ModalBuilder()
		.setCustomId("reset_user")
		.setTitle("Reset User")
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId("confirm_reset_user")
					.setLabel("Confirm")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("Type 'confirm' to reset your account.")
					.setRequired(true),
			),
		);

	return modal;
};

export const createUserResetEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("User Reset")
		.setDescription("You have successfully reset your account.")
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

export const createUserResetActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("settings")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};
export const handleResetUser = async (interaction: ButtonInteraction) => {
	await interaction.showModal(createResetUserModal());
	await interaction
		.awaitModalSubmit({
			time: 120000,
			filter: (i) => {
				i.deferUpdate();
				return i.user.id === interaction.user.id;
			},
		})
		.then(async (i) => {
			const field = i.fields.getTextInputValue("confirm_reset_user");
			if (field !== "confirm") {
				return;
			}
			await resetUser(interaction.user.id);
			await interaction.editReply({
				embeds: [createUserResetEmbed()],
				components: [createUserResetActionRow()],
			});
		});
};
