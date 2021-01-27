const MusicService = {
    //relevant
    getSuggestions(db) {
      return db
        .select('*')
        .from('suggestions');
    },
    //relevant
    insertSuggestion(db, newSuggestion) {
      return db
        .insert(newSuggestion)
        .into('suggestions')
        .returning('*')
        .then(rows => {
          return rows[0];
        });
    }
  };
  
  module.exports = MusicService;