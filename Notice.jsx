import { AlertCircle, CheckCircle2 } from "lucide-react";
export default function Notice({ children, type = "info" }) {
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  return <div className={`notice ${type}`} role="status"><Icon size={18}/><span>{children}</span></div>;
}