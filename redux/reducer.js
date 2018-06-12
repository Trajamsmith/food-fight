const initialState = {
  loggedIn: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return Object.assign({}, state, {
        loggedIn: true,
      });
    default:
      return state;
  }
}

export default reducer;
