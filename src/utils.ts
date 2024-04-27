export function formatMoney(money: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(money);
}

export type ItemInfo = {
    id: string;
    title: string;
    content: string;
    image: string;
    price: number;
    buy_quality: "GOOD" | "MEDIUM" | "BAD";
};
