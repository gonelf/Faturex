/**
 * Portuguese Billing System - Express Application
 * SAF-T (PT) 1.04 Compliant
 *
 * This file exports the Express app without starting the server,
 * making it compatible with both traditional Node.js hosting and
 * serverless platforms like Vercel.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Faturex Portuguese Billing System',
        compliance: 'SAF-T (PT) 1.04',
        regulations: ['Portaria n.º 363/2010', 'Portaria n.º 195/2020']
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        name: 'Faturex - Portuguese Billing System',
        version: '1.0.0',
        compliance: 'SAF-T (PT) 1.04',
        regulations: [
            'Portaria n.º 363/2010 - Digital Signatures',
            'Portaria n.º 195/2020 - ATCUD & QR Codes'
        ],
        features: [
            'RSA-SHA1 Digital Signatures',
            'Document Chaining',
            'ATCUD Generation',
            'QR Code Generation',
            'NIF Validation (Modulo 11)',
            'Sequential Numbering',
            'Document Immutability'
        ],
        endpoints: {
            health: '/health',
            invoices: '/api/invoices',
            at: '/api/at'
        }
    });
});

// Initialize services only when environment variables are available
let routesInitialized = false;

const initializeRoutes = async () => {
    if (routesInitialized) {
        return;
    }

    // Check if required environment variables are set
    const requiredEnvVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'RSA_PRIVATE_KEY',
        'COMPANY_NIF'
    ];

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
        console.warn('Invoice routes will not be initialized. Configure environment variables in Vercel dashboard.');

        // Add a placeholder route that returns configuration error
        app.use('/api/invoices', (req: Request, res: Response) => {
            res.status(503).json({
                error: 'Service Unavailable',
                message: 'Billing service not configured. Missing environment variables.',
                missingVariables: missingVars,
                instructions: 'Please configure the required environment variables in your Vercel project settings.'
            });
        });

        return;
    }

    try {
        // Dynamically import services to avoid initialization errors
        const { BillingService } = await import('./services/billing.service');
        const { createInvoiceRoutes } = await import('./api/invoices.routes');
        const { authenticateToken } = await import('./api/middleware/auth.middleware');

        // Initialize Billing Service
        const billingService = new BillingService(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            process.env.RSA_PRIVATE_KEY!,
            process.env.COMPANY_NIF!
        );

        // API Routes
        app.use('/api/invoices', authenticateToken, createInvoiceRoutes(billingService));

        // AT (Autoridade Tributária) Routes
        const { createATRoutes } = await import('./api/at.routes');
        app.use('/api/at', authenticateToken, createATRoutes());

        routesInitialized = true;
        console.log('✅ Invoice routes initialized successfully');
        console.log('✅ AT routes initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize invoice routes:', error);

        // Add error route
        app.use('/api/invoices', (req: Request, res: Response) => {
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to initialize billing service',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        });
    }
};

// Initialize routes on first request (lazy initialization for serverless)
app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!routesInitialized && (req.path.startsWith('/api/invoices') || req.path.startsWith('/api/at'))) {
        await initializeRoutes();
    }
    next();
});

// Error handling middleware
import { errorHandler, notFoundHandler } from './api/middleware/error.middleware';
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
