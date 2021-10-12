import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import courseRouter from './routers/courseRouter.js';
import userRouter from './routers/userRouter.js';
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/backendtest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
