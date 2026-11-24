/**
 * Reusable 3D World Building Blocks for Stickman 2.5D-in-3D Stages:
 *  - Procedural textures (terracotta roof tiles, weathered stucco)
 *  - Inverted-hull outlined 3D prop helper (`makeOutlined3DProp`)
 *  - Instanced 3D grass blades & yellow wildflowers
 *  - Distant foggy hills & sculpted village trees
 *  - Day-to-night lighting rig with PCFSoftShadowMap
 */

import * as THREE from 'three';
import { hash1, lerp } from '../utils/math.js';

const OUTLINE_MAT_CACHE = new Map();

export function getOutlineMaterial(color = 0x10141c) {
  if (!OUTLINE_MAT_CACHE.has(color)) {
    OUTLINE_MAT_CACHE.set(color, new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }));
  }
  return OUTLINE_MAT_CACHE.get(color);
}

export function makeOutlined3DProp(
  geometry,
  material,
  outlineScale = 1.06,
  { castShadow = true, receiveShadow = true, outlineColor = 0x10141c } = {}
) {
  const group = new THREE.Group();
  const main = new THREE.Mesh(geometry, material);
  main.castShadow = castShadow;
  main.receiveShadow = receiveShadow;
  group.add(main);
  if (outlineScale > 1.0) {
    const outline = new THREE.Mesh(geometry, getOutlineMaterial(outlineColor));
    if (Array.isArray(outlineScale)) outline.scale.set(outlineScale[0], outlineScale[1], outlineScale[2]);
    else outline.scale.setScalar(outlineScale);
    group.add(outline);
  }
  return { group, main };
}

