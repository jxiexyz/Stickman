/**
 * Plug-and-Play 3D Stage Registry.
 * Register new 3D world stages here so episodes can pick them via `stageId`.
 */

import { VillageNobarStage } from './village-nobar-stage.js';

const STAGES = new Map([
  ['village-nobar', VillageNobarStage],
]);

export function registerStage(stageId, StageClass) {
  STAGES.set(stageId, StageClass);
}

export function listStages() {
  return [...STAGES.keys()];
}

export function createStage(stageId, scene, renderer, camera) {
  const Cls = STAGES.get(stageId || 'village-nobar');
  if (!Cls) {
    throw new Error(`Unknown stageId "${stageId}". Registered stages: ${listStages().join(', ')}`);
  }
  return new Cls(scene, renderer, camera);
}
