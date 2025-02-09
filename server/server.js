import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';

// INITIALISE EXPRESS
const app = express();

// connect to the database
await connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.get('/', (req, res) => res.send("API is Working"));
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

  app.post('/webhooks', clerkWebhooks);
  

// PORT
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

// LISTEN
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
