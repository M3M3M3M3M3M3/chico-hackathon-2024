import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { item, itemPrice, unit } from "../../../schema";
import { max, eq } from "drizzle-orm";
import { db } from "../../../db";

export const load: PageServerLoad = async ({ params }) => {
    // validate slug
    if (!params.slug.match(/^[0-9]+$/)) {
        return error(404, "Not Found");
    }

    let itemId = params.slug;

    return (
        await db
            .select({
                id: item.storeId,
                title: item.title,
                date: max(itemPrice.date),
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
            .where(eq(item.storeId, itemId))
            .limit(1)
    )[0];
};
