-- Update existing categories to match the new schema
UPDATE menu_items 
SET category = 'main_course' 
WHERE category IN ('main', 'seafood', 'specialty', 'hotpot');

UPDATE menu_items
SET category = 'appetizer'
WHERE category NOT IN ('appetizer', 'main_course', 'sharing_plate', 'dessert');

-- Remove the old constraint if it exists (assuming it was named menu_items_category_check)
-- If it has a different name, you might need to drop it manually.
DO $$ 
BEGIN
  ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;
EXCEPTION
  WHEN undefined_object THEN
    -- Do nothing if it doesn't exist
END $$;

-- Add the new constraint
ALTER TABLE menu_items 
ADD CONSTRAINT menu_items_category_check 
CHECK (category IN ('appetizer', 'main_course', 'sharing_plate', 'dessert'));
