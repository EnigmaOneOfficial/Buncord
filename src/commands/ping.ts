import { SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../../types/bot";

const builder = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with Pong!");

const ping: ICommand = {
	builder,
	data: {
		name: "ping",
		description: "Replies with Pong!",
		usage: "!ping",
		cooldown: 1,
		aliases: ["pin"],
	},
	async onInteraction(client, interaction) {
		await interaction.reply("Pong!");
	},
	async onMessage(client, message) {
		await message.reply("Pong!");
	},
};

export default ping;
