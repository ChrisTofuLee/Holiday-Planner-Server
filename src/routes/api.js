import axios from 'axios';
import express from 'express';
import db from '../models';

const apiRouter = express.Router();

const foodURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyC9eRMr-ZCaKj0Ttta4-RQGz0hxnDulTNY';
const SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=AIzaSyC9eRMr-ZCaKj0Ttta4-RQGz0hxnDulTNY';
const findPlaceURL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyC9eRMr-ZCaKj0Ttta4-RQGz0hxnDulTNY';

const getPlacesFromGoogle = async (req, res) => {
  try {
    // const { searchTerm } = req.body;

    const { data } = await axios.get(SEARCH_URL);
    const IMAGE_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.results.photos[0].photo_reference}&key=AIzaSyC9eRMr-ZCaKj0Ttta4-RQGz0hxnDulTNY`;
    console.log(data, foodURL, findPlaceURL);
    res.json(data, IMAGE_URL);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAllPlans = async (req, res) => {
  res.json();
};

const savePlanInDB = async (req, res) => {
  try {
    const payload = req.body;

    await db.Plan.create(payload);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const removePlanInDB = async (req, res) => {
  try {
    const { id } = req.params;

    await db.Plan.findByIdAndDelete(id);
    const results = await db.Plan.find({});

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const removePlaceInDB = async (req, res) => {
  res.json();
};

const savePlaceInDB = async (req, res) => {
  res.json();
};

apiRouter.get('/cities', getPlacesFromGoogle);
apiRouter.get('/plans', getAllPlans);
apiRouter.post('/plans', savePlanInDB);
apiRouter.post('/places', savePlaceInDB);
apiRouter.delete('/plans/:id', removePlanInDB);
apiRouter.delete('/places/:id', removePlaceInDB);

export default apiRouter;
