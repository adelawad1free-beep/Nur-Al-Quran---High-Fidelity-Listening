
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, AlertCircle } from 'lucide-react';
import { Surah } from '../types';

interface AudioPlayerProps {
  currentSurah: Surah | null;
  onNext: () => void;
  onPrev: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentSurah, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (currentSurah && audioRef.current) {
      setError(null); // Reset error on new track
      audioRef.current.src = currentSurah.audioUrl;
      audioRef.current.load();
      
      if (isInitialMount.current) {
        isInitialMount.current = false;
        setIsPlaying(false);
        return;
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setError(null);
          })
          .catch(err => {
            console.warn("Playback interrupted or blocked:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSurah]);

  const togglePlay = () => {
    if (!audioRef.current || error) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleAudioError = () => {
    console.error("Audio element error: ", audioRef.current?.error);
    setError("عذراً، تعذر تشغيل هذا الملف الصوتي حالياً.");
    setIsPlaying(false);
  };

  if (!currentSurah) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[55] w-[92%] max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`bg-[#1A1A1A]/95 backdrop-blur-3xl border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-full p-2.5 shadow-2xl flex items-center justify-between gap-2 overflow-hidden transition-colors`}>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onNext}
          onError={handleAudioError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Info Area */}
        <div className="flex items-center gap-3 min-w-0 flex-1 ml-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0 border border-white/5">
            <img src={currentSurah.image} alt={currentSurah.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-white font-bold text-xs truncate quran-font">
              {error ? 'خطأ في التشغيل' : currentSurah.name}
            </h3>
            <p className={`${error ? 'text-red-400' : 'text-[#D4AF37]'} text-[9px] truncate opacity-80`}>
              {error || currentSurah.englishName}
            </p>
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex items-center gap-2">
          {!error ? (
            <>
              <button onClick={onPrev} className="text-gray-500 hover:text-white transition-colors p-1.5 active:scale-90">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 shadow-lg shadow-[#D4AF37]/20 transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button onClick={onNext} className="text-gray-500 hover:text-white transition-colors p-1.5 active:scale-90">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => { setError(null); audioRef.current?.load(); }}
              className="w-10 h-10 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
              title="إعادة المحاولة"
            >
              <AlertCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-2 pr-4">
           <Heart className="w-4 h-4 text-gray-500" />
        </div>

        {/* Subtle Progress Bar Bottom Line */}
        {!error && (
          <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-white/5">
            <div 
              className="h-full bg-[#D4AF37] transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
