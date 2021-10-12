import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import courseRouter from './routers/courseRouter.js';
import userRouter from './routers/userRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/backendtest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
