import * as schema from "./schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { configDotenv } from "dotenv";
import fs from "node:fs"
import similarity from 'compute-cosine-similarity';
import readline from 'node:readline'

configDotenv();

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });

let items = await db.select().from(schema.item).all();
// let embeddings: Record<number, number[]> = {};

// var lineReader = readline.createInterface({
//     input: fs.createReadStream('./embeddings-llama.json')
// });

// let celsius = items.find(i => i.title === "Celsius Calorie Reducing Drink Orange - 12 Oz")!;
// console.log(celsius);

// lineReader.on('line', function(line) {
//     let r = line.split(' : ');

//     // if (r[0] === '3831')
//     //     console.log(r[1])

//     embeddings[+r[0]] = JSON.parse(r[1]);
// });


// lineReader.on('close', () => {
//     items.sort((a, b) => similarity(embeddings[celsius.id], embeddings[a.id])! - similarity(embeddings[celsius.id], embeddings[b.id])!);

//     for (let item of items) {
//         console.log(`a:${celsius.id}, b:${item.id} [${similarity(embeddings[celsius.id], embeddings[item.id])}] ${item.title}`);
//     }
// });


let i = 0;
// let writer = fs.createWriteStream("./embeddings-llama.json");
// let embeddings: Record<string, any> = {};

let categories = new Set();

for (let item of items) {
    let title = item.title

    let res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
            model: "llama3",
            stream: false,
            prompt: `Put the following product into a category: "${title}"\n\nPlease, if applicable, pick from one of the following categories. If the item does NOT fit into an existing category, create a new one. Additionally, the categories should be very specific, referring to the specific type of item rather than an overall group.\nExamples: "Olive Oil" instead of "Cooking Oil," "Milk" instead of "Dairy," "Ribeye" instead of "Meat," "Chicken Broth" instead of "Broth," "Watermelon" instead of "Fruit."\n  You should NOT differentiate based on the packaging method of the item -- "Canned Beans" and "Dry Beans" would both beylong in the "Beans" category.\nExisting categories: ${Array.from(categories).join(", ")}\n\nOutput ONLY the category for the item with no additional text.`
        }),
    });


    // let res = await fetch("http://localhost:11434/api/embeddings", {
    //     method: "POST",
    //     body: JSON.stringify({
    //         model: "llama3",
    //         "prompt": item.title
    //     }),
    // });
    let resJson = await res.json();

    categories.add(resJson.response.trim());
    console.log(`${title} => ${resJson.response}\n - ${Array.from(categories).join('\n - ')}`);

    // embeddings[item.id] = resJson.embedding;
    // console.log(`${i} ${title}`);
    // writer.write(`${item.id} : ${JSON.stringify(resJson.embedding)}\n`)
    // i += 1;
}

// writer.close();
