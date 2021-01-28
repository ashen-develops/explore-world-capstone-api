const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const supertest = require('supertest');
const StateService = require('../src/states/states-service');




describe('GET /api/states', () => {

  function makeStateArray() {
    return [
      {
        id: 1,
        state: "example",
        city: "test",
        best_cheap_beer_spot: "test",
        bcbs_link: "test",
        best_dog_friendly_spot: "test",
        bdfs_link: "test",
        best_outdoorsy_spot: "test",
        bos_link: "test",
        best_local_fast_food_spot: "test",
        blffs_link: "test"
      },
    ];
  }

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

    context('Given there are states in the database', () => {
      const testNote = makeStateArray();

      beforeEach('insert state', () => {
        return db.into('states').insert(testNote);
      });

      it('responds with 200 and all of the info', () => {
        return supertest(app)
          .get('/api/states')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(res => {
            expect(res.body[0].note).to.eql(testNote[0].note);
            expect(res.body[0]).to.have.property('id');
          });
      });
    });
  });
});