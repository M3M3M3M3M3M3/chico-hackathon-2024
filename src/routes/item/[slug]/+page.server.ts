import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { item, itemPrice, unit } from "../../../schema";
import { max, eq, sql } from "drizzle-orm";
import { db } from "../../../db";

export const load: PageServerLoad = async ({ params }) => {
    // validate slug
    if (!params.slug.match(/^[0-9]+$/)) {
        return error(404, "Not Found");
    }

    let itemId = params.slug;

    console.log("hi");

    let results = await db
        .select({
            id: item.storeId,
            title: item.title,
            date: itemPrice.date,
            price: itemPrice.price,
            image: item.imageUrl,
            availability: itemPrice.availability,
            pricePerUnit: itemPrice.pricePerUnit,
            category: item.category,
            unitDisplay: unit.unitDisplay,
        })
        .from(item)
        .leftJoin(itemPrice, eq(item.id, itemPrice.itemId))
        .leftJoin(unit, eq(itemPrice.unitId, unit.id))
        .where(eq(item.storeId, itemId));

    let priceDates = results.map((result) => ({
        date: result.date,
        price: result.price,
        pricePerUnit: result.pricePerUnit
    }));

    return {
        id: results[0].id,
        title: results[0].title,
        category: results[0].category,
        image: results[0].image,

        priceDates,
    };
};
