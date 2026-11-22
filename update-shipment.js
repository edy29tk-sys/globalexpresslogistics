import { requireAdmin } from "./_lib/supabase.js";
import { json, methodNotAllowed } from "./_lib/http.js";
const allowed = ["Shipment created","Label / processing","Picked up","In transit","Out for delivery","Delivered","On hold","Cancelled"];
export async function handler(event) {
  if(event.httpMethod!=="POST") return methodNotAllowed(["POST"]);
  const auth=await requireAdmin(event);
  if(auth.error) return json(403,{error:auth.error});
  let body;try{body=JSON.parse(event.body||"{}");}catch{return json(400,{error:"Invalid JSON body."});}
  const {shipmentId,status,description}=body;
  if(!shipmentId || !allowed.includes(status)) return json(400,{error:"A valid shipmentId and status are required."});
  try{
    const {data,error}=await auth.db.from("shipments").update({status,updated_at:new Date().toISOString()}).eq("id",shipmentId).select("id,tracking_number,status").single();
    if(error) throw error;
    const {error:eventError}=await auth.db.from("shipment_events").insert({shipment_id:shipmentId,status,description:String(description||`Status changed to ${status}`).slice(0,500)});
    if(eventError) throw eventError;
    return json(200,{shipment:data});
  }catch(error){console.error("update-shipment:",error);return json(500,{error:"Unable to update shipment status."});}
}