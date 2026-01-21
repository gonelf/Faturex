/**
 * AT (Autoridade Tributária) API Routes
 * RESTful API for AT integration and credentials management
 */

import { Router, Request, Response } from 'express';
import * as ATService from '../services/at.service';

export function createATRoutes(): Router {
  const router = Router();

  /**
   * POST /api/at/validate-credentials
   * Validate AT Portal das Finanças credentials
   *
   * Body:
   * {
   *   "username": "123456789/0001",
   *   "password": "password123"
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "valid": true,
   *     "permissions": {
   *       "wse": true,
   *       "wfa": true,
   *       "wdt": false
   *     },
   *     "companyNif": "123456789",
   *     "companyName": "Empresa Exemplo, Lda"
   *   }
   * }
   */
  router.post('/validate-credentials', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username e password são obrigatórios',
        });
      }

      // Validate credentials with AT
      const validation = await ATService.validateCredentials({
        username,
        password,
      });

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error || 'Credenciais inválidas',
        });
      }

      res.status(200).json({
        success: true,
        data: validation,
        message: 'Credenciais validadas com sucesso',
      });
    } catch (error: any) {
      console.error('Error validating AT credentials:', error);

      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao validar credenciais',
      });
    }
  });

  /**
   * POST /api/at/credentials
   * Save AT credentials for the authenticated user's tenant
   *
   * Requires authentication (tenant context)
   *
   * Body:
   * {
   *   "tenantId": "uuid",
   *   "username": "123456789/0001",
   *   "password": "password123"
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "tenantId": "uuid",
   *     "atUsername": "123456789/0001",
   *     "wseEnabled": true,
   *     "wfaEnabled": true,
   *     "wdtEnabled": false,
   *     "isActive": true,
   *     "lastValidatedAt": "2026-01-21T12:00:00Z"
   *   }
   * }
   */
  router.post('/credentials', async (req: Request, res: Response) => {
    try {
      const { tenantId, username, password } = req.body;

      // Validate required fields
      if (!tenantId || !username || !password) {
        return res.status(400).json({
          success: false,
          error: 'tenantId, username e password são obrigatórios',
        });
      }

      // TODO: Add authentication middleware to verify user has access to this tenant
      // const userId = req.user?.id;
      // await verifyTenantAccess(userId, tenantId);

      // Save credentials
      const savedCredentials = await ATService.saveCredentials(tenantId, {
        username,
        password,
      });

      res.status(201).json({
        success: true,
        data: savedCredentials,
        message: 'Credenciais guardadas com sucesso',
      });
    } catch (error: any) {
      console.error('Error saving AT credentials:', error);

      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao guardar credenciais',
      });
    }
  });

  /**
   * GET /api/at/credentials/:tenantId
   * Get AT credentials status for a tenant (without password)
   *
   * Requires authentication (tenant context)
   *
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "tenantId": "uuid",
   *     "atUsername": "123456789/0001",
   *     "wseEnabled": true,
   *     "wfaEnabled": true,
   *     "wdtEnabled": false,
   *     "isActive": true,
   *     "lastValidatedAt": "2026-01-21T12:00:00Z"
   *   }
   * }
   */
  router.get('/credentials/:tenantId', async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;

      // TODO: Add authentication middleware to verify user has access to this tenant
      // const userId = req.user?.id;
      // await verifyTenantAccess(userId, tenantId);

      const credentials = await ATService.getCredentials(tenantId);

      if (!credentials) {
        return res.status(404).json({
          success: false,
          error: 'Credenciais AT não encontradas para este tenant',
        });
      }

      res.status(200).json({
        success: true,
        data: credentials,
      });
    } catch (error: any) {
      console.error('Error getting AT credentials:', error);

      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao obter credenciais',
      });
    }
  });

  /**
   * DELETE /api/at/credentials/:tenantId
   * Delete (deactivate) AT credentials for a tenant
   *
   * Requires authentication (tenant context)
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "Credenciais removidas com sucesso"
   * }
   */
  router.delete('/credentials/:tenantId', async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;

      // TODO: Add authentication middleware to verify user has access to this tenant
      // const userId = req.user?.id;
      // await verifyTenantAccess(userId, tenantId);

      await ATService.deleteCredentials(tenantId);

      res.status(200).json({
        success: true,
        message: 'Credenciais removidas com sucesso',
      });
    } catch (error: any) {
      console.error('Error deleting AT credentials:', error);

      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao remover credenciais',
      });
    }
  });

  return router;
}

export default createATRoutes;
