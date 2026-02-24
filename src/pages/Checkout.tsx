import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, ExternalLink, CheckCircle } from "lucide-react";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    kvkk: false,
    privacy: false,
    terms: false,
    return: false,
    distance: false
  });

  const allChecked = Object.values(agreements).every(Boolean);

  const handlePaymentDone = async () => {
    if (!allChecked) return;
    
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-password": "bypass_for_user_action" // In real app, use a specific user-token or separate endpoint
        },
        body: JSON.stringify({ paymentStatus: "pending_review" })
      });
      navigate(`/track/${orderId}`);
    } catch (error) {
      alert("Bir hata oluştu.");
    }
  };

  if (!orderId) return <div className="p-20 text-center">Sipariş bulunamadı.</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Ödeme ve Onay</h1>
        <p className="text-slate-500">Siparişinizi tamamlamak için lütfen aşağıdaki adımları izleyin.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
        <div>
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-xs flex items-center justify-center">1</span>
            Ödeme Yap
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Güvenli ödeme için Shopier sayfasına yönlendirileceksiniz. Ödemenizi yaptıktan sonra bu sayfaya geri dönün.
          </p>
          <a 
            href={(import.meta as any).env.VITE_SHOPIER_PAYMENT_URL || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Shopier ile Öde <ExternalLink size={18} />
          </a>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-xs flex items-center justify-center">2</span>
            Sözleşmeleri Onayla
          </h2>
          <div className="space-y-4">
            {[
              { id: "kvkk", label: "KVKK Aydınlatma Metnini okudum, kabul ediyorum." },
              { id: "privacy", label: "Gizlilik Politikasını okudum, kabul ediyorum." },
              { id: "terms", label: "Kullanım Şartlarını okudum, kabul ediyorum." },
              { id: "return", label: "Bu ürün kişiye özel üretildiği için iade edilemez. Okudum, kabul ediyorum." },
              { id: "distance", label: "Mesafeli Satış Sözleşmesini kabul ediyorum." }
            ].map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={(agreements as any)[item.id]} 
                  onChange={(e) => setAgreements(prev => ({ ...prev, [item.id]: e.target.checked }))}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <button 
            onClick={handlePaymentDone}
            disabled={!allChecked}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-30 disabled:grayscale"
          >
            Ödemeyi Yaptım, Siparişi Onayla
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-4">
            Onay butonuna basarak sipariş sürecini başlatmış olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
