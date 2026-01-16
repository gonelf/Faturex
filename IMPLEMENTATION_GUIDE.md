# Implementation Guide

## Portuguese Billing System - Technical Implementation Details

### Overview

This guide provides technical details for implementing a SAF-T (PT) compliant billing system.

## Digital Signature Implementation

### RSA-SHA1 Chaining

Each document's signature includes data from:
1. Invoice Date (YYYY-MM-DD)
2. System Entry Date (YYYY-MM-DDThh:mm:ss)
3. Invoice Number (Series/Number)
4. Gross Total (decimal with 2 places)
5. Previous Document Hash (creates chain)

**String Format**:
```
InvoiceDate;SystemEntryDate;InvoiceNo;GrossTotal;PreviousHash
```

**Example**:
```
2026-01-16;2026-01-16T14:30:00;FT 2026/1;123.45;previousHashBase64Here
```

### Hash Control Extraction

The 4-character hash control is extracted from positions 1, 11, 21, and 31 (0-indexed: 0, 10, 20, 30) of the Base64-encoded signature.

**Example**:
```
Signature: "ABC123DEF456GHI789JKL012MNO345PQR..."
Control:   "A3G0" (chars at positions 0, 10, 20, 30)
```

## ATCUD Generation

Format: `ValidationCode-DocumentNumber`

**Steps**:
1. Obtain validation code from AT for each billing series
2. Concatenate with document sequential number
3. No leading zeros on document number

**Examples**:
- `CSVP8Y9-1`
- `ABCD123-42`
- `WXYZ456-1000`

## QR Code Data String

Format: Fields separated by asterisks (*)

**Structure**:
```
A:CompanyNIF*B:CustomerNIF*C:Country*D:DocType*E:Status*F:Date*G:DocNumber*H:ATCUD*I1:TaxRate1*I2:TaxBase1*I3:TaxAmount1*N:GrossTotal*O:HashControl
```

**Example**:
```
A:123456789*B:987654321*C:PT*D:FT*E:N*F:20260116*G:FT 2026/1*H:CSVP8Y9-1*I1:PT-NOR-23.00*I2:100.00*I3:23.00*N:123.00*O:A1B2
```

**Field Descriptions**:
- **A**: Company NIF (9 digits)
- **B**: Customer NIF (9 digits, use "999999990" for final consumer)
- **C**: Country code (ISO 3166-1 alpha-2)
- **D**: Document type (FT, FR, NC, ND, etc.)
- **E**: Document status (N=Normal, A=Cancelled, F=Finalized)
- **F**: Date (YYYYMMDD)
- **G**: Document number (Series/Number)
- **H**: ATCUD
- **I1/I2/I3**: Tax breakdown (can repeat for multiple tax rates)
  - I1: Tax identifier (CountryRegion-TaxCode-Percentage)
  - I2: Taxable base
  - I3: Tax amount
- **N**: Gross total
- **O**: 4-character hash control

## NIF Validation (Modulo 11)

**Algorithm**:
1. NIF must be exactly 9 digits
2. First digit must be: 1, 2, 3, 5, 6, 8, or 9
3. Multiply first 8 digits by sequence: 9, 8, 7, 6, 5, 4, 3, 2
4. Sum all results
5. Calculate: `11 - (sum % 11)`
6. If result ≥ 10, check digit = 0
7. Otherwise, check digit = result
8. Compare with 9th digit

**Example** (NIF: 123456789):
```
Position:  1   2   3   4   5   6   7   8   9
Digit:     1   2   3   4   5   6   7   8   9
Multiply:  9   8   7   6   5   4   3   2   -
Result:    9  16  21  24  25  24  21  16   -
Sum: 156
Modulo 11: 156 % 11 = 2
Check digit: 11 - 2 = 9 ✓ (matches 9th digit)
```

## Database Constraints

### Sequential Numbering

- Each billing series maintains its own counter
- Use database function `get_next_document_number()` for atomic operations
- UNIQUE constraint on (series_id, document_number)

### Immutability

- Trigger `prevent_finalized_modification` prevents UPDATE on finalized invoices
- Trigger `prevent_finalized_deletion` prevents DELETE on finalized invoices
- Status 'F' (Finalized) makes document immutable

### Audit Trail

- `system_entry_date` is set once and never changes
- `document_status_history` tracks all status changes
- All changes require `source_id` (user identifier)

## API Workflow

### Creating an Invoice

1. **Client** sends POST request with invoice data
2. **Server** validates customer NIF
3. **Server** gets next sequential number (atomic)
4. **Server** builds invoice number (Series/Number)
5. **Server** generates ATCUD
6. **Server** calculates line totals and taxes
7. **Server** gets previous document hash
8. **Server** signs document (RSA-SHA1)
9. **Server** extracts hash control
10. **Server** generates QR code data
11. **Server** inserts invoice with status 'N' (Draft)
12. **Server** returns invoice data

### Finalizing an Invoice

