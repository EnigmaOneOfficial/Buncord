import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { ICommand } from "../../types/bot";
import axios from "axios";
import { error } from "~/util/log";

const builder = new SlashCommandBuilder()
	.setName("fact")
	.setDescription("Get a random fact!")
	.addStringOption((option) =>
		option
			.setName("category")
			.setDescription("Choose a category for the fact")
			.addChoices(
				{ name: "Random", value: "random" },
				{ name: "Animal", value: "animal" },
				{ name: "History", value: "history" },
				{ name: "Science", value: "science" },
			),
	);

const fact: ICommand = {
	data: {
		name: "fact",
		description: "Get a random fact!",
		usage: "!fact [category]",
		cooldown: 10,
		aliases: ["trivia"],
	},
	builder: builder,
	async onInteraction(client, interaction) {
		const category = interaction.options.getString("category") || "random";
		const url = `https://api.api-ninjas.com/v1/facts?category=${category}`;

		if (!process.env.API_NINJAS_KEY) {
			throw error("Missing API_NINJAS_KEY environment variable");
		}

		try {
			const response = await axios.get(url, {
				headers: {
					"X-Api-Key": process.env.API_NINJAS_KEY,
				},
			});

			const fact = response.data[0].fact;
			const embed = new EmbedBuilder()
				.setColor("#0099ff")
				.setTitle("Random Fact")
				.setDescription(fact);

			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error("Error fetching fact:", error);
			await interaction.reply(
				"Oops! Something went wrong while fetching the fact.",
			);
		}
	},
	async onMessage(client, message) {
		const args = message.content
			.slice(this.data.usage.length)
			.trim()
			.split(/ +/);
		const category = args[0] || "random";
		const url = `https://api.api-ninjas.com/v1/facts?category=${category}`;

		try {
			const response = await axios.get(url, {
				headers: {
					"X-Api-Key": process.env.API_NINJAS_KEY,
				},
			});

			const fact = response.data[0].fact;
			const embed = new EmbedBuilder()
				.setColor("#0099ff")
				.setTitle("Random Fact")
				.setDescription(fact);

			await message.reply({ embeds: [embed] });
		} catch (error) {
			console.error("Error fetching fact:", error);
			await message.reply(
				"Oops! Something went wrong while fetching the fact.",
			);
		}
	},
};

export default fact;
