import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export type ItemInfo = {
    title: string;
    content: string;
    buy_quality: "GOOD" | "MEDIUM" | "BAD";
};

export const load: PageLoad<ItemInfo> = ({ params }) => {
    if (params.slug === "hello-world") {
        return {
            title: "Banana",
            content: "It is a banana",
            buy_quality: "BAD",
        };
    }

    error(404, "Not found");
};
