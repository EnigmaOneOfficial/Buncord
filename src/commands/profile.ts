import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from "discord.js";
import type { ICommand, ICommandData, ICommandExecute } from "../../types/bot";
import { addItemToInventory, getInventory, getUser } from "~/db/db";
import type { IUser } from "../../types/db";

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

const createProfileEmbed = (user: IUser) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Profile`)
		.setThumbnail(user.avatar)
		.addFields(
			{ name: "Level", value: user.level.toString(), inline: true },
			{
				name: "Current Dungeon",
				value: user.currentDungeon || "None",
				inline: false,
			},
			{
				name: "Highest Dungeon Level",
				value: user.highestDungeonLevel.toString(),
				inline: false,
			},
		)
		.setColor("#00FF00")
		.setTimestamp();

	return embed;
};

const onInteraction: ICommandExecute<ChatInputCommandInteraction> = async (
	client,
	interaction,
) => {
	const user = await getUser(interaction.user.id);
	if (!user) return;

	const embed = createProfileEmbed(user);
	await interaction.reply({
		embeds: [embed],
	});
	await addItemToInventory(user.id, 1);
	console.log(await getInventory(user.id));
};

const profile: ICommand = {
	builder,
	data,
	onInteraction,
};

export default profile;
