import {
	type ChatInputCommandInteraction,
	type Message,
	SlashCommandBuilder,
} from "discord.js";
import type { ICommand, ICommandData, ICommandExecute } from "../../types/bot";

const builder = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with Pong!");

const data: ICommandData = {
	name: "ping",
	description: "Replies with Pong!",
	usage: "!ping",
	cooldown: 1,
	aliases: ["pin"],
};

const onInteraction: ICommandExecute<ChatInputCommandInteraction> = async (
	client,
	interaction,
) => {
	await interaction.reply("Pong!");
};

const onMessage: ICommandExecute<Message> = async (client, message) => {
	await message.reply("Pong!");
};

const ping: ICommand = {
	builder,
	data,
	onInteraction,
	onMessage,
};

export default ping;
