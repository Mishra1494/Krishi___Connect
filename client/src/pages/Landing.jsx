import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   Inline styles & keyframes (injected once)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #faf7f0;
    --ink: #1a1a0f;
    --moss: #2d4a2d;
    --sage: #6b8f5e;
    --gold: #c4a35a;
    --gold-light: #e8d5a3;
    --rust: #8b4513;
    --mist: rgba(250,247,240,0.06);
  }

  html, body { margin: 0; padding: 0; background: #0a0f07; }

  @keyframes floatUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes drawLine {
    from { transform: scaleX(0); } to { transform: scaleX(1); }
  }
  @keyframes shimmer {
    0%,100% { opacity: 0.4; } 50% { opacity: 1; }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); } to { transform: rotate(360deg); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(196,163,90,0); }
    50%      { box-shadow: 0 0 40px 10px rgba(196,163,90,0.25); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes leafSway {
    0%,100% { transform: rotate(-3deg) scale(1); }
    50%     { transform: rotate(3deg) scale(1.02); }
  }

  .kr-canvas {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
  }

  .kr-root {
    position: relative; z-index: 1;
    font-family: 'DM Sans', sans-serif;
    color: var(--cream);
    overflow-x: hidden;
  }

  .kr-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 60px;
    transition: all 0.4s ease;
  }
  .kr-nav.scrolled {
    padding: 18px 60px;
    background: rgba(10,15,7,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(196,163,90,0.15);
  }

  .kr-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 600; letter-spacing: 0.02em;
    color: var(--cream); text-decoration: none;
  }
  .kr-logo-leaf {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--sage), var(--gold));
    border-radius: 50% 0 50% 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; animation: leafSway 4s ease-in-out infinite;
  }
  .kr-logo em { color: var(--gold); font-style: italic; }

  .kr-nav-links { display: flex; align-items: center; gap: 8px; }
  .kr-nav-link {
    padding: 10px 20px;
    color: rgba(250,247,240,0.65);
    text-decoration: none; font-size: 14px; font-weight: 400;
    letter-spacing: 0.04em; text-transform: uppercase;
    transition: color 0.3s;
  }
  .kr-nav-link:hover { color: var(--cream); }
  .kr-cta-btn {
    padding: 11px 28px;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; cursor: pointer;
    transition: all 0.35s ease;
    position: relative; overflow: hidden;
  }
  .kr-cta-btn::before {
    content: ''; position: absolute; inset: 0;
    background: var(--gold); transform: scaleX(0);
    transform-origin: left; transition: transform 0.35s ease;
    z-index: -1;
  }
  .kr-cta-btn:hover { color: var(--ink); }
  .kr-cta-btn:hover::before { transform: scaleX(1); }

  /* HERO */
  .kr-hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 120px 40px 80px;
    position: relative;
  }
  .kr-hero-eyebrow {
    font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 32px;
    display: flex; align-items: center; gap: 16px;
    animation: floatUp 1s ease both 0.2s;
  }
  .kr-hero-eyebrow-line {
    width: 40px; height: 1px; background: var(--gold);
    transform-origin: left; animation: drawLine 0.8s ease both 0.8s;
  }
  .kr-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(60px, 10vw, 130px);
    font-weight: 300; line-height: 0.95;
    letter-spacing: -0.02em; margin: 0 0 8px;
    animation: floatUp 1.2s ease both 0.4s;
  }
  .kr-hero-title em {
    font-style: italic; color: var(--gold);
  }
  .kr-hero-title-accent {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(60px, 10vw, 130px);
    font-weight: 300; line-height: 0.95;
    color: transparent;
    -webkit-text-stroke: 1px rgba(250,247,240,0.3);
    animation: floatUp 1.2s ease both 0.5s;
    display: block;
  }
  .kr-hero-sub {
    max-width: 520px; margin: 40px auto 0;
    font-size: 15px; line-height: 1.8; font-weight: 300;
    color: rgba(250,247,240,0.6);
    animation: floatUp 1s ease both 0.7s;
  }
  .kr-hero-btns {
    display: flex; gap: 16px; margin-top: 48px; justify-content: center;
    animation: floatUp 1s ease both 0.9s;
  }
  .kr-btn-primary {
    padding: 16px 40px;
    background: var(--gold);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s ease;
    animation: pulseGlow 3s ease-in-out infinite 2s;
  }
  .kr-btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); }
  .kr-btn-ghost {
    padding: 16px 40px;
    background: transparent; border: 1px solid rgba(250,247,240,0.25);
    color: rgba(250,247,240,0.7);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none; transition: all 0.3s ease;
  }
  .kr-btn-ghost:hover {
    border-color: rgba(250,247,240,0.7);
    color: var(--cream);
  }

  /* SCROLL INDICATOR */
  .kr-scroll-hint {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    animation: fadeIn 1s ease both 1.5s;
  }
  .kr-scroll-line {
    width: 1px; height: 60px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: shimmer 2s ease-in-out infinite;
  }
  .kr-scroll-text { font-size: 10px; letter-spacing: 0.2em; color: rgba(250,247,240,0.3); }

  /* TICKER */
  .kr-ticker {
    border-top: 1px solid rgba(196,163,90,0.2);
    border-bottom: 1px solid rgba(196,163,90,0.2);
    padding: 16px 0; overflow: hidden;
    background: rgba(196,163,90,0.04);
  }
  .kr-ticker-inner {
    display: flex; gap: 0;
    animation: marquee 30s linear infinite;
    width: max-content;
  }
  .kr-ticker-item {
    padding: 0 48px; font-size: 11px;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(250,247,240,0.35); white-space: nowrap;
    display: flex; align-items: center; gap: 16px;
  }
  .kr-ticker-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--gold); opacity: 0.6;
  }

  /* STATS ROW */
  .kr-stats {
    display: grid; grid-template-columns: repeat(3,1fr);
    border-top: 1px solid rgba(250,247,240,0.08);
    border-bottom: 1px solid rgba(250,247,240,0.08);
    margin: 0 60px;
  }
  .kr-stat {
    padding: 60px 40px; text-align: center;
    border-right: 1px solid rgba(250,247,240,0.08);
    opacity: 0; transform: translateY(20px);
    transition: all 0.6s ease;
  }
  .kr-stat:last-child { border-right: none; }
  .kr-stat.visible { opacity: 1; transform: translateY(0); }
  .kr-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px; font-weight: 300; line-height: 1;
    color: var(--gold); letter-spacing: -0.02em;
  }
  .kr-stat-unit { font-size: 28px; }
  .kr-stat-label {
    margin-top: 12px; font-size: 12px;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(250,247,240,0.4);
  }

  /* FEATURES */
  .kr-features { padding: 120px 60px; }
  .kr-section-label {
    font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 20px;
    display: flex; align-items: center; gap: 16px;
  }
  .kr-section-label::before {
    content: ''; display: block; width: 30px; height: 1px; background: var(--gold);
  }
  .kr-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 300; line-height: 1.05;
    letter-spacing: -0.02em; margin: 0 0 80px; max-width: 600px;
  }
  .kr-section-title em { font-style: italic; color: var(--gold); }

  .kr-features-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px;
  }
  .kr-feature-card {
    padding: 56px 48px;
    border: 1px solid rgba(250,247,240,0.06);
    position: relative; overflow: hidden;
    cursor: default;
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease, background 0.4s ease;
  }
  .kr-feature-card.visible { opacity: 1; transform: translateY(0); }
  .kr-feature-card:hover { background: rgba(250,247,240,0.03); }
  .kr-feature-card::before {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    transform: scaleX(0); transform-origin: center;
    transition: transform 0.5s ease;
  }
  .kr-feature-card:hover::before { transform: scaleX(1); }

  .kr-feature-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 100px; font-weight: 300;
    color: rgba(196,163,90,0.08); line-height: 1;
    position: absolute; top: 20px; right: 28px;
    letter-spacing: -0.05em; pointer-events: none;
    transition: color 0.4s ease;
  }
  .kr-feature-card:hover .kr-feature-num { color: rgba(196,163,90,0.15); }

  .kr-feature-icon {
    width: 48px; height: 48px; margin-bottom: 28px;
    border: 1px solid rgba(196,163,90,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    transition: all 0.4s ease;
    transform: rotate(0deg);
  }
  .kr-feature-card:hover .kr-feature-icon {
    border-color: var(--gold);
    background: rgba(196,163,90,0.08);
    transform: rotate(5deg) scale(1.05);
  }
  .kr-feature-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 400; margin: 0 0 16px;
    letter-spacing: -0.01em;
  }
  .kr-feature-desc {
    font-size: 14px; line-height: 1.8; font-weight: 300;
    color: rgba(250,247,240,0.5); max-width: 340px;
  }

  /* VISUAL BREAK */
  .kr-visual-break {
    height: 70vh; display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    margin: 0 0 0;
  }
  .kr-vb-inner {
    text-align: center; position: relative; z-index: 2;
  }
  .kr-vb-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 300; font-style: italic;
    line-height: 1.3; max-width: 800px;
    color: rgba(250,247,240,0.9);
    opacity: 0; transform: translateY(30px);
    transition: all 0.8s ease;
  }
  .kr-vb-quote.visible { opacity: 1; transform: translateY(0); }
  .kr-vb-attr {
    margin-top: 32px; font-size: 11px;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold); opacity: 0;
    transition: opacity 0.8s ease 0.3s;
  }
  .kr-vb-attr.visible { opacity: 1; }
  .kr-vb-bg {
    position: absolute; inset: 0; pointer-events: none;
  }
  .kr-vb-circle {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(196,163,90,0.12);
  }

  /* HOW IT WORKS */
  .kr-how { padding: 120px 60px; }
  .kr-steps {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 0; margin-top: 80px;
    border-top: 1px solid rgba(250,247,240,0.08);
  }
  .kr-step {
    padding: 48px 40px; border-right: 1px solid rgba(250,247,240,0.08);
    position: relative;
    opacity: 0; transform: translateY(20px);
    transition: all 0.6s ease;
  }
  .kr-step:last-child { border-right: none; }
  .kr-step.visible { opacity: 1; transform: translateY(0); }
  .kr-step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; color: var(--gold);
    letter-spacing: 0.1em; margin-bottom: 24px;
    display: block;
  }
  .kr-step-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; margin: 0 0 16px;
  }
  .kr-step-desc {
    font-size: 13px; line-height: 1.8; font-weight: 300;
    color: rgba(250,247,240,0.5);
  }
  .kr-step-connector {
    position: absolute; top: 72px; right: -1px;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gold); transform: translateX(50%);
    z-index: 2;
  }
  .kr-step:last-child .kr-step-connector { display: none; }

  /* CTA */
  .kr-cta {
    margin: 60px; padding: 100px 80px;
    border: 1px solid rgba(196,163,90,0.2);
    background: linear-gradient(135deg,
      rgba(45,74,45,0.4) 0%,
      rgba(10,15,7,0.8) 60%,
      rgba(139,69,19,0.2) 100%);
    position: relative; overflow: hidden;
    text-align: center;
  }
  .kr-cta-ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(196,163,90,0.1);
    animation: rotateSlow linear infinite;
  }
  .kr-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(44px, 6vw, 80px);
    font-weight: 300; line-height: 1;
    letter-spacing: -0.02em; margin: 0 0 24px;
    position: relative; z-index: 2;
  }
  .kr-cta-title em { font-style: italic; color: var(--gold); }
  .kr-cta-sub {
    font-size: 15px; line-height: 1.8; font-weight: 300;
    color: rgba(250,247,240,0.55); margin: 0 0 48px;
    max-width: 500px; margin-left: auto; margin-right: auto;
    position: relative; z-index: 2;
  }
  .kr-cta-btns { position: relative; z-index: 2; display: flex; gap: 16px; justify-content: center; }

  /* FOOTER */
  .kr-footer {
    border-top: 1px solid rgba(250,247,240,0.08);
    padding: 60px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .kr-footer-copy {
    font-size: 12px; letter-spacing: 0.05em;
    color: rgba(250,247,240,0.25);
  }
  .kr-footer-links { display: flex; gap: 32px; }
  .kr-footer-link {
    font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(250,247,240,0.3); text-decoration: none;
    transition: color 0.3s;
  }
  .kr-footer-link:hover { color: var(--gold); }

  @media (max-width: 768px) {
    .kr-nav { padding: 20px 24px; }
    .kr-nav.scrolled { padding: 14px 24px; }
    .kr-stats { grid-template-columns: 1fr; margin: 0 24px; }
    .kr-stat { border-right: none; border-bottom: 1px solid rgba(250,247,240,0.08); padding: 40px 24px; }
    .kr-features { padding: 80px 24px; }
    .kr-features-grid { grid-template-columns: 1fr; }
    .kr-how { padding: 80px 24px; }
    .kr-steps { grid-template-columns: 1fr; }
    .kr-step { border-right: none; border-bottom: 1px solid rgba(250,247,240,0.08); }
    .kr-cta { margin: 24px; padding: 60px 32px; }
    .kr-footer { flex-direction: column; gap: 24px; padding: 40px 24px; text-align: center; }
    .kr-hero-btns { flex-direction: column; align-items: center; }
  }
`;

/* ─────────────────────────────────────────────
   Three.js Scene
───────────────────────────────────────────── */
function useThreeScene(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 80);

    /* ── Particle field (floating seeds/spores) ── */
    const COUNT = 3000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);

    const palette = [
      new THREE.Color('#c4a35a'),
      new THREE.Color('#6b8f5e'),
      new THREE.Color('#faf7f0'),
      new THREE.Color('#8b4513'),
      new THREE.Color('#2d4a2d'),
    ];

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 120;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i]  = Math.random() * 2.5 + 0.5;
      speeds[i] = Math.random() * 0.004 + 0.001;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

    /* Circle sprite texture */
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d');
    const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0,   'rgba(255,255,255,1)');
    grd.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    grd.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    const mat = new THREE.PointsMaterial({
      size: 1.2,
      sizeAttenuation: true,
      map: spriteTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    /* ── Floating geometric rings ── */
    const rings = [];
    const ringDefs = [
      { r: 30, tube: 0.08, col: '#c4a35a', speed: 0.003, axis: [1,0.5,0] },
      { r: 50, tube: 0.05, col: '#2d4a2d', speed: 0.002, axis: [0.3,1,0.2] },
      { r: 18, tube: 0.12, col: '#6b8f5e', speed: 0.005, axis: [0,0.5,1] },
    ];
    ringDefs.forEach(d => {
      const g = new THREE.TorusGeometry(d.r, d.tube, 16, 120);
      const m = new THREE.MeshBasicMaterial({ color: d.col, transparent: true, opacity: 0.35 });
      const mesh = new THREE.Mesh(g, m);
      mesh.userData = { speed: d.speed, axis: new THREE.Vector3(...d.axis).normalize() };
      scene.add(mesh);
      rings.push(mesh);
    });

    /* ── Mouse interaction ── */
    let mouseX = 0, mouseY = 0;
    const onMouseMove = e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── Scroll-based camera drift ── */
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll);

    /* ── Resize ── */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    /* ── Animation loop ── */
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      /* Drift particles */
      const pos = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += speeds[i];
        if (pos[i3 + 1] > 100) pos[i3 + 1] = -100;
        pos[i3] += Math.sin(t * 0.3 + i) * 0.002;
      }
      geo.attributes.position.needsUpdate = true;

      /* Rotate rings */
      rings.forEach(r => {
        r.quaternion.setFromAxisAngle(r.userData.axis, t * r.userData.speed);
      });

      /* Camera gentle drift */
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.02;
      camera.position.z = 80 + scrollY * 0.01;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      spriteTex.dispose();
    };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────────
   Intersection Observer hook
───────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.delay || 0;
          setTimeout(() => e.target.classList.add('visible'), delay * 1000);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Landing = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  useThreeScene(canvasRef);
  useReveal();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const features = [
    { icon: '🌱', num: '01', title: 'Crop Intelligence', desc: 'AI-driven soil analysis and microclimate modelling tailors every recommendation to the unique fingerprint of your land.' },
    { icon: '⛅', num: '02', title: 'Climate Foresight', desc: 'Hyperlocal weather intelligence that sees beyond tomorrow, giving you strategic weeks of advance planning.' },
    { icon: '📈', num: '03', title: 'Market Oracle', desc: 'Real-time commodity pricing and demand signals so you harvest when margins peak, not when they trough.' },
    { icon: '🤖', num: '04', title: 'AI Agronomist', desc: 'An expert advisor available at every hour of every season, fluent in the language of soil, sun, and seed.' },
  ];

  const steps = [
    { num: '01', title: 'Connect Your Land', desc: 'Map your fields, input your soil profile, and link your local weather station in minutes.' },
    { num: '02', title: 'Receive Insights', desc: 'Our models process thousands of variables to surface the decisions that matter most to your season.' },
    { num: '03', title: 'Grow & Prosper', desc: 'Act on precise guidance and watch your yields, efficiency, and margins transform over each harvest.' },
  ];

  const tickerItems = ['Smart Farming', 'Precision Agriculture', 'AI-Powered Yields', 'Climate Resilience', 'Market Intelligence', 'Soil Analytics', 'Crop Forecasting', 'Farm Digitisation'];

  return (
    <>
      <canvas ref={canvasRef} className="kr-canvas" />
      <div className="kr-root">

        {/* NAV */}
        <nav className={`kr-nav ${scrolled ? 'scrolled' : ''}`}>
          <Link to="/" className="kr-logo">
            <div className="kr-logo-leaf">🌿</div>
            Krishi<em>Connect</em>
          </Link>
          <div className="kr-nav-links">
            <a href="#features" className="kr-nav-link">Features</a>
            <a href="#how" className="kr-nav-link">How It Works</a>
            <Link to="/login" className="kr-nav-link">Sign In</Link>
            <Link to="/signup" className="kr-cta-btn">Get Started</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="kr-hero">
          <div className="kr-hero-eyebrow">
            <span className="kr-hero-eyebrow-line" />
            The Future of Agriculture
            <span className="kr-hero-eyebrow-line" />
          </div>
          <h1 className="kr-hero-title">
            Farming<br />
            <em>Reimagined</em>
          </h1>
          <span className="kr-hero-title-accent">for the Modern Era</span>
          <p className="kr-hero-sub">
            {t('pages.landing.hero.subtitle', 'KrishiConnect brings AI-driven insights, advanced climate tracking, and smart marketplace access directly to your fingertips. Empowering farmers to grow more, with less.')}
          </p>
          <div className="kr-hero-btns">
            <Link to="/signup" className="kr-btn-primary">Begin Your Journey</Link>
            <Link to="/login"  className="kr-btn-ghost">Sign Back In</Link>
          </div>
          <div className="kr-scroll-hint">
            <div className="kr-scroll-line" />
            <span className="kr-scroll-text">Scroll</span>
          </div>
        </section>

        {/* TICKER */}
        <div className="kr-ticker">
          <div className="kr-ticker-inner">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="kr-ticker-item">
                <span className="kr-ticker-dot" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="kr-stats">
          {[
            { num: '50', unit: 'K+', label: 'Farmers Empowered' },
            { num: '37', unit: '%',  label: 'Average Yield Increase' },
            { num: '12', unit: '+',  label: 'Languages Supported' },
          ].map((s, i) => (
            <div key={i} className="kr-stat" data-reveal data-delay={i * 0.15}>
              <div className="kr-stat-num">{s.num}<span className="kr-stat-unit">{s.unit}</span></div>
              <div className="kr-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="kr-features" id="features">
          <div className="kr-section-label">Platform Features</div>
          <h2 className="kr-section-title">
            Intelligence at<br /><em>every level</em>
          </h2>
          <div className="kr-features-grid">
            {features.map((f, i) => (
              <div key={i} className="kr-feature-card" data-reveal data-delay={i * 0.1}>
                <span className="kr-feature-num">{f.num}</span>
                <div className="kr-feature-icon">{f.icon}</div>
                <h3 className="kr-feature-title">{f.title}</h3>
                <p className="kr-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VISUAL BREAK / QUOTE */}
        <div className="kr-visual-break">
          <div className="kr-vb-bg">
            {[80,160,240,320].map((r,i) => (
              <div key={i} className="kr-vb-circle" style={{
                width: r*2, height: r*2,
                top: '50%', left: '50%',
                transform: `translate(-50%,-50%)`,
                opacity: 0.06 + i * 0.02,
              }} />
            ))}
          </div>
          <div className="kr-vb-inner">
            <div className="kr-vb-quote" data-reveal>
              "The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale — <em>until now.</em>"
            </div>
            <div className="kr-vb-attr" data-reveal>KrishiConnect, 2026</div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="kr-how" id="how">
          <div className="kr-section-label">Simple Process</div>
          <h2 className="kr-section-title">
            Three steps to<br /><em>transformation</em>
          </h2>
          <div className="kr-steps">
            {steps.map((s, i) => (
              <div key={i} className="kr-step" data-reveal data-delay={i * 0.15}>
                <span className="kr-step-num">{s.num}</span>
                <h3 className="kr-step-title">{s.title}</h3>
                <p className="kr-step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="kr-step-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="kr-cta">
          {[
            {size:300, dur:'18s', top:'50%', left:'15%'},
            {size:200, dur:'25s', top:'30%', left:'75%'},
            {size:400, dur:'30s', top:'70%', left:'50%'},
          ].map((r,i) => (
            <div key={i} className="kr-cta-ring" style={{
              width: r.size, height: r.size,
              top: r.top, left: r.left,
              transform: 'translate(-50%,-50%)',
              animationDuration: r.dur,
            }} />
          ))}
          <h2 className="kr-cta-title">
            Ready to transform<br />
            your <em>harvest?</em>
          </h2>
          <p className="kr-cta-sub">
            Join thousands of modern farmers leveraging data and AI to secure their future and their legacy.
          </p>
          <div className="kr-cta-btns">
            <Link to="/signup" className="kr-btn-primary">Create Your Account</Link>
            <Link to="/login"  className="kr-btn-ghost">Sign In</Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="kr-footer">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ color:'var(--gold)', fontSize:16 }}>🌿</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:'var(--cream)' }}>
                Krishi<em style={{ color:'var(--gold)', fontStyle:'italic' }}>Connect</em>
              </span>
            </div>
            <div className="kr-footer-copy">© 2026 Krishi Connect. All rights reserved.</div>
          </div>
          <div className="kr-footer-links">
            <a href="#" className="kr-footer-link">Privacy</a>
            <a href="#" className="kr-footer-link">Terms</a>
            <a href="#" className="kr-footer-link">Contact</a>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Landing;