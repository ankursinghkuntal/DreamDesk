import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import {clerkMiddleware} from '@clerk/express';

// INITIALISE EXPRESS
const app = express();

// connect to the database
await connectDB();
await connectCloudinary()

// MIDDLEWARE
app.use(cors());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString(); } }));
app.use(clerkMiddleware());

// ROUTES
app.get('/', (req, res) => res.send("API is Working"));
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

app.post('/webhooks', clerkWebhooks)
app.use('/api/company',companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// PORT
const PORT = process.env.PORT || 5001;
Sentry.setupExpressErrorHandler(app);

// LISTEN
app.listen(PORT, () => console.log(
  `Server is running on port ${PORT}
  clerk_secret: ${process.env.CLERK_WEBHOOK_SECRET}
  jwt_secret: ${process.env.JWT_SECRET}
  `));





