const path = require('path');
const express = require('express');
const SuggestionService = require('./suggestions-service');

const suggestionsRouter = express.Router();
const jsonParser = express.json();

//filter out the response to avoid showing broken data
const serializeSuggestion = suggestions => ({
  id: suggestions.id,
  for_place: suggestions.for_place,
  suggestion: suggestions.suggestion,
});

suggestionsRouter
  .route('/')
  .get((req, res, next) => {

    SuggestionService.getSuggestions(req.app.get('db'))
      .then(suggs => {
        res.json(suggs.map(serializeSuggestion));
      })
      .catch(next);
  })
//relevant
  .post(jsonParser, (req, res, next) => {
    //take the input from the user
    const {
      for_place,
      suggestion
    } = req.body;
    const newSugg = {
      for_place,
      suggestion
    };

    //validate the input
    for (const [key, value] of Object.entries(newSugg)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        //if there is an error show it
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body`
          }
        });
      }
    }

    //save the input in the db
    SuggestionService.insertSuggestion(
      req.app.get('db'),
      newSugg
    )
      .then(sugg => {
        res
        //display the 201 status code
          .status(201)
        //redirect the request to the original url adding the music id for editing
          .location(path.posix.join(req.originalUrl, `/${sugg.id}`))
        //return the serialized results
          .json(serializeSuggestion(sugg));
      })
      .catch(next);
  });

module.exports = suggestionsRouter;