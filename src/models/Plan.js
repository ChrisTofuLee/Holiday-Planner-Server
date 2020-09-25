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
      price: {
        type: Number,
      },
      photo: {
        type: String,
      },
      icon: {
        type: String,
      },
      review: {
        type: [
          {
            author_name: {
              type: String,
            },
            author_url: {
              type: String,
            },
            language: {
              type: String,
            },
            profile_photo_url: {
              type: String,
            },
            rating: {
              type: String,
            },
            relative_time_description: {
              type: String,
            },
            text: {
              type: String,
            },
            time: {
              type: String,
            },
          },
        ],
      },
      googleUrl: {
        type: String,
      },
      siteUrl: {
        type: String,
      },
      openingTimes: {
        type: [String],
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
