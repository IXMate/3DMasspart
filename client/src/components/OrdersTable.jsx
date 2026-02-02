import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      const res = await fetch(`${API_BASE}/api/orders-summary`);
      const data = await res.json();

      //console.log("📦 RAW API RESPONSE:", data);

      if (!res.ok) throw new Error(data?.message || "โหลดไม่ได้");
      setOrders(data.orders || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  const statusText = (s) => {
    const n = Number(s);
    if (n >= 3) return "ชำระแล้ว";
    if (n > 1) return "รอดำเนินการ";
    return "ยังไม่จ่าย";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Orders Summary</h2>
      {/*<div style={{ opacity: 0.7, marginBottom: 8 }}>API: {API_BASE}</div>*/}
      {err && <div style={{ color: "tomato", marginBottom: 8 }}>Error: {err}</div>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#111", color: "#fff" }}>
            <th>Order Code</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr
              key={`${o.ordercode ?? "no"}-${o.updated_at ?? i}`}  // ✅ key ดีขึ้น
              style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}
            >
              <td>{o.ordercode}</td>
              <td>{o.payment_name}</td>
              <td>{statusText(o.status)}</td>
              <td>{o.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
