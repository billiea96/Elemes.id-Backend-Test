import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      required: true,
    },
    numReviews: {
      type: Number,
      default: 0,
      required: true,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
