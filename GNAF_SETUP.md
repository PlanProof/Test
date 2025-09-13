# G-NAF Integration Setup Guide

This guide will help you set up the G-NAF (Geocoded National Address File) integration to replace the failing external address lookup API with a robust, local address search system.

## Prerequisites

### 1. Database Setup

Ensure you have a PostgreSQL database running. You can use:

- Local PostgreSQL installation
- Cloud database (Supabase, Neon, etc.)
- Docker PostgreSQL container

### 2. Environment Variables

Add these to your `.env` file:

```bash
# Database connection (choose one)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
# OR
POSTGRES_URL="postgresql://username:password@localhost:5432/database_name"
```

### 3. Install Dependencies

Run the following command to install required packages:

```bash
npm install pg csv-parse ts-node @types/pg
```

## G-NAF Data Import Process

### Step 1: Download and Extract G-NAF Data

1. You have the G-NAF file: `g-naf_aug25_allstates_gda94_psv_1020.zip`
2. Extract the ZIP file to a directory (e.g., `/path/to/gnaf-data/`)
3. The extracted directory should contain PSV files like:
   - `*_ADDRESS_DETAIL_psv.psv`
   - `*_LOCALITY_psv.psv`
   - Other supporting files

### Step 2: Run the Import

Execute the import script with the path to your extracted G-NAF directory:

```bash
# Option 1: Using npm script
npm run import-gnaf /path/to/extracted/gnaf-directory

# Option 2: Direct execution
node scripts/import-gnaf.js /path/to/extracted/gnaf-directory

# Option 3: TypeScript execution (if you have ts-node)
npm run gnaf:import /path/to/extracted/gnaf-directory
```

### Step 3: Monitor Import Progress

The import process will:

1. ✅ Initialize database schema
2. 📊 Count total records (this may take a few minutes)
3. 📥 Import localities first
4. 📥 Import addresses with progress updates
5. 🔧 Optimize database with indexes and analysis
6. 📈 Display final statistics

**Expected Import Time**: 15-45 minutes for the full national dataset (depending on hardware)

### Step 4: Clear Previous Data (Optional)

To clear existing G-NAF data before importing:

```bash
npm run gnaf:clear /path/to/extracted/gnaf-directory
```

## Verification

### Check Import Success

Visit the address API health endpoint:

```
GET http://localhost:3001/api/address
```

Expected response:

```json
{
  "success": true,
  "status": {
    "database": "connected",
    "data": "available",
    "service": "operational"
  },
  "stats": {
    "totalAddresses": 15000000,
    "totalLocalities": 15000,
    "stateBreakdown": {
      "NSW": 5000000,
      "VIC": 3500000,
      "QLD": 2800000
      // ... other states
    }
  },
  "message": "G-NAF address search is operational"
}
```

### Test Address Search

Test the search functionality:

```bash
curl -X POST http://localhost:3001/api/address \
  -H "Content-Type: application/json" \
  -d '{"query": "12 Smith Street Melbourne"}'
```

Expected response:

```json
{
  "success": true,
  "addresses": [
    {
      "validatedAddress": "12 Smith Street, Melbourne VIC 3000",
      "coordinates": {
        "lat": -37.8136,
        "lon": 144.9631
      },
      "components": {
        "number": "12",
        "street": "Smith Street",
        "locality": "Melbourne",
        "state": "VIC",
        "postcode": "3000"
      },
      "confidence": 95,
      "stateMapping": {
        "planningZone": {...},
        "hazardAreas": [...]
      }
    }
  ],
  "source": "gnaf"
}
```

## Architecture Overview

### Components

1. **Database Schema** (`app/lib/gnaf-schema.sql`)

   - Optimized tables for fast address searching
   - Full-text search indexes
   - Geographic coordinate indexing

2. **Import System** (`app/lib/gnaf-importer.ts`)

   - Batch processing for large datasets
   - Progress tracking and error handling
   - Database optimization post-import

3. **Search Service** (`app/lib/gnaf-search-service.ts`)

   - Fast address searching with ranking
   - Fuzzy matching capabilities
   - Integration with state mapping system

4. **API Integration** (`app/api/address/route.ts`)
   - Replaces external API calls
   - Caching and rate limiting
   - State mapping enrichment

### Features

- ⚡ **Fast Search**: Optimized database queries with full-text search
- 🎯 **Accurate Results**: Official PSMA G-NAF data
- 🔍 **Fuzzy Matching**: Handles typos and partial addresses
- 🗺️ **State Integration**: Automatic planning zone and hazard detection
- 📊 **Analytics**: Search statistics and performance monitoring
- 💾 **Caching**: Intelligent caching for improved performance

## Maintenance

### Regular Updates

G-NAF data is updated quarterly by PSMA. To update:

1. Download the latest G-NAF release
2. Extract to a directory
3. Run the import with `--clear` flag:
   ```bash
   npm run gnaf:clear /path/to/new-gnaf-directory
   ```

### Performance Monitoring

Monitor these metrics:

- Search response times (should be < 100ms)
- Database size and growth
- Cache hit rates
- Error rates

### Troubleshooting

#### Import Fails

1. **Database Connection**: Verify `DATABASE_URL` is correct
2. **Permissions**: Ensure database user has CREATE/INSERT permissions
3. **Disk Space**: Ensure adequate disk space (2-3x the PSV file size)
4. **Memory**: Large imports may require increased Node.js memory:
   ```bash
   node --max-old-space-size=4096 scripts/import-gnaf.js /path/to/data
   ```

#### Search Not Working

1. **Check Data**: Visit `/api/address` to verify data availability
2. **Database**: Ensure PostgreSQL is running
3. **Indexes**: Verify indexes were created successfully
4. **Logs**: Check server logs for detailed error messages

#### Performance Issues

1. **Database Tuning**: Optimize PostgreSQL settings for your hardware
2. **Indexes**: Ensure all search indexes are created
3. **Connection Pool**: Adjust connection pool settings
4. **Caching**: Verify caching is working effectively

## Benefits

### Before (External API)

- ❌ API failures and timeouts
- ❌ Rate limiting
- ❌ Network dependency
- ❌ Potential costs
- ❌ Limited offline capability

### After (G-NAF Integration)

- ✅ 100% reliable local search
- ✅ No rate limits
- ✅ No network dependency
- ✅ No external costs
- ✅ Full offline capability
- ✅ Official Australian data
- ✅ Better performance
- ✅ Enhanced features

## Support

For issues with G-NAF integration:

1. Check the troubleshooting section above
2. Verify database connectivity and data availability
3. Review server logs for detailed error information
4. Test with smaller datasets first if having import issues

The G-NAF integration provides a robust, reliable foundation for address searching in your PlanProof application.
