# 03 — 3D Camera Choreography & 5-Act Storytelling Rhythm

Module: `src/camera/camera-director.js`

## 5 Signature Camera Moves (From Viral 3D Stickman Breakdown)

1. **Slow Push-In / Dolly-In (Character Reaction & Detail):**
   Keep camera `1.8m–2.6m` away from a 2.5D stickman (never closer than `1.4m` so head + torso + floating icons breathe in 9:16 portrait).
   ```js
   dioramaCamera: {
     startPos: [-2.05, 1.25, 4.45],
     endPos:   [-2.12, 1.24, 3.45],
     startLook: [-2.25, 1.05, 1.65],
     endLook:   [-2.22, 1.12, 1.65],
     startFov: 38,
     endFov: 36,
   }
   ```
2. **Continuous Multi-Angle Reveal (1 Take, Zero Hard Cuts):**
   Use `keyframes` (`at: 0..1` normalized over the beat duration) to pull out → crane up isometric → swoop down low-angle tilt-up:
   ```js
   dioramaCamera: {
     keyframes: [
       { at: 0.00, pos: [-1.15, 1.45, 4.85], look: [-0.45, 1.62, -0.30], fov: 42 },
       { at: 0.58, pos: [-2.65, 5.15, 5.95], look: [-0.05, 1.15,  0.65], fov: 44 },
       { at: 1.00, pos: [ 0.58, 0.78, 3.15], look: [-0.05, 2.05,  0.00], fov: 42 },
     ],
   }
   ```
3. **Whip-Pan Across Same 3D Set:** Place two adjacent keyframes `0.15–0.22` apart in `at` shifting `pos` & `look` rapidly between two subjects (e.g., Bu Warni → white wall, or coffee table → giant screen).
4. **High-Angle Bird's-Eye Establishing:** `y: 4.4–5.3`, `z: 6.5–7.6`, `fov: 43–44` to show geography, crowds, or passage of time.
5. **Time-Jump Crossfades:** Reserve `fadeIn: 0.25–0.35` / `fadeOut: 0.25–0.35` specifically for time jumps (morning → month later, day → night); use crisp hard cuts (`fadeIn: 0, fadeOut: 0`) within the same scene!

## 5-Act Viral Short-Form Storytelling Formula (~60–100s)

1. **Act 1 — Mystery Hook (`0–15%`):** Open immediately mid-action with one bizarre contradiction (*"Tiap minggu pagi dia ngecat tembok... tapi bukan tembok dia."*).
2. **Act 2 — Absurd Escalation (`15–40%`):** Stack 3 concrete mini-consequences (`silau`, `cicak pindah`, `ngukur pakai meteran`) — **every single spoken phrase triggers a literal visual gag**.
3. **Act 3 — Failed Counter-Move & Resignation (`40–60%`):** Protagonist fights back (`ngecat hijau`) → countered effortlessly (`putih dua lapis`) → gives up (`"Ya udah, cuma cat."`). Plant 1 tiny unexplained detail (`daun pisang diiket rapi`) for the ending callback!
4. **Act 4 — Logical Plot Twist Reveal (`60–80%`):** Dramatic lighting/time flip (day → glowing night) revealing the clever real motive (`layar nobar` + projector on paint can + `4m × 3m` wall).
5. **Act 5 — Business Math Payoff & Callback Punchline (`80–100%`):** Rapid escalating HUD math (`50 orang × Rp10.000 = Rp500 RB → Rp1 JT`) + hilarious final callback explaining the tiny detail planted in Act 3 (`biar nggak nutupin gawang`).
