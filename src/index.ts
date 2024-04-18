import { Glob } from "bun";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { db } from "./database/db";
import "dotenv/config";
import { error } from "./util/log";
import type { IClient, ICommands, ICooldown, IEvent, ICommand } from "../types/db";

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
  const command = await import(`./commands/${file}`) as {
    default: ICommand;
  }
  const { data, execute } = command.default;
  if (!data || !execute) {
    error(`Invalid command file: ${file}`);
    continue;
  }
  commands.set(data.name, { data, execute });
  cooldowns.set(data.name, new Collection());
}

const events = new Collection<string, IEvent>();
for (const file of new Glob("*.ts").scanSync("./src/events/")) {
  const event = await import(`./events/${file}`) as {
    default: IEvent;
  }
  const { name, once, execute } = event.default;
  if (!name || !execute) {
    error(`Invalid event file: ${file}`);
    continue;
  }
  if (once) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    bot.once(name, (...args: any[]) => execute(bot, ...args));
  } else {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    bot.on(name, (...args: any[]) => execute(bot, ...args));
  }

  events.set(name, { name, once, execute });
}

bot.commands = commands;
bot.events = events;
bot.cooldowns = cooldowns;
bot.db = db;

if (!process.env.TOKEN) {
  throw new Error("Missing TOKEN environment variable");
}

bot.login(process.env.TOKEN);