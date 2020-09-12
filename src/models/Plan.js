const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  places: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
      },
    },
  ],
});
//add last updated at?
const Plan = mongoose.model('Plan', schema);

module.exports = Plan;
