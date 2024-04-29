export function formatMoney(money: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(money);
}

export function formatCategory(category: string): string {
    return category.replaceAll("_", " ");
}
