import { ratingLabels } from './constants.js';

export function getStyleClass(score) {
  const parsed = parseFloat(score);
  const match = ratingLabels.find(l => parsed >= l.val);
  return match ? match.bg : 'bg-gray-800 border-gray-700 text-gray-400';
}

export function trackAverage(tracks) {
  if (!tracks.length) return 0;
  return tracks.reduce((s, t) => s + t.rating, 0) / tracks.length;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
