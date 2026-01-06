
import { Surah, Reciter } from './types';

export const SURAHS: Surah[] = [
  {
    id: 1,
    name: "الفاتحة",
    englishName: "Al-Fatiha",
    versesCount: 7,
    type: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/001.mp3",
    image: "https://picsum.photos/seed/fatiha/800/800"
  },
  {
    id: 18,
    name: "الكهف",
    englishName: "Al-Kahf",
    versesCount: 110,
    type: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/018.mp3",
    image: "https://picsum.photos/seed/kahf/800/800"
  },
  {
    id: 36,
    name: "يس",
    englishName: "Ya-Sin",
    versesCount: 83,
    type: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/036.mp3",
    image: "https://picsum.photos/seed/yasin/800/800"
  },
  {
    id: 55,
    name: "الرحمن",
    englishName: "Ar-Rahman",
    versesCount: 78,
    type: "Medinan",
    audioUrl: "https://server8.mp3quran.net/afs/055.mp3",
    image: "https://picsum.photos/seed/rahman/800/800"
  },
  {
    id: 56,
    name: "الواقعة",
    englishName: "Al-Waqi'a",
    versesCount: 96,
    type: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/056.mp3",
    image: "https://picsum.photos/seed/waqia/800/800"
  },
  {
    id: 67,
    name: "الملك",
    englishName: "Al-Mulk",
    versesCount: 30,
    type: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/067.mp3",
    image: "https://picsum.photos/seed/mulk/800/800"
  }
];

export const RECITERS: Reciter[] = [
  {
    id: "afs",
    name: "مشاري العفاسي",
    style: "Murattal",
    image: "https://picsum.photos/seed/mishary/200/200"
  },
  {
    id: "sudais",
    name: "عبد الرحمن السديس",
    style: "Haram",
    image: "https://picsum.photos/seed/sudais/200/200"
  },
  {
    id: "shuraim",
    name: "سعود الشريم",
    style: "Classic",
    image: "https://picsum.photos/seed/shuraim/200/200"
  }
];
