import axios from 'axios';
import express from 'express';
import db from '../models';

require('dotenv').config();

const { GOOGLE_API_KEY } = process.env;
const apiRouter = express.Router();

const FOOD_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=${GOOGLE_API_KEY}`;
const FIND_PLACE_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${GOOGLE_API_KEY}`;
const SEARCH_URL1 = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${GOOGLE_API_KEY}`;

const transformGooglePlaces = (googlePlaces = []) => {
  return googlePlaces.map((googlePlace) => {
    return {
      name: googlePlace.name,
      address: googlePlace.formatted_address,
      placeId: googlePlace.place_id,
      price: googlePlace.price_level,
      rating: googlePlace.rating,
      photo: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${googlePlace.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`,
      type: googlePlace.types,
    };
  });
};

const getPlacesFromGoogle = async (req, res) => {
  try {
    // const { searchTerm } = req.body;

    // places details `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
    const searchTerm = 'Barcelona';
    const SEARCH_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=food+in+${searchTerm}&key=${GOOGLE_API_KEY}`;

    const { data } = await axios.get(SEARCH_URL);
    const results = transformGooglePlaces(data.results);

    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const allPlans = await db.Plan.find({});
    // const allPlans = await db.Plan.find({}).sort({ date: -1 })
    console.log(data, FOOD_URL, FIND_PLACE_URL, SEARCH_URL1);
    res.status(201).json({ allPlans });
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

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(201).status(500).json({
      error: error.message,
    });
  }
};

// double check this
const removePlanInDB = async (req, res) => {
  try {
    const { id } = req.params;

    await db.Plan.places.findByIdAndDelete(id);
    const results = await db.Plan.places.find({});

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

const removePlaceInDB = async (req, res) => {
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

const savePlaceInDB = async (req, res) => {
  try {
    const payload = req.body;

    await db.Plan.places.create(payload);

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// const getPlanById = async (res, res) => {
//   res.json();
// };

apiRouter.get('/cities', getPlacesFromGoogle);
apiRouter.get('/plans', getAllPlans);
// apiRouter.get('/plans/:id', getPlanById)
apiRouter.post('/plans', savePlanInDB);
apiRouter.delete('/plans/:id', removePlanInDB);
// should it be /?plan/places/:id?
apiRouter.post('/places', savePlaceInDB);
apiRouter.delete('/places/:id', removePlaceInDB);

export default apiRouter;

// import axios from 'axios';
// import express from 'express';
// import db from '../models';

// require('dotenv').config();

// const { GOOGLE_API_KEY } = process.env;
// const apiRouter = express.Router();

// const FOOD_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=${GOOGLE_API_KEY}`;
// const SEARCH_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${GOOGLE_API_KEY}`;
// const FIND_PLACE_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${GOOGLE_API_KEY}`;

// const getPlacesFromGoogle = async (req, res) => {
//   try {
//     // const { searchTerm } = req.body;

//     const { data } = await axios.get(SEARCH_URL);
//     // const IMAGE_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.results.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`;
//     console.log(data, FOOD_URL, FIND_PLACE_URL);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// const getAllPlans = async (req, res) => {
//   try {
//     const {
//       user: { id },
//     } = req;
//     console.log(req.user);
//     const allPlans = await db.Plan.find({ userId: id });
//     // const allPlans = await db.Plan.find({}).sort({ date: -1 })
//     res.json({ allPlans });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// const savePlanInDB = async (req, res) => {
//   try {
//     const payload = req.body;

//     await db.Plan.create(payload);

//     res.json({
//       success: true,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// const removePlanInDB = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await db.Plan.findByIdAndDelete(id);
//     const results = await db.Plan.find({});

//     res.json({
//       success: true,
//       results,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// const removePlaceInDB = async (req, res) => {
//   res.json();
// };

// const savePlaceInDB = async (req, res) => {
//   res.json();
// };

// // const getPlanById = async (res, res) => {
// //   res.json();
// // };

// apiRouter.get('/cities', getPlacesFromGoogle);
// apiRouter.get('/plans', getAllPlans);
// // apiRouter.get('/plans/:id', getPlanById)
// apiRouter.post('/plans', savePlanInDB);
// apiRouter.post('/places', savePlaceInDB);
// apiRouter.delete('/plans/:id', removePlanInDB);
// apiRouter.delete('/places/:id', removePlaceInDB);

// export default apiRouter;
