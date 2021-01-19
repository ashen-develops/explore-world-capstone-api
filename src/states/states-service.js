const store = require('../../seed/states');

const StateService = {
  //relevant
  getStateInfo(db) {
    return db
      .select('*')
      .from('states');
  },
  getStateInfoById(db, state_id) {
    return db
      .select('*')
      .from('states')
      .where('states.id', state_id)
      .first();
  },
  //relevant
  insertStateInfo(db, newState) {
    return db
      .insert(newState)
      .into('states')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  //relevant
  updateStateInfo(db, music_id, newMusic) {
    return db('states')
      // eslint-disable-next-line no-undef
      .update(newState, returning = true)
      .where({
        id: state_id
      })
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  //relevant
  deleteMusic(db, state_id) {
    return db('states')
      .delete()
      .where({
        'id': state_id
      });
  }
};

module.exports = StateService;