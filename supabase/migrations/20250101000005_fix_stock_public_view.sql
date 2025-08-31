-- Fix stock table RLS policy to allow public viewing
-- This migration allows public users to view stock vehicles

-- Drop the restrictive policy that only allows authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to view stock" ON public.stock;

-- Create new policy that allows public to view stock
CREATE POLICY "Allow public to view stock" ON public.stock
    FOR SELECT USING (true);

-- Keep other policies for authenticated users
-- (insert, update, delete still require authentication)

-- Note: After running this migration, public users will be able to view stock
-- while authenticated users can still manage (insert, update, delete) stock items
