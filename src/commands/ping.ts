import { SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../../types/bot";

const ping: ICommand = {
	data: {
		name: "ping",
		description: "Replies with Pong!",
		usage: "!ping",
		cooldown: 5,
		aliases: ["pin"],
	},
	builder: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async onInteraction(client, interaction) {
		await interaction.reply("Pong!");
	},
	async onMessage(client, message) {
		await message.reply("Pong!");
	},
};

export default ping;
