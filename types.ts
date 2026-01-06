
export interface Surah {
  id: number;
  name: string;
  englishName: string;
  versesCount: number;
  type: 'Meccan' | 'Medinan';
  audioUrl: string;
  image: string;
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
  image: string;
}

export interface PlayerState {
  currentSurah: Surah | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

export interface SearchResult {
  title: string;
  reciter: string;
  url: string;
  source: string;
}
