create sequence "public"."activities_id_seq";

create sequence "public"."balances_id_seq";

create sequence "public"."commissions_id_seq";

create sequence "public"."holdings_id_seq";

create sequence "public"."realized_gl_id_seq";

create sequence "public"."securities_id_seq";

create sequence "public"."trades_id_seq";

create table "public"."accounts" (
    "account_id" text not null,
    "last_updated" timestamp with time zone default now(),
    "account_name" text not null,
    "account_type" text,
    "client_id" uuid not null,
    "household_id" uuid,
    "is_primary" boolean default false
);


alter table "public"."accounts" enable row level security;

create table "public"."activities" (
    "id" integer not null default nextval('activities_id_seq'::regclass),
    "account_id" text,
    "activity_id" text not null,
    "type" text not null,
    "description" text not null,
    "amount" numeric not null,
    "date" date not null,
    "time" time without time zone not null,
    "symbol" text,
    "quantity" integer,
    "price" numeric,
    "last_updated" timestamp with time zone default now(),
    "cusip" text,
    "buy_price" numeric,
    "action" text,
    "settle_date" date,
    "transaction_type" text,
    "account_type" text,
    "trade_number" text
);


alter table "public"."activities" enable row level security;

create table "public"."balances" (
    "id" integer not null default nextval('balances_id_seq'::regclass),
    "account_id" text,
    "cash" numeric not null default 0,
    "margin" numeric not null default 0,
    "buying_power" numeric not null default 0,
    "total_value" numeric not null default 0,
    "invested_value" numeric not null default 0,
    "realized_gl" numeric not null default 0,
    "last_updated" timestamp with time zone default now(),
    "market_value" numeric default 0,
    "unrealized_gl" numeric default 0
);


alter table "public"."balances" enable row level security;

create table "public"."clients" (
    "first_name" text not null,
    "last_name" text not null,
    "email" text,
    "phone" text,
    "created_at" timestamp with time zone default now(),
    "last_updated" timestamp with time zone default now(),
    "id" uuid not null default extensions.uuid_generate_v4()
);


alter table "public"."clients" enable row level security;

create table "public"."commissions" (
    "id" integer not null default nextval('commissions_id_seq'::regclass),
    "account_id" text,
    "commission_id" text not null,
    "month" text not null,
    "year" integer not null,
    "total_commission" numeric not null,
    "average_per_trade" numeric not null,
    "equity_trades" integer not null,
    "option_trades" integer not null,
    "other_trades" integer not null,
    "date" date not null,
    "last_updated" timestamp with time zone default now()
);


alter table "public"."commissions" enable row level security;

create table "public"."holdings" (
    "id" integer not null default nextval('holdings_id_seq'::regclass),
    "account_id" text,
    "symbol" text not null,
    "quantity" integer not null,
    "avg_price" numeric not null,
    "last_updated" timestamp with time zone default now()
);


alter table "public"."holdings" enable row level security;

create table "public"."households" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "last_updated" timestamp with time zone default now()
);


create table "public"."market_data" (
    "symbol" text not null,
    "current_price" double precision,
    "previous_close" double precision,
    "day_change" double precision,
    "day_change_percent" double precision,
    "volume" bigint,
    "market_cap" bigint,
    "last_updated" timestamp with time zone
);


alter table "public"."market_data" enable row level security;

create table "public"."realized_gl" (
    "id" integer not null default nextval('realized_gl_id_seq'::regclass),
    "account_id" text,
    "trade_id" text not null,
    "symbol" text not null,
    "cusip" text not null,
    "description" text not null,
    "open_date" date not null,
    "close_date" date not null,
    "quantity" integer not null,
    "avg_buy_price" numeric not null,
    "sell_price" numeric not null,
    "invested_value" numeric not null,
    "total_sell_value" numeric not null,
    "realized_gl" numeric not null,
    "realized_gl_percent" numeric not null,
    "long_short" text not null,
    "last_updated" timestamp with time zone default now()
);


alter table "public"."realized_gl" enable row level security;

create table "public"."securities" (
    "id" integer not null default nextval('securities_id_seq'::regclass),
    "account_id" text,
    "symbol" text not null,
    "cusip" text not null,
    "description" text not null,
    "sector" text not null,
    "type" text not null,
    "exchange" text,
    "underlying" text,
    "strike_price" numeric,
    "expiration_date" date,
    "option_type" text,
    "expense_ratio" numeric,
    "last_updated" timestamp with time zone default now()
);


alter table "public"."securities" enable row level security;

create table "public"."trades" (
    "id" integer not null default nextval('trades_id_seq'::regclass),
    "account_id" text,
    "trade_id" text not null,
    "symbol" text not null,
    "cusip" text not null,
    "description" text not null,
    "action" text not null,
    "quantity" integer not null,
    "price" numeric not null,
    "total_value" numeric not null,
    "commission" numeric not null,
    "date" date not null,
    "time" time without time zone not null,
    "long_short" text not null,
    "last_updated" timestamp with time zone default now()
);


