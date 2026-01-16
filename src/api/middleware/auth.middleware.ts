/**
 * Authentication Middleware
 * Validates Supabase JWT tokens
 */

import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

export interface AuthenticatedRequest extends Request {
    user?: any;
}

/**
 * Middleware to verify Supabase authentication token
 */
export async function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Authentication token required'
            });
            return;
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            res.status(403).json({
                success: false,
                error: 'Invalid or expired token'
            });
            return;
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export async function optionalAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const { data: { user } } = await supabase.auth.getUser(token);
            req.user = user || undefined;
        }

        next();
    } catch (error) {
        // Continue without user if authentication fails
        next();
    }
}
