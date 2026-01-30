-- Create a table for products
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- 'sebze', 'et', 'market', 'metro', 'diger'
  quantity numeric not null,
  unit text not null, -- 'kg', 'gr', 'lt', 'ml', 'adet', 'paket', 'koli'
  status text not null default 'pending', -- 'pending', 'purchased'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  purchased_at timestamp with time zone,
  user_id uuid references auth.users not null
);

-- Set up Row Level Security (RLS)
-- Enable RLS
alter table products enable row level security;

-- Create policy to allow users to see all products (shared list)
-- For a true shared list, we might want to allow all authenticated users to see everything.
-- Or better, create a specific 'kitchen_team' role or just share everything for now for simplicity as per requirements.
-- Let's allow ANY authenticated user to do ANYTHING for now (Team Mode).

create policy "Enable all access for authenticated users" on products
  for all using (auth.role() = 'authenticated');
