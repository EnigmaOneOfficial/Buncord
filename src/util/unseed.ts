import { db } from "../database/db";
import { test } from "../database/schemas/test";

await db.delete(test).execute();