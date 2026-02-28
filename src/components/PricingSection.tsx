import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingSection() {
    const packages = [
        {
            title: "Standart Paket",
            badge: "En Uygun",
            isPopular: false,
            features: [
                "24–32 sayfa kişiye özel manga",
                "Size özel kapak tasarımı",
                "Siyah-beyaz manga iç sayfalar",
                "Kişisel önsöz (isteğe bağlı)",
                "Mini karakter kartı",
                "A5 kitap baskısı"
            ],
            buttonText: "Standart Paketi Seç"
        },
        {
            title: "Premium Paket",
            badge: "⭐ En Popüler",
            isPopular: true,
            features: [
                "48–64 sayfa detaylı manga",
                "Özel tasarlanmış premium kapak",
                "Parlak (laminasyonlu) kapak",
                "Mini karakter kartı",
                "Kişiye özel poster",
                "Çift taraflı QR kart:\n• Ön: Manga proje sayfası\n• Arka: Kişiye özel şarkı",
                "Mangadan oluşturulmuş kısa video edit",
                "Daha detaylı çizim ve hikâye işleme"
            ],
            buttonText: "Premium Paketi Seç"
        },
        {
            title: "Çocuklar İçin Hikaye Kitabı",
            badge: "Yeni",
            isPopular: false,
            features: [
                "Tam renkli görselli hikaye kitabı",
                "Çocuğunuzun ismine özel karakter",
                "Eğitici ve eğlenceli hikaye",
                "Renkli sayfalar",
                "20–32 sayfa",
                "Çocuk dostu çizim tarzı"
            ],
            buttonText: "Hikaye Kitabını Seç"
        }
    ];

    return (
        <section className="py-24 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                        Size Özel Paketler
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Hayalinizdeki eseri gerçeğe dönüştürmek için ihtiyacınıza ve bütçenize en uygun paketi seçin.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto md:items-center">
                    {packages.map((pkg, i) => (
                        <div
                            key={i}
                            className={`
                bg-white rounded-[2rem] p-8 md:p-10 flex flex-col justify-between
                transition-all duration-300 hover:-translate-y-2
                ${pkg.isPopular
                                    ? "shadow-2xl border-2 border-slate-900 md:scale-105 relative z-10"
                                    : "shadow-lg border border-slate-100 hover:shadow-xl"
                                }
              `}
                        >
                            {pkg.isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white text-sm font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg">
                                    {pkg.badge}
                                </div>
                            )}

                            <div>
                                {!pkg.isPopular && (
                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                        {pkg.badge}
                                    </span>
                                )}

                                <h3 className={`text-2xl font-bold mb-8 ${pkg.isPopular ? "mt-4" : ""}`}>
                                    {pkg.title}
                                </h3>

                                <ul className="space-y-5 mb-10">
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <CheckCircle2 className={`w-6 h-6 shrink-0 ${pkg.isPopular ? "text-slate-900" : "text-slate-400"}`} />
                                            <span className="text-slate-600 leading-relaxed whitespace-pre-line">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                to="/order"
                                className={`
                  w-full block text-center py-4 px-6 rounded-2xl font-bold text-lg transition-all
                  ${pkg.isPopular
                                        ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg"
                                        : "bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200"
                                    }
                `}
                            >
                                {pkg.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
