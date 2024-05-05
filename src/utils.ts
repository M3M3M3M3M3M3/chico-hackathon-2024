export function formatMoney(money: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: money < 0.1 ? 3 : 2
    }).format(money);
}

type PriceDate = {
    price: number;
    totalUnits: number;
    available: boolean;
    date: Date;
}

export function priceDatesGetCurrent(priceDates: PriceDate[]): { current?: PriceDate, next?: PriceDate } {
    let current;

    let next;
    for (let priceDate of priceDates) {
        next = priceDate;
        if (new Date(priceDate.date) > new Date()) break;
        current = priceDate;
    }
    return { current, next };
}

export function formatCategory(category: string): string {
    return category.replaceAll("_", " ");
}
