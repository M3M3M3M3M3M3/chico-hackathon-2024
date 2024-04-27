import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import safeway_data from "$lib/safeway_clean_data.json";

export type SearchParams = {
    query: string;
    sortBy: "PRICE" | "PRICE_PER_WEIGHT";
    sortType: "ASCENDING" | "DESCENDING";
};

export const POST: RequestHandler = async ({ request }) => {
    const { query } = (await request.json()) as SearchParams;

    let newItems = (safeway_data as any).items.filter((item: any) => {
        return (item.title as string).toLowerCase().includes(query);
    });

    newItems.sort(
        (a: any, b: any) =>
            (a._temp.salesRank ?? 1_000_000) - (b._temp.salesRank ?? 1_000_000),
    );

    return json(newItems.slice(0, 20));
};
