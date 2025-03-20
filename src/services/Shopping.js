import axios from "axios";

const client = axios.create({
  baseURL:
    process.env.SHOPPING_LIST_API_ROOT ||
    "https://staging.api.shopping.truckinfo.com/api/",
});

export async function getShoppingList() {
  return client.get();
}
