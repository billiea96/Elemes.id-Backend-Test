import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth, uploadImage } from '../utils.js';

const courseRouter = express.Router();

courseRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const courses = await Course.find({}).populate('lecturer', 'name email');
    res.send(courses);
  }),
);

courseRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const name = req.query.name || '';
    const category = req.query.category || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const freeFilter = order === 'free' ? { price: 0 } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'free'
        ? { rating: 1 }
        : { _id: -1 };

    const courses = await Course.find({
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...freeFilter,
    })
      .populate('lecturer', 'name email')
      .sort(sortOrder);
    res.send(courses);
  }),
);

courseRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Course.find().distinct('category');
    res.send(categories);
  }),
);

courseRouter.get(
  '/popular-categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$numReviews' },
        },
      },
      {
        $sort: { avgRating: -1 },
      },
      {
        $limit: 3,
      },
    ]);
    res.send(categories);
  }),
);

courseRouter.get(
  '/simple-statistics',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const totalUsers = await User.count({ isDeleted: false });
    const totalCourses = await Course.count({});
    const totalFreeCourses = await Course.count({ price: 0 });

    res.send({ totalUsers, totalCourses, totalFreeCourses });
  }),
);

courseRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Course.remove({});
    const lecturer = await User.findOne({ isLecturer: true });
    if (lecturer) {
      const courses = data.courses.map((course) => ({
        ...course,
        lecturer: _id,
      }));
      const createdCourse = await Course.insertMany(courses);
      res.status(201).send({ createdCourse });
    } else {
      res
        .status(500)
        .send({ message: 'No user found. First run /api/users/seed' });
    }
  }),
);

courseRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate(
      'lecturer',
      'name email',
    );
    if (course) {
      res.send(course);
    } else {
      res.status(404).send({ message: 'Course Not Found' });
    }
  }),
);

courseRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const image = req.body.image
      ? await uploadImage(req.body.image, req.body.category)
      : '';

    const course = new Course({
      name: req.body.name,
      lecturer: req.user._id,
      image: image ? image.secure_url : '',
      price: req.body.price || 0,
      category: req.body.category,
      rating: req.body.rating || 0,
      numReviews: req.body.numReviews || 0,
      description: req.body.description,
    });

    const createdCourse = await course.save();
    res.status(201).send({ message: 'Course Created', course: createdCourse });
  }),
);

courseRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (course) {
      course.name = req.body.name || course.name;
      course.price =
        req.body.price === 0 || req.body.price ? req.body.price : course.price;

      if (course.image !== req.body.image) {
        const image = req.body.image
          ? await uploadImage(req.body.image, req.body.category)
          : '';
        course.image = image ? image.secure_url : course.image;
      }
      course.category = req.body.category || course.category;
      course.rating =
        req.body.rating === 0 || req.body.rating
          ? req.body.rating
          : course.rating;
      course.numReviews =
        req.body.numReviews === 0 || req.body.numReviews
          ? req.body.numReviews
          : course.numReviews;
      course.description = req.body.description || course.description;

      const updatedCourse = await course.save();
      res.send({ message: 'Course Updated', course: updatedCourse });
    } else {
      res.status(404).send({ message: 'Course Not Found' });
    }
  }),
);

courseRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
      const deletedCourse = await course.remove();
      res.send({ message: 'Course Deleted', course: deletedCourse });
    } else {
      res.status(404).send({ message: 'Course Not Found' });
    }
  }),
);

export default courseRouter;
