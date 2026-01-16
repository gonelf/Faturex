/**
 * Portuguese Billing System - Main Application
 * SAF-T (PT) 1.04 Compliant
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { BillingService } from './services/billing.service';
import { createInvoiceRoutes } from './api/invoices.routes';
import { authenticateToken } from './api/middleware/auth.middleware';
import { errorHandler, notFoundHandler } from './api/middleware/error.middleware';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RSA_PRIVATE_KEY',
    'COMPANY_NIF'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} environment variable is required`);
        process.exit(1);
    }
}

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Faturex Portuguese Billing System',
        compliance: 'SAF-T (PT) 1.04',
        regulations: ['Portaria n.º 363/2010', 'Portaria n.º 195/2020']
    });
});

// Initialize Billing Service
const billingService = new BillingService(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    process.env.RSA_PRIVATE_KEY!,
    process.env.COMPANY_NIF!
);

// API Routes
app.use('/api/invoices', authenticateToken, createInvoiceRoutes(billingService));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🇵🇹 Faturex - Portuguese Billing System');
    console.log('='.repeat(60));
    console.log(`📋 SAF-T (PT) Version: 1.04`);
    console.log(`📜 Compliance: Portaria n.º 363/2010 & 195/2020`);
    console.log(`🔐 Digital Signature: RSA-SHA1`);
    console.log(`🎫 ATCUD: Enabled`);
    console.log(`📱 QR Code: Enabled`);
    console.log(`🏢 Company NIF: ${process.env.COMPANY_NIF}`);
    console.log('='.repeat(60));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/api/invoices`);
    console.log('='.repeat(60));
});

export default app;
