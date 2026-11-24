/**
 * Reusable 2.5D Flat Vector Stickman Cutout Character Rig for Three.js 3D Worlds.
 *
 * Design Philosophy:
 *  - Characters are rendered as crisp high-resolution 2D vector art (512x512 Canvas2D textures)
 *    with uniform thick black ink outlines and subtle 2-tone cel shading, mounted on articulated
 *    2.5D planes (torso/robe + head + pivoted thin stick arms & legs).
 *  - Inside any real-3D Three.js environment, they cast real 3D shadows (`castShadow: true`),
 *    respond softly to day/night lighting (`MeshLambertMaterial` + `alphaTest: 0.45`), and gently
 *    billboard on the Y-axis toward the active 3D camera so they never appear paper-thin during
 *    crane-ups, orbits, or whip-pans.
 *  - 100% deterministic (zero Math.random / Date.now).
 */

import * as THREE from 'three';
import { clamp, lerp } from '../utils/math.js';

export const EXPRESSION_NAMES = [
  'neutral',
  'deadpan',
  'confused',
  'angry',
  'squint',
  'shock',
  'happy',
  'smileBig',
  'peaceful',
  'dizzy',
  'sleep',
];

export const HEADWEAR_TYPES = ['cap', 'hijab', 'peci', 'bowl', 'caping', 'none'];

const HEAD_TEX_CACHE = new Map();
const BODY_TEX_CACHE = new Map();

