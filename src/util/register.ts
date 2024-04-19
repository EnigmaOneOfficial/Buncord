import {
	REST,
	type RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from "discord.js";
import { Glob } from "bun";
import "dotenv/config";
import { error, log } from "./log";
import type { ICommand } from "../../types/bot";

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

if (!process.env.TOKEN) {
	throw error("Missing TOKEN environment variable.");
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		if (!process.env.APPLICATION_ID) {
			throw error("Missing APPLICATION_ID environment variable.");
		}

		const args = process.argv.slice(2);
		const guildIdIndex = args.indexOf("--guild");
		const deleteIndex = args.indexOf("--delete");
		const guildId = guildIdIndex !== -1 ? args[guildIdIndex + 1] : undefined;
		const deleteOnly = deleteIndex !== -1;

		if (guildId) {
			log(`Deleting existing application commands for guild ${guildId}`);
			await rest
				.put(
					Routes.applicationGuildCommands(process.env.APPLICATION_ID, guildId),
					{
						body: [],
					},
				)
				.then(() =>
					log("Successfully deleted application commands for the guild"),
				)
				.catch(error);
		} else {
			log("Deleting existing global application commands");
			await rest
				.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
					body: [],
				})
				.then(() => log("Successfully deleted global application commands"))
				.catch(error);
		}

		if (!deleteOnly) {
			for (const file of new Glob("*.ts").scanSync("./src/commands/")) {
				const command = (await import(`~/commands/${file}`)) as {
					default: ICommand;
				};
				const { data, builder } = command.default;
				if (!data || !builder || !builder.toJSON) {
					error(`Invalid command file: ${file}`);
					continue;
				}
				commands.push(builder.toJSON());
			}

			if (guildId) {
				log(`Registering slash commands for guild ${guildId}`);
				await rest
					.put(
						Routes.applicationGuildCommands(
							process.env.APPLICATION_ID,
							guildId,
						),
						{ body: commands },
					)
					.then(() =>
						log(
							`Successfully registered the following slash commands for the guild: ${commands
								.map((command) => command.name)
								.join(", ")}`,
						),
					)
					.catch(error);
			} else {
				log("Registering global slash commands");
				await rest
					.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
						body: commands,
					})
					.then(() =>
						log(
							`Successfully registered the following global slash commands: ${commands
								.map((command) => command.name)
								.join(", ")}`,
						),
					)
					.catch(error);
			}
		}
	} catch (err) {
		error(err as string);
	}
})();
