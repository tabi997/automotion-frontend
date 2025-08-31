-- Add openlane_url column to stock table
ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS openlane_url TEXT;

-- Add comment to explain the purpose of this column
COMMENT ON COLUMN public.stock.openlane_url IS 'URL to the OpenLane auction listing for this vehicle';
