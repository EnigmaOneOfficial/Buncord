<div align="center">
  <img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/buncord.png" alt="Buncord" width="200" height="200">
  <br>
  <a href="https://github.com/EnigmaOneOfficial/Buncord/stargazers"><img src="https://img.shields.io/github/stars/EnigmaOneOfficial/Buncord?style=social" alt="Stars Badge"/></a>
  <a href="https://github.com/EnigmaOneOfficial/Buncord/issues"><img src="https://img.shields.io/github/issues/EnigmaOneOfficial/Buncord" alt="Issues Badge"/></a>
  <br>
  <b>Simple, Reliable, Beautiful</b>
</div>

## Quickstart

Clone the repo and install dependencies:

```bash
git clone https://github.com/EnigmaOneOfficial/Buncord
cd Buncord
bun i
```

Get your [token and application id](https://discord.com/developers/applications) and put them in a `.env` file in the root directory of the project:

```env
TOKEN=your_discord_bot_token
APPLICATION_ID=your_discord_bot_application_id
```

Start the bot:

```bash
bun start
# To enable hot reloading, run:
# bun dev
```

## Slash Commands: `src/commands`

Register the commands:

```bash
bun run bot:register
# To register guild-specific commands, run:
# bun run bot:register --guild 1234567890
```

Unregister the commands:

```bash
bun run bot:unregister
# To unregister guild-specific commands, run:
# bun run bot:unregister --guild 1234567890
```

*Note: Registration takes about an hour for global - and seconds for guild-specific.*

## Stack

<div align="center">

| Logo                                                                                                                                                             | Name                                          | Context     |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :---------- |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/bun.png" alt="Bun Logo" width="28"/></div>               | [Bun](https://bun.sh/)                        | Runtime     |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/discord.svg" alt="Discord.js Logo" width="64"/></div>    | [Discord.js](https://discord.js.org/)         | Discord API |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/drizzle.png" alt="Drizzle Logo" width="28"/></div>       | [Drizzle](https://orm.drizzle.team/)          | Database    |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/typescript.png" alt="TypeScript Logo" width="28"/></div> | [TypeScript](https://www.typescriptlang.org/) | Language    |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/biome.svg" alt="Biome Logo" width="64"/></div>           | [Biome](https://biomejs.dev/)                 | Linter      |

</div>
