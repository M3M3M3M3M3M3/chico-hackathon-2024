import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export type ItemInfo = {
    title: string;
    content: string;
};

export const load: PageLoad<ItemInfo> = ({ params }) => {
    if (params.slug === "hello-world") {
        return {
            title: "Banana",
            content: "It is a banana",
        };
    }

    error(404, "Not found");
};
