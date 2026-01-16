/**
 * Portuguese Billing System - Server Entry Point
 * SAF-T (PT) 1.04 Compliant
 *
 * This file starts a traditional Node.js server for local development.
 * For serverless deployment (Vercel), use api/index.ts instead.
 */

import app from './app';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
    // Validate required environment variables for local development
    const requiredEnvVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'RSA_PRIVATE_KEY',
        'COMPANY_NIF'
    ];

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(envVar => console.error(`   - ${envVar}`));
        console.error('\n💡 Copy .env.example to .env and configure all variables.');
        process.exit(1);
    }

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
}

export default app;
