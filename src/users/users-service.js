const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('users');
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('users')
        .returning('*')
        .then((rows) => {
          return rows[0];
        });
    },
    getById(knex, email, password) {
      return knex.from('users').select('*').where({ email,password }).first();
    },
  
    deleteUser(knex, id) {
      return knex('users').where({ id }).delete();
    },
  
    updateUser(knex, id, newInfo) {
      return knex('users').where({ id }).update(newInfo);
    },
  };
  
  module.exports = UsersService;
  