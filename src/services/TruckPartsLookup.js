import axios from "axios";
import { Notify } from "quasar";

const client = axios.create({
  validateStatus: (status) => status <= 500,
  baseURL: process.env.TRUCK_PARTS_LOOKUP_SERVICE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Authorization": process.env.TRUCK_PARTS_LOOKUP_SERVICE_API_KEY,
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

export function searchModules({
  search,
  search_target,
  fields = [],
  auxiliaries = [],
  page,
  perPage,
}) {
  // console.log("api /v1/module");
  return client
    .get("/api/v1/module", {
      params: {
        search,
        search_target,
        fields,
        auxiliaries,
        page,
        "per-page": perPage,
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