export function drawFaceExpression2D(ctx, cx, cy, expr = 'neutral', scale = 1.0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const ink = '#10141c';

  const flatEye = (x, y, w = 24) => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.5, y);
    ctx.lineTo(x + w * 0.5, y);
    ctx.stroke();
  };
  const dotEye = (x, y, r = 9.5) => {
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  const happyArcEye = (x, y, r = 16) => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 9.5;
    ctx.beginPath();
    ctx.arc(x, y + 6, r, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();
  };
  const spiralEye = (x, y) => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 4.2; a += 0.25) {
      const r = 1.5 + a * 1.55;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };

  if (expr === 'neutral') {
    flatEye(-36, -6, 22);
    flatEye(36, -6, 22);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 8.5;
    ctx.beginPath();
    ctx.moveTo(-12, 34);
    ctx.lineTo(12, 34);
    ctx.stroke();
  } else if (expr === 'deadpan') {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 8.5;
    ctx.beginPath();
    ctx.moveTo(-54, -22); ctx.lineTo(-18, -20);
    ctx.moveTo(18, -20); ctx.lineTo(54, -22);
    ctx.stroke();
    flatEye(-36, -4, 24);
    flatEye(36, -4, 24);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-13, 36); ctx.lineTo(13, 36);
    ctx.stroke();
  } else if (expr === 'confused') {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-54, -18); ctx.quadraticCurveTo(-36, -34, -18, -22);
    ctx.moveTo(18, -22); ctx.quadraticCurveTo(36, -34, 54, -18);
    ctx.stroke();
    dotEye(-35, 2, 8.5);
    dotEye(35, 2, 8.5);
    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.moveTo(-24, 38);
    ctx.quadraticCurveTo(-14, 28, -4, 38);
    ctx.quadraticCurveTo(6, 48, 16, 38);
    ctx.quadraticCurveTo(24, 30, 30, 38);
    ctx.stroke();
  } else if (expr === 'angry') {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 9.5;
    ctx.beginPath();
    ctx.moveTo(-56, -28); ctx.lineTo(-16, -12);
    ctx.moveTo(56, -28); ctx.lineTo(16, -12);
    ctx.stroke();
    flatEye(-35, 4, 23);
    flatEye(35, 4, 23);
    ctx.lineWidth = 8.5;
    ctx.beginPath();
    ctx.arc(0, 52, 19, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();
  } else if (expr === 'squint') {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 9.5;
    ctx.beginPath();
    ctx.moveTo(-50, -16); ctx.lineTo(-22, -2); ctx.lineTo(-50, 12);
    ctx.moveTo(50, -16); ctx.lineTo(22, -2); ctx.lineTo(50, 12);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(-28, 28, 56, 26, 8);
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-10, 28); ctx.lineTo(-10, 54);
    ctx.moveTo(10, 28); ctx.lineTo(10, 54);
    ctx.moveTo(-28, 41); ctx.lineTo(28, 41);
    ctx.stroke();
  } else if (expr === 'shock') {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 7.5;
    ctx.beginPath(); ctx.arc(-36, -6, 23, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(36, -6, 23, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    dotEye(-33, -6, 6);
    dotEye(33, -6, 6);
    ctx.fillStyle = '#5c1824';
    ctx.beginPath(); ctx.ellipse(0, 44, 18, 25, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (expr === 'happy') {
    dotEye(-35, -2, 9.5);
    dotEye(35, -2, 9.5);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 8.5;
    ctx.beginPath();
    ctx.arc(0, 28, 19, Math.PI * 0.14, Math.PI * 0.86);
    ctx.stroke();
  } else if (expr === 'smileBig') {
    happyArcEye(-36, -4, 16);
    happyArcEye(36, -4, 16);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 26, 23, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (expr === 'peaceful') {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-54, -26); ctx.quadraticCurveTo(-36, -36, -18, -28);
    ctx.moveTo(18, -28); ctx.quadraticCurveTo(36, -36, 54, -26);
    ctx.stroke();
    happyArcEye(-36, -2, 16);
    happyArcEye(36, -2, 16);
    ctx.lineWidth = 8.5;
    ctx.beginPath();
    ctx.arc(0, 28, 19, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  } else if (expr === 'dizzy') {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.moveTo(-52, -30); ctx.quadraticCurveTo(-36, -40, -20, -30);
    ctx.moveTo(20, -30); ctx.quadraticCurveTo(36, -40, 52, -30);
    ctx.stroke();
    spiralEye(-36, 0);
    spiralEye(36, 0);
    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.moveTo(-24, 42);
    ctx.quadraticCurveTo(-12, 32, 0, 42);
    ctx.quadraticCurveTo(12, 52, 24, 42);
    ctx.stroke();
  } else if (expr === 'sleep') {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(-36, 0, 16, Math.PI * 0.12, Math.PI * 0.88);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(36, 0, 16, Math.PI * 0.12, Math.PI * 0.88);
    ctx.stroke();
    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.arc(0, 42, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function getStickmanHeadTexture({ headwear = 'cap', headwearColor = '#3f5168', expr = 'neutral' }) {
  const key = `${headwear}|${headwearColor}|${expr}`;
  if (HEAD_TEX_CACHE.has(key)) return HEAD_TEX_CACHE.get(key);

  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);
  const cx = 256;
  const cy = 270;
  const ink = '#10141c';

  if (headwear === 'hijab') {
    const baseCol = new THREE.Color(headwearColor);
    const darkCol = baseCol.clone().multiplyScalar(0.74);
    const lightCol = baseCol.clone().lerp(new THREE.Color('#ffffff'), 0.18);

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8, 178, 186, 0, 0, Math.PI * 2);
    const hg = ctx.createLinearGradient(cx - 160, cy - 160, cx + 160, cy + 160);
    hg.addColorStop(0, '#' + lightCol.getHexString());
    hg.addColorStop(0.65, '#' + baseCol.getHexString());
    hg.addColorStop(1, '#' + darkCol.getHexString());
    ctx.fillStyle = hg;
    ctx.fill();
    ctx.lineWidth = 18;
    ctx.strokeStyle = ink;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 134, 136, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#' + darkCol.getHexString();
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = ink;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, 108, 104, 0, 0, Math.PI * 2);
    const fg = ctx.createLinearGradient(cx - 95, cy - 80, cx + 95, cy + 95);
    fg.addColorStop(0, '#fff4e3');
    fg.addColorStop(0.75, '#f5e1c3');
    fg.addColorStop(1, '#dfc49f');
    ctx.fillStyle = fg;
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = ink;
    ctx.stroke();

    ctx.strokeStyle = ink;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy + 8, 156, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 125, cy + 115);
    ctx.quadraticCurveTo(cx, cy + 178, cx + 135, cy + 108);
    ctx.stroke();
    ctx.restore();

    drawFaceExpression2D(ctx, cx, cy + 12, expr, 0.88);
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 146, 128, 0, 0, Math.PI * 2);
    const fg = ctx.createLinearGradient(cx - 130, cy - 100, cx + 130, cy + 110);
    fg.addColorStop(0, '#fff5e4');
    fg.addColorStop(0.72, '#f4e0c2');
    fg.addColorStop(1, '#d8bc96');
    ctx.fillStyle = fg;
    ctx.fill();
    ctx.lineWidth = 16;
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.restore();

    drawFaceExpression2D(ctx, cx, cy + 28, expr, 0.94);

    if (headwear === 'cap') {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 30, 150, 96, 0, Math.PI, Math.PI * 2);
      ctx.closePath();
      const cg = ctx.createLinearGradient(cx - 140, cy - 120, cx + 140, cy - 20);
      cg.addColorStop(0, '#5a6e87');
      cg.addColorStop(0.65, '#3b4c63');
      cg.addColorStop(1, '#233042');
      ctx.fillStyle = cg;
      ctx.fill();
      ctx.lineWidth = 16;
      ctx.strokeStyle = ink;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy - 24, 152, 26, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#263447';
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.strokeStyle = ink;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx - 24, cy - 52, 74, Math.PI * 1.18, Math.PI * 1.62);
      ctx.stroke();
      ctx.restore();
    } else if (headwear === 'peci') {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cx - 122, cy - 178, 244, 118, [26, 26, 12, 12]);
      const pg = ctx.createLinearGradient(cx - 110, cy - 170, cx + 110, cy - 70);
      pg.addColorStop(0, '#2c313d');
      pg.addColorStop(0.7, '#161922');
      pg.addColorStop(1, '#0b0e14');
      ctx.fillStyle = pg;
      ctx.fill();
      ctx.lineWidth = 16;
      ctx.strokeStyle = ink;
      ctx.stroke();
      ctx.restore();
    } else if (headwear === 'bowl') {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 18, 154, 108, 0, Math.PI * 0.96, Math.PI * 2.04);
      ctx.quadraticCurveTo(cx, cy - 42, cx - 154, cy - 18);
      ctx.closePath();
      ctx.fillStyle = '#181c26';
      ctx.fill();
      ctx.lineWidth = 16;
      ctx.strokeStyle = ink;
      ctx.stroke();
      ctx.restore();
    } else if (headwear === 'caping') {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - 196);
      ctx.lineTo(cx + 218, cy - 38);
      ctx.quadraticCurveTo(cx, cy - 8, cx - 218, cy - 38);
      ctx.closePath();
      const cg = ctx.createLinearGradient(cx - 180, cy - 180, cx + 180, cy - 20);
      cg.addColorStop(0, '#e5cc93');
      cg.addColorStop(0.7, '#c7a461');
      cg.addColorStop(1, '#9c7c3e');
      ctx.fillStyle = cg;
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = ink;
      ctx.stroke();
      ctx.restore();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  HEAD_TEX_CACHE.set(key, tex);
  return tex;
}

