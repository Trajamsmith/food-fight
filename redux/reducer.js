const initialState = {
  loggedIn: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return Object.assign({}, state, {
        loggedIn: true,
      }, action.payload);
    case 'USER_LOGGING_OUT':
      return Object.assign({}, state, {
        loggedIn: false,
        username: '',
      });
    default:
      return state;
  }
}

export default reducer;
