// import units

import safeway_clean_data from "$lib/safeway_clean_data.json";
import { configDotenv } from "dotenv";
//import { db } from "./db";
import * as schema from "./schema";
import { listingPrice, listing, category, unit } from "./schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq, sql } from "drizzle-orm";
import asyncq from "async-q";

configDotenv();

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });

let tasks = safeway_clean_data.items.map((item, i) => async () => {
    console.log(`[${i}] Inserting item storeId=${item.id}`);

    try {
        await db.insert(category).values({
            name: item.type
        }).onConflictDoNothing();
        let categoryId = (await db.select({ id: category.id }).from(category).where(eq(category.name, item.type)))[0].id;

        let unitId = undefined;
        if (item.unit_price) {
            await db.insert(unit).values({
                type: item.unit_price.type,
                display: item.unit_price.canonical_unit.display
            }).onConflictDoNothing();

            unitId = (await db.select({ id: unit.id }).from(unit).where(eq(unit.display, item.unit_price.canonical_unit.display)))[0].id;
        }

        // insert item if it doesn't exist
        await db.insert(listing).values({
            storeId: item.id,
            title: item.title,
            imageUrl: item.image,
            categoryId,
            unitId,
            snapEbt: item.snap_ebt,
        }).onConflictDoNothing();

        await db.insert(listingPrice).values({
            listingId: sql<number>`(SELECT ${listing.id} FROM ${listing} WHERE ${listing.storeId} = ${item.id})`,
            date: new Date("2024-04-27"),
            available: item.availability === "in_stock",
            salesRank: item._temp.sales_rank,
            price: item.price,
            totalUnits: item.unit_price?.canonical_unit.total_units ?? 1,
        });
    } catch (e) {
        console.log(e);
    }
});

asyncq.parallelLimit(tasks, 20);
