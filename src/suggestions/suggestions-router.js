const path = require('path');
const express = require('express');
const SuggestionService = require('./suggestions-service');

const suggestionsRouter = express.Router();
const jsonParser = express.json();

//filter out the response to avoid showing broken data
const serializeSuggestion = music => ({
  id: suggestions.id,
  forPlace: suggestions.forPlace,
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
      forPlace,
      suggestion
    } = req.body;
    const newSugg = {
      forPlace,
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
          .json(serializeMusic(sugg));
      })
      .catch(next);
  });


suggestionsRouter
  .route('/:music_id')
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.music_id))) {
      //if there is an error show it
      return res.status(404).json({
        error: {
          message: 'Invalid id'
        }
      });
    }

    //connect to the service to get the data
    SuggestionService.getMusicById(
      req.app.get('db'),
      req.params.music_id
    )
      .then(music => {
        if (!music) {
          //if there is an error show it
          return res.status(404).json({
            error: {
              message: 'Music doesn\'t exist'
            }
          });
        }
        res.music = music;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {

    //get each one of the objects from the results and serialize them
    res.json(serializeMusic(res.music));
  })


module.exports = suggestionsRouter;