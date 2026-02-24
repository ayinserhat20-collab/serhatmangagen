import { useState, useEffect } from "react";
import { Order, OrderStatus, PaymentStatus } from "../types";
import { cn } from "../lib/utils";
import { Search, Filter, ExternalLink, Save, Lock } from "lucide-react";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    fetchOrders();
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-password": password }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
        setSelectedOrder(updated);
      }
    } catch (error) {
      alert("Güncelleme hatası");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={24} className="text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">Yönetici Girişi</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none mb-4"
            placeholder="Şifre"
          />
          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Sipariş Yönetimi</h1>
        <button onClick={fetchOrders} className="text-sm font-bold text-slate-500 hover:text-slate-900">Yenile</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Order List */}
        <div className="lg:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {orders.map(order => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={cn(
                "w-full text-left p-6 border rounded-2xl transition-all",
                selectedOrder?.id === order.id ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono opacity-50">{order.id.slice(0, 8)}</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                  selectedOrder?.id === order.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {order.status}
                </span>
              </div>
              <p className="font-bold">{order.customer.fullName}</p>
              <p className={cn("text-xs mt-1", selectedOrder?.id === order.id ? "text-white/60" : "text-slate-400")}>
                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </button>
          ))}
        </div>

        {/* Order Detail */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-50">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedOrder.customer.fullName}</h2>
                  <p className="text-sm text-slate-500">{selectedOrder.customer.email} • {selectedOrder.customer.phone}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrder(selectedOrder.id, { status: e.target.value as OrderStatus })}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="received">Alındı</option>
                    <option value="preparing">Hazırlanıyor</option>
                    <option value="in_production">Üretimde</option>
                    <option value="shipped">Kargoda</option>
                    <option value="delivered">Teslim Edildi</option>
                  </select>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => updateOrder(selectedOrder.id, { paymentStatus: e.target.value as PaymentStatus })}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="unpaid">Ödenmedi</option>
                    <option value="pending_review">İncelemede</option>
                    <option value="paid">Ödendi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Hikaye Detayı</h3>
                  <p className="text-sm leading-relaxed mb-4">{selectedOrder.story.longText}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.story.themes.map(t => <span key={t} className="px-2 py-1 bg-slate-100 rounded-full text-[10px] font-bold">{t}</span>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Teslimat Adresi</h3>
                  <p className="text-sm leading-relaxed">{selectedOrder.customer.address}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Karakterler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.characters.map((char, i) => (
                    <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                      <p className="font-bold text-sm mb-1">{char.name}</p>
                      <p className="text-xs text-slate-500 mb-2">{char.gender}, {char.age} yaş</p>
                      <div className="text-[10px] text-slate-400 space-y-1">
                        <p><strong>Fiziksel:</strong> {char.physical}</p>
                        <p><strong>Kişilik:</strong> {char.personality}</p>
                        <p><strong>Saç/Göz:</strong> {char.hair} / {char.eyes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Yönetici Notu</h3>
                <textarea
                  defaultValue={selectedOrder.adminNote}
                  onBlur={(e) => updateOrder(selectedOrder.id, { adminNote: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none h-24 text-sm"
                  placeholder="Müşteriye görünecek not..."
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 font-bold">
              Detayları görmek için bir sipariş seçin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
