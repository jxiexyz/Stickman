import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, lerp, easeInOutCubic, hash1 } from '../src/utils/math.js';
import { SFXPresetRegistry, BUILTIN_SFX_PRESETS } from '../src/audio/sfx-presets.js';
import { SFXBusManager, renderSFXTimelineToWav } from '../src/audio/sfx-engine.js';
import starterEpisode from '../episodes/_starter/episode.js';
import flagshipEpisode from '../episodes/tembok-putih-nobar/episode.js';

test('math utilities are pure and deterministic', () => {
  assert.equal(clamp(5, 0, 1), 1);
  assert.equal(lerp(10, 20, 0.5), 15);
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
  assert.equal(hash1(42), hash1(42));
  assert.ok(hash1(42) >= 0 && hash1(42) < 1);
});

test('episode beat timelines are contiguous and valid', () => {
  for (const ep of [starterEpisode, flagshipEpisode]) {
    assert.ok(ep.duration > 0, `${ep.id} has positive duration`);
    assert.ok(ep.beats.length > 0, `${ep.id} has beats`);
    for (let i = 0; i < ep.beats.length; i++) {
      const b = ep.beats[i];
      assert.ok(b.end > b.start, `${ep.id}:${b.id} end > start`);
      if (i > 0) {
        assert.ok(Math.abs(b.start - ep.beats[i - 1].end) < 1e-6, `${ep.id}:${b.id} starts where prev ended`);
      }
    }
  }
});

test('procedural SFX timeline renders deterministically without clipping', () => {
  const registry = new SFXPresetRegistry();
  assert.ok(BUILTIN_SFX_PRESETS.length >= 70);

  const renderOnce = () => {
    const busManager = new SFXBusManager();
    busManager.masterVolume = starterEpisode.audio.masterVolume;
    return renderSFXTimelineToWav({
      events: starterEpisode.audio.events,
      ambienceTracks: starterEpisode.audio.ambienceTracks,
      totalDuration: starterEpisode.duration,
      registry,
      busManager,
      sampleRate: 22050,
      voiceActive: true,
    });
  };

  const a = renderOnce();
  const b = renderOnce();
  assert.equal(a.clipped, false);
  assert.ok(a.peakAmplitude > 0.01);
  assert.equal(Buffer.compare(Buffer.from(a.wavBuffer), Buffer.from(b.wavBuffer)), 0);
});
