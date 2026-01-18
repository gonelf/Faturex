import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type?: string;
  message?: string;
  source?: string;
  created_at: string;
}

/**
 * Send email notification when a new contact lead is created
 */
export async function sendNewLeadNotification(lead: ContactLead): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured. Skipping email notification.');
    return;
  }

  if (!process.env.LEAD_NOTIFICATION_EMAIL) {
    console.error('LEAD_NOTIFICATION_EMAIL not configured. Skipping email notification.');
    return;
  }

  // Validate email addresses before attempting to send
  const emailFrom = process.env.EMAIL_FROM || 'Faturex <noreply@faturex.com>';
  const emailTo = process.env.LEAD_NOTIFICATION_EMAIL;

  // Email validation regex (RFC 5322 compliant)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Extract email from "Name <email@domain.com>" format
  const extractEmail = (str: string): string => {
    const match = str.match(/<([^>]+)>/);
    return match ? match[1] : str;
  };

  const fromEmail = extractEmail(emailFrom);
  const toEmail = extractEmail(emailTo);

  // Validate FROM email
  if (!emailRegex.test(fromEmail)) {
    console.error(`[EMAIL CONFIG ERROR] Invalid EMAIL_FROM: "${emailFrom}" (extracted: "${fromEmail}")`);
    console.error('Please check your .env file and ensure EMAIL_FROM is a valid email address.');
    throw new Error(`Invalid EMAIL_FROM configuration: "${emailFrom}". Expected format: "Name <email@domain.com>" or "email@domain.com"`);
  }

  // Validate TO email
  if (!emailRegex.test(toEmail)) {
    console.error(`[EMAIL CONFIG ERROR] Invalid LEAD_NOTIFICATION_EMAIL: "${emailTo}" (extracted: "${toEmail}")`);
    console.error('Please check your .env file and ensure LEAD_NOTIFICATION_EMAIL is a valid email address.');
    throw new Error(`Invalid LEAD_NOTIFICATION_EMAIL configuration: "${emailTo}". Must be a valid email address.`);
  }

  const emailHtml = generateLeadNotificationHtml(lead);
  const emailText = generateLeadNotificationText(lead);

  // Log email configuration for debugging
  console.log('[EMAIL DEBUG] Sending email with configuration:', {
    from: emailFrom,
    to: emailTo,
    fromExtracted: fromEmail,
    toExtracted: toEmail,
    subject: `🎯 Novo Lead de Contrato - ${lead.name}`,
    leadEmail: lead.email,
    leadName: lead.name,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: `🎯 Novo Lead de Contrato - ${lead.name}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error('[EMAIL ERROR] Failed to send lead notification email:', {
        error,
        errorMessage: error.message,
        errorName: error.name,
        from: emailFrom,
        to: emailTo,
      });
      throw new Error(`Email sending failed: ${error.message} | FROM: ${emailFrom} | TO: ${emailTo}`);
    }

    console.log('Lead notification email sent successfully:', data);
  } catch (error) {
    console.error('[EMAIL EXCEPTION] Error sending lead notification:', {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      from: emailFrom,
      to: emailTo,
    });
    throw error;
  }
}

/**
 * Generate HTML email template for new lead notification
 */
function generateLeadNotificationHtml(lead: ContactLead): string {
  const businessTypeRow = lead.business_type
    ? `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Tipo de Negócio:</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(lead.business_type)}</td>
    </tr>`
    : '';

  const messageRow = lead.message
    ? `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; vertical-align: top;">Mensagem:</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937; white-space: pre-wrap;">${escapeHtml(lead.message)}</td>
    </tr>`
    : '';

  const sourceRow = lead.source
    ? `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Origem:</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(lead.source)}</td>
    </tr>`
    : '';

  const createdAt = new Date(lead.created_at).toLocaleString('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Lead de Contrato</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎯 Novo Lead de Contrato</h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Recebeu um novo pedido de contacto</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; color: #1f2937; font-size: 16px; line-height: 1.5;">
                Recebeu um novo lead através do formulário de contacto. Detalhes abaixo:
              </p>

              <!-- Lead Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 35%;">Nome:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(lead.name)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Email:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <a href="mailto:${escapeHtml(lead.email)}" style="color: #667eea; text-decoration: none;">${escapeHtml(lead.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Telefone:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <a href="tel:${escapeHtml(lead.phone)}" style="color: #667eea; text-decoration: none;">${escapeHtml(lead.phone)}</a>
                  </td>
                </tr>
                ${businessTypeRow}
                ${messageRow}
                ${sourceRow}
                <tr>
                  <td style="padding: 12px; font-weight: 600; color: #374151;">Data/Hora:</td>
                  <td style="padding: 12px; color: #1f2937;">${createdAt}</td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(lead.email)}?subject=Re: Contacto Faturex"
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Responder ao Lead
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Esta é uma notificação automática do sistema Faturex
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                ID do Lead: ${lead.id}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate plain text email for new lead notification
 */
function generateLeadNotificationText(lead: ContactLead): string {
  const businessType = lead.business_type ? `Tipo de Negócio: ${lead.business_type}\n` : '';
  const message = lead.message ? `Mensagem: ${lead.message}\n` : '';
  const source = lead.source ? `Origem: ${lead.source}\n` : '';
  const createdAt = new Date(lead.created_at).toLocaleString('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
🎯 NOVO LEAD DE CONTRATO

Recebeu um novo lead através do formulário de contacto.

DETALHES DO LEAD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nome: ${lead.name}
Email: ${lead.email}
Telefone: ${lead.phone}
${businessType}${message}${source}Data/Hora: ${createdAt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responda ao lead: ${lead.email}

---
ID do Lead: ${lead.id}
Esta é uma notificação automática do sistema Faturex.
  `.trim();
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
