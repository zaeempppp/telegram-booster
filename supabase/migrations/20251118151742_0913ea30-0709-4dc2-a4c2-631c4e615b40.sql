-- Add service_type column to rush_orders table
ALTER TABLE public.rush_orders 
ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT 'members';

-- Add a check constraint for valid service types
ALTER TABLE public.rush_orders
DROP CONSTRAINT IF EXISTS valid_service_type;

ALTER TABLE public.rush_orders
ADD CONSTRAINT valid_service_type 
CHECK (service_type IN ('members', 'engagement', 'views', 'likes'));

-- Create a function to count user's pending orders
CREATE OR REPLACE FUNCTION public.count_user_pending_orders(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.rush_orders
  WHERE user_id = p_user_id
    AND status IN ('pending', 'approved');
$$;