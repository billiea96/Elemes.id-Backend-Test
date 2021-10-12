import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    if (users.length === 0) {
      const createdUsers = await User.insertMany(data.users);
      res.status(201).send({ createdUsers });
    } else {
      res.status(200).send({ message: 'Users have been filled' });
    }
  }),
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.isDeleted) {
        return res.status(400).send({ message: 'User has been deleted' });
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isLecturer: user.isLecturer,
          token: generateToken(user),
        });
      }
    }

    return res.status(401).send({ message: 'Invalid user or password' });
  }),
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    let { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status('400').send({ message: 'Email is already used' });
    }
    password = bcrypt.hashSync(password, 8);
    const user = new User({ name, email, password });

    const createdUser = await user.save();
    res.status(201).send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isLecturer: createdUser.isLecturer,
      token: generateToken(createdUser),
    });
  }),
);

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  }),
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isLecturer: updatedUser.isLecturer,
        token: generateToken(updatedUser),
      });
    }
  }),
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({ isDeleted: false });
    res.send(users);
  }),
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@gmail.com') {
        return res
          .status(400)
          .send({ message: 'Can Not Delete Root Admin User' });
      }
      user.isDeleted = true;
      const deletedUser = await user.save();
      res.send({ message: 'User Deleted', user: deletedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isLecturer = Boolean(req.body.isLecturer) || user.isLecturer;
      user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;
      user.isDeleted = Boolean(req.body.isDeleted) || user.isDeleted;

      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),
);

export default userRouter;
