import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import config from '../config';
import errorHandler from '../helpers/dbErrorHandler';
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';

const { getErrorMessage } = errorHandler;
const { mongoUri, rateLimit, allowedOrigins, hostname, https_port } = config;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB ${mongoUri}`);
  } catch (err) {
    console.error(getErrorMessage(err));
    process.exit(1);
  }
};

const setupMongoDBConnectionHandlers = () => {
  const db = mongoose.connection;
  db.on('error', err => console.error(getErrorMessage(err)));
  db.once('open', () => console.log(`Connected to MongoDB ${mongoUri}`));
};

const initializeMiddlewares = app => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.text());
  app.use(express.raw());
  app.use(cookieParser());
  app.use(compression());
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(rateLimit);
  app.use(cors({ origin: allowedOrigins, credentials: true }));
};

const initializeRoutes = app => {
  app.use('/', userRoutes);
  app.use('/', authRoutes);
};

const initializeErrorHandling = app => {
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ error: `${err.name}: ${err.message}` });
    } else if (err) {
      res.status(400).json({ error: `${err.name}: ${err.message}` });
      console.error(err);
    }
  });
};

const redirectHttpToHttps = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && req.protocol === 'http') {
    const redirectTo = `https://${hostname}:${https_port}${req.url}`;
    return res.redirect(301, redirectTo);
  }
  next();
};

const setupExpressApp = () => {
  const app = express();

  // Redirect HTTP to HTTPS in production
  app.use(redirectHttpToHttps);

  connectToMongoDB();
  setupMongoDBConnectionHandlers();
  initializeMiddlewares(app);
  initializeRoutes(app);
  initializeErrorHandling(app);

  return app;
};

export default setupExpressApp();
