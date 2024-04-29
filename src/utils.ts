export function formatMoney(money: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: money < 0.1 ? 3 : 2
    }).format(money);
}

export function formatCategory(category: string): string {
    return category.replaceAll("_", " ");
}
