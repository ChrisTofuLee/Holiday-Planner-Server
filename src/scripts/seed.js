import mongoose from 'mongoose';
import db from '../models';
import { DB_URI, MONGOOSE_OPTIONS } from '../config';

mongoose.connect(DB_URI, MONGOOSE_OPTIONS);

const plans = [
  {
    title: 'Norway',
    places: [
      {
        name: "Tetsuya's Restaurant",
        address: '529 Kent St, Sydney NSW 2000, Australia',
        type: 'food',
        rating: '4.6',
      },
      {
        name: "Tetsuya's Museum",
        address: '225 brown St, Sydney NSW 2000, Australia',
        type: 'daytime',
        rating: '4.2',
      },
    ],
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
