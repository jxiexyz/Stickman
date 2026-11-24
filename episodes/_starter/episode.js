/**
 * Minimal Starter Episode Template (10s, 3 Beats)
 * Copy via `node scripts/new-episode.mjs <slug> --title "Judul Cerita"`
 */

export default {
  id: '_starter',
  title: 'Starter 2.5D Stickman Story',
  stageId: 'village-nobar',
  duration: 10.0,
  fps: 24,
  resolution: { width: 720, height: 1280 },
  background: 0x8bc2ed,

  beats: [
    {
      id: 'b01-hook',
      label: '01 · Opening Hook',
      start: 0.0,
      end: 3.5,
      fadeIn: 0.25,
      captions: [
        { start: 0.1, end: 1.8, text: 'Setiap pagi,' },
        { start: 1.8, end: 3.4, text: 'ada hal *aneh* di sini.' },
      ],
      diorama: {
        night: 0,
        whiteCover: (u) => 0.25 + u * 0.25,
        paintCan1: true,
        roller: { x: (u) => -0.85 + u * 0.4, speed: 6.0, tilt: 0.16 },
        tetangga: {
          pos: [0.05, 0, 0.72],
          ry: -0.2,
          expr: 'neutral',
          leftArmZ: (u, lt) => 1.35 + Math.sin(lt * 6.0) * 0.3,
        },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        startPos: [0.35, 1.25, 4.35],
        endPos: [-0.08, 1.32, 3.25],
        startLook: [-0.22, 1.18, 0.25],
        endLook: [-0.25, 1.25, 0.2],
        startFov: 40,
        endFov: 37,
      },
    },
    {
      id: 'b02-reaction',
      label: '02 · Character Reaction',
      start: 3.5,
      end: 6.8,
      captions: [
        { start: 0.15, end: 1.6, text: '*Bu Warni* kaget,' },
        { start: 1.65, end: 3.1, text: '"Ini kok *berubah*?!"' },
      ],
      diorama: {
        night: 0,
        whiteCover: 0.65,
        paintCan1: true,
        tetangga: { visible: false },
        buWarni: {
          pos: [-2.25, 0, 1.65],
          ry: 0.25,
          expr: (u) => (u < 0.45 ? 'deadpan' : 'confused'),
          icons: (u) => ({ q: u >= 0.45, sweat: u >= 0.5 }),
        },
      },
      dioramaCamera: {
        startPos: [-2.05, 1.25, 4.25],
        endPos: [-2.12, 1.24, 3.35],
        startLook: [-2.25, 1.08, 1.65],
        endLook: [-2.22, 1.12, 1.65],
        startFov: 38,
        endFov: 36,
      },
    },
    {
      id: 'b03-twist',
      label: '03 · Night Reveal & HUD',
      start: 6.8,
      end: 10.0,
      fadeOut: 0.45,
      captions: [
        { start: 0.15, end: 1.6, text: 'Ternyata malamnya' },
        { start: 1.65, end: 3.0, text: 'jadi *bioskop*!' },
      ],
      hudTimeline: [
        { start: 1.2, end: 3.0, formula: '50 × Rp10.000', value: 'Rp500 RB', color: '#4ade80', yFrac: 0.22 },
      ],
      diorama: {
        night: 1.0,
        whiteCover: 1.0,
        projection: 1.0,
        projBright: 1.0,
        leavesTied: true,
        paintCan1: false,
        projector: true,
        nobarProps: true,
        crowd: 'seated',
        tetangga: { pos: [1.55, 0, 2.55], ry: -0.25, expr: 'smileBig' },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        startPos: [-1.8, 3.8, 6.8],
        endPos: [-0.4, 2.2, 5.2],
        startLook: [0.0, 1.4, 1.2],
        endLook: [0.0, 1.6, 0.4],
        startFov: 44,
        endFov: 41,
      },
    },
  ],

  audio: {
    masterVolume: 0.86,
    voiceActive: true,
    busVolumes: { ambience: 0.2, sfx_primary: 0.68, sfx_secondary: 0.5, transition: 0.52 },
    ambienceTracks: [
      { id: 'amb_day', presetId: 'env_outdoor_birds_foley', startTime: 0.0, duration: 6.8, loop: true, volume: 0.2, bus: 'ambience', fadeIn: 0.2, fadeOut: 0.2 },
      { id: 'amb_night', presetId: 'env_wind_ambience', startTime: 6.8, duration: 3.2, loop: true, volume: 0.24, bus: 'ambience', fadeIn: 0.2, fadeOut: 0.4 },
    ],
    events: [
      { id: 'sfx_q', presetId: 'char_confused_reaction', startTime: 5.0, volume: 0.62, bus: 'sfx_primary' },
      { id: 'sfx_reveal', presetId: 'emo_dramatic_reveal', startTime: 6.85, volume: 0.72, bus: 'sfx_primary' },
      { id: 'sfx_cash', presetId: 'fin_profit_reveal', startTime: 8.0, volume: 0.68, bus: 'sfx_primary' },
    ],
  },
};
