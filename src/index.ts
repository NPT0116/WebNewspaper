import express, { NextFunction, Response, Request } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import connectDB from './config/db.js';
import MongoStore from 'connect-mongo';

import passport from 'passport';
import './strategy/localStrategy.js';
import './strategy/githubStrategy.js';

import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/appError.js';
import flash from 'connect-flash';
dotenv.config();

connectDB();
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(flash()); // Initialize connect-flash
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

app.use(passport.session());

app.use(router);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
