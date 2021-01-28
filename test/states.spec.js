const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const supertest = require('supertest');
const StateService = require('../src/states/states-service');




describe('GET /api/states', () => {

  describe('GET /api/states', () => {
    let db;

    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
      });
      app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () =>
      db.raw('TRUNCATE states RESTART IDENTITY CASCADE')
    );

    afterEach('cleanup', () =>
      db.raw('TRUNCATE  states RESTART IDENTITY CASCADE')
    );
  });
});