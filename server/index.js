import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "50mb" }));

console.log("ENV CHECK:", process.env.OPENAI_API_KEY?.slice(0, 8));
console.log("KET API KEY CHECK:", process.env.KET_API_KEY?.slice(0, 6));

// 🔔 Webhook Logs
const webhookLogs = [];

// ✅ Ketshopweb Webhook Endpoint
app.post("/api/ketshopweb", (req, res) => {
  try {
    const incomingKey = req.header("X-KET-API-KEY");
    if (!incomingKey || incomingKey !== process.env.KET_API_KEY) {
      console.log("❌ Invalid API KEY");
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const payload = req.body;

    // ตอบ 200 ไว ๆ
    res.status(200).json({ ok: true });

    webhookLogs.unshift({
      time: new Date().toISOString(),
      event: payload?.event || payload?.type || "unknown",
      body: payload,
    });
    webhookLogs.splice(50);

    console.log("✅ Webhook received:", payload?.type || payload?.event);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    if (!res.headersSent) res.status(500).json({ ok: false });
  }
});

// ✅ ให้ React ดู log ได้
app.get("/api/webhook-logs", (req, res) => {
  res.json({ ok: true, logs: webhookLogs });
});

// ✅ ตารางสรุปออเดอร์ (ต้องอยู่ก่อน listen)
app.get("/api/orders-summary", (req, res) => {
  const orders = webhookLogs.map((log) => {
    const d = log.body?.data || {};
    return {
      ordercode: d.ordercode,
      payment_name: d.payment_name,
      status: d.status,
      updated_at: d.updated_at,
    };
  });

  res.json({ ok: true, orders });
});

// ✅ Health check
app.get("/health", (_, res) => res.json({ ok: true }));

// ✅ START SERVER (ไว้ท้ายสุด)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
