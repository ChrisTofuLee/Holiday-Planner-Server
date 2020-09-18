import axios from 'axios';
import express from 'express';
import db from '../models';

require('dotenv').config();

const { GOOGLE_API_KEY } = process.env;
const apiRouter = express.Router();

const GOOGLE_TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const GOOGLE_PLACE_PHOTO = 'https://maps.googleapis.com/maps/api/place/photo';

// const FOOD_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=${GOOGLE_API_KEY}`;
// const FIND_PLACE_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${GOOGLE_API_KEY}`;
// const SEARCH_URL1 = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${GOOGLE_API_KEY}`;

// add return if adding more functionality than just the single line

const getPhotoURL = (googlePlace) => {
  if (googlePlace.photos && googlePlace.photos.length && googlePlace.photos[0].photo_reference) {
    return `${GOOGLE_PLACE_PHOTO}?maxwidth=400&photoreference=${googlePlace.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`;
  }
  return 'https://via.placeholder.com/400';
};

const transformGooglePlaces = (googlePlaces = []) => googlePlaces.map((googlePlace) => ({
  name: googlePlace.name,
  address: googlePlace.formatted_address,
  placeId: googlePlace.place_id,
  price: googlePlace.price_level,
  rating: googlePlace.rating,
  photo: getPhotoURL(googlePlace),
  type: googlePlace.types,
}));

const getPlacesFromGoogle = async (req, res) => {
  try {
    const {
      searchTerm, food = false, nightlife = false, activities = false,
    } = req.body;

    let foodResults = [];
    let nightlifeResults = [];
    let activitiesResults = [];

    if (food) {
      const { data: foodData } = await axios.get(
        GOOGLE_TEXT_SEARCH_URL,
        {
          params: {
            query: `food+in+${searchTerm}`,
            key: GOOGLE_API_KEY,
          },
        },
      );
      foodResults = transformGooglePlaces(foodData.results);
    }
    if (nightlife) {
      const { data: nightlifeData } = await axios.get(
        GOOGLE_TEXT_SEARCH_URL,
        {
          params: {
            query: `nightlife+in+${searchTerm}`,
            key: GOOGLE_API_KEY,
          },
        },
      );
      nightlifeResults = transformGooglePlaces(nightlifeData.results);
    }
    if (activities) {
      const { activitiesData } = await axios.get(
        GOOGLE_TEXT_SEARCH_URL,
        {
          params: {
            query: `activities+in+${searchTerm}`,
            key: GOOGLE_API_KEY,
          },
        },
      );
      activitiesResults = transformGooglePlaces(activitiesData.results);
    }

    res.status(201).json({ foodResults, nightlifeResults, activitiesResults });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAllPlans = async (req, res) => {
  try {

    const {
      user: { id },
    } = req;
    console.log(req.user);
    const allPlans = await db.Plan.find({ userId: id });
    // const allPlans = await db.Plan.find({}).sort({ date: -1 })
    res.json({ allPlans });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const savePlanInDB = async (req, res) => {
  try {
    const payload = req.body;

    await db.Plan.create(payload);

    res.status(201).json({
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

    res.status(201).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const removePlaceInDB = () => {
  // You have make this a put request where you pass
  // in the plan ID and you remove the place from the
  // places array in the plan. So basically this is an
  // update operation and not a delete operation as
  // your places are within the plan.

  // PUT - /plans/:id/removePlace
};

const savePlaceInDB = () => {
  // Same as above should be an update request where you
  // update a plan by ID and add a new place to the places
  // array for the plan.

  // PUT - /plans/:id/addPlace
};

const getPlanById = () => {
  // This is should be simple as you find a plan
  // by the ID passed in the req params
};

apiRouter.post('/cities', getPlacesFromGoogle);
apiRouter.get('/plans', getAllPlans);
apiRouter.get('/plans/:id', getPlanById);
apiRouter.post('/plans', savePlanInDB);
apiRouter.delete('/plans/:id', removePlanInDB);
// should it be /?plan/places/:id?
apiRouter.put('/plans/:id/addPlace', savePlaceInDB);
apiRouter.put('/plans/:id/removePlace', removePlaceInDB);

export default apiRouter;
