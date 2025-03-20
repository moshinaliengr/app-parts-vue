import axios from "axios";

const client = axios.create({
  baseURL: process.env.VIN_SERVICE_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: function (status) {
    return status < 500;
  },
});

export async function getYears() {
  try {
    const years = await client.get(
      `/api/wmi/getYear?api_key=${process.env.VIN_DECODER_API_KEY}`,
      {
        params: {
          validonly: true,
        },
      }
    );
    console.log("got years", years);
    return years;
  } catch (error) {
    console.log("error getting years...", error);
  }
}

export async function getManufacturers() {
  try {
    const manufacturers = await client.get(
      `/api/wmi/getMake?api_key=${process.env.VIN_DECODER_API_KEY}`,
      {
        params: {
          validonly: true,
        },
      }
    );
    console.log("got manufacturers", manufacturers);
    return manufacturers;
  } catch (error) {
    console.log("error getting manufacturers...", error);
  }
}

export async function getModels(options) {
  const { manufacturer, year } = options;
  try {
    const models = await client.get(
      `/api/wmi/getModel?noCache=1630472096772&make=${manufacturer}&year=${year}&api_key=${process.env.VIN_DECODER_API_KEY}`,
      {
        params: {
          validonly: true,
        },
      }
    );
    console.log("got models", models);
    return models;
  } catch (error) {
    console.log("error getting models...", error);
  }
}

export async function getParts(options) {
  const { vin, manufacturer, model, year } = options;
  const byVIN = `/api/wmi/AssociatePartList?vin=${vin}&api_key=${process.env.VIN_DECODER_API_KEY}`;
  const byOptions = `/api/wmi/AssociatePartList?&api_key=${process.env.VIN_DECODER_API_KEY}&make=${manufacturer}&model=${model}&year=${year}`;
  const uri = vin ? byVIN : byOptions;
  try {
    const parts = await client.get(uri, {
      params: {
        validonly: true,
      },
    });
    console.log("Got parts", parts);
    return parts;
  } catch (error) {
    console.log("error getting parts...", error);
  }
}

export default {
  getYears,
  getManufacturers,
  getModels,
  getParts,
};
