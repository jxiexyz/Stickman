/**
 * Flagship Reference 3D Stage: "Village Nobar" (`village-nobar`)
 * Demonstrates a single-hero 3D Indonesian village house, dynamic 4m x 3m canvas wall,
 * notched 3D banana fronds (spread -> tied upright), nobar chairs/table/projector cone,
 * and 2.5D Flat Vector Stickman characters.
 */

import * as THREE from 'three';
import { clamp, easeInOutCubic, easeOutCubic, hash1, lerp } from '../utils/math.js';
import { createStickman25D } from '../characters/stickman-25d.js';
import { evaluateDioramaCamera } from '../camera/camera-director.js';
import {
  addOutdoorVillageGround,
  createDayNightLightRig,
  createRoofTileTexture,
  createStuccoTexture,
  makeOutlined3DProp,
} from './base-stage.js';

function drawHeroWall(ctx, W, H, state) {
  const {
    whiteCover = 0.0,
    greenCover = 0.0,
    white2Cover = 0.0,
    projection = 0.0,
    projBright = 1.0,
    ballPhase = 0.0,
    dimOverlay = 0.0,
    coatBadge = 0.0,
  } = state;

  const baseGrad = ctx.createLinearGradient(0, 0, W, H);
  baseGrad.addColorStop(0, '#cfc2ad');
  baseGrad.addColorStop(0.55, '#c2b39b');
  baseGrad.addColorStop(1, '#b5a48a');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(92, 76, 56, 0.12)';
  ctx.beginPath(); ctx.ellipse(W * 0.62, H * 0.35, 190, 120, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(W * 0.82, H * 0.65, 150, 110, -0.3, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = 'rgba(84, 70, 52, 0.35)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 5; i++) {
    const frac = [0.46, 0.55, 0.61, 0.72, 0.84][i];
    ctx.beginPath();
    let cx = W * frac;
    ctx.moveTo(cx, H * (0.08 + i * 0.04));
    for (let s = 1; s <= 6; s++) {
      cx += Math.sin(s * 2.1 + i * 3.7) * 10;
      ctx.lineTo(cx, H * (0.08 + i * 0.04 + s * 0.11));
    }
    ctx.stroke();
  }

  // Kids' colorful chalk drawings
  ctx.save();
  ctx.globalAlpha = 0.64;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#f8f5ee';
  ctx.lineWidth = 6;
  ctx.strokeRect(W * 0.66, H * 0.57, 74, 70);
  ctx.beginPath();
  ctx.moveTo(W * 0.645, H * 0.57);
  ctx.lineTo(W * 0.66 + 37, H * 0.48);
  ctx.lineTo(W * 0.66 + 88, H * 0.57);
  ctx.stroke();
  ctx.strokeStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(W * 0.84, H * 0.45, 34, 0, Math.PI * 2);
  ctx.stroke();
  for (let r = 0; r < 8; r++) {
    const a = (r / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(W * 0.84 + Math.cos(a) * 44, H * 0.45 + Math.sin(a) * 44);
    ctx.lineTo(W * 0.84 + Math.cos(a) * 62, H * 0.45 + Math.sin(a) * 62);
    ctx.stroke();
  }
  ctx.strokeStyle = '#f48fb1';
  ctx.beginPath(); ctx.arc(W * 0.84, H * 0.62, 18, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.84, H * 0.645); ctx.lineTo(W * 0.84, H * 0.75);
  ctx.moveTo(W * 0.80, H * 0.69); ctx.lineTo(W * 0.88, H * 0.69);
  ctx.moveTo(W * 0.84, H * 0.75); ctx.lineTo(W * 0.81, H * 0.83);
  ctx.moveTo(W * 0.84, H * 0.75); ctx.lineTo(W * 0.87, H * 0.83);
  ctx.stroke();
  ctx.restore();

  if (whiteCover > 0.001) {
    const pw = W * clamp(whiteCover, 0, 1);
    const wGrad = ctx.createLinearGradient(0, 0, 0, H);
    wGrad.addColorStop(0, '#fcfaf3');
    wGrad.addColorStop(1, '#f4efe2');
    ctx.fillStyle = wGrad;
    ctx.fillRect(0, 0, pw, H);
    if (whiteCover < 0.99) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(pw, 0, 5, H);
    }
  }

  if (greenCover > 0.001) {
    const gw = W * clamp(greenCover, 0, 1);
    ctx.fillStyle = '#6f8b5e';
    ctx.fillRect(0, 0, gw, H);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let x = 24; x < gw - 20; x += 64) ctx.fillRect(x, 0, 18, H);
  }

  if (white2Cover > 0.001) {
    const w2 = W * clamp(white2Cover, 0, 1);
    ctx.fillStyle = '#fefdf9';
    ctx.fillRect(0, 0, w2, H);
    if (coatBadge > 0.01) {
      ctx.save();
      ctx.globalAlpha = clamp(coatBadge, 0, 1);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(W * 0.72, H * 0.56);
      ctx.quadraticCurveTo(W * 0.78, H * 0.42, W * 0.73, H * 0.28);
      ctx.stroke();
      ctx.font = '900 110px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#10141c';
      ctx.strokeText('2', W * 0.73, H * 0.20);
      ctx.fillStyle = '#facc15';
      ctx.fillText('2', W * 0.73, H * 0.20);
      ctx.restore();
    }
  }

  if (projection > 0.001) {
    ctx.save();
    ctx.globalAlpha = clamp(projection, 0, 1);
    const skyH = H * 0.36;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, skyH);
    skyGrad.addColorStop(0, '#10213d');
    skyGrad.addColorStop(1, '#1f365c');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, skyH);

    ctx.fillStyle = 'rgba(241, 245, 249, 0.82)';
    for (let i = 0; i < 28; i++) {
      ctx.beginPath();
      ctx.arc(hash1(i * 13.7) * W, hash1(i * 29.3) * (skyH * 0.62) + 18, 5 + hash1(i * 7.1) * 11, 0, Math.PI * 2);
      ctx.fill();
    }

    const standY = skyH * 0.74;
    ctx.fillStyle = '#182742';
    ctx.fillRect(0, standY, W, skyH - standY);
    const crowdColors = ['#f87171', '#facc15', '#38bdf8', '#4ade80', '#e879f9', '#f8fafc'];
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = crowdColors[i % crowdColors.length];
      ctx.fillRect((i / 160) * W + (hash1(i * 3.1) - 0.5) * 14, standY + 8 + hash1(i * 9.7) * (skyH - standY - 14), 8, 8);
    }

    const pitchGrad = ctx.createLinearGradient(0, skyH, 0, H);
    pitchGrad.addColorStop(0, '#2e7d47');
    pitchGrad.addColorStop(1, '#236638');
    ctx.fillStyle = pitchGrad;
    ctx.fillRect(0, skyH, W, H - skyH);

    ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, skyH + 34); ctx.lineTo(W, skyH + 34);
    ctx.moveTo(W * 0.56, skyH + 34); ctx.lineTo(W * 0.56, H);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(W * 0.56, H * 0.76, 130, 82, 0, 0, Math.PI * 2);
    ctx.stroke();

    const gx = W * 0.04;
    const gy = skyH + 74;
    const gw = W * 0.22;
    const gh = H * 0.42;
    ctx.strokeStyle = 'rgba(255,255,255,0.42)';
    ctx.lineWidth = 2.5;
    for (let x = gx; x <= gx + gw; x += 22) { ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + gh); ctx.stroke(); }
    for (let y = gy; y <= gy + gh; y += 22) { ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx + gw, y); ctx.stroke(); }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 9;
    ctx.strokeRect(gx, gy, gw, gh);

    const gkX = gx + gw * 0.52;
    const gkY = gy + gh * 0.34;
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(gkX, gkY - 20, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f2c9a0'; ctx.beginPath(); ctx.arc(gkX, gkY - 12, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ea8a2e'; ctx.fillRect(gkX - 24, gkY + 10, 48, 84);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(gkX - 20, gkY + 94, 40, 34);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(gkX - 11, gkY + 128); ctx.lineTo(gkX - 11, gkY + 174);
    ctx.moveTo(gkX + 11, gkY + 128); ctx.lineTo(gkX + 11, gkY + 174);
    ctx.stroke();

    const px = W * 0.58;
    const py = H * 0.56;
    const kickSwing = Math.sin(ballPhase * Math.PI * 4) * 0.16;
    ctx.fillStyle = '#f2c9a0'; ctx.beginPath(); ctx.arc(px, py - 95, 36, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(px, py - 104, 35, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c8343b'; ctx.fillRect(px - 44, py - 56, 88, 126);
    ctx.save(); ctx.translate(px - 44, py - 42); ctx.rotate(0.45); ctx.fillRect(-74, 0, 74, 28); ctx.restore();
    ctx.save(); ctx.translate(px + 44, py - 42); ctx.rotate(-0.45); ctx.fillRect(0, 0, 74, 28); ctx.restore();
    ctx.fillStyle = '#ffffff'; ctx.font = '900 72px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9', px, py + 8);
    ctx.fillStyle = '#1d3c78'; ctx.fillRect(px - 44, py + 70, 88, 56);
    ctx.strokeStyle = '#f2c9a0'; ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.moveTo(px - 22, py + 126); ctx.lineTo(px - 22, py + 210);
    ctx.moveTo(px + 22, py + 126); ctx.lineTo(px + 54 + kickSwing * 80, py + 196);
    ctx.stroke();

    const bx = lerp(px + 86, gkX + 22, clamp(ballPhase, 0, 1));
    const by = lerp(py + 198, gkY + 58, clamp(ballPhase, 0, 1)) - Math.sin(clamp(ballPhase, 0, 1) * Math.PI) * 95;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#111827'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(bx, by, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill();

    if (projBright < 0.99) {
      ctx.fillStyle = `rgba(10, 14, 24, ${clamp(1 - projBright, 0, 0.72)})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  if (dimOverlay > 0.01) {
    ctx.save();
    ctx.globalAlpha = clamp(dimOverlay, 0, 1);
    const yellow = '#fbbf24';
    ctx.strokeStyle = yellow; ctx.lineWidth = 7; ctx.lineCap = 'round';
    const topY = 74;
    ctx.beginPath();
    ctx.moveTo(28, topY); ctx.lineTo(W * 0.39, topY);
    ctx.moveTo(W * 0.61, topY); ctx.lineTo(W - 42, topY);
    ctx.moveTo(56, topY - 16); ctx.lineTo(28, topY); ctx.lineTo(56, topY + 16);
    ctx.moveTo(W - 70, topY - 16); ctx.lineTo(W - 42, topY); ctx.lineTo(W - 70, topY + 16);
    ctx.stroke();
    const rightX = W - 42;
    ctx.beginPath();
    ctx.moveTo(rightX, 42); ctx.lineTo(rightX, H * 0.42);
    ctx.moveTo(rightX, H * 0.58); ctx.lineTo(rightX, H - 36);
    ctx.moveTo(rightX - 14, 68); ctx.lineTo(rightX, 42); ctx.lineTo(rightX + 14, 68);
    ctx.moveTo(rightX - 14, H - 62); ctx.lineTo(rightX, H - 36); ctx.lineTo(rightX + 14, H - 62);
    ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '900 72px "Plus Jakarta Sans", sans-serif';
    ctx.lineWidth = 14; ctx.strokeStyle = '#0f172a';
    ctx.strokeText('4 m', W * 0.5, topY); ctx.fillStyle = yellow; ctx.fillText('4 m', W * 0.5, topY);
    ctx.font = '900 58px "Plus Jakarta Sans", sans-serif';
    ctx.strokeText('3 m', rightX - 24, H * 0.5); ctx.fillText('3 m', rightX - 24, H * 0.5);
    ctx.restore();
  }
}

export class VillageNobarStage {
  constructor(scene, renderer, camera) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.root = new THREE.Group();
    this.root.name = 'VillageNobarStage';
    this.scene.add(this.root);

    this.lights = createDayNightLightRig(scene, this.root, renderer);
    this.porchLamp = new THREE.PointLight(0xffb454, 0.0, 9.5, 1.5);
    this.porchLamp.position.set(-2.65, 2.05, 0.35);
    this.root.add(this.porchLamp);

    this.projBounceLight = new THREE.PointLight(0x7fd4ff, 0.0, 10.5, 1.5);
    this.projBounceLight.position.set(0.0, 1.65, 1.45);
    this.root.add(this.projBounceLight);

    addOutdoorVillageGround(this.root, {
      excludeFootprint: (gx, gz) => gx > -4.3 && gx < 2.2 && gz > -3.7 && gz < 0.15,
    });
    this._buildHouseAndWall();
    this._buildBananaTree();
    this._buildProps();
    this._buildCharacters();
    this._lastWallSig = '';
  }

  _buildHouseAndWall() {
    this.houseGroup = new THREE.Group();
    this.root.add(this.houseGroup);

    const concreteMat = new THREE.MeshLambertMaterial({ color: 0x7b7870 });
    const sideStuccoMat = new THREE.MeshLambertMaterial({ map: createStuccoTexture('#a49b8a') });
    const roofTileMat = new THREE.MeshLambertMaterial({ map: createRoofTileTexture() });
    const eavesMat = new THREE.MeshLambertMaterial({ color: 0x3b2416 });
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x5c361e });

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.22, 3.8), concreteMat);
    plinth.position.set(-1.0, 0.11, -1.7);
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    this.houseGroup.add(plinth);

    const body = new THREE.Mesh(new THREE.BoxGeometry(5.9, 3.0, 3.4), sideStuccoMat);
    body.position.set(-0.98, 1.72, -1.72);
    body.castShadow = true;
    body.receiveShadow = true;
    this.houseGroup.add(body);

    this.wallCanvas = document.createElement('canvas');
    this.wallCanvas.width = 1024;
    this.wallCanvas.height = 768;
    this.wallCtx = this.wallCanvas.getContext('2d');
    this.wallTex = new THREE.CanvasTexture(this.wallCanvas);
    this.wallTex.colorSpace = THREE.SRGBColorSpace;
    this.wallMat = new THREE.MeshLambertMaterial({
      map: this.wallTex,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: this.wallTex,
      emissiveIntensity: 0.0,
    });
    this.heroWall = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 3.0), this.wallMat);
    this.heroWall.position.set(0.0, 1.72, 0.01);
    this.heroWall.receiveShadow = true;
    this.houseGroup.add(this.heroWall);

    const gableShape = new THREE.Shape();
    gableShape.moveTo(-2.15, 0);
    gableShape.lineTo(2.15, 0);
    gableShape.lineTo(0, 1.38);
    gableShape.closePath();
    const gableMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(gableShape, { depth: 3.9, bevelEnabled: false }), eavesMat);
    gableMesh.position.set(0.0, 3.22, -3.7);
    gableMesh.castShadow = true;
    this.houseGroup.add(gableMesh);

    const slopeGeo = new THREE.BoxGeometry(2.75, 0.14, 4.45);
    const leftSlope = new THREE.Mesh(slopeGeo, roofTileMat);
    leftSlope.position.set(-1.12, 3.92, -1.65);
    leftSlope.rotation.z = 0.56;
    leftSlope.castShadow = true;
    leftSlope.receiveShadow = true;

    const rightSlope = new THREE.Mesh(slopeGeo, roofTileMat);
    rightSlope.position.set(1.12, 3.92, -1.65);
    rightSlope.rotation.z = -0.56;
    rightSlope.castShadow = true;
    rightSlope.receiveShadow = true;
    this.houseGroup.add(leftSlope, rightSlope);

    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.12, 4.2), roofTileMat);
    porchRoof.position.set(-3.05, 3.28, -1.6);
    porchRoof.rotation.z = 0.24;
    porchRoof.castShadow = true;
    this.houseGroup.add(porchRoof);

    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.95, 0.16), woodMat);
    doorFrame.position.set(-2.95, 1.2, 0.02);
    this.houseGroup.add(doorFrame);

    this.doorInterior = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 1.78), new THREE.MeshBasicMaterial({ color: 0xf9b85b }));
    this.doorInterior.position.set(-2.95, 1.2, 0.11);
    this.doorInterior.visible = false;
    this.houseGroup.add(this.doorInterior);

    this.doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.76, 1.78, 0.08), woodMat);
    this.doorLeaf.position.set(-2.95, 1.2, 0.11);
    this.houseGroup.add(this.doorLeaf);

    const porchTable = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.48), woodMat);
    porchTable.position.set(-2.95, 0.78, 0.78);
    porchTable.castShadow = true;
    this.houseGroup.add(porchTable);
  }

  _buildBananaTree() {
    this.bananaGroup = new THREE.Group();
    this.bananaGroup.position.set(-1.62, 0.0, 0.72);
    this.root.add(this.bananaGroup);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 1.65, 12), new THREE.MeshLambertMaterial({ color: 0x5c7538 }));
    trunk.position.y = 0.825;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    this.bananaGroup.add(trunk);

    const frondShape = new THREE.Shape();
    frondShape.moveTo(0, 0);
    frondShape.lineTo(0.14, 0.28);
    frondShape.lineTo(0.16, 0.58);
    frondShape.lineTo(0.08, 0.63);
    frondShape.lineTo(0.15, 0.72);
    frondShape.lineTo(0.12, 1.15);
    frondShape.lineTo(0.0, 1.54);
    frondShape.lineTo(-0.12, 1.15);
    frondShape.lineTo(-0.15, 0.88);
    frondShape.lineTo(-0.07, 0.82);
    frondShape.lineTo(-0.16, 0.72);
    frondShape.lineTo(-0.14, 0.28);
    frondShape.closePath();
    const frondGeo = new THREE.ExtrudeGeometry(frondShape, { depth: 0.016, bevelEnabled: false });
    const stemGeo = new THREE.CylinderGeometry(0.016, 0.026, 1.35, 6);
    stemGeo.translate(0, 0.675, 0.008);
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x2d5e22, side: THREE.DoubleSide });
    const ribMat = new THREE.MeshLambertMaterial({ color: 0x4e7c34 });

    this.bananaLeaves = [];
    for (let i = 0; i < 7; i++) {
      const pivot = new THREE.Group();
      pivot.position.set(0, 1.56, 0);
      pivot.rotation.y = (i / 7) * Math.PI * 2 + 0.35;
      const blade = new THREE.Mesh(frondGeo, leafMat);
      blade.castShadow = true;
      blade.receiveShadow = true;
      pivot.add(blade, new THREE.Mesh(stemGeo, ribMat));
      this.bananaGroup.add(pivot);
      this.bananaLeaves.push({ pivot, basePitch: 0.66 + (i % 3) * 0.18 });
    }

    this.bananaTieRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.045, 10, 22),
      new THREE.MeshLambertMaterial({ color: 0xd9c79e })
    );
    this.bananaTieRing.rotation.x = Math.PI * 0.5;
    this.bananaTieRing.position.set(0, 2.08, 0);
    this.bananaTieRing.visible = false;
    this.bananaGroup.add(this.bananaTieRing);
  }

  _buildProps() {
    const canMat = new THREE.MeshLambertMaterial({ color: 0xdce1e8 });
    const paintTopMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const wireMat = new THREE.MeshLambertMaterial({ color: 0x334155 });

    const makePaintCan = () => {
      const g = new THREE.Group();
      const { group: cyl } = makeOutlined3DProp(new THREE.CylinderGeometry(0.145, 0.14, 0.30, 16), canMat, 1.05);
      cyl.position.y = 0.15;
      g.add(cyl);
      const top = new THREE.Mesh(new THREE.CircleGeometry(0.135, 16), paintTopMat);
      top.rotation.x = -Math.PI * 0.5;
      top.position.y = 0.302;
      g.add(top);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.01, 6, 18, Math.PI), wireMat);
      handle.position.y = 0.27;
      g.add(handle);
      return g;
    };

    this.paintCan1 = makePaintCan();
    this.paintCan1.position.set(-0.62, 0.0, 0.58);
    this.root.add(this.paintCan1);

    this.paintCan2 = makePaintCan();
    this.paintCan2.position.set(-0.22, 0.0, 0.68);
    this.paintCan2.visible = false;
    this.root.add(this.paintCan2);

    this.rollerGroup = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.45, 8), new THREE.MeshLambertMaterial({ color: 0xc9a36a }));
    pole.position.y = 0.725;
    pole.castShadow = true;
    this.rollerHeadMat = new THREE.MeshLambertMaterial({ color: 0xfdfcf8 });
    const rollerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.28, 14), this.rollerHeadMat);
    rollerHead.rotation.z = Math.PI * 0.5;
    rollerHead.position.set(0, 1.46, 0.04);
    rollerHead.castShadow = true;
    this.rollerGroup.add(pole, rollerHead);
    this.root.add(this.rollerGroup);

    this.tapeGroup = new THREE.Group();
    const { group: tapeBox } = makeOutlined3DProp(new THREE.BoxGeometry(0.12, 0.12, 0.06), new THREE.MeshLambertMaterial({ color: 0xd99b26 }), 1.10);
    this.tapeStrip = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.032, 0.008), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    this.tapeStrip.position.set(-0.5, 0, 0);
    this.tapeGroup.add(tapeBox, this.tapeStrip);
    this.tapeGroup.visible = false;
    this.root.add(this.tapeGroup);

    this.geckoGroup = new THREE.Group();
    const geckoMat = new THREE.MeshLambertMaterial({ color: 0xd7c19e });
    const { group: gBody } = makeOutlined3DProp(new THREE.CapsuleGeometry(0.045, 0.16, 6, 10), geckoMat, 1.12, { castShadow: false });
    const gTail = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.18, 8), geckoMat);
    gTail.rotation.z = Math.PI;
    gTail.position.y = -0.17;
    this.geckoGroup.add(gBody, gTail);
    const gLegGeo = new THREE.CylinderGeometry(0.012, 0.01, 0.11, 6);
    for (const [lx, ly, rz] of [[-0.06, 0.05, 0.8], [0.06, 0.05, -0.8], [-0.06, -0.05, 2.2], [0.06, -0.05, -2.2]]) {
      const leg = new THREE.Mesh(gLegGeo, geckoMat);
      leg.position.set(lx, ly, 0);
      leg.rotation.z = rz;
      this.geckoGroup.add(leg);
    }
    this.geckoGroup.position.set(-0.15, 1.5, 0.05);
    this.geckoGroup.visible = false;
    this.root.add(this.geckoGroup);

    this.projectorGroup = new THREE.Group();
    this.projectorGroup.position.set(0.0, 0.0, 2.48);
    this.projectorGroup.add(makePaintCan());
    const projCanSide = makePaintCan();
    projCanSide.position.set(0.36, 0.0, 0.16);
    this.projectorGroup.add(projCanSide);

    const { group: projBox } = makeOutlined3DProp(new THREE.BoxGeometry(0.36, 0.18, 0.28), new THREE.MeshLambertMaterial({ color: 0x161c2c }), 1.05);
    projBox.position.set(0, 0.39, 0);
    this.projectorGroup.add(projBox);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 14), new THREE.MeshBasicMaterial({ color: 0xcbeeff }));
    lens.rotation.x = Math.PI * 0.5;
    lens.position.set(0, 0.40, -0.15);
    this.projectorGroup.add(lens);

    const coneGeo = new THREE.CylinderGeometry(0.06, 1.95, 2.55, 24, 1, true);
    coneGeo.translate(0, -1.275, 0);
    this.projectorCone = new THREE.Mesh(
      coneGeo,
      new THREE.MeshBasicMaterial({
        color: 0xd9eeff,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    this.projectorCone.position.set(0, 0.40, -0.14);
    this.projectorCone.rotation.x = -Math.PI * 0.5 + 0.46;
    this.projectorGroup.add(this.projectorCone);
    this.projectorGroup.visible = false;
    this.root.add(this.projectorGroup);

    this.nobarPropsGroup = new THREE.Group();
    this.nobarPropsGroup.visible = false;
    this.root.add(this.nobarPropsGroup);

    const chairColors = [0x6e2d2d, 0x2a4570, 0x2f5e39, 0x6e512d];
    const makeChair = (col) => {
      const g = new THREE.Group();
      const mat = new THREE.MeshLambertMaterial({ color: col });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.42), mat);
      seat.position.y = 0.40; seat.castShadow = true;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.05), mat);
      back.position.set(0, 0.64, 0.19); back.castShadow = true;
      g.add(seat, back);
      for (const [lx, lz] of [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.40, 0.045), mat);
        leg.position.set(lx, 0.20, lz);
        g.add(leg);
      }
      return g;
    };

    this.chairCoords = [
      [-1.05, 3.15], [-0.40, 3.15], [0.25, 3.15], [0.90, 3.15],
      [-1.05, 3.95], [-0.40, 3.95], [0.25, 3.95], [0.90, 3.95],
    ];
    this.chairCoords.forEach(([cx, cz], i) => {
      const ch = makeChair(chairColors[i % chairColors.length]);
      ch.position.set(cx, 0, cz);
      this.nobarPropsGroup.add(ch);
    });

    const tableGroup = new THREE.Group();
    tableGroup.position.set(1.72, 0.0, 3.25);
    const tblMat = new THREE.MeshLambertMaterial({ color: 0x4f2c1a });
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.06, 0.66), tblMat);
    top.position.y = 0.68; top.castShadow = true; top.receiveShadow = true;
    tableGroup.add(top);
    for (const [lx, lz] of [[-0.4, -0.27], [0.4, -0.27], [-0.4, 0.27], [0.4, 0.27]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.68, 0.055), tblMat);
      leg.position.set(lx, 0.34, lz);
      tableGroup.add(leg);
    }
    const cupMat = new THREE.MeshLambertMaterial({ color: 0x1e2430 });
    for (const [ux, uz] of [[-0.28, -0.14], [-0.08, -0.18], [0.14, -0.15], [-0.18, 0.04], [0.22, 0.05]]) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.11, 12), cupMat);
      cup.position.set(ux, 0.765, uz);
      tableGroup.add(cup);
    }
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.025, 20), new THREE.MeshLambertMaterial({ color: 0xe6e8ed }));
    plate.position.set(0.04, 0.725, 0.14);
    tableGroup.add(plate);
    const nutMat = new THREE.MeshLambertMaterial({ color: 0x8a5b32 });
    for (let i = 0; i < 18; i++) {
      const a = hash1(i * 7.3) * Math.PI * 2;
      const r = hash1(i * 4.1) * 0.115;
      const nut = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), nutMat);
      nut.scale.set(1.4, 0.75, 0.9);
      nut.position.set(0.04 + Math.cos(a) * r, 0.75 + (i % 2) * 0.012, 0.14 + Math.sin(a) * r);
      nut.rotation.y = a;
      tableGroup.add(nut);
    }
    this.nobarPropsGroup.add(tableGroup);
  }

  _buildCharacters() {
    this.tetangga = createStickman25D({ shirtColor: '#c2b39c', headwear: 'cap', headwearColor: '#3b4c63' });
    this.buWarni = createStickman25D({ shirtColor: '#8ea392', headwear: 'hijab', headwearColor: '#66826b', robeMode: true });
    this.kid = createStickman25D({ shirtColor: '#b9854a', headwear: 'bowl', scale: 0.78 });
    this.kid.root.visible = false;
    this.root.add(this.tetangga.root, this.buWarni.root, this.kid.root);

    const villagerConfigs = [
      { shirtColor: '#c7bea9', headwear: 'peci', robeMode: false },
      { shirtColor: '#c77d98', headwear: 'hijab', headwearColor: '#a05274', robeMode: true },
      { shirtColor: '#67856d', headwear: 'none', robeMode: false },
      { shirtColor: '#627c9e', headwear: 'peci', robeMode: false },
      { shirtColor: '#b5956b', headwear: 'peci', robeMode: false },
      { shirtColor: '#7b9682', headwear: 'hijab', headwearColor: '#52785d', robeMode: true },
      { shirtColor: '#947a9e', headwear: 'none', robeMode: false },
    ];
    this.villagers = villagerConfigs.map((cfg) => {
      const v = createStickman25D({ ...cfg, scale: 0.96 });
      v.root.visible = false;
      this.root.add(v.root);
      return v;
    });
  }

  evaluateBeat(beat, localTime, globalTime) {
    const dur = Math.max(0.1, (beat.end ?? 5) - (beat.start ?? 0));
    const u = clamp(localTime / dur, 0, 1);
    const d = beat.diorama || {};

    const night = typeof d.night === 'function' ? d.night(u, localTime) : (d.night ?? 0);
    this.lights.applyNight(night);
    this.porchLamp.intensity = (d.porchLamp ?? night * 0.85) * 2.4;
    this.doorInterior.visible = Boolean(d.doorOpen);
    this.doorLeaf.position.set(d.doorOpen ? -3.38 : -2.95, 1.2, d.doorOpen ? 0.45 : 0.11);
    this.doorLeaf.rotation.y = d.doorOpen ? -1.45 : 0;

    const wallState = {
      whiteCover: typeof d.whiteCover === 'function' ? d.whiteCover(u, localTime) : (d.whiteCover ?? 0),
      greenCover: typeof d.greenCover === 'function' ? d.greenCover(u, localTime) : (d.greenCover ?? 0),
      white2Cover: typeof d.white2Cover === 'function' ? d.white2Cover(u, localTime) : (d.white2Cover ?? 0),
      projection: typeof d.projection === 'function' ? d.projection(u, localTime) : (d.projection ?? 0),
      projBright: typeof d.projBright === 'function' ? d.projBright(u, localTime) : (d.projBright ?? 1),
      ballPhase: typeof d.ballPhase === 'function' ? d.ballPhase(u, localTime) : (d.ballPhase ?? 0),
      dimOverlay: typeof d.dimOverlay === 'function' ? d.dimOverlay(u, localTime) : (d.dimOverlay ?? 0),
      coatBadge: typeof d.coatBadge === 'function' ? d.coatBadge(u, localTime) : (d.coatBadge ?? 0),
    };
    const sig = Object.values(wallState).map((v) => Math.round(v * 200)).join('|');
    if (sig !== this._lastWallSig) {
      drawHeroWall(this.wallCtx, this.wallCanvas.width, this.wallCanvas.height, wallState);
      this.wallTex.needsUpdate = true;
      this._lastWallSig = sig;
    }
    const dayWallGlow = (1 - night) * (wallState.whiteCover > 0.9 ? 0.16 : 0.06);
    this.wallMat.emissiveIntensity = Math.max(dayWallGlow, wallState.projection * wallState.projBright * 0.84);
    this.projBounceLight.intensity = wallState.projection * wallState.projBright * 1.55;

    const tied = d.leavesTied ? 1 : 0;
    this.bananaTieRing.visible = tied > 0.5;
    this.bananaLeaves.forEach((leaf, idx) => {
      const wind = Math.sin(globalTime * 1.7 + idx * 1.1) * (tied ? 0.015 : 0.045);
      leaf.pivot.rotation.z = lerp(leaf.basePitch, 0.12, tied) + wind;
    });

    this.paintCan1.visible = d.paintCan1 !== false;
    this.paintCan2.visible = Boolean(d.paintCan2);
    this.geckoGroup.visible = Boolean(d.gecko);
    if (d.gecko) {
      this.geckoGroup.position.set(lerp(-0.22, -0.04, u), lerp(1.25, 2.05, u), 0.06);
      this.geckoGroup.rotation.z = Math.sin(localTime * 14) * 0.08 - 0.1;
    }
    this.projectorGroup.visible = Boolean(d.projector);
    this.projectorCone.visible = Boolean(d.projector) && wallState.projection > 0.05;
    this.nobarPropsGroup.visible = Boolean(d.nobarProps);

    if (d.roller) {
      this.rollerGroup.visible = true;
      const rx = typeof d.roller.x === 'function' ? d.roller.x(u, localTime) : (d.roller.x ?? -0.2);
      const stroke = Math.sin(localTime * (d.roller.speed ?? 5.5)) * 0.42;
      this.rollerGroup.position.set(rx, 0.78 + stroke, 0.14);
      this.rollerGroup.rotation.z = d.roller.tilt ?? 0.16;
      this.rollerHeadMat.color.setHex(d.roller.color ?? 0xfefdf8);
    } else {
      this.rollerGroup.visible = false;
    }

    if (d.tape) {
      this.tapeGroup.visible = true;
      const len = lerp(0.35, 1.85, easeInOutCubic(u));
      this.tapeStrip.scale.x = len;
      this.tapeStrip.position.x = -len * 0.5;
      this.tapeGroup.position.set(-0.8 + len, 1.18, 0.18);
    } else {
      this.tapeGroup.visible = false;
    }

    // Evaluate camera first so 2.5D stickmen gently face the camera on Y-axis
    evaluateDioramaCamera(this.camera, beat.dioramaCamera, u, globalTime);

    const applyChar = (charObj, spec) => {
      if (!spec || spec.visible === false) {
        charObj.setPose({ visible: false });
        return;
      }
      const pos = typeof spec.pos === 'function' ? spec.pos(u, localTime) : (spec.pos || [0, 0, 0.8]);
      const bob = spec.walk ? Math.abs(Math.sin(localTime * 8.5)) * 0.075 : Math.sin(globalTime * 2.2) * 0.012;
      const expr = typeof spec.expr === 'function' ? spec.expr(u, localTime) : (spec.expr || 'neutral');
      charObj.setExpression(expr);
      charObj.setNightBlend(night);
      charObj.setIcons(typeof spec.icons === 'function' ? spec.icons(u, localTime) : (spec.icons || {}));
      const ry = typeof spec.ry === 'function' ? spec.ry(u, localTime) : (spec.ry ?? 0);
      charObj.setPose({
        x: pos[0],
        y: pos[1],
        z: pos[2],
        ry,
        bob,
        leftArmZ: typeof spec.leftArmZ === 'function' ? spec.leftArmZ(u, localTime) : (spec.leftArmZ ?? 0.24),
        leftArmX: spec.leftArmX ?? 0,
        rightArmZ: typeof spec.rightArmZ === 'function' ? spec.rightArmZ(u, localTime) : (spec.rightArmZ ?? -0.24),
        rightArmX: spec.rightArmX ?? 0,
        headTiltZ: spec.headTiltZ ?? 0,
        sit: Boolean(spec.sit),
        visible: true,
      });
      charObj.faceCameraY(this.camera.position, ry * 0.35);
    };

    applyChar(this.tetangga, d.tetangga);
    applyChar(this.buWarni, d.buWarni);
    applyChar(this.kid, d.kid);

    const crowdMode = d.crowd || 'hidden';
    this.villagers.forEach((v, idx) => {
      if (crowdMode === 'hidden') {
        v.setPose({ visible: false });
      } else if (crowdMode === 'walking_in') {
        const [tx, tz] = this.chairCoords[idx % this.chairCoords.length];
        const progress = clamp(u * 1.25 - idx * 0.06, 0, 1);
        v.setExpression('smileBig');
        v.setNightBlend(night);
        v.setIcons({});
        v.setPose({
          x: lerp(-3.8 - idx * 0.35, tx, easeOutCubic(progress)),
          y: 0,
          z: lerp(4.9, tz + 0.25, easeOutCubic(progress)),
          bob: Math.abs(Math.sin(localTime * 9 + idx)) * 0.08,
          visible: true,
        });
        v.faceCameraY(this.camera.position, 0);
      } else if (crowdMode === 'seated') {
        const [cx, cz] = this.chairCoords[idx % this.chairCoords.length];
        const cheer = Math.sin(globalTime * 4.5 + idx * 1.3) * 0.06;
        v.setExpression(idx % 2 === 0 ? 'smileBig' : 'happy');
        v.setNightBlend(night);
        v.setIcons({});
        v.setPose({
          x: cx,
          y: 0.24,
          z: cz - 0.02,
          bob: cheer * 0.2,
          leftArmZ: 0.32 + cheer,
          rightArmZ: -0.32 - cheer,
          sit: true,
          visible: true,
        });
        v.faceCameraY(this.camera.position, 0);
      }
    });
  }
}
