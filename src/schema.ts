import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
// import { sql } from "drizzle-orm";

export const item = sqliteTable("item", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: text("store_id").unique(),
    imageUrl: text("image_url"),
    category: text("category"),
    snapEbt: integer("snap_sbt", { mode: "boolean" }),
    title: text("title"),
});

export const unit = sqliteTable("unit", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    unitType: text("unit_type"),
    unitDisplay: text("unit_display"),
});

export const itemPrice = sqliteTable("item_price", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    itemId: integer("item_id").references(() => item.id),
    date: integer("date", { mode: "timestamp" }),
    availability: text("availability"),
    salesRank: integer("sales_rank"),
    price: real("price"),
    unitId: integer("unit_id").references(() => unit.id),
    pricePerUnit: real("price_per_unit"),
    totalUnits: real("total_units"),
});
