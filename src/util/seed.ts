import { db } from "../database/db";
import { test } from "../database/schemas/test";

await db.insert(test).values([
    {
        title: "The Matrix",
        releaseYear: 1999,
    },
    {
        title: "The Matrix Reloaded",
        releaseYear: 2003,
    },
    {
        title: "The Matrix Revolutions",
        releaseYear: 2003,
    },
]);

console.log(`Seeding complete.`);