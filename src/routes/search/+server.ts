import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { ItemInfo } from "../item/[slug]/+page";

export type SearchParams = {
    input: string;
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { input } = (await request.json()) as SearchParams;

    return json(
        [
            {
                id: "apple",
                title: "Apple",
                content: "it is an apple",
                img_url: "https://purr.objects-us-east-1.dream.io/i/baby2.jpg",
                price: "$150.00",
                buy_quality: "GOOD",
            },
            {
                id: "pear",
                title: "Pear",
                content: "it is an apple (kind of)",
                img_url: "https://purr.objects-us-east-1.dream.io/i/baby2.jpg",
                price: "$10.00",
                buy_quality: "GOOD",
            },
            {
                id: "grape",
                title: "Grape",
                content: "it is not an apple",
                img_url: "https://purr.objects-us-east-1.dream.io/i/baby2.jpg",
                price: "$5.00",
                buy_quality: "GOOD",
            },
        ] as ItemInfo[],
        { status: 201 },
    );
};
