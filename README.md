<div align="center">
  <img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/buncord.png" alt="Buncord" width="200" height="200">
  <br>
  <a href="https://github.com/EnigmaOneOfficial/Buncord/stargazers"><img src="https://img.shields.io/github/stars/EnigmaOneOfficial/Buncord?style=social" alt="Stars Badge"/></a>
  <a href="https://github.com/EnigmaOneOfficial/Buncord/issues"><img src="https://img.shields.io/github/issues/EnigmaOneOfficial/Buncord" alt="Issues Badge"/></a>
  <a href="https://github.com/EnigmaOneOfficial/Buncord/blob/main/LICENSE"><img src="https://img.shields.io/github/license/EnigmaOneOfficial/Buncord" alt="License Badge"/></a>
  <br>
  <b>Discord.js bot template focused on simplicity and reliability.</b>
</div>


## Stack

| Technology                                                                                                                                                                                     | Context                                                                |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| <div align="center"><img src="https://bun.sh/logo@2x.png" alt="Bun Logo" width="32"/><div align="center">[Bun](https://bun.sh/)</div></div>                                                                                     | Runtime       |
| <div align="center"><img src="https://discord.js.org/static/logo.svg" alt="Discord.js Logo" width="64"/><div align="center">[Discord.js](https://discord.js.org/)</div></div>                                                  | Discord API |
| <div align="center"><img src="https://avatars.githubusercontent.com/u/108468352?s=200&v=4" alt="Drizzle Logo" width="32"/><div align="center">[Drizzle](https://orm.drizzle.team/)</div></div>                                     | Database     |
| <div align="center"><img src="https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae" alt="TypeScript Logo" width="32"/><div align="center">[TypeScript](https://www.typescriptlang.org/)</div></div> | Language      |

## Install

```bash
git clone https://github.com/EnigmaOneOfficial/Buncord
cd Buncord
bun i
```

## Setup

0. Create a `.env` file in the root directory with the following content:

```env
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_bot_client_id
```

## Run

1. First, generate the database files:

```bash
bun run remake
# Rerun this whenever the files in the `src/database/schemas` directory are changed
```

2. Next, register the bot's slash commands with Discord:

```bash
bun run register
# Rerun this whenever the slash command builders in the `src/commands` directory are changed
```

3. Finally, start the bot:

```bash
bun dev
```
