import { Collection, Events } from "discord.js";
import type { IEvent } from "../../types/db";
import { users } from "~/database/schemas/users";
import { eq } from "drizzle-orm";

const messageCreate: IEvent = {
	name: Events.MessageCreate,
	async execute(client, message) {
		if (message.author.bot) return;
		if (!message.content.startsWith("!")) return;
		const args = message.content.slice(1).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName);
		if (!command) return;
		if (command.data.guildOnly && message.channel.type === "DM") {
			return message.reply("I can't execute that command inside DMs!");
		}
		if (command.data.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.data.permissions)) {
				return message.reply("You can not do this!");
			}
		}
		if (command.data.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;
			if (command.data.usage) {
				reply += `\nThe proper usage would be: \`${command.data.usage}\``;
			}
			return message.channel.send(reply);
		}
		const { cooldowns } = client;
		if (!cooldowns.has(commandName)) {
			cooldowns.set(commandName, new Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(commandName);
		const cooldownAmount = (command.data.cooldown || 0) * 1000;
		if (timestamps?.has(message.author.id)) {
			const expirationTime =
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				timestamps.get(message.author.id)! + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(
					`please wait ${timeLeft.toFixed(
						1,
					)} more second(s) before reusing the \`${commandName}\` command.`,
				);
			}
		}
		timestamps?.set(message.author.id, now);
		setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);

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

		try {
			await command.execute(client, message, args);
		} catch (error) {
			console.error(error);
			message.reply("There was an error trying to execute that command!");
		}
	},
};

export default messageCreate;
