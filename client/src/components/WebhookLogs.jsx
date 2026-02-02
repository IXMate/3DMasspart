import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function WebhookLogs() {
  const [logs, setLogs] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      const res = await fetch(`${API_BASE}/api/webhook-logs`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "โหลดไม่ได้");
      setLogs(data.logs || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <h3>Webhook Logs</h3>
      {err && <div style={{ color: "tomato" }}>{err}</div>}
      {logs.map((x, i) => (
        <pre key={x.time ?? i} style={{ background: "#111", color: "#fff", padding: 10 }}>
          {JSON.stringify(x, null, 2)}
        </pre>
      ))}
    </div>
  );
}
