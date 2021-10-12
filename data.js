import bcrypt from 'bcryptjs';
const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: true,
      isLecturer: true,
    },
    {
      name: 'John',
      email: 'john@gmail.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: false,
      isLecturer: false,
    },
  ],
  courses: [
    {
      name: 'MERN Stack Course',
      category: 'Programming',
      image: '/images/p1.jpg',
      price: 1000000,
      rating: 4.5,
      numReviews: 100,
      description: 'Learn Mongoose, Express, React, & Node',
    },
    {
      name: 'Backend Fundamental For Beginner',
      category: 'Programming',
      image: '/images/p2.jpg',
      price: 0,
      rating: 4.4,
      numReviews: 80,
      description: 'Backend Fundamental For Beginner With Node JS',
    },
    {
      name: 'How to Improve Sales In One Month',
      category: 'Business',
      image: '/images/p3.jpg',
      price: 720000,
      rating: 4.7,
      numReviews: 70,
      description: 'Learn how to rapidly increasing sales',
    },
    {
      name: 'Become a Billionaire with stocks',
      category: 'Economics',
      image: '/images/p4.jpg',
      price: 600000,
      rating: 4.5,
      numReviews: 140,
      description:
        "Learn how to become a billionaire with Benjamin Graham's way",
    },
    {
      name: 'Mastering Photoshop in a Week',
      category: 'Design',
      image: '/images/p5.jpg',
      price: 450000,
      rating: 4.2,
      numReviews: 50,
      description: 'How to mastering photoshop and create wondeful design',
    },
    {
      name: 'Essential Cooking Skills',
      category: 'Lifestyle',
      image: '/images/p6.jpg',
      price: 250000,
      rating: 4.7,
      numReviews: 300,
      description: 'The important things to become a chef',
    },
    {
      name: 'Guitar Lesson for Beginner',
      category: 'Music',
      image: '/images/p7.jpg',
      price: 0,
      rating: 4.7,
      numReviews: 200,
      description: 'Free Course Guitar Lesson for Beginner',
    },
  ],
};

export default data;
