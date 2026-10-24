import React, { useState } from 'react';
import { Volume2, Play, RefreshCw, CheckCircle, Music, Sparkles } from 'lucide-react';
import { synth } from '../utils/audioSynth';

interface InteractiveAudioToolsProps {
  toolType: string;
}

export const InteractiveAudioTools: React.FC<InteractiveAudioToolsProps> = ({ toolType }) => {
  // State for Bass Clef game
  const [selectedClefNote, setSelectedClefNote] = useState<string | null>(null);
  const [bassClefGameScore, setBassClefGameScore] = useState(0);
  const [targetNoteIndex, setTargetNoteIndex] = useState(3); // default 'F3'
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  // State for Scale player
  const [activeScale, setActiveScale] = useState<'F-Major' | 'D-Minor'>('F-Major');
  const [currentPlayingNote, setCurrentPlayingNote] = useState<string | null>(null);

  // State for Triad explorer
  const [activeTriad, setActiveTriad] = useState<'major' | 'minor'>('major');

  // State for Omani instruments
  const [activeInstrument, setActiveInstrument] = useState<string | null>(null);

  // State for Virtual Piano
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Bass clef notes mapping
  const bassLines = [
    { name: 'لا (A3)', note: 'A3', pos: 'الخط الخامس (العلوي)', freq: '220Hz' },
    { name: 'فا (F3)', note: 'F3', pos: 'الخط الرابع (خط الارتكاز)', freq: '174.6Hz', highlight: true },
    { name: 'ري (D3)', note: 'D3', pos: 'الخط الثالث', freq: '146.8Hz' },
    { name: 'سي (B2)', note: 'B2', pos: 'الخط الثاني', freq: '123.5Hz' },
    { name: 'صول (G2)', note: 'G2', pos: 'الخط الأول (السفلي)', freq: '98Hz' },
  ];

  const bassSpaces = [
    { name: 'صول (G3)', note: 'G3', pos: 'الفراغ الرابع' },
    { name: 'مي (E3)', note: 'E3', pos: 'الفراغ الثالث' },
    { name: 'دو (C3)', note: 'C3', pos: 'الفراغ الثاني' },
    { name: 'لا (A2)', note: 'A2', pos: 'الفراغ الأول' },
  ];

  const allBassNotes = [
    { name: 'صول (G2)', note: 'G2', type: 'line', num: '1' },
    { name: 'لا (A2)', note: 'A2', type: 'space', num: '1' },
    { name: 'سي (B2)', note: 'B2', type: 'line', num: '2' },
    { name: 'دو (C3)', note: 'C3', type: 'space', num: '2' },
    { name: 'ري (D3)', note: 'D3', type: 'line', num: '3' },
    { name: 'مي (E3)', note: 'E3', type: 'space', num: '3' },
    { name: 'فا (F3)', note: 'F3', type: 'line', num: '4', isAnchor: true },
    { name: 'صول (G3)', note: 'G3', type: 'space', num: '4' },
    { name: 'لا (A3)', note: 'A3', type: 'line', num: '5' },
    { name: 'دو الوسطى (C4)', note: 'C4', type: 'ledger', num: 'خط إضافي علوي' },
  ];

  const handlePlayBassNote = (note: string, name: string) => {
    setSelectedClefNote(`${name}`);
    synth.playNote(note, 0.8, 'triangle', 0.3);
  };

  const handleTestBassClefGuess = (guessedNote: string) => {
    const target = allBassNotes[targetNoteIndex];
    if (guessedNote === target.note) {
      setGameFeedback('أحسنت! إجابة صحيحة ومتقنة');
      setBassClefGameScore((prev) => prev + 1);
      synth.playNote(target.note, 0.6, 'sine', 0.35);
      setTimeout(() => {
        const nextIndex = Math.floor(Math.random() * allBassNotes.length);
        setTargetNoteIndex(nextIndex);
        setGameFeedback(null);
      }, 1200);
    } else {
      setGameFeedback(`حاول مرة أخرى، هذه النغمة تقع على ${target.type === 'line' ? `الخط ${target.num}` : target.type === 'space' ? `الفراغ ${target.num}` : target.num}`);
    }
  };

  const playScaleAudio = (scaleType: 'F-Major' | 'D-Minor') => {
    setActiveScale(scaleType);
    let notes: string[] = [];
    if (scaleType === 'F-Major') {
      notes = ['F3', 'G3', 'A3', 'Bb3', 'C4', 'D4', 'E4', 'F4', 'E4', 'D4', 'C4', 'Bb3', 'A3', 'G3', 'F3'];
    } else {
      // D Harmonic minor with C#4
      notes = ['D3', 'E3', 'F3', 'G3', 'A3', 'Bb3', 'C#4', 'D4', 'C#4', 'Bb3', 'A3', 'G3', 'F3', 'E3', 'D3'];
    }

    notes.forEach((note, idx) => {
      setTimeout(() => {
        setCurrentPlayingNote(note);
        synth.playNote(note, 0.4, 'triangle', 0.28);
      }, idx * 320);
    });

    setTimeout(() => {
      setCurrentPlayingNote(null);
    }, notes.length * 320 + 200);
  };

  const playTriadAudio = (type: 'major' | 'minor', arpeggio: boolean) => {
    setActiveTriad(type);
    const chordNotes = type === 'major' ? ['C3', 'E3', 'G3'] : ['C3', 'Eb3', 'G3'];
    synth.playTriad(chordNotes, arpeggio, 1.8);
  };

  // Virtual piano keys
  const pianoKeys = [
    { note: 'F3', label: 'فا', isBlack: false, finger: '1' },
    { note: 'F#3', label: '', isBlack: true, finger: '' },
    { note: 'G3', label: 'صول', isBlack: false, finger: '2' },
    { note: 'Ab3', label: '', isBlack: true, finger: '' },
    { note: 'A3', label: 'لا', isBlack: false, finger: '3' },
    { note: 'Bb3', label: 'سيb', isBlack: true, finger: '4' },
    { note: 'B3', label: 'سي', isBlack: false, finger: '' },
    { note: 'C4', label: 'دو', isBlack: false, finger: '1' },
    { note: 'C#4', label: 'دو#', isBlack: true, finger: '' },
    { note: 'D4', label: 'ري', isBlack: false, finger: '2' },
    { note: 'Eb4', label: '', isBlack: true, finger: '' },
    { note: 'E4', label: 'مي', isBlack: false, finger: '3' },
    { note: 'F4', label: 'فا', isBlack: false, finger: '4' },
  ];

  return (
    <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 lg:p-8 shadow-sm border border-stone-800">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">المختبر الموسيقي التفاعلي</h4>
            <p className="text-xs text-stone-400">تطبيق سمعي وبصري عملي مباشر معزز بمولد الصوت الترددي</p>
          </div>
        </div>
        <span className="text-xs text-amber-400 font-medium bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-md">
          تفاعل مباشر
        </span>
      </div>

      {/* Tool 1: Bass Clef Interactive Stave */}
      {toolType === 'bass-clef' && (
        <div className="space-y-6">
          <div className="bg-stone-950/70 p-5 rounded-xl border border-stone-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h5 className="font-semibold text-amber-300">مدرج مفتاح فا التفاعلي (الخط الرابع)</h5>
                <p className="text-xs text-stone-400 mt-1">انقر على أي خط أو فراغ لسماع النغمة والتعرف على موقعها العلمي</p>
              </div>
              {selectedClefNote && (
                <div className="text-sm bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 font-medium">
                  النغمة المعزوفة: {selectedClefNote}
                </div>
              )}
            </div>

            {/* Visual Stave Simulation */}
            <div className="relative py-6 px-4 bg-stone-900/90 rounded-lg border border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-400">الخطوط (من الأسفل للأعلى):</span>
                <span className="text-xs text-amber-400">الخط الرابع المميز باللون الذهبي</span>
              </div>

              <div className="space-y-3">
                {bassLines.map((line, idx) => (
                  <div
                    key={line.note}
                    onClick={() => handlePlayBassNote(line.note, line.name)}
                    className={`group cursor-pointer flex items-center justify-between p-2 rounded transition-colors ${
                      line.highlight
                        ? 'bg-amber-950/60 border border-amber-600/60 text-amber-200'
                        : 'bg-stone-950/40 hover:bg-stone-800/80 border border-transparent hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${line.highlight ? 'bg-amber-400 ring-4 ring-amber-400/20' : 'bg-stone-600'}`} />
                      <span className="text-sm font-semibold">{line.name}</span>
                      <span className="text-xs text-stone-400">{line.pos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-stone-400">{line.freq}</span>
                      <Volume2 className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-stone-800">
                <span className="text-xs text-stone-400 block mb-2">الفراغات الأربعة:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {bassSpaces.map((space) => (
                    <button
                      key={space.note}
                      onClick={() => handlePlayBassNote(space.note, space.name)}
                      className="p-2.5 text-center bg-stone-950/40 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded-lg text-xs font-medium text-stone-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{space.name}</span>
                      <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Note Identification Mini-Trainer */}
          <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>تحدي التعرف السريع على نغمات مفتاح فا</span>
                <span className="text-stone-400 mr-2">· النقاط: {bassClefGameScore}</span>
              </div>
              <p className="text-sm text-stone-300">
                أين تقع نغمة: <strong className="text-amber-300">{allBassNotes[targetNoteIndex].name}</strong>؟
              </p>
              {gameFeedback && (
                <p className="text-xs text-amber-300 mt-1 font-medium">{gameFeedback}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {allBassNotes.slice(0, 5).map((n) => (
                <button
                  key={n.note}
                  onClick={() => handleTestBassClefGuess(n.note)}
                  className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-600 hover:text-white rounded-lg transition-colors border border-stone-700 font-medium"
                >
                  {n.name.split(' ')[0]}
                </button>
              ))}
              {allBassNotes.slice(5, 9).map((n) => (
                <button
                  key={n.note}
                  onClick={() => handleTestBassClefGuess(n.note)}
                  className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-600 hover:text-white rounded-lg transition-colors border border-stone-700 font-medium"
                >
                  {n.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: Scales Explorer (F Major vs D Minor) */}
      {toolType === 'scales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* F Major Card */}
            <div className={`p-5 rounded-xl border transition-all ${
              activeScale === 'F-Major'
                ? 'bg-amber-950/40 border-amber-600/80 shadow-md'
                : 'bg-stone-950/40 border-stone-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-bold text-amber-300">سلم فا الكبير (F Major)</h5>
                <span className="text-xs text-stone-400 font-mono">الدليل: Bb واحدة</span>
              </div>
              <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                الأبعاد: 1 - 1 - 1/2 - 1 - 1 - 1 - 1/2. الطابع مشرق ومنير.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-xs">
                {['فا (F)', 'صول (G)', 'لا (A)', 'سيb (Bb)', 'دو (C)', 'ري (D)', 'مي (E)', 'فا (F)'].map((step, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded ${
                      idx === 3
                        ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
              <button
                onClick={() => playScaleAudio('F-Major')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                عزف سلم فا الكبير (صعوداً وهبوطاً)
              </button>
            </div>

            {/* D Minor Harmonic Card */}
            <div className={`p-5 rounded-xl border transition-all ${
              activeScale === 'D-Minor'
                ? 'bg-amber-950/40 border-amber-600/80 shadow-md'
                : 'bg-stone-950/40 border-stone-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-bold text-amber-300">سلم ري الصغير الهارموني (D Harmonic Minor)</h5>
                <span className="text-xs text-rose-400 font-mono">رفع 7: C#</span>
              </div>
              <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                الأبعاد: 1 - 1/2 - 1 - 1 - 1/2 - 1.5 - 1/2. نغمة (دو دييز) تمنحه بعداً ونصف ساحراً.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-xs">
                {['ري (D)', 'مي (E)', 'فا (F)', 'صول (G)', 'لا (A)', 'سيb (Bb)', 'دو# (C#)', 'ري (D)'].map((step, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded ${
                      idx === 6
                        ? 'bg-rose-500/30 text-rose-300 font-bold border border-rose-500/50'
                        : idx === 5
                        ? 'bg-amber-500/30 text-amber-300'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
              <button
                onClick={() => playScaleAudio('D-Minor')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-sm font-semibold transition-colors border border-stone-700"
              >
                <Play className="w-4 h-4 fill-current" />
                عزف سلم ري الصغير الهارموني
              </button>
            </div>
          </div>

          {currentPlayingNote && (
            <div className="text-center py-2 px-4 bg-amber-500/20 text-amber-300 rounded-lg text-sm border border-amber-500/30 animate-pulse font-mono font-bold">
              يُعزف الآن نغمة: {currentPlayingNote}
            </div>
          )}
        </div>
      )}

      {/* Tool 3: Triads Explorer (Major vs Minor) */}
      {toolType === 'triads' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Major Triad */}
            <div className={`p-5 rounded-xl border ${activeTriad === 'major' ? 'bg-amber-950/40 border-amber-600/80' : 'bg-stone-950/40 border-stone-800'}`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-bold text-amber-300">التآلف الكبير (Major Triad)</h5>
                <span className="text-xs text-stone-400">مثال: دو الكبير (C - E - G)</span>
              </div>
              <div className="p-3 bg-stone-900 rounded-lg text-xs space-y-1.5 text-stone-300 mb-4">
                <div className="flex justify-between">
                  <span>من دو إلى مي (الأساس للثالثة):</span>
                  <span className="text-amber-400 font-semibold">ثالثة كبيرة (2 بعد)</span>
                </div>
                <div className="flex justify-between">
                  <span>من مي إلى صول (الثالثة للخامسة):</span>
                  <span className="text-amber-400 font-semibold">ثالثة صغيرة (1.5 بعد)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-800">
                  <span>المجموع من الأساس للخامسة:</span>
                  <span className="text-white font-bold">خامسة تامة (3.5 أبعاد)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => playTriadAudio('major', false)}
                  className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  عزف متزامن (هارموني)
                </button>
                <button
                  onClick={() => playTriadAudio('major', true)}
                  className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
                >
                  <Play className="w-3.5 h-3.5" />
                  عزف متتابع (أربيجيو)
                </button>
              </div>
            </div>

            {/* Minor Triad */}
            <div className={`p-5 rounded-xl border ${activeTriad === 'minor' ? 'bg-amber-950/40 border-amber-600/80' : 'bg-stone-950/40 border-stone-800'}`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-bold text-amber-300">التآلف الصغير (Minor Triad)</h5>
                <span className="text-xs text-stone-400">مثال: دو الصغير (C - Eb - G)</span>
              </div>
              <div className="p-3 bg-stone-900 rounded-lg text-xs space-y-1.5 text-stone-300 mb-4">
                <div className="flex justify-between">
                  <span>من دو إلى ميb (الأساس للثالثة):</span>
                  <span className="text-rose-400 font-semibold">ثالثة صغيرة (1.5 بعد)</span>
                </div>
                <div className="flex justify-between">
                  <span>من ميb إلى صول (الثالثة للخامسة):</span>
                  <span className="text-rose-400 font-semibold">ثالثة كبيرة (2 بعد)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-800">
                  <span>المجموع من الأساس للخامسة:</span>
                  <span className="text-white font-bold">خامسة تامة (3.5 أبعاد)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => playTriadAudio('minor', false)}
                  className="flex-1 py-2 px-3 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  عزف متزامن (شجي)
                </button>
                <button
                  onClick={() => playTriadAudio('minor', true)}
                  className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
                >
                  <Play className="w-3.5 h-3.5" />
                  عزف متتابع (أربيجيو)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool 4: Omani Traditional Instruments Audio Soundboard */}
      {toolType === 'omani-instruments' && (
        <div className="space-y-6">
          <p className="text-sm text-stone-300 leading-relaxed">
            استمع لمحاكاة حية لطبيعة ونبرة الآلات الشعبية العمانية الثلاث، ولاحظ كيف يتكامل صوت الرحماني العميق مع زخرفة الكاسر الحادة ونفير البرغوم:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Rahmani Drum */}
            <div className="p-5 bg-stone-950/70 border border-stone-800 hover:border-amber-600/60 rounded-xl transition-all text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
                🥁
              </div>
              <h5 className="font-bold text-white text-base">طبل الرحماني</h5>
              <p className="text-xs text-stone-400 mt-1 mb-4">نبض عميق غليظ (الدم) - يحفظ الوزن الأساسي</p>
              <button
                onClick={() => {
                  setActiveInstrument('rahmani');
                  synth.playRahmani();
                }}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                ضربة الرحماني (Bass)
              </button>
            </div>

            {/* Kasir Drum */}
            <div className="p-5 bg-stone-950/70 border border-stone-800 hover:border-amber-600/60 rounded-xl transition-all text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
                🪘
              </div>
              <h5 className="font-bold text-white text-base">طبل الكاسر</h5>
              <p className="text-xs text-stone-400 mt-1 mb-4">صوت حاد رنان (التك) - يكسر الرتابة ويزخرف</p>
              <button
                onClick={() => {
                  setActiveInstrument('kasir');
                  synth.playKasir();
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                ضربة الكاسر (Treble)
              </button>
            </div>

            {/* Barghoom Horn */}
            <div className="p-5 bg-stone-950/70 border border-stone-800 hover:border-rose-600/60 rounded-xl transition-all text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl">
                🎺
              </div>
              <h5 className="font-bold text-white text-base">آلة البرغوم</h5>
              <p className="text-xs text-stone-400 mt-1 mb-4">بوق قرن الوعل - نفير البدء لفن الرزحة والعازي</p>
              <button
                onClick={() => {
                  setActiveInstrument('barghoom');
                  synth.playBarghoom();
                }}
                className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                نداء البرغوم الحماسي
              </button>
            </div>
          </div>

          {/* Duet rhythm simulator */}
          <div className="p-4 bg-stone-950/50 rounded-xl border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 block">إيقاع مركب: حوار الرحماني والكاسر التراثي</span>
              <p className="text-xs text-stone-400">عزف متزامن لضربات الطبلين معاً لإدراك التكامل الإيقاعي</p>
            </div>
            <button
              onClick={() => {
                // Play a mini traditional measure
                synth.playRahmani();
                setTimeout(() => synth.playKasir(), 200);
                setTimeout(() => synth.playKasir(), 400);
                setTimeout(() => synth.playRahmani(), 600);
                setTimeout(() => synth.playKasir(), 800);
              }}
              className="py-2 px-4 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-bold border border-stone-700 transition-colors"
            >
              استماع لوزن تقليدي مركب
            </button>
          </div>
        </div>
      )}

      {/* Tool 5: Mawlid & Ya Nabi Salam Alayka Melody Experience */}
      {toolType === 'mawlid-melody' && (
        <div className="space-y-5">
          <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800">
            <h5 className="font-bold text-amber-300 mb-2">النغمات الأساسية للازمة "يا نبي سلام عليك"</h5>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              استمع للحن اللازمة المشهورة بالتدوين الصوتي المتتابع، وتدرّب على غنائها بالتوافق مع النغمات:
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { word: 'يا نبي', note: 'F3', tone: 'فا' },
                { word: 'سلام', note: 'G3', tone: 'صول' },
                { word: 'عليك', note: 'A3', tone: 'لا' },
                { word: 'يا رسول', note: 'Bb3', tone: 'سيb' },
                { word: 'سلام', note: 'A3', tone: 'لا' },
                { word: 'عليك', note: 'G3', tone: 'صول' },
                { word: 'يا حبيب', note: 'A3', tone: 'لا' },
                { word: 'سلام', note: 'G3', tone: 'صول' },
                { word: 'عليك', note: 'F3', tone: 'فا' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => synth.playNote(item.note, 0.6, 'triangle', 0.28)}
                  className="px-3 py-2 bg-stone-900 hover:bg-amber-600 hover:text-white rounded-lg border border-stone-800 text-center transition-colors group"
                >
                  <span className="block text-xs font-bold text-white group-hover:text-white">{item.word}</span>
                  <span className="block text-[10px] text-amber-400 group-hover:text-amber-100 font-mono">{item.tone}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const phrase = [
                  { note: 'F3', duration: 400 },
                  { note: 'G3', duration: 400 },
                  { note: 'A3', duration: 600 },
                  { note: 'Bb3', duration: 400 },
                  { note: 'A3', duration: 400 },
                  { note: 'G3', duration: 600 },
                  { note: 'A3', duration: 400 },
                  { note: 'G3', duration: 400 },
                  { note: 'F3', duration: 800 },
                ];
                phrase.forEach((item, index) => {
                  setTimeout(() => {
                    synth.playNote(item.note, 0.5, 'triangle', 0.28);
                  }, index * 450);
                });
              }}
              className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              عزف لحن اللازمة آلياً بالكامل
            </button>
          </div>
        </div>
      )}

      {/* Tool 6: Verdi & Romantic Era Opera Explorer */}
      {toolType === 'romantic-verdi' && (
        <div className="space-y-5">
          <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800">
            <h5 className="font-bold text-amber-300 mb-2">ثيمة مارش النصر (Triumphal March) - أوبرا عايدة</h5>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              استمع للمطلع الأسطوري لأبواق فيردي في أوبرا عايدة في مشهد النصر المهيب:
            </p>

            <button
              onClick={() => {
                // Aida March Theme excerpt (La major motif)
                const aidaNotes = [
                  { n: 'A3', d: 300 },
                  { n: 'A3', d: 300 },
                  { n: 'A3', d: 300 },
                  { n: 'C#4', d: 500 },
                  { n: 'A3', d: 300 },
                  { n: 'E4', d: 600 },
                  { n: 'D4', d: 250 },
                  { n: 'C#4', d: 250 },
                  { n: 'B3', d: 500 },
                  { n: 'A3', d: 700 },
                ];
                aidaNotes.forEach((noteItem, idx) => {
                  setTimeout(() => {
                    synth.playNote(noteItem.n, 0.45, 'sawtooth', 0.22);
                  }, idx * 360);
                });
              }}
              className="py-2.5 px-5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              عزف مطلع مارش النصر بأصوات الأبواق
            </button>
          </div>
        </div>
      )}

      {/* Tool 7: Virtual Piano Keyboard for Practical Piece */}
      {toolType === 'piano-practice' && (
        <div className="space-y-5">
          <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-bold text-amber-300">لوحة المفاتيح التعليمية للعزف التطبيقي</h5>
                <p className="text-xs text-stone-400">انقر على المفاتيح للعزف وتطبيق ترقيم الأصابع الدولي (1 الإبهام إلى 5 الخنصر)</p>
              </div>
              <span className="text-xs font-mono text-amber-400">سلم فا الكبير / سيb</span>
            </div>

            {/* Virtual Piano Keys container */}
            <div className="flex justify-center py-4 px-2 overflow-x-auto">
              <div className="relative flex select-none bg-stone-800 p-2 rounded-xl shadow-inner border border-stone-700">
                {pianoKeys.map((k) => (
                  <button
                    key={k.note}
                    onClick={() => {
                      setActiveKey(k.note);
                      synth.playNote(k.note, 0.7, 'triangle', 0.3);
                      setTimeout(() => setActiveKey(null), 300);
                    }}
                    className={`relative transition-transform active:translate-y-1 ${
                      k.isBlack
                        ? 'w-7 sm:w-9 h-28 bg-stone-900 border border-stone-950 text-white z-10 -mx-3.5 sm:-mx-4.5 rounded-b-md shadow-md hover:bg-stone-800'
                        : 'w-10 sm:w-12 h-44 bg-white border border-stone-300 text-stone-900 rounded-b-lg shadow hover:bg-amber-50'
                    } ${activeKey === k.note ? 'ring-2 ring-amber-500 bg-amber-100' : ''}`}
                  >
                    <div className="absolute bottom-2 inset-x-0 text-center">
                      <span className={`block text-[11px] font-bold ${k.isBlack ? 'text-amber-300' : 'text-stone-800'}`}>
                        {k.label}
                      </span>
                      {k.finger && (
                        <span className="block text-[9px] text-stone-400 font-mono">
                          إصبع {k.finger}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Guided Practice Melody Note-by-Note */}
            <div className="mt-4 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-stone-300">
                مقطوعة تدريبية مقترحة: <span className="text-amber-300 font-bold font-mono">فا - صول - لا - سيb - دو - لا - فا</span>
              </span>
              <button
                onClick={() => {
                  const demoNotes = ['F3', 'G3', 'A3', 'Bb3', 'C4', 'A3', 'F3'];
                  demoNotes.forEach((n, i) => {
                    setTimeout(() => {
                      setActiveKey(n);
                      synth.playNote(n, 0.45, 'triangle', 0.3);
                      setTimeout(() => setActiveKey(null), 350);
                    }, i * 400);
                  });
                }}
                className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                استماع للعزف النموذجي للمقطوعة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
