import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OrderWizard from "./pages/OrderWizard";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import AdminPanel from "./pages/AdminPanel";
import Privacy from "./pages/legal/Privacy";
import KVKK from "./pages/legal/KVKK";
import Terms from "./pages/legal/Terms";
import ReturnPolicy from "./pages/legal/ReturnPolicy";
import DistanceSales from "./pages/legal/DistanceSales";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/order" element={<OrderWizard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track/:orderId" element={<TrackOrder />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/kvkk" element={<KVKK />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/return" element={<ReturnPolicy />} />
            <Route path="/legal/distance-sales" element={<DistanceSales />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
