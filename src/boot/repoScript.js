require("dotenv").config();

// For sure needed
global.USER_REPO_AUTH_HEADER = `DL-Authorization`;
global.USER_REPO_TOKEN_HEADER = `Authorization-Token`;
global.USER_REPO_USER_HEADER = `Authorization-User`;
global.USER_REPO_BASE_URL = process.env.USER_AUTH_REPO_BASE_URL
  ? process.env.USER_AUTH_REPO_BASE_URL
  : "https://staging.api.users.diesellaptops.com";

console.log(process.env.USER_AUTH_REPO_BASE_URL);

// Irrelvant globals and not sure if all are needed, no time to check

global.ENCRYPTION_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDSDp0DKr6hb9TWvKTKulaBZRLE
OHjF2Pid0cdLZqpSip78I7dvbrtVE54nLFvjLOtaHg3BasCq6W2S1dmdIGBVnqTF
EXS4SKoJ0HC6uoLINfiCTV2/wt8NHnwemZoPmumeTBklGudxjkgnHvryfsVLw0hM
3f7fg1jQ8LxRMucKTQIDAQAB
-----END PUBLIC KEY-----`;
global.FINGERPRINT_HEADER = `DL-Fingerprint`;
global.USER_REPO_STRIPE_PK = `pk_test_51GrqEcLtLF731e1LLDWkbE9jVyHEUNcUo1VZ7S2SRJ1n8IhszNic5dn6uH3WRvEF5zffiIedhIbO9V373T2liH6000CE0X8UIb`;
global.DIESEL_DOCS_PRODUCT_ID = `prod_JEE4SyRvcoqNgD`;
global.DIESEL_WIRING_PRODUCT_ID = `prod_HtTPpAsv0i4reY`;
global.TFC_OHW_PRODUCT_ID = `prod_I0HVRdWYhLIPpf`;
global.TFC_PRODUCT_ID = `prod_JEHMLDSy8lqw1A`;

global.getHeaders = function getHeaders(
  user,
  headers = { "Content-Type": "application/json" },
  version = "legacy"
) {
  if (user) {
    if (version == "legacy") {
      if (
        user.authorization &&
        user.authorization.hash &&
        user.authorization.token
      ) {
        headers[USER_REPO_TOKEN_HEADER] = user.authorization.token;
        headers[USER_REPO_USER_HEADER] = user.authorization.hash;
        headers[USER_REPO_AUTH_HEADER] = user.authorization.token;
      }
    }
  }
  return headers;
};

global.stringifyURLParams = function stringifyURLParams(dictionary) {
  let paramString = "";
  let index = 1;
  for (var param in dictionary) {
    if (index <= 1) {
      paramString += "?";
    } else {
      paramString += "&";
    }
    paramString += param + "=" + dictionary[param];
    index += 1;
  }
  return paramString;
};

global.constructURL = function constructURL(uri, params = null, base = null) {
  let url = USER_REPO_BASE_URL;
  url = url + uri;
  if (base != null) {
    url = base + uri;
  }
  if (params) {
    url += stringifyURLParams(params);
  }
  return url;
};

function structureRequestData(_url, _method, _formData = null, _headers = {}) {
  let data = {
    url: _url,
    options: {
      method: _method,
      headers: _headers,
    },
  };

  if (_formData) {
    data.options.body = _formData;
  }
  return data;
}

function structureJsonRequestData(_url, _method, _data = null, _headers = {}) {
  let data = {
    url: _url,
    options: {
      method: _method,
      headers: _headers,
    },
  };
  data.options.headers["Content-Type"] = "application/json";
  if (_data) {
    data.options.body = JSON.stringify(_data);
  }
  return data;
}

async function fetchJsonWithData(data) {
  let response = await FetchJsonFrom(data.url, data.options);
  return response;
}

async function FetchJsonFrom(url, options) {
  let response = await fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.log("error found:", error);
    });
  return response;
}

global.post = async function post(uri, headers, data, base = null) {
  let url = constructURL(uri, null, base);
  let request = structureJsonRequestData(url, "post", data, headers);
  return fetchJsonWithData(request);
};
global.put = async function put(uri, headers, data, base = null) {
  let url = constructURL(uri, null, base);
  let request = structureJsonRequestData(url, "put", data, headers);
  return fetchJsonWithData(request);
};
global.get = async function get(uri, headers, params = {}, base = null) {
  let url = constructURL(uri, params, base);
  let request = structureRequestData(url, "get", null, headers);
  return fetchJsonWithData(request);
};
global.del = async function del(uri, headers, base = null) {
  let url = constructURL(uri, null, base);
  let request = structureRequestData(url, "delete", null, headers);
  return fetchJsonWithData(request);
};

global.substantiate = function substantiate(data) {
  data.device = { type: "browser", fingerprint: "706660339" };
  return data;
};

global.registerUser = async function registerUser(data) {
  // establish url
  let uri = "/api/legacy/user";
  // establish secure password for post
  let dataToSend = { ...data };
  dataToSend = substantiate(dataToSend);
  return post(uri, getHeaders({}), dataToSend);
};

global.authenticateUser = async function authenticateUser(data) {
  // establish url
  let uri = "/api/legacy/auth";
  let dataToSend = { ...data };
  dataToSend = substantiate(dataToSend);
  return post(uri, getHeaders({}), dataToSend);
};

global.verifyUserEmail = async function verifyUserEmail(user, data) {
  // establish url
  let uri = "/api/user/verify/email";
  let headers = getHeaders(user);
  console.log("sending verification request...");
  return put(uri, headers, data);
};

global.sendPWResetToken = function sendPWResetToken(email) {
  let uri = "/api/legacy/password/reset";
  return post(uri, {}, email);
};

global.resetPassword = async function resetPassword(data) {
  if (
    data.password &&
    data.password_confirmation &&
    data.password == data.password_confirmation
  ) {
    let uri = "/api/legacy/user/password";
    let dataToSend = { ...data };
    return put(uri, {}, dataToSend);
  }
};

global.updateUserInfo = async function updateUserInfo(user, data) {
  let uri = "/api/legacy/user";
  let headers = getHeaders(user);
  return put(uri, headers, data);
};

global.getUserHistory = function getUserHistory(user, params = null) {
  let uri = "/api/user/history";
  let headers = getHeaders(user);
  return get(uri, headers, params);
};

global.createUserHistoryItem = function createUserHistoryItem(user, data) {
  let uri = "/api/user/history";
  let headers = getHeaders(user);
  return post(uri, headers, data);
};

global.createStripeCardPaymentMethod = async function createStripeCardPaymentMethod(
  card,
  billing = null
) {
  if (card.stripe && card.card) {
    let response = await card.stripe.createPaymentMethod({
      type: "card",
      card: card.card,
      billing_details: billing,
    });
    return response;
  }
  return null;
};

global.createCardPaymentMethod = async function createCardPaymentMethod(
  user,
  data
) {
  console.log("creating with data:", data);
  console.log("for given user: ", user);
  let card = data.card;
  let billing = data.billing_details;
  let stripeResponse = await createStripeCardPaymentMethod(card, billing);
  if (stripeResponse.paymentMethod) {
    console.log(stripeResponse.paymentMethod);
    let uri = `/api/legacy/paymentMethods/card/${stripeResponse.paymentMethod.id}`;
    let headers = getHeaders(user);
    return post(uri, headers);
  }
  return stripeResponse;
};
