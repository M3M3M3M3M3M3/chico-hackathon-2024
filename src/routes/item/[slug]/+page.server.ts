import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { category, listing, listingPrice, unit } from "../../../schema";
import { max, eq, sql } from "drizzle-orm";
import { db } from "../../../db";

export const load: PageServerLoad = async ({ params }) => {
    // validate slug
    if (!params.slug.match(/^[0-9]+$/)) {
        return error(404, "Not Found");
    }

    let itemId = params.slug;

    let results = await db
        .select({
            id: listing.storeId,
            title: listing.title,
            date: listingPrice.date,
            price: listingPrice.price,
            totalUnits: listingPrice.totalUnits,
            image: listing.imageUrl,
            availability: listingPrice.available,
            category: category.name,
            unitDisplay: unit.display,
        })
        .from(listing)
        .innerJoin(listingPrice, eq(listing.id, listingPrice.listingId))
        .innerJoin(unit, eq(listing.unitId, unit.id))
        .innerJoin(category, eq(listing.categoryId, category.id))
        .where(eq(listing.storeId, itemId)).all();

    let priceDates = results.map((result) => ({
        date: result.date,
        price: result.price,
        totalUnits: result.totalUnits,
    }));

    return {
        id: results[0].id,
        title: results[0].title,
        category: results[0].category,
        image: results[0].image,

        priceDates,
    };
};
