// import db from '../models';
// import axios from 'axios';
import express from 'express';

const apiRouter = express.Router();

const getPlacesFromGoogle = async (req, res) => {
  res.json();
};

apiRouter.post('/cities', getPlacesFromGoogle);

export default {
  apiRouter,
};
