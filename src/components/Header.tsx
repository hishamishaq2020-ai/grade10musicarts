import React, { useState } from 'react';
import { 
  Music, 
  Download, 
  User, 
  GraduationCap, 
  LogOut, 
  ChevronDown, 
  Building2, 
  MapPin, 
  Edit3 
} from 'lucide-react';
import { UserProfile } from '../types/auth';

interface HeaderProps {
  onSelectUnit: (unitId: number | null) => void;
  onGoHome: () => void;
  activeUnitId: number | null;
  userProfile: UserProfile | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectUnit,
  onGoHome,
  activeUnitId,
  userProfile,
  onOpenLoginModal,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format greeting label
  const greetingText = userProfile
    ? userProfile.role === 'teacher'
      ? `مرحباً، أ. ${userProfile.name}`
      : `مرحباً، الطالب: ${userProfile.name}`
    : 'تسجيل الدخول';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 md:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onGoHome}
          className="text-base sm:text-lg font-black tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:text-amber-700 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Music className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline">الفنون الموسيقية · الصف العاشر</span>
          <span className="sm:hidden">الفنون الموسيقية 10</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-stone-600">
          <button
            onClick={onGoHome}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
              activeUnitId === null ? 'text-amber-700 font-bold border-b-2 border-amber-600 pb-0.5' : ''
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onSelectUnit(1)}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
              activeUnitId === 1 ? 'text-amber-700 font-bold border-b-2 border-amber-600 pb-0.5' : ''
            }`}
          >
            الوحدة 1: قواعد ونظريات
          </button>
          <button
            onClick={() => onSelectUnit(2)}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
              activeUnitId === 2 ? 'text-amber-700 font-bold border-b-2 border-amber-600 pb-0.5' : ''
            }`}
          >
            الوحدة 2: فن المولد
          </button>
          <button
            onClick={() => onSelectUnit(3)}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
              activeUnitId === 3 ? 'text-amber-700 font-bold border-b-2 border-amber-600 pb-0.5' : ''
            }`}
          >
            الوحدة 3: تاريخ وتذوق
          </button>
        </nav>

        {/* Zone 3: 1 primary action / User Profile in the top corner */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {userProfile ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold max-w-[200px] sm:max-w-[260px] cursor-pointer ${
                  userProfile.role === 'teacher'
                    ? 'bg-emerald-50/90 hover:bg-emerald-100/80 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/90 hover:bg-amber-100/80 border-amber-300 text-amber-950'
                }`}
                title="اضغط لتفاصيل الحساب أو تسجيل الخروج"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  userProfile.role === 'teacher'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  {userProfile.role === 'teacher' ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>

                <span className="truncate">
                  {greetingText}
                </span>

                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              </button>

              {/* Profile details dropdown */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 text-right animate-in fade-in zoom-in-95 duration-150">
                    <div className="pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          userProfile.role === 'teacher'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {userProfile.role === 'teacher' ? 'حساب معلم' : 'حساب طالب'}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">{userProfile.name}</h4>
                    </div>

                    <div className="py-2.5 space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{userProfile.governorate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="line-clamp-1">{userProfile.school}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenLoginModal();
                        }}
                        className="w-full py-1.5 px-2 text-right text-xs text-stone-700 hover:bg-stone-50 rounded-lg flex items-center justify-between transition-colors"
                      >
                        <span>تعديل البيانات / تبديل الرتبة</span>
                        <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full py-1.5 px-2 text-right text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-between transition-colors font-medium"
                      >
                        <span>تسجيل الخروج</span>
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
