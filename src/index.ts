import express, { NextFunction, Response, Request } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import connectDB from './config/db.js';
import MongoStore from 'connect-mongo';
import './strategy/localStrategy.js';
import passport from 'passport';
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

// Route xử lý đăng nhập và hiển thị trang chủ
app.get('/', async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    try {
      // Kiểm tra xem req.user có tồn tại và có _id không
      if (!req.user) {
        return res.redirect('/login'); // Nếu không có thông tin người dùng, chuyển hướng đến trang login
      }

      // Tìm tài khoản người dùng và populate thông tin profileId từ bảng Profile
      const user = await Account.findById(req.user._id).populate('profileId');

      // Kiểm tra nếu không tìm thấy người dùng
      if (!user || !user.profileId) {
        return res.redirect('/login'); // Nếu không tìm thấy người dùng hoặc profileId, chuyển hướng về login
      }

      // Gửi thông tin profile của người dùng vào view
      res.render('home', { user: user.profileId });
    } catch (error) {
      console.error(error);
      return res.redirect('/login'); // Nếu có lỗi, chuyển hướng về login
    }
  } else {
    res.redirect('/login'); // Nếu người dùng chưa đăng nhập, chuyển hướng tới trang login
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
