import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import safeway_data from "../../../../static/safeway_clean_data.json";

export type ItemInfo = {
    id: string;
    title: string;
    content: string;
    image: string;
    price: number;
    buy_quality: "GOOD" | "MEDIUM" | "BAD";
};

export const load: PageLoad<ItemInfo> = ({ params }) => {
    let id = params.slug;

    let item = safeway_data.items.filter((item) => item.id === id)[0];

    if (!item) error(404, "Not found");
    return item;
};
