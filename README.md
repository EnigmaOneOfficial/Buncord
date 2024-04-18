<div align="center">
  <img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/buncord.png" alt="Buncord" width="200" height="200">
  <br>
  <b>Discord.js bot template focused on simplicity and reliability.</b>
</div>

## Stack

| Technology                                                                                                                                                                        |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Bun Logo](https://bun.sh/logo.png) [Bun](https://bun.sh/) - JS/TS Runtime                                                                                                       |
| ![Discord.js Logo](https://discord.js.org/static/logo.svg) [Discord.js](https://discord.js.org/) - Discord API Library                                                            |
| ![Drizzle Logo](https://orm.drizzle.team/logo.svg) [Drizzle](https://orm.drizzle.team/) - SQL ORM Library                                                                         |
| ![TypeScript Logo](https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae) [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript Language |

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

On first run and whenever the schemas are updated in `src/database/schema.ts`, run the following command:

```bash
bun run remake
```

To start the bot, run the following command:

```bash
bun dev
```