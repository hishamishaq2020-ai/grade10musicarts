import React, { useState } from 'react';
import { FileDown, Video, BookOpen, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { LessonContent, Unit } from '../types/curriculum';
import { exportLessonToPPTX } from '../utils/pptxExport';

interface LessonCardProps {
  lesson: LessonContent;
  unit: Unit;
  onSelectLesson: (lesson: LessonContent) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  unit,
  onSelectLesson,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsExporting(true);
      await exportLessonToPPTX(lesson, unit);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error in quick download:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      onClick={() => onSelectLesson(lesson)}
      className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-500/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Unboxed Metadata without pill badges */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span className="font-semibold text-amber-700">الدرس {lesson.lessonNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{unit.badge}</span>
          <span aria-hidden="true">·</span>
          <span>{lesson.presentationOutline.length + 2} شرائح</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
          {lesson.title}
        </h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-1">{lesson.subtitle}</p>

        {/* Objectives preview */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5">
          <span className="text-[11px] font-bold text-stone-700 block">أبرز محاور الدرس:</span>
          {lesson.objectives.slice(0, 2).map((obj, i) => (
            <p key={i} className="text-xs text-stone-600 line-clamp-1 flex items-start gap-1.5">
              <span className="text-amber-600 font-bold shrink-0">›</span>
              <span>{obj}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Action buttons footer */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleQuickDownload}
          disabled={isExporting}
          className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          title="تحميل عرض البوربوينت PPTX مباشرة"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">تم التحميل</span>
            </>
          ) : (
            <>
              <FileDown className={`w-3.5 h-3.5 text-amber-600 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'تحميل...' : 'PPTX'}</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 group-hover:text-amber-800 transition-colors flex items-center gap-1">
            <span>فتح الدرس والشرح</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
