import { adminClient } from "./_lib/supabase.js";
import { json, methodNotAllowed } from "./_lib/http.js";
export async function handler(event) {
  if (event.httpMethod !== "GET") return methodNotAllowed(["GET"]);
  const trackingNumber = (event.queryStringParameters?.trackingNumber || "").trim().toUpperCase();
  if (!/^GEX-\d{4}-[A-F0-9]{8}$/.test(trackingNumber)) return json(400,{error:"Enter a valid Global Express tracking number."});
  try {
    const db=adminClient();
    const {data:shipment,error}=await db.from("shipments").select("id,tracking_number,status,origin_city,origin_country,destination_city,destination_country,estimated_delivery,created_at").eq("tracking_number",trackingNumber).maybeSingle();
    if(error) throw error;
    if(!shipment) return json(404,{error:"No shipment was found for that tracking number."});
    const {data:events,error:eventError}=await db.from("shipment_events").select("id,status,description,created_at").eq("shipment_id",shipment.id).order("created_at",{ascending:false}).limit(50);
    if(eventError) throw eventError;
    return json(200,{shipment:{...shipment,events:events||[]}});
  }catch(error){console.error("track:",error);return json(500,{error:"Tracking is temporarily unavailable."});}
}