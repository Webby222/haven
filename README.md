This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase backend foundation

Public property pages and the admin property manager use the Supabase `properties` table. Keep these public client variables in `.env.local` (or `.env.example` as a template):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not commit credentials. The website does not use a Supabase service-role key.

Apply the migrations in order, then seed the initial rows:

```bash
# create the properties table and public read policy
psql "$DATABASE_URL" -f supabase/migrations/001_create_properties_table.sql

# allow writes only for users with the HAVEN admin app_metadata claim
psql "$DATABASE_URL" -f supabase/migrations/002_admin_property_writes.sql

# add the property media gallery and Storage bucket/policies
psql "$DATABASE_URL" -f supabase/migrations/003_property_media.sql

# create the public enquiry table and insert-only policy
psql "$DATABASE_URL" -f supabase/migrations/004_create_inquiries.sql

# add enquiry statuses and admin-only read/status-update policies
psql "$DATABASE_URL" -f supabase/migrations/005_admin_enquiries.sql

# add structured property facilities and backfill recognized legacy features
psql "$DATABASE_URL" -f supabase/migrations/006_property_facilities.sql

# add protected enquiry reply history
psql "$DATABASE_URL" -f supabase/migrations/007_inquiry_replies.sql

# seed the properties rows
psql "$DATABASE_URL" -f supabase/seeds/001_properties_seed.sql
```

Provision admin accounts manually in Supabase Auth. Authorized accounts must have the server-controlled `app_metadata` claim `haven_admin: true`; do not use user-editable `user_metadata` for authorization. The app checks this claim in server code and the properties RLS policies check it again in the database. Set the claim only through trusted Supabase administration tooling.

For admin password recovery, add the app's `/auth/callback` URL to Supabase Auth's allowed redirect URLs for each environment (for example, `http://localhost:3000/auth/callback` and the deployed app origin).

If you are using the Supabase CLI, apply all seven migrations in numeric order and run the seed file against the intended local or remote database.

## Admin enquiry replies

Apply `supabase/migrations/007_inquiry_replies.sql` after migration 006. Admin reply history is stored separately from the original enquiry and is protected by the `haven_admin` app-metadata RLS policies.

For email delivery, set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` as server-only environment variables (never prefix them with `NEXT_PUBLIC_`). Verify the sender domain/address with Resend before sending. Without both values, HAVEN reports that sending is not configured and does not create a reply or claim delivery.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
