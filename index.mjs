import fetch from "node-fetch";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { ProductSet } from "./idSet.mjs";

const Checklist = new Set(ProductSet);

let STOP = false;

const stores = {
  W_SACRAMENTO: 256,
};

const productSearchUrl =
  "https://www.safeway.com/abs/pub/xapi/pgmsearch/v1/search/products";

const headers = {
  "User-Agent": "safewapi/0.1.0",
  "Ocp-Apim-Subscription-Key": "5e790236c84e46338f4290aa1050cdd4",
  Connection: "keep-alive",
};

async function fetchData(start, retries = 0, query = "*") {
  const params = new URLSearchParams({
    "request-id": _getUTCTimeStampRandom(),
    url: "https://www.safeway.com",
    pageurl: "https://www.safeway.com",
    pagename: "search",
    "search-type": "keyword",
    storeid: stores.W_SACRAMENTO,
    sort: "",
    dvid: "web-4.1search",
    channel: "instore",
    q: query,
    rows: "30",
  });

  const url = `${productSearchUrl}?${params.toString()}&start=${start}`;
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.primaryProducts.appCode === "[GR204] [PP: 200] [SD200]") {
      STOP = true;
      return;
    }

    if (data.primaryProducts.appCode === "400") {
      throw new Error("Request-id invalid");
    }

    const appMsgs = [data.appMsg, data.primaryProducts.appMsg];
    let hasTimeoutException = false;

    appMsgs.forEach((appMsg) => {
      if (appMsg && appMsg.includes("A-CT: TimeoutException")) {
        hasTimeoutException = true;
      }
    });

    if (hasTimeoutException) {
      if (retries < 10) {
        console.log(`Retrying due to TimeoutException (Retry ${retries + 1})`);
        return await fetchData(start, retries + 1);
      } else {
        throw new Error("Max retries exceeded due to TimeoutException");
      }
    }
    return data;
  } catch (error) {
    throw new Error(`Error fetching data from ${url}: ${error.message}`);
  }
}

