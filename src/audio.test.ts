import { describe, expect, it, vi } from 'vitest';
import { createAudio } from './audio';

function audioFixture() {
  const parameter = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
  const gains: { gain: ReturnType<typeof parameter>; connect: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }[] = [];
  const oscillators: { type: string; frequency: ReturnType<typeof parameter>; connect: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; onended: (() => void) | null }[] = [];
  const context = {
    state: 'running', currentTime: 1, destination: {},
    createGain: vi.fn(() => {
      const node = { gain: parameter(), connect: vi.fn(), disconnect: vi.fn() };
      gains.push(node); return node;
    }),
    createOscillator: vi.fn(() => {
      const node = { type: 'sine', frequency: parameter(), connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null };
      oscillators.push(node); return node;
    }),
    resume: vi.fn(async () => { context.state = 'running'; }),
    close: vi.fn(async () => { context.state = 'closed'; }),
  };
  return { context, gains, oscillators, factory: vi.fn(() => context as unknown as AudioContext) };
}
describe('game audio', () => {
  it('initializes only when unlocked and schedules distinct short cues', async () => {
    const fixture = audioFixture();
    const audio = createAudio(fixture.factory);
    audio.play('flap');
    expect(fixture.factory).not.toHaveBeenCalled();
    await audio.unlock();
    audio.play('flap'); audio.play('score'); audio.play('crash');
    expect(fixture.oscillators).toHaveLength(3);
    expect(fixture.oscillators.map((node) => node.frequency.setValueAtTime.mock.calls[0][0])).toEqual([660, 1046, 180]);
    expect(audio.getState().played).toEqual({ flap: 1, score: 1, crash: 1 });
    audio.dispose();
    expect(fixture.context.close).toHaveBeenCalledOnce();
  });
  it('mutes active voices and drops missed feedback without replay', async () => {
    const fixture = audioFixture();
    const audio = createAudio(fixture.factory);
    await audio.unlock();
    audio.play('flap');
    audio.setMuted(true);
    expect(fixture.gains[0].gain.value).toBe(0);
    expect(fixture.oscillators[0].stop).toHaveBeenCalledTimes(2);
    audio.play('score');
    audio.setMuted(false);
    expect(audio.getState().played.score).toBe(0);
    expect(fixture.gains[0].gain.value).toBeGreaterThan(0);
    audio.play('score');
    expect(audio.getState().played.score).toBe(1);
    audio.silence();
    audio.dispose();
  });
  it.each(['missing', 'constructor', 'resume', 'node'] as const)('contains %s failures', async (failure) => {
    const fixture = audioFixture();
    if (failure === 'resume') {
      fixture.context.state = 'suspended';
      fixture.context.resume.mockRejectedValueOnce(new Error('Denied'));
    }
    if (failure === 'node') fixture.context.createOscillator.mockImplementation(() => { throw new Error('Unavailable'); });
    const audio = createAudio(() => {
      if (failure === 'missing') return null;
      if (failure === 'constructor') throw new Error('Unavailable');
      return fixture.factory();
    });
    await expect(audio.unlock()).resolves.toBeUndefined();
    expect(() => audio.play('flap')).not.toThrow();
    expect(audio.getState().available).toBe(false);
    audio.dispose();
  });
});
