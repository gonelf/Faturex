# Quick Start Guide

Get your Portuguese billing system up and running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (via Supabase)
- Supabase account created
- Basic knowledge of TypeScript/Node.js

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd faturex
npm install
```

## Step 2: Generate RSA Keys

```bash
chmod +x examples/generate-keys.sh
./examples/generate-keys.sh
```

This generates:
- `keys/private_key.pem` - Your private key (keep secure!)
- `keys/public_key.pem` - Your public key (for verification)

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
# From Supabase Dashboard > Project Settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# From the key generation script
RSA_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"

# Your company's Portuguese NIF (9 digits)
COMPANY_NIF=123456789

# Server configuration
PORT=3000
NODE_ENV=development
```

## Step 4: Setup Database

1. Go to Supabase Dashboard > SQL Editor
2. Copy the contents of `database/schema.sql`
3. Run the SQL script

This creates:
- All necessary tables
- Database functions
- Triggers for immutability
- Sample data (tax rates, billing series)

## Step 5: Update Billing Series

In Supabase SQL Editor, update the validation codes with codes from the Portuguese Tax Authority:

```sql
UPDATE billing_series
SET validation_code = 'YOUR_ACTUAL_CODE_FROM_AT'
WHERE series_code = 'FT';
```

**Note**: For development/testing, you can use placeholder codes like 'TEST123'.

## Step 6: Build and Run

```bash
# Development mode (with auto-reload)
npm run dev

# Production build
npm run build
npm start
```

You should see:

```
🇵🇹 Faturex - Portuguese Billing System
====================================
📋 SAF-T (PT) Version: 1.04
📜 Compliance: Portaria n.º 363/2010 & 195/2020
🔐 Digital Signature: RSA-SHA1
🎫 ATCUD: Enabled
📱 QR Code: Enabled
🏢 Company NIF: 123456789
====================================
🚀 Server running on port 3000
```

## Step 7: Test the API

### Create a Customer (via Supabase Dashboard)

```sql
INSERT INTO customers (customer_id, customer_tax_id, company_name, billing_address_city, billing_address_country)
VALUES ('CUST001', '999999990', 'Final Consumer', 'Lisboa', 'PT');
```

### Create a Product

```sql
-- Get a tax ID first
SELECT id FROM taxes WHERE tax_code = 'NOR' AND tax_country_region = 'PT' LIMIT 1;

-- Insert product (replace tax_id_here with the UUID from above)
INSERT INTO products (product_type, product_code, product_description, unit_price, default_tax_id)
VALUES ('S', 'SERV001', 'Professional Consulting Services', 100.00, 'tax_id_here');
```

### Get UUIDs for API Call

```sql
-- Get series ID
SELECT id, series_code FROM billing_series WHERE series_code = 'FT';

-- Get customer ID
SELECT id, customer_id FROM customers WHERE customer_id = 'CUST001';

-- Get product ID
SELECT id, product_code FROM products WHERE product_code = 'SERV001';

-- Get tax ID
SELECT id, tax_code FROM taxes WHERE tax_code = 'NOR' AND tax_country_region = 'PT';
```

### Create an Invoice

Use the REST Client file `examples/api-usage.http` or curl:

```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -d '{
    "seriesId": "series-uuid-here",
    "customerId": "customer-uuid-here",
    "invoiceDate": "2026-01-16",
    "sourceId": "user123",
    "lines": [
      {
        "productId": "product-uuid-here",
        "quantity": 2,
        "unitPrice": 100.00,
        "description": "Consulting Services",
        "taxId": "tax-uuid-here"
      }
    ]
  }'
```

### Finalize the Invoice

```bash
curl -X POST http://localhost:3000/api/invoices/{invoice-id}/finalize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -d '{
    "sourceId": "user123"
  }'
```

## Step 8: Verify the Results

Check the invoice in Supabase:

```sql
SELECT
  invoice_no,
  atcud,
  hash_control,
  document_status,
  gross_total,
  qr_code_data
FROM invoices
ORDER BY created_at DESC
LIMIT 1;
```

You should see:
- ✅ Invoice number: `FT 2026/1`
- ✅ ATCUD: `CSVP8Y9-1` (or your validation code)
- ✅ Hash control: 4 characters (e.g., `A1B2`)
- ✅ Document status: `F` (if finalized)
- ✅ QR code data: Full data string

## Testing the Utilities

### Test NIF Validation

```bash
npx ts-node examples/test-nif.ts
```

### Test Digital Signature

```bash
npx ts-node examples/test-signature.ts
```

## Common Issues

### "RSA_PRIVATE_KEY not found"
- Make sure you ran the key generation script
- Verify the key is properly formatted in .env
- Key should be on a single line with `\n` for newlines

### "Invalid or inactive billing series"
- Check that the series exists in the database
- Verify `is_active = true`
- Ensure the series_id is correct

### "Invalid Portuguese NIF"
- NIF must be exactly 9 digits
- Must pass Modulo 11 validation
- Use `999999990` for final consumer without NIF

### "Authentication token required"
- Get a JWT token from Supabase Auth
- Include in header: `Authorization: Bearer YOUR_TOKEN`
- Token can be obtained via Supabase client login

## Next Steps

1. **Add More Test Data**: Create more customers, products, and taxes
2. **Implement Frontend**: Build a UI to interact with the API
3. **Setup QR Code Generation**: Use the qr_code_data to generate actual QR images
4. **Configure Supabase Auth**: Set up user authentication properly
5. **Add Row Level Security**: Implement RLS policies in Supabase
6. **Deploy to Production**: Follow deployment guide in README.md

## Getting Help

- 📖 Full documentation: `README.md`
- 🔧 Implementation details: `IMPLEMENTATION_GUIDE.md`
- 💬 API examples: `examples/api-usage.http`
- 🐛 Issues: GitHub Issues

## Important Reminders

⚠️ **Security**:
- Never commit private keys to git
- Use environment variables for secrets
- Enable HTTPS in production
- Implement proper authentication

⚠️ **Compliance**:
- Register with Portuguese Tax Authority (AT)
- Obtain official validation codes for production
- Test thoroughly before going live
- Keep audit logs for 7+ years

---

**You're all set!** Your Portuguese billing system is now ready for development and testing.
