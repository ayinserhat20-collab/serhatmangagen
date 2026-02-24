import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold mb-4">MangaGen</h3>
          <p className="text-slate-500 max-w-sm">
            Hayat hikayenizi profesyonel bir manga kitabına dönüştürüyoruz. 
            Anılarınız ölümsüzleşsin.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-900">Kurumsal</h4>
          <ul className="space-y-2 text-slate-500 text-sm">
            <li><Link to="/legal/privacy" className="hover:text-slate-900">Gizlilik Politikası</Link></li>
            <li><Link to="/legal/kvkk" className="hover:text-slate-900">KVKK Aydınlatma Metni</Link></li>
            <li><Link to="/legal/terms" className="hover:text-slate-900">Kullanım Şartları</Link></li>
            <li><Link to="/legal/return" className="hover:text-slate-900">İade Şartları</Link></li>
            <li><Link to="/legal/distance-sales" className="hover:text-slate-900">Mesafeli Satış Sözleşmesi</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-900">İletişim</h4>
          <p className="text-slate-500 text-sm">destek@mangagen.com</p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Instagram</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Twitter</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs">
        © 2024 MangaGen. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
