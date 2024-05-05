import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
// import { sql } from "drizzle-orm";

export const listing = sqliteTable("listing", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    unitId: integer("unit_id").references(() => unit.id),
    categoryId: integer("category_id").references(() => category.id),
    storeId: text("store_id").unique().notNull(),
    imageUrl: text("image_url"),
    snapEbt: integer("snap_sbt", { mode: "boolean" }).notNull(),
    title: text("title").notNull(),
});

export const category = sqliteTable("category", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").unique().notNull(),
});

export const unit = sqliteTable("unit", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("unit_type").unique().notNull(),
    display: text("unit_display").notNull(),
});

export const listingPrice = sqliteTable("listingPrice", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    listingId: integer("listing_id").references(() => listing.id).notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    available: integer("available", { mode: "boolean" }),
    salesRank: integer("sales_rank"),
    price: real("price").notNull(),
    totalUnits: real("total_units").notNull(),
});