alter table "public"."trades" enable row level security;

alter sequence "public"."activities_id_seq" owned by "public"."activities"."id";

alter sequence "public"."balances_id_seq" owned by "public"."balances"."id";

alter sequence "public"."commissions_id_seq" owned by "public"."commissions"."id";

alter sequence "public"."holdings_id_seq" owned by "public"."holdings"."id";

alter sequence "public"."realized_gl_id_seq" owned by "public"."realized_gl"."id";

alter sequence "public"."securities_id_seq" owned by "public"."securities"."id";

alter sequence "public"."trades_id_seq" owned by "public"."trades"."id";

CREATE UNIQUE INDEX accounts_pkey ON public.accounts USING btree (account_id);

CREATE UNIQUE INDEX activities_pkey ON public.activities USING btree (id);

CREATE UNIQUE INDEX balances_account_id_key ON public.balances USING btree (account_id);

CREATE UNIQUE INDEX balances_pkey ON public.balances USING btree (id);

CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);

CREATE UNIQUE INDEX commissions_pkey ON public.commissions USING btree (id);

CREATE UNIQUE INDEX holdings_account_id_symbol_key ON public.holdings USING btree (account_id, symbol);

CREATE UNIQUE INDEX holdings_pkey ON public.holdings USING btree (id);

CREATE UNIQUE INDEX households_pkey ON public.households USING btree (id);

CREATE INDEX idx_activities_account_id ON public.activities USING btree (account_id);

CREATE INDEX idx_activities_date ON public.activities USING btree (date);

CREATE INDEX idx_activities_type ON public.activities USING btree (type);

CREATE INDEX idx_balances_account_id ON public.balances USING btree (account_id);

CREATE INDEX idx_commissions_account_id ON public.commissions USING btree (account_id);

CREATE INDEX idx_holdings_account_id ON public.holdings USING btree (account_id);

CREATE INDEX idx_realized_gl_account_id ON public.realized_gl USING btree (account_id);

CREATE INDEX idx_securities_account_id ON public.securities USING btree (account_id);

CREATE INDEX idx_trades_account_id ON public.trades USING btree (account_id);

CREATE UNIQUE INDEX market_data_pkey ON public.market_data USING btree (symbol);

CREATE UNIQUE INDEX realized_gl_pkey ON public.realized_gl USING btree (id);

CREATE UNIQUE INDEX securities_account_id_symbol_key ON public.securities USING btree (account_id, symbol);

CREATE UNIQUE INDEX securities_pkey ON public.securities USING btree (id);

CREATE UNIQUE INDEX trades_pkey ON public.trades USING btree (id);

CREATE UNIQUE INDEX unique_primary_per_household ON public.accounts USING btree (household_id) WHERE (is_primary = true);

alter table "public"."accounts" add constraint "accounts_pkey" PRIMARY KEY using index "accounts_pkey";

alter table "public"."activities" add constraint "activities_pkey" PRIMARY KEY using index "activities_pkey";

alter table "public"."balances" add constraint "balances_pkey" PRIMARY KEY using index "balances_pkey";

alter table "public"."clients" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."commissions" add constraint "commissions_pkey" PRIMARY KEY using index "commissions_pkey";

alter table "public"."holdings" add constraint "holdings_pkey" PRIMARY KEY using index "holdings_pkey";

alter table "public"."households" add constraint "households_pkey" PRIMARY KEY using index "households_pkey";

alter table "public"."market_data" add constraint "market_data_pkey" PRIMARY KEY using index "market_data_pkey";

alter table "public"."realized_gl" add constraint "realized_gl_pkey" PRIMARY KEY using index "realized_gl_pkey";

alter table "public"."securities" add constraint "securities_pkey" PRIMARY KEY using index "securities_pkey";

alter table "public"."trades" add constraint "trades_pkey" PRIMARY KEY using index "trades_pkey";

alter table "public"."accounts" add constraint "accounts_account_type_check" CHECK ((account_type = ANY (ARRAY['individual'::text, 'joint'::text, 'ira'::text, 'roth_ira'::text, '401k'::text, '403b'::text, 'sep_ira'::text, 'simple_ira'::text, 'trust'::text, 'corporate'::text, 'partnership'::text, 'llc'::text, 'other'::text]))) not valid;

alter table "public"."accounts" validate constraint "accounts_account_type_check";

alter table "public"."accounts" add constraint "accounts_household_id_fkey" FOREIGN KEY (household_id) REFERENCES households(id) not valid;

alter table "public"."accounts" validate constraint "accounts_household_id_fkey";

alter table "public"."activities" add constraint "activities_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE not valid;

alter table "public"."activities" validate constraint "activities_account_id_fkey";

