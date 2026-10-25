import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  Building2, 
  MapPin, 
  Sparkles, 
  Music, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { UserProfile, UserRole, OMAN_GOVERNORATES } from '../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  initialProfile,
}) => {
  const [role, setRole] = useState<UserRole>(initialProfile?.role || 'student');
  const [name, setName] = useState(initialProfile?.name || '');
  const [governorate, setGovernorate] = useState(initialProfile?.governorate || OMAN_GOVERNORATES[0]);
  const [school, setSchool] = useState(initialProfile?.school || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(role === 'teacher' ? 'يرجى كتابة اسم المعلم' : 'يرجى كتابة اسم الطالب');
      return;
    }
    if (!school.trim()) {
      setErrorMessage(role === 'teacher' ? 'يرجى إدخال اسم المدرسة التي تعلم فيها' : 'يرجى إدخال اسم المدرسة');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const profile: UserProfile = {
      role,
      name: name.trim(),
      governorate,
      school: school.trim(),
      loggedInAt: new Date().toISOString(),
    };

    // Store in localStorage immediately
    localStorage.setItem('music_edu_user_profile', JSON.stringify(profile));

    // Smooth exit delay
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(profile);
    }, 400);
  };

  const handleQuickFill = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'teacher') {
      setName('أحمد بن سعيد المعمري');
      setGovernorate('محافظة مسقط');
      setSchool('مدرسة الإمام جابر بن زيد للتعليم ما بعد الأساسي');
    } else {
      setName('سالم بن محمد البوسعيدي');
      setGovernorate('محافظة الداخلية');
      setSchool('مدرسة نزوى للتعليم الأساسي');
    }
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      {/* Decorative ambient background lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl" />
      </div>

      <div className={`relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 transition-all duration-300 ${
        isSubmitting ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}>
        {/* Top Header with Music Emblem */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Music className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>سلطنة عمان · وزارة التربية والتعليم</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              منصة الفنون الموسيقية · الصف العاشر
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              مرحباً بك! يرجى تحديد صفتك وإدخال بياناتك لبدء تصفح المنصة
            </p>
          </div>
        </div>

        {/* Step 1: Role Selector (معلم / طالب) */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-bold text-stone-700 text-right">
            1. اختر صفتك التعليمية:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Student Role Button */}
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setErrorMessage(null);
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer ${
                role === 'student'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100/70'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                role === 'student'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-600 group-hover:bg-stone-300'
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm">أنا طالب</span>
                <span className="block text-[11px] text-stone-500 mt-0.5">
                  الصف العاشر الأساسي
                </span>
              </div>
            </button>

            {/* Teacher Role Button */}
            <button
              type="button"
              onClick={() => {
                setRole('teacher');
                setErrorMessage(null);
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer ${
                role === 'teacher'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100/70'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                role === 'teacher'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-200 text-stone-600 group-hover:bg-stone-300'
              }`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm">أنا معلم / معلمة</span>
                <span className="block text-[11px] text-stone-500 mt-0.5">
                  مادة الفنون الموسيقية
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Form Fields based on selection */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 text-right">
              {role === 'teacher' ? 'اسم المعلم / المعلمة:' : 'اسم الطالب / الطالبة:'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder={role === 'teacher' ? 'اكتب اسمك الكريم كاملاً' : 'اكتب اسمك الثلاثي'}
                className="w-full pr-10 pl-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-stone-900 bg-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                {role === 'teacher' ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Governorate Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 text-right">
              المحافظة التعليمية:
            </label>
            <div className="relative">
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full pr-10 pl-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-stone-900 bg-white appearance-none cursor-pointer"
              >
                {OMAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* School Name Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 text-right">
              {role === 'teacher' ? 'اسم المدرسة التي تعلم فيها:' : 'اسم المدرسة:'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={school}
                onChange={(e) => {
                  setSchool(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="اكتب اسم المدرسة..."
                className="w-full pr-10 pl-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-stone-900 bg-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Error message alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              role === 'teacher'
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-600/20'
                : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-amber-600/20'
            }`}
          >
            <span>{isSubmitting ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول إلى المنصة'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Fill / Demo Presets for Convenience */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>تعبئة سريعة للتجربة:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className="text-amber-700 hover:text-amber-800 hover:underline font-medium cursor-pointer"
            >
              طالب تجريبي
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => handleQuickFill('teacher')}
              className="text-emerald-700 hover:text-emerald-800 hover:underline font-medium cursor-pointer"
            >
              معلم تجريبي
            </button>
          </div>
        </div>

        {/* Student Copyright & Development Credit */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-center text-[10px] text-stone-400">
          <span>إعداد وتطوير طلاب الصف العاشر: </span>
          <strong className="text-stone-600 font-semibold">هشام بن إسحاق الرحبي</strong> ·{' '}
          <strong className="text-stone-600 font-semibold">يعرب بن بدر الدغيشي</strong> ·{' '}
          <strong className="text-stone-600 font-semibold">حسن بن يعقوب البطراني</strong>
        </div>
      </div>
    </div>
  );
};
