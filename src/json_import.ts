// import units

import safeway_clean_data from "$lib/safeway_clean_data.json";
import { configDotenv } from "dotenv";
//import { db } from "./db";
import * as schema from "./schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";

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

for (let item of safeway_clean_data.items) {
    try {
        for (let upcoming_price of item.upcoming_prices) {
            let data = await db
                .select({ id: schema.item.id })
                .from(schema.item)
                .where(eq(schema.item.storeId, item.id));

            console.log("inserting", data);

            await db.insert(schema.itemPrice).values({
                itemId: data[0].id,
                date: new Date(upcoming_price.date),
                price: upcoming_price.price,
                // unitId: item.unit_price
                //     ? unitMapping[item.unit_price.type]
                //     : undefined,
                // pricePerUnit: item.unit_price?.canonical_unit.price_per,
                // totalUnits: item.unit_price?.canonical_unit.total_units,
                // availability: item.availability,
            });
        }
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
