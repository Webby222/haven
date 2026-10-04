CREATE TABLE IF NOT EXISTS public.properties (
  id text PRIMARY KEY,
  title text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('sale', 'rent')),
  property_type text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  price numeric(12,2) NOT NULL,
  price_period text NOT NULL,
  bedrooms integer,
  bathrooms integer,
  parking boolean NOT NULL DEFAULT false,
  furnished boolean NOT NULL DEFAULT false,
  serviced boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  image text NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view properties"
ON public.properties
FOR SELECT
USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.properties TO anon, authenticated;