export function getStickmanBodyTexture({ shirtColor = '#c5b8a5', robeMode = false }) {
  const key = `${shirtColor}|${robeMode}`;
  if (BODY_TEX_CACHE.has(key)) return BODY_TEX_CACHE.get(key);

  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);
  const cx = 256;
  const ink = '#10141c';
  const baseCol = new THREE.Color(shirtColor);
  const darkCol = baseCol.clone().multiplyScalar(0.78);
  const lightCol = baseCol.clone().lerp(new THREE.Color('#ffffff'), 0.16);

  if (robeMode) {
    ctx.beginPath();
    ctx.moveTo(cx - 88, 36);
    ctx.quadraticCurveTo(cx - 118, 220, cx - 142, 446);
    ctx.quadraticCurveTo(cx, 488, cx + 142, 446);
    ctx.quadraticCurveTo(cx + 118, 220, cx + 88, 36);
    ctx.closePath();
    const rg = ctx.createLinearGradient(cx - 130, 50, cx + 130, 460);
    rg.addColorStop(0, '#' + lightCol.getHexString());
    rg.addColorStop(0.68, '#' + baseCol.getHexString());
    rg.addColorStop(1, '#' + darkCol.getHexString());
    ctx.fillStyle = rg;
    ctx.fill();
    ctx.lineWidth = 18;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ink;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 102, 58);
    ctx.quadraticCurveTo(cx, 138, cx + 102, 58);
    ctx.lineWidth = 12;
    ctx.strokeStyle = ink;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.roundRect(cx - 106, 46, 212, 396, 104);
    const tg = ctx.createLinearGradient(cx - 100, 60, cx + 100, 420);
    tg.addColorStop(0, '#' + lightCol.getHexString());
    tg.addColorStop(0.68, '#' + baseCol.getHexString());
    tg.addColorStop(1, '#' + darkCol.getHexString());
    ctx.fillStyle = tg;
    ctx.fill();
    ctx.lineWidth = 18;
    ctx.strokeStyle = ink;
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
      const by = 148 + i * 92;
      ctx.beginPath();
      ctx.arc(cx, by, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#f5efe6';
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.strokeStyle = ink;
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  BODY_TEX_CACHE.set(key, tex);
  return tex;
}

