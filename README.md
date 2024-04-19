<div align="center">
  <img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/buncord.png" alt="Buncord" width="200" height="200">
  <br>
  <a href="https://github.com/EnigmaOneOfficial/Buncord/stargazers"><img src="https://img.shields.io/github/stars/EnigmaOneOfficial/Buncord?style=social" alt="Stars Badge"/></a>
  <a href="https://github.com/EnigmaOneOfficial/Buncord/issues"><img src="https://img.shields.io/github/issues/EnigmaOneOfficial/Buncord" alt="Issues Badge"/></a>
  <br>
  <b>Open source Discord bot template focused on simplicity and reliability.</b>
</div>

## Stack

<div align="center">

| Technology                                                                                                                                                                                     | Context                                                                |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/bun.png" alt="Bun Logo" width="32"/><div align="center">[Bun](https://bun.sh/)</div></div>                                                                                     | Runtime       |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/discord.svg" alt="Discord.js Logo" width="64"/><div align="center">[Discord.js](https://discord.js.org/)</div></div>                                                  | Discord API |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/drizzle.png" alt="Drizzle Logo" width="32"/><div align="center">[Drizzle](https://orm.drizzle.team/)</div></div>                                     | Database     |
| <div align="center"><img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/typescript.png" alt="TypeScript Logo" width="32"/><div align="center">[TypeScript](https://www.typescriptlang.org/)</div></div> | Language      |
</div>

## Quickstart

### Install

```bash
git clone https://github.com/EnigmaOneOfficial/Buncord
cd Buncord
bun i
```

### Environment

Get your [Discord bot token](https://discord.com/developers/applications) and [application ID](https://discord.com/developers/applications) and put them in a `.env` file in the root directory of the project:

```env
TOKEN=your_discord_bot_token
APPLICATION_ID=your_discord_bot_application_id
```

### Database

Build the database (`src/database/schemas`):

```bash
bun run db:build
```

### Slash Commands

Register the slash commands (`src/commands`):

```bash
# Register to a specific guild: --guild <guild_id>
bun run bot:register
```

Unregister the slash commands:

```bash
# Unregister from a specific guild: --guild <guild_id>
bun run bot:unregister
```

### Run

Start with hot reloading:

```bash
bun dev
```

Start without hot reloading:

```bash
bun start
```
