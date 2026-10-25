import React, { useState } from 'react';
import { X, Video, ExternalLink, RotateCcw, Check } from 'lucide-react';

interface CustomVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  currentVideoUrl: string;
  defaultVideoUrl: string;
  onSave: (newUrl: string) => void;
}

export function extractYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Already an embed url
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Short URL: youtu.be/VIDEO_ID or youtu.be/VIDEO_ID?si=...
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // Fallback to input if already formatted
  return trimmed;
}

export const CustomVideoModal: React.FC<CustomVideoModalProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  currentVideoUrl,
  defaultVideoUrl,
  onSave,
}) => {
  const [inputUrl, setInputUrl] = useState(currentVideoUrl);
  const [previewEmbedUrl, setPreviewEmbedUrl] = useState(extractYouTubeEmbedUrl(currentVideoUrl));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (val: string) => {
    setInputUrl(val);
    setErrorMsg(null);
    const parsed = extractYouTubeEmbedUrl(val);
    setPreviewEmbedUrl(parsed);
  };

  const handleResetToDefault = () => {
    setInputUrl(defaultVideoUrl);
    setPreviewEmbedUrl(defaultVideoUrl);
    setErrorMsg(null);
  };

  const handleSave = () => {
    const finalEmbed = extractYouTubeEmbedUrl(inputUrl);
    if (!finalEmbed || !finalEmbed.includes('youtube.com/embed/')) {
      setErrorMsg('يرجى التأكد من إدخال رابط يوتيوب صحيح (مثل: youtube.com/watch?v=... أو youtu.be/...)');
      return;
    }
    onSave(finalEmbed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">تعديل رابط مقطع اليوتيوب</h3>
              <p className="text-xs text-stone-500">{lessonTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              رابط فيديو يوتيوب (YouTube URL):
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-stone-900 font-mono text-left dir-ltr"
            />
            {errorMsg && (
              <p className="text-xs text-red-600 mt-1.5 font-medium">{errorMsg}</p>
            )}
            <p className="text-[11px] text-stone-400 mt-1.5">
              يمكنك لصق أي رابط فيديو عادي من يوتيوب وسيتم تحويله تلقائياً ليعمل في المشغل المدمج داخل الموقع.
            </p>
          </div>

          {/* Quick preview of embed */}
          {previewEmbedUrl && (
            <div className="rounded-xl overflow-hidden border border-stone-200 aspect-video bg-stone-900">
              <iframe
                src={previewEmbedUrl}
                title="معاينة الفيديو"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              استعادة الرابط التعليمي النموذجي
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                حفظ الرابط للمشغل
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
