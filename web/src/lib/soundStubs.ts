/**
 * Sound effect stubs for the Skeuomorphic Doctrine.
 *
 * Each function is a no-op placeholder. When Tone.js is wired up,
 * replace the bodies with real synthesis / sampler playback.
 *
 * Usage:
 *   import { playParchmentRustle } from '@/lib/soundStubs';
 *   <div onMouseEnter={playParchmentRustle} />
 */

/** Rustling parchment — card hover / scroll open */
export function playParchmentRustle() {
  // TODO: Tone.js NoiseSynth burst (brown noise, 80ms decay)
}

/** Heavy stone grinding — tab switch */
export function playStoneGrind() {
  // TODO: Tone.js filtered noise sweep (lowpass 200→800 Hz, 0.5s)
}

/** Clinking metal — rivet / seal / button press */
export function playMetalClink() {
  // TODO: Tone.js MetalSynth ping (short attack, high harmonicity)
}

/** Wax seal stamp — CTA click */
export function playWaxStamp() {
  // TODO: Tone.js MembraneSynth thud (short, low pitch)
}

/** Chain rattle — divider / link interaction */
export function playChainRattle() {
  // TODO: Tone.js NoiseSynth + comb filter (metallic rattle, 120ms)
}

/** Torch ignition — page load / brazier hover */
export function playTorchIgnite() {
  // TODO: Tone.js noise burst with bandpass sweep (fire crackle)
}
