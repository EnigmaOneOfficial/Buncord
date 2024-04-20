export type NonNullableTable<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type PrimitiveTable = {
	[key: string]: string | number | boolean | PrimitiveTable;
};
