import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isLecturer: user.isLecturer,
      isDeleted: user.isDeleted,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '3d',
    },
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {
          res.status(404).send({ message: 'Invalid token' });
        } else {
          req.user = decode;
          next();
        }
      },
    );
  } else {
    res.status(404).send({ message: 'No token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(404).send({ message: 'Invalid Admin Token' });
  }
};

export const isLecturerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isLecturer || req.user.isAdmin)) {
    next();
  } else {
    res.status(404).send({ message: 'Invalid Admin/Lecturer Token' });
  }
};

export const uploadImage = (path, category = null) => {
  const options = category ? { tags: category } : {};

  return cloudinary.v2.uploader.upload(path, options);
};
