import { and, eq, max, sql } from "drizzle-orm";
import { db } from "../db";
import { item, itemPrice, unit } from "../schema";
import type { PageServerLoad } from "./$types";
import Fuse from "fuse.js";

export type SearchParams = {
    query: string;
    category: string;
    sortBy: "PRICE" | "PRICE_PER_WEIGHT";
    sortType: "ASCENDING" | "DESCENDING";
};

export const load: PageServerLoad = async ({ url }) => {
    // let sortType = url.searchParams.get("sortType") ?? "ASCENDING";
    // let sortBy = url.searchParams.get("sortBy") ?? "PRICE_PER_WEIGHT";
    let category = url.searchParams.get("category") ?? "";
    let query = url.searchParams.get("q") ?? "";

    let itemId = url.searchParams.get("item") ?? "";

    let itemVal;

    if (itemId) {
        // itemVal = await db.query.item.findFirst({ with: { storeId: itemId } });

        itemVal = (
            await db
                .select({
                    id: item.storeId,
                    title: item.title,
                    date: max(itemPrice.date),
                    price: itemPrice.price,
                    image: item.imageUrl,
                    pricePerUnit: itemPrice.pricePerUnit,
                    category: item.category,
                    unitDisplay: unit.unitDisplay,
                })
                .from(item)
                .leftJoin(itemPrice, eq(item.id, itemPrice.itemId))
                .innerJoin(unit, eq(itemPrice.unitId, unit.id))
                .where(eq(item.storeId, itemId))
                .limit(1)
        )[0];
    }

    if (!query && !category) {
        return { categories: [], items: [], item: itemVal };
    }

    let newItems = await db
        .select({
            id: item.storeId,
            title: item.title,
            date: max(itemPrice.date),
            price: itemPrice.price,
            image: item.imageUrl,
            pricePerUnit: itemPrice.pricePerUnit,
            category: item.category,
            unitDisplay: unit.unitDisplay,
        })
        .from(item)
        .leftJoin(itemPrice, eq(item.id, itemPrice.itemId))
        .innerJoin(unit, eq(itemPrice.unitId, unit.id))
        .where(
            and(
                sql`${item.title} LIKE '%' || ${query} || '%' COLLATE NOCASE`,
                category ? sql`${item.category} = ${category}` : sql`1 = 1`,
            ),
        )
        .groupBy(item.id)
        .orderBy(category ? itemPrice.pricePerUnit : itemPrice.salesRank)
        .limit(category ? 1000 : 20);

    let categories = (
        await db
            .select({ category: item.category })
            .from(item)
            .groupBy(item.category)
    )
        .map((i) => i.category!)
        .filter((i) => i);

    const fuse = new Fuse(categories);
    categories = fuse
        .search(query)
        .map((i) => i.item)
        .slice(0, 10);

    let retval = {
        items: newItems,
        categories,
        itemVal,
    };

    console.log(retval);

    return retval;
};
