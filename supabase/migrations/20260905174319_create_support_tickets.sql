CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'normal',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at timestamp with time zone,
  closed_at timestamp with time zone
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all tickets"
  ON public.support_tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- Also add a trigger to update 'updated_at' automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
