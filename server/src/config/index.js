import 'dotenv/config';
import rateLimit from 'express-rate-limit';
import path from 'path';

const {
  MODE = 'development',
  HOSTNAME = 'localhost',
  HTTP_PORT = 3000,
  HTTPS_PORT = 3001,
  DB_CONNECTION_STRING,
  JWT_SECRET = 'ca0b8dcaaf55ac38a5d10',
  ALLOWED_ORIGIN = '*',
  SERVER_KEY_PATH = path.resolve(__dirname, '../../ssl/key.pem'),
  SERVER_CERT_PATH = path.resolve(__dirname, '../../ssl/cert.pem'),
} = process.env;

const config = {
  mode: MODE,
  hostname: HOSTNAME,
  http_port: HTTP_PORT,
  https_port: HTTPS_PORT,
  mongoUri: DB_CONNECTION_STRING,
  jwtSecret: JWT_SECRET,
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
  }),
  allowedOrigins: ALLOWED_ORIGIN.split(','),
  serverKeyPath: SERVER_KEY_PATH,
  serverCertPath: SERVER_CERT_PATH,
  // Other configuration options...
};

export default config;
