import "dotenv/config";
import { db } from "./db";
import { migrate } from "drizzle-orm/libsql/migrator";

await migrate(db, { migrationsFolder: "./drizzle" });
