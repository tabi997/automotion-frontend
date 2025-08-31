# Database Setup for Badge System

## Manual Database Setup Required

Since the automatic migration cannot be run locally, you need to manually add the `badges` column to your Supabase database.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to your project at https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration SQL**
   ```sql
   -- Add badges field to stock table
   ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
   
   -- Add comment to explain the badges field
   COMMENT ON COLUMN public.stock.badges IS 'Array of badge objects with structure: [{"id": "string", "text": "string", "type": "success|warning|info|urgent"}]';
   ```

4. **Click "Run" to execute the SQL**

5. **Verify the Column was Added**
   - Go to "Table Editor" in the left sidebar
   - Click on the "stock" table
   - You should see the new "badges" column

### Alternative: Using Supabase CLI

If you have Supabase CLI set up:

```bash
# Link your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push
```

### Testing After Setup

Once the column is added, you can test the badge functionality:

```bash
# Run the test script to add sample vehicles with badges
node scripts/test-badges.js
```

## Badge Data Structure

The `badges` column stores JSON data in this format:

```json
[
  {
    "id": "hot",
    "text": "Hot right now",
    "type": "urgent",
    "icon": "🔥"
  },
  {
    "id": "demand", 
    "text": "In demand",
    "type": "warning",
    "icon": "⭐"
  }
]
```

## Badge Types

- `success` - Green badges (New arrival)
- `warning` - Orange badges (In demand, Special offer)
- `info` - Blue badges (Reserved)
- `urgent` - Red badges (Hot right now)
