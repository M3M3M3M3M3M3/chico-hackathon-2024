import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import safeway_data from "../../../static/safeway_clean_data.json";

export type SearchParams = {
    query: string;
    category: string;
    sortBy: "PRICE" | "PRICE_PER_WEIGHT";
    sortType: "ASCENDING" | "DESCENDING";
};

export const POST: RequestHandler = async ({ request }) => {
    const { query, category } = (await request.json()) as SearchParams;

    let newItems = (safeway_data as any).items.filter((item: any) => {
        return (
            (item.title as string)
                .toLowerCase()
                .includes(query.toLowerCase()) &&
            (!category || item.type === category)
        );
    });

    newItems.sort(
        (a: any, b: any) =>
            (a._temp.salesRank ?? 1_000_000) - (b._temp.salesRank ?? 1_000_000),
    );

    let categoryList = new Set<string>();
    for (let item of (safeway_data as any).items) {
        categoryList.add(item.type);
    }

    let categories = Array.from(categoryList).filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
    );

    return json({
        items: newItems.slice(0, 20),
        categories,
    });
};
