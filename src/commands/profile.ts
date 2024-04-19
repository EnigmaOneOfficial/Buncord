import {
	type ChatInputCommandInteraction,
	type Message,
	SlashCommandBuilder,
	EmbedBuilder,
} from "discord.js";
import type { ICommand, ICommandData, ICommandExecute } from "../../types/bot";
import { eq } from "drizzle-orm";
import { users } from "~/db/schemas/users";

const builder = new SlashCommandBuilder()
	.setName("profile")
	.setDescription("Displays your profile information.");

const data: ICommandData = {
	name: "profile",
	description: "Displays your profile information.",
	usage: "!profile",
	cooldown: 5,
	aliases: ["p"],
};

const onInteraction: ICommandExecute<ChatInputCommandInteraction> = async (
	client,
	interaction,
) => {
	const user = await client.db
		.select()
		.from(users)
		.where(eq(users.id, interaction.user.id))
		.limit(1);

	if (user.length === 0) {
		await interaction.reply("User profile not found.");
		return;
	}

	const embed = new EmbedBuilder()
		.setTitle(`${interaction.user.username}'s Profile`)
		.setThumbnail(interaction.user.avatarURL())
		.addFields(
			{ name: "Username", value: interaction.user.username, inline: true },
			{ name: "ID", value: interaction.user.id, inline: true },
			{
				name: "Created At",
				value: interaction.user.createdAt.toString(),
				inline: false,
			},
		)
		.setColor("#00FF00")
		.setTimestamp();

	await interaction.reply({ embeds: [embed] });
};

const onMessage: ICommandExecute<Message> = async (client, message) => {
	const user = await client.db
		.select()
		.from(users)
		.where(eq(users.id, message.author.id))
		.limit(1);

	if (user.length === 0) {
		await message.reply("User profile not found.");
		return;
	}

	const embed = new EmbedBuilder()
		.setTitle(`${message.author.username}'s Profile`)
		.setThumbnail(message.author.avatarURL())
		.addFields(
			{ name: "Username", value: message.author.username, inline: true },
			{ name: "ID", value: message.author.id, inline: true },
			{
				name: "Created At",
				value: message.author.createdAt.toString(),
				inline: false,
			},
		)
		.setColor("#00FF00")
		.setTimestamp();

	await message.reply({ embeds: [embed] });
};

const profile: ICommand = {
	builder,
	data,
	onInteraction,
	onMessage,
};

export default profile;
