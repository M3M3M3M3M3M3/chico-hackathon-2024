import { and, eq, max, sql } from "drizzle-orm";
import { db } from "../db";
import { listing, unit, category, listingPrice } from "../schema";
import type { PageServerLoad } from "./$types";
import Fuse from "fuse.js";
import { priceDatesGetCurrent } from "../utils";

export const load: PageServerLoad = async ({ url }) => {
    let categoryName = url.searchParams.get("category") ?? "";
    let query = url.searchParams.get("q") ?? "";

    if (!query && !categoryName) {
        return { categories: [], items: [] };
    }

    let items = (await db
        .select({
            id: listing.storeId,
            title: listing.title,
            dates: sql`group_concat(${listingPrice.date})`,
            prices: sql`group_concat(${listingPrice.price})`,
            totalUnits: sql`group_concat(${listingPrice.totalUnits})`,
            image: listing.imageUrl,
            available: sql`group_concat(${listingPrice.available})`,
            category: category.name,
            unitDisplay: unit.display,
        })
        .from(listing)
        .innerJoin(unit, eq(listing.unitId, unit.id))
        .innerJoin(category, eq(listing.categoryId, category.id))
        .leftJoin(listingPrice, eq(listing.id, listingPrice.listingId))
        .where(
            and(
                sql`${listing.title} LIKE '%' || ${query} || '%' COLLATE NOCASE`,
                categoryName ? sql`${category.name} = ${categoryName}` : sql`1 = 1`
            )
        )
        .groupBy(listing.id)
        .orderBy(sql`MIN(${listingPrice.salesRank})`)
        .limit(categoryName ? 1000 : 20)).map((item) => {
            let totalUnits = (item.totalUnits as string).split(",").map(p => +p) as number[];
            let prices = (item.prices as string).split(",").map(p => +p) as number[];
            let dates = (item.dates as any).split(",").map((d: string) => new Date(+d * 1000)) as Date[];
            let availables = (item.available as string).split(",").map(a => +a === 1);

            let priceDates = prices.map((price, i) => ({
                price,
                totalUnits: totalUnits[i],
                available: availables[i],
                date: dates[i],
            }));

            priceDates.sort((a, b) => a.date.getTime() - b.date.getTime());

            return {
                id: item.id,
                title: item.title,
                priceDates,
                unitDisplay: item.unitDisplay,
                image: item.image,
                category: item.category,
            }
        });

    if (categoryName) {
        items.sort((a, b) => {
            let { current: currentA } = priceDatesGetCurrent(a.priceDates);
            let { current: currentB } = priceDatesGetCurrent(b.priceDates);

            return (currentA!.price / currentA!.totalUnits) - (currentB!.price / currentB!.totalUnits)
        });
    }


    let categories = (
        await db
            .select({ name: category.name })
            .from(category)
    )
        .map((i) => i.name);

    const fuse = new Fuse(categories);
    categories = fuse
        .search(query)
        .map((i) => i.item)
        .slice(0, 10);

    return {
        items,
        categories,
    };
};
