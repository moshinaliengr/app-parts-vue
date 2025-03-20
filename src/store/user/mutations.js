const resetState = {
  authorization: {},
  information: {},
  loggedIn: false,
  };

export function RESET_USER_STATE(state) {
  state.authorization = {},
  state.information = {},
  state.loggedIn = false;
}

export function SET_USER_STATE(state, user) {
  state.authorization = { ...state.authorization, ...user.authorization };
  state.information = { ...state.information, ...user.information };
  state.loggedIn = user?.information?.customer_id ? true : false;
}


 