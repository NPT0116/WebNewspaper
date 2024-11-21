import express, { NextFunction, Response, Request } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import connectDB from './config/db.js';
import MongoStore from 'connect-mongo';

import passport from 'passport';
import './strategy/localStrategy.js';
import './strategy/githubStrategy.js';

import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/appError.js';

import flash from 'connect-flash';
import apiRouter from './api/indexApi.js';
import { PATH } from './config/path.js';
import { Article } from './models/Article/articleSchema.js';
import { Tag } from './models/Tag/tagSchema.js';
import { getHotNews } from './repo/Article/landingpage.js';
import { configureSocketIO } from './config/socket.js';
import { createServer } from 'http';
import sectionRoutes from './routes/sectionRouter.js';
dotenv.config();

connectDB();
const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(flash()); // Thêm middleware flash

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
const io = configureSocketIO(server);
app.use('/uploads', express.static('uploads'));

app.use(router);
app.use(PATH.API.BASE, apiRouter);

app.use('/section', sectionRoutes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
