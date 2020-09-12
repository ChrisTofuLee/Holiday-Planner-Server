const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  destinations: {
    type: [String],
  },
});

const Plan = mongoose.model('Plan', schema);

module.exports = Plan;
