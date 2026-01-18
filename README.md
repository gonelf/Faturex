# Faturex - Portuguese Billing System

🇵🇹 Professional web-based billing application for the Portuguese market, fully compliant with SAF-T (PT) 1.04 and Portuguese Tax Authority regulations.

## Legal Compliance

This system implements all mandatory requirements for certification by the Portuguese Tax Authority (Autoridade Tributária - AT):

- ✅ **Portaria n.º 363/2010** - Digital signature and document chaining using RSA-SHA1
- ✅ **Portaria n.º 195/2020** - ATCUD (Código Único do Documento) and QR Code requirements
- ✅ **SAF-T (PT) Version 1.04** - Database schema mirrors SAF-T structure

## Features

### 1. Digital Signature & Document Chaining
- RSA-SHA1 signing for all billing documents
- Cryptographic chaining prevents document tampering
- 4-character hash control for printed verification
- Each document links to the previous document's hash

### 2. ATCUD Management
- Automatic ATCUD generation (ValidationCode-DocumentNumber)
- Billing series management with AT validation codes
- Independent sequential numbering per series
- Format: "CSVP8Y9-1", "ABCD123-42", etc.

### 3. QR Code Generation
- Mandatory QR Code data string generation
- Includes: NIF, ATCUD, tax breakdown, hash control
- Compliant with Portaria n.º 195/2020 specifications

### 4. Portuguese NIF Validation
- Modulo 11 algorithm implementation
- Validates customer and company tax IDs
- Prevents invalid NIFs from entering the system

### 5. SAF-T Database Schema
- Products with ProductType (P, S, O, E, I)
- Customers with validated NIFs
- Taxes supporting IVA/IS with regional rates
- Invoices with full audit trail
- Document immutability after finalization

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and management
- **Lucide React**: Icon library
- **Supabase SSR**: Server-side rendering with Supabase

### Backend
- **Node.js + TypeScript**: Runtime and language
- **Express**: Web framework
- **PostgreSQL**: Database (via Supabase)
- **Supabase Auth**: Authentication and authorization
- **Cryptography**: Node.js crypto (RSA-SHA1)
- **API**: RESTful JSON API

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/faturex.git
cd faturex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Generate RSA key pair

```bash
# Generate 1024-bit RSA private key (as per Portuguese requirements)
openssl genrsa -out private_key.pem 1024

# Extract public key (for verification)
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Convert private key to single line for .env
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private_key.pem
```

### 4. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `RSA_PRIVATE_KEY` - Your RSA private key (PEM format)
- `COMPANY_NIF` - Your company's Portuguese NIF (9 digits)

