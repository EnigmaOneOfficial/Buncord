
import { Client, Collection } from "discord.js"
import { db } from "../src/database/db"

export type IClient = Client & {
    commands: ICommands
    cooldowns: ICooldown
    events: IEvents
    db: typeof db
}

export type IEvent = {
    name: string
    once?: boolean
    execute: (client: IClient, ...args: any[]) => void
}

export type IEvents = Collection<string, IEvent>

export type ICommandData = {
    name: string
    description: string
    aliases?: string[]
    usage: string
    cooldown?: number
    guildOnly: boolean
    permissions: string[]
    args: boolean
}

export type ICommandExecute = (client: IClient, message: any, ...args: any) => void
export type ICommand = { data: ICommandData, execute: ICommandExecute }
export type ICommands = Collection<string, ICommand>
export type ICooldown = Collection<string, Collection<string, number>>