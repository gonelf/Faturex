/**
 * Vercel Serverless Function Handler
 * Routes all requests to the Express application
 */

import app from '../src/app';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Export the Express app as a serverless function
export default app;
