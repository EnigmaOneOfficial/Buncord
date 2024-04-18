import { ChannelType, Collection, Events, type Message } from "discord.js";
import { users } from "~/database/schemas/users";
import { eq } from "drizzle-orm";
import { error } from "~/util/log";
import type { IEvent } from "../../types/bot";

const messageCreate: IEvent<Message> = {
	name: Events.MessageCreate,
	async execute(client, message) {
		let user = await client.db
			.select()
			.from(users)
			.where(eq(users.id, message.author.id))
			.then((res) => res[0]);
		if (!user) {
			user = await client.db
				.insert(users)
				.values({
					id: message.author.id,
					avatar: message.author.avatar,
					username: message.author.username,
					messageCount: 0,
				})
				.returning()
				.then((res) => res[0]);
		}

		await client.db
			.update(users)
			.set({
				messageCount: (user?.messageCount || 0) + 1,
			})
			.where(eq(users.id, message.author.id));

		if (message.author.bot) return;
		if (!message.content.startsWith("!")) return;
		const args = message.content.slice(1).trim().split(/ +/);
		const commandName = args.shift()?.toLowerCase() || "";
		const command =
			client.commands.find((cmd) => cmd.data.aliases?.includes(commandName)) ||
			client.commands.get(commandName);
		if (!command) return;
		if (
			message.channel.type !== ChannelType.PublicThread &&
			message.channel.type !== ChannelType.PrivateThread &&
			message.channel.type !== ChannelType.GuildText &&
			message.channel.type !== ChannelType.DM
		) {
			// Not a text channel
			return;
		}
		if (command.data.permissions && message.channel.type !== ChannelType.DM) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.data.permissions)) {
				// No permissions
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
				// Cooldown
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
	},
};

export default messageCreate;
