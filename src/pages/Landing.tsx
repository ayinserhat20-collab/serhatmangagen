import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CheckCircle2, Star, MessageSquare, Zap } from "lucide-react";
import PricingSection from "../components/PricingSection";

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Hayat Hikayeni <br />
              <span className="text-slate-500">Mangaya Dönüştür.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-8 max-w-lg leading-relaxed">
              Korku, aşk, dram veya başarı... Senin hikayen, senin karakterlerin.
              Profesyonel çizerlerimizle anılarını bir sanat eserine çeviriyoruz.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#how-it-works"
                className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-800 transition-all hover:scale-105"
              >
                Nasıl Çalışır?
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative group">
              <img
                src="https://picsum.photos/seed/anime-girl/800/1000"
                alt="Manga Illustration"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-slate-200 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-300 rounded-full blur-3xl opacity-30" />
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-slate-500">Sadece 3 adımda kendi manga kitabına sahip ol.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Hikayeni Anlat", desc: "Formu doldurarak hikayeni ve karakterlerini detaylıca bize ilet." },
              { step: "02", title: "Üretim Süreci", desc: "Hikayen profesyonel çizerlerimiz tarafından doğrudan manga sayfalarına dökülür." },
              { step: "03", title: "Kitabın Hazır", desc: "Tamamlanan çizimler kitap haline getirilir ve adresine gönderilir." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-4xl font-black text-slate-100 mb-4 block">{item.step}</span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Sıkça Sorulan Sorular</h2>
        <div className="space-y-6">
          {[
            { q: "Kitabım kaç sayfa olacak?", a: "Seçtiğiniz pakete göre 20 ile 64 sayfa arasında değişmektedir. Detaylar için Size Özel Paketler bölümünü inceleyebilirsiniz." },
            { q: "Kendi fotoğraflarımı yükleyebilir miyim?", a: "Evet, karakter tasarımları için referans fotoğraflarınızı yüklemeniz gerekmektedir." },
            { q: "Teslimat süresi ne kadar?", a: "Çizim ve baskı süreci ortalama 3–5 iş günü sürmektedir." },
            { q: "Hikayem gizli kalacak mı?", a: "Tüm hikayeleriniz ve fotoğraflarınız gizlilik politikamız gereği korunmaktadır." },
            { q: "Hangi ödeme yöntemleri geçerli?", a: "Shopier üzerinden tüm kredi ve banka kartları ile güvenle ödeme yapabilirsiniz." },
            { q: "İade yapabilir miyim?", a: "Bu ürün kişiye özel üretildiği için iade edilemez." }
          ].map((faq, i) => (
            <div key={i} className="border-b border-slate-100 pb-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-slate-400" />
                {faq.q}
              </h3>
              <p className="text-slate-500 pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
