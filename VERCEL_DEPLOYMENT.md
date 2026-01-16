# Vercel Deployment Guide

This guide explains how to deploy the Portuguese Billing System to Vercel.

## Prerequisites

- Vercel account (free tier works)
- Supabase account with database configured
- RSA key pair generated

## Step 1: Prepare Your Project

1. Ensure all code is committed to your Git repository
2. Push to GitHub, GitLab, or Bitbucket

## Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration from `vercel.json`

## Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret!) | `eyJhbGci...` |
| `RSA_PRIVATE_KEY` | RSA private key for digital signatures | `-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----` |
| `COMPANY_NIF` | Your company's Portuguese NIF (9 digits) | `123456789` |

### How to Add Environment Variables

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable with its value
4. Select environments: Production, Preview, Development
5. Click "Save"

### Important Notes for RSA_PRIVATE_KEY

The private key must be formatted as a single line with `\n` for newlines:

```
-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQC...\n...\n-----END RSA PRIVATE KEY-----
```

**To format your key correctly:**

```bash
# Linux/Mac
cat keys/private_key.pem | awk '{printf "%s\\n", $0}'

# Or use this one-liner
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' keys/private_key.pem
```

Copy the output and paste it as the value for `RSA_PRIVATE_KEY` in Vercel.

## Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

## Step 5: Test Your Deployment

### Test Health Endpoint

```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-16T14:57:00.000Z",
  "service": "Faturex Portuguese Billing System",
  "compliance": "SAF-T (PT) 1.04",
  "regulations": ["Portaria n.º 363/2010", "Portaria n.º 195/2020"]
}
```

### Test Root Endpoint

```bash
curl https://your-project.vercel.app/
```

This will show available features and endpoints.

### Test Invoice API

```bash
curl -X POST https://your-project.vercel.app/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -d '{
    "seriesId": "series-uuid",
    "customerId": "customer-uuid",
    "invoiceDate": "2026-01-16",
    "sourceId": "user123",
    "lines": [...]
  }'
```

## Troubleshooting

### Error: "Service Unavailable - Missing environment variables"

**Solution:** Configure all required environment variables in Vercel settings.

### Error: "Invalid RSA private key format"

**Solution:** Ensure the private key is properly formatted with `\n` for newlines (not actual newlines).

### Error: "Cannot find module"

**Solution:** Ensure `package.json` includes all dependencies. Vercel will run `npm install` automatically.

### Error: "FUNCTION_INVOCATION_FAILED"

**Possible causes:**
1. Missing or incorrect environment variables
2. Invalid RSA key format
3. Syntax error in code
4. Missing dependency

**Check logs:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment
3. View "Function Logs" tab

## Architecture

### Serverless Structure

```
Faturex/
├── api/
│   └── index.ts          # Vercel serverless function entry point
├── src/
│   ├── app.ts           # Express app (no server)
│   ├── index.ts         # Local development server
│   └── ...              # Services, utils, etc.
└── vercel.json          # Vercel configuration
```

### How It Works

1. All requests go to `api/index.ts`
2. `api/index.ts` imports `src/app.ts`
3. `src/app.ts` exports the Express app without calling `app.listen()`
4. Vercel wraps the Express app as a serverless function
5. Each request triggers a function invocation

### Local Development vs. Production

**Local Development:**
- Run `npm run dev`
- Uses `src/index.ts` which starts a traditional Node.js server
- Requires all environment variables in `.env` file

**Vercel (Production):**
- Uses `api/index.ts` as serverless function
- Environment variables configured in Vercel dashboard
- Scales automatically with traffic
- Cold starts may occur (first request takes longer)

## Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Automatic Deployments

Vercel automatically deploys when you push to your Git repository:

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Monitoring

### View Logs

1. Vercel Dashboard → Your Project → Deployments
2. Click on a deployment
3. View "Function Logs" or "Build Logs"

### Performance

- Function execution time
- Invocation count
- Error rate
- Available in Vercel Analytics

## Limits (Free Tier)

- **Function Duration**: 10 seconds max
- **Function Size**: 50 MB max
- **Bandwidth**: 100 GB/month
- **Executions**: Unlimited

For production use with high traffic, consider upgrading to Vercel Pro.

## Security Best Practices

1. **Never commit secrets** - Always use environment variables
2. **Rotate keys** - Change RSA keys periodically
3. **Enable HTTPS** - Vercel provides this automatically
4. **Use service role key carefully** - Has admin access to Supabase
5. **Monitor logs** - Check for unauthorized access attempts

## Updating Environment Variables

After changing environment variables:

1. Variables apply to **new deployments** only
2. Redeploy to apply changes:
   - Push a new commit, OR
   - Click "Redeploy" in Vercel Dashboard

## Rollback

If a deployment fails or has issues:

1. Go to Vercel Dashboard → Deployments
2. Find a previous successful deployment
3. Click "..." → "Promote to Production"

## Next Steps

- Set up a custom domain
- Configure Supabase Row Level Security
- Enable Vercel Analytics
- Set up monitoring alerts
- Implement rate limiting
- Add CI/CD tests

---

For more information:
- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
