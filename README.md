<div align="center">
  <h1>Buncord</h1>
  <b>Discord bot template with a focus on simplicity.</b>
  <img src="https://raw.githubusercontent.com/EnigmaOneOfficial/Buncord/master/assets/buncord.png" alt="Buncord" width="200" height="200">
</div>

## Stack

- [Bun](https://bun.sh/)
- [Discord.js](https://discord.js.org/)
- [Drizzle](https://orm.drizzle.team/)
- [TypeScript](https://www.typescriptlang.org/)

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