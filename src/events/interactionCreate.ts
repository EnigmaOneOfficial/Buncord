import {
	type ChatInputCommandInteraction,
	Collection,
	Events,
} from "discord.js";
import { error } from "~/util/log";
import type { IEvent, IEventExecute } from "../../types/bot";
import { gainXP, getUser, updateAnalytics, updateUser } from "~/db";

const name = Events.InteractionCreate;
const execute: IEventExecute<ChatInputCommandInteraction> = async (
	client,
	interaction,
) => {
	const member = interaction.member;
	if (!member) return;

	const { stats, analytics } = await getUser(interaction.user.id);
	await updateAnalytics(interaction.user.id, {
		interactions: analytics.interactions + 1,
		lastActive: Date.now(),
	});
	await gainXP(interaction.user.id, 1);
	await updateUser(interaction.user.id, {
		username: interaction.user.displayName,
		avatar: interaction.user.displayAvatarURL() || "",
	});

	const command = client.commands.get(interaction.commandName);
	if (!command || !command.onInteraction) return;

	const { cooldowns } = client;
	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const cooldownAmount = (command.data.cooldown || 0) * 1000;
	const timestamp = timestamps?.get(interaction.user.id);
	if (timestamp) {
		const expirationTime = timestamp + cooldownAmount;
		if (now < expirationTime) {
			return;
		}
	} else {
		timestamps?.set(interaction.user.id, now);
		setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);
	}

	try {
		await command.onInteraction(client, interaction);
	} catch (err) {
		error(err as string);
	}
};

const interactionCreate: IEvent<ChatInputCommandInteraction> = {
	name,
	execute,
};

export default interactionCreate;
