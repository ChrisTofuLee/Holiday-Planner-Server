import mongoose from 'mongoose';
import db from '../models';
import { DB_URI, MONGOOSE_OPTIONS } from '../config';

mongoose.connect(DB_URI, MONGOOSE_OPTIONS);

const users = [{ email: 'abc@abc.com', displayName: 'abc', password: '123' }];
db.User.deleteMany({})
  .then(() => db.User.collection.insertMany(users))
  .then((data) => {
    console.log(`${data.result.n} records inserted!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
