import { ChannelType, Collection, Events, type Message } from "discord.js";
import { users } from "~/schemas/users";
import { eq } from "drizzle-orm";
import { error } from "~/util/log";
import type { IEvent, IEventExecute } from "../../types/bot";
import { getUser } from "~/db";

const name = Events.MessageCreate;
const execute: IEventExecute<Message> = async (client, message) => {
	const { user } = await getUser(message.author.id);
	await client.db
		.update(users)
		.set({
			messageCount: user.messageCount + 1,
			avatar: message.author.avatarURL(),
			username: message.author.username,
		})
		.where(eq(users.id, message.author.id));

	if (message.author.bot) return;
	if (!message.content.startsWith("!")) return;
	const args = message.content.slice(1).trim().split(/ +/);
	const commandName = args.shift()?.toLowerCase() || "";
	const command =
		client.commands.find((cmd) => cmd.data.aliases?.includes(commandName)) ||
		client.commands.get(commandName);
	if (!command || !command.onMessage) return;
	if (
		message.channel.type !== ChannelType.PublicThread &&
		message.channel.type !== ChannelType.PrivateThread &&
		message.channel.type !== ChannelType.GuildText &&
		message.channel.type !== ChannelType.DM
	) {
		return;
	}
	if (command.data.permissions && message.channel.type !== ChannelType.DM) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.data.permissions)) {
			return;
		}
	}
	const { cooldowns } = client;
	if (!cooldowns.has(commandName)) {
		cooldowns.set(commandName, new Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(commandName);
	const cooldownAmount = (command.data.cooldown || 0) * 1000;
	const timestamp = timestamps?.get(message.author.id);
	if (timestamp) {
		const expirationTime = timestamp + cooldownAmount;
		if (now < expirationTime) {
			return;
		}
	}
	timestamps?.set(message.author.id, now);
	setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);

	try {
		await command.onMessage(client, message, args);
	} catch (err) {
		error(err as string);
	}
};

const messageCreate: IEvent<Message> = {
	name,
	execute,
};

export default messageCreate;
