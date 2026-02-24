import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Package, Truck, CheckCircle2, Clock, CreditCard } from "lucide-react";
import { Order } from "../types";
import { cn } from "../lib/utils";

const STATUS_STEPS = [
  { id: "received", label: "Alındı", icon: Clock },
  { id: "preparing", label: "Hazırlanıyor", icon: Package },
  { id: "in_production", label: "Üretimde", icon: CheckCircle2 },
  { id: "shipped", label: "Kargoda", icon: Truck },
  { id: "delivered", label: "Teslim Edildi", icon: CheckCircle2 }
];

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-20 text-center">Yükleniyor...</div>;
  if (!order) return <div className="p-20 text-center">Sipariş bulunamadı.</div>;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Sipariş Takibi</h1>
        <p className="text-slate-500">Sipariş No: <span className="font-mono font-bold text-slate-900">{order.id}</span></p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 mb-8 shadow-sm">
        <div className="flex justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />
          <motion.div 
            className="absolute top-5 left-0 h-0.5 bg-green-500 -z-10"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />

          {STATUS_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  isCompleted ? "bg-green-500 text-white" : "bg-white border-2 border-slate-100 text-slate-300",
                  isCurrent && "ring-4 ring-green-100 scale-110"
                )}>
                  <Icon size={18} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase mt-3 tracking-widest",
                  isCompleted ? "text-slate-900" : "text-slate-300"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h2 className="font-bold mb-6 text-lg">Sipariş Özeti</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Müşteri</span>
                <span className="font-bold text-sm">{order.customer.fullName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Tema</span>
                <span className="font-bold text-sm">{order.story.themes.join(", ")}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Karakter Sayısı</span>
                <span className="font-bold text-sm">{order.characters.length}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500 text-sm">Ödeme Durumu</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : 
                  order.paymentStatus === "pending_review" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"
                )}>
                  {order.paymentStatus === "paid" ? "Ödendi" : 
                   order.paymentStatus === "pending_review" ? "İncelemede" : "Ödenmedi"}
                </span>
              </div>
            </div>
          </div>

          {order.adminNote && (
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8">
              <h3 className="font-bold text-blue-900 mb-2">Yönetici Notu</h3>
              <p className="text-blue-800 text-sm leading-relaxed">{order.adminNote}</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8">
            <h3 className="font-bold mb-4">Yardıma mı ihtiyacınız var?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Siparişinizle ilgili her türlü soru için destek ekibimize ulaşabilirsiniz.
            </p>
            <a href="mailto:destek@mangagen.com" className="block w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-center hover:bg-slate-100 transition-all">
              E-posta Gönder
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
