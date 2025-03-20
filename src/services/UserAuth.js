import axios from "axios";

const userClient = (auth) =>
  axios.create({
    baseURL: `${USER_REPO_BASE_URL}/`,
    headers: auth ? getHeaders(auth) : {},
    validateStatus: function (status) {
      return status < 500;
    },
  });

const loginWithCookie = (requestOptions) => {
  const { payload } = requestOptions;
  return userClient().post(
    `api/user/authenticate/${payload}`,
    substantiate({})
  );
};

const updateUsersInfo = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return updateUserInfo(auth, payload);
};

export const verifyEmail = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return verifyUserEmail(auth, payload);
};

const verifySubcription = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return userClient(auth).get(`api/user/subscription/verify/${payload}`);
};

const login = (requestOptions) => {
  const { payload } = requestOptions;
  return authenticateUser(payload);
};

export const newVerification = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return userClient(auth).post(`api/user/verify/email`, payload);
};

const register = (requestOptions) => {
  const { payload } = requestOptions;
  return registerUser(payload);
};

const subscription = (requestOptions) => {
  const { type, auth, payload } = requestOptions;
  if (type === "unsubscribe") {
    return userClient(auth).delete(`/api/user/subscription/${payload}`);
  }

  if (type === "subscribe") {
    return userClient(auth).post(`/api/user/subscription`, payload);
  }
};

const createPaymentMethod = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return createCardPaymentMethod(auth, payload);
};

const passwordResetEmail = (requestOptions) => {
  const { payload } = requestOptions;
  return sendPWResetToken(payload);
};

const passwordReset = (requestOptions) => {
  const { payload } = requestOptions;
  return resetPassword(payload);
};

const history = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return getUserHistory(auth, payload);
};

const addHistoryItem = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return createUserHistoryItem(auth, payload);
};

const getPlans = (requestOptions) => {
  const { auth, payload } = requestOptions;
  return userClient(auth).post("/api/prices", payload);
};

export default {
  register: register,
  verify: verifyEmail,
  login: login,
  cookie_login: loginWithCookie,
  update: updateUsersInfo,
  verify_subscription: verifySubcription,
  new_verification: newVerification,
  unsubscribe: subscription,
  subscribe: subscription,
  create_payment_method: createPaymentMethod,
  password_reset_email: passwordResetEmail,
  reset_password: passwordReset,
  get_history: history,
  add_history_item: addHistoryItem,
  get_plans: getPlans,
};
