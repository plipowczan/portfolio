# Stripe CLI

Thin CLI wrappers around the Stripe REST API for the `/sync-customers` skill.

## Setup
1. `cp .env.example .env`
2. Generate a restricted key at https://dashboard.stripe.com/apikeys with read-only scopes on Customers and Subscriptions.
3. Fill in `STRIPE_SECRET_KEY`.

## Scripts

| Script | Purpose |
|--------|---------|
| `list_customers.py` | Paginate through all customers (including churned — `status` reflects current state) |
| `get_customer.py CUSTOMER_ID` | Fetch one customer with expanded subscription data |

Output is JSON to stdout, errors to stderr. Scripts **never** write to Stripe — all operations are GET.

## Data mirrored to local customer.md

For each customer the sync skill mirrors into the `<!-- STRIPE:START -->` region:
- `stripe_customer_id`
- `stripe_status` (active / canceled / past_due / …)
- `tier` (derived from subscription price/plan)
- `mrr` (from active subscription)
- `started_at` (subscription start)
- `last_synced` (timestamp of the sync run)

Content outside the Stripe region in each `customer.md` is local-only and never touched.
