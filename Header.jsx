import { Link, NavLink } from "react-router-dom";
import { Globe2, Menu, PackageCheck } from "lucide-react";
import { useState } from "react";
export default function Header({ user, onSignOut }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="container nav-wrap">
      <Link className="brand" to="/"><span className="brand-mark"><PackageCheck size={22}/></span><span>GLOBAL EXPRESS<small>LOGISTICS</small></span></Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><Menu/></button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        <NavLink to="/#services" onClick={() => setOpen(false)}>Services</NavLink>
        <NavLink to="/#how-it-works" onClick={() => setOpen(false)}>How it works</NavLink>
        <NavLink to="/track" onClick={() => setOpen(false)}>Track shipment</NavLink>
        {user ? <><NavLink to="/dashboard" onClick={() => setOpen(false)}>My account</NavLink><button className="nav-signout" onClick={onSignOut}>Sign out</button></> : <><NavLink to="/login" onClick={() => setOpen(false)}>Log in</NavLink><Link className="button button-small" to="/register">Create account</Link></>}
      </nav>
      <div className="nav-country"><Globe2 size={16}/> Worldwide</div>
    </div>
  </header>;
}