import axios from "axios";

const client = axios.create({
  baseURL: process.env.DIESEL_DICTIONARY_URL,
  validateStatus: function (status) {
    return status < 500;
  },
});

export async function search(search_term, page_number) {
  const encodedSearchTerm = encodeURIComponent(search_term);
  return await client
    .get(`/api/search?searchQuery=${encodedSearchTerm}&page=${page_number}`)
    .then((response) => response)
    .catch((error) => error);
}

export async function index(page_number) {
  return await client
    .get(`/api/words/index?page=${page_number}`)
    .then((response) => response)
    .catch((error) => error);
}
