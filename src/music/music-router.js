const path = require('path');
const express = require('express');
const MusicService = require('./music-service');

const musicRouter = express.Router();
const jsonParser = express.json();

//filter out the response to avoid showing broken data
const serializeMusic = music => ({
  id: music.id,
  user_id: music.user_id,
  song_name: music.song_name,
  group_one_two_beat_one: music.group_one_two_beat_one,
  group_one_two_beat_two: music.group_one_two_beat_two,
  group_two_one_beat_one: music.group_two_one_beat_one,
  group_two_one_beat_two: music.group_two_one_beat_two,
  group_two_one_beat_three: music.group_two_one_beat_three,
  group_two_one_beat_four: music.group_two_one_beat_four,
  group_three_two_beat_one: music.group_three_two_beat_one,
  group_three_two_beat_two: music.group_three_two_beat_two,
  sharable: music.sharable, 
  date_last_edited: music.date_last_edited
});

musicRouter
  .route('/')
  .get((req, res, next) => {

    MusicService.getMusics(req.app.get('db'))
      .then(musics => {
        res.json(musics.map(serializeMusic));
      })
      .catch(next);
  })
//relevant
  .post(jsonParser, (req, res, next) => {
    //get the current date in unix format 
    const timeElapsed = Date.now(); 
    //conver the unix format date into string
    const today = new Date(timeElapsed);


    //take the input from the user
    const {
      user_id,
      song_name,
      group_one_two_beat_one,
      group_one_two_beat_two,
      group_two_one_beat_one,
      group_two_one_beat_two,
      group_two_one_beat_three,
      group_two_one_beat_four,
      group_three_two_beat_one,
      group_three_two_beat_two,
      sharable,
    } = req.body;
    const newMusic = {
      user_id,
      song_name,
      group_one_two_beat_one,
      group_one_two_beat_two,
      group_two_one_beat_one,
      group_two_one_beat_two,
      group_two_one_beat_three,
      group_two_one_beat_four,
      group_three_two_beat_one,
      group_three_two_beat_two,
      sharable,
      date_last_edited: today.toISOString()
    };

    //validate the input
    for (const [key, value] of Object.entries(newMusic)) {
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
    MusicService.insertMusic(
      req.app.get('db'),
      newMusic
    )
      .then(music => {
        res
        //display the 201 status code
          .status(201)
        //redirect the request to the original url adding the music id for editing
          .location(path.posix.join(req.originalUrl, `/${music.id}`))
        //return the serialized results
          .json(serializeMusic(music));
      })
      .catch(next);
  });


musicRouter
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
    MusicService.getMusicById(
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
//relevant
  .patch(jsonParser, (req, res, next) => {
    //get the current date in unix format 
    const timeElapsed = Date.now(); 
    //conver the unix format date into string
    const today = new Date(timeElapsed);

    //take the input from the user
    const {
      user_id,
      song_name,
      group_one_two_beat_one,
      group_one_two_beat_two,
      group_two_one_beat_one,
      group_two_one_beat_two,
      group_two_one_beat_three,
      group_two_one_beat_four,
      group_three_two_beat_one,
      group_three_two_beat_two,
      sharable,
    } = req.body;
    const musicToUpdate = {
      user_id,
      song_name,
      group_one_two_beat_one,
      group_one_two_beat_two,
      group_two_one_beat_one,
      group_two_one_beat_two,
      group_two_one_beat_three,
      group_two_one_beat_four,
      group_three_two_beat_one,
      group_three_two_beat_two,
      sharable,
      date_last_edited: today.toISOString()
    };

    //validate the input by checking the length of the musicToUpdate object to make sure that we have all the values
    const numberOfValues = Object.values(musicToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      //if there is an error show it
      return res.status(400).json({
        error: {
          message: 'Request body must content either \'title\' or \'completed\''
        }
      });
    }

    //save the input in the db
    MusicService.updateMusic(
      req.app.get('db'),
      req.params.music_id,
      musicToUpdate
    )
      .then(updatedMusic => {

        //get each one of the objects from the results and serialize them
        res.status(200).json(serializeMusic(updatedMusic));
      })
      .catch(next);
  })
//relevant
  .delete((req, res, next) => {
    MusicService.deleteMusic(
      req.app.get('db'),
      req.params.music_id
    )
      .then(numRowsAffected => {

        //check how many rows are effected to figure out if the delete was successful
        res.status(204).json(numRowsAffected).end();
      })
      .catch(next);
  });


module.exports = musicRouter;