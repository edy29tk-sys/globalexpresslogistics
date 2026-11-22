import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, PackageCheck, MapPin, CalendarDays } from "lucide-react";
import { callFunction } from "../lib/api";
import Notice from "../components/Notice";
const steps = ["Shipment created","Label / processing","Picked up","In transit","Out for delivery","Delivered"];
export default function Track() {
  const [params] = useSearchParams(); const [number,setNumber] = useState(params.get("number") || "");
  const [result,setResult] = useState(null); const [error,setError] = useState(""); const [loading,setLoading] = useState(false);
  async function lookup(value = number) { setLoading(true); setError(""); setResult(null); try { const data = await callFunction(`track?trackingNumber=${encodeURIComponent(value.trim())}`); setResult(data.shipment); } catch(e) { setError(e.message); } finally { setLoading(false); } }
  useEffect(() => { if(params.get("number")) lookup(params.get("number")); }, []);
  return <main className="page-shell"><div className="container narrow"><div className="page-title"><span className="eyebrow">SHIPMENT VISIBILITY</span><h1>Track your package.</h1><p>Enter your Global Express Logistics tracking number to view the latest available shipment information.</p></div>
    <form className="lookup-box" onSubmit={e=>{e.preventDefault();lookup()}}><label htmlFor="tracking">Tracking number</label><div className="lookup-row"><input id="tracking" value={number} onChange={e=>setNumber(e.target.value)} placeholder="Example: GEX-2026-ABC123" required/><button className="button" disabled={loading}>{loading?"Searching...":<><Search size={17}/> Track</>}</button></div></form>
    {error && <Notice type="error">{error}</Notice>}
    {result && <section className="tracking-result"><div className="result-head"><div><span className="eyebrow">TRACKING NUMBER</span><h2>{result.tracking_number}</h2></div><span className="status-pill">{result.status}</span></div><div className="result-summary"><div><MapPin/><span><small>Destination</small><strong>{result.destination_city}, {result.destination_country}</strong></span></div><div><CalendarDays/><span><small>Estimated delivery</small><strong>{result.estimated_delivery || "Not yet available"}</strong></span></div></div><h3>Shipment progress</h3><div className="timeline">{(result.events || []).map((event,i)=><div className="timeline-item" key={event.id || i}><span className="timeline-dot"/><div><strong>{event.status}</strong><p>{event.description || "Shipment status updated."}</p><small>{new Date(event.created_at).toLocaleString()}</small></div></div>)}</div><p className="fine-print">Tracking reflects updates entered into the Global Express Logistics system. Carrier scans and live carrier integrations are not enabled unless separately connected.</p></section>}
  </div></main>;
}