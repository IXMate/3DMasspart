import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config(); // MUST be first

import dalleRoutes from "./routes/dalle.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "50mb" }));

console.log("ENV CHECK:", process.env.OPENAI_API_KEY?.slice(0, 8));

app.use("/api/dalle", dalleRoutes);

app.listen(8080, () => {
  console.log("✅ Server running on http://localhost:8080");
});
