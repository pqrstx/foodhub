-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_key TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reservation_orders table
CREATE TABLE IF NOT EXISTS public.reservation_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_option TEXT NOT NULL DEFAULT 'pay_later', -- 'pay_now' | 'pay_later'
  payment_status TEXT NOT NULL DEFAULT 'pending',   -- 'pending' | 'paid' | 'failed'
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  menu_item_id UUID,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  special_requests TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign keys (avoid referencing auth schema directly)
ALTER TABLE public.reservation_orders
  ADD CONSTRAINT reservation_orders_reservation_fk
  FOREIGN KEY (reservation_id)
  REFERENCES public.reservations(id)
  ON DELETE CASCADE;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_order_fk
  FOREIGN KEY (order_id)
  REFERENCES public.reservation_orders(id)
  ON DELETE CASCADE;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_menu_item_fk
  FOREIGN KEY (menu_item_id)
  REFERENCES public.menu_items(id)
  ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies for menu_items (public readable)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'menu_items' AND policyname = 'Menu is publicly viewable'
  ) THEN
    CREATE POLICY "Menu is publicly viewable" ON public.menu_items FOR SELECT USING (true);
  END IF;
END $$;

-- Policies for reservation_orders (user scoped)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reservation_orders' AND policyname = 'Users view own orders'
  ) THEN
    CREATE POLICY "Users view own orders" ON public.reservation_orders FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reservation_orders' AND policyname = 'Users insert own orders'
  ) THEN
    CREATE POLICY "Users insert own orders" ON public.reservation_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reservation_orders' AND policyname = 'Users update own orders'
  ) THEN
    CREATE POLICY "Users update own orders" ON public.reservation_orders FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Policies for order_items (scoped via parent order)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Users view own order items'
  ) THEN
    CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.reservation_orders o WHERE o.id = order_id AND o.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Users insert own order items'
  ) THEN
    CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.reservation_orders o WHERE o.id = order_id AND o.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Users update own order items'
  ) THEN
    CREATE POLICY "Users update own order items" ON public.order_items FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.reservation_orders o WHERE o.id = order_id AND o.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Timestamps trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_menu_items_updated_at'
  ) THEN
    CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_reservation_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_reservation_orders_updated_at
    BEFORE UPDATE ON public.reservation_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Seed minimal menu items if table is empty
INSERT INTO public.menu_items (name, description, category, price, is_active)
SELECT name, description, category, price, true FROM (
  VALUES
    ('Ugali & Sukuma Wiki', 'Kenyan staple - ugali with sautéed collard greens', 'mains', 450.00),
    ('Githeri', 'Maize and beans simmered with vegetables and spices', 'mains', 380.00),
    ('Chapati', 'Soft layered flatbread, perfect side for stews', 'starters', 80.00),
    ('Samosas', 'Crispy pastries filled with spiced meat or vegetables', 'starters', 250.00),
    ('Matoke', 'Green bananas in rich tomato sauce', 'mains', 520.00),
    ('Kenyan Chai', 'Spiced tea with milk, cardamom, cinnamon, ginger', 'drinks', 180.00),
    ('Tamarind Juice', 'Refreshing sweet and tangy tamarind drink', 'drinks', 250.00),
    ('Mandazi', 'Sweet fried doughnuts with cardamom and coconut', 'desserts', 200.00)
) AS v(name, description, category, price)
WHERE NOT EXISTS (SELECT 1 FROM public.menu_items);