export function createReactionSprite(kind) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 160, 128);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (kind === '?' || kind === '!') {
    ctx.font = '900 96px "Plus Jakarta Sans", sans-serif';
    ctx.lineWidth = 18;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#10141c';
    ctx.strokeText(kind, 80, 68);
    ctx.fillStyle = '#facc15';
    ctx.fillText(kind, 80, 68);
  } else if (kind === 'sweat') {
    ctx.beginPath();
    ctx.moveTo(80, 18);
    ctx.bezierCurveTo(112, 62, 114, 98, 80, 106);
    ctx.bezierCurveTo(46, 98, 48, 62, 80, 18);
    ctx.closePath();
    ctx.fillStyle = '#7dd3fc';
    ctx.fill();
    ctx.lineWidth = 11;
    ctx.strokeStyle = '#10141c';
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(70, 66, 6, 14, -0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#e0f2fe';
    ctx.fill();
  } else {
    // Custom short cartoon comic text (e.g. "HEHE", "HAH?!")
    ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
    ctx.lineWidth = 12;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#10141c';
    ctx.strokeText(String(kind), 80, 64);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(kind), 80, 64);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.38, 0.30, 1);
  sprite.renderOrder = 25;
  return sprite;
}

/**
 * Instantiate a 2.5D Flat Vector Stickman character rig inside a 3D Three.js scene.
 */
