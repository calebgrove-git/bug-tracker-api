const knex = require('knex');
const userFixtures = require('./user-fixtures');
const bugFixtures = require('./bug-fixtures');
const { DATABASE_URL } = require('../src/config');
const app = require('../src/app');
const supertest = require('supertest');

describe('User Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db('users').truncate());

  afterEach('cleanup', () => db('users').truncate());

  describe('POST /users/create', () => {
    const user = userFixtures.makeUser();
    context(`Given a user`, () => {
      it(`responds with 201`, () => {
        return supertest(app).post('/api/users/create').send(user).expect(201);
      });
    });
  });
  describe('POST /users/login', () => {
    const user = userFixtures.makeUser();
    context(`Given a login`, () => {
      it(`responds with 201`, () => {
        supertest(app)
          .post('/api/users/create')
          .send(user)
          .end(function () {
            return supertest(app)
              .post('/api/users/login')
              .send(user)
              .expect(201);
          });
      });
    });
  });
});
describe('Bug Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: DATABASE_URL,
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db('bugs').truncate());

  afterEach('cleanup', () => db('bugs').truncate());

  describe('Post /bugs/', () => {
    const bug = bugFixtures.makeBug();
    context(`Given a bug`, () => {
      it(`responds with 201`, () => {
        return supertest(app).post('/api/bugs/').send(bug).expect(201);
      });
    });
  });
  describe('GET /bugs/:id', () => {
    const bug = bugFixtures.makeBug();
    context(`Given a bug id`, () => {
      it(`responds with 200`, () => {
        supertest(app)
          .post('/api/bugs')
          .send(bug)
          .end(function () {
            return supertest(app).get(`/api/bugs/${bug.id}`).expect(200);
          });
      });
    });
  });
  describe('DELETE /bugs/:id', () => {
    const bug = bugFixtures.makeBug();
    context(`Given a bug id`, () => {
      it(`responds with 204`, () => {
        supertest(app)
          .post('/api/bugs')
          .send(bug)
          .end(function () {
            return supertest(app).delete(`/api/bugs/${bug.id}`).expect(204);
          });
      });
    });
  });
  describe('PATCH /bugs/:id', () => {
    let bug = bugFixtures.makeBug();
    context(`Given a new bug`, () => {
      it(`responds with 204`, () => {
        supertest(app)
          .post('/api/bugs')
          .send(bug)
          .end(function () {
            bug = { ...bug, name: 'new bug name' };
            return supertest(app)
              .patch(`/api/bugs/${bug.id}`)
              .send()
              .expect(204);
          });
      });
    });
  });
  describe('PATCH /bugs/:id/complete', () => {
    let bug = bugFixtures.makeBug();
    context(`Given a complete bug`, () => {
      it(`responds with 204`, () => {
        supertest(app)
          .post('/api/bugs')
          .send(bug)
          .end(function () {
            bug = { ...bug, completed: true };
            return supertest(app)
              .patch(`/api/bugs/${bug.id}`)
              .send()
              .expect(204);
          });
      });
    });
  });
  describe('GET /bugs/:company', () => {
    let bug = bugFixtures.makeBug();
    context(`Given a bug id`, () => {
      it(`responds with 200`, () => {
        supertest(app)
          .post('/api/bugs')
          .send(bug)
          .end(function () {
            return supertest(app).get(`/api/bugs/${'admin'}`).expect(200);
          });
      });
    });
  });
});
