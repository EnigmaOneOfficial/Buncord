import type {
	ChatInputCommandInteraction,
	Client,
	Collection,
	Message,
	ModalSubmitInteraction,
	PermissionResolvable,
	SlashCommandBuilder,
} from "discord.js";
import type { db } from "~/db";

export type IClient = Client & {
	commands: ICommands;
	cooldowns: ICooldown;
	events: IEvents;
	db: typeof db;
};

export type IEventExecute<T = undefined> = (
	client: IClient,
	...args: T[]
) => void;

export type IEvent<T = undefined> = {
	name: string;
	once?: boolean;
	execute: IEventExecute<T>;
};

export type IEvents = Collection<string, IEvent>;

export type ICommandData = {
	name: string;
	description: string;
	aliases?: string[];
	usage?: string;
	cooldown?: number;
	permissions?: PermissionResolvable[];
};

export type ICommandExecute<T, K = undefined> = (
	client: IClient,
	interaction: T,
	...args: K[]
) => void;

export type ICommand<T = undefined> = {
	data: ICommandData;
	builder?: Partial<SlashCommandBuilder>;
	onMessage?: ICommandExecute<Message, T>;
	onInteraction?: ICommandExecute<
		ChatInputCommandInteraction | ModalSubmitInteraction,
		T
	>;
};
export type ICommands = Collection<string, ICommand>;
export type ICooldown = Collection<string, Collection<string, number>>;
