# Mock Data Removal - Address Search

## Changes Made

The address search system has been updated to remove all mock/fallback data and return only real address results from the G-NAF database.

### 🗑️ **Removed Components:**

1. **Mock Address Generation Function**

   - Removed `generateMockAddressResults()` function entirely
   - No more fallback sample addresses

2. **Mock Data Fallbacks**
   - Removed mock data when G-NAF database is not available
   - Removed mock data on G-NAF search errors
   - Removed development fallback notices from UI

### ✅ **New Behavior:**

#### When G-NAF Database is Not Available:

**Before:** Returned mock addresses with source "mock-fallback"
**Now:** Returns HTTP 503 error with message:

```json
{
  "success": false,
  "error": "Address search unavailable",
  "details": "G-NAF address database is not configured. Please set up the address database to enable address searching."
}
```

#### When G-NAF Search Fails:

**Before:** Returned mock addresses with source "error-fallback"  
**Now:** Returns HTTP 503 error with message:

```json
{
  "success": false,
  "error": "Address search failed",
  "details": "Unable to search addresses due to database connectivity issues. Please try again later."
}
```

#### When G-NAF Database is Available:

**Before:** Returns real G-NAF search results
**Now:** Returns real G-NAF search results (unchanged)

### 🔧 **API Response Changes:**

| Scenario         | Old Response        | New Response          |
| ---------------- | ------------------- | --------------------- |
| No Database      | `200` + mock data   | `503` + error message |
| Database Error   | `200` + mock data   | `503` + error message |
| No Results Found | `200` + empty array | `200` + empty array   |
| Valid Results    | `200` + real data   | `200` + real data     |

### 📱 **Frontend Handling:**

The AddressSearch component already handles 503 errors properly and will display the error message to users:

- Shows proper error message in the search results dropdown
- No more misleading development fallback notices
- Clear indication that address search requires database setup

### 🎯 **Next Steps:**

To enable address searching, you need to:

1. **Set up PostgreSQL database**
2. **Configure environment variables:**
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/database"
   ```
3. **Import G-NAF data:**
   ```bash
   npm run gnaf:setup
   npm run import-gnaf /path/to/gnaf-data
   ```

### ✅ **Benefits:**

- **No misleading results**: Users won't see fake addresses
- **Clear error messages**: Users understand what needs to be configured
- **Production ready**: System behaves correctly without real data
- **Proper HTTP status codes**: Applications can handle errors appropriately
- **Clean codebase**: Removed unnecessary mock data code

The address search system now requires proper G-NAF database configuration to function, ensuring users only see real, accurate Australian address data.
