const BugsService = {
  getAllBugs(knex, company) {
    return knex.select('*').from('bugs').where({company});
  },

  insertBug(knex, newBug) {
    return knex
      .insert(newBug)
      .into('bugs')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from('bugs').select('*').where({ id }).first();
  },

  deleteBug(knex, id) {
    return knex('bugs').where({ id }).delete();
  },

  updateBug(knex, id, newInfo) {
    return knex('bugs').where({ id }).update(newInfo);
  },
};

module.exports = BugsService;
