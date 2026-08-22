-- Migration: Add ingredients, food_cost, and food_cost_percentage to menu_items
-- For AFTER HOURS – MODERN DINING investor portal

-- 1. Add ingredients (JSONB) and food_cost columns
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS food_cost NUMERIC(12,2) NOT NULL DEFAULT 0;

-- 2. Generated column for food cost percentage (auto-calculated)
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS food_cost_percentage NUMERIC(5,2)
  GENERATED ALWAYS AS (
    CASE WHEN price > 0 THEN ROUND((food_cost / price) * 100, 2) ELSE 0 END
  ) STORED; 

-- 3. Trigger: auto-calculate food_cost from ingredients array
CREATE OR REPLACE FUNCTION calc_food_cost_from_ingredients()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ingredients IS NOT NULL AND jsonb_array_length(NEW.ingredients) > 0 THEN
    SELECT COALESCE(SUM((elem->>'quantity')::numeric * (elem->>'unit_cost')::numeric), 0)
    INTO NEW.food_cost
    FROM jsonb_array_elements(NEW.ingredients) AS elem;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_food_cost ON menu_items;
CREATE TRIGGER trg_calc_food_cost
  BEFORE INSERT OR UPDATE OF ingredients ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION calc_food_cost_from_ingredients();

-- 4. Index for dashboard queries filtering by food cost percentage
CREATE INDEX IF NOT EXISTS idx_menu_items_food_cost_pct ON menu_items (food_cost_percentage);

-- 5. Profiles table for auth roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 7. RLS for menu_items (temporarily allow ALL for testing/bypassing login)
CREATE POLICY "owner_write_menu" ON menu_items
  FOR ALL USING (true);

-- 8. Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
