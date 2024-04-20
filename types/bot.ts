import type {
	ChatInputCommandInteraction,
	Client,
	Collection,
	Message,
	PermissionResolvable,
	SlashCommandBuilder,
} from "discord.js";
import type { db } from "~/db";
import type { PrimitiveTable } from "./utility";

export type IClient = Client & {
	commands: ICommands;
	cooldowns: ICooldown;
	events: IEvents;
	db: typeof db;
};

export type IEventExecute<T> = (client: IClient, ...args: T[]) => void;
export type IEvent<T> = {
	name: string;
	once?: boolean;
	execute: IEventExecute<T>;
};

export type IEvents = Collection<string, IEvent<unknown>>;

export type ICommandData = {
	name: string;
	description: string;
	aliases?: string[];
	usage: string;
	cooldown?: number;
	permissions?: PermissionResolvable[];
};

export type ICommandExecute<T> = (
	client: IClient,
	interaction: T,
	args?: string[],
) => void;
export type ICommand = {
	data: ICommandData;
	builder?: Partial<SlashCommandBuilder>;
	onMessage?: ICommandExecute<Message>;
	onInteraction?: ICommandExecute<ChatInputCommandInteraction>;
};
export type ICommands = Collection<string, ICommand>;
export type ICooldown = Collection<string, Collection<string, number>>;
