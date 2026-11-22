import { useEffect,useState } from "react";
import { Routes,Route,Navigate } from "react-router-dom";
import { supabase,supabaseReady } from "./lib/supabase";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Track from "./pages/Track";
import Auth from "./pages/Auth";
import Ship from "./pages/Ship";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import Notice from "./components/Notice";
function Protected({user,children}) { return user ? children : <Navigate to="/login" replace/>; }
export default function App(){
 const [user,setUser]=useState(null);const [role,setRole]=useState("customer");const [ready,setReady]=useState(false);
 useEffect(()=>{if(!supabaseReady){setReady(true);return;}supabase.auth.getSession().then(async({data})=>{setUser(data.session?.user??null);if(data.session?.user){const {data:p}=await supabase.from("profiles").select("role").eq("id",data.session.user.id).single();setRole(p?.role||"customer");}setReady(true);});const {data:{subscription}}=supabase.auth.onAuthStateChange(async(_event,session)=>{setUser(session?.user??null);if(session?.user){const {data:p}=await supabase.from("profiles").select("role").eq("id",session.user.id).single();setRole(p?.role||"customer");}else setRole("customer");});return()=>subscription.unsubscribe();},[]);
 async function signOut(){if(supabaseReady)await supabase.auth.signOut();}
 if(!ready)return <div className="loading-screen">Loading Global Express Logistics…</div>;
 return <><Header user={user} onSignOut={signOut}/>{!supabaseReady&&<div className="config-banner">Preview mode: { "Add Supabase environment variables to enable accounts, saved shipments and live tracking."}</div>}<Routes><Route path="/" element={<Home/>}/><Route path="/track" element={<Track/>}/><Route path="/login" element={user?<Navigate to="/dashboard"/>:<Auth mode="login"/>}/><Route path="/register" element={user?<Navigate to="/dashboard"/>:<Auth mode="register"/>}/><Route path="/ship" element={<Ship user={user}/>}/><Route path="/dashboard" element={<Protected user={user}><Dashboard user={user}/></Protected>}/><Route path="/admin" element={<Protected user={user}>{role==="admin"?<Admin user={user}/>:<main className="page-shell container"><Notice type="error">Administrator access is required.</Notice></main>}</Protected>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes><Footer/></>;
}