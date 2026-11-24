/**
 * Deterministic 2D Overlay Renderer for Short-Form Storytelling Videos:
 *  - Bold kinetic outlined captions (white + thick black outline + *golden yellow* keywords)
 *  - Upper-headroom HUD math / numeric callouts (e.g. "50 x Rp10.000 / Rp500 RB")
 *  - Subtle vignette & scene crossfade to dark
 */

import { clamp01, easeOutBack, easeOutCubic, lerp } from '../utils/math.js';

export class OverlayRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 720;
    this.height = 1280;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render({
    caption = null,
    captionLocalTime = 1.0,
    hudOverlay = null,
    vignette = 0.14,
    fadeAlpha = 0,
  } = {}) {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (vignette > 0.01) {
      const grad = ctx.createRadialGradient(
        W * 0.5,
        H * 0.5,
        Math.min(W, H) * 0.34,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.72
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(6,10,18,${clamp01(vignette)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    if (hudOverlay) {
      this._renderHudOverlay(ctx, W, H, hudOverlay);
    }

    if (caption) {
      this._renderBoldOutlinedCaption(ctx, W, H, caption, captionLocalTime);
    }

    if (fadeAlpha > 0.005) {
      ctx.save();
      ctx.fillStyle = `rgba(10, 13, 20, ${clamp01(fadeAlpha)})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  _renderBoldOutlinedCaption(ctx, W, H, text, captionLocalTime = 1.0) {
    ctx.save();
    const fontSize = Math.max(26, Math.round(W * 0.068));
    const lineHeight = Math.round(fontSize * 1.22);
    const maxTextW = W * 0.86;
    ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", "Inter", system-ui, sans-serif`;

    const tokens = [];
    const segments = String(text).trim().split(/(\*[^*]+\*)/g);
    for (const seg of segments) {
      if (!seg) continue;
      const isHi = seg.startsWith('*') && seg.endsWith('*') && seg.length > 2;
      const cleanSeg = isHi ? seg.slice(1, -1) : seg.replace(/\*/g, '');
      for (const word of cleanSeg.split(/\s+/).filter(Boolean)) {
        if (/^[.,!?;:—–-]+$/.test(word) && tokens.length > 0) {
          tokens[tokens.length - 1].word += word;
        } else {
          tokens.push({ word, highlight: isHi });
        }
      }
    }

    const lines = [];
    let cur = [];
    let curStr = '';
    for (const tok of tokens) {
      const cand = curStr ? `${curStr} ${tok.word}` : tok.word;
      if (ctx.measureText(cand).width <= maxTextW || cur.length === 0) {
        cur.push(tok);
        curStr = cand;
      } else {
        lines.push(cur);
        cur = [tok];
        curStr = tok.word;
      }
    }
    if (cur.length) lines.push(cur);

    const centerY = H * 0.755;
    const popU = clamp01((Number.isFinite(captionLocalTime) ? captionLocalTime : 1.0) / 0.12);
    const popScale = lerp(0.86, 1.0, easeOutBack(popU, 1.6));
    const popAlpha = lerp(0.2, 1.0, easeOutCubic(popU));

    ctx.globalAlpha = popAlpha;
    ctx.translate(W * 0.5, centerY);
    ctx.scale(popScale, popScale);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    const spaceW = ctx.measureText(' ').width;
    const totalH = lines.length * lineHeight;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const ly = -totalH * 0.5 + lineHeight * (i + 0.5);
      const rawW = ctx.measureText(line.map((t) => t.word).join(' ')).width;
      const fit = rawW > maxTextW ? maxTextW / rawW : 1;
      ctx.save();
      ctx.translate(0, ly);
      ctx.scale(fit, 1);
      let x = -rawW * 0.5;
      for (const tok of line) {
        const w = ctx.measureText(tok.word).width;
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = Math.round(fontSize * 0.25);
        ctx.shadowOffsetY = Math.round(fontSize * 0.1);
        ctx.lineWidth = Math.max(8, Math.round(fontSize * 0.24));
        ctx.strokeStyle = '#090d16';
        ctx.strokeText(tok.word, x, 0);
        ctx.restore();

        ctx.fillStyle = tok.highlight ? '#facc15' : '#ffffff';
        ctx.fillText(tok.word, x, 0);
        x += w + spaceW;
      }
      ctx.restore();
    }
    ctx.restore();
  }

  _renderHudOverlay(ctx, W, H, hud) {
    ctx.save();
    const popU = clamp01((hud.localTime ?? 1.0) / 0.16);
    const scale = lerp(0.72, 1.0, easeOutBack(popU, 1.7));
    const alpha = lerp(0.0, 1.0, easeOutCubic(popU));
    const cy = H * (hud.yFrac ?? 0.22);

    ctx.globalAlpha = alpha;
    ctx.translate(W * 0.5, cy);
    ctx.scale(scale, scale);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    if (hud.formula) {
      const fSize = Math.round(W * 0.044);
      ctx.font = `800 ${fSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.lineWidth = Math.round(fSize * 0.26);
      ctx.strokeStyle = '#090d16';
      ctx.strokeText(hud.formula, 0, -fSize * 1.15);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(hud.formula, 0, -fSize * 1.15);

      ctx.strokeStyle = 'rgba(248, 250, 252, 0.72)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-W * 0.16, -fSize * 0.45);
      ctx.lineTo(W * 0.16, -fSize * 0.45);
      ctx.stroke();
    }

    if (hud.value) {
      const vSize = Math.round(W * (hud.large ? 0.095 : 0.072));
      ctx.font = `900 ${vSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.lineWidth = Math.round(vSize * 0.22);
      ctx.strokeStyle = '#090d16';
      ctx.strokeText(hud.value, 0, hud.formula ? vSize * 0.45 : 0);
      ctx.fillStyle = hud.color || '#facc15';
      ctx.fillText(hud.value, 0, hud.formula ? vSize * 0.45 : 0);
    }

    ctx.restore();
  }
}
