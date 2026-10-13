import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Check,
  Share2
} from 'lucide-react';

interface DuaItem {
  id: string;
  category: 'morning_evening' | 'anxiety' | 'forgiveness' | 'rabbana' | 'protection' | 'daily';
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  reference: string;
  benefit: string;
  recommendedRepeat: number;
}

const DUAS_COLLECTION: DuaItem[] = [
  {
    id: 'sayyid_istighfar',
    category: 'forgiveness',
    title: 'Sayyid al-Istighfar (Master of Seeking Forgiveness)',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana ‘abduka, wa ana ‘ala ‘ahdika wa wa‘dika mastata‘tu, a‘udhu bika min sharri ma sana‘tu, abu’u laka bini‘matika ‘alayya, wa abu’u bidhanbi faghfir li, fa-innahu la yaghfiru al-dhunuba illa Anta.',
    translation: 'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best as I can. I seek refuge in You from the evil I have committed. I acknowledge Your favors upon me, and I confess my sins, so forgive me, for none forgives sins except You.',
    reference: 'Sahih al-Bukhari 6306',
    benefit: 'Whoever recites this during the day with conviction and dies that day, enters Paradise.',
    recommendedRepeat: 1,
  },
  {
    id: 'ayat_al_kursi_dua',
    category: 'protection',
    title: 'Ayat al-Kursi (The Throne Verse Protection)',
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    transliteration: 'Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta’khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard...',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
    reference: 'Surah Al-Baqarah 2:255',
    benefit: 'Recite after each fard prayer and before sleeping; an angel guards you until morning.',
    recommendedRepeat: 1,
  },
  {
    id: 'anxiety_relief',
    category: 'anxiety',
    title: 'Dua for Anxiety, Sorrow & Debt',
    arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    transliteration: 'Allahumma inni a‘udhu bika minal-hammi wal-hazan, wal-‘ajzi wal-kasal, wal-bukhli wal-jubn, wa dala‘id-dayni wa ghalabatir-rijal.',
    translation: 'O Allah, I seek refuge in You from anxiety and grief, helplessness and laziness, miserliness and cowardice, the burden of debt, and being overpowered by men.',
    reference: 'Sahih al-Bukhari 2893',
    benefit: 'Dispels overwhelming sorrow, clears heavy debts, and restores inner tranquility.',
    recommendedRepeat: 3,
  },
  {
    id: 'rabbana_atinah',
    category: 'rabbana',
    title: 'Good in This World & the Hereafter',
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina ‘adhaban-nar.',
    translation: 'Our Lord! Give us in this world that which is good and in the Hereafter that which is good, and save us from the torment of the Fire.',
    reference: 'Surah Al-Baqarah 2:201',
    benefit: 'The most frequent supplication of the Prophet Muhammad (peace be upon him).',
    recommendedRepeat: 3,
  },
  {
    id: 'morning_protection',
    category: 'morning_evening',
    title: 'Supreme Shield Against Harm',
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma‘as-mihi shay’un fil-ardi wa la fis-sama’i wa Huwas-Sami‘ul-‘Alim.',
    translation: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    reference: 'Sunan Abu Dawud 5088 (Sahih)',
    benefit: 'Whoever recites this thrice morning and evening will not be harmed by anything.',
    recommendedRepeat: 3,
  },
  {
    id: 'tawakkul_exit',
    category: 'daily',
    title: 'Dua When Leaving the Home',
    arabicText: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi, tawakkaltu ‘alallahi, wa la hawla wa la quwwata illa billah.',
    translation: 'In the Name of Allah, I place my trust in Allah, and there is no power nor might except with Allah.',
    reference: 'Sunan Abi Dawud 5095 (Sahih)',
    benefit: 'Angels proclaim: "You have been guided, defended, and protected," and Shaytan retreats.',
    recommendedRepeat: 1,
  },
];

