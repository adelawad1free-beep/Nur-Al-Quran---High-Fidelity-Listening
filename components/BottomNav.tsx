
import React from 'react';
import { Heart, Music, List, Mic2, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onSearchClick }) => {
  const tabs = [
    { id: 'surah', label: 'السور', icon: <Music className="w-5 h-5" /> },
    { id: 'reciters', label: 'القراء', icon: <Mic2 className="w-5 h-5" /> },
    { id: 'favorites', label: 'المفضلة', icon: <Heart className="w-5 h-5" /> },
    { id: 'juz', label: 'الأجزاء', icon: <List className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-[#1A1A1A]/90 backdrop-blur-3xl border-t border-white/5 z-[60] px-4 md:px-12 flex items-center justify-between pb-4">
      <div className="flex flex-1 justify-around items-center">
        {tabs.slice(0, 2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === tab.id ? 'text-[#D4AF37]' : 'text-gray-500'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? 'bg-[#D4AF37]/10 scale-110 shadow-lg shadow-[#D4AF37]/5' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Central Navigation Button */}
      <div className="relative -top-8">
        <button
          onClick={() => {
            setActiveTab('surah');
            onSearchClick();
          }}
          className="w-16 h-16 bg-[#D4AF37] rounded-[2rem] flex items-center justify-center text-black shadow-2xl shadow-[#D4AF37]/40 hover:scale-110 active:scale-95 transition-all group border-4 border-[#0F0F0F]"
        >
          <LayoutGrid className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      <div className="flex flex-1 justify-around items-center">
        {tabs.slice(2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === tab.id ? 'text-[#D4AF37]' : 'text-gray-500'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? 'bg-[#D4AF37]/10 scale-110 shadow-lg shadow-[#D4AF37]/5' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
