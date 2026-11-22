import { adminClient, authenticatedUser } from "./_lib/supabase.js";
import { json, methodNotAllowed } from "./_lib/http.js";
import { randomBytes } from "node:crypto";
const required = ["sender_name","sender_phone","origin_city","origin_country","recipient_name","recipient_phone","destination_city","destination_country","package_description","weight_kg","service_type"];
function trackingNumber() { return `GEX-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`; }
export async function handler(event) {
  if (event.httpMethod !== "POST") return methodNotAllowed(["POST"]);
  try {
    const auth = await authenticatedUser(event);
    if (auth.error) return json(401, { error: auth.error });
    let body; try { body = JSON.parse(event.body || "{}"); } catch { return json(400,{error:"Invalid JSON body."}); }
    for (const key of required) if (body[key] === undefined || body[key] === null || String(body[key]).trim() === "") return json(400,{error:`${key} is required.`});
    const weight = Number(body.weight_kg);
    if (!Number.isFinite(weight) || weight <= 0 || weight > 50000) return json(400,{error:"Enter a valid package weight in kilograms."});
    const db = adminClient();
    const payload = {
      customer_id: auth.user.id, tracking_number: trackingNumber(),
      sender_name: String(body.sender_name).trim(), sender_phone: String(body.sender_phone).trim(),
      origin_city: String(body.origin_city).trim(), origin_country: String(body.origin_country).trim(),
      recipient_name: String(body.recipient_name).trim(), recipient_phone: String(body.recipient_phone).trim(),
      destination_city: String(body.destination_city).trim(), destination_country: String(body.destination_country).trim(),
      package_description: String(body.package_description).trim().slice(0,300),
      weight_kg: weight, service_type: String(body.service_type).trim(), status: "Shipment created"
    };
    const { data, error } = await db.from("shipments").insert(payload).select("id,tracking_number,status,created_at").single();
    if (error) throw error;
    await db.from("shipment_events").insert({ shipment_id:data.id,status:"Shipment created",description:"Shipment request received." });
    return json(201,{shipment:data});
  } catch (error) {
    console.error("create-shipment:",error);
    return json(500,{error:"Unable to create shipment. Check server configuration and try again."});
  }
}