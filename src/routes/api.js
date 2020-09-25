import axios from 'axios';
import express from 'express';
import db from '../models';

require('dotenv').config();

const { GOOGLE_API_KEY, BACKUP_API_KEY } = process.env;
const apiRouter = express.Router();

const GOOGLE_TEXT_SEARCH_URL =
  'https://maps.googleapis.com/maps/api/place/textsearch/json';
const GOOGLE_PLACE_PHOTO = 'https://maps.googleapis.com/maps/api/place/photo';

// const FOOD_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=${GOOGLE_API_KEY}`;
// const FIND_PLACE_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${GOOGLE_API_KEY}`;
// const SEARCH_URL1 = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${GOOGLE_API_KEY}`;

// add return if adding more functionality than just the single line

const getPhotoURL = (googlePlace) => {
  if (
    googlePlace.photos &&
    googlePlace.photos.length &&
    googlePlace.photos[0].photo_reference
  ) {
    return `${GOOGLE_PLACE_PHOTO}?maxwidth=300&photoreference=${googlePlace.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`;
  }
  return 'https://via.placeholder.com/400';
};

const getPlaceDetails = async (googlePlace, term) => {
  const DETAILS_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlace.place_id}&key=${GOOGLE_API_KEY}`;
  const { data } = await axios.get(DETAILS_URL);
  // const { reviews, url, website, opening_hours: {weekday_text}} = detailsData;
  // const filtered = if (term == reviews) {}
  if (term === 'weekday_text') {
    const detailData = data.result.opening_hours[term];
    return detailData;
  }
  const detailData = data.result[term];
  return detailData;
};

// places details `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}` ?limit=10

const transformGooglePlaces = async (googlePlaces = [], type) => {
  // const placeOne = await getPlaceDetails(googlePlaces[0], 'reviews');

  const data = await Promise.all(
    googlePlaces.map(async (googlePlace) => {
      const review = await getPlaceDetails(googlePlace, 'reviews');
      return {
        name: googlePlace.name,
        address: googlePlace.formatted_address,
        googlePlacesId: googlePlace.place_id,
        price: googlePlace.price_level,
        rating: googlePlace.rating,
        photo: getPhotoURL(googlePlace),
        type,
        icon: googlePlace.icon,
        review,
        googleUrl: await getPlaceDetails(googlePlace, 'url'),
        siteUrl: await getPlaceDetails(googlePlace, 'website'),
        openingTimes: await getPlaceDetails(googlePlace, 'weekday_text'),
      };
    }),
  );
  return data;
};

const getPlacesFromGoogle = async (req, res) => {
  try {
    const {
      searchTerm,
      food = false,
      nightlife = false,
      activities = false,
    } = req.body;

    let foodResults = [];
    let nightlifeResults = [];
    let activitiesResults = [];

    if (food) {
      const { data: foodData } = await axios.get(GOOGLE_TEXT_SEARCH_URL, {
        params: {
          query: `food+in+${searchTerm}`,
          key: BACKUP_API_KEY,
        },
      });
      foodData.results.splice(0, 19);
      foodResults = await transformGooglePlaces(foodData.results, 'Food');
    }
    if (nightlife) {
      const { data: nightlifeData } = await axios.get(GOOGLE_TEXT_SEARCH_URL, {
        params: {
          query: `nightlife+in+${searchTerm}`,
          key: GOOGLE_API_KEY,
        },
      });
      nightlifeData.results.splice(0, 19);
      nightlifeResults = await transformGooglePlaces(
        nightlifeData.results,
        'Nightlife',
      );
    }
    if (activities) {
      const { data: activitiesData } = await axios.get(GOOGLE_TEXT_SEARCH_URL, {
        params: {
          query: `activities+in+${searchTerm}`,
          key: GOOGLE_API_KEY,
        },
      });
      activitiesData.results.splice(0, 19);
      activitiesResults = await transformGooglePlaces(
        activitiesData.results,
        'Activities',
      );
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
    console.log('getallplans', req.user);
    // const allPlans = await db.Plan.find({ userId: id });
    const allPlans = await db.Plan.find({ userId: id }).sort({ createdAt: -1 });
    res.json({ allPlans });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const savePlanInDB = async (req, res) => {
  try {
    const { planName } = req.body;
    const planTitle = { title: planName };
    const currentUserId = req.user.id;
    const plan = { ...planTitle, userId: currentUserId };
    const createdPlan = await db.Plan.create(plan);

    res.status(201).json({
      success: true,
      createdPlan,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const removePlanInDB = async (req, res) => {
  try {
    const planId = req.params.id;

    await db.Plan.findByIdAndDelete(planId);
    // await db.Plan.find({});

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const removePlaceInDB = async (req, res) => {
  // You have make this a put request where you pass
  // in the plan ID and you remove the place from the
  // places array in the plan. So basically this is an
  // update operation and not a delete operation as
  // your places are within the plan.
  // PUT - /plans/:id/removePlace
  try {
    const { id } = req.params;
    const { googlePlacesId } = req.body;

    const plan = await db.Plan.findById(id);
    const newPlaces = plan.places.filter((place) => place.googlePlacesId !== googlePlacesId);
    plan.places = newPlaces;
    const newPlaceList = await plan.save();

    res.status(201).json({
      success: true,
      newPlaceList,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const addPlaceInDB = async (req, res) => {
  // Same as above should be an update request where you
  // update a plan by ID and add a new place to the places
  // array for the plan.
  // PUT - /plans/:id/addPlace
  try {
    const { id } = req.params;
    const payload = req.body;

    // const placeAdded = await db.Plan.findByIdAndUpdate(
    //   id,
    //   {
    //     $push: {
    //       places: payload,
    //     },
    //   },
    //   { new: true },

    // );

    const plan = await db.Plan.findById(id);
    plan.places.push({ ...payload, planId: id });
    const placeAdded = await plan.save();
    console.log(placeAdded);
    res.status(201).json({
      success: true,
      placeAdded,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getPlanById = async (req, res) => {
  // This is should be simple as you find a plan
  // by the ID passed in the req params
  try {
    const { id } = req.params;

    const data = await db.Plan.findById(id);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const { id, placeId } = req.params;

    const plan = await db.Plan.findById(id);

    // const foundPlace = await plan.places.find((place) => place._id === placeId);
    const foundPlace = await plan.places.filter(
      (place) => place._id === placeId,
    );
    console.log(foundPlace);
    res.status(201).json({
      success: true,
      foundPlace,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

apiRouter.post('/cities', getPlacesFromGoogle);
apiRouter.post('/plans', savePlanInDB);
apiRouter.get('/plans', getAllPlans);
apiRouter.get('/plans/:id', getPlanById);
apiRouter.get('/plans/:id/place/:placeId', getPlaceById);
apiRouter.delete('/plans/:id', removePlanInDB);
apiRouter.put('/plans/:id/addPlace', addPlaceInDB);
apiRouter.put('/plans/:id/removePlace', removePlaceInDB);

export default apiRouter;
