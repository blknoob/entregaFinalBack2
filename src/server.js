import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import { connectDB } from "./configs/db.js";
import { configureHandlebars } from "./configs/handlebars.js";
import { initializePassport } from "./configs/passport/index.js";


import indexRouter from "./routes/index.router.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'default-secret'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

configureHandlebars(app);

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

import jwt from 'jsonwebtoken';
app.use((req, res, next) => {
  const token = req.cookies?.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;
    } catch (e) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

app.use(express.static("public"));

app.use("/", indexRouter);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Base de datos conectada");

    app.listen(PORT, () => {
      console.log(`Servidor en puerto ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

startServer();