import { Events } from "discord.js";
import { log } from "../util/log";
import type { IEvent, IEventExecute } from "../../types/bot";

const name = Events.ClientReady;
const once = true;
const execute: IEventExecute = async (client) => {
	log(`Bot: ${client.user?.tag}`);
	log(`Guilds: ${client.guilds.cache.map((guild) => guild.name).join(", ")}`);
};

const ready: IEvent = {
	name,
	once,
	execute,
};

export default ready;