export function createStickman25D({
  shirtColor = '#c5b8a5',
  headwear = 'cap',
  headwearColor = '#3f5168',
  robeMode = false,
  scale = 1.0,
} = {}) {
  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  const stickMat = new THREE.MeshLambertMaterial({
    color: 0x121620,
    emissive: 0x121620,
    emissiveIntensity: 0.15,
    side: THREE.DoubleSide,
  });

  // 1. Stick legs
  const legLen = robeMode ? 0.18 : 0.44;
  const legGeo = new THREE.PlaneGeometry(0.036, legLen);
  const footGeo = new THREE.PlaneGeometry(0.095, 0.036);

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.075, legLen, -0.008);
  const lLegBar = new THREE.Mesh(legGeo, stickMat);
  lLegBar.position.y = -legLen * 0.5;
  lLegBar.castShadow = true;
  const lFoot = new THREE.Mesh(footGeo, stickMat);
  lFoot.position.set(-0.025, -legLen + 0.015, 0.002);
  leftLeg.add(lLegBar, lFoot);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.075, legLen, -0.008);
  const rLegBar = new THREE.Mesh(legGeo, stickMat);
  rLegBar.position.y = -legLen * 0.5;
  rLegBar.castShadow = true;
  const rFoot = new THREE.Mesh(footGeo, stickMat);
  rFoot.position.set(0.025, -legLen + 0.015, 0.002);
  rightLeg.add(rLegBar, rFoot);

  bodyPivot.add(leftLeg, rightLeg);

  // 2. Flat vector torso/robe plane
  const bodyTex = getStickmanBodyTexture({ shirtColor, robeMode });
  const bodyMat = new THREE.MeshLambertMaterial({
    map: bodyTex,
    transparent: true,
    alphaTest: 0.45,
    side: THREE.DoubleSide,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: bodyTex,
    emissiveIntensity: 0.18,
  });
  const bodyCard = new THREE.Mesh(
    new THREE.PlaneGeometry(robeMode ? 0.82 : 0.62, robeMode ? 0.82 : 0.58),
    bodyMat
  );
  bodyCard.position.set(0, robeMode ? 0.52 : 0.68, 0.0);
  bodyCard.castShadow = true;
  bodyCard.receiveShadow = true;
  bodyPivot.add(bodyCard);

  // 3. Articulated stick arms (tucked neatly behind torso silhouette)
  const armLen = 0.36;
  const armBarGeo = new THREE.PlaneGeometry(0.032, armLen);
  armBarGeo.translate(0, -armLen * 0.5, 0);
  const handGeo = new THREE.CircleGeometry(0.032, 14);
  const shoulderY = robeMode ? 0.84 : 0.86;
  const shoulderX = robeMode ? 0.14 : 0.145;

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-shoulderX, shoulderY, -0.005);
  const lArmBar = new THREE.Mesh(armBarGeo, stickMat);
  lArmBar.castShadow = true;
  const lHand = new THREE.Mesh(handGeo, stickMat);
  lHand.position.set(0, -armLen, 0.002);
  leftArmPivot.add(lArmBar, lHand);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(shoulderX, shoulderY, -0.005);
  const rArmBar = new THREE.Mesh(armBarGeo, stickMat);
  rArmBar.castShadow = true;
  const rHand = new THREE.Mesh(handGeo, stickMat);
  rHand.position.set(0, -armLen, 0.002);
  rightArmPivot.add(rArmBar, rHand);

  bodyPivot.add(leftArmPivot, rightArmPivot);

  // 4. Flat vector head + headwear + expression plane
  const headGroup = new THREE.Group();
  headGroup.position.set(0, robeMode ? 1.08 : 1.12, 0.018);
  bodyPivot.add(headGroup);

  const initHeadTex = getStickmanHeadTexture({ headwear, headwearColor, expr: 'neutral' });
  const headMat = new THREE.MeshLambertMaterial({
    map: initHeadTex,
    transparent: true,
    alphaTest: 0.45,
    side: THREE.DoubleSide,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: initHeadTex,
    emissiveIntensity: 0.20,
  });
  const headSize = headwear === 'hijab' ? 0.72 : 0.68;
  const headCard = new THREE.Mesh(new THREE.PlaneGeometry(headSize, headSize), headMat);
  headCard.castShadow = true;
  headCard.receiveShadow = true;
  headGroup.add(headCard);

  // 5. Floating reaction icons (?, !, sweat)
  const iconQ = createReactionSprite('?');
  iconQ.position.set(0.28, 0.34, 0.04);
  iconQ.visible = false;
  headGroup.add(iconQ);

  const iconBang = createReactionSprite('!');
  iconBang.position.set(0.26, 0.36, 0.04);
  iconBang.visible = false;
  headGroup.add(iconBang);

  const iconSweat = createReactionSprite('sweat');
  iconSweat.position.set(-0.24, 0.24, 0.05);
  iconSweat.scale.set(0.22, 0.18, 1);
  iconSweat.visible = false;
  headGroup.add(iconSweat);

  let currentExpr = 'neutral';

  return {
    root,
    bodyPivot,
    headGroup,
    headMat,
    bodyMat,
    setExpression(expr) {
      if (expr !== currentExpr) {
        const tex = getStickmanHeadTexture({ headwear, headwearColor, expr });
        headMat.map = tex;
        headMat.emissiveMap = tex;
        headMat.needsUpdate = true;
        currentExpr = expr;
      }
    },
    setNightBlend(night) {
      const em = lerp(0.22, 0.14, night);
      headMat.emissiveIntensity = em;
      bodyMat.emissiveIntensity = em * 0.92;
    },
    setIcons({ q = false, bang = false, sweat = false } = {}) {
      iconQ.visible = Boolean(q);
      iconBang.visible = Boolean(bang);
      iconSweat.visible = Boolean(sweat);
    },
    faceCameraY(cameraPos, extraYaw = 0) {
      const dx = cameraPos.x - root.position.x;
      const dz = cameraPos.z - root.position.z;
      const camYaw = Math.atan2(dx, dz);
      root.rotation.y = camYaw + clamp(extraYaw, -0.35, 0.35);
    },
    setPose({
      x = 0,
      y = 0,
      z = 0,
      ry = 0,
      bob = 0,
      leftArmZ = 0.24,
      leftArmX = 0,
      rightArmZ = -0.24,
      rightArmX = 0,
      headTiltZ = 0,
      sit = false,
      visible = true,
    } = {}) {
      root.visible = visible;
      root.position.set(x, y, z);
      root.userData.extraYaw = ry;
      bodyPivot.position.y = sit ? -0.14 : bob;
      leftLeg.visible = !sit;
      rightLeg.visible = !sit;
      // Positive leftArmZ / negative rightArmZ swing OUTWARD naturally from body
      leftArmPivot.rotation.set(leftArmX, 0, -leftArmZ);
      rightArmPivot.rotation.set(rightArmX, 0, -rightArmZ);
      headGroup.rotation.set(0, 0, headTiltZ);
    },
  };
}
