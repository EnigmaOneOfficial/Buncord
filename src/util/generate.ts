import { Glob } from "bun";
import { log } from "./log";

const schemaFilesSearch = new Glob("*.ts").scanSync(
	`${import.meta.dir}/../schemas`,
);
const schemaFiles = [];
for (const file of schemaFilesSearch) {
	if (file === "index.ts") continue;
	schemaFiles.push(file);
}

const imports = schemaFiles
	.map((file) => {
		const schemaName = file.split(".")[0];
		return `import { ${schemaName} } from "../schemas/${schemaName}";`;
	})
	.join("\n");

const exports = schemaFiles
	.map((file) => {
		const schemaName = file.split(".")[0];
		return schemaName;
	})
	.join(", ");

const fileContent = `${imports}\n\nexport { ${exports} };\n`;

const outputPath = "src/db/schema.ts";
await Bun.write(outputPath, fileContent);

log("schema.ts: Updated");
