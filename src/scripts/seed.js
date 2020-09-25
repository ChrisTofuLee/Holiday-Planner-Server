import mongoose from 'mongoose';
import db from '../models';
import { DB_URI, MONGOOSE_OPTIONS } from '../config';

mongoose.connect(DB_URI, MONGOOSE_OPTIONS);

const plans = [
  {
    title: 'Norway',
    places: [
      {
        planId: '123123',
        name: "Tetsuya's Museum",
        address: '225 brown St, Sydney NSW 2000, Australia',
        googlePlacesId: 'placeId',
        rating: 4.2,
        type: 'type',
        price: 2,
        photo: 'photo',
        icon: 'icon',
        review: [
          {
            author_name: 'Luis Grassitelli',
            author_url:
              'https://www.google.com/maps/contrib/108498162103785018082/reviews',
            language: 'en',
            profile_photo_url:
              'https://lh6.ggpht.com/-kfgTHjdOa4U/AAAAAAAAAAI/AAAAAAAAAAA/1uk1VkdTQDk/s128-c0x00000000-cc-rp-mo-ba3/photo.jpg',
            rating: 5,
            relative_time_description: '8 months ago',
            text:
              "Really cozy and nice place to visit. Both inside or outside you'll find good service. Food is absolutely delicious (I tried the Mama Croquetes, the ceviche and the shrimps - all really tasty!).↵↵Besides that you can find good drinks too. Prices are also good for the quality you get. Definitely recommend visiting",
            time: 1578818723,
          },
        ],
        googleUrl: 'googleURL',
        siteUrl: 'siteurl',
        openingTimes: ['time', 'time2'],
      },
    ],
    userId: '5f5e2a70c67c9d6a78c50b4e',
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
