const path = require('path');
const express = require('express');
const StateService = require('./states-service');
const store = require('../../seed/states');

const stateRouter = express.Router();
const jsonParser = express.json();

//filter out the response to avoid showing broken data
const serializeStates = state => ({
  id : state.id,
  state: state.state,
  city: state.city,
  "best-cheap-beer-spot": state.best-cheap-beer-spot,
  "bcbs-link": state.bcbs-link,
  "best-dog-friendly-spot": state.best-dog-friendly-spot,
  "bdfs-link": state.bdfs-link,
  "best-outdoorsy-spot": state.best-outdoorsy-spot,
  "bos-link": state.bos-link,
  "best-local-fast-food-spot": state.best-local-fast-food-spot,
  "blffs-link": state.blffs-link
});

stateRouter
  .route('/')
  .get((req, res, next) => {
    res.status(200).json(store.states)
  })
  
module.exports = stateRouter;