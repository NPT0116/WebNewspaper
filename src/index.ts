import express, { Response, Request, NextFunction } from 'express';
import dotenv from 'dotenv';
import { AppError } from './utils/appError.js';
import session from 'express-session';
import connectDB from './config/db.js';
import MongoStore from 'connect-mongo';
import './strategy/localStrategy.js';
import passport from 'passport';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
dotenv.config();
connectDB();
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

app.use(router);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
