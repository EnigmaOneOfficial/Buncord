import { Events } from "discord.js";
import { log } from "../util/log";
import type { IEvent } from "../../types/db";

const ready: IEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        log(`User: ${client.user?.tag}`);
        log(`Guilds: ${client.guilds.cache.map((guild) => guild.name).join(", ")}`);
        log(`Events: ${client.events.map((event) => event.name).join(", ")}`)
        log(`Commands: ${client.commands.map((command) => command.data.name).join(", ")}`);
    },
}

export default ready;