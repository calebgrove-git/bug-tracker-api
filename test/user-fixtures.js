function makeUser() {
  return {
    id: 1,
    email: 'email',
    password: 'password',
    admin: true,
    company: 'company',
  };
}

module.exports = { makeUser };