export function createRoofTileTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8b4726';
  ctx.fillRect(0, 0, 512, 512);
  const rows = 16;
  const cols = 10;
  const rh = 512 / rows;
  const cw = 512 / cols;
  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (cw * 0.5);
    for (let col = -1; col <= cols; col++) {
      const shade = (hash1(r * 31 + col * 17) - 0.5) * 18;
      ctx.fillStyle = `rgb(${144 + shade}, ${74 + shade * 0.6}, ${42 + shade * 0.4})`;
      ctx.fillRect(col * cw + offset + 2, r * rh + 2, cw - 4, rh - 4);
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(col * cw + offset, (r + 1) * rh - 3, cw, 3);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStuccoTexture(baseHex = '#a49b8a') {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(60,50,35,0.06)' : 'rgba(255,250,240,0.05)';
    ctx.beginPath();
    ctx.arc(hash1(i * 3.1) * 256, hash1(i * 7.3) * 256, 12 + hash1(i * 11.7) * 28, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDayNightLightRig(scene, root, renderer) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const skyDay = new THREE.Color(0x8bc2ed);
  const skyNight = new THREE.Color(0x091326);
  const fogDay = new THREE.Color(0xc5dff2);
  const fogNight = new THREE.Color(0x0b162d);
  scene.fog = new THREE.Fog(0xc5dff2, 12, 34);

  const hemiLight = new THREE.HemisphereLight(0xeef6ff, 0x4b6e35, 1.15);
  root.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff6e5, 2.45);
  sunLight.position.set(-5.8, 7.6, 5.2);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 26;
  sunLight.shadow.camera.left = -7.5;
  sunLight.shadow.camera.right = 7.5;
  sunLight.shadow.camera.top = 7.5;
  sunLight.shadow.camera.bottom = -5.5;
  sunLight.shadow.bias = -0.0008;
  root.add(sunLight);

  const moonLight = new THREE.DirectionalLight(0x6b93d6, 0.0);
  moonLight.position.set(4.2, 6.8, 6.0);
  root.add(moonLight);

  return {
    hemiLight,
    sunLight,
    moonLight,
    applyNight(night = 0) {
      scene.background = skyDay.clone().lerp(skyNight, night);
      scene.fog.color.copy(fogDay).lerp(fogNight, night);
      sunLight.intensity = lerp(2.55, 0.10, night);
      hemiLight.intensity = lerp(1.30, 0.34, night);
      moonLight.intensity = lerp(0.0, 0.68, night);
    },
  };
}

export function addOutdoorVillageGround(root, { excludeFootprint = null } = {}) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 42),
    new THREE.MeshLambertMaterial({ color: 0x62963b })
  );
  ground.rotation.x = -Math.PI * 0.5;
  ground.receiveShadow = true;
  root.add(ground);

  const moss = new THREE.Mesh(
    new THREE.CircleGeometry(0.68, 20),
    new THREE.MeshLambertMaterial({ color: 0x45662a })
  );
  moss.rotation.x = -Math.PI * 0.5;
  moss.position.set(0.85, 0.006, 2.25);
  moss.receiveShadow = true;
  root.add(moss);

  const lane = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.05, 1.45),
    new THREE.MeshLambertMaterial({ color: 0x9aa2ab })
  );
  lane.position.set(0, 0.025, 4.95);
  lane.receiveShadow = true;
  root.add(lane);

  // 1,350 instanced 3D grass blades
  const bladeGeo = new THREE.ConeGeometry(0.032, 0.34, 4);
  bladeGeo.translate(0, 0.17, 0);
  const bladeMat = new THREE.MeshLambertMaterial({ color: 0x72b340 });
  const grassCount = 1350;
  const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, grassCount);
  grassMesh.receiveShadow = true;
  const dummy = new THREE.Object3D();
  const colorTmp = new THREE.Color();
  let idx = 0;
  for (let i = 0; i < 1800 && idx < grassCount; i++) {
    const gx = (hash1(i * 1.13 + 5) - 0.5) * 14.0;
    const gz = (hash1(i * 2.71 + 9) - 0.25) * 10.5;
    if (excludeFootprint && excludeFootprint(gx, gz)) continue;
    if (gz > 4.2 && gz < 5.75) continue;
    dummy.position.set(gx, 0.0, gz);
    dummy.rotation.set(
      (hash1(i * 4.3) - 0.5) * 0.42,
      hash1(i * 5.7) * Math.PI * 2,
      (hash1(i * 6.9) - 0.5) * 0.42
    );
    const s = 0.72 + hash1(i * 8.1) * 0.75;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    grassMesh.setMatrixAt(idx, dummy.matrix);
    colorTmp.setHSL(0.26 + (hash1(i * 3.7) - 0.5) * 0.04, 0.50, 0.38 + hash1(i * 9.1) * 0.12);
    grassMesh.setColorAt(idx, colorTmp);
    idx++;
  }
  grassMesh.count = idx;
  grassMesh.instanceMatrix.needsUpdate = true;
  if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true;
  root.add(grassMesh);

  // 130 3D wildflowers
  const flowerGeo = new THREE.DodecahedronGeometry(0.032, 0);
  const flowerMat = new THREE.MeshLambertMaterial({ color: 0xf4cf4e });
  const flowerMesh = new THREE.InstancedMesh(flowerGeo, flowerMat, 130);
  for (let i = 0; i < 130; i++) {
    const fx = (hash1(i * 17.3 + 2) - 0.5) * 9.5;
    const fz = 0.35 + hash1(i * 23.1 + 4) * 3.7;
    dummy.position.set(fx, 0.08 + hash1(i * 11.7) * 0.06, fz);
    dummy.rotation.set(0, hash1(i * 3.3) * 6, 0);
    dummy.scale.setScalar(0.8 + hash1(i * 5.1) * 0.55);
    dummy.updateMatrix();
    flowerMesh.setMatrixAt(i, dummy.matrix);
  }
  flowerMesh.instanceMatrix.needsUpdate = true;
  root.add(flowerMesh);

  // Distant hills
  const hillMat = new THREE.MeshLambertMaterial({ color: 0x5c7c48 });
  for (const h of [
    { x: -9.5, z: -15.5, sx: 11, sy: 4.5, sz: 6 },
    { x: 3.5, z: -17.0, sx: 14, sy: 5.4, sz: 7 },
    { x: 14.0, z: -14.0, sx: 10, sy: 4.0, sz: 6 },
  ]) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), hillMat);
    mesh.position.set(h.x, -0.6, h.z);
    mesh.scale.set(h.sx, h.sy, h.sz);
    root.add(mesh);
  }

  // Sculpted background trees
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x563c27 });
  const leafMatA = new THREE.MeshLambertMaterial({ color: 0x3b6e28 });
  const leafMatB = new THREE.MeshLambertMaterial({ color: 0x4b8532 });
  for (const tp of [
    { x: -4.8, z: -4.2, s: 1.25 },
    { x: 3.8, z: -4.6, s: 1.35 },
    { x: 5.6, z: 2.6, s: 1.05 },
    { x: -6.2, z: 1.2, s: 1.1 },
  ]) {
    const tg = new THREE.Group();
    tg.position.set(tp.x, 0, tp.z);
    tg.scale.setScalar(tp.s);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 3.2, 10), trunkMat);
    trunk.position.y = 1.6;
    trunk.castShadow = true;
    tg.add(trunk);
    for (const [bx, by, bz, br, bm] of [
      [0, 3.6, 0, 1.35, leafMatA],
      [-0.85, 3.15, 0.45, 0.95, leafMatB],
      [0.85, 3.25, -0.3, 1.0, leafMatB],
      [0.15, 4.35, 0.25, 0.9, leafMatA],
    ]) {
      const b = new THREE.Mesh(new THREE.DodecahedronGeometry(br, 1), bm);
      b.position.set(bx, by, bz);
      b.castShadow = true;
      tg.add(b);
    }
    root.add(tg);
  }
}
