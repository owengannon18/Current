export const ratingLabels = [
  { label: 'Masterpiece', val: 5.0, hex: '#9333ea', bg: 'bg-purple-600 border-purple-400 text-white font-black' },
  { label: 'Amazing',     val: 4.5, hex: '#2563eb', bg: 'bg-blue-600 border-blue-400 text-white font-bold' },
  { label: 'Great',       val: 4.0, hex: '#0ea5e9', bg: 'bg-sky-500 border-sky-300 text-gray-950 font-bold' },
  { label: 'Good',        val: 3.5, hex: '#10b981', bg: 'bg-emerald-500 border-emerald-300 text-gray-950 font-bold' },
  { label: 'Pretty Good', val: 3.0, hex: '#065f46', bg: 'bg-emerald-800 border-emerald-600 text-white font-bold' },
  { label: 'Average',     val: 2.5, hex: '#a3e635', bg: 'bg-lime-400 border-lime-300 text-gray-950 font-medium' },
  { label: 'Ok',          val: 2.0, hex: '#facc15', bg: 'bg-yellow-400 border-yellow-300 text-gray-950 font-medium' },
  { label: 'Bad',         val: 1.5, hex: '#d97706', bg: 'bg-amber-600 border-amber-500 text-white font-medium' },
  { label: 'Very Bad',    val: 1.0, hex: '#ea580c', bg: 'bg-orange-600 border-orange-400 text-white' },
  { label: 'Terrible',    val: 0.5, hex: '#dc2626', bg: 'bg-red-600 border-red-400 text-white' },
  { label: 'Atrocious',   val: 0.0, hex: '#475569', bg: 'bg-slate-600 border-slate-400 text-slate-100' },
];

export const defaultSeedData = {
  boygenius: [
    {
      id: 'bg-record-2023',
      albumName: 'the record',
      artist: 'boygenius',
      year: '2023',
      officialRating: 0.0,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273105a16dfab1ec693ec9f15fb',
      tracks: [
        { num: 1,  title: 'Without You Without Them', rating: 0.0 },
        { num: 2,  title: '$20',                       rating: 0.0 },
        { num: 3,  title: "Emily I'm Sorry",           rating: 0.0 },
        { num: 4,  title: 'True Blue',                 rating: 0.0 },
        { num: 5,  title: 'Cool About It',             rating: 0.0 },
        { num: 6,  title: 'Not Strong Enough',         rating: 0.0 },
        { num: 7,  title: 'Revolution 0',              rating: 0.0 },
        { num: 8,  title: 'Leonard Cohen',             rating: 0.0 },
        { num: 9,  title: 'Satanist',                  rating: 0.0 },
        { num: 10, title: "We're In Love",             rating: 0.0 },
        { num: 11, title: 'Anti-Curse',                rating: 0.0 },
        { num: 12, title: 'Letter To An Old Poet',     rating: 0.0 },
      ],
    },
  ],
};

export const FALLBACK_ARTWORK = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop';
