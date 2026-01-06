
import React from 'react';
import { Play, Plus, Heart } from 'lucide-react';
import { Surah } from '../types';

interface SurahCardProps {
  surah: Surah;
  isActive: boolean;
  isFavorite: boolean;
  onPlay: (surah: Surah) => void;
  onToggleFavorite: () => void;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah, isActive, isFavorite, onPlay, onToggleFavorite }) => {
  return (
    <div className="group relative flex flex-col bg-[#1A1A1A] rounded-[2.5rem] p-4 transition-all duration-500 hover:bg-[#222222] border border-white/5 hover:border-[#D4AF37]/30 hover:-translate-y-2 cursor-pointer">
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#151515]" onClick={() => onPlay(surah)}>
        <img 
          src={surah.image} 
          alt={surah.name} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-xl shadow-[#D4AF37]/30">
            <Play className="w-8 h-8 text-black fill-current ml-1" />
          </div>
        </div>

        <div className="absolute bottom-4 right-4">
           <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] text-[#D4AF37] font-bold tracking-widest uppercase">
            {surah.type}
           </span>
        </div>
      </div>

      <div className="mt-6 px-2 flex justify-between items-end">
        <div onClick={() => onPlay(surah)} className="flex-1">
          <h3 className="text-white text-xl font-bold quran-font">{surah.name}</h3>
          <p className="text-gray-500 text-xs mt-1">{surah.englishName} {surah.versesCount > 0 && `• ${surah.versesCount} آية`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 transition-all ${isFavorite ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div onClick={() => onPlay(surah)} className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {isActive && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#1A1A1A] animate-pulse" />
      )}
    </div>
  );
};

export default SurahCard;
