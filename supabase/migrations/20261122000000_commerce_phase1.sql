-- Olive Wisdom commerce Phase 1 schema (feature branch: ecommerce-phase1-20261122)
-- Design source: 電商設計報告 §3.3 (2026-11-22). Amounts are integer NT dollars
-- (ECPay TotalAmount is whole NT$; no cents in practice).
-- NOT YET APPLIED to any live database. Apply only after the Taipei company,
-- merchant account, same-batch CoA and importer agreement are in place.
-- RLS: enabled on all tables with NO public policies — all commerce reads and
-- writes go through server-side code using the service-role key (API routes
-- under src/app/api). The anon key must never touch these tables.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  kind text not null check (kind in ('own_stock', 'experience', 'digital')),
  origin text,
  harvest_date date,
  batch_no text,
  -- Same-batch CoA snapshot shown on the product page (all six values required
  -- before a product may be listed — see /selection standards).
  coa_acidity numeric,
  coa_peroxide numeric,
  coa_k232 numeric,
  coa_k270 numeric,
  coa_delta_k numeric,
  coa_polyphenol_mg_kg int,
  coa_polyphenol_method text, -- HPLC | NMR | Folin | LC-MS/MS (methods are NOT interchangeable)
  price int not null check (price > 0),
  stock int,
  importer_name text,
  is_active boolean not null default false, -- stays false until CoA gate passes
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null, -- OW + YYYYMM + serial, e.g. OW2026120001
  user_id uuid references auth.users (id),
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded')),
  payment_provider text check (payment_provider in ('ecpay', 'newebpay')),
  payment_method text, -- credit | atm | cvs_code
  subtotal int not null,
  shipping_fee int not null default 0,
  discount int not null default 0,
  total int not null,
  currency text not null default 'TWD',
  invoice_no text,
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_tracking_no text,
  notes text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  product_name text not null, -- snapshot at purchase time
  variant_name text,
  unit_price int not null,
  qty int not null default 1 check (qty > 0),
  coa_snapshot jsonb -- {acidity, peroxide, k232, k270, deltaK, polyphenolMgKg, method, batchNo}
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  provider text not null,
  provider_trade_no text unique, -- ECPay MerchantTradeNo
  provider_txn_id text, -- ECPay TradeNo
  amount int not null,
  status text not null check (status in ('pending', 'success', 'failed', 'refunded')),
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
-- Intentionally no policies: service-role access only (bypasses RLS).
