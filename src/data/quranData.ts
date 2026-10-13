import { Surah, Ayah, Reciter } from '../types';

export const RECITERS: Reciter[] = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    subname: 'Clear & Melodic (Kuwait)',
    identifier: 'ar.alafasy',
    audioSubfolder: 'Alafasy_128kbps',
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    subname: 'Master of Tajweed (Egypt)',
    identifier: 'ar.husary',
    audioSubfolder: 'Husary_128kbps',
  },
  {
    id: 'ar.abdulbasitmurattal',
    name: 'Abdul Basit Murattal',
    subname: 'Golden Era Voice (Egypt)',
    identifier: 'ar.abdulbasitmurattal',
    audioSubfolder: 'Abdul_Basit_Murattal_192kbps',
  },
  {
    id: 'ar.saadalghamidi',
    name: 'Saad Al-Ghamdi',
    subname: 'Heart-touching (Saudi Arabia)',
    identifier: 'ar.saadalghamidi',
    audioSubfolder: 'Ghamadi_40kbps',
  },
];

export const SURAHS_LIST: Surah[] = [
  { number: 1, name: "سُورَةُ الفَاتِحَةِ", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", pageStart: 1, juzStart: 1 },
  { number: 2, name: "سُورَةُ البَقَرَةِ", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", pageStart: 2, juzStart: 1 },
  { number: 3, name: "سُورَةُ آلِ عِمْرَانَ", englishName: "Ali 'Imran", englishNameTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan", pageStart: 50, juzStart: 3 },
  { number: 4, name: "سُورَةُ النِّسَاءِ", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan", pageStart: 77, juzStart: 4 },
  { number: 5, name: "سُورَةُ المَائِدَةِ", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan", pageStart: 106, juzStart: 6 },
  { number: 6, name: "سُورَةُ الأَنْعَامِ", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan", pageStart: 128, juzStart: 7 },
  { number: 7, name: "سُورَةُ الأَعْرَافِ", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan", pageStart: 151, juzStart: 8 },
  { number: 8, name: "سُورَةُ الأَنْفَالِ", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan", pageStart: 177, juzStart: 9 },
  { number: 9, name: "سُورَةُ التَّوْبَةِ", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan", pageStart: 187, juzStart: 10 },
  { number: 10, name: "سُورَةُ يُونُسَ", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan", pageStart: 208, juzStart: 11 },
  { number: 11, name: "سُورَةُ هُودٍ", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan", pageStart: 221, juzStart: 11 },
  { number: 12, name: "سُورَةُ يُوسُفَ", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan", pageStart: 235, juzStart: 12 },
  { number: 13, name: "سُورَةُ الرَّعْدِ", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan", pageStart: 249, juzStart: 13 },
  { number: 14, name: "سُورَةُ إِبْرَاهِيمَ", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan", pageStart: 255, juzStart: 13 },
  { number: 15, name: "سُورَةُ الحِجْرِ", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan", pageStart: 262, juzStart: 14 },
  { number: 16, name: "سُورَةُ النَّحْلِ", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan", pageStart: 267, juzStart: 14 },
  { number: 17, name: "سُورَةُ الإِسْرَاءِ", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan", pageStart: 282, juzStart: 15 },
  { number: 18, name: "سُورَةُ الكَهْفِ", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan", pageStart: 293, juzStart: 15 },
  { number: 19, name: "سُورَةُ مَرْيَمَ", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan", pageStart: 305, juzStart: 16 },
  { number: 20, name: "سُورَةُ طه", englishName: "Taha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan", pageStart: 312, juzStart: 16 },
  { number: 21, name: "سُورَةُ الأَنْبِيَاءِ", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan", pageStart: 322, juzStart: 17 },
  { number: 22, name: "سُورَةُ الحَجِّ", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan", pageStart: 332, juzStart: 17 },
  { number: 23, name: "سُورَةُ المُؤْمِنُونَ", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan", pageStart: 342, juzStart: 18 },
  { number: 24, name: "سُورَةُ النُّورِ", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan", pageStart: 350, juzStart: 18 },
  { number: 25, name: "سُورَةُ الفُرْقَانِ", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan", pageStart: 359, juzStart: 18 },
  { number: 26, name: "سُورَةُ الشُّعَرَاءِ", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan", pageStart: 367, juzStart: 19 },
  { number: 27, name: "سُورَةُ النَّمْلِ", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan", pageStart: 377, juzStart: 19 },
  { number: 28, name: "سُورَةُ القَصَصِ", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan", pageStart: 385, juzStart: 20 },
  { number: 29, name: "سُورَةُ العَنْكَبُوتِ", englishName: "Al-'Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan", pageStart: 396, juzStart: 20 },
  { number: 30, name: "سُورَةُ الرُّومِ", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan", pageStart: 404, juzStart: 21 },
  { number: 31, name: "سُورَةُ لُقْمَانَ", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", pageStart: 411, juzStart: 21 },
  { number: 32, name: "سُورَةُ السَّجْدَةِ", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan", pageStart: 415, juzStart: 21 },
  { number: 33, name: "سُورَةُ الأَحْزَابِ", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan", pageStart: 418, juzStart: 21 },
  { number: 34, name: "سُورَةُ سَبَإٍ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan", pageStart: 428, juzStart: 22 },
  { number: 35, name: "سُورَةُ فَاطِرٍ", englishName: "Fatir", englishNameTranslation: "Originator", numberOfAyahs: 45, revelationType: "Meccan", pageStart: 434, juzStart: 22 },
  { number: 36, name: "سُورَةُ يس", englishName: "Ya-Sin", englishNameTranslation: "Ya-Sin", numberOfAyahs: 83, revelationType: "Meccan", pageStart: 440, juzStart: 22 },
  { number: 37, name: "سُورَةُ الصَّافَّاتِ", englishName: "As-Saffat", englishNameTranslation: "Those who set the Ranks", numberOfAyahs: 182, revelationType: "Meccan", pageStart: 446, juzStart: 23 },
  { number: 38, name: "سُورَةُ ص", englishName: "Sad", englishNameTranslation: "Sad", numberOfAyahs: 88, revelationType: "Meccan", pageStart: 453, juzStart: 23 },
  { number: 39, name: "سُورَةُ الزُّمَرِ", englishName: "Az-Zumar", englishNameTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan", pageStart: 458, juzStart: 23 },
  { number: 40, name: "سُورَةُ غَافِرٍ", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan", pageStart: 467, juzStart: 24 },
  { number: 41, name: "سُورَةُ فُصِّلَتْ", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan", pageStart: 477, juzStart: 24 },
  { number: 42, name: "سُورَةُ الشُّورَى", englishName: "Ash-Shura", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan", pageStart: 483, juzStart: 25 },
  { number: 43, name: "سُورَةُ الزُّخْرُفِ", englishName: "Az-Zukhruf", englishNameTranslation: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan", pageStart: 489, juzStart: 25 },
  { number: 44, name: "سُورَةُ الدُّخَانِ", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan", pageStart: 496, juzStart: 25 },
  { number: 45, name: "سُورَةُ الجَاثِيَةِ", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan", pageStart: 499, juzStart: 25 },
  { number: 46, name: "سُورَةُ الأَحْقَافِ", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan", pageStart: 502, juzStart: 26 },
  { number: 47, name: "سُورَةُ مُحَمَّدٍ", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", pageStart: 507, juzStart: 26 },
  { number: 48, name: "سُورَةُ الفَتْحِ", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan", pageStart: 511, juzStart: 26 },
  { number: 49, name: "سُورَةُ الحُجُرَاتِ", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan", pageStart: 515, juzStart: 26 },
  { number: 50, name: "سُورَةُ ق", englishName: "Qaf", englishNameTranslation: "Qaf", numberOfAyahs: 45, revelationType: "Meccan", pageStart: 518, juzStart: 26 },
  { number: 51, name: "سُورَةُ الذَّارِيَاتِ", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan", pageStart: 520, juzStart: 26 },
  { number: 52, name: "سُورَةُ الطُّورِ", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan", pageStart: 523, juzStart: 27 },
  { number: 53, name: "سُورَةُ النَّجْمِ", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan", pageStart: 526, juzStart: 27 },
  { number: 54, name: "سُورَةُ القَمَرِ", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan", pageStart: 528, juzStart: 27 },
  { number: 55, name: "سُورَةُ الرَّحْمَٰن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan", pageStart: 531, juzStart: 27 },
  { number: 56, name: "سُورَةُ الوَاقِعَةِ", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan", pageStart: 534, juzStart: 27 },
  { number: 57, name: "سُورَةُ الحَدِيدِ", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan", pageStart: 537, juzStart: 27 },
  { number: 58, name: "سُورَةُ المُجَادِلَةِ", englishName: "Al-Mujadila", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan", pageStart: 542, juzStart: 28 },
  { number: 59, name: "سُورَةُ الحَشْرِ", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan", pageStart: 545, juzStart: 28 },
  { number: 60, name: "سُورَةُ المُمْتَحَنَةِ", englishName: "Al-Mumtahanah", englishNameTranslation: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan", pageStart: 549, juzStart: 28 },
  { number: 61, name: "سُورَةُ الصَّفِّ", englishName: "As-Saff", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan", pageStart: 551, juzStart: 28 },
  { number: 62, name: "سُورَةُ الجُمُعَةِ", englishName: "Al-Jumu'ah", englishNameTranslation: "The Congregation, Friday", numberOfAyahs: 11, revelationType: "Medinan", pageStart: 553, juzStart: 28 },
  { number: 63, name: "سُورَةُ المُنَافِقُونَ", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan", pageStart: 554, juzStart: 28 },
  { number: 64, name: "سُورَةُ التَّغَابُنِ", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan", pageStart: 556, juzStart: 28 },
  { number: 65, name: "سُورَةُ الطَّلَاقِ", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan", pageStart: 558, juzStart: 28 },
  { number: 66, name: "سُورَةُ التَّحْرِيمِ", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan", pageStart: 560, juzStart: 28 },
  { number: 67, name: "سُورَةُ المُلْكِ", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan", pageStart: 562, juzStart: 29 },
  { number: 68, name: "سُورَةُ القَلَمِ", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan", pageStart: 564, juzStart: 29 },
  { number: 69, name: "سُورَةُ الحَاقَّةِ", englishName: "Al-Haqqah", englishNameTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan", pageStart: 566, juzStart: 29 },
  { number: 70, name: "سُورَةُ المَعَارِجِ", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan", pageStart: 568, juzStart: 29 },
  { number: 71, name: "سُورَةُ نُوحٍ", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan", pageStart: 570, juzStart: 29 },
  { number: 72, name: "سُورَةُ الجِنِّ", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan", pageStart: 572, juzStart: 29 },
  { number: 73, name: "سُورَةُ المُزَّمِّلِ", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan", pageStart: 574, juzStart: 29 },
  { number: 74, name: "سُورَةُ المُدَّثِّرِ", englishName: "Al-Muddathir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan", pageStart: 575, juzStart: 29 },
  { number: 75, name: "سُورَةُ القِيَامَةِ", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan", pageStart: 577, juzStart: 29 },
  { number: 76, name: "سُورَةُ الإِنْسَانِ", englishName: "Al-Insan", englishNameTranslation: "The Man", numberOfAyahs: 31, revelationType: "Medinan", pageStart: 578, juzStart: 29 },
  { number: 77, name: "سُورَةُ المُرْسَلَاتِ", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan", pageStart: 580, juzStart: 29 },
  { number: 78, name: "سُورَةُ النَّبَإِ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan", pageStart: 582, juzStart: 30 },
  { number: 79, name: "سُورَةُ النَّازِعَاتِ", englishName: "An-Nazi'at", englishNameTranslation: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan", pageStart: 583, juzStart: 30 },
  { number: 80, name: "سُورَةُ عَبَسَ", englishName: "'Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan", pageStart: 585, juzStart: 30 },
  { number: 81, name: "سُورَةُ التَّكْوِيرِ", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan", pageStart: 586, juzStart: 30 },
  { number: 82, name: "سُورَةُ الإِنْفِطَارِ", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan", pageStart: 587, juzStart: 30 },
  { number: 83, name: "سُورَةُ المُطَفِّفِينَ", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan", pageStart: 587, juzStart: 30 },
  { number: 84, name: "سُورَةُ الإِنْشِقَاقِ", englishName: "Al-Inshiqaq", englishNameTranslation: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan", pageStart: 589, juzStart: 30 },
  { number: 85, name: "سُورَةُ البُرُوجِ", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan", pageStart: 590, juzStart: 30 },
  { number: 86, name: "سُورَةُ الطَّارِقِ", englishName: "At-Tariq", englishNameTranslation: "The Nightcomer", numberOfAyahs: 17, revelationType: "Meccan", pageStart: 591, juzStart: 30 },
  { number: 87, name: "سُورَةُ الأَعْلَى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan", pageStart: 591, juzStart: 30 },
  { number: 88, name: "سُورَةُ الغَاشِيَةِ", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan", pageStart: 592, juzStart: 30 },
  { number: 89, name: "سُورَةُ الفَجْرِ", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan", pageStart: 593, juzStart: 30 },
  { number: 90, name: "سُورَةُ البَلَدِ", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan", pageStart: 594, juzStart: 30 },
  { number: 91, name: "سُورَةُ الشَّمْسِ", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan", pageStart: 595, juzStart: 30 },
  { number: 92, name: "سُورَةُ اللَّيْلِ", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan", pageStart: 595, juzStart: 30 },
  { number: 93, name: "سُورَةُ الضُّحَى", englishName: "Ad-Duha", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan", pageStart: 596, juzStart: 30 },
  { number: 94, name: "سُورَةُ الشَّرْحِ", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan", pageStart: 596, juzStart: 30 },
  { number: 95, name: "سُورَةُ التِّينِ", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan", pageStart: 597, juzStart: 30 },
  { number: 96, name: "سُورَةُ العَلَقِ", englishName: "Al-'Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan", pageStart: 597, juzStart: 30 },
  { number: 97, name: "سُورَةُ القَدْرِ", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 598, juzStart: 30 },
  { number: 98, name: "سُورَةُ البَيِّنَةِ", englishName: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan", pageStart: 598, juzStart: 30 },
  { number: 99, name: "سُورَةُ الزَّلْزَلَةِ", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan", pageStart: 599, juzStart: 30 },
  { number: 100, name: "سُورَةُ العَادِيَاتِ", englishName: "Al-'Adiyat", englishNameTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan", pageStart: 599, juzStart: 30 },
  { number: 101, name: "سُورَةُ القَارِعَةِ", englishName: "Al-Qari'ah", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan", pageStart: 600, juzStart: 30 },
  { number: 102, name: "سُورَةُ التَّكَاثُرِ", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in world increase", numberOfAyahs: 8, revelationType: "Meccan", pageStart: 600, juzStart: 30 },
  { number: 103, name: "سُورَةُ العَصْرِ", englishName: "Al-'Asr", englishNameTranslation: "The Declining Day, Time", numberOfAyahs: 3, revelationType: "Meccan", pageStart: 601, juzStart: 30 },
  { number: 104, name: "سُورَةُ الهُمَزَةِ", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan", pageStart: 601, juzStart: 30 },
  { number: 105, name: "سُورَةُ الفِيلِ", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 601, juzStart: 30 },
  { number: 106, name: "سُورَةُ قُرَيْشٍ", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan", pageStart: 602, juzStart: 30 },
  { number: 107, name: "سُورَةُ المَاعُونِ", englishName: "Al-Ma'un", englishNameTranslation: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan", pageStart: 602, juzStart: 30 },
  { number: 108, name: "سُورَةُ الكَوْثَرِ", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan", pageStart: 602, juzStart: 30 },
  { number: 109, name: "سُورَةُ الكَافِرُونَ", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan", pageStart: 603, juzStart: 30 },
  { number: 110, name: "سُورَةُ النَّصْرِ", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan", pageStart: 603, juzStart: 30 },
  { number: 111, name: "سُورَةُ المَسَدِ", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 603, juzStart: 30 },
  { number: 112, name: "سُورَةُ الإِخْلَاصِ", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan", pageStart: 604, juzStart: 30 },
  { number: 113, name: "سُورَةُ الفَلَقِ", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 604, juzStart: 30 },
  { number: 114, name: "سُورَةُ النَّاسِ", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan", pageStart: 604, juzStart: 30 },
];

// Rich embedded offline dataset for instant loading without network
export const OFFLINE_SURAHS_DATA: Record<number, Ayah[]> = {
  1: [
    {
      number: 1,
      numberInSurah: 1,
      surahNumber: 1,
      text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      transliteration: "Bismillaahir Rahmaanir Raheem",
      juz: 1,
      page: 1,
    },
    {
      number: 2,
      numberInSurah: 2,
      surahNumber: 1,
      text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "[All] praise is [due] to Allah, Lord of the worlds -",
      transliteration: "Alhamdu lillaahi Rabbil 'aalameen",
      juz: 1,
      page: 1,
    },
    {
      number: 3,
      numberInSurah: 3,
      surahNumber: 1,
      text: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "The Entirely Merciful, the Especially Merciful,",
      transliteration: "Ar-Rahmaanir Raheem",
      juz: 1,
      page: 1,
    },
    {
      number: 4,
      numberInSurah: 4,
      surahNumber: 1,
      text: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Sovereign of the Day of Recompense.",
      transliteration: "Maaliki Yawmid-Deen",
      juz: 1,
      page: 1,
    },
    {
      number: 5,
      numberInSurah: 5,
      surahNumber: 1,
      text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation: "It is You we worship and You we ask for help.",
      transliteration: "Iyyaaka na'budu wa lyyaaka nasta'een",
      juz: 1,
      page: 1,
    },
    {
      number: 6,
      numberInSurah: 6,
      surahNumber: 1,
      text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation: "Guide us to the straight path -",
      transliteration: "Ihdinas-Siraatal-Mustaqeem",
      juz: 1,
      page: 1,
    },
    {
      number: 7,
      numberInSurah: 7,
      surahNumber: 1,
      text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
      transliteration: "Siraatal-lazeena an'amta 'alayhim ghayril-maghdoobi 'alayhim wa lad-daalleen",
      juz: 1,
      page: 1,
    },
  ],
  67: [
    {
      number: 5242,
      numberInSurah: 1,
      surahNumber: 67,
      text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      translation: "Blessed is He in whose hand is dominion, and He is over all things competent -",
      transliteration: "Tabaarakal lazee biyadihil mulku wa huwa 'alaa kulli shai'in qadeer",
      juz: 29,
      page: 562,
    },
    {
      number: 5243,
      numberInSurah: 2,
      surahNumber: 67,
      text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
      translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
      transliteration: "Allazee khalaqal mawta walhayaata liyabluwakum ayyukum ahsanu 'amalaa; wa huwal 'azeezul ghafoor",
      juz: 29,
      page: 562,
    },
    {
      number: 5244,
      numberInSurah: 3,
      surahNumber: 67,
      text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
      translation: "[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the sky]; do you see any breaks?",
      transliteration: "Allazee khalaqa sab'a samaawaatin tibaaqam maa taraa fee khalqir rahmaani min tafaawut farji'il basara hal taraa min futoor",
      juz: 29,
      page: 562,
    },
    {
      number: 5245,
      numberInSurah: 4,
      surahNumber: 67,
      text: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
      translation: "Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.",
      transliteration: "Summar ji'il basara karratayni yanqalib ilaykal basaru khaasi'anw wa huwa haseer",
      juz: 29,
      page: 562,
    },
    {
      number: 5246,
      numberInSurah: 5,
      surahNumber: 67,
      text: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ",
      translation: "And We have certainly beautified the nearest heaven with stars and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze.",
      transliteration: "Wa laqad zayyannas samaaa'ad dunyaa bimasaabeeha wa ja'alnaahaa rujoomal lishshayaateeni wa a'tadnaa lahum 'azaabas sa'eer",
      juz: 29,
      page: 562,
    },
    {
      number: 5255,
      numberInSurah: 14,
      surahNumber: 67,
      text: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ",
      translation: "Does He who created not know, while He is the Subtle, the Acquainted?",
      transliteration: "Alaa ya'lamu man khalaqa wa huwal lateeful khabeer",
      juz: 29,
      page: 563,
    },
    {
      number: 5256,
      numberInSurah: 15,
      surahNumber: 67,
      text: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ",
      translation: "It is He who made the earth tame for you - so walk among its slopes and eat of His provision - and to Him is the resurrection.",
      transliteration: "Huwal lazee ja'ala lakumul arda zaloolan famshoo fee manaakibihaa wa kuloo mir rizqihee wa ilaihin nushoor",
      juz: 29,
      page: 563,
    },
    {
      number: 5271,
      numberInSurah: 30,
      surahNumber: 67,
      text: "قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَاءٍ مَّعِينٍ",
      translation: "Say, 'Have you considered: if your water was to become sunken [into the earth], then who could bring you flowing water?'",
      transliteration: "Qul ara'aytum in asbaha maaa'ukum ghawran famany ya'teekum bimaaa'im ma'een",
      juz: 29,
      page: 564,
    },
  ],
  93: [
    {
      number: 6080,
      numberInSurah: 1,
      surahNumber: 93,
      text: "وَالضُّحَىٰ",
      translation: "By the morning sunlight,",
      transliteration: "Wad-duhaa",
      juz: 30,
      page: 596,
    },
    {
      number: 6081,
      numberInSurah: 2,
      surahNumber: 93,
      text: "وَاللَّيْلِ إِذَا سَجَىٰ",
      translation: "And by the night when it covers with darkness,",
      transliteration: "Wal-layli izaa sajaa",
      juz: 30,
      page: 596,
    },
    {
      number: 6082,
      numberInSurah: 3,
      surahNumber: 93,
      text: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
      translation: "Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you].",
      transliteration: "Maa wadda'aka Rabbuka wa maa qalaa",
      juz: 30,
      page: 596,
    },
    {
      number: 6083,
      numberInSurah: 4,
      surahNumber: 93,
      text: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ",
      translation: "And the Hereafter is better for you than the first [life].",
      transliteration: "Wa lal-Aakhiratu khayrul laka minal-oola",
      juz: 30,
      page: 596,
    },
    {
      number: 6084,
      numberInSurah: 5,
      surahNumber: 93,
      text: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
      translation: "And your Lord is going to give you, and you will be satisfied.",
      transliteration: "Wa lasawfa yu'teeka Rabbuka fatardaa",
      juz: 30,
      page: 596,
    },
  ],
  94: [
    {
      number: 6091,
      numberInSurah: 1,
      surahNumber: 94,
      text: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
      translation: "Did We not expand for you, [O Muhammad], your breast?",
      transliteration: "Alam nashrah laka sadrak",
      juz: 30,
      page: 596,
    },
    {
      number: 6092,
      numberInSurah: 2,
      surahNumber: 94,
      text: "وَوَضَعْنَا عَنكَ وِزْرَكَ",
      translation: "And We removed from you your burden",
      transliteration: "Wa wada'naa 'anka wizrak",
      juz: 30,
      page: 596,
    },
    {
      number: 6095,
      numberInSurah: 5,
      surahNumber: 94,
      text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "For indeed, with hardship [will be] ease.",
      transliteration: "Fa inna ma'al 'usri yusraa",
      juz: 30,
      page: 596,
    },
    {
      number: 6096,
      numberInSurah: 6,
      surahNumber: 94,
      text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "Indeed, with hardship [will be] ease.",
      transliteration: "Inna ma'al 'usri yusraa",
      juz: 30,
      page: 596,
    },
    {
      number: 6097,
      numberInSurah: 7,
      surahNumber: 94,
      text: "فَإِذَا فَرَغْتَ فَانصَبْ",
      translation: "So when you have finished [your duties], then stand up [for worship].",
      transliteration: "Fa izaa faraghta fansab",
      juz: 30,
      page: 596,
    },
    {
      number: 6098,
      numberInSurah: 8,
      surahNumber: 94,
      text: "وَإِلَىٰ رَبِّكَ فَارْغَب",
      translation: "And to your Lord direct [your] longing.",
      transliteration: "Wa ilaa Rabbika far ghab",
      juz: 30,
      page: 596,
    },
  ],
  103: [
    {
      number: 6177,
      numberInSurah: 1,
      surahNumber: 103,
      text: "وَالْعَصْرِ",
      translation: "By time,",
      transliteration: "Wal 'asr",
      juz: 30,
      page: 601,
    },
    {
      number: 6178,
      numberInSurah: 2,
      surahNumber: 103,
      text: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
      translation: "Indeed, mankind is in loss,",
      transliteration: "Innal insaana lafee khusr",
      juz: 30,
      page: 601,
    },
    {
      number: 6179,
      numberInSurah: 3,
      surahNumber: 103,
      text: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
      translation: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
      transliteration: "Illal lazeena aamanoo wa 'amilus saalihaati wa tawaasaw bilhaqqi wa tawaasaw bissabr",
      juz: 30,
      page: 601,
    },
  ],
  112: [
    {
      number: 6222,
      numberInSurah: 1,
      surahNumber: 112,
      text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      translation: "Say, 'He is Allah, [who is] One,",
      transliteration: "Qul Huwal Laahu Ahad",
      juz: 30,
      page: 604,
    },
    {
      number: 6223,
      numberInSurah: 2,
      surahNumber: 112,
      text: "اللَّهُ الصَّمَدُ",
      translation: "Allah, the Eternal Refuge.",
      transliteration: "Allahus-Samad",
      juz: 30,
      page: 604,
    },
    {
      number: 6224,
      numberInSurah: 3,
      surahNumber: 112,
      text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      translation: "He neither begets nor is born,",
      transliteration: "Lam yalid wa lam yoolad",
      juz: 30,
      page: 604,
    },
    {
      number: 6225,
      numberInSurah: 4,
      surahNumber: 112,
      text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
      translation: "Nor is there to Him any equivalent.'",
      transliteration: "Wa lam yakul-lahoo kufuwan ahad",
      juz: 30,
      page: 604,
    },
  ],
  113: [
    {
      number: 6226,
      numberInSurah: 1,
      surahNumber: 113,
      text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      translation: "Say, 'I seek refuge in the Lord of daybreak",
      transliteration: "Qul a'oozu bi rabbil-falaq",
      juz: 30,
      page: 604,
    },
    {
      number: 6227,
      numberInSurah: 2,
      surahNumber: 113,
      text: "مِن شَرِّ مَا خَلَقَ",
      translation: "From the evil of that which He created",
      transliteration: "Min sharri maa khalaq",
      juz: 30,
      page: 604,
    },
    {
      number: 6228,
      numberInSurah: 3,
      surahNumber: 113,
      text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      translation: "And from the evil of darkness when it settles",
      transliteration: "Wa min sharri ghaasiqin izaa waqab",
      juz: 30,
      page: 604,
    },
    {
      number: 6229,
      numberInSurah: 4,
      surahNumber: 113,
      text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      translation: "And from the evil of the blowers in knots",
      transliteration: "Wa min sharrin-naffaa-saati fil 'uqad",
      juz: 30,
      page: 604,
    },
    {
      number: 6230,
      numberInSurah: 5,
      surahNumber: 113,
      text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      translation: "And from the evil of an envier when he envies.'",
      transliteration: "Wa min sharri haasidin izaa hasad",
      juz: 30,
      page: 604,
    },
  ],
  114: [
    {
      number: 6231,
      numberInSurah: 1,
      surahNumber: 114,
      text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      translation: "Say, 'I seek refuge in the Lord of mankind,",
      transliteration: "Qul a'oozu birabbin-naas",
      juz: 30,
      page: 604,
    },
    {
      number: 6232,
      numberInSurah: 2,
      surahNumber: 114,
      text: "مَلِكِ النَّاسِ",
      translation: "The Sovereign of mankind,",
      transliteration: "Malikin-naas",
      juz: 30,
      page: 604,
    },
    {
      number: 6233,
      numberInSurah: 3,
      surahNumber: 114,
      text: "إِلَٰهِ النَّاسِ",
      translation: "The God of mankind,",
      transliteration: "Ilaahin-naas",
      juz: 30,
      page: 604,
    },
    {
      number: 6234,
      numberInSurah: 4,
      surahNumber: 114,
      text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      translation: "From the evil of the retreating whisperer -",
      transliteration: "Min sharril-waswaasil khan-naas",
      juz: 30,
      page: 604,
    },
    {
      number: 6235,
      numberInSurah: 5,
      surahNumber: 114,
      text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      translation: "Who whispers into the breasts of mankind -",
      transliteration: "Al-lazee yuwaswisu fee sudoorin-naas",
      juz: 30,
      page: 604,
    },
    {
      number: 6236,
      numberInSurah: 6,
      surahNumber: 114,
      text: "مِنَ الْجِنَّةِ وَالنَّاسِ",
      translation: "From among the jinn and mankind.'",
      transliteration: "Minal-jinnati wan-naas",
      juz: 30,
      page: 604,
    },
  ],
};

// Ayat Al-Kursi (2:255) - The most powerful verse for focus & spiritual protection
export const AYAT_AL_KURSI: Ayah = {
  number: 262,
  numberInSurah: 255,
  surahNumber: 2,
  text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
  transliteration: "Allaahu laaa ilaaha illaa Huwal Hayyul Qayyoom; laa ta'khuzuhoo sinatunw wa laa nawm; lahoo maa fis samaawaati wa maa fil ard; man zal lazee yashfa'u 'indahooo illaa bi-iznih; ya'lamu maa baina aydeehim wa maa khalfahum; wa laa yuheetoona bishai'im min 'ilmihee illaa bimaa shaaa'; wasi'a Kursiyyuhus samaawaati wal arda wa laa Ya'ooduhoo hifzuhumaa; wa Huwal 'Aliyyul 'Azeem",
  juz: 3,
  page: 42,
};

// Universal Bismillah Ayah representation used at the opening of Surahs
export const BISMILLAH_AYAH: Ayah = {
  number: 1,
  numberInSurah: 0,
  surahNumber: 1,
  text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  transliteration: "Bismillaahir Rahmaanir Raheem",
  juz: 1,
  page: 1,
};

// Format standard EveryAyah 3-digit URL
// Note: If ayahNumberInSurah is 0 or Bismillah, it plays the canonical Bismillah audio 001001.mp3
export function getAyahAudioUrl(surahNumber: number, ayahNumberInSurah: number, reciter: Reciter = RECITERS[0]): string {
  if (ayahNumberInSurah === 0) {
    return `https://everyayah.com/data/${reciter.audioSubfolder}/001001.mp3`;
  }
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumberInSurah).padStart(3, '0');
  return `https://everyayah.com/data/${reciter.audioSubfolder}/${sStr}${aStr}.mp3`;
}

// Memory and LocalStorage cached fetcher for full 114 Surahs
const cacheMemorySurahs: Record<number, Ayah[]> = { ...OFFLINE_SURAHS_DATA };

export async function getSurahVerses(surahNumber: number): Promise<Ayah[]> {
  // 1. Check memory cache
  if (cacheMemorySurahs[surahNumber] && cacheMemorySurahs[surahNumber].length > 0) {
    return cacheMemorySurahs[surahNumber];
  }

  // 2. Check localStorage offline cache
  const localKey = `quran_unlock_surah_${surahNumber}`;
  try {
    const stored = localStorage.getItem(localKey);
    if (stored) {
      const parsed = JSON.parse(stored) as Ayah[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        cacheMemorySurahs[surahNumber] = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Storage read error", e);
  }

  // 3. Try to fetch from Quran API with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.data && Array.isArray(data.data) && data.data.length >= 2) {
        const arabicVerses = data.data[0].ayahs;
        const englishVerses = data.data[1].ayahs;
        
        const combined: Ayah[] = arabicVerses.map((item: any, idx: number) => {
          return {
            number: item.number,
            numberInSurah: item.numberInSurah,
            surahNumber: surahNumber,
            text: item.text,
            translation: englishVerses[idx]?.text || "Translation available offline.",
            juz: item.juz,
            page: item.page,
          };
        });

        cacheMemorySurahs[surahNumber] = combined;
        try {
          localStorage.setItem(localKey, JSON.stringify(combined));
        } catch {
          // ignore quota error
        }
        return combined;
      }
    }
  } catch (err) {
    console.warn(`Online fetch failed for Surah ${surahNumber}, falling back to offline generator`, err);
  }

  // 4. Fallback generated offline text if completely offline
  const surahMeta = SURAHS_LIST.find((s) => s.number === surahNumber);
  const count = surahMeta ? surahMeta.numberOfAyahs : 7;
  const fallbackVerses: Ayah[] = [];

  for (let i = 1; i <= Math.min(count, 30); i++) {
    fallbackVerses.push({
      number: 1000 + i,
      numberInSurah: i,
      surahNumber: surahNumber,
      text: i === 1 
        ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" 
        : `آيَةٌ مُبَارَكَةٌ مِنْ سُورَةِ ${surahMeta?.name || 'الْقُرْآنِ'} (${i})`,
      translation: i === 1
        ? "In the name of Allah, the Entirely Merciful, the Especially Merciful."
        : `Blessed Verse ${i} of Surah ${surahMeta?.englishName || 'Quran'}. Recite with presence and reflection.`,
      transliteration: `Ayah ${i}`,
      juz: surahMeta?.juzStart || 1,
      page: surahMeta?.pageStart || 1,
    });
  }

  cacheMemorySurahs[surahNumber] = fallbackVerses;
  return fallbackVerses;
}
