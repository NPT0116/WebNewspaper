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
import { registerUser, loginUser } from './controllers/accountController.js';
import flash from 'connect-flash';
import Account from './models/accountSchema.js';
import Profile from './models/profileSchema.js';

dotenv.config();

connectDB();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/login', (req: Request, res: Response) => {
  res.render('authentication/login', {
    flash: req.flash()
  });
});

app.post('account/login', loginUser);

app.get('/register', (req: Request, res: Response) => {
  res.render('authentication/register', {
    flash: req.flash()
  });
});

app.post('account/register', registerUser);

// Route: Home page
app.get('/', async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    try {
      // Lấy ID tài khoản từ session
      const userId = (req.user as any)?._id;

      if (!userId) {
        return res.redirect('/login');
      }

      // Tìm tài khoản và populate profileId
      const account = await Account.findById(userId).populate({
        path: 'profileId',
        model: 'Profile' // Đảm bảo đúng model
      });

      if (!account) {
        req.flash('error', 'Tài khoản không tồn tại.');
        return res.redirect('/login');
      }

      if (!account.profileId) {
        req.flash('error', 'Thông tin profile không khả dụng.');
        return res.redirect('/login');
      }

      // Render trang home
      res.render('layouts/reader/reader_home', {
        profile: account.profileId, // Truyền thông tin profile vào view
        flash: req.flash()
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      req.flash('error', 'Đã xảy ra lỗi khi tải thông tin profile.');
      return res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

app.use(router);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
