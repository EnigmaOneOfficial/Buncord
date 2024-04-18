import { ICommand } from "../../types/db";

const ping: ICommand = {
    data: {
        name: "ping",
        description: "Replies with Pong!",
        usage: "!ping",
        cooldown: 5,
        guildOnly: false,
        permissions: [],
        args: false,
    },
    async execute(client, message) {
        await message.reply("Pong!");
    },
};

export default ping;