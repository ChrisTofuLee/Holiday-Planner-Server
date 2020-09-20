import mongoose from 'mongoose';
import db from '../models';
import { DB_URI, MONGOOSE_OPTIONS } from '../config';

mongoose.connect(DB_URI, MONGOOSE_OPTIONS);

const plans = [
  {
    title: 'Norway',
    places: [
      
      {
        name: "Tetsuya's Museum",
        address: '225 brown St, Sydney NSW 2000, Australia',
        googlePlacesId: 'placeId',
        rating: 4.2,
        type: 'type',
        price: 2,
        photo: 'photo',
        icon: 'icon',
      },
      {
        name: 'name1',
        address: 'address',
        googlePlacesId: 'placeId',
        rating: 4,
        type: 'type',
        price: 5,
        photo: 'photo',
        icon: 'icon',
      },
    ],
    userId: '5f5e2a70c67c9d6a78c50b4e',
  },
  {
    title: 'France',
    places: [
      {
        name: 'name3',
        address: 'address',
        googlePlacesId: 'placeId',
        rating: 4,
        type: 'type',
        price: 2,
        photo: 'photo',
        icon: 'icon',
      },
      {
        name: 'name1',
        address: 'address',
        googlePlacesId: 'placeId',
        rating: 4,
        type: 'type',
        price: 3,
        photo: 'photo',
        icon: 'icon',
      },
    ],
    userId: '1314124323',
  },
];
db.Plan.deleteMany({})
  .then(() => db.Plan.collection.insertMany(plans))
  .then((data) => {
    console.log(`${data.result.n} records inserted!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
