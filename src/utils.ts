export function formatMoney(money: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(money);
}

export function formatCategory(category: string): string {
    return category.replaceAll("_", " ");
}

export type ItemInfo = {
    id: string;
    title: string;
    content: string;
    image: string;
    price: number;
    type: string;
    buy_quality: "GOOD" | "MEDIUM" | "BAD";
};
