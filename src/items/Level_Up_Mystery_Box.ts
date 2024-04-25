import type { IItem } from "~/schemas/user_items";

const item: IItem = {
	id: 2,
	name: "Level Up Mystery Box",
	description: "A reward for levelling up that contains a random item!",
	rarity: "Uncommon",
	equippable: false,
	kind: "Consumable",
	stackable: true,
};

export default item;
