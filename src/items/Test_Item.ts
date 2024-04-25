import type { IItem } from "~/schemas/user_items";

const item: IItem = {
	id: 3,
	name: "Test Item",
	description: "An item made purely for testing.",
	rarity: "Unobtainable",
	equippable: false,
	kind: "Unknown",
	stackable: true,
};

export default item;
