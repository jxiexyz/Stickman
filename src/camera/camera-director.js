/**
 * Deterministic 3D Free Camera Choreography Director.
 *
 * Supports:
 *  - Multi-keyframe continuous 3D camera moves (pull-out -> isometric crane orbit -> low-angle tilt-up)
 *  - Simple startPos/endPos + startLook/endLook smooth dolly/pan moves
 *  - Subtle deterministic handheld micro-drift so shots never feel dead/static
 */

import { clamp01, easeInOutCubic, lerp } from '../utils/math.js';

export function evaluateDioramaCamera(camera, camSpec, u, globalTime) {
  if (!camSpec) return;

  const progress = clamp01(u);
  let pos = [0, 1.5, 4.5];
  let look = [0, 1.4, 0];
  let fov = 38;

  if (Array.isArray(camSpec.keyframes) && camSpec.keyframes.length > 0) {
    const keys = camSpec.keyframes;
    let k0 = keys[0];
    let k1 = keys[keys.length - 1];
    if (progress <= (keys[0].at ?? 0)) {
      k0 = k1 = keys[0];
    } else if (progress >= (keys[keys.length - 1].at ?? 1)) {
      k0 = k1 = keys[keys.length - 1];
    } else {
      for (let i = 0; i < keys.length - 1; i++) {
        if (progress >= (keys[i].at ?? 0) && progress <= (keys[i + 1].at ?? 1)) {
          k0 = keys[i];
          k1 = keys[i + 1];
          break;
        }
      }
    }
    const span = Math.max(0.0001, (k1.at ?? 1) - (k0.at ?? 0));
    const a = easeInOutCubic((progress - (k0.at ?? 0)) / span);
    pos = [
      lerp(k0.pos[0], k1.pos[0], a),
      lerp(k0.pos[1], k1.pos[1], a),
      lerp(k0.pos[2], k1.pos[2], a),
    ];
    look = [
      lerp(k0.look[0], k1.look[0], a),
      lerp(k0.look[1], k1.look[1], a),
      lerp(k0.look[2], k1.look[2], a),
    ];
    fov = lerp(k0.fov ?? 38, k1.fov ?? 38, a);
  } else {
    const a = easeInOutCubic(progress);
    const sPos = camSpec.startPos || [0, 1.5, 4.5];
    const ePos = camSpec.endPos || sPos;
    const sLook = camSpec.startLook || [0, 1.4, 0];
    const eLook = camSpec.endLook || sLook;
    pos = [
      lerp(sPos[0], ePos[0], a),
      lerp(sPos[1], ePos[1], a),
      lerp(sPos[2], ePos[2], a),
    ];
    look = [
      lerp(sLook[0], eLook[0], a),
      lerp(sLook[1], eLook[1], a),
      lerp(sLook[2], eLook[2], a),
    ];
    fov = lerp(camSpec.startFov ?? 38, camSpec.endFov ?? (camSpec.startFov ?? 38), a);
  }

  const driftAmt = camSpec.handheld ?? 0.014;
  pos[0] += Math.sin(globalTime * 1.4) * driftAmt;
  pos[1] += Math.cos(globalTime * 1.9) * driftAmt * 0.7;

  camera.fov = fov;
  camera.updateProjectionMatrix();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  camera.updateMatrixWorld();
}
