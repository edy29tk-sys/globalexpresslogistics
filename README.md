# Global Express Logistics

International courier and shipment-management starter built with React + Vite, Supabase and Netlify Functions.

## Included
- Responsive public website with tracking, shipping request, rates and contact sections.
- Supabase email/password authentication.
- Customer dashboard listing the signed-in customer's shipments.
- Public tracking lookup using a tracking number.
- Server-side shipment creation and admin-only status updates.
- PostgreSQL schema, indexes, status history, and Row Level Security policies.
- Netlify redirects and serverless functions.

## Important launch notes
This is a working application foundation, not a licensed carrier network. The platform creates and tracks its own Global Express Logistics shipment records. It does not create real FedEx/UPS/DHL labels, book carrier pickups, calculate live third-party carrier rates, or guarantee delivery dates. Those features require approved carrier accounts and API credentials.

The admin role is assigned explicitly in the database by the project owner. Do not expose the Supabase service-role key in browser code or commit `.env` files.

## 1. Create Supabase project
1. Create a project at https://supabase.com/.
2. Open SQL Editor and run `supabase/migrations/0001_initial_schema.sql`.
3. In Authentication settings, enable Email provider. Configure your production Site URL and redirect URLs, including your Netlify domain.
4. Copy Project URL, anon/public key, and service-role key from Project Settings → API.

## 2. Configure environment
Copy `.env.example` to `.env` for local development and fill in values.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`: browser client.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: Netlify Functions only.

Never put the service-role key in a `VITE_` variable.

## 3. Run locally
```bash
npm install
npm run dev
```
For Netlify Functions locally:
```bash
npm run netlify:dev
```

## 4. Create the first administrator
Register your own account through the app. Find its UUID in Supabase → Authentication → Users.
In SQL Editor run (replace the UUID):
```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_UUID';
```
Only do this for an account you control. Admin status is protected by database policies and server-side JWT verification.

## 5. Deploy to Netlify
1. Push this folder to a GitHub repository.
2. In Netlify choose Add new site → Import an existing project → GitHub.
3. Build command: `npm run build`; publish directory: `dist`. `netlify.toml` already declares these.
4. In Netlify Site configuration → Environment variables, add all required Supabase variables. Add both `VITE_...` variables and server-only variables listed above.
5. Trigger a fresh deploy after setting variables.
6. In Supabase Auth URL configuration, add the final Netlify URL to Site URL / Redirect URLs.

## 6. Verify before launch
- Register a test customer and sign in.
- Create a shipment request and confirm a row appears in `shipments`.
- Confirm tracking lookup returns only public-safe shipment information.
- Confirm a customer cannot see another customer's shipment.
- Promote your own account to admin and test status changes.
- Test password reset, mobile layout, and production redirects.

## Database tables
- `profiles`: customer profile and role.
- `shipments`: shipment details and current status.
- `shipment_events`: chronological tracking scans/status history.

## API functions
- `POST /.netlify/functions/create-shipment` — authenticated customer creates a shipment.
- `GET /.netlify/functions/track?trackingNumber=...` — public tracking response.
- `POST /.netlify/functions/update-shipment` — admin-only status update.

## Security and production checklist
- Enable MFA for administrator accounts.
- Use a verified email domain and configure SPF, DKIM and DMARC before sending transactional mail.
- Configure Supabase backups and review retention requirements.
- Add CAPTCHA/rate limiting and abuse monitoring to public forms before high-volume production.
- Use a payment provider's hosted checkout; never store card numbers or CVVs.
- Review privacy policy, terms, customs rules, restricted-goods policy, insurance, and local carrier regulations with qualified professionals.
