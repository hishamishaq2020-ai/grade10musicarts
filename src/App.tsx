import React, { useState, useMemo, useEffect } from 'react';
import { CURRICULUM_UNITS } from './data/curriculumData';
import { LessonContent, Unit } from './types/curriculum';
import { UserProfile } from './types/auth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LessonCard } from './components/LessonCard';
import { LessonDetailView } from './components/LessonDetailView';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { Search } from 'lucide-react';

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
  const [activeUnitFilter, setActiveUnitFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication & Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('music_edu_user_profile');
      if (saved) {
        return JSON.parse(saved) as UserProfile;
      }
    } catch (e) {
      console.error('Failed to read user profile from storage', e);
    }
    return null;
  });

  // Modal is open if user has not logged in yet, or if they request to edit profile
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('music_edu_user_profile');
    return !saved;
  });

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('music_edu_user_profile');
    setUserProfile(null);
    setIsLoginModalOpen(true);
  };

  // Flatten all lessons for easy sequential navigation
  const allLessons = useMemo(() => {
    return CURRICULUM_UNITS.flatMap((u) => u.lessons);
  }, []);

  // Filter lessons based on active unit and search query
  const filteredUnits = useMemo(() => {
    let units = CURRICULUM_UNITS;
    if (activeUnitFilter !== null) {
      units = units.filter((u) => u.id === activeUnitFilter);
    }

    if (!searchQuery.trim()) {
      return units;
    }

    const q = searchQuery.toLowerCase().trim();
    return units
      .map((u) => {
        const matchingLessons = u.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.subtitle.toLowerCase().includes(q) ||
            l.objectives.some((obj) => obj.toLowerCase().includes(q)) ||
            l.keyTerms.some((t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
        );
        return {
          ...u,
          lessons: matchingLessons,
        };
      })
      .filter((u) => u.lessons.length > 0);
  }, [activeUnitFilter, searchQuery]);

  // Find unit for currently selected lesson
  const selectedLessonUnit = useMemo(() => {
    if (!selectedLesson) return null;
    return CURRICULUM_UNITS.find((u) => u.id === selectedLesson.unitId) || CURRICULUM_UNITS[0];
  }, [selectedLesson]);

  const handleNavigateLesson = (targetLessonId: string) => {
    const found = allLessons.find((l) => l.id === targetLessonId);
    if (found) {
      setSelectedLesson(found);
    }
  };

  const handleStartFirstLesson = () => {
    setSelectedLesson(CURRICULUM_UNITS[0].lessons[0]);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      {/* Interactive Login/Welcome Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
        initialProfile={userProfile}
      />

      {/* Top Bar matching Top Bar Contract with User Profile in the Corner */}
      <Header
        onSelectUnit={(id) => {
          setSelectedLesson(null);
          setActiveUnitFilter(id);
          const elem = document.getElementById('curriculum-grid');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        onGoHome={() => {
          setSelectedLesson(null);
          setActiveUnitFilter(null);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeUnitId={activeUnitFilter}
        userProfile={userProfile}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full flex-1">
        {selectedLesson && selectedLessonUnit ? (
          /* Detailed Lesson View */
          <LessonDetailView
            lesson={selectedLesson}
            unit={selectedLessonUnit}
            onBack={() => setSelectedLesson(null)}
            onNavigateLesson={handleNavigateLesson}
            allLessons={allLessons}
          />
        ) : (
          /* Main Homepage & Curriculum Grid */
          <div className="space-y-12">
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onExploreFirstLesson={handleStartFirstLesson}
            />

            {/* Units Segmented Control Bar */}
            <div id="curriculum-grid" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                    وحدات ودروس المنهج الدراسي
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    مقسمة ومصنفة وفق الخطة الدراسية الرسمية المعتمدة
                  </p>
                </div>

                {/* Segmented Filter Buttons */}
                <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto">
                  <button
                    onClick={() => setActiveUnitFilter(null)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      activeUnitFilter === null
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    جميع الوحدات (3)
                  </button>
                  {CURRICULUM_UNITS.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => setActiveUnitFilter(unit.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        activeUnitFilter === unit.id
                          ? 'bg-white text-amber-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      الوحدة {unit.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units & Lessons Display */}
              {filteredUnits.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
                  <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800">لا توجد دروس مطابقة لبحثك</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    جرب البحث بكلمات أخرى مثل "مفتاح فا" أو "فن المولد" أو "عايدة"
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveUnitFilter(null);
                    }}
                    className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                  >
                    إعادة ضبط البحث
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  {filteredUnits.map((unit) => (
                    <section key={unit.id} className="space-y-6">
                      {/* Unit Header Card */}
                      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                            <span>{unit.badge}</span>
                            <span aria-hidden="true">·</span>
                            <span>{unit.lessons.length} دروس تعليمية</span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                            {unit.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                            {unit.description}
                          </p>
                        </div>

                        {/* Visual thumbnail for units 2 and 3 */}
                        {unit.id === 2 && (
                          <div className="hidden lg:block w-44 h-24 rounded-xl overflow-hidden shadow-xs shrink-0 border border-stone-200">
                            <img
                              src="/src/assets/images/oman_mawlid_heritage_1792836552064.jpg"
                              alt="فن المولد والتراث العماني"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {unit.id === 3 && (
                          <div className="hidden lg:block w-44 h-24 rounded-xl overflow-hidden shadow-xs shrink-0 border border-stone-200">
                            <img
                              src="/src/assets/images/verdi_romantic_opera_1792836551332.jpg"
                              alt="أوبرا فيردي والعصر الرومانسي"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Lessons Grid for this unit */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {unit.lessons.map((lesson) => (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            unit={unit}
                            onSelectLesson={(l) => setSelectedLesson(l)}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
