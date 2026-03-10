import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingSection() {
    const packages = [
        {
            title: "Standart Manga Paketi",
            id: "standard",
            badge: "En Uygun",
            isPopular: false,
            description: "Gerçek hikayenizi manga tarzında anlatan kişiye özel kitap.",
            features: [
                "Kişiye özel manga hikayesi",
                "24 – 32 sayfa manga",
                "A5 kitap formatı",
                "Özel kapak tasarımı"
            ],
            buttonText: "Sipariş Ver"
        },
        {
            title: "Premium Manga Paketi",
            id: "premium",
            badge: "⭐ En Popüler",
            isPopular: true,
            description: "Hikayenizi koleksiyonluk premium bir manga kitabına dönüştürün.",
            features: [
                "Kişiye özel manga hikayesi",
                "24 – 32 sayfa manga",
                "Özel kapak tasarımı",
                "Kitap için özel yazılmış ön söz",
                "Hikayeye özel poster",
                "Seçtiğiniz şarkıya özel QR kod kartı",
                "Kişiye özel kartvizit"
            ],
            buttonText: "Sipariş Ver"
        },
        {
            title: "Çocuk Masal Kitabı",
            id: "children",
            badge: "Yeni",
            isPopular: false,
            description: "Çocuğunuz için hazırlanmış eğlenceli ve boyamalı kişiye özel masal kitabı.",
            features: [
                "Çocuklara özel masal kitabı",
                "20 – 30 sayfa",
                "A4 kitap formatı",
                "Boyama sayfaları içeren hikaye",
                "Eğlenceli ve öğretici sahneler",
                "Çocuk dostu çizim tarzı"
            ],
            buttonText: "Sipariş Ver"
        }
    ];

    return (
        <section className="py-24 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                        Paketler
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

                                <h3 className={`text-2xl font-bold mb-2 ${pkg.isPopular ? "mt-4" : ""}`}>
                                    {pkg.title}
                                </h3>

                                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                    {pkg.description}
                                </p>

                                <div className="mb-8 flex flex-col items-start gap-1">
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md inline-block">
                                        Kargo Dahil
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium">
                                        Fiyata kargo dahildir.
                                    </span>
                                </div>

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
                                to={`/order?package=${pkg.id}`}
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
