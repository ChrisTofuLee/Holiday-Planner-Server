import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  places: [
    {
      googlePlacesId: {
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
  userId: {
    type: String,
    required: true,
  },
  // if need to multi reference
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  // },
});
// add last updated at?
const Plan = mongoose.model('Plan', schema);

export default Plan;
