/**
 * Contact Leads API Route
 * Next.js App Router API for managing contact form submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContactLeadsService } from '@/src/services/contact-leads.service';

/**
 * POST /api/contact-leads
 * Create a new contact lead from the contact form
 */
export async function POST(request: NextRequest) {
  let body: any = {};

  try {
    body = await request.json();
    const { name, email, phone, business_type, message, source } = body;

    // Validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome, email e telefone são obrigatórios',
        },
        { status: 400 }
      );
    }

    // RFC 5322 compliant email validation
    // This regex is compatible with Resend's validation requirements
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email inválido',
        },
        { status: 400 }
      );
    }

    // Additional validation: check for common invalid patterns
    if (email.includes('..') || email.startsWith('.') || email.includes('@.') || email.includes('.@')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email inválido',
        },
        { status: 400 }
      );
    }

    // Capture request metadata
    const user_agent = request.headers.get('user-agent') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip_address = forwarded ? forwarded.split(',')[0].trim() : undefined;

    // Initialize service (lazy loading to avoid build-time initialization)
    const contactLeadsService = new ContactLeadsService();

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

    return NextResponse.json(
      {
        success: true,
        data: lead,
        message: 'Contacto registado com sucesso. Entraremos em contacto brevemente.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API ERROR] Error creating contact lead:', {
      error,
      errorMessage: error?.message,
      errorStack: error?.stack,
      requestBody: body,
    });

    // In development, include more error details
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = isDevelopment && error?.message
      ? `Erro: ${error.message}`
      : 'Erro ao registar contacto. Por favor, tente novamente.';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(isDevelopment && { debug: { message: error?.message, stack: error?.stack } }),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact-leads
 * Get all contact leads with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Initialize service (lazy loading to avoid build-time initialization)
    const contactLeadsService = new ContactLeadsService();

    const leads = await contactLeadsService.getContactLeads({
      status,
      limit,
      offset,
    });

    return NextResponse.json(
      {
        success: true,
        data: leads,
        count: leads.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching contact leads:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar contactos',
      },
      { status: 500 }
    );
  }
}
