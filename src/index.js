export * from './utils/math.js';
export {
  EXPRESSION_NAMES,
  HEADWEAR_TYPES,
  drawFaceExpression2D,
  getStickmanHeadTexture,
  getStickmanBodyTexture,
  createReactionSprite,
  createStickman25D,
} from './characters/stickman-25d.js';
export { evaluateDioramaCamera } from './camera/camera-director.js';
export { OverlayRenderer } from './overlay/caption-hud-renderer.js';
export {
  getOutlineMaterial,
  makeOutlined3DProp,
  createRoofTileTexture,
  createStuccoTexture,
  createDayNightLightRig,
  addOutdoorVillageGround,
} from './stages/base-stage.js';
export { VillageNobarStage } from './stages/village-nobar-stage.js';
export { registerStage, listStages, createStage } from './stages/registry.js';
export {
  SFX_CATEGORIES,
  AUDIO_BUS_DEFAULTS,
  BUILTIN_SFX_PRESETS,
  BUILTIN_SFX_COMBINATIONS,
  SFXPresetRegistry,
} from './audio/sfx-presets.js';
export {
  generatePresetWaveform,
  synthesizePresetSamples,
  SFXBusManager,
  SFXEventScheduler,
  SFXPreviewController,
  renderSFXTimelineToWav,
} from './audio/sfx-engine.js';
