import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { ItemInfo } from "../item/[slug]/+page";
import safeway_data from "$lib/safeway_clean_data.json";

export type SearchParams = {
    input: string;
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { input } = (await request.json()) as SearchParams;

    let newItems = (safeway_data as any).items
        .filter((item: any) => {
            return (item.title as string).toLowerCase().includes(input);
        })
        .slice(0, 20);

    return json(newItems);
};
