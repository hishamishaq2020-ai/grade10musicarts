import React from 'react';
import { Music, Award, Users, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white py-12 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-sm block">منصة الفنون الموسيقية · الصف العاشر</span>
              <span className="text-xs text-stone-500">الفصل الدراسي الأول · مناهج سلطنة عمان الرسمية</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
            <span>الوحدة 1: قواعد ونظريات</span>
            <span aria-hidden="true">·</span>
            <span>الوحدة 2: تعريف فن المولد</span>
            <span aria-hidden="true">·</span>
            <span>الوحدة 3: تاريخ وتذوق</span>
          </div>
        </div>

        {/* Student Developers & Copyright Highlight Banner */}
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-stone-50 to-amber-50/40 border border-amber-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Users className="w-4 h-4 text-amber-700" />
                <span>إعداد وبرمجة وتطوير المنصة</span>
              </div>
              <h4 className="text-base font-black text-stone-900">
                حقوق النشر والملكية الفكرية لطلاب الصف العاشر
              </h4>
              <p className="text-xs text-stone-600">
                مشروع تعليمي تقني تفاعلي لمادة الفنون الموسيقية للصف العاشر - سلطنة عمان
              </p>
            </div>

            {/* Students Names Cards */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="px-3.5 py-2 rounded-xl bg-white border border-amber-200/90 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-stone-800">هشام بن إسحاق الرحبي</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white border border-amber-200/90 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-stone-800">يعرب بن بدر الدغيشي</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white border border-amber-200/90 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-stone-800">حسن بن يعقوب البطراني</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 pt-2">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} · طلاب الصف العاشر: 
            <strong className="text-stone-700 mx-1">هشام بن إسحاق الرحبي</strong>، 
            <strong className="text-stone-700 mx-1">يعرب بن بدر الدغيشي</strong>، 
            و<strong className="text-stone-700 mx-1">حسن بن يعقوب البطراني</strong>.
          </p>
          <div className="flex items-center gap-2 text-stone-400">
            <span>عروض PPTX مهيأة بالكامل · مشغل فيديو مدمج ومختبر نغمي</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
