import { Events } from "discord.js";
import { log } from "../util/log";
import type { IEvent, IEventExecute } from "../../types/bot";
import { users } from "~/db/schema";

const name = Events.ClientReady;
const once = true;
const execute: IEventExecute<undefined> = async (client) => {
	log(`Bot: ${client.user?.tag}`);
	log(
		`Users: ${await client.db
			.select()
			.from(users)
			.then((user) => user.length)}`,
	);
	log(`Guilds: ${client.guilds.cache.map((guild) => guild.name).join(", ")}`);
	log(`Events: ${client.events.map((event) => event.name).join(", ")}`);
	log(
		`Commands: ${client.commands
			.map((command) => command.data.name)
			.join(", ")}`,
	);
};

const ready: IEvent<undefined> = {
	name,
	once,
	execute,
};

export default ready;