alter table "public"."activities" add constraint "activities_account_type_check" CHECK ((account_type = ANY (ARRAY['CASH'::text, 'MARGIN'::text, 'SHORT_MARGIN'::text, 'LONG_MARGIN'::text, 'IRA'::text]))) not valid;

alter table "public"."activities" validate constraint "activities_account_type_check";

alter table "public"."activities" add constraint "activities_action_check" CHECK ((action = ANY (ARRAY['BUY'::text, 'SELL'::text, 'TRADE'::text]))) not valid;

alter table "public"."activities" validate constraint "activities_action_check";

alter table "public"."activities" add constraint "activities_transaction_type_check" CHECK ((transaction_type = ANY (ARRAY['MARKET'::text, 'LIMIT'::text]))) not valid;

alter table "public"."activities" validate constraint "activities_transaction_type_check";

alter table "public"."activities" add constraint "activities_type_check" CHECK ((type = ANY (ARRAY['DEPOSIT'::text, 'WITHDRAWAL'::text, 'DIVIDEND'::text, 'TRADE'::text, 'TRANSFER'::text, 'EQUITY'::text, 'MUTUAL_FUNDS'::text, 'INTEREST'::text, 'IRA'::text]))) not valid;

alter table "public"."activities" validate constraint "activities_type_check";

alter table "public"."balances" add constraint "balances_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE not valid;

alter table "public"."balances" validate constraint "balances_account_id_fkey";

alter table "public"."balances" add constraint "balances_account_id_key" UNIQUE using index "balances_account_id_key";

alter table "public"."commissions" add constraint "commissions_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE not valid;

alter table "public"."commissions" validate constraint "commissions_account_id_fkey";

alter table "public"."holdings" add constraint "holdings_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE not valid;

alter table "public"."holdings" validate constraint "holdings_account_id_fkey";

alter table "public"."holdings" add constraint "holdings_account_id_symbol_key" UNIQUE using index "holdings_account_id_symbol_key";

alter table "public"."realized_gl" add constraint "realized_gl_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE not valid;

alter table "public"."realized_gl" validate constraint "realized_gl_account_id_fkey";

alter table "public"."realized_gl" add constraint "realized_gl_long_short_check" CHECK ((long_short = ANY (ARRAY['Long'::text, 'Short'::text]))) not valid;

alter table "public"."realized_gl" validate constraint "realized_gl_long_short_check";

alter table "public"."securities" add constraint "securities_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE not valid;

alter table "public"."securities" validate constraint "securities_account_id_fkey";

alter table "public"."securities" add constraint "securities_account_id_symbol_key" UNIQUE using index "securities_account_id_symbol_key";

alter table "public"."securities" add constraint "securities_option_type_check" CHECK ((option_type = ANY (ARRAY['call'::text, 'put'::text]))) not valid;

alter table "public"."securities" validate constraint "securities_option_type_check";

alter table "public"."securities" add constraint "securities_type_check" CHECK ((type = ANY (ARRAY['equity'::text, 'option'::text, 'mutual_fund'::text, 'etf'::text, 'bond'::text]))) not valid;

alter table "public"."securities" validate constraint "securities_type_check";

alter table "public"."trades" add constraint "trades_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE not valid;

alter table "public"."trades" validate constraint "trades_account_id_fkey";

alter table "public"."trades" add constraint "trades_action_check" CHECK ((action = ANY (ARRAY['BUY'::text, 'SELL'::text]))) not valid;

alter table "public"."trades" validate constraint "trades_action_check";

alter table "public"."trades" add constraint "trades_long_short_check" CHECK ((long_short = ANY (ARRAY['Long'::text, 'Short'::text]))) not valid;

alter table "public"."trades" validate constraint "trades_long_short_check";

create policy "Allow all operations on accounts"
on "public"."accounts"
as permissive
for all
to public
using (true);


create policy "Allow all operations on activities"
on "public"."activities"
as permissive
for all
to public
using (true);


create policy "Allow all operations on balances"
on "public"."balances"
as permissive
for all
to public
using (true);


create policy "Allow all operations on clients"
on "public"."clients"
as permissive
for all
to public
using (true);


create policy "Allow all operations on commissions"
on "public"."commissions"
as permissive
for all
to public
using (true);


create policy "Allow all operations on holdings"
on "public"."holdings"
as permissive
for all
to public
using (true);


create policy "Allow public read access to market_data"
on "public"."market_data"
as permissive
for select
to public
using (true);


create policy "Allow service role to modify market_data"
on "public"."market_data"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Allow all operations on realized_gl"
on "public"."realized_gl"
as permissive
for all
to public
using (true);


create policy "Allow all operations on securities"
on "public"."securities"
as permissive
for all
to public
using (true);


create policy "Allow all operations on trades"
on "public"."trades"
as permissive
for all
to public
using (true);



