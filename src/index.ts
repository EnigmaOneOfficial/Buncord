import { Glob } from "bun";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { db } from "./db";
import "dotenv/config";
import { error, log } from "./util/log";
import type {
	IClient,
	ICommand,
	ICommands,
	ICooldown,
	IEvent,
} from "../types/bot";

if (!process.env.TOKEN) {
	throw error("Missing TOKEN environment variable");
}

if (!process.env.APPLICATION_ID) {
	throw error("Missing APPLICATION_ID environment variable");
}

export const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
}) as IClient;

const commands = new Collection() as ICommands;
const cooldowns = new Collection() as ICooldown;
for (const file of new Glob("*.ts").scanSync("./src/commands/")) {
	const command = (await import(`./commands/${file}`)) as {
		default: ICommand;
	};
	if (!command.default) {
		error(`Invalid command file: ${file}`);
		continue;
	}
	const { data, onMessage, onInteraction } = command.default;
	if (!data) {
		error(`Invalid command file: ${file}`);
		continue;
	}
	commands.set(data.name, { data, onMessage, onInteraction });
	cooldowns.set(data.name, new Collection());
}
log(`Commands: ${commands.map((command) => command.data.name).join(", ")}`);

const events = new Collection<string, IEvent>();
for (const file of new Glob("*.ts").scanSync("./src/events/")) {
	const event = (await import(`./events/${file}`)) as {
		default: IEvent;
	};
	if (!event.default) {
		error(`Invalid event file: ${file}`);
		continue;
	}
	const { name, once, execute } = event.default;
	if (!name || !execute) {
		error(`Invalid event file: ${file}`);
		continue;
	}
	if (once) {
		bot.once(name, (...args) => execute(bot, ...args));
	} else {
		bot.on(name, (...args) => execute(bot, ...args));
	}

	events.set(name, { name, once, execute });
}
log(`Events: ${events.map((event) => event.name).join(", ")}`);

bot.commands = commands;
bot.events = events;
bot.cooldowns = cooldowns;
bot.db = db;

bot.login(process.env.TOKEN);
