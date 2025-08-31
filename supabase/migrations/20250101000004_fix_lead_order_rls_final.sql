-- Final fix for lead_order RLS policies
-- This migration should be run manually in Supabase SQL Editor

-- Step 1: Drop all existing policies for lead_order
DROP POLICY IF EXISTS "Allow public insert on lead_order" ON public.lead_order;
DROP POLICY IF EXISTS "Allow public select own leads" ON public.lead_order;
DROP POLICY IF EXISTS "Allow authenticated update own leads" ON public.lead_order;
DROP POLICY IF EXISTS "Allow authenticated delete leads" ON public.lead_order;

-- Step 2: Create a simple policy that allows public insert
CREATE POLICY "Allow public insert on lead_order" 
ON public.lead_order 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Step 3: Create a policy for public select (optional, for viewing)
CREATE POLICY "Allow public select on lead_order" 
ON public.lead_order 
FOR SELECT 
TO public 
USING (true);

-- Step 4: Create a policy for authenticated users to update
CREATE POLICY "Allow authenticated update on lead_order" 
ON public.lead_order 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Step 5: Create a policy for authenticated users to delete
CREATE POLICY "Allow authenticated delete on lead_order" 
ON public.lead_order 
FOR DELETE 
TO authenticated 
USING (true);

-- Alternative: If you want to temporarily disable RLS completely
-- ALTER TABLE public.lead_order DISABLE ROW LEVEL SECURITY;

-- Note: After running this migration, test the form again
-- If it still doesn't work, you may need to manually create the policies in the Supabase dashboard
