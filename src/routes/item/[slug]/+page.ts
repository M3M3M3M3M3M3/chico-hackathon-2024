import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export type ItemInfo = {
    id: string;
    title: string;
    content: string;
    img_url: string;
    price: string;
    buy_quality: "GOOD" | "MEDIUM" | "BAD";
};

export const load: PageLoad<ItemInfo> = ({ params }) => {
    return {
        id: "apple",
        title: "Banana",
        content: "It is a banana",
        img_url: "https://purr.objects-us-east-1.dream.io/i/baby2.jpg",
        price: "$10.00",
        buy_quality: "BAD",
    };

    // error(404, "Not found");
};
