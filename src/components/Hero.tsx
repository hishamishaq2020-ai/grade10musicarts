import React from 'react';
import { Search, Sparkles, FileDown, Video, Music2, BookOpen } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExploreFirstLesson: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onExploreFirstLesson,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white border border-stone-800 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
        {/* Left Column (Desktop 7 cols): Text & Interactive Search */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 z-10">
          {/* Unboxed Metadata without pills */}
          <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
            <span>المنهج الدراسي المعتمد</span>
            <span aria-hidden="true">·</span>
            <span>الصف العاشر</span>
            <span aria-hidden="true">·</span>
            <span>الفصل الدراسي الأول</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight text-balance">
            منصة الفنون الموسيقية التعليمية المتكاملة
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            بوابة رقمية تفاعلية شاملة تضم الوحدات والدروس التسعة المقررة، بشرح نصي مفصل، عروض بوربوينت (PPTX) قابلة للتحميل، ومشغل فيديو مدمج لكل درس من روابط يوتيوب.
          </p>

          {/* Quick Search Bar */}
          <div className="relative max-w-lg">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن درس (مثل: مفتاح فا، سلم ري الصغير، فن المولد، فيردي...)"
              className="w-full pr-11 pl-4 py-3 bg-stone-800/90 text-white placeholder-stone-400 text-xs sm:text-sm rounded-2xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
            />
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreFirstLesson}
              className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>بدء الدرس الأول: مفتاح فا</span>
            </button>
            <a
              href="#curriculum-grid"
              className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-stone-700"
            >
              استعراض كافة الوحدات (3)
            </a>
          </div>
        </div>

        {/* Right Column (Desktop 5 cols): Rich Visual Image */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
          <img
            src="/src/assets/images/hero_music_grade10_1792836551401.jpg"
            alt="مفاتيح البيانو والمدرج الموسيقي لمفتاح فا"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-900 via-stone-900/40 to-transparent" />
          
          <div className="absolute bottom-4 right-4 left-4 p-3.5 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 text-xs text-stone-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <Music2 className="w-3.5 h-3.5" />
              <span>قواعد ونظريات · فن المولد · تاريخ وتذوق</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              مدمج به عازف نغمات تركيبي Web Audio وسلالم هارمونية وآلات عمانية شعبية
            </p>
          </div>
        </div>
      </div>

      {/* 4-KPI Row Strip below Hero */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-stone-800 divide-x divide-x-reverse divide-stone-800 bg-stone-950/60 text-center py-4 px-2">
        <div className="p-2">
          <span className="block text-xl sm:text-2xl font-black text-amber-400 tabular-nums">03</span>
          <span className="text-[11px] sm:text-xs text-stone-400">وحدات دراسية رسمية</span>
        </div>
        <div className="p-2">
          <span className="block text-xl sm:text-2xl font-black text-amber-400 tabular-nums">09</span>
          <span className="text-[11px] sm:text-xs text-stone-400">دروس بشرح نصي كامل</span>
        </div>
        <div className="p-2">
          <span className="block text-xl sm:text-2xl font-black text-amber-400 tabular-nums">09</span>
          <span className="text-[11px] sm:text-xs text-stone-400">عروض بوربوينت PPTX</span>
        </div>
        <div className="p-2">
          <span className="block text-xl sm:text-2xl font-black text-amber-400 tabular-nums">09</span>
          <span className="text-[11px] sm:text-xs text-stone-400">مشغلات فيديو يوتيوب</span>
        </div>
      </div>
    </div>
  );
};
