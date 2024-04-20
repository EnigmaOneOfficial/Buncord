import { Glob } from "bun";
import { log } from "./log";

const schemaFilesSearch = new Glob("*.ts").scanSync(
	`${import.meta.dir}/../db/schemas`,
);

const schemaFiles = [];
for (const file of schemaFilesSearch) {
	if (file === "index.ts") continue;
	schemaFiles.push(file);
}

const imports = schemaFiles
	.map((file) => {
		const schemaName = file.split(".")[0];
		return `import { ${schemaName} } from "./schemas/${schemaName}";`;
	})
	.join("\n");

const exports = schemaFiles
	.map((file) => {
		const schemaName = file.split(".")[0];
		return schemaName;
	})
	.join(", ");

const schemaFileContent = `${imports}\n\nexport { ${exports} };\n`;

const outputPath = "src/db/schema.ts";
await Bun.write(outputPath, schemaFileContent);
log(`${outputPath}: Updated`);

const typesImports = schemaFiles
	.map((file) => {
		const schemaName = file.split(".")[0];
		return `import type { ${schemaName} } from "~/db/schemas/${schemaName}";`;
	})
	.join("\n");

const typesExports = schemaFiles
	.map((file) => {
		const schemaName = file.split(".")[0];
		const typeName = schemaName?.replace(/^./, (char) => char.toUpperCase());
		return `export type I${typeName} = NonNullableTable<typeof ${schemaName}.$inferSelect>;`;
	})
	.join("\n");

const typesFileContent = `${typesImports}
import type { NonNullableTable } from "./utility";

${typesExports}
`;

const typesOutputPath = "types/db.ts";
await Bun.write(typesOutputPath, typesFileContent);
log(`${typesOutputPath}: Updated`);
