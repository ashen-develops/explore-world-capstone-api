const MusicService = {
    //relevant
    getSuggestions(db) {
      return db
        .select('*')
        .from('suggestions');
    },
    getSuggestionsById(db, suggestion_id) {
      return db
        .select('*')
        .from('suggestions')
        .where('suggestions.id', suggestion_id)
        .first();
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