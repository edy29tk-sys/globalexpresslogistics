import { Link } from "react-router-dom";
import { Globe2, Mail, MapPin, Phone } from "lucide-react";
export default function Footer() {
  return <footer className="footer"><div className="container footer-grid">
    <div><Link className="brand footer-brand" to="/"><span className="brand-mark"><Globe2/></span><span>GLOBAL EXPRESS<small>LOGISTICS</small></span></Link><p>Connecting people and businesses through dependable shipping solutions.</p></div>
    <div><h4>Explore</h4><Link to="/#services">Our services</Link><Link to="/track">Track a shipment</Link><Link to="/ship">Ship with us</Link></div>
    <div><h4>Support</h4><a href="mailto:support@example.com"><Mail size={15}/> Customer support</a><span><Phone size={15}/> Contact details pending</span><span><MapPin size={15}/> International service network</span></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Global Express Logistics.</span><span>Shipping without borders.</span></div></footer>;
}