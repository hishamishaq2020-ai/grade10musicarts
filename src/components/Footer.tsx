import React from 'react';
import { Music, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white py-12 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-sm block">منصة الفنون الموسيقية · الصف العاشر</span>
              <span className="text-xs text-stone-500">الفصل الدراسي الأول · مناهج سلطنة عمان الرسمية</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-500">
            <span>الوحدة 1: قواعد ونظريات</span>
            <span aria-hidden="true">·</span>
            <span>الوحدة 2: تعريف فن المولد</span>
            <span aria-hidden="true">·</span>
            <span>الوحدة 3: تاريخ وتذوق</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} مادة الفنون الموسيقية - المنصة التعليمية الرقمية المساعدة للطلاب والمعلمين.</p>
          <div className="flex items-center gap-2">
            <span>جميع عروض البوربوينت مهيأة بصيغة PPTX ومقاطع الفيديو مدمجة وقابلة للتخصيص</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
