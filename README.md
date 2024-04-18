<div align="center">
  <img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/buncord.png" alt="Buncord" width="200" height="200">
  <br>
  <b>Discord.js bot template focused on simplicity and reliability.</b>
</div>

## Stack

| Technology                                                                                                                                                                                     | Description                                                                |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| <div align="center"><img src="https://bun.sh/logo@2x.png" alt="Bun Logo" width="32"/>[Bun](https://bun.sh/)</div>                                                                                        | Runtime       |
| <div align="center"><img src="https://discord.js.org/static/logo.svg" alt="Discord.js Logo" width="32"/>[Discord.js](https://discord.js.org/)</div>                                                      | Discord API |
| <div align="center"><img src="https://avatars.githubusercontent.com/u/108468352?s=200&v=4" alt="Drizzle Logo" width="32"/>[Drizzle](https://orm.drizzle.team/)</div>                                     | Database     |
| <div align="center"><img src="https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae" alt="TypeScript Logo" width="32"/><div align="center">[TypeScript](https://www.typescriptlang.org/)</div></div> | Language      |

## Install

```bash
git clone https://github.com/EnigmaOneOfficial/Buncord
cd Buncord
bun i
```

## Setup

Create a `.env` file in the root directory with the following content:

```env
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_bot_client_id
```

## Run

First, generate the database files:

```bash
bun run remake
# Rerun this whenever the files in the `src/database/schemas` directory are changed
```

Next, register the bot's slash commands with Discord:

```bash
bun run register
# Rerun this whenever the slash command builders in the `src/commands` directory are changed
```

Finally, start the bot:

```bash
bun dev
```
