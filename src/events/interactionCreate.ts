import { Collection, Events } from "discord.js";
import type { IEvent } from "../../types/db";
import { eq } from "drizzle-orm";
import { users } from "~/database/schema";

const interactionCreate: IEvent = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        const { cooldowns } = client;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const cooldownAmount = (command.data.cooldown || 0) * 1000;
        if (timestamps?.has(interaction.user.id)) {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({
                    content: `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`,
                    ephemeral: true,
                });
            }
        } else {
            timestamps?.set(interaction.user.id, now);
            setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);
        }

let user = await client.db.select().from(users).where(eq(users.id, interaction.author.id)).then((res) => res[0]);
        if (!user) {
            user = await client.db.insert(users).values({
                id: interaction.author.id,
                avatar: interaction.author.avatar,
                username: interaction.author.username,
                messageCount: 0
            }).returning().then((res) => res[0]);
        }

        await client.db.update(users).set({
            messageCount: (user?.messageCount || 0) + 1
        }).where(eq(users.id, interaction.author.id))
        
        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};

export default interactionCreate;