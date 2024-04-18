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

for (const file of new Glob("*.ts").scanSync("./src/commands/")) {
	const command = (await import(`~/commands/${file}`)) as {
		default: ICommand<unknown>;
	};
	const { data, builder } = command.default;

	if (!data || !builder) {
		error(`Invalid command file: ${file}`);
		continue;
	}

	commands.push(builder.toJSON());
}

if (!process.env.TOKEN) {
	throw error("Missing TOKEN environment variable.");
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		if (!process.env.CLIENT_ID) {
			throw error("Missing CLIENT_ID environment variable.");
		}

		log("Deleting existing application commands");
		await rest
			.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
			.then(() => log("Successfully deleted application command"))
			.catch(error);

		log("Registering slash commands");

		await rest
			.put(Routes.applicationCommands(process.env.CLIENT_ID), {
				body: commands,
			})
			.then(() =>
				log(
					`Successfully registered the following slash commands: ${commands
						.map((command) => command.name)
						.join(", ")}`,
				),
			)
			.catch(error);

		log(
			`Successfully reloaded the following slash commands: ${commands
				.map((command) => command.name)
				.join(", ")}`,
		);
	} catch (err) {
		error(err as string);
	}
})();
