const KEY = "english-master-progress-v1";

const initial = {
  xp: 0,
  streak: 1,
  level: "A1",
  completedLessons: [],
  learnedWords: [],
  grammarScore: 0,
  readingScore: 0,
  listeningScore: 0,
  speakingSessions: 0,
  writingSessions: 0,
  placementDone: false
};

export function loadProgress() {
  try { return {...initial, ...JSON.parse(localStorage.getItem(KEY) || "{}")}; }
  catch { return {...initial}; }
}

export function saveProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetProgress() {
  localStorage.removeItem(KEY);
  return {...initial};
}