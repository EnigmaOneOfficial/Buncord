import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} from "discord.js";
import type { ICommand, ICommandData, ICommandExecute } from "../../types/bot";
import { getUser, getInventory, items } from "~/db";
import type { IInventories } from "~/schemas/inventories";
import type { IUsers } from "~/schemas/users";

const builder = new SlashCommandBuilder()
	.setName("profile")
	.setDescription("Displays your profile information.");

const data: ICommandData = {
	name: "profile",
	description: "Displays your profile information.",
	usage: "!profile",
	cooldown: 5,
	aliases: ["p"],
};

const createProfileEmbed = (user: IUsers, inventory: IInventories[]) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Profile`)
		.setThumbnail(user.avatar)
		.addFields({ name: "Level", value: user.level.toString(), inline: true })
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

const createProfileActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("inventory")
			.setLabel("Inventory")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("shop")
			.setLabel("Shop")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("dungeons")
			.setLabel("Dungeons")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("settings")
			.setLabel("Settings")
			.setStyle(ButtonStyle.Primary),
	);

	return actionRow;
};

const createInventoryEmbed = (user: IUsers, inventory: IInventories[]) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Inventory`)
		.setColor("#FFD700")
		.setTimestamp();

	if (inventory.length === 0) {
		embed.setDescription("Your inventory is empty.");
	} else {
		const inventoryList = inventory
			.map((item) => `${item.details.name} x${item.quantity}`)
			.join("\n");
		embed.setDescription(inventoryList);
	}

	return embed;
};

const createInventoryActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("back")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

const createShopEmbed = () => {
	const embed = new EmbedBuilder()
		.setTitle("Shop")
		.setColor("#FFD700")
		.setTimestamp();

	const shopItems = items
		.map((item) => `${item.name} - ${item.price} gold`)
		.join("\n");
	embed.setDescription(shopItems);

	return embed;
};

const createShopActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("back")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

const createDungeonsEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle("Dungeons")
		.setColor("#FFD700")
		.setTimestamp()
		.addFields(
			{
				name: "Current Dungeon",
				value: user.currentDungeon || "None",
				inline: false,
			},
			{
				name: "Highest Dungeon Level",
				value: user.highestDungeonLevel.toString(),
				inline: false,
			},
		);

	return embed;
};

const createDungeonsActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("back")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

const createSettingsEmbed = (user: IUsers) => {
	const embed = new EmbedBuilder()
		.setTitle(`${user.username}'s Settings`)
		.setColor("#FFD700")
		.setTimestamp();

	return embed;
};

const createSettingsActionRow = () => {
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("back")
			.setLabel("Back")
			.setStyle(ButtonStyle.Secondary),
	);

	return actionRow;
};

const onInteraction: ICommandExecute<ChatInputCommandInteraction> = async (
	client,
	interaction,
) => {
	const user = await getUser(interaction.user.id);
	if (!user) return;

	const inventory = await getInventory(interaction.user.id);
	const profileEmbed = createProfileEmbed(user, inventory);
	const profileActionRow = createProfileActionRow();

	const message = await interaction.reply({
		embeds: [profileEmbed],
		components: [profileActionRow],
		fetchReply: true,
	});

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 60000,
	});

	collector.on("collect", async (i) => {
		if (i.user.id !== interaction.user.id) {
			await i.reply({
				content: "You cannot use this button.",
				ephemeral: true,
			});
			return;
		}

		await i.deferUpdate();

		const selectedPage = i.customId;

		let updatedEmbed: EmbedBuilder = profileEmbed;
		let updatedActionRow: ActionRowBuilder<ButtonBuilder> = profileActionRow;

		switch (selectedPage) {
			case "inventory":
				updatedEmbed = createInventoryEmbed(user, inventory);
				updatedActionRow = createInventoryActionRow();
				break;
			case "shop":
				updatedEmbed = createShopEmbed();
				updatedActionRow = createShopActionRow();
				break;
			case "dungeons":
				updatedEmbed = createDungeonsEmbed(user);
				updatedActionRow = createDungeonsActionRow();
				break;
			case "settings":
				updatedEmbed = createSettingsEmbed(user);
				updatedActionRow = createSettingsActionRow();
				break;
			case "back":
				updatedEmbed = createProfileEmbed(user, inventory);
				updatedActionRow = createProfileActionRow();
				break;
		}

		await interaction.editReply({
			embeds: [updatedEmbed],
			components: [updatedActionRow],
		});

		collector.resetTimer();
	});

	collector.on("end", async () => {
		await interaction.editReply({
			components: [],
		});
	});
};

const profile: ICommand = {
	builder,
	data,
	onInteraction,
};

export default profile;
