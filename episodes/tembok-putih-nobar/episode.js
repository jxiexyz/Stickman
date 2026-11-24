/**
 * PuppetKit True-3D Village Diorama Episode:
 * "TEMBOK PUTIH TETANGGA → LAYAR NOBAR BIOSKOP"
 *
 * Faithful 3D replication of the dissected video's visual grammar:
 *  - Format     : Vertical 9:16 (720x1280 @ 24fps, 98.80s = 2371 frames)
 *  - Stage Mode : `diorama3d` (Single-hero 3D Indonesian village house, 4m x 3m dynamic wall,
 *                 PCFSoftShadowMap real shadows, 3D instanced grass & yellow flowers,
 *                 banana tree with tieable leaves, day-to-night lighting, volumetric projector beam,
 *                 and 3D inverted-hull black-outlined stylized capsule characters).
 *  - Camera     : Continuous 3D choreography (push-in, pull-out wide, isometric crane-up orbit,
 *                 low-angle tilt-up, whip-pans across the 3D yard, bird's-eye establishing).
 *  - Audio      : VO-first Bahasa Indonesia (`voice.mp3`, 97.92s) + synced procedural SFX.
 */

export default {
  id: 'tembok-putih-nobar',
  title: 'Tembok Putih Tetangga → Layar Nobar',
  stageId: 'village-nobar',
  captionStyle: 'bold-outlined',
  duration: 98.8,
  fps: 24,
  resolution: { width: 720, height: 1280 },
  background: 0x8bc2ed,

  beats: [
    // ── BEAT 01 (0.00 - 3.55s): Opening Hook — Ngecat Tembok Pakai Cat Putih ──
    {
      id: 'b01-hook-ngecat',
      label: '01 · Ngecat Cat Putih',
      start: 0.0,
      end: 3.55,
      fadeIn: 0.25,
      fadeOut: 0.0,
      captions: [
        { start: 0.0, end: 1.25, text: 'Tiap minggu pagi,' },
        { start: 1.32, end: 2.38, text: 'dia ngecat tembok' },
        { start: 2.38, end: 3.50, text: 'pakai *cat putih*.' },
      ],
      diorama: {
        night: 0,
        whiteCover: (u) => 0.24 + u * 0.22,
        paintCan1: true,
        roller: { x: (u) => -0.92 + u * 0.45, speed: 6.2, tilt: 0.16, color: 0xfefdf8 },
        tetangga: {
          pos: (u) => [-0.15 + u * 0.16, 0, 0.72],
          ry: -0.25,
          expr: 'neutral',
          leftArmZ: (u, lt) => 1.35 + Math.sin(lt * 6.2) * 0.35,
          rightArmZ: -0.22,
        },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [0.35, 1.25, 4.45], look: [-0.22, 1.18, 0.25], fov: 40 },
          { at: 0.55, pos: [-0.15, 1.38, 3.15], look: [-0.32, 1.32, 0.20], fov: 37 },
          { at: 1.0, pos: [0.05, 1.25, 3.65], look: [-0.25, 1.22, 0.20], fov: 39 },
        ],
      },
    },

    // ── BEAT 02 (3.55 - 15.05s): ICONIC CONTINUOUS 3D MULTI-ANGLE TAKE ───────
    // Pull-Out Wide -> Isometric High-Angle Crane Orbit -> Low-Angle Tilt-Up!
    {
      id: 'b02-crane-reveal-rumah',
      label: '02 · Pull-Out + Crane Rumah',
      start: 3.55,
      end: 15.05,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.15, end: 1.45, text: 'Tapi temboknya' },
        { start: 1.45, end: 2.40, text: 'bukan punya dia.' },
        { start: 2.50, end: 3.55, text: '*Punya tetangga*.' },
        { start: 3.75, end: 4.60, text: 'Jadi gini,' },
        { start: 4.75, end: 6.45, text: 'tembok samping rumah tetangganya' },
        { start: 6.45, end: 8.35, text: 'ngadep pas ke halaman *dia*.' },
        { start: 8.55, end: 9.45, text: 'Lebar,' },
        { start: 9.45, end: 10.20, text: 'tinggi,' },
        { start: 10.25, end: 11.45, text: 'nggak ada *jendela*.' },
      ],
      diorama: {
        night: 0,
        whiteCover: (u) => 0.46 + u * 0.12,
        paintCan1: true,
        roller: { x: -0.18, speed: 5.2, tilt: 0.14, color: 0xfefdf8 },
        tetangga: {
          pos: [0.22, 0, 0.72],
          ry: -0.22,
          expr: 'neutral',
          leftArmZ: (u, lt) => 1.32 + Math.sin(lt * 5.2) * 0.34,
          rightArmZ: -0.22,
        },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [-1.15, 1.45, 4.85], look: [-0.45, 1.62, -0.3], fov: 42 },
          { at: 0.28, pos: [-2.15, 1.88, 5.45], look: [-0.35, 1.72, -0.3], fov: 44 },
          { at: 0.58, pos: [-2.65, 5.15, 5.95], look: [-0.05, 1.15, 0.65], fov: 44 },
          { at: 0.76, pos: [1.55, 4.45, 5.35], look: [-0.15, 1.35, 0.2], fov: 42 },
          { at: 1.0, pos: [0.58, 0.78, 3.15], look: [-0.05, 2.05, 0.0], fov: 42 },
        ],
      },
    },

    // ── BEAT 03 (15.05 - 18.40s): Hari Pertama, Bu Warni Heran ───────────────
    {
      id: 'b03-bu-warni-heran',
      label: '03 · Bu Warni Heran',
      start: 15.05,
      end: 18.40,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.20, end: 1.35, text: 'Hari pertama,' },
        { start: 1.35, end: 2.35, text: '*Bu Warni*' },
        { start: 2.35, end: 3.30, text: 'yang punya rumah heran.' },
      ],
      diorama: {
        night: 0,
        whiteCover: 0.58,
        paintCan1: true,
        tetangga: { visible: false },
        buWarni: {
          pos: [-2.25, 0, 1.65],
          ry: 0.25,
          expr: (u) => (u < 0.55 ? 'deadpan' : 'confused'),
          icons: (u) => ({ q: u >= 0.55, sweat: u >= 0.62 }),
        },
      },
      dioramaCamera: {
        startPos: [-2.05, 1.25, 4.45],
        endPos: [-2.12, 1.24, 3.45],
        startLook: [-2.25, 1.05, 1.65],
        endLook: [-2.22, 1.12, 1.65],
        startFov: 38,
        endFov: 36,
      },
    },

    // ── BEAT 04 (18.40 - 20.50s): "Tembok saya kok dicat orang?" ─────────────
    {
      id: 'b04-dicat-orang',
      label: '04 · Pan ke Tembok',
      start: 18.40,
      end: 20.50,
      fadeIn: 0.0,
      fadeOut: 0.22,
      captions: [
        { start: 0.15, end: 1.05, text: 'Tembok saya' },
        { start: 1.05, end: 2.00, text: 'kok dicat *orang?*' },
      ],
      diorama: {
        night: 0,
        whiteCover: 0.58,
        paintCan1: true,
        tetangga: { visible: false },
        buWarni: {
          pos: [-2.25, 0, 1.65],
          ry: 0.55,
          expr: 'confused',
          icons: { q: true, sweat: true },
        },
      },
      dioramaCamera: {
        startPos: [-2.15, 1.28, 2.95],
        endPos: [-1.45, 1.48, 4.15],
        startLook: [-2.15, 1.18, 1.5],
        endLook: [-0.25, 1.55, 0.0],
        startFov: 36,
        endFov: 40,
      },
    },

    // ── BEAT 05 (20.50 - 23.80s): Sebulan Kemudian, Tembok Putih Banget ──────
    {
      id: 'b05-putih-banget',
      label: '05 · Tembok Putih Banget',
      start: 20.50,
      end: 23.80,
      fadeIn: 0.25,
      fadeOut: 0.0,
      captions: [
        { start: 0.18, end: 1.45, text: 'Sebulan kemudian,' },
        { start: 1.48, end: 2.55, text: 'temboknya putih' },
        { start: 2.55, end: 3.25, text: '*banget*.' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        startPos: [-1.15, 1.65, 4.25],
        endPos: [0.65, 1.78, 3.95],
        startLook: [-0.45, 1.65, 0.0],
        endLook: [0.35, 1.72, 0.0],
        startFov: 39,
        endFov: 37,
      },
    },

    // ── BEAT 06 (23.80 - 25.25s): Siangnya Silau ─────────────────────────────
    {
      id: 'b06-siangnya-silau',
      label: '06 · Siangnya Silau',
      start: 23.80,
      end: 25.25,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.15, end: 1.40, text: 'Siangnya *silau*,' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: {
          pos: [-2.15, 0, 1.65],
          ry: 0.2,
          expr: 'squint',
          leftArmZ: 2.45,
          rightArmZ: -0.22,
        },
      },
      dioramaCamera: {
        startPos: [-2.05, 1.24, 3.65],
        endPos: [-2.08, 1.24, 3.25],
        startLook: [-2.15, 1.12, 1.65],
        endLook: [-2.15, 1.12, 1.65],
        startFov: 37,
        endFov: 36,
      },
    },

    // ── BEAT 07 (25.25 - 26.45s): Cicaknya Pindah ────────────────────────────
    {
      id: 'b07-cicak-pindah',
      label: '07 · Cicaknya Pindah',
      start: 25.25,
      end: 26.45,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.08, end: 1.15, text: 'cicaknya *pindah*,' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        paintCan1: false,
        gecko: true,
        tetangga: { visible: false },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        startPos: [-0.15, 1.62, 1.65],
        endPos: [-0.10, 1.72, 1.60],
        startLook: [-0.15, 1.62, 0.05],
        endLook: [-0.10, 1.72, 0.05],
        startFov: 36,
        endFov: 36,
        handheld: 0.004,
      },
    },

    // ── BEAT 08 (26.45 - 28.55s): Coretan Anak-Anak Ilang ────────────────────
    {
      id: 'b08-coretan-ilang',
      label: '08 · Coretan Anak Ilang',
      start: 26.45,
      end: 28.55,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.10, end: 1.25, text: 'coretan anak-anak' },
        { start: 1.25, end: 2.05, text: '*ilang*.' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: { visible: false },
        kid: {
          pos: [0.35, 0, 1.05],
          ry: 0.1,
          expr: 'squint',
          leftArmZ: 0.35,
          rightArmZ: -0.45,
        },
      },
      dioramaCamera: {
        startPos: [0.42, 0.96, 3.05],
        endPos: [0.36, 0.98, 2.68],
        startLook: [0.35, 0.84, 1.05],
        endLook: [0.35, 0.86, 1.05],
        startFov: 37,
        endFov: 35,
      },
    },

    // ── BEAT 09 (28.55 - 32.25s): Malam Hari Ngukur Pakai Meteran ────────────
    {
      id: 'b09-ngukur-meteran',
      label: '09 · Ngukur Pakai Meteran',
      start: 28.55,
      end: 32.25,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.15, end: 1.15, text: 'Dan tiap *malam*,' },
        { start: 1.15, end: 2.25, text: 'dia ngukur tembok itu' },
        { start: 2.25, end: 3.60, text: '*pakai meteran*.' },
      ],
      diorama: {
        night: 0.92,
        porchLamp: 0.4,
        whiteCover: 1.0,
        paintCan1: false,
        tape: true,
        tetangga: {
          pos: (u) => [-0.45 + u * 1.45, 0, 0.72],
          ry: -0.15,
          expr: 'neutral',
          leftArmZ: 1.45,
          rightArmZ: -0.25,
          walk: true,
        },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        startPos: [-0.55, 1.24, 2.75],
        endPos: [0.95, 1.24, 2.65],
        startLook: [-0.45, 1.12, 0.45],
        endLook: [0.85, 1.12, 0.45],
        startFov: 37,
        endFov: 36,
      },
    },

    // ── BEAT 10 (32.25 - 35.15s): Mau Dimarahin? Temboknya Malah Bersih ──────
    {
      id: 'b10-mau-dimarahin',
      label: '10 · Mau Dimarahin?',
      start: 32.25,
      end: 35.15,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.10, end: 1.25, text: '*Mau dimarahin?*' },
        { start: 1.35, end: 2.80, text: 'Temboknya malah jadi bersih.' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: {
          pos: [-2.18, 0, 1.65],
          ry: 0.25,
          expr: 'angry',
        },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [-2.08, 1.24, 3.65], look: [-2.18, 1.12, 1.65], fov: 37 },
          { at: 0.45, pos: [-2.10, 1.24, 3.35], look: [-2.18, 1.12, 1.65], fov: 36 },
          { at: 0.72, pos: [-0.85, 1.52, 3.85], look: [0.15, 1.62, 0.0], fov: 40 },
          { at: 1.0, pos: [0.15, 1.56, 3.65], look: [0.55, 1.62, 0.0], fov: 40 },
        ],
      },
    },

    // ── BEAT 11 (35.15 - 38.55s): Mau Dilaporin? Ngecat Salahnya Apa? ────────
    {
      id: 'b11-mau-dilaporin',
      label: '11 · Mau Dilaporin?',
      start: 35.15,
      end: 38.55,
      fadeIn: 0.0,
      fadeOut: 0.20,
      captions: [
        { start: 0.15, end: 1.25, text: '*Mau dilaporin?*' },
        { start: 1.35, end: 3.30, text: 'Ngecat tembok salahnya apa?' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: {
          pos: [-2.38, 0, 1.75],
          ry: 0.18,
          expr: (u) => (u < 0.45 ? 'confused' : 'squint'),
          icons: { sweat: true },
        },
      },
      dioramaCamera: {
        startPos: [-2.42, 1.24, 3.45],
        endPos: [-2.68, 1.38, 4.75],
        startLook: [-2.38, 1.12, 1.75],
        endLook: [-1.75, 1.32, 0.75],
        startFov: 37,
        endFov: 41,
      },
    },

    // ── BEAT 12 (38.55 - 41.90s): Besoknya, Bu Warni Ngecat Hijau ────────────
    {
      id: 'b12-bu-warni-hijau',
      label: '12 · Cat Balik Hijau',
      start: 38.55,
      end: 41.90,
      fadeIn: 0.20,
      fadeOut: 0.0,
      captions: [
        { start: 0.20, end: 1.20, text: 'Besoknya,' },
        { start: 1.20, end: 2.45, text: 'Bu Warni ngecat temboknya' },
        { start: 2.45, end: 3.30, text: '*hijau*.' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        greenCover: (u) => 0.18 + u * 0.65,
        paintCan1: true,
        roller: { x: (u) => -1.15 + u * 1.45, speed: 7.0, tilt: -0.15, color: 0x6f8b5e },
        tetangga: { visible: false },
        buWarni: {
          pos: (u) => [-0.85 + u * 0.85, 0, 0.72],
          ry: 0.22,
          expr: 'angry',
          rightArmZ: (u, lt) => -1.38 - Math.sin(lt * 7.0) * 0.35,
          leftArmZ: 0.22,
        },
      },
      dioramaCamera: {
        startPos: [-0.85, 1.32, 2.95],
        endPos: [-0.05, 1.48, 3.95],
        startLook: [-0.75, 1.32, 0.25],
        endLook: [-0.15, 1.45, 0.15],
        startFov: 38,
        endFov: 40,
      },
    },

    // ── BEAT 13 (41.90 - 45.45s): Malamnya, Ngecat Putih Lagi — Dua Lapis! ───
    {
      id: 'b13-putih-dua-lapis',
      label: '13 · Putih Dua Lapis',
      start: 41.90,
      end: 45.45,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.15, end: 1.05, text: 'Malamnya,' },
        { start: 1.05, end: 2.35, text: 'dia ngecat *putih lagi*.' },
        { start: 2.45, end: 3.45, text: '*Dua lapis*.' },
      ],
      diorama: {
        night: 0.92,
        porchLamp: 0.35,
        whiteCover: 1.0,
        greenCover: 0.85,
        white2Cover: (u) => 0.25 + u * 0.75,
        coatBadge: (u) => (u > 0.62 ? Math.min(1, (u - 0.62) / 0.18) : 0),
        paintCan1: true,
        paintCan2: true,
        roller: { x: (u) => -0.75 + u * 1.45, speed: 6.5, tilt: 0.16, color: 0xfefdf8 },
        tetangga: {
          pos: (u) => [-0.15 + u * 0.65, 0, 0.72],
          ry: -0.22,
          expr: 'neutral',
          leftArmZ: (u, lt) => 1.38 + Math.sin(lt * 6.5) * 0.35,
        },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [-0.15, 1.35, 3.25], look: [-0.25, 1.35, 0.25], fov: 38 },
          { at: 0.6, pos: [0.35, 1.45, 3.05], look: [0.25, 1.48, 0.15], fov: 38 },
          { at: 1.0, pos: [0.75, 2.05, 2.35], look: [0.85, 2.05, 0.0], fov: 35 },
        ],
      },
    },

    // ── BEAT 14 (45.45 - 49.00s): High-Angle — Paling Terang Sekampung ───────
    {
      id: 'b14-paling-terang',
      label: '14 · Paling Terang Sekampung',
      start: 45.45,
      end: 49.00,
      fadeIn: 0.0,
      fadeOut: 0.22,
      captions: [
        { start: 0.15, end: 1.25, text: 'Lama-lama tembok itu' },
        { start: 1.25, end: 2.35, text: 'jadi yang *paling terang*' },
        { start: 2.35, end: 3.40, text: 'sekampung.' },
      ],
      diorama: {
        night: (u) => (u > 0.72 ? (u - 0.72) * 1.8 : 0),
        whiteCover: 1.0,
        white2Cover: 1.0,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        startPos: [-3.45, 5.25, 6.75],
        endPos: [-1.65, 4.55, 5.75],
        startLook: [-0.45, 1.35, -0.35],
        endLook: [-0.25, 1.45, -0.25],
        startFov: 44,
        endFov: 42,
      },
    },

    // ── BEAT 15 (49.00 - 54.35s): Paginya Putih + Daun Pisang Diiket Rapi ────
    {
      id: 'b15-daun-pisang-diiket',
      label: '15 · Daun Pisang Diiket Rapi',
      start: 49.00,
      end: 54.35,
      fadeIn: 0.20,
      fadeOut: 0.0,
      captions: [
        { start: 0.15, end: 1.85, text: 'Paginya, temboknya putih lagi,' },
        { start: 1.95, end: 3.65, text: 'dan daun pisang di depan tembok' },
        { start: 3.65, end: 5.15, text: '*diiket rapi*.' },
      ],
      diorama: {
        night: 0,
        whiteCover: 1.0,
        white2Cover: 1.0,
        leavesTied: true,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [0.85, 1.75, 3.65], look: [0.25, 1.72, 0.0], fov: 38 },
          { at: 0.42, pos: [-0.95, 1.85, 3.15], look: [-1.45, 1.95, 0.65], fov: 36 },
          { at: 1.0, pos: [-1.45, 2.02, 2.38], look: [-1.62, 2.02, 0.72], fov: 34 },
        ],
      },
    },

    // ── BEAT 16 (54.35 - 57.85s): Bu Warni Nyerah — "Ya udah, cuma cat." ─────
    {
      id: 'b16-bu-warni-nyerah',
      label: '16 · Bu Warni Nyerah',
      start: 54.35,
      end: 57.85,
      fadeIn: 0.0,
      fadeOut: 0.35,
      captions: [
        { start: 0.15, end: 1.35, text: 'Bu Warni *nyerah*.' },
        { start: 1.50, end: 2.38, text: 'Ya udah,' },
        { start: 2.48, end: 3.35, text: '*cuma cat*.' },
      ],
      diorama: {
        night: 0.18,
        whiteCover: 1.0,
        white2Cover: 1.0,
        leavesTied: true,
        paintCan1: false,
        tetangga: { visible: false },
        buWarni: {
          pos: [-2.95, 0, 0.45],
          ry: 0.05,
          expr: (u) => (u < 0.45 ? 'dizzy' : 'peaceful'),
          icons: (u) => ({ sweat: u < 0.55 }),
        },
      },
      dioramaCamera: {
        startPos: [-2.95, 1.24, 2.85],
        endPos: [-2.95, 1.22, 2.38],
        startLook: [-2.95, 1.10, 0.45],
        endLook: [-2.95, 1.10, 0.45],
        startFov: 37,
        endFov: 35,
      },
    },

    // ── BEAT 17 (57.85 - 65.90s): THE REVEAL — Malam Pembukaan Liga Nobar! ───
    {
      id: 'b17-reveal-nobar',
      label: '17 · REVEAL Layar Nobar',
      start: 57.85,
      end: 65.90,
      fadeIn: 0.35,
      fadeOut: 0.0,
      captions: [
        { start: 0.18, end: 1.55, text: 'Malam pembukaan liga,' },
        { start: 1.65, end: 3.80, text: 'gang Bu Warni tiba-tiba *rame*.' },
        { start: 4.15, end: 5.20, text: 'Kursinya ada,' },
        { start: 5.38, end: 6.45, text: 'kopinya ada,' },
        { start: 6.60, end: 7.85, text: '*layarnya gede*.' },
      ],
      diorama: {
        night: 1.0,
        porchLamp: 0.75,
        whiteCover: 1.0,
        white2Cover: 1.0,
        projection: 1.0,
        projBright: 1.0,
        ballPhase: (u) => (u * 0.55) % 1.0,
        leavesTied: true,
        paintCan1: false,
        projector: true,
        nobarProps: true,
        crowd: 'seated',
        tetangga: {
          pos: [1.55, 0, 2.55],
          ry: -0.35,
          expr: 'smileBig',
          leftArmZ: (u, lt) => 1.85 + Math.sin(lt * 7) * 0.25,
        },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [-2.45, 4.45, 7.65], look: [0.0, 1.35, 1.45], fov: 44 },
          { at: 0.45, pos: [-0.85, 2.35, 5.85], look: [0.0, 1.35, 1.25], fov: 42 },
          { at: 0.65, pos: [1.85, 1.48, 4.25], look: [1.72, 0.76, 3.25], fov: 36 },
          { at: 0.85, pos: [0.25, 1.45, 4.95], look: [0.0, 1.82, 0.0], fov: 40 },
          { at: 1.0, pos: [0.05, 1.65, 4.55], look: [0.0, 1.85, 0.0], fov: 39 },
        ],
      },
    },

    // ── BEAT 18 (65.90 - 74.35s): Bu Warni Kaget + Proyektor di Kaleng Cat ───
    {
      id: 'b18-bu-warni-shock-proyektor',
      label: '18 · Bu Warni Kaget + Proyektor',
      start: 65.90,
      end: 74.35,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.20, end: 1.30, text: 'Bu Warni keluar.' },
        { start: 1.48, end: 3.10, text: 'Di temboknya ada pemain bola' },
        { start: 3.10, end: 4.40, text: 'segede *pintu*!' },
        { start: 4.70, end: 5.75, text: 'Di halaman dia,' },
        { start: 5.90, end: 7.25, text: 'proyektor kecil di atas' },
        { start: 7.25, end: 8.30, text: '*kaleng cat putih*.' },
      ],
      diorama: {
        night: 1.0,
        doorOpen: true,
        porchLamp: 1.25,
        whiteCover: 1.0,
        white2Cover: 1.0,
        projection: 1.0,
        projBright: 1.0,
        ballPhase: (u) => 0.15 + u * 0.2,
        leavesTied: true,
        paintCan1: false,
        projector: true,
        nobarProps: true,
        crowd: 'seated',
        tetangga: {
          pos: [1.48, 0, 2.45],
          ry: -0.25,
          expr: 'smileBig',
        },
        buWarni: {
          pos: (u) => [-2.85 + Math.min(1, u * 2.4) * 0.72, 0, 0.35 + Math.min(1, u * 2.4) * 1.15],
          ry: (u) => (u < 0.24 ? 0.15 : 0.65),
          expr: (u) => (u < 0.26 ? 'deadpan' : 'shock'),
          icons: (u) => ({ bang: u >= 0.26 && u < 0.62 }),
        },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [-2.85, 1.32, 2.75], look: [-2.85, 1.18, 0.35], fov: 38 },
          { at: 0.30, pos: [-2.25, 1.38, 3.65], look: [-1.45, 1.35, 0.65], fov: 40 },
          { at: 0.56, pos: [-1.15, 1.55, 3.95], look: [0.15, 1.72, 0.0], fov: 40 },
          { at: 0.72, pos: [0.75, 0.72, 3.42], look: [0.05, 0.35, 2.48], fov: 35 },
          { at: 1.0, pos: [0.48, 0.62, 3.15], look: [0.02, 0.35, 2.48], fov: 34 },
        ],
      },
    },

    // ── BEAT 19 (74.35 - 88.95s): Dimensi 4m x 3m + Hitungan Cuan Rp1 JT! ────
    {
      id: 'b19-dimensi-dan-cuan',
      label: '19 · Dimensi 4×3m & Cuan Rp1 JT',
      start: 74.35,
      end: 88.95,
      fadeIn: 0.0,
      fadeOut: 0.0,
      captions: [
        { start: 0.18, end: 2.70, text: 'Tembok Bu Warni *tiga kali empat meter*.' },
        { start: 2.95, end: 4.40, text: 'Pas buat *layar nobar*!' },
        { start: 4.70, end: 6.95, text: 'Satu malam, *lima puluh* orang.' },
        { start: 7.20, end: 9.15, text: 'Kopi sama kacang *sepuluh ribu*.' },
        { start: 9.35, end: 10.95, text: '*Lima ratus ribu* semalam.' },
        { start: 11.20, end: 12.95, text: 'Seminggu dua pertandingan,' },
        { start: 13.05, end: 14.50, text: '*sejuta* seminggu!' },
      ],
      hudTimeline: [
        { start: 5.35, end: 7.15, value: '50 ORANG', color: '#facc15', yFrac: 0.24, large: true },
        { start: 7.65, end: 9.25, value: 'Rp10.000', color: '#facc15', yFrac: 0.25 },
        { start: 9.35, end: 11.15, formula: '50 × Rp10.000', value: 'Rp500 RB', color: '#4ade80', yFrac: 0.22 },
        { start: 11.45, end: 12.95, formula: 'Rp500 RB × 2', value: '', color: '#f8fafc', yFrac: 0.22 },
        { start: 12.95, end: 14.55, formula: 'Rp500 RB × 2', value: 'Rp1 JT', color: '#4ade80', yFrac: 0.22, large: true },
      ],
      diorama: {
        night: 1.0,
        porchLamp: 0.65,
        whiteCover: 1.0,
        white2Cover: 1.0,
        projection: 1.0,
        projBright: 1.0,
        dimOverlay: (u) => (u < 0.34 ? Math.min(1, u / 0.08) : 0),
        ballPhase: (u) => (0.25 + u * 0.45) % 1.0,
        leavesTied: true,
        paintCan1: false,
        projector: true,
        nobarProps: true,
        crowd: 'seated',
        crowdFaceCam: true,
        tetangga: {
          pos: [1.65, 0, 2.65],
          ry: 0.15,
          expr: (u) => (u > 0.72 ? 'smileBig' : 'happy'),
          leftArmZ: 0.26,
          rightArmZ: -0.26,
        },
        buWarni: { visible: false },
      },
      dioramaCamera: {
        keyframes: [
          { at: 0.0, pos: [0.15, 1.75, 4.95], look: [0.0, 1.78, 0.0], fov: 42 },
          { at: 0.30, pos: [0.35, 1.85, 5.45], look: [0.0, 1.72, 0.0], fov: 44 },
          { at: 0.36, pos: [-0.25, 1.72, 1.65], look: [-0.15, 0.85, 3.65], fov: 44 },
          { at: 0.50, pos: [1.75, 1.18, 4.18], look: [1.72, 0.72, 3.25], fov: 36 },
          { at: 0.64, pos: [1.82, 1.48, 4.65], look: [1.68, 1.38, 2.75], fov: 38 },
          { at: 1.0, pos: [1.76, 1.56, 4.82], look: [1.65, 1.48, 2.65], fov: 39 },
        ],
      },
    },

    // ── BEAT 20 (88.95 - 98.80s): Modal 2 Kaleng, Bioskop & Callback Gawang ──
    {
      id: 'b20-modal-bioskop-callback',
      label: '20 · Bioskop & Callback Gawang',
      start: 88.95,
      end: 98.80,
      fadeIn: 0.0,
      fadeOut: 0.75,
      captions: [
        { start: 0.18, end: 0.95, text: 'Modalnya?' },
        { start: 1.15, end: 2.30, text: 'Cat dua *kaleng*.' },
        { start: 2.50, end: 3.45, text: 'Yang dia buka,' },
        { start: 3.55, end: 4.35, text: '*bioskop*.' },
        { start: 4.55, end: 7.10, text: 'Oh iya, daun pisang yang diiket itu...' },
        { start: 7.22, end: 8.95, text: 'biar nggak *nutupin gawang*.' },
      ],
      diorama: {
        night: 1.0,
        porchLamp: 0.65,
        whiteCover: 1.0,
        white2Cover: 1.0,
        projection: 1.0,
        projBright: 1.0,
        // Soccer ball shoots straight toward the goalkeeper during the final callback!
        ballPhase: (u) => (u > 0.55 ? Math.min(1, (u - 0.55) / 0.32) : 0.1),
        leavesTied: true,
        paintCan1: false,
        projector: true,
        nobarProps: true,
        crowd: 'seated',
        tetangga: {
          pos: [1.45, 0, 2.55],
          ry: -0.25,
          expr: 'smileBig',
        },
        buWarni: {
          pos: [-2.18, 0, 1.48],
          ry: 0.35,
          expr: 'dizzy',
        },
      },
      dioramaCamera: {
        keyframes: [
          // 0.00 - 0.24: Close-up 2 white paint cans + projector ("Modalnya? Cat dua kaleng.")
          { at: 0.0, pos: [0.58, 0.65, 3.22], look: [0.12, 0.32, 2.48], fov: 35 },
          { at: 0.23, pos: [0.46, 0.62, 3.05], look: [0.12, 0.32, 2.48], fov: 34 },
          // 0.26 - 0.45: Proud wide high-angle village cinema ("Yang dia buka, bioskop.")
          { at: 0.28, pos: [-2.05, 4.15, 7.15], look: [0.0, 1.45, 1.25], fov: 44 },
          { at: 0.45, pos: [-1.45, 3.65, 6.45], look: [0.0, 1.45, 1.05], fov: 43 },
          // 0.48 - 1.00: CALLBACK — Tied banana tree leaves -> drift right revealing unobstructed left goal + dizzy Bu Warni!
          { at: 0.50, pos: [-1.52, 1.98, 2.68], look: [-1.62, 1.92, 0.72], fov: 37 },
          { at: 0.72, pos: [-1.55, 1.52, 3.25], look: [-1.42, 1.32, 0.15], fov: 40 },
          { at: 1.0, pos: [-1.32, 1.45, 3.45], look: [-1.38, 1.22, 0.15], fov: 41 },
        ],
      },
    },
  ],

  audio: {
    masterVolume: 0.86,
    voiceActive: true,
    busVolumes: {
      ambience: 0.20,
      sfx_primary: 0.68,
      sfx_secondary: 0.50,
      transition: 0.52,
    },
    ambienceTracks: [
      { id: 'amb_day_1', presetId: 'env_outdoor_birds_foley', startTime: 0.0, duration: 28.55, loop: true, volume: 0.22, bus: 'ambience', fadeIn: 0.25, fadeOut: 0.2 },
      { id: 'amb_night_1', presetId: 'env_wind_ambience', startTime: 28.55, duration: 3.70, loop: true, volume: 0.24, bus: 'ambience', fadeIn: 0.15, fadeOut: 0.15 },
      { id: 'amb_day_2', presetId: 'env_outdoor_birds_foley', startTime: 32.25, duration: 25.60, loop: true, volume: 0.20, bus: 'ambience', fadeIn: 0.2, fadeOut: 0.3 },
      { id: 'amb_nobar_night', presetId: 'env_wind_ambience', startTime: 57.85, duration: 40.95, loop: true, volume: 0.26, bus: 'ambience', fadeIn: 0.35, fadeOut: 0.8 },
    ],
    events: [
      { id: 'sfx_01_zoom', presetId: 'cam_zoom_out', startTime: 3.55, volume: 0.56, bus: 'transition' },
      { id: 'sfx_02_crane', presetId: 'cam_cinematic_sweep', startTime: 8.35, volume: 0.48, bus: 'transition' },
      { id: 'sfx_03_pop', presetId: 'com_pop', startTime: 12.15, volume: 0.52, bus: 'sfx_secondary' },
      { id: 'sfx_04_heran', presetId: 'char_confused_reaction', startTime: 16.90, volume: 0.65, bus: 'sfx_primary' },
      { id: 'sfx_05_trans', presetId: 'cam_scene_transition', startTime: 20.50, volume: 0.52, bus: 'transition' },
      { id: 'sfx_06_silau', presetId: 'com_pop', startTime: 24.05, volume: 0.58, bus: 'sfx_secondary' },
      { id: 'sfx_07_cicak', presetId: 'com_boing', startTime: 25.35, volume: 0.55, bus: 'sfx_primary' },
      { id: 'sfx_08_ilang', presetId: 'com_tiny_fail', startTime: 27.60, volume: 0.55, bus: 'sfx_secondary' },
      { id: 'sfx_09_meter', presetId: 'ui_button_click', startTime: 28.65, volume: 0.56, bus: 'sfx_secondary' },
      { id: 'sfx_10_whip', presetId: 'cam_whip_pan', startTime: 33.60, volume: 0.54, bus: 'transition' },
      { id: 'sfx_11_lapor', presetId: 'char_confused_reaction', startTime: 35.35, volume: 0.58, bus: 'sfx_primary' },
      { id: 'sfx_12_hijau', presetId: 'cam_whoosh_soft', startTime: 38.60, volume: 0.48, bus: 'transition' },
      { id: 'sfx_13_2lapis', presetId: 'ui_notification_ping', startTime: 44.35, volume: 0.66, bus: 'sfx_primary' },
      { id: 'sfx_14_crane', presetId: 'cam_cinematic_sweep', startTime: 45.55, volume: 0.50, bus: 'transition' },
      { id: 'sfx_15_diiket', presetId: 'com_pop', startTime: 52.60, volume: 0.60, bus: 'sfx_primary' },
      { id: 'sfx_16_nyerah', presetId: 'char_sigh_foley', startTime: 55.60, volume: 0.62, bus: 'sfx_primary' },
      // THE REVEAL: Malam Pembukaan Liga!
      { id: 'sfx_17_reveal', presetId: 'emo_dramatic_reveal', startTime: 58.05, volume: 0.72, bus: 'sfx_primary' },
      { id: 'sfx_18_kursi', presetId: 'com_pop', startTime: 62.05, volume: 0.58, bus: 'sfx_secondary' },
      { id: 'sfx_19_kopi', presetId: 'com_pop', startTime: 63.28, volume: 0.58, bus: 'sfx_secondary' },
      { id: 'sfx_20_layar', presetId: 'emo_triumph_cue', startTime: 64.55, volume: 0.62, bus: 'sfx_primary' },
      { id: 'sfx_21_door', presetId: 'obj_door_open_foley', startTime: 66.15, volume: 0.65, bus: 'sfx_secondary' },
      { id: 'sfx_22_shock', presetId: 'emo_shock_accent', startTime: 68.10, volume: 0.72, bus: 'sfx_primary' },
      { id: 'sfx_23_whip', presetId: 'cam_whip_pan', startTime: 71.75, volume: 0.56, bus: 'transition' },
      { id: 'sfx_24_dim', presetId: 'ui_chart_reveal', startTime: 74.75, volume: 0.62, bus: 'sfx_primary' },
      { id: 'sfx_25_50', presetId: 'ui_number_count_up', startTime: 79.70, volume: 0.64, bus: 'sfx_primary' },
      { id: 'sfx_26_10rb', presetId: 'fin_cash_subtle', startTime: 82.00, volume: 0.66, bus: 'sfx_primary' },
      { id: 'sfx_27_500rb', presetId: 'fin_profit_reveal', startTime: 83.75, volume: 0.70, bus: 'sfx_primary' },
      { id: 'sfx_28_1jt', presetId: 'fin_milestone_achieved', startTime: 87.35, volume: 0.76, bus: 'sfx_primary' },
      { id: 'sfx_29_modal', presetId: 'cam_whip_pan', startTime: 89.05, volume: 0.56, bus: 'transition' },
      { id: 'sfx_30_bioskop', presetId: 'emo_unexpected_twist', startTime: 92.45, volume: 0.66, bus: 'sfx_primary' },
      { id: 'sfx_31_gawang', presetId: 'com_spring_bounce', startTime: 96.25, volume: 0.66, bus: 'sfx_primary' },
      { id: 'sfx_32_end', presetId: 'emo_gentle_ending', startTime: 97.30, volume: 0.56, bus: 'sfx_secondary' },
    ],
  },
};
