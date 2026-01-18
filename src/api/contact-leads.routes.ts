/**
 * Contact Leads API Routes
 * RESTful API for managing contact form submissions and leads
 */

import { Router, Request, Response } from 'express';
import { ContactLeadsService } from '../services/contact-leads.service';

export function createContactLeadsRoutes(contactLeadsService: ContactLeadsService): Router {
  const router = Router();

  /**
   * POST /api/contact-leads
   * Create a new contact lead from the contact form
   *
   * Body:
   * {
   *   "name": "João Silva",
   *   "email": "joao@example.com",
   *   "phone": "+351 912 345 678",
   *   "business_type": "Consultoria",
   *   "message": "Gostaria de saber mais sobre os vossos serviços",
   *   "source": "homepage_form"
   * }
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { name, email, phone, business_type, message, source } = req.body;

      // Validation
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          error: 'Nome, email e telefone são obrigatórios',
        });
      }

      // RFC 5322 compliant email validation
      // This regex is compatible with Resend's validation requirements
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido',
        });
      }

      // Additional validation: check for common invalid patterns
      if (email.includes('..') || email.startsWith('.') || email.includes('@.') || email.includes('.@')) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido',
        });
      }

      // Capture request metadata
      const user_agent = req.headers['user-agent'] || undefined;
      const ip_address = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
                        req.socket.remoteAddress ||
                        undefined;

      const lead = await contactLeadsService.createContactLead({
        name,
        email,
        phone,
        business_type,
        message,
        source,
        user_agent,
        ip_address,
      });

      res.status(201).json({
        success: true,
        data: lead,
        message: 'Contacto registado com sucesso. Entraremos em contacto brevemente.',
      });
    } catch (error: any) {
      console.error('[API ERROR] Error creating contact lead:', {
        error,
        errorMessage: error?.message,
        errorStack: error?.stack,
        requestBody: { name, email, phone, business_type, message, source },
      });

      // In development, include more error details
      const isDevelopment = process.env.NODE_ENV === 'development';
      const errorMessage = isDevelopment && error?.message
        ? `Erro: ${error.message}`
        : 'Erro ao registar contacto. Por favor, tente novamente.';

      res.status(500).json({
        success: false,
        error: errorMessage,
        ...(isDevelopment && { debug: { message: error?.message, stack: error?.stack } }),
      });
    }
  });

  /**
   * GET /api/contact-leads
   * Get all contact leads with optional filtering
   *
   * Query params:
   * - status: Filter by status (new, contacted, qualified, converted, rejected)
   * - limit: Number of results to return
   * - offset: Number of results to skip
   */
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { status, limit, offset } = req.query;

      const leads = await contactLeadsService.getContactLeads({
        status: status as string | undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      res.status(200).json({
        success: true,
        data: leads,
        count: leads.length,
      });
    } catch (error: any) {
      console.error('Error fetching contact leads:', error);

      res.status(500).json({
        success: false,
        error: 'Erro ao buscar contactos',
      });
    }
  });

  /**
   * GET /api/contact-leads/:id
   * Get a single contact lead by ID
   */
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const lead = await contactLeadsService.getContactLeadById(id);

      if (!lead) {
        return res.status(404).json({
          success: false,
          error: 'Contacto não encontrado',
        });
      }

      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error: any) {
      console.error('Error fetching contact lead:', error);

      res.status(500).json({
        success: false,
        error: 'Erro ao buscar contacto',
      });
    }
  });

  /**
   * PATCH /api/contact-leads/:id/status
   * Update contact lead status
   *
   * Body:
   * {
   *   "status": "contacted",
   *   "notes": "Cliente contactado via email"
   * }
   */
  router.patch('/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status é obrigatório',
        });
      }

      const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Status inválido. Valores aceites: ${validStatuses.join(', ')}`,
        });
      }

      const lead = await contactLeadsService.updateContactLeadStatus(id, status, notes);

      res.status(200).json({
        success: true,
        data: lead,
        message: 'Status atualizado com sucesso',
      });
    } catch (error: any) {
      console.error('Error updating contact lead status:', error);

      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar status',
      });
    }
  });

  return router;
}