async function paginateAndWrite(forceFetch = false) {
  let start = 0;

  try {
    while (!STOP) {
      const filename = `safeway_data_${start}.json`;
      const filePath = path.join(filename);

      // Check if the file exists
      try {
        await fsPromises.access(filePath);
        if (!forceFetch) {
          console.log(`${filename} already exists. Skipping...`);
          start += 30;
          continue;
        }
      } catch (error) {
        // File does not exist or error accessing it, proceed with fetching
      }

      const data = await fetchData(start);
      if (!STOP) {
        await fsPromises.writeFile(filePath, JSON.stringify(data));
        console.log(`Fetched ${start + 30} items and saved to ${filename}`);
        // Check if all known items are found
        for (const item of data.primaryProducts.response.docs) {
          if (Checklist.has(item.id)) {
            Checklist.delete(item.id);
            // Check for new items never found before
          } else if (!ProductSet.has(item.id)) {
            console.log(
              `Missing item ${item.id} found and added to missing.txt`,
            );
            fs.appendFile("missing.txt", item.id + "\n", (err) => {});
          }
        }
        start += 30;
        await sleep();
      }
    }
    // Handle items not found in checklist
    console.log(
      `${Checklist.size} items expected but not found. Attempting to refetch`,
    );
    for (let fetchNum = 0; fetchNum < 2; fetchNum++) {
      const chunks = (() => {
        const items = Array.from(Checklist);
        const result = [];

        for (let i = 0; i < items.length; i += 30) {
          const chunk = items.slice(i, i + 30);
          result.push(chunk.join(", "));
        }
        return result;
      })();

      for (const chunk of chunks) {
        const data = await fetchData(0, 0, chunk);
        if (data?.primaryProducts?.response?.numFound > 0) {
          const filename = `safeway_data_${start}.json`;
          const filePath = path.join(filename);
          await fsPromises.writeFile(filePath, JSON.stringify(data));
          console.log(
            `Refetch ${fetchNum + 1} found ${data.primaryProducts.response.numFound} items and saved to ${filename}`,
          );
          // Check if all known items are found
          if (!data.primaryProducts.response.docs) {
            continue;
          }
          for (const item of data.primaryProducts.response.docs) {
            if (Checklist.has(item.id)) {
              Checklist.delete(item.id);
            }
          }
          start += 30;
          await sleep();
        }
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function _getUTCTimeStampRandom() {
  return (
    Math.floor(900 * Math.random() + 100).toString() +
    Date.now() +
    Math.floor(900 * Math.random() + 100).toString()
  );
}

const clean_data = [];

const units = [
  {
    type: "each",
    unit: "each",
    conversion_factor: {
      each: {
        units: 1,
        name: "each",
      },
      dozen: {
        units: 12,
        name: "dozen",
      },
      count: {
        units: 1,
        name: "each",
      },
      plate: {
        units: 1,
        name: "plate",
      },
      bag: {
        units: 1,
        name: "bag",
      },
      stick: {
        units: 1,
        name: "stick",
      },
      bttry: {
        units: 1,
        name: "battery",
      },
      roll: {
        units: 1,
        name: "roll",
      },
      pair: {
        units: 1,
        name: "pair",
      },
      bulb: {
        units: 1,
        name: "bulb",
      },
      diapr: {
        units: 1,
        name: "diaper",
      },
    },
  },
  {
    type: "volume",
    unit: "fluid_ounce",
    display: "fl oz",
    conversion_factor: {
      "fl.oz": {
        units: 1,
        name: "fluid_ounce",
        display: "fl oz",
      },
      quart: {
        units: 32,
        name: "quart",
      },
      "dr.pt": {
        units: 18.6315265,
        name: "dry_pint",
        display: "dry pint",
      },
      cup: {
        units: 8,
        name: "cup",
      },
      ml: {
        units: 0.03381402,
        name: "milliliter",
        display: "mL",
      },
      pint: {
        units: 16,
        name: "pint",
      },
    },
  },
  {
    type: "weight",
    unit: "ounce",
    display: "oz",
    conversion_factor: {
      ounce: {
        units: 1,
        name: "ounce",
        display: "oz",
      },
      lb: {
        units: 16,
        name: "pound",
        display: "lb",
      },
      "cu.ft": {
        units: 957.506494,
        name: "cubic_feet",
        display: "ft³",
      },
      pound: {
        units: 16,
        name: "pound",
        display: "lb",
      },
    },
  },
  {
    type: "area",
    unit: "square_feet",
    display: "ft²",
    conversion_factor: {
      "sq.ft": {
        units: 1,
        name: "square_feet",
        display: "ft²",
      },
    },
  },
  {
    type: "length",
    unit: "yard",
    conversion_factor: {
      yard: {
        units: 1,
        name: "yard",
      },
    },
  },
];

const unrecognized_units = {};

// Function to read JSON file
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file: ${filePath}`, error);
    return null;
  }
};

// Function to process JSON data
const processData = (productData, dealData) => {
  // Your preprocessing logic here
  for (const item of productData.primaryProducts.response.docs) {
    const type = item.shelfName
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/\s/g, "_")
      .replace(/[^a-z_]/g, "")
      .replace(/_+/g, "_");

    if (item.id === 970466266) {
      item.unitQuantity = "EACH";
      item.pricePer = item.price;
    }

    const availability =
      item.inventoryAvailable === "1"
        ? "in_stock"
        : item.inventoryAvailable === "0"
          ? "out_of_stock"
          : "unknown";
    dealData.forEach((deal) => {
      if (!deal.offerDetail.offerPrice) {
        console.log(deal.offerDetail.offerPrice);
      }
    });

    const deal = dealData
      .filter(
        (deal) =>
          !deal.offerDetail.offerPrice.startsWith("Earn") &&
          !deal.offerDetail.description.includes("When") &&
          !deal.offerDetail.ecomDescription.includes("When") &&
          !deal.offerDetail.offerPrice.includes("REBATE"),
      )
      .find((deal) => deal.upcList && deal.upcList.includes(item.upc));

    const clipDeals = [];

    if (deal) {
      const limitRegex = /\s*Limit\s*\d+$/;

      const offer = deal.offerDetail.offerPrice
        .trim()
        .replace(limitRegex, "")
        .trim();
      const desc = deal.offerDetail.description
        .trim()
        .replace(limitRegex, "")
        .trim();
      const uDesc = deal.offerDetail.forUDescription
        .trim()
        .replace(limitRegex, "")
        .trim();
      const eDesc = deal.offerDetail.ecomDescription
        .trim()
        .replace(limitRegex, "")
        .trim();

      const matchPriceOff = /\$(\d+(\.\d{1,2})?) off/.exec(offer);
      const matchPriceEach = /\$(\d+(\.\d{1,2})?) each/.exec(offer);

      if (offer === eDesc) {
        if (matchPriceOff) {
          const priceOff = parseFloat(matchPriceOff[1]);
          clipDeals.push({
            date: new Date(deal.offerEndDate),
            mutator: (x) => x - priceOff,
          });
        } else if (matchPriceEach) {
          const priceEach = parseFloat(matchPriceEach[1]);
          clipDeals.push({
            date: new Date(deal.offerEndDate),
            mutator: () => priceEach,
          });
        }
      } else if (
        offer === "FREE" &&
        !desc.includes("Buy") &&
        !eDesc.includes("Buy")
      ) {
        clipDeals.push({
          date: new Date(deal.offerEndDate),
          mutator: () => 0,
        });
      } else {
        console.log("Not handling deal:");
        console.log({
          date: new Date(deal.offerEndDate),
          offer: offer,
          description: desc,
          forUDescription: uDesc,
          ecomDescription: eDesc,
          offerId: deal.offerId,
        });
      }
    }

    const price = item.price;

    let dealWithLowestPrice = null;
    let lowestPrice = price;
    let unmutatedPrice = price;

    if (clipDeals.length > 0) {
      for (const deal of clipDeals) {
        if (new Date() < deal.date) {
          const mutatedPrice = deal.mutator(price);

          if (mutatedPrice < lowestPrice) {
            lowestPrice = mutatedPrice;
            dealWithLowestPrice = deal;
          }
        }
      }

      if (dealWithLowestPrice) {
        const factor = lowestPrice / item.price;
        item.price = lowestPrice;
        item.pricePer = item.pricePer * factor;
      }
    }

    const upcoming_prices = [];

    if (item.promoEndDate) {
      const promoEnd = new Date(item.promoEndDate);
      if (dealWithLowestPrice) {
        if (dealWithLowestPrice.date < promoEnd) {
          upcoming_prices.push({
            date: dealWithLowestPrice.date,
            price: unmutatedPrice,
          });
          upcoming_prices.push({
            date: promoEnd,
            price: item.basePrice,
          });
        } else if (dealWithLowestPrice.date > promoEnd) {
          upcoming_prices.push({
            date: dealWithLowestPrice.date,
            price: item.basePrice,
          });
          upcoming_prices.push({
            date: promoEnd,
            price: dealWithLowestPrice.mutator(item.basePrice),
          });
        } else {
          upcoming_prices.push({
            date: promoEnd,
            price: item.basePrice,
          });
        }
      } else {
        upcoming_prices.push({
          date: item.promoEndDate,
          price: item.basePrice,
        });
      }
    }

    upcoming_prices.sort((a, b) => a.date - b.date);

    const original_unit = item.unitQuantity.toLowerCase();
    const normalized_unit = units.find(
      (unit) => unit.conversion_factor[original_unit],
    );
    let unit_price = null;

    if (normalized_unit) {
      const conversion_factor =
        normalized_unit.conversion_factor[original_unit];
      const total_units = item.price / item.pricePer;

      unit_price = {
        type: normalized_unit.type,
        canonical_unit: {
          id: normalized_unit.unit,
          display: normalized_unit.display ?? normalized_unit.unit,
          price_per: item.pricePer / conversion_factor.units,
          total_units: total_units * conversion_factor.units,
        },
        preferred_unit: {
          id: conversion_factor.name,
          display: conversion_factor.display ?? conversion_factor.name,
          price_per: item.pricePer,
          total_units: total_units,
        },
      };
    } else {
      if (unrecognized_units[original_unit]) {
        unrecognized_units[original_unit]++;
      } else {
        console.log("Skipping unrecognized unit: %s", original_unit);
        unrecognized_units[original_unit] = 1;
      }
    }

    const clean_item = {
      id: item.pid,
      title: item.name,
      type: type,
      image: item.imageUrl,
      price: item.price,
      unit_price: unit_price,
      upcoming_prices: upcoming_prices,
      snap_ebt: item.snapEligible,
      availability: availability,
      // aisleName: aisleName,
      // departmentName: departmentName,
      store: "safeway",
      _temp: {
        sales_rank: item.salesRank,
        safeway_product_id: item.pid,
        safeway_upc: item.upc,
      },
    };

    // Items with more than one upcoming price
    // if (clean_item.upcoming_prices.length > 1) {
    //   console.log(clean_item);
    // }

    clean_data.push(clean_item);
  }
};

// Function to process all JSON files in the current directory
const processJSONFiles = async () => {
  try {
    let counter = 0;
    const dealData = readJSONFile("safeway_clipped_deal_data.json");
    while (true) {
      const fileName = `safeway_data_${counter}.json`;

      if (!fs.existsSync(fileName)) {
        console.log(`No more files to process.`);
        break;
      }

      const productData = readJSONFile(fileName);
      if (productData && dealData) {
        console.log(
          `Processing ${fileName} and ${"safeway_clipped_deal_data.json"}`,
        );
        processData(productData, dealData);
      }

      counter += 30;
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    }
  } catch (error) {
    console.error(`Error processing JSON files:`, error);
  }

  console.log(unrecognized_units);

  await fsPromises.writeFile(
    "safeway_clean_data.json",
    JSON.stringify({ items: clean_data }),
  );
};

const deals = [];

const sleep = () =>
  new Promise((r) =>
    setTimeout(r, Math.floor(Math.random() * (1000 - 500 + 1)) + 500),
  ); // Random delay from 500-1000ms

async function getClippedDeals() {
  const options = {
    method: "GET",
    headers: {
      "X-SWY-APPLICATION-TYPE": "web",
      "X-SWY_API_KEY": "emjou",
      "X-SWY_VERSION": "1.1",
      "X-SWY_BANNER": "safeway",
    },
  };

  const data = await fetch(
    `https://www.safeway.com/abs/pub/xapi/offers/companiongalleryoffer?storeId=${stores.W_SACRAMENTO}`,
    options,
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  await fsPromises.writeFile(
    "safeway_clipped_deals.json",
    JSON.stringify(data),
  );

  for (const offer of data.companionGalleryOfferList) {
    await loadDealDetails(offer.offerId);
    await sleep();
  }

  await fsPromises.writeFile(
    "safeway_clipped_deal_data.json",
    JSON.stringify(deals),
  );
}
async function loadDealDetails(offerId) {
  const options = {
    method: "GET",
    headers: {
      "X-SWY_VERSION": "2.1",
      "X-SWY_API_KEY": "emjou",
      "X-SWY-APPLICATION-TYPE": "web",
    },
  };

  const data = await fetch(
    `https://www.safeway.com/abs/pub/xapi/offers?offerId=${offerId}&storeId=${stores.W_SACRAMENTO}&includeUpc=y`,
    options,
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  deals.push(data);
}

// console.log("Fetching products...");
// await paginateAndWrite(false); // Change to true to force fetching even if files exist

// console.log("Feteched products. Fetching deals...");
// await getClippedDeals();

// console.log("Feteched deals. Processing data...");
// // Start processing JSON files
await processJSONFiles();
console.log("Feteched deals. Finished processing.");
