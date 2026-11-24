# 02 — Building Real-3D Worlds, Props & Dynamic Surfaces

Modules: `src/stages/base-stage.js`, `src/stages/registry.js`, `src/stages/village-nobar-stage.js`

## Single-Hero-Set Principle

Instead of modeling 10 shallow rooms, build **1 rich, persistent 3D hero location** where the camera explores 20–40 angles:
- Change **time of day** (`lights.applyNight(0..1)` + warm interior `PointLight` + volumetric cone).
- Swap/animate **CanvasTexture hero surfaces** (walls, chalkboards, storefront signs, screens).
- Mutate **3D prop states** deterministically (e.g., banana tree leaves untied → tied upright with a ring; chairs/table appearing for night scenes).

## Reusable Helpers in `src/stages/base-stage.js`

- `createDayNightLightRig(scene, root, renderer)` — Configures `PCFSoftShadowMap`, directional sun (`castShadow = true`, `1024×1024` shadow map), hemisphere fill, moon rim, sky + fog color interpolation via `.applyNight(0..1)`.
- `addOutdoorVillageGround(root, { excludeFootprint })` — Ground lawn, damp moss patch, concrete village lane, 1,350 deterministic instanced 3D grass blades, 130 yellow wildflowers, distant foggy hills, and 4 sculpted trees.
- `makeOutlined3DProp(geometry, material, outlineScale)` — Adds a crisp inverted-hull black outline (`THREE.BackSide`) to key interactive 3D props (paint cans, measuring tape, projector, gecko) so they bridge the visual gap between realistic 3D set and 2.5D stickman characters.
- `createRoofTileTexture()` / `createStuccoTexture(hex)` — Deterministic procedural CanvasTextures (zero external image files needed).

## Registering a Brand-New 3D Stage

1. Create `src/stages/my-stage.js` exporting `class MyStage`:
   ```js
   export class MyStage {
     constructor(scene, renderer, camera) {
       this.scene = scene;
       this.renderer = renderer;
       this.camera = camera;
       this.root = new THREE.Group();
       scene.add(this.root);
       this.lights = createDayNightLightRig(scene, this.root, renderer);
       // Build 3D geometry + createStickman25D characters
     }

     evaluateBeat(beat, localTime, globalTime) {
       const dur = Math.max(0.1, (beat.end ?? 5) - (beat.start ?? 0));
       const u = clamp(localTime / dur, 0, 1);
       // 1. Update lighting, dynamic textures, and props from beat.diorama
       // 2. Evaluate camera via evaluateDioramaCamera(this.camera, beat.dioramaCamera, u, globalTime)
       // 3. Pose characters and call char.faceCameraY(this.camera.position, extraYaw)
     }
   }
   ```
2. Register it in `src/stages/registry.js`:
   ```js
   import { MyStage } from './my-stage.js';
   registerStage('my-stage', MyStage);
   ```
3. Point your episode at it: `stageId: 'my-stage'`.
