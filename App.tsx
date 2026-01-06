
import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import SurahCard from './components/SurahCard';
import AudioPlayer from './components/AudioPlayer';
import { SURAHS, RECITERS } from './constants';
import { Surah, SearchResult, Reciter } from './types';
import { Search, Star, Sparkles, Loader2, PlayCircle, Music, ChevronLeft, HeartHandshake, Heart } from 'lucide-react';
import { getDailyReflection, searchRecitations, fetchReciterMushaf } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(SURAHS[0]);
  const [dailyReflection, setDailyReflection] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Favorites State
  const [favorites, setFavorites] = useState<Surah[]>(() => {
    const saved = localStorage.getItem('nur_al_quran_favs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('nur_al_quran_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (surah: Surah) => {
    setFavorites(prev => {
      const isFav = prev.find(f => f.audioUrl === surah.audioUrl);
      if (isFav) {
        return prev.filter(f => f.audioUrl !== surah.audioUrl);
      } else {
        return [...prev, surah];
      }
    });
  };

  const isSurahFavorite = (url: string) => favorites.some(f => f.audioUrl === url);

  // Search State
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<SearchResult[]>([]);
  const [isInvalidQuery, setIsInvalidQuery] = useState(false);
  
  // Reciter Mushaf State
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [reciterTracks, setReciterTracks] = useState<any[]>([]);
  const [isLoadingMushaf, setIsLoadingMushaf] = useState(false);

  useEffect(() => {
    const fetchReflection = async () => {
      setLoadingAI(true);
      const data = await getDailyReflection();
      if (data) setDailyReflection(data);
      setLoadingAI(false);
    };
    fetchReflection();
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return SURAHS;
    return SURAHS.filter(s => 
      s.name.includes(searchQuery) || 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const validateSearchQuery = (query: string): boolean => {
    const forbiddenKeywords = ['موسيقى', 'اغاني', 'أغنية', 'طرب', 'رقص', 'فيديو كليب', 'music', 'song', 'dance', 'movie', 'مسلسل'];
    const lowerQuery = query.toLowerCase();
    return !forbiddenKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsInvalidQuery(false);
    
    if (!validateSearchQuery(searchQuery)) {
      setIsInvalidQuery(true);
      setAiSearchResults([]);
      return;
    }

    setIsSearchingAI(true);
    setAiSearchResults([]);
    
    const { results } = await searchRecitations(searchQuery);
    
    if (results.length === 0) {
      setIsInvalidQuery(true);
    } else {
      setAiSearchResults(results);
    }
    setIsSearchingAI(false);
  };

  const handleReciterClick = async (reciter: Reciter) => {
    setSelectedReciter(reciter);
    setIsLoadingMushaf(true);
    setReciterTracks([]);
    
    const { results } = await fetchReciterMushaf(reciter.name);
    setReciterTracks(results);
    setIsLoadingMushaf(false);
  };

  const handlePlayTrack = (track: any, reciter: string) => {
    const tempSurah: Surah = {
      id: Math.random(),
      name: track.title,
      englishName: reciter,
      versesCount: 0,
      type: 'Meccan',
      audioUrl: track.url,
      image: `https://picsum.photos/seed/${encodeURIComponent(reciter)}/800/800`
    };
    setCurrentSurah(tempSurah);
  };

  const handlePlaySearchResult = (result: SearchResult) => {
    const tempSurah: Surah = {
      id: Math.random(),
      name: result.title,
      englishName: result.reciter,
      versesCount: 0,
      type: 'Meccan',
      audioUrl: result.url,
      image: `https://picsum.photos/seed/${encodeURIComponent(result.reciter)}/800/800`
    };
    setCurrentSurah(tempSurah);
    setAiSearchResults([]); 
    setSearchQuery('');
  };

  const handleNext = () => {
    const playlist = activeTab === 'favorites' ? favorites : SURAHS;
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.audioUrl === currentSurah?.audioUrl);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSurah(playlist[nextIndex]);
  };

  const handlePrev = () => {
    const playlist = activeTab === 'favorites' ? favorites : SURAHS;
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.audioUrl === currentSurah?.audioUrl);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSurah(playlist[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-64 text-right" dir="rtl">
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0F0F0F]/80 backdrop-blur-2xl border-b border-white/5 px-6 pt-10 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">نور القرآن</h1>
              <p className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase">القرآن الكريم</p>
            </div>
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center border border-white/5">
               <Star className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          
          <form onSubmit={handleAISearch} className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              {isSearchingAI ? (
                <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
              )}
            </div>
            <input
              type="text"
              placeholder="ابحث عن قارئ، سورة أو تلاوة..."
              className="bg-[#1A1A1A] border border-white/5 text-white text-sm rounded-2xl focus:ring-1 focus:ring-[#D4AF37]/30 block w-full pl-10 py-4 pr-6 placeholder-gray-600 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (isInvalidQuery) setIsInvalidQuery(false);
              }}
            />
          </form>
        </div>
      </header>

      <main className="px-6 max-w-7xl mx-auto pt-44">
        
        {isInvalidQuery && (
          <div className="mb-12 animate-in zoom-in duration-500">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border border-[#D4AF37]/20 rounded-[2.5rem] p-10 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none" />
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 shadow-2xl shadow-[#D4AF37]/5">
                  <HeartHandshake className="w-10 h-10 text-[#D4AF37]" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-4">واحة السكينة والنور</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                عذراً، هذا التطبيق خُصص ليكون واحةً للسكينة ونوراً للقلوب عبر آيات الذكر الحكيم وتلاوات القراء العذبة فقط.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl inline-block border border-white/5">
                <p className="text-[#D4AF37] quran-font text-lg italic">
                  "إنّ في ترتيل القرآن حياةً للروح وطهارةً للنفس.. فاجعل سماعك هنا باباً للططمأنينة."
                </p>
              </div>
              <button onClick={() => setIsInvalidQuery(false)} className="block mx-auto mt-8 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">العودة للرئيسية</button>
            </div>
          </div>
        )}

        {aiSearchResults.length > 0 && !isInvalidQuery && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                 نتائج البحث الذكي
               </h2>
               <button onClick={() => setAiSearchResults([])} className="text-gray-500 text-sm">إغلاق</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSearchResults.map((result, idx) => (
                <div 
                  key={idx} 
                  className="glass-card p-5 rounded-[2rem] border border-white/5 hover:border-[#D4AF37]/40 transition-all group flex items-center gap-4 cursor-pointer"
                >
                  <div onClick={() => handlePlaySearchResult(result)} className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div onClick={() => handlePlaySearchResult(result)} className="flex-1 text-right">
                    <h3 className="text-base font-bold text-white quran-font">{result.title}</h3>
                    <p className="text-gray-400 text-[10px]">بصوت {result.reciter} • {result.source}</p>
                  </div>
                  <button 
                    onClick={() => handlePlaySearchResult(result)} 
                    className={`p-2 rounded-full transition-colors ${isSurahFavorite(result.url) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${isSurahFavorite(result.url) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'surah' && !selectedReciter && aiSearchResults.length === 0 && !isInvalidQuery && (
          <div className="mb-12">
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#161616] to-[#0D0D0D] border border-white/5 min-h-[260px] flex items-center justify-center text-center p-6 md:p-12">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#D4AF37]/5 blur-[80px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 blur-[70px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
              <div className="relative z-10 max-w-2xl flex flex-col items-center">
                <div className="flex items-center gap-2 mb-5 bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-[9px] font-bold tracking-widest uppercase">تأمل اليوم</span>
                </div>
                {loadingAI ? (
                  <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
                    <div className="h-8 bg-white/5 rounded-full w-3/4" />
                    <div className="h-4 bg-white/5 rounded-full w-2/3" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.4] quran-font drop-shadow-2xl">{dailyReflection?.verse || "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"}</h2>
                    <p className="text-gray-400 text-sm md:text-base mb-6 font-light leading-relaxed max-w-xl px-4 italic opacity-80">{dailyReflection?.reflection || "بشرى ربانية بأن كل ضيق يعقبه اتساع، وكل كربة تنتهي بفرج قريب بإذن الله."}</p>
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="w-6 h-[1px] bg-white/10" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37]">سورة {dailyReflection?.surahName || "الشرح"}</span>
                      <div className="w-6 h-[1px] bg-white/10" />
                    </div>
                  </>
                )}
              </div>
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/10 rounded-tl-xl pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/10 rounded-br-xl pointer-events-none" />
            </div>
          </div>
        )}

        {activeTab === 'surah' && aiSearchResults.length === 0 && (
          <section className="mb-12 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-8">تلاوات مميزة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSurahs.map((surah) => (
                <SurahCard 
                  key={surah.id} 
                  surah={surah} 
                  isActive={currentSurah?.audioUrl === surah.audioUrl} 
                  isFavorite={isSurahFavorite(surah.audioUrl)}
                  onPlay={setCurrentSurah} 
                  onToggleFavorite={() => toggleFavorite(surah)}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'favorites' && (
          <section className="mb-12 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              المفضلة
            </h2>
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500 glass-card rounded-[3rem]">
                <Heart className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">لا يوجد لديك تلاوات مفضلة بعد</p>
                <p className="text-sm opacity-60 mt-1">ابدأ بحفظ ما تحب ليكون هنا دائماً</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((surah) => (
                  <SurahCard 
                    key={surah.id} 
                    surah={surah} 
                    isActive={currentSurah?.audioUrl === surah.audioUrl} 
                    isFavorite={true}
                    onPlay={setCurrentSurah} 
                    onToggleFavorite={() => toggleFavorite(surah)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'reciters' && (
          <section className="mb-12 animate-in fade-in duration-500">
            {!selectedReciter ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-8">أجمل الأصوات</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {RECITERS.map((reciter) => (
                    <div key={reciter.id} onClick={() => handleReciterClick(reciter)} className="glass-card p-6 rounded-[2.5rem] group hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer border border-white/5 text-center flex flex-col items-center">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden mb-4 border-2 border-white/5 shadow-xl group-hover:border-[#D4AF37]/50 transition-all">
                        <img src={reciter.image} alt={reciter.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#D4AF37] transition-colors">{reciter.name}</h4>
                      <p className="text-gray-500 text-[10px] uppercase tracking-tighter">{reciter.style}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-in slide-in-from-left-4 duration-500">
                <button onClick={() => setSelectedReciter(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold">العودة للقائمة</span>
                </button>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-[#D4AF37]/20 shadow-2xl">
                    <img src={selectedReciter.image} alt={selectedReciter.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center md:text-right">
                    <h2 className="text-3xl font-bold text-white mb-2 quran-font">{selectedReciter.name}</h2>
                    <p className="text-[#D4AF37] font-medium">المصحف المرتل الكامل • تشغيل مباشر</p>
                  </div>
                </div>
                {isLoadingMushaf ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader2 className="w-12 h-12 mb-4 text-[#D4AF37] animate-spin" />
                    <p>جارٍ جمع السور والمصادر بصوت القارئ...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reciterTracks.map((track, idx) => {
                       const trackSurah: Surah = {
                         id: Math.random(),
                         name: track.title,
                         englishName: selectedReciter.name,
                         versesCount: 0,
                         type: 'Meccan',
                         audioUrl: track.url,
                         image: selectedReciter.image
                       };
                       return (
                        <div key={idx} className="glass-card p-5 rounded-[2rem] border border-white/5 hover:border-[#D4AF37]/40 transition-all group flex items-center justify-between cursor-pointer">
                          <div onClick={() => setCurrentSurah(trackSurah)} className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                              <Music className="w-5 h-5" />
                            </div>
                            <span className="text-white font-bold quran-font text-lg">{track.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleFavorite(trackSurah)} 
                              className={`p-2 transition-colors ${isSurahFavorite(track.url) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                            >
                              <Heart className={`w-5 h-5 ${isSurahFavorite(track.url) ? 'fill-current' : ''}`} />
                            </button>
                            <PlayCircle onClick={() => setCurrentSurah(trackSurah)} className="w-6 h-6 text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
                          </div>
                        </div>
                       );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      <AudioPlayer currentSurah={currentSurah} onNext={handleNext} onPrev={handlePrev} />
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'reciters') setSelectedReciter(null);
          setIsInvalidQuery(false);
          setAiSearchResults([]);
        }} 
        onSearchClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
      />
    </div>
  );
};

export default App;