export const DuasTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [savedFavorites, setSavedFavorites] = useState<Record<string, boolean>>({
    sayyid_istighfar: true,
    ayat_al_kursi_dua: true,
  });
  const [activeAudioDua, setActiveAudioDua] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Duas' },
    { id: 'morning_evening', label: 'Adhkar' },
    { id: 'anxiety', label: 'Anxiety & Relief' },
    { id: 'rabbana', label: 'Rabbana (Quran)' },
    { id: 'protection', label: 'Protection' },
    { id: 'forgiveness', label: 'Forgiveness' },
    { id: 'daily', label: 'Daily Life' },
  ];

  const filteredDuas = DUAS_COLLECTION.filter((dua) => {
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    const matchesSearch = 
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleIncrement = (id: string, max: number) => {
    setCounters((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.min(max, current + 1) };
    });
  };

  const handleReset = (id: string) => {
    setCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  const toggleFavorite = (id: string) => {
    setSavedFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAudio = (id: string) => {
    if (activeAudioDua === id) {
      setActiveAudioDua(null);
    } else {
      setActiveAudioDua(id);
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* Top Banner */}
      <div className="ios-glass-card rounded-3xl p-5 border border-emerald-500/25 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Hisn al-Muslim
          </span>
          <span className="text-[11px] text-stone-400">Authentic Supplications</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mt-1">
          Fortress of the Muslim
        </h1>
        <p className="text-xs text-stone-300 mt-1 leading-relaxed max-w-sm">
          Daily Quranic & prophetic supplications to protect your heart, ease hardship, and draw closer to Allah.
        </p>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, keyword, or emotion..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 px-1 pb-1 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Duas List */}
      <div className="space-y-3.5">
        {filteredDuas.map((dua) => {
          const currentCount = counters[dua.id] || 0;
          const isCompleted = currentCount >= dua.recommendedRepeat;
          const isFav = savedFavorites[dua.id];
          const isAudioPlaying = activeAudioDua === dua.id;

          return (
            <div
              key={dua.id}
              className="ios-glass-card rounded-3xl p-4.5 border border-stone-800/80 space-y-3 relative overflow-hidden transition-all hover:border-emerald-500/30"
            >
              {/* Header: Title & Actions */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white tracking-tight leading-snug">
                    {dua.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-emerald-400 font-mono font-medium">
                      {dua.reference}
                    </span>
                    <span className="text-[10px] text-stone-500">•</span>
                    <span className="text-[10px] text-stone-400">
                      Repeat {dua.recommendedRepeat}x
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleAudio(dua.id)}
                    className={`p-2 rounded-full border transition active:scale-95 ${
                      isAudioPlaying
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                    title="Audio Recitation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(dua.id)}
                    className={`p-2 rounded-full border transition active:scale-95 ${
                      isFav
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                    title="Save to favorites"
                  >
                    {isFav ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Arabic Calligraphy Text */}
              <div className="py-2 px-3 rounded-2xl bg-stone-950/60 border border-white/5 text-right font-amiri text-lg text-emerald-100 leading-loose">
                {dua.arabicText}
              </div>

              {/* Transliteration */}
              <div className="text-xs text-amber-200/90 italic leading-relaxed">
                "{dua.transliteration}"
              </div>

              {/* English Translation */}
              <div className="text-xs text-stone-300 leading-relaxed">
                {dua.translation}
              </div>

              {/* Virtue & Benefit Note */}
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{dua.benefit}</span>
              </div>

              {/* Counter / Tally Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleIncrement(dua.id, dua.recommendedRepeat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/25'
                        : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Completed ({currentCount}/{dua.recommendedRepeat})</span>
                      </>
                    ) : (
                      <>
                        <span>Tap to Count ({currentCount}/{dua.recommendedRepeat})</span>
                      </>
                    )}
                  </button>

                  {currentCount > 0 && (
                    <button
                      onClick={() => handleReset(dua.id)}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
                      title="Reset counter"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-stone-500 font-mono">
                  {isCompleted ? '✓ Sunnah Fulfilled' : `${dua.recommendedRepeat - currentCount} remaining`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
