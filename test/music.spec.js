const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const supertest = require('supertest');
const MusicService = require('../src/music/music-service');




describe('GET /api/music', () => {

  function makeNoteArray() {
    return [
      {
        id: 1,
        user_id: 1,
        song_name: 'name',
        group_one_two_beat_one: 'one',
        group_one_two_beat_two: 'two',
        group_two_one_beat_one: 'three',
        group_two_one_beat_two: 'four',
        group_two_one_beat_three: 'five',
        group_two_one_beat_four: 'six',
        group_three_two_beat_one: 'seven',
        group_three_two_beat_two: 'eight',
        sharable: 1,
        date_last_edited: 'date'
      },
    ];
  }

  describe('GET /api/music', () => {
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
      db.raw('TRUNCATE music RESTART IDENTITY CASCADE')
    );

    afterEach('cleanup', () =>
      db.raw('TRUNCATE  music RESTART IDENTITY CASCADE')
    );

    context('Given there are songs in the database', () => {
      const testNote = makeNoteArray();

      beforeEach('insert music', () => {
        return db.into('music').insert(testNote);
      });

      it('responds with 200 and all of the music', () => {
        return supertest(app)
          .get('/api/music')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(res => {
            expect(res.body[0].note).to.eql(testNote[0].note);
            expect(res.body[0]).to.have.property('id');
          });
      });
    });
  });
});