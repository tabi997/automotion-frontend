-- Add badges field to stock table
ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the badges field
COMMENT ON COLUMN public.stock.badges IS 'Array of badge objects with structure: [{"id": "string", "text": "string", "type": "success|warning|info|urgent"}]';
