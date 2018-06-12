const login = username => ({
  type: 'USER_LOGGED_IN',
  payload: { username },
});

const logout = () => ({
  type: 'USER_LOGGING_OUT',
});

module.exports = {
  login,
  logout,
};

