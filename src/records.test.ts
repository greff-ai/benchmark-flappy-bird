import { describe, expect, it, vi } from 'vitest';
import { BEST_SCORE_KEY, createRecords } from './records';

describe('best records', () => {
  it('loads, preserves the maximum, and persists only improvements', () => {
    let saved = '4';
    const storage = { getItem: vi.fn(() => saved), setItem: vi.fn((_key: string, value: string) => { saved = value; }) };
    const records = createRecords(() => storage);
    expect(records.getBest()).toBe(4);
    expect(records.record(2)).toBe(4);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(records.record(7)).toBe(7);
    expect(storage.setItem).toHaveBeenCalledWith(BEST_SCORE_KEY, '7');
    expect(createRecords(() => storage).getBest()).toBe(7);
  });
  it.each([null, '', 'bad', '-1', '1.5', '"8"', '{}', 'null', '9007199254740992'])(
    'rejects invalid saved record %s', (value) => {
      const records = createRecords(() => ({ getItem: () => value, setItem: () => {} }));
      expect(records.getBest()).toBe(0);
      expect(records.record(2)).toBe(2);
    },
  );
  it.each(['access', 'read', 'write'] as const)('keeps a session maximum when storage %s fails', (failure) => {
    const records = createRecords(() => {
      if (failure === 'access') throw new Error('Blocked storage');
      return {
        getItem() { if (failure === 'read') throw new Error('Blocked read'); return '3'; },
        setItem() { throw new Error('Blocked write'); },
      };
    });
    expect(() => records.record(8)).not.toThrow();
    expect(records.record(0)).toBe(8);
    expect(records.getBest()).toBe(8);
  });
});
