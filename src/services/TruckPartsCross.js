import axios from "axios";
import { Notify } from "quasar";

const client = axios.create({
  validateStatus: (status) => status <= 500,
  baseURL: process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Authorization": process.env.TRUCK_PARTS_CROSS_SERVICE_API_KEY,
  },
});

function handleErrors(errors) {
  return Notify.create({
    type: "negative",
    message: `${errors}`,
    position: "top",
    timeout: 1500,
  });
}

/**
 * Search the TruckPartsCross API for a list of parts.
 *
 * @param {string} search - the search query
 * @param {number} page - the current page number
 * @param {number} perPage - how many results per page
 * @param {number|null} manufacturer_id - (optional) the manufacturer to filter by
 */
export function searchParts({ search, page, perPage, manufacturer_id = null }) {
  // console.log("v2/part/search:searchParts");
  return client
    .get("/api/v2/part/search", {
      params: {
        search,
        page,
        per_page: perPage,
        manufacturer_id: manufacturer_id,
      },
    })
    .then((response) => {
      if (response?.status === 200) {
        return response.data || null;
      }
      return null;
    })
    .catch((errors) => {
      handleErrors(errors);
      return null;
    });
}

export function getPart({ id }) {
  // console.log("v1/part:getPart");
  return client
    .get(`/api/v1/part/${id}`)
    .then((response) => {
      if (response?.status === 200) {
        return response.data || null;
      }
      return null;
    })
    .catch((errors) => {
      handleErrors(errors);
      return null;
    });
}

export async function getPartV2({ id }) {
  // console.log("v2/part:getPartV2");
  return client
    .get(`/api/v2/part/${id}`)
    .then((response) => {
      if (response?.status === 200) {
        return response.data || null;
      }
      return null;
    })
    .catch((errors) => {
      handleErrors(errors);
      return null;
    });
}

export function getFavoriteParts({ userID }) {
  // console.log("/v1/favorite-parts:getFavoriteParts");
  return client
    .get("/api/v1/favorite-parts", { params: { user_id: userID } })
    .then((response) => {
      if (response?.status === 200) {
        return response.data?.data || null;
      }
      return null;
    })
    .catch((errors) => {
      handleErrors(errors);
      return null;
    });
}

export function addFavoritePart({ userID, partID }) {
  return client
    .post("/api/v1/favorite-parts", { user_id: userID, part_id: partID })
    .then((response) => {
      if (response?.status === 200) {
        return response.data?.data || null;
      }
      return null;
    })
    .catch((errors) => {
      handleErrors(errors);
      return null;
    });
}

export function removeFavoritePart({ id }) {
  return client
    .delete(`/api/v1/favorite-parts/${id}`)
    .then((response) => {
      if (response?.status === 200) {
        return true;
      }
      return null;
    })
    .catch((errors) => {
      handleErrors(errors);
      return null;
    });
}

/**
 * Get the list of equivalent parts for a given part.
 *
 * @param {string} partID - the part id
 * @param {number} page - the current page number
 * @param {number} perPage - how many results per page
 * @param {number|null} manufacturerID - (optional) the manufacturer to filter by
 */
export async function getEquivalentParts({
  partId,
  page = 1,
  perPage = 10,
  manufacturer_id = null,
}) {
  return client
    .get(`/api/v2/part/${partId}/equivalences`, {
      params: { page, per_page: perPage, manufacturer_id: manufacturer_id },
    })
    .then((response) => {
      if (response?.status === 200) {
        return response.data || null;
      }
      return null;
    })
    .catch((errors) => {
      handleErrors(errors);
      return null;
    });
}
