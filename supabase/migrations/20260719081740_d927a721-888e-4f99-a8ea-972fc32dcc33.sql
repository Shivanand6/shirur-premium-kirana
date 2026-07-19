
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated, anon;

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2),
  mrp NUMERIC(10,2),
  unit TEXT,
  image_url TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Awards
CREATE TABLE public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.awards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.awards TO authenticated;
GRANT ALL ON public.awards TO service_role;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Awards public read" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Admins manage awards" ON public.awards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Gallery
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'photo',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery public read" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed products
INSERT INTO public.products (name, slug, description, category, price, mrp, unit, in_stock, featured, sort_order) VALUES
('Sona Masoori Rice', 'sona-masoori-rice', 'Premium quality Sona Masoori rice, perfect for daily cooking.', 'Rice & Grains', 82, 90, '1 kg', true, true, 1),
('Basmati Rice', 'basmati-rice', 'Long-grain aromatic basmati rice.', 'Rice & Grains', 145, 160, '1 kg', true, true, 2),
('Toor Dal', 'toor-dal', 'High-quality yellow toor dal (arhar).', 'Pulses & Dals', 165, 180, '1 kg', true, true, 3),
('Moong Dal', 'moong-dal', 'Split yellow moong dal.', 'Pulses & Dals', 135, 150, '1 kg', true, false, 4),
('Fortune Sunflower Oil', 'sunflower-oil', 'Refined sunflower cooking oil.', 'Oils & Ghee', 155, 175, '1 L', true, true, 5),
('Cow Ghee', 'cow-ghee', 'Pure desi cow ghee.', 'Oils & Ghee', 620, 700, '500 g', true, true, 6),
('Aashirvaad Atta', 'aashirvaad-atta', 'Whole wheat chakki atta.', 'Atta & Flours', 385, 425, '5 kg', true, true, 7),
('MDH Garam Masala', 'garam-masala', 'Aromatic MDH garam masala blend.', 'Masala & Spices', 78, 85, '100 g', true, false, 8),
('Turmeric Powder', 'turmeric-powder', 'Fresh ground turmeric powder.', 'Masala & Spices', 45, 55, '200 g', true, false, 9),
('Red Chili Powder', 'chili-powder', 'Byadgi red chili powder.', 'Masala & Spices', 65, 75, '200 g', true, false, 10),
('Tata Salt', 'tata-salt', 'Iodized table salt.', 'Daily Essentials', 28, 32, '1 kg', true, false, 11),
('Sugar', 'sugar', 'Fine grain white sugar.', 'Daily Essentials', 48, 55, '1 kg', true, false, 12),
('Surf Excel Detergent', 'surf-excel', 'Powerful stain removal detergent powder.', 'Household', 245, 275, '1 kg', true, false, 13),
('Colgate Toothpaste', 'colgate', 'Strong teeth toothpaste.', 'Personal Care', 92, 105, '150 g', true, false, 14),
('Amul Butter', 'amul-butter', 'Fresh salted butter.', 'Dairy', 285, 315, '500 g', true, true, 15),
('Britannia Marie Gold', 'marie-gold', 'Classic Marie biscuits.', 'Snacks & Biscuits', 28, 32, '250 g', true, false, 16);

-- Seed award
INSERT INTO public.awards (title, description, year, sort_order) VALUES
('Highest Seller Award — Gold Winner Oil', 'Recognized as the highest-selling retailer for Gold Winner Oil in the region.', 2023, 1);
