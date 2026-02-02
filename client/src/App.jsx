import { Routes, Route } from "react-router-dom";

import Canvas from "./canvas";
import Customizer from "./pages/Customizer";
import Home from "./pages/Home";

import WebhookLogs from "./components/WebhookLogs";
import OrdersTable from "./components/OrdersTable";

function MainSite() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Customizer />
      {/* ❌ ห้ามมี OrdersTable/WebhookLogs ในหน้านี้ */}
    </main>
  );
}

function AdminPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin</h1>
      <OrdersTable />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
