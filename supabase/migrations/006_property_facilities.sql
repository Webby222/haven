ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS facilities jsonb NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.properties'::regclass
      AND conname = 'properties_facilities_is_array'
  ) THEN
    ALTER TABLE public.properties
    ADD CONSTRAINT properties_facilities_is_array
    CHECK (jsonb_typeof(facilities) = 'array');
  END IF;
END;
$$;

UPDATE public.properties AS property
SET facilities = COALESCE((
  SELECT jsonb_agg(to_jsonb(mapped.facility_id) ORDER BY mapped.facility_id)
  FROM (
    SELECT DISTINCT CASE lower(btrim(legacy.value))
      WHEN 'wifi' THEN 'wifi'
      WHEN 'wi-fi' THEN 'wifi'
      WHEN 'internet' THEN 'wifi'
      WHEN 'parking' THEN 'parking'
      WHEN 'swimming pool' THEN 'pool'
      WHEN 'pool' THEN 'pool'
      WHEN 'gym' THEN 'gym'
      WHEN 'security' THEN 'security'
      WHEN '24-hour security' THEN 'security'
      WHEN '24-hour power' THEN 'power'
      WHEN 'backup power' THEN 'power'
      WHEN 'reliable power' THEN 'power'
      WHEN 'water supply' THEN 'water_supply'
      WHEN 'clean water' THEN 'water_supply'
      WHEN 'air conditioning' THEN 'air_conditioning'
      WHEN 'ac' THEN 'air_conditioning'
      WHEN 'furnished' THEN 'furnished'
      WHEN 'family friendly' THEN 'family_friendly'
      WHEN 'gated compound' THEN 'gated_compound'
      WHEN 'private compound' THEN 'gated_compound'
      WHEN 'estate security' THEN 'estate_security'
      WHEN 'serviced estate' THEN 'estate_security'
      WHEN 'cctv' THEN 'cctv'
      WHEN 'surveillance' THEN 'cctv'
      WHEN 'security gate' THEN 'security_gate'
      WHEN 'secure compound' THEN 'security_gate'
      WHEN 'elevator' THEN 'elevator'
      WHEN 'lift' THEN 'elevator'
      WHEN 'balcony' THEN 'balcony'
      WHEN 'fitted kitchen' THEN 'fitted_kitchen'
      WHEN 'modern kitchen' THEN 'modern_kitchen'
      WHEN 'dining area' THEN 'dining_area'
      WHEN 'living room' THEN 'living_room'
      WHEN 'ensuite' THEN 'ensuite'
      WHEN 'ensuite bedrooms' THEN 'ensuite'
      WHEN 'guest toilet' THEN 'guest_toilet'
      WHEN 'water heater' THEN 'water_heater'
      WHEN 'wardrobe' THEN 'wardrobe'
      WHEN 'fitted wardrobes' THEN 'wardrobe'
      WHEN 'pop ceiling' THEN 'pop_ceiling'
      WHEN 'tiled floors' THEN 'tiled_floors'
      WHEN 'laundry' THEN 'laundry'
      WHEN 'prepaid meter' THEN 'prepaid_meter'
      WHEN 'generator' THEN 'generator'
      WHEN 'inverter' THEN 'inverter'
      WHEN 'borehole' THEN 'borehole'
      WHEN 'visitors parking' THEN 'visitor_parking'
      WHEN 'visitor parking' THEN 'visitor_parking'
      WHEN 'serviced property' THEN 'serviced'
      WHEN 'newly built' THEN 'newly_built'
      WHEN 'covered parking' THEN 'covered_parking'
      WHEN 'garden' THEN 'garden'
      WHEN 'garden space' THEN 'garden'
      WHEN 'paved compound' THEN 'paved_compound'
      ELSE NULL
    END AS facility_id
    FROM unnest(COALESCE(property.features, ARRAY[]::text[])) AS legacy(value)
  ) AS mapped
  WHERE mapped.facility_id IS NOT NULL
), '[]'::jsonb)
WHERE property.facilities = '[]'::jsonb
  AND cardinality(COALESCE(property.features, ARRAY[]::text[])) > 0;