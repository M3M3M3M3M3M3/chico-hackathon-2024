// import units

import safeway_clean_data from "$lib/safeway_clean_data.json";
import { configDotenv } from "dotenv";
//import { db } from "./db";
import * as schema from "./schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

configDotenv();

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });
let units = await db.query.unit.findMany();

const unitMapping: Record<string, number> = {};
for (let u of units) {
    unitMapping[u.unitType!] = u.id;
}

for (let item of safeway_clean_data.items.slice(985)) {
    try {
        let data = await db
            .insert(schema.item)
            .values({
                storeId: item.id,
                title: item.title,
                category: item.type,
                imageUrl: item.image,
                snapEbt: item.snap_ebt,
            })
            .returning({ id: schema.item.id });

        await db.insert(schema.itemPrice).values({
            itemId: data[0].id,
            date: new Date(),
            salesRank: item._temp.sales_rank,
            price: item.price,
            unitId: item.unit_price
                ? unitMapping[item.unit_price.type]
                : undefined,
            pricePerUnit: item.unit_price?.canonical_unit.price_per,
            totalUnits: item.unit_price?.canonical_unit.total_units,
            availability: item.availability,
        });
    } catch (e) {
        console.log(e);
    }
}

// for (let u of unitList) {
//     await db.insert(schema.unit).values({
//         unitType: u.type,
//         unitDisplay: u.display,
//     });
// }
