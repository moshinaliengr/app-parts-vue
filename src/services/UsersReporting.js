import axios from "axios";
const site = "diesel-parts";

const client = axios.create({
  baseURL:
    process.env.USERS_REPORTING_SERVICE_BASE_URL ||
    "https://staging.api.usersreporting.diesellaptops.com",
  validateStatus: function (status) {
    return status <= 500;
  },
});

export function setAuthHeaders(auth) {
  client.defaults.headers.common[`DL-Authorization`] = auth.token;
}

export async function sendUserLoginAction({ user }) {
  // return console.log("oblivion");
  const response = await client.post("/api/user-login", {
    site,
  });
  console.log("wee", response);
}

export async function sendDocumentViewAction({ user, module, documentID }) {
  return await client.post(
    "/api/document-view",
    {
      site,
      module,
      documentID,
    },
    {
      headers: getAuthHeaders(user.authorization.token),
    }
  );
}