Optional variables for email notifications:
- `RESEND_API_KEY` - Your Resend API key (get one at https://resend.com/api-keys)
- `EMAIL_FROM` - From email address (e.g., "Faturex <noreply@yourdomain.com>")
- `LEAD_NOTIFICATION_EMAIL` - Email address to receive new lead notifications

### 5. Setup database

```bash
# Run the SQL schema in your Supabase database
# File: database/schema.sql
```

Execute the schema in Supabase SQL Editor or using psql:

```bash
psql -h your-db-host -U postgres -d postgres -f database/schema.sql
```

### 6. Build and run

```bash
# Development mode (Next.js frontend + backend API)
npm run dev

# Production build
npm run build
npm start

# Backend only (if needed)
npm run backend:dev
npm run backend:build
npm run backend:start
```

### 7. Access the application

- Frontend: http://localhost:3000
- Landing page with features overview
- Registration and login pages
- Dashboard after authentication

## User Interface Features

### Landing Page
- Professional landing page with feature showcase
- Compliance badges and legal information
- Call-to-action for registration

### Authentication
- **User Registration**: Create account with email verification
- **Login**: Secure login with session management
- **Password Reset**: Reset forgotten passwords
- **Protected Routes**: Automatic redirect for unauthenticated users

### Dashboard
- **Overview**: Total invoices, revenue, customers, and products
- **Recent Invoices**: Quick view of latest documents
- **Quick Actions**: Fast access to customer, product, and series management

### Customer Management
- **List View**: Search and filter customers
- **Create/Edit**: Form with NIF validation
- **Address Management**: Full billing address support

### Product Management
- **List View**: Search and filter products/services
- **Create/Edit**: Product types (P, S, O, E, I)
- **Pricing**: Unit price and tax configuration

### Series Management
- **List View**: All configured billing series
- **Create**: New series with AT validation codes
- **Tracking**: Current document numbers per series

### Invoice Management
- **List View**: Search and filter invoices by number or ATCUD
- **Create**: Multi-line invoice creation with dynamic line items
- **View Details**: Full invoice view with QR code data
- **Finalize**: Convert draft to immutable finalized document
- **Cancel**: Cancel draft invoices with reason tracking
- **Status Indicators**: Visual badges for draft/finalized/cancelled states

### Contact Leads & Email Notifications
- **Contact Form**: Public contact form on the homepage for lead generation
- **Lead Storage**: All contact submissions stored in the database with metadata
- **Email Notifications**: Automatic email notifications for new leads
- **Lead Management**: Track lead status (new, contacted, qualified, converted, rejected)
- **API Endpoints**: RESTful API for managing contact leads

## API Usage

### Authentication

All API endpoints require authentication using Supabase JWT tokens:

```bash
Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN
```

### Create Invoice

```bash
POST /api/invoices
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "seriesId": "uuid-of-billing-series",
  "customerId": "uuid-of-customer",
  "invoiceDate": "2026-01-16",
  "sourceId": "user123",
  "lines": [
    {
      "productId": "uuid-of-product",
      "quantity": 2,
      "unitPrice": 50.00,
      "description": "Product description",
      "taxId": "uuid-of-tax-rate"
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "invoice-uuid",
    "invoiceNo": "FT 2026/1",
    "atcud": "CSVP8Y9-1",
    "documentHash": "base64-encoded-signature",
    "hashControl": "A1B2",
    "qrCodeData": "A:123456789*B:987654321*...",
    "grossTotal": 123.00,
    "documentStatus": "N"
  }
}
```

### Finalize Invoice

```bash
POST /api/invoices/:id/finalize
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "sourceId": "user123"
}
```

**Important**: Once finalized, the invoice becomes **immutable** and cannot be edited or deleted.

### Cancel Invoice

```bash
POST /api/invoices/:id/cancel
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "sourceId": "user123",
  "reason": "Customer request"
}
```

**Note**: Cannot cancel finalized invoices.

### Contact Leads API

#### Submit Contact Form (Public, No Auth Required)

```bash
POST /api/contact-leads
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+351 912 345 678",
  "business_type": "Consultoria",
  "message": "Gostaria de saber mais sobre os vossos serviços"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "lead-uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "status": "new",
    "notification_sent": true,
    "created_at": "2026-01-17T15:30:00Z"
  },
  "message": "Contacto registado com sucesso. Entraremos em contacto brevemente."
}
```

**Features**:
- Automatic email notification sent to configured LEAD_NOTIFICATION_EMAIL
- Captures user metadata (IP address, user agent, source)
- No authentication required (public endpoint)
- Email includes all lead details with a beautiful HTML template

#### Get All Contact Leads (Auth Required)

```bash
GET /api/contact-leads?status=new&limit=10
Authorization: Bearer YOUR_TOKEN
```

#### Update Lead Status (Auth Required)

```bash
PATCH /api/contact-leads/:id/status
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "status": "contacted",
  "notes": "Cliente contactado via email"
}
```

## Database Schema

### Key Tables

#### billing_series
- Manages billing series with AT validation codes
- Each series has independent sequential numbering
- Required fields: series_code, invoice_type, validation_code

#### invoices
- SAF-T Field 4.1 - SalesInvoices
- Includes: ATCUD, digital signature, hash control, QR code data
- Enforces sequential numbering and immutability

#### customers
- SAF-T Field 2.2 - Customer Master Data
- NIF validation using Modulo 11 algorithm
- Billing address information

#### products
- SAF-T Field 2.4 - Product Master Data
- ProductType: P (Products), S (Services), O (Other), E (Expenses), I (Assets)
- Tax configuration per product

#### taxes
- SAF-T Field 2.5 - Tax Table
- Supports IVA and IS tax types
- Regional rates for PT, PT-MA (Madeira), PT-AC (Açores)

#### contact_leads
- Stores contact form submissions for lead generation
- Tracks lead status and contact history
- Email notification tracking (sent/not sent)
- Captures source, IP address, and user agent metadata

## SAF-T Field Mapping

| SAF-T Field | Database Column | Description |
|-------------|----------------|-------------|
| 4.1.4.1 | invoice_no | Invoice number (Series/Number) |
| 4.1.4.16 | atcud | ATCUD code |
| 4.1.4.17 | document_hash | RSA-SHA1 signature |
| 4.1.4.18 | hash_control | 4-character control hash |
| 4.1.4.5 | invoice_date | Invoice date |
| 4.1.4.9 | system_entry_date | System entry timestamp (immutable) |
| 4.1.4.14.3 | gross_total | Gross total with taxes |

Full mapping documented in `database/schema.sql`

## Security Considerations

### Private Key Management

⚠️ **CRITICAL**: Never commit your RSA private key to version control

- Store private key in environment variables
- Use secret management services in production (AWS Secrets Manager, Azure Key Vault, etc.)
- Rotate keys periodically
- Keep backups in secure offline storage

### Database Security

- Use Supabase Row Level Security (RLS) policies
- Implement role-based access control
- Audit all document modifications
- Enable database encryption at rest

## Testing

### NIF Validation

```typescript
import { NIFValidator } from './src/utils/nif-validator';

// Validate a NIF
const isValid = NIFValidator.validate('123456789');

// Generate test NIF (for testing only)
const testNIF = NIFValidator.generateRandomForTesting();
```

### Digital Signature

```typescript
import { SignatureService } from './src/services/signature.service';

const signatureService = new SignatureService(privateKey);

const signature = signatureService.signDocument({
  invoiceDate: '2026-01-16',
  systemEntryDate: '2026-01-16T14:30:00',
  invoiceNo: 'FT 2026/1',
  grossTotal: '123.45',
  previousHash: ''
});

const hashControl = signatureService.extractHashControl(signature);
```

### ATCUD Generation

```typescript
import { ATCUDGenerator } from './src/utils/atcud.util';

const atcud = ATCUDGenerator.generate('CSVP8Y9', 1);
// Result: "CSVP8Y9-1"
```

## Certification Process

To certify your billing software with the Portuguese Tax Authority:

1. **Register your company** with the AT
2. **Request validation codes** for each billing series
3. **Configure billing series** with AT-provided validation codes
4. **Test thoroughly** with sample invoices
5. **Submit for certification** to AT
6. **Install certified version** in production

Documentation: [Portal das Finanças](https://www.portaldasfinancas.gov.pt)

## License

ISC License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/faturex/issues)
- Portuguese Tax Authority: [Portal das Finanças](https://www.portaldasfinancas.gov.pt)

## Contributing

Contributions are welcome! Please ensure:
- Code follows SAF-T (PT) 1.04 specifications
- All legal requirements are maintained
- Tests are included for new features
- Documentation is updated

---

**Disclaimer**: This software is provided as-is. Users are responsible for ensuring compliance with Portuguese tax regulations. Always consult with a qualified accountant and legal advisor before using in production.
