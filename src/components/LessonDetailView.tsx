import React, { useState, useEffect } from 'react';
import { 
  FileDown, 
  Video, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle, 
  Award, 
  RotateCcw,
  Edit3,
  Lightbulb,
  Info,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonContent, Unit } from '../types/curriculum';
import { exportLessonToPPTX } from '../utils/pptxExport';
import { InteractiveAudioTools } from './InteractiveAudioTools';
import { CustomVideoModal } from './CustomVideoModal';

interface LessonDetailViewProps {
  lesson: LessonContent;
  unit: Unit;
  onBack: () => void;
  onNavigateLesson: (targetLessonId: string) => void;
  allLessons: LessonContent[];
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  unit,
  onBack,
  onNavigateLesson,
  allLessons,
}) => {
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(lesson.defaultVideoUrl);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Load official or custom video URL with auto-migration from previous placeholders
  useEffect(() => {
    const saved = localStorage.getItem(`custom_video_${lesson.id}`);
    const isOldPlaceholder = saved && (
      saved.includes('9Wq_jQ_J5q0') ||
      saved.includes('5U7zB1qZgQw') ||
      saved.includes('n4yB3s_pXkI') ||
      saved.includes('FwF7j0u_7qU') ||
      saved.includes('PjRk8xT1N3I') ||
      saved.includes('fGf7qW3K_vY') ||
      saved.includes('b8rsOzPzYr8') ||
      saved.includes('5a8bZkQGjEQ')
    );

    if (isOldPlaceholder) {
      localStorage.removeItem(`custom_video_${lesson.id}`);
      setCurrentVideoUrl(lesson.defaultVideoUrl);
    } else if (saved) {
      setCurrentVideoUrl(saved);
    } else {
      setCurrentVideoUrl(lesson.defaultVideoUrl);
    }

    // Reset quiz when lesson changes
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson]);

  const handleSaveVideoUrl = (newUrl: string) => {
    setCurrentVideoUrl(newUrl);
    localStorage.setItem(`custom_video_${lesson.id}`, newUrl);
  };

  const handleDownloadPPTX = async () => {
    try {
      setIsExportingPPTX(true);
      await exportLessonToPPTX(lesson, unit);
    } catch (err) {
      console.error('Error generating PPTX:', err);
    } finally {
      setIsExportingPPTX(false);
    }
  };

  // Find previous and next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Quiz handler
  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    lesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setSubmittedQuiz(true);
    const score = calculateScore();
    if (score === lesson.quiz.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى فهرس الوحدات والدروس</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>{unit.title}</span>
            <span aria-hidden="true">·</span>
            <span>الدرس {lesson.lessonNumber} من 3</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {lesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">{lesson.subtitle}</p>
        </div>

        {/* Quick Lesson Switcher buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {prevLesson && (
            <button
              onClick={() => onNavigateLesson(prevLesson.id)}
              className="px-3 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1"
              title={prevLesson.title}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الدرس السابق</span>
            </button>
          )}
          {nextLesson && (
            <button
              onClick={() => onNavigateLesson(nextLesson.id)}
              className="px-3 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1"
              title={nextLesson.title}
            >
              <span>الدرس التالي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Prominent Action Bar: PPTX Download & Video Jump */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-amber-100">
              ملفات الدرس التفاعلية
            </span>
            <span className="text-xs text-amber-100">جاهزة للمشاهدة والتحميل المباشر</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            العرض التقديمي (PowerPoint) ومشغل الفيديو التعليمي
          </h2>
          <p className="text-xs text-amber-100 max-w-xl">
            يمكنك تحميل عرض البوربوينت الرسمي بصيغة (PPTX) للاستخدام الصفي، أو مشاهدة الفيديو والشرح المرفق بالأسفل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Prominent PPTX Download Button */}
          <button
            onClick={handleDownloadPPTX}
            disabled={isExportingPPTX}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-amber-900 hover:bg-amber-50 font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-75 whitespace-nowrap"
          >
            <FileDown className={`w-5 h-5 text-amber-600 ${isExportingPPTX ? 'animate-bounce' : ''}`} />
            <span>
              {isExportingPPTX ? 'جارٍ إعداد العرض...' : 'تحميل عرض البوربوينت (PPTX)'}
            </span>
          </button>

          {/* Jump to video player button */}
          <a
            href="#video-player-section"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-700/60 hover:bg-amber-700 text-white font-medium text-xs rounded-xl transition-colors border border-amber-400/40 whitespace-nowrap"
          >
            <Video className="w-4 h-4" />
            <span>مشاهدة الفيديو المدمج</span>
          </a>
        </div>
      </div>

      {/* Educational Objectives Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">الأهداف التعليمية للدرس</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lesson.objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
              <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Detailed Text Explanation & Interactive Audio Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Detailed Text Explanation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">قسم الشرح النصي المفصل</h3>
                  <p className="text-xs text-stone-500">المحتوى الأكاديمي المعتمد والمفاهيم النظرية والتطبيقية</p>
                </div>
              </div>
            </div>

            {/* Explanation Content Breakdown */}
            <div className="space-y-8">
              {lesson.detailedExplanation.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-base sm:text-lg font-bold text-stone-900">
                    {sec.sectionTitle}
                  </h4>

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="space-y-2 mt-3 pr-4 border-r-2 border-stone-200">
                      {sec.bulletPoints.map((pt, ptIdx) => (
                        <li key={ptIdx} className="text-xs sm:text-sm text-stone-700 leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.callout && (
                    <div
                      className={`p-4 rounded-xl border mt-3 text-xs sm:text-sm leading-relaxed ${
                        sec.callout.type === 'tip'
                          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                          : sec.callout.type === 'important'
                          ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                          : 'bg-sky-50/80 border-sky-200 text-sky-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold mb-1">
                        {sec.callout.type === 'tip' && <Lightbulb className="w-4 h-4 text-amber-700" />}
                        {sec.callout.type === 'important' && <AlertCircle className="w-4 h-4 text-rose-700" />}
                        {sec.callout.type === 'info' && <Info className="w-4 h-4 text-sky-700" />}
                        <span>{sec.callout.title}</span>
                      </div>
                      <p>{sec.callout.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Terms / Glossary */}
            {lesson.keyTerms && lesson.keyTerms.length > 0 && (
              <div className="mt-8 pt-6 border-t border-stone-100">
                <h4 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>المصطلحات والمفاهيم الموسيقية الأساسية</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.keyTerms.map((term, tIdx) => (
                    <div key={tIdx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                      <span className="text-xs font-bold text-stone-900 block mb-1">
                        {term.term}
                      </span>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {term.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Audio Lab for this Lesson */}
          <InteractiveAudioTools toolType={lesson.interactiveToolType} />
        </div>

        {/* Right Column: Embedded Video Player & Quick Tools (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Embedded Video Player Section */}
          <div id="video-player-section" className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">مشغل الفيديو المدمج</h3>
                  <span className="text-[11px] text-stone-500">يعمل مباشرة داخل الموقع</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Direct Watch on YouTube button */}
                <a
                  href={lesson.videoWatchUrl || currentVideoUrl.replace('/embed/', '/watch?v=')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-colors"
                  title="فتح المقطع في منصة يوتيوب مباشرة"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في يوتيوب</span>
                </a>

                {/* Edit Video link button */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="تعديل رابط الفيديو وتعيين رابط يوتيوب خاص بك"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل الرابط</span>
                </button>
              </div>
            </div>

            {/* Video Iframe Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-stone-800">
              <iframe
                src={currentVideoUrl}
                title={lesson.videoTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                {lesson.videoTitle}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                {lesson.videoDescription}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <p>
                تم تزويد المشغل برابط يوتيوب تعليمي نموذجي. يمكنك النقر على <strong>"تعديل الرابط"</strong> في أي وقت لوضع الرابط الخاص بك.
              </p>
            </div>
          </div>

          {/* Slide Deck Outline preview */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileDown className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-stone-900 text-xs">محتويات العرض التقديمي (PPTX)</h4>
              </div>
              <span className="text-[10px] text-stone-400">{lesson.presentationOutline.length + 2} شرائح</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-stone-50 rounded-lg text-xs text-stone-700">
                <span className="font-bold block text-stone-900">شريحة 1: شريحة العنوان والمادة</span>
                <span className="text-[11px] text-stone-500">الفنون الموسيقية · الصف العاشر</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-lg text-xs text-stone-700">
                <span className="font-bold block text-stone-900">شريحة 2: الأهداف التعليمية للدرس</span>
                <span className="text-[11px] text-stone-500">تفصيل الأهداف السلوكية والمعرفية</span>
              </div>
              {lesson.presentationOutline.map((slide, sIdx) => (
                <div key={sIdx} className="p-2.5 bg-stone-50 rounded-lg text-xs text-stone-700">
                  <span className="font-bold block text-stone-900">شريحة {sIdx + 3}: {slide.title}</span>
                  <span className="text-[11px] text-stone-500">{slide.points.length} نقاط رئيسية مع إضاءة تربوية</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleDownloadPPTX}
              disabled={isExportingPPTX}
              className="w-full mt-2 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>تحميل العرض كاملاً الآن (PPTX)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Self-Assessment Quiz Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg">الاختبار الذاتي والتقييم السريع للدرس</h3>
              <p className="text-xs text-stone-500">اختبر استيعابك الفوري لمفاهيم الدرس مع تغذية راجعة فورية</p>
            </div>
          </div>

          {submittedQuiz && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>النتيجة: {calculateScore()} من {lesson.quiz.length}</span>
              </div>
              <button
                onClick={handleResetQuiz}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                title="إعادة المحاولة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {lesson.quiz.map((q, qIndex) => {
            const hasAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrect = selectedAnswers[q.id] === q.correctIndex;

            return (
              <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-stone-900">
                    {q.question}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selectedAnswers[q.id] === optIndex;
                    let btnClass = 'bg-white hover:bg-stone-100 border-stone-200 text-stone-800';

                    if (submittedQuiz) {
                      if (optIndex === q.correctIndex) {
                        btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
                      } else {
                        btnClass = 'bg-white/50 border-stone-200 text-stone-400 opacity-70';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-amber-100 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleOptionSelect(q.id, optIndex)}
                        disabled={submittedQuiz}
                        className={`p-3 text-right text-xs sm:text-sm rounded-xl border transition-all text-stone-800 flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {submittedQuiz && optIndex === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mr-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submittedQuiz && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed mt-2 ${
                    isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    <strong className="block mb-0.5">{isCorrect ? 'إجابة صحيحة!' : 'توضيح تربوي:'}</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submittedQuiz && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs disabled:cursor-not-allowed"
            >
              تصحيح الاختبار وعرض النتيجة
            </button>
          </div>
        )}
      </div>

      {/* Custom Video Editor Modal */}
      <CustomVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        lessonTitle={lesson.title}
        currentVideoUrl={currentVideoUrl}
        defaultVideoUrl={lesson.defaultVideoUrl}
        onSave={handleSaveVideoUrl}
      />
    </div>
  );
};
