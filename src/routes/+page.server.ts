import type { PageServerLoad } from "./$types";
import safeway_data from "$lib/safeway_clean_data.json";

export type SearchParams = {
    query: string;
    category: string;
    sortBy: "PRICE" | "PRICE_PER_WEIGHT";
    sortType: "ASCENDING" | "DESCENDING";
};

export const load: PageServerLoad = ({ url }) => {
    // let sortType = url.searchParams.get("sortType") ?? "ASCENDING";
    // let sortBy = url.searchParams.get("sortBy") ?? "PRICE_PER_WEIGHT";
    let category = url.searchParams.get("category") ?? "";
    let query = url.searchParams.get("q") ?? "";

    if (!query) {
        return { categories: [], items: [] };
    }

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

    if (!category) {
        newItems = newItems.slice(0, 20);
    }

    return {
        items: newItems,
        categories,
    };
};