1. **Client** sends POST to /invoices/:id/finalize
2. **Server** checks if already finalized
3. **Server** checks if cancelled
4. **Server** updates status to 'F'
5. **Server** sets finalized_at timestamp
6. **Server** inserts status history
7. **Invoice becomes immutable** (enforced by triggers)

## Tax Breakdown for QR Code

When multiple lines have the same tax rate, aggregate them:

```typescript
// Group by tax rate
const taxMap = new Map();

for (const line of lines) {
  const key = `${taxCountryRegion}-${taxCode}-${taxPercentage}`;

  if (taxMap.has(key)) {
    taxMap.get(key).base += line.taxBase;
    taxMap.get(key).amount += line.taxAmount;
  } else {
    taxMap.set(key, {
      base: line.taxBase,
      amount: line.taxAmount
    });
  }
}
```

## Error Handling

### Common Errors

1. **Invalid NIF**: Return 400 with validation error
2. **Gap in numbering**: Prevented by database constraints
3. **Modify finalized invoice**: Prevented by trigger, return 400
4. **Missing validation code**: Return 400, series not properly configured
5. **Invalid RSA key**: Server fails to start, check environment

### Best Practices

- Validate all inputs before database operations
- Use database transactions for invoice creation
- Log all errors with context
- Return user-friendly error messages
- Never expose sensitive data (private keys, internal IDs)

## Performance Optimization

### Database Indexes

Created automatically by schema:
- `idx_customers_tax_id` - Fast customer lookup by NIF
- `idx_products_code` - Fast product lookup
- `idx_invoices_no` - Fast invoice number search
- `idx_invoices_date` - Date range queries
- `idx_invoices_customer` - Customer invoice history
- `idx_invoices_status` - Filter by status

### Caching Strategies

Consider caching:
- Tax rates (rarely change)
- Product data (update on write)
- Customer data (update on write)
- Billing series configuration

### Batch Operations

For bulk operations:
- Use database transactions
- Batch insert invoice lines
- Process in chunks to avoid memory issues

## Security Checklist

- [ ] RSA private key stored in environment variables
- [ ] Private key never logged or exposed in errors
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] API authentication required on all endpoints
- [ ] Input validation on all user data
- [ ] SQL injection prevention (use parameterized queries)
- [ ] HTTPS enforced in production
- [ ] CORS configured for allowed origins only
- [ ] Rate limiting implemented
- [ ] Audit logging for all document operations

## Compliance Checklist

- [ ] RSA-SHA1 digital signatures implemented
- [ ] Document chaining with previous hash
- [ ] 4-character hash control extraction
- [ ] ATCUD generation with AT validation codes
- [ ] QR code data string generation
- [ ] NIF validation (Modulo 11)
- [ ] Sequential numbering without gaps
- [ ] Document immutability after finalization
- [ ] System entry date immutability
- [ ] Audit trail for all status changes
- [ ] SAF-T field mapping in database
- [ ] Portuguese tax rates (IVA) configured
- [ ] Support for regional rates (PT-MA, PT-AC)

## Testing Recommendations

### Unit Tests

- NIF validation with valid/invalid cases
- ATCUD generation and parsing
- Hash control extraction
- QR code data string format
- Tax calculation logic

### Integration Tests

- Create invoice end-to-end
- Finalize invoice
- Cancel invoice
- Sequential numbering (concurrent requests)
- Document chaining (verify hash links)

### Manual Testing

- Print invoice with QR code
- Scan QR code and verify data
- Verify hash control matches printed value
- Test with AT validation tools
- Export SAF-T file and validate

## Production Deployment

1. **Environment Setup**
   - Configure all environment variables
   - Generate production RSA key pair
   - Store private key in secrets manager
   - Configure Supabase production instance

2. **Database Migration**
   - Run schema.sql in production database
   - Configure Row Level Security policies
   - Set up automated backups
   - Test rollback procedures

3. **Application Deployment**
   - Build TypeScript to JavaScript
   - Set NODE_ENV=production
   - Configure process manager (PM2, systemd)
   - Set up monitoring and logging
   - Configure reverse proxy (nginx)
   - Enable HTTPS with valid SSL certificate

4. **Post-Deployment**
   - Test all API endpoints
   - Verify document creation and chaining
   - Check QR code generation
   - Monitor error logs
   - Set up alerting for failures

## Maintenance

### Regular Tasks

- **Daily**: Monitor error logs
- **Weekly**: Review invoice sequences for gaps
- **Monthly**: Audit document status changes
- **Quarterly**: Review and rotate API keys
- **Yearly**: Rotate RSA key pair (requires AT notification)

### Backup Strategy

- Database backups: Daily automated backups
- Private key: Encrypted offline backups in multiple locations
- Configuration: Version controlled, encrypted secrets
- Audit logs: Long-term storage (7+ years for tax compliance)

---

For questions or clarifications, refer to:
- [SAF-T (PT) Official Documentation](https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/SAFT_PT/)
- [Portaria n.º 363/2010](https://dre.pt/application/conteudo/277619)
- [Portaria n.º 195/2020](https://dre.pt/application/conteudo/139676888)
