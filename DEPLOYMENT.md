# Deployment Guide - Faturex

This guide will help you deploy Faturex to Vercel with all required environment variables.

## Prerequisites

1. A Supabase account and project
2. A Vercel account
3. RSA private key for digital signatures

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

### 1.2 Run the Database Schema

1. Open the SQL Editor in Supabase
2. Copy the contents of `database/schema.sql`
3. Paste and execute the SQL to create all tables, functions, and triggers

### 1.3 Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (will be something like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 2: Generate RSA Keys

Run these commands to generate your RSA key pair:

```bash
# Generate 1024-bit RSA private key
openssl genrsa -out private_key.pem 1024

# Extract public key (optional, for verification)
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Convert private key to single line for environment variable
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private_key.pem
```

Copy the output of the last command - this is your `RSA_PRIVATE_KEY`.

## Step 3: Deploy to Vercel

### 3.1 Connect Your Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository (gonelf/Faturex)
4. Select the repository

### 3.2 Configure Environment Variables

Before deploying, click **Environment Variables** and add the following:

#### Required Environment Variables

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase → Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Supabase → Project Settings → API → service_role key (secret!) |
| `RSA_PRIVATE_KEY` | Your RSA private key | Generated in Step 2 (include quotes and \n) |
| `COMPANY_NIF` | Your company NIF | Your 9-digit Portuguese tax ID |

#### Optional Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `/api` | API base URL (default: `/api`) |

### 3.3 Deploy

1. After adding all environment variables, click **Deploy**
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. You should see the Faturex landing page
3. Try creating an account:
   - Click **Criar Conta Grátis**
   - Fill in your details
   - Check your email for verification link
4. Log in and test the dashboard

## Step 5: Set Up Your First Data

### 5.1 Add a Billing Series

1. Log in to your dashboard
2. Navigate to **Séries**
3. Click **Nova Série**
4. Fill in:
   - **Código**: FT (or your series code)
   - **Tipo**: Fatura
   - **Descrição**: Fatura Normal
   - **Código AT**: Get this from Portuguese Tax Authority (e.g., CSVP8Y9)
   - **Número Inicial**: 0
5. Click **Criar Série**

### 5.2 Add Customers

1. Navigate to **Clientes**
2. Click **Novo Cliente**
3. Fill in customer details (NIF will be validated)
4. Click **Criar Cliente**

### 5.3 Add Products

1. Navigate to **Produtos**
2. Click **Novo Produto**
3. Fill in product details
4. Click **Criar Produto**

### 5.4 Create Your First Invoice

1. Navigate to **Faturas**
2. Click **Nova Fatura**
3. Select series, customer, and date
4. Add invoice lines
5. Click **Criar Fatura**
6. View the invoice and click **Finalizar** when ready

## Troubleshooting

### Middleware Error (500)

If you see a `MIDDLEWARE_INVOCATION_FAILED` error:
- ✅ Make sure all environment variables are set in Vercel
- ✅ Redeploy the application after setting environment variables
- ✅ Check that your Supabase URL and keys are correct

### Database Connection Issues

- ✅ Verify the database schema was executed successfully
- ✅ Check that service role key has proper permissions
- ✅ Ensure Supabase project is active and not paused

### RSA Signature Errors

- ✅ Verify RSA_PRIVATE_KEY includes the full PEM format
- ✅ Ensure newlines are escaped as `\n` in the environment variable
- ✅ Check that the key is 1024-bit RSA

### Build Failures

- ✅ Check build logs in Vercel dashboard
- ✅ Verify all dependencies are in package.json
- ✅ Make sure TypeScript compilation succeeds locally

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Enable Row Level Security (RLS) policies in Supabase
- [ ] Restrict service role key usage to backend only
- [ ] Store RSA private key securely (consider using secrets manager)
- [ ] Enable 2FA on Supabase and Vercel accounts
- [ ] Set up database backups
- [ ] Configure proper CORS policies
- [ ] Review and audit all permissions

## Support

For issues:
- Check the [README.md](README.md) for general documentation
- Review Vercel deployment logs
- Check Supabase logs in the Dashboard
- Open an issue on GitHub

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [SAF-T (PT) Specification](https://www.portaldasfinancas.gov.pt)
