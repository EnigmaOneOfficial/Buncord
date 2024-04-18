import {
	type ChatInputCommandInteraction,
	Collection,
	Events,
} from "discord.js";
import { eq } from "drizzle-orm";
import { users } from "~/database/schema";
import { error } from "~/util/log";
import type { IEvent } from "../../types/bot";

const interactionCreate: IEvent<ChatInputCommandInteraction> = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {
		const member = interaction.member;
		if (!member) return;

		let user = await client.db
			.select()
			.from(users)
			.where(eq(users.id, member.user.id))
			.then((res) => res[0]);
		if (!user) {
			user = await client.db
				.insert(users)
				.values({
					id: member.user.id,
					avatar: member.user.avatar,
					username: member.user.username,
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
			.where(eq(users.id, member.user.id));

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

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
				// Cooldown
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
	},
};

export default interactionCreate;
