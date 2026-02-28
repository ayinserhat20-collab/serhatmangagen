import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-100 py-4 px-6 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:bg-slate-800 transition-colors">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">MangaGen</span>
        </Link>
      </div>
    </nav>
  );
}
