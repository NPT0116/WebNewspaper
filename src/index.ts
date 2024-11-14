import express, { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import { AppError } from "./utils/appError.js";
import session from "express-session";
import connectDB from "./config/db.js";
import MongoStore from "connect-mongo";
import "./strategy/localStrategy.js";
import passport from "passport";
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
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("helloworld");
});

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "welcome to the api page" });
});
app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError("this is error page.", 500));
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
