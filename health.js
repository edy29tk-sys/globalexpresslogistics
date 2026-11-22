import { json } from "./_lib/http.js";
export async function handler() {
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return json(configured ? 200 : 503, { service: "Global Express Logistics API", configured });
}