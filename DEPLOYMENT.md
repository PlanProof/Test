# PlanProof Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

## Environment Variables

### Required for Production:

```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

### Optional (for enhanced features):

```bash
DATABASE_URL=postgresql://username:password@host:5432/database
GEOSCAPE_API_KEY=your_geoscape_api_key_here
SAPPA_API_KEY=your_sappa_api_key_here
VITE_PUBLIC_BUILDER_KEY=your_builder_public_key_here
```

## Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set in Vercel Dashboard > Project Settings > Environment Variables
3. **Build Settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`

## Key Features

- **Address Search**: G-NAF integrated address lookup with mock fallback
- **Title Search**: Lot title number search functionality
- **Planning Analysis**: AI-powered compliance analysis
- **State Mapping**: Hazard detection and planning zone identification
- **Multi-tenant**: Support for admin and user roles

## Database Setup (Optional)

For G-NAF address database:

1. Set up PostgreSQL database
2. Run: `npm run gnaf:setup`
3. Import G-NAF data: `npm run gnaf:import`

## Security Notes

- Never commit API keys to the repository
- Use Vercel environment variables for secrets
- Enable HTTPS in production
- Review CORS settings for production domains
