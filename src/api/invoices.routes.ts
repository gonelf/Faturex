/**
 * Invoice API Routes
 * RESTful API for invoice management with SAF-T compliance
 */

import { Router, Request, Response } from 'express';
import { BillingService } from '../services/billing.service';

export function createInvoiceRoutes(billingService: BillingService): Router {
    const router = Router();

    /**
     * POST /api/invoices
     * Create a new draft invoice
     *
     * Body:
     * {
     *   "seriesId": "uuid",
     *   "customerId": "uuid",
     *   "invoiceDate": "2026-01-16",
     *   "sourceId": "user123",
     *   "lines": [
     *     {
     *       "productId": "uuid",
     *       "quantity": 2,
     *       "unitPrice": 50.00,
     *       "description": "Product description",
     *       "taxId": "uuid"
     *     }
     *   ]
     * }
     */
    router.post('/', async (req: Request, res: Response) => {
        try {
            const invoice = await billingService.createInvoice(req.body);

            res.status(201).json({
                success: true,
                data: invoice,
                message: 'Invoice created successfully'
            });
        } catch (error: any) {
            console.error('Error creating invoice:', error);

            res.status(400).json({
                success: false,
                error: error.message || 'Failed to create invoice'
            });
        }
    });

    /**
     * POST /api/invoices/:id/finalize
     * Finalize an invoice (make it immutable)
     *
     * Body:
     * {
     *   "sourceId": "user123"
     * }
     */
    router.post('/:id/finalize', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { sourceId } = req.body;

            if (!sourceId) {
                return res.status(400).json({
                    success: false,
                    error: 'sourceId is required'
                });
            }

            const invoice = await billingService.finalizeInvoice(id, sourceId);

            res.status(200).json({
                success: true,
                data: invoice,
                message: 'Invoice finalized successfully. Document is now immutable.'
            });
        } catch (error: any) {
            console.error('Error finalizing invoice:', error);

            res.status(400).json({
                success: false,
                error: error.message || 'Failed to finalize invoice'
            });
        }
    });

    /**
     * POST /api/invoices/:id/cancel
     * Cancel an invoice (only if not finalized)
     *
     * Body:
     * {
     *   "sourceId": "user123",
     *   "reason": "Customer request"
     * }
     */
    router.post('/:id/cancel', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { sourceId, reason } = req.body;

            if (!sourceId || !reason) {
                return res.status(400).json({
                    success: false,
                    error: 'sourceId and reason are required'
                });
            }

            const invoice = await billingService.cancelInvoice(id, sourceId, reason);

            res.status(200).json({
                success: true,
                data: invoice,
                message: 'Invoice cancelled successfully'
            });
        } catch (error: any) {
            console.error('Error cancelling invoice:', error);

            res.status(400).json({
                success: false,
                error: error.message || 'Failed to cancel invoice'
            });
        }
    });

    return router;
}
