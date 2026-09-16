export const BEST_SCORE_KEY = 'first-flight.best-score';
type RecordStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function createRecords(storage: () => RecordStorage = () => window.localStorage) {
  let best = 0;
  try {
    const raw = storage().getItem(BEST_SCORE_KEY);
    const value: unknown = raw === null ? 0 : JSON.parse(raw);
    if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) best = value;
  } catch { /* Records are optional when browser storage is unavailable. */ }

  return {
    getBest: () => best,
    record(score: number) {
      if (!Number.isSafeInteger(score) || score <= best) return best;
      best = score;
      try { storage().setItem(BEST_SCORE_KEY, JSON.stringify(best)); } catch { /* Keep the session record. */ }
      return best;
    },
  };
}
