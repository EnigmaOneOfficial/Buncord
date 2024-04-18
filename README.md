<div align="center">
  <img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/buncord.png" alt="Buncord" width="200" height="200">
  <br>
  <b>Discord.js bot template focused on simplicity and reliability.</b>
</div>

## Stack

| Technology                                                                                                                                                                      | Description               |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------ |
| <img src="https://bun.sh/logo@2x.png" alt="Bun Logo" width="28"/> [Bun](https://bun.sh/)                                                                                        | JS/TS Runtime             |
| <img src="https://discord.js.org/static/logo.svg" alt="Discord.js Logo" width="28"/> [Discord.js](https://discord.js.org/)                                                      | Discord API Library       |
| <img src="https://avatars.githubusercontent.com/u/108468352?s=200&v=4" alt="Drizzle Logo" width="28"/> [Drizzle](https://orm.drizzle.team/)                                     | SQL ORM Library           |
| <img src="https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae" alt="TypeScript Logo" width="28"/> [TypeScript](https://www.typescriptlang.org/) | Typed JavaScript Language |

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