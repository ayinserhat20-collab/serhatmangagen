import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { orderSchema } from "../lib/validation";
import { Plus, Trash2, ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";
import { cn } from "../lib/utils";

const STEPS = ["Kişisel Bilgiler", "Hikaye Detayları", "Karakterler", "Özet"];

export default function OrderWizard() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const packageType = (searchParams.get("package") as 'standard' | 'premium' | 'children') || 'standard';

  const { register, control, handleSubmit, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      packageType,
      customer: { fullName: "", phone: "", email: "", address: "" },
      story: { longText: "", preface: "", musicPreference: "", customMusicPreference: "", specialBox: false, highlights: [""], periods: [], locations: [""], isFiction: false, themes: [] },
      characters: [{ name: "", gender: "", age: "", physical: "", personality: "", hair: "", eyes: "", photos: [] }]
    }
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: "story.highlights" as any });
  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({ control, name: "story.locations" as any });
  const { fields: characterFields, append: appendCharacter, remove: removeCharacter } = useFieldArray({ control, name: "characters" as any });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 0) fieldsToValidate = ["customer"];
    if (step === 1) fieldsToValidate = ["story"];
    if (step === 2) fieldsToValidate = ["characters"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(s => s + 1);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const photosArray: File[] = [];

      data.characters.forEach((char: any) => {
        if (char.photos && char.photos.length > 0) {
          Array.from(char.photos as FileList).forEach((file: File) => {
            photosArray.push(file);
          });
        }
        delete char.photos; // Remove from JSON payload
      });

      formData.append("orderData", JSON.stringify(data));
      photosArray.forEach(file => {
        formData.append("photos", file);
      });

      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        navigate(`/checkout?orderId=${result.id}`);
      }
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {STEPS.map((s, i) => (
            <div key={i} className={cn(
              "text-xs font-bold uppercase tracking-widest transition-colors",
              step >= i ? "text-slate-900" : "text-slate-300"
            )}>
              {s}
            </div>
          ))}
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-900"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-8">Kişisel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Ad Soyad</label>
                  <input {...register("customer.fullName")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900/5 outline-none" placeholder="Örn: Ahmet Yılmaz" />
                  {errors.customer?.fullName && <p className="text-red-500 text-xs mt-1">{errors.customer.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Telefon</label>
                  <input {...register("customer.phone")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900/5 outline-none" placeholder="05xx..." />
                  {errors.customer?.phone && <p className="text-red-500 text-xs mt-1">{errors.customer.phone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">E-posta</label>
                  <input {...register("customer.email")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900/5 outline-none" placeholder="ahmet@example.com" />
                  {errors.customer?.email && <p className="text-red-500 text-xs mt-1">{errors.customer.email.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Teslimat Adresi</label>
                  <textarea {...register("customer.address")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900/5 outline-none h-32" placeholder="Mahalle, Sokak, No, İlçe/İl..." />
                  {errors.customer?.address && <p className="text-red-500 text-xs mt-1">{errors.customer.address.message}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold mb-8">Hikayeni Yaz</h2>

              <div>
                <label className="block text-sm font-semibold mb-2">Hikaye Metni (Detaylı)</label>
                <textarea {...register("story.longText")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900/5 outline-none h-48" placeholder="Hayat hikayeni, anılarını veya mangaya dönüştürmek istediğin olayları yaz..." />
                {errors.story?.longText && <p className="text-red-500 text-xs mt-1">{errors.story.longText.message}</p>}
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xl font-bold mb-4">Önsöz</h3>
                <label className="block text-sm font-semibold mb-2">Kişisel Mesajın (İsteğe Bağlı)</label>
                <textarea {...register("story.preface")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900/5 outline-none h-24" placeholder="Kitabın başında yer almasını istediğin mesajı yaz (isteğe bağlı)" />
              </div>

              {packageType === 'premium' && (
                <div className="space-y-8 pt-6 border-t border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Müzik Tercihi</h3>
                    <label className="block text-sm font-semibold mb-4">Şarkı Türü Tercihi</label>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {["Romantik", "Dram", "Mutlu / Enerjik", "Hüzünlü", "Kişisel seçim"].map(genre => (
                        <label key={genre} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-slate-900 has-[:checked]:bg-slate-900/5">
                          <input type="radio" value={genre} {...register("story.musicPreference")} className="hidden" />
                          <span className="text-sm font-bold">{genre}</span>
                        </label>
                      ))}
                    </div>
                    {watch("story.musicPreference") === "Kişisel seçim" && (
                      <input {...register("story.customMusicPreference")} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900/5 outline-none" placeholder="Lütfen istediğiniz şarkı türünü veya ismini yazın..." />
                    )}
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h4 className="font-bold text-slate-900 mb-2">QR Kart İçeriği</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• <strong>Ön Yüz QR:</strong> Mangadan oluşturulmuş sinematik video editine yönlendirir.</li>
                      <li>• <strong>Arka Yüz QR:</strong> Size özel seçilmiş kişisel şarkıya yönlendirir.</li>
                    </ul>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-slate-900 has-[:checked]:bg-slate-900/5">
                      <input type="checkbox" {...register("story.specialBox")} className="w-5 h-5 accent-slate-900" />
                      <span className="font-bold">Özel Kutulu Gönderim</span>
                    </label>
                    {watch("story.specialBox") && (
                      <p className="text-sm text-slate-500 mt-2 ml-2">Premium paket özel tasarımlı kutu ile gönderilir.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold mb-4">Temalar</label>
                  <div className="flex flex-wrap gap-2">
                    {["Aşk", "Dram", "Başarı", "Korku", "Macera", "Komedi"].map(theme => (
                      <label key={theme} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full cursor-pointer hover:bg-slate-100 transition-colors has-[:checked]:bg-slate-900 has-[:checked]:text-white">
                        <input type="checkbox" value={theme} {...register("story.themes")} className="hidden" />
                        <span className="text-sm font-medium">{theme}</span>
                      </label>
                    ))}
                  </div>
                  {errors.story?.themes && <p className="text-red-500 text-xs mt-1">{errors.story.themes.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-4">Zaman Dilimleri</label>
                  <div className="flex flex-wrap gap-2">
                    {["Çocukluk", "Lise", "Üniversite", "İş Hayatı", "Gelecek"].map(period => (
                      <label key={period} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full cursor-pointer hover:bg-slate-100 transition-colors has-[:checked]:bg-slate-900 has-[:checked]:text-white">
                        <input type="checkbox" value={period} {...register("story.periods")} className="hidden" />
                        <span className="text-sm font-medium">{period}</span>
                      </label>
                    ))}
                  </div>
                  {errors.story?.periods && <p className="text-red-500 text-xs mt-1">{errors.story.periods.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-4">Önemli Olaylar</label>
                <div className="space-y-3">
                  {highlightFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input {...register(`story.highlights.${index}` as any)} className="flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Örn: İlk tanışma anı..." />
                      <button type="button" onClick={() => removeHighlight(index)} className="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendHighlight("")} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"><Plus size={16} /> Olay Ekle</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-4">Tür</label>
                <div className="flex gap-4">
                  <label className="flex-1 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-slate-900 has-[:checked]:bg-slate-900/5">
                    <input type="radio" value="false" {...register("story.isFiction", { setValueAs: v => v === "true" })} className="hidden" defaultChecked />
                    <span className="font-bold block">Gerçek Hikaye</span>
                    <span className="text-xs text-slate-500">Yaşanmış olaylara dayanır.</span>
                  </label>
                  <label className="flex-1 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-slate-900 has-[:checked]:bg-slate-900/5">
                    <input type="radio" value="true" {...register("story.isFiction", { setValueAs: v => v === "true" })} className="hidden" />
                    <span className="font-bold block">Kurgu</span>
                    <span className="text-xs text-slate-500">Hayal gücüne dayalıdır.</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Karakterler</h2>
                <button
                  type="button"
                  onClick={() => appendCharacter({ name: "", gender: "", age: "", physical: "", personality: "", hair: "", eyes: "", photos: [] })}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800"
                >
                  <Plus size={16} /> Karakter Ekle
                </button>
              </div>

              <div className="space-y-12">
                {characterFields.map((field, index) => (
                  <div key={field.id} className="p-6 border border-slate-100 bg-slate-50/50 rounded-2xl relative">
                    {index > 0 && (
                      <button type="button" onClick={() => removeCharacter(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={18} /></button>
                    )}
                    <h3 className="font-bold mb-6 text-slate-400 uppercase tracking-widest text-xs">Karakter #{index + 1}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase mb-2">İsim</label>
                        <input {...register(`characters.${index}.name` as any)} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
                        {errors.characters?.[index]?.name && <p className="text-red-500 text-[10px] mt-1">{(errors.characters[index] as any).name?.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-2">Cinsiyet</label>
                        <select {...register(`characters.${index}.gender` as any)} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none">
                          <option value="">Seçiniz</option>
                          <option value="Erkek">Erkek</option>
                          <option value="Kadın">Kadın</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                        {errors.characters?.[index]?.gender && <p className="text-red-500 text-[10px] mt-1">{(errors.characters[index] as any).gender?.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-2">Yaş</label>
                        <input {...register(`characters.${index}.age` as any)} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
                        {errors.characters?.[index]?.age && <p className="text-red-500 text-[10px] mt-1">{(errors.characters[index] as any).age?.message}</p>}
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase mb-2">Fiziksel Özellikler</label>
                        <textarea {...register(`characters.${index}.physical` as any)} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none h-20" placeholder="Boy, kilo, giyim tarzı vb." />
                        {errors.characters?.[index]?.physical && <p className="text-red-500 text-[10px] mt-1">{(errors.characters[index] as any).physical?.message}</p>}
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase mb-2">Kişilik Özellikleri</label>
                        <textarea {...register(`characters.${index}.personality` as any)} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none h-20" placeholder="Sert, neşeli, utangaç vb." />
                        {errors.characters?.[index]?.personality && <p className="text-red-500 text-[10px] mt-1">{(errors.characters[index] as any).personality?.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-2">Saç Rengi</label>
                        <input {...register(`characters.${index}.hair` as any)} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
                        {errors.characters?.[index]?.hair && <p className="text-red-500 text-[10px] mt-1">{(errors.characters[index] as any).hair?.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-2">Göz Rengi</label>
                        <input {...register(`characters.${index}.eyes` as any)} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
                        {errors.characters?.[index]?.eyes && <p className="text-red-500 text-[10px] mt-1">{(errors.characters[index] as any).eyes?.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-2">Referans Fotoğraflar</label>
                        <div className="relative group">
                          <input type="file" multiple accept="image/*" {...register(`characters.${index}.photos` as any)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div className="p-3 bg-white border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                            <Upload size={16} />
                            <span className="text-xs font-bold">
                              {watch(`characters.${index}.photos` as any)?.length > 0
                                ? `${watch(`characters.${index}.photos` as any).length} dosya seçildi`
                                : "Yükle (Max 5)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold mb-8">Sipariş Özeti</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Müşteri</h3>
                  <p className="font-bold">{watch("customer.fullName")}</p>
                  <p className="text-sm text-slate-500">{watch("customer.phone")}</p>
                  <p className="text-sm text-slate-500">{watch("customer.email")}</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Hikaye</h3>
                  <p className="text-sm line-clamp-3 mb-2">{watch("story.longText")}</p>
                  <div className="flex flex-wrap gap-1">
                    {watch("story.themes").map(t => <span key={t} className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </div>

                <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Paket Bilgileri</h3>
                  <p className="text-sm text-slate-500">Standart üretim - Teslimat: 3–5 iş günü</p>
                </div>

                <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Karakterler ({watch("characters").length})</h3>
                  <div className="flex flex-wrap gap-4">
                    {watch("characters").map((c, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
                        <div>
                          <p className="text-sm font-bold">{c.name || "İsimsiz"}</p>
                          <p className="text-[10px] text-slate-400">{c.gender}, {c.age} yaş</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-2xl">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  <strong>Not:</strong> Ödeme adımından sonra siparişiniz doğrudan üretim sürecine alınacaktır.
                  Bu ürün kişiye özel üretildiği için iade edilemez.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} /> Geri
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all"
            >
              Devam Et <ArrowRight size={20} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Gönderiliyor..." : "Siparişi Tamamla"} <Check size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
