import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: #ffffff;
    --off-white: #f8faf6;
    --surface: #f0f7ec;
    --surface-2: #e4f1de;
    --green-900: #0f3320;
    --green-800: #174d30;
    --green-700: #1e6b3f;
    --green-600: #2a8a52;
    --green-500: #3aad67;
    --green-400: #5ccc84;
    --green-300: #8ddfa9;
    --green-200: #b8edcc;
    --green-100: #d9f5e5;
    --green-50: #edfaf3;
    --accent: #2a8a52;
    --accent-hover: #1e6b3f;
    --text-primary: #0f2018;
    --text-secondary: #2d5040;
    --text-muted: #5a7a68;
    --border: rgba(42, 138, 82, 0.15);
    --border-strong: rgba(42, 138, 82, 0.3);
    --shadow-sm: 0 2px 8px rgba(15, 51, 32, 0.06);
    --shadow-md: 0 8px 32px rgba(15, 51, 32, 0.1);
    --shadow-lg: 0 24px 64px rgba(15, 51, 32, 0.14);
  }

  html { scroll-behavior: smooth; }

  .kc-body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--off-white);
    color: var(--text-primary);
    overflow-x: hidden;
    line-height: 1.6;
  }

  #three-canvas {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .kc-container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
  .kc-section { position: relative; z-index: 2; }

  /* NAV */
  .kc-nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 24px 60px;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .kc-nav.scrolled {
    padding: 16px 60px;
    background: rgba(248, 250, 246, 0.92);
    backdrop-filter: blur(24px) saturate(1.8);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .kc-nav-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: var(--green-900);
    letter-spacing: -0.02em;
  }
  .kc-nav-logo-mark {
    width: 36px; height: 36px;
    background: var(--green-700);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.3s ease;
  }
  .kc-nav-logo:hover .kc-nav-logo-mark { transform: rotate(8deg) scale(1.05); }
  .kc-nav-logo .em { color: var(--green-600); font-style: italic; }

  .kc-nav-links { display: flex; align-items: center; gap: 4px; }
  .kc-nav-link {
    padding: 9px 18px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px; font-weight: 500;
    border-radius: 8px;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
  }
  .kc-nav-link:hover { color: var(--green-700); background: var(--green-50); }
  .kc-nav-btn {
    padding: 10px 24px;
    background: var(--green-700);
    color: var(--white);
    text-decoration: none;
    font-size: 14px; font-weight: 600;
    border-radius: 10px;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
    box-shadow: 0 2px 12px rgba(30, 107, 63, 0.3);
  }
  .kc-nav-btn:hover {
    background: var(--green-800);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(30, 107, 63, 0.35);
  }

  /* HERO */
  .kc-hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 140px 48px 100px;
    position: relative; z-index: 2;
  }

  .kc-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 20px;
    background: var(--green-50);
    border: 1px solid var(--green-200);
    border-radius: 100px;
    font-size: 12px; font-weight: 600;
    color: var(--green-700);
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 40px;
    opacity: 0; transform: translateY(16px);
    animation: kcRevealUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
  }
  .kc-hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green-500);
    animation: kcPulseDot 2s ease-in-out infinite;
  }

  .kc-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px, 8vw, 112px);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: var(--green-900);
    max-width: 900px;
    margin-bottom: 12px;
    opacity: 0; transform: translateY(24px);
    animation: kcRevealUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
  }
  .kc-hero-title em {
    font-style: italic;
    color: var(--green-600);
  }
  .kc-hero-title-line2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px, 8vw, 112px);
    font-weight: 400;
    font-style: italic;
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: transparent;
    -webkit-text-stroke: 1.5px var(--green-400);
    margin-bottom: 40px;
    display: block;
    opacity: 0; transform: translateY(24px);
    animation: kcRevealUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.35s forwards;
  }

  .kc-hero-desc {
    max-width: 580px;
    font-size: 17px; font-weight: 400; line-height: 1.75;
    color: var(--text-muted);
    margin-bottom: 52px;
    opacity: 0; transform: translateY(20px);
    animation: kcRevealUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
  }

  .kc-hero-btns {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    opacity: 0; transform: translateY(20px);
    animation: kcRevealUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.65s forwards;
    margin-bottom: 80px;
  }
  .kc-btn-primary {
    padding: 17px 44px;
    background: var(--green-700);
    color: var(--white);
    text-decoration: none;
    font-size: 15px; font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(30, 107, 63, 0.35);
    letter-spacing: 0.01em;
  }
  .kc-btn-primary:hover {
    background: var(--green-800);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(30, 107, 63, 0.42);
  }
  .kc-btn-outline {
    padding: 17px 44px;
    background: var(--white);
    color: var(--green-700);
    border: 1.5px solid var(--border-strong);
    text-decoration: none;
    font-size: 15px; font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
    letter-spacing: 0.01em;
  }
  .kc-btn-outline:hover {
    background: var(--green-50);
    border-color: var(--green-400);
    transform: translateY(-2px);
  }

  .kc-hero-trust {
    display: flex; align-items: center; gap: 32px;
    opacity: 0;
    animation: kcFadeIn 1s ease 1.2s forwards;
  }
  .kc-trust-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 500; color: var(--text-muted);
  }
  .kc-trust-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--green-100);
    display: flex; align-items: center; justify-content: center;
  }
  .kc-trust-divider { width: 1px; height: 20px; background: var(--border-strong); }

  /* MARQUEE */
  .kc-marquee-section {
    position: relative; z-index: 2;
    padding: 20px 0;
    background: var(--green-700);
    overflow: hidden;
  }
  .kc-marquee-inner {
    display: flex;
    animation: kcMarquee 28s linear infinite;
    width: max-content;
  }
  .kc-marquee-item {
    padding: 0 40px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
    white-space: nowrap;
    display: flex; align-items: center; gap: 16px;
  }
  .kc-marquee-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--green-300);
  }

  /* STATS */
  .kc-stats-section {
    position: relative; z-index: 2;
    padding: 80px 0;
    background: var(--white);
  }
  .kc-stats-grid {
    max-width: 1100px; margin: 0 auto; padding: 0 48px;
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }
  .kc-stat-card {
    padding: 48px 36px;
    border-right: 1px solid var(--border);
    text-align: center;
    opacity: 0; transform: translateY(20px);
    transition: all 0.6s ease;
    position: relative;
    background: var(--white);
  }
  .kc-stat-card:last-child { border-right: none; }
  .kc-stat-card.visible { opacity: 1; transform: translateY(0); }
  .kc-stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--green-400), var(--green-600));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.5s ease 0.3s;
  }
  .kc-stat-card.visible::before { transform: scaleX(1); }
  .kc-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 56px; font-weight: 700;
    color: var(--green-800);
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .kc-stat-unit { font-size: 32px; color: var(--green-500); }
  .kc-stat-label {
    margin-top: 10px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted);
  }

  /* FEATURES */
  .kc-features-section {
    position: relative; z-index: 2;
    padding: 120px 0;
    background: var(--off-white);
  }
  .kc-section-eyebrow {
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--green-600);
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .kc-section-eyebrow::before {
    content: '';
    display: block; width: 28px; height: 2px;
    background: var(--green-500); border-radius: 2px;
  }
  .kc-section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--green-900);
    margin-bottom: 16px;
  }
  .kc-section-title em { font-style: italic; color: var(--green-600); }
  .kc-section-sub {
    font-size: 16px; font-weight: 400; line-height: 1.7;
    color: var(--text-muted);
    max-width: 500px;
    margin-bottom: 72px;
  }

  .kc-features-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    border-radius: 20px; overflow: hidden;
    box-shadow: var(--shadow-lg);
  }
  .kc-feature-card {
    background: var(--white);
    padding: 56px 48px;
    position: relative; overflow: hidden;
    cursor: default;
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.6s ease, transform 0.6s ease, background 0.35s ease;
  }
  .kc-feature-card.visible { opacity: 1; transform: translateY(0); }
  .kc-feature-card:hover { background: var(--green-50); }
  .kc-feature-card::after {
    content: '';
    position: absolute; left: 0; bottom: 0;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, var(--green-400), var(--green-600));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.45s ease;
  }
  .kc-feature-card:hover::after { transform: scaleX(1); }

  .kc-feature-num {
    position: absolute; top: 28px; right: 36px;
    font-family: 'Playfair Display', serif;
    font-size: 88px; font-weight: 700;
    color: var(--green-100);
    line-height: 1;
    letter-spacing: -0.05em;
    pointer-events: none;
    transition: color 0.35s ease;
  }
  .kc-feature-card:hover .kc-feature-num { color: var(--green-200); }

  .kc-feature-icon-wrap {
    width: 52px; height: 52px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px;
    transition: all 0.35s ease;
  }
  .kc-feature-card:hover .kc-feature-icon-wrap {
    background: var(--green-100);
    border-color: var(--green-300);
    transform: scale(1.05) rotate(4deg);
  }
  .kc-feature-icon-wrap svg { width: 24px; height: 24px; }

  .kc-feature-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 600;
    color: var(--green-900);
    margin-bottom: 14px;
    letter-spacing: -0.01em;
  }
  .kc-feature-desc {
    font-size: 15px; line-height: 1.75;
    color: var(--text-muted); max-width: 360px;
  }

  /* QUOTE */
  .kc-quote-section {
    position: relative; z-index: 2;
    padding: 100px 0;
    background: var(--green-800);
    overflow: hidden;
    text-align: center;
  }
  .kc-quote-section::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(90, 204, 132, 0.12) 0%, transparent 70%);
  }
  .kc-quote-decorative {
    position: absolute;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 50%;
  }
  .kc-quote-text {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 4vw, 44px);
    font-weight: 400; font-style: italic;
    color: var(--white);
    line-height: 1.4;
    max-width: 820px;
    margin: 0 auto;
    position: relative; z-index: 2;
    opacity: 0; transform: translateY(24px);
    transition: all 0.8s ease;
  }
  .kc-quote-text.visible { opacity: 1; transform: translateY(0); }
  .kc-quote-text em { color: var(--green-300); font-style: normal; }
  .kc-quote-attr {
    margin-top: 28px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    position: relative; z-index: 2;
    opacity: 0; transition: opacity 0.8s ease 0.25s;
  }
  .kc-quote-attr.visible { opacity: 1; }

  /* HOW IT WORKS */
  .kc-how-section {
    position: relative; z-index: 2;
    padding: 120px 0;
    background: var(--white);
  }
  .kc-steps-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 40px; margin-top: 64px;
  }
  .kc-step-card {
    position: relative;
    opacity: 0; transform: translateY(24px);
    transition: all 0.6s ease;
  }
  .kc-step-card.visible { opacity: 1; transform: translateY(0); }
  .kc-step-connector {
    position: absolute;
    top: 32px; left: calc(100% + 4px);
    width: calc(40px - 8px);
    height: 1px;
    background: linear-gradient(90deg, var(--green-300), var(--green-100));
    display: flex; align-items: center; justify-content: center;
  }
  .kc-step-connector::after {
    content: '';
    position: absolute; right: 0;
    width: 6px; height: 6px;
    border-top: 1.5px solid var(--green-400);
    border-right: 1.5px solid var(--green-400);
    transform: rotate(45deg) translateX(-2px);
  }
  .kc-step-card:last-child .kc-step-connector { display: none; }

  .kc-step-num-badge {
    width: 48px; height: 48px;
    background: var(--green-700);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: var(--white);
    margin-bottom: 28px;
    position: relative; z-index: 1;
  }
  .kc-step-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 600;
    color: var(--green-900);
    margin-bottom: 14px;
    letter-spacing: -0.01em;
  }
  .kc-step-desc {
    font-size: 14px; line-height: 1.75;
    color: var(--text-muted);
  }

  /* TESTIMONIALS */
  .kc-testimonials-section {
    position: relative; z-index: 2;
    padding: 120px 0;
    background: var(--off-white);
  }
  .kc-testimonials-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-top: 64px;
  }
  .kc-testimonial-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px 36px;
    box-shadow: var(--shadow-sm);
    opacity: 0; transform: translateY(24px);
    transition: all 0.6s ease;
  }
  .kc-testimonial-card.visible { opacity: 1; transform: translateY(0); }
  .kc-testimonial-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
  }
  .kc-testimonial-stars {
    display: flex; gap: 4px; margin-bottom: 20px;
  }
  .kc-star { width: 14px; height: 14px; fill: var(--green-500); }
  .kc-testimonial-quote {
    font-size: 15px; line-height: 1.75;
    color: var(--text-secondary);
    margin-bottom: 28px;
  }
  .kc-testimonial-author {
    display: flex; align-items: center; gap: 14px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }
  .kc-author-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--green-700);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 700; color: var(--white);
    flex-shrink: 0;
  }
  .kc-author-name { font-size: 14px; font-weight: 600; color: var(--green-900); }
  .kc-author-role { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  /* CTA */
  .kc-cta-section {
    position: relative; z-index: 2;
    padding: 60px 48px 80px;
    background: var(--off-white);
  }
  .kc-cta-inner {
    background: var(--green-800);
    border-radius: 28px;
    padding: 100px 80px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .kc-cta-inner::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(90, 204, 132, 0.14) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(141, 223, 169, 0.08) 0%, transparent 50%);
  }
  .kc-cta-ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .kc-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 700; line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--white);
    margin-bottom: 20px;
    position: relative; z-index: 2;
  }
  .kc-cta-title em { font-style: italic; color: var(--green-300); }
  .kc-cta-sub {
    font-size: 17px; line-height: 1.7;
    color: rgba(255,255,255,0.55);
    max-width: 480px;
    margin: 0 auto 48px;
    position: relative; z-index: 2;
  }
  .kc-cta-btns {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    position: relative; z-index: 2;
  }
  .kc-btn-white {
    padding: 17px 44px;
    background: var(--white);
    color: var(--green-800);
    text-decoration: none;
    font-size: 15px; font-weight: 700;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .kc-btn-white:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,0.25); }
  .kc-btn-ghost-white {
    padding: 17px 44px;
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    font-size: 15px; font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  .kc-btn-ghost-white:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }

  /* FOOTER */
  .kc-footer {
    position: relative; z-index: 2;
    background: var(--green-900);
    padding: 72px 60px 40px;
  }
  .kc-footer-top {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 60px; padding-bottom: 60px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .kc-footer-brand-desc {
    font-size: 14px; line-height: 1.75;
    color: rgba(255,255,255,0.4);
    margin-top: 16px; max-width: 260px;
  }
  .kc-footer-col-title {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--green-400);
    margin-bottom: 20px;
  }
  .kc-footer-link {
    display: block; margin-bottom: 12px;
    font-size: 14px; color: rgba(255,255,255,0.45);
    text-decoration: none;
    transition: color 0.25s ease;
  }
  .kc-footer-link:hover { color: rgba(255,255,255,0.85); }
  .kc-footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 36px;
    font-size: 13px; color: rgba(255,255,255,0.25);
  }
  .kc-footer-bottom-links { display: flex; gap: 28px; }

  /* SCROLL TO TOP */
  .kc-scroll-top {
    position: fixed; bottom: 32px; right: 32px;
    width: 44px; height: 44px;
    background: var(--green-700);
    border: none; border-radius: 12px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow-md);
    opacity: 0; pointer-events: none;
    transition: all 0.3s ease;
    z-index: 200;
  }
  .kc-scroll-top.visible { opacity: 1; pointer-events: all; }
  .kc-scroll-top:hover { background: var(--green-800); transform: translateY(-2px); }
  .kc-scroll-top svg { width: 18px; height: 18px; stroke: #fff; }

  /* ANIMATIONS */
  @keyframes kcRevealUp {
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes kcFadeIn {
    to { opacity: 1; }
  }
  @keyframes kcMarquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes kcPulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }
  @keyframes kcRotateSlow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .kc-cta-ring-1 { animation: kcRotateSlow 40s linear infinite; }
  .kc-cta-ring-2 { animation: kcRotateSlow 28s linear infinite reverse; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .kc-nav { padding: 20px 24px; }
    .kc-nav.scrolled { padding: 14px 24px; }
    .kc-nav-links .kc-nav-link { display: none; }
    .kc-container { padding: 0 24px; }
    .kc-hero { padding: 120px 24px 80px; }
    .kc-hero-trust { flex-wrap: wrap; justify-content: center; gap: 16px; }
    .kc-trust-divider { display: none; }
    .kc-stats-grid { grid-template-columns: repeat(2, 1fr); margin: 0 24px; }
    .kc-stat-card:nth-child(2) { border-right: none; }
    .kc-stat-card:nth-child(1), .kc-stat-card:nth-child(2) { border-bottom: 1px solid var(--border); }
    .kc-features-section, .kc-how-section, .kc-testimonials-section { padding: 80px 0; }
    .kc-features-grid { grid-template-columns: 1fr; }
    .kc-steps-grid { grid-template-columns: 1fr; gap: 32px; }
    .kc-step-connector { display: none; }
    .kc-testimonials-grid { grid-template-columns: 1fr; }
    .kc-cta-inner { padding: 60px 32px; }
    .kc-footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
    .kc-footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
    .kc-footer { padding: 60px 24px 32px; }
  }
`;

const marqueeItems = [
  'Smart Farming', 'Precision Agriculture', 'AI-Powered Yields',
  'Climate Resilience', 'Market Intelligence', 'Soil Analytics',
  'Crop Forecasting', 'Farm Digitisation', 'Mandi Connect', 'Agri Finance'
];

const StarIcon = () => (
  <svg className="kc-star" viewBox="0 0 14 14">
    <path d="M7 1L8.5 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.5L7 1Z" />
  </svg>
);

const Stars = () => (
  <div className="kc-testimonial-stars">
    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
  </div>
);

export default function Landing() {
  const canvasRef = useRef(null);
  const navRef = useRef(null);
  const scrollBtnRef = useRef(null);

  useEffect(() => {
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    // Three.js scene
    if (typeof window === 'undefined') return;
    const THREE = window.THREE;
    if (!THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => initThree(window.THREE);
      document.body.appendChild(script);
    } else {
      initThree(THREE);
    }

    function initThree(THREE) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 90);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dLight = new THREE.DirectionalLight(0x5ccc84, 0.8);
      dLight.position.set(5, 5, 5);
      scene.add(dLight);

      const COUNT = 2200;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const sizes = new Float32Array(COUNT);
      const speeds = new Float32Array(COUNT);

      const palette = [
        new THREE.Color('#2a8a52'), new THREE.Color('#5ccc84'),
        new THREE.Color('#8ddfa9'), new THREE.Color('#b8edcc'),
        new THREE.Color('#d9f5e5'), new THREE.Color('#3aad67'),
        new THREE.Color('#174d30'),
      ];

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        positions[i3]     = (Math.random() - 0.5) * 220;
        positions[i3 + 1] = (Math.random() - 0.5) * 180;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
        sizes[i] = Math.random() * 2.2 + 0.4;
        speeds[i] = Math.random() * 0.005 + 0.001;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const sCanvas = document.createElement('canvas');
      sCanvas.width = sCanvas.height = 64;
      const sCtx = sCanvas.getContext('2d');
      const grd = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(0.5, 'rgba(255,255,255,0.6)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      sCtx.fillStyle = grd;
      sCtx.fillRect(0, 0, 64, 64);
      const spriteTex = new THREE.CanvasTexture(sCanvas);

      const pMat = new THREE.PointsMaterial({
        size: 1.4, sizeAttenuation: true,
        map: spriteTex, vertexColors: true,
        transparent: true, opacity: 0.55,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(geo, pMat);
      scene.add(particles);

      const rings = [];
      const ringDefs = [
        { r: 38, tube: 0.06, col: '#2a8a52', speed: 0.0022, axis: [1, 0.4, 0.2] },
        { r: 60, tube: 0.04, col: '#5ccc84', speed: 0.0014, axis: [0.3, 1, 0.15] },
        { r: 22, tube: 0.09, col: '#8ddfa9', speed: 0.0038, axis: [0.1, 0.3, 1] },
        { r: 80, tube: 0.03, col: '#b8edcc', speed: 0.0009, axis: [0.7, 0.2, 0.5] },
      ];
      ringDefs.forEach(d => {
        const g = new THREE.TorusGeometry(d.r, d.tube, 16, 140);
        const m = new THREE.MeshBasicMaterial({ color: d.col, transparent: true, opacity: 0.28 });
        const mesh = new THREE.Mesh(g, m);
        mesh.userData = { speed: d.speed, axis: new THREE.Vector3(...d.axis).normalize() };
        scene.add(mesh);
        rings.push(mesh);
      });

      const leafGeo = new THREE.SphereGeometry(0.8, 8, 6);
      const leafMat = new THREE.MeshBasicMaterial({ color: '#5ccc84', transparent: true, opacity: 0.4, wireframe: true });
      const leaves = [];
      for (let i = 0; i < 12; i++) {
        const mesh = new THREE.Mesh(leafGeo, leafMat);
        mesh.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 50
        );
        mesh.scale.setScalar(Math.random() * 2 + 0.5);
        mesh.userData.floatSpeed = Math.random() * 0.3 + 0.1;
        mesh.userData.floatOffset = Math.random() * Math.PI * 2;
        scene.add(mesh);
        leaves.push(mesh);
      }

      let mX = 0, mY = 0, scrollY = 0;
      const onMouseMove = e => {
        mX = (e.clientX / window.innerWidth - 0.5) * 2;
        mY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      const onScroll = () => { scrollY = window.scrollY; };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('scroll', onScroll);

      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      const clock = new THREE.Clock();
      let frameId;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const pos = geo.attributes.position.array;
        for (let i = 0; i < COUNT; i++) {
          const i3 = i * 3;
          pos[i3 + 1] += speeds[i];
          if (pos[i3 + 1] > 90) pos[i3 + 1] = -90;
          pos[i3] += Math.sin(t * 0.2 + i * 0.1) * 0.003;
        }
        geo.attributes.position.needsUpdate = true;
        rings.forEach(r => { r.quaternion.setFromAxisAngle(r.userData.axis, t * r.userData.speed); });
        leaves.forEach(l => {
          l.position.y += Math.sin(t * l.userData.floatSpeed + l.userData.floatOffset) * 0.008;
          l.rotation.y += 0.002;
          l.rotation.x += 0.001;
        });
        camera.position.x += (mX * 6 - camera.position.x) * 0.015;
        camera.position.y += (-mY * 3 - camera.position.y) * 0.015;
        camera.position.z = 90 + scrollY * 0.008;
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
      };
    }
  }, []);

  useEffect(() => {
    // Nav scroll + scroll-to-top
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 50);
      if (scrollBtnRef.current) scrollBtnRef.current.classList.toggle('visible', window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Intersection observer for reveal
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.delay || 0);
          setTimeout(() => e.target.classList.add('visible'), delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="kc-body">
      <canvas id="three-canvas" ref={canvasRef} />

      {/* NAV */}
      <nav id="main-nav" ref={navRef} className="kc-nav">
        <a href="#" className="kc-nav-logo">
          <div className="kc-nav-logo-mark">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M12 3C12 3 6 8 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 8 12 3 12 3Z" fill="rgba(255,255,255,0.9)" />
              <path d="M12 10V21M12 21C10 18 8 16 8 16M12 21C14 18 16 16 16 16" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          Krishi<span className="em">Connect</span>
        </a>
        <div className="kc-nav-links">
          <a href="#features" className="kc-nav-link" onClick={e => scrollToSection(e, 'features')}>Features</a>
          <a href="#how" className="kc-nav-link" onClick={e => scrollToSection(e, 'how')}>How It Works</a>
          <a href="#testimonials" className="kc-nav-link" onClick={e => scrollToSection(e, 'testimonials')}>Testimonials</a>
          <a href="#" className="kc-nav-link">Sign In</a>
          <a href="#" className="kc-nav-btn">Get Started →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="kc-hero kc-section">
        <div className="kc-hero-badge">
          <div className="kc-hero-badge-dot" />
          AI-Powered Agriculture Platform — 2026
        </div>
        <h1 className="kc-hero-title">Grow Smarter.<br /><em>Harvest More.</em></h1>
        <span className="kc-hero-title-line2">For the Modern Farmer</span>
        <p className="kc-hero-desc">
          KrishiConnect delivers AI-driven crop insights, hyperlocal climate forecasting, and smart market access — empowering every farmer to maximise yields and build lasting prosperity.
        </p>
        <div className="kc-hero-btns">
          <a href="#" className="kc-btn-primary">Start for Free — No Card Needed</a>
          <a href="#features" className="kc-btn-outline" onClick={e => scrollToSection(e, 'features')}>Explore Features</a>
        </div>
        <div className="kc-hero-trust">
          <div className="kc-trust-item">
            <div className="kc-trust-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.5L7 1Z" fill="#2a8a52" /></svg>
            </div>
            Trusted by 50K+ Farmers
          </div>
          <div className="kc-trust-divider" />
          <div className="kc-trust-item">
            <div className="kc-trust-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#2a8a52" strokeWidth="1.5" /><path d="M7 4.5V7.5L9 9" stroke="#2a8a52" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            Real-Time AI Insights
          </div>
          <div className="kc-trust-divider" />
          <div className="kc-trust-item">
            <div className="kc-trust-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L5.5 6.5L7.5 8.5L12 3" stroke="#2a8a52" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            37% Avg. Yield Increase
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="kc-marquee-section">
        <div className="kc-marquee-inner">
          {[...marqueeItems, ...marqueeItems].map((text, i) => (
            <span className="kc-marquee-item" key={i}>
              <span className="kc-marquee-dot" />{text}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="kc-stats-section kc-section">
        <div className="kc-stats-grid">
          {[
            { num: '50', unit: 'K+', label: 'Farmers Empowered', delay: 0 },
            { num: '37', unit: '%', label: 'Average Yield Increase', delay: 120 },
            { num: '18', unit: '+', label: 'Indian States Covered', delay: 240 },
            { num: '12', unit: '+', label: 'Languages Supported', delay: 360 },
          ].map((s, i) => (
            <div className="kc-stat-card" data-reveal data-delay={s.delay} key={i}>
              <div className="kc-stat-num">{s.num}<span className="kc-stat-unit">{s.unit}</span></div>
              <div className="kc-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="kc-features-section kc-section" id="features">
        <div className="kc-container">
          <div className="kc-section-eyebrow">Platform Capabilities</div>
          <h2 className="kc-section-title">Intelligence at<br /><em>every level</em></h2>
          <p className="kc-section-sub">Four pillars of precision agriculture, unified in one seamless platform built for Indian farmers.</p>
          <div className="kc-features-grid">
            {[
              {
                num: '01', delay: 0,
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12C2 14.4 2.9 16.6 4.4 18.3L12 22L19.6 18.3C21.1 16.6 22 14.4 22 12C22 6.5 17.5 2 12 2Z" /><path d="M12 8V16M8 12H16" /></svg>,
                title: 'Crop Intelligence',
                desc: 'AI-driven soil analysis and microclimate modelling tailors every recommendation to the unique fingerprint of your land — from pH levels to crop rotation timing.',
              },
              {
                num: '02', delay: 100,
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15C3 15 5 10 9 10C13 10 11 14 15 14C19 14 21 9 21 9" /><path d="M3 19H21" /></svg>,
                title: 'Climate Foresight',
                desc: 'Hyperlocal weather intelligence beyond tomorrow — giving you strategic weeks of advance planning so no monsoon or dry spell ever catches you off guard.',
              },
              {
                num: '03', delay: 200,
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
                title: 'Market Oracle',
                desc: 'Real-time commodity pricing and demand signals so you harvest when margins peak. Connect directly with buyers across mandis and modern trade networks.',
              },
              {
                num: '04', delay: 300,
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20C4 17.8 7.6 16 12 16C16.4 16 20 17.8 20 20" /><path d="M18 2L19.5 3.5M20.5 5.5H22M18 9L19.5 7.5" /></svg>,
                title: 'AI Agronomist',
                desc: 'An expert advisor fluent in the language of soil, sun, and seed — available every hour of every season. Ask in Hindi, Tamil, Marathi, and 12+ languages.',
              },
            ].map((f, i) => (
              <div className="kc-feature-card" data-reveal data-delay={f.delay} key={i}>
                <span className="kc-feature-num">{f.num}</span>
                <div className="kc-feature-icon-wrap">{f.icon}</div>
                <h3 className="kc-feature-title">{f.title}</h3>
                <p className="kc-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="kc-quote-section kc-section">
        <div style={{ position: 'absolute', inset: 0 }}>
          <div className="kc-quote-decorative" style={{ width: 500, height: 500, top: '50%', left: '20%', transform: 'translate(-50%,-50%)' }} />
          <div className="kc-quote-decorative" style={{ width: 300, height: 300, top: '30%', left: '80%', transform: 'translate(-50%,-50%)' }} />
          <div className="kc-quote-decorative" style={{ width: 180, height: 180, top: '70%', left: '60%', transform: 'translate(-50%,-50%)' }} />
        </div>
        <div className="kc-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="kc-quote-text" data-reveal>
            "The farmer who feeds a nation should also be able to <em>command a fair price</em> for his labour. KrishiConnect makes that possible."
          </div>
          <div className="kc-quote-attr" data-reveal>Piyush Desai, Kharif Farmer, Nashik — 2026</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="kc-how-section kc-section" id="how">
        <div className="kc-container">
          <div className="kc-section-eyebrow">Simple Process</div>
          <h2 className="kc-section-title">Three steps to<br /><em>transformation</em></h2>
          <div className="kc-steps-grid">
            {[
              { num: '1', title: 'Connect Your Land', desc: 'Map your fields, input your soil profile, and link your local weather station in minutes. Works offline with sync when you\'re back online.', delay: 0 },
              { num: '2', title: 'Receive Insights', desc: 'Our models process thousands of variables — soil, climate, market data — to surface the decisions that matter most this season.', delay: 150 },
              { num: '3', title: 'Grow & Prosper', desc: 'Act on precise guidance and watch your yields, efficiency, and margins transform across each harvest cycle. Track your progress over time.', delay: 300 },
            ].map((s, i) => (
              <div className="kc-step-card" data-reveal data-delay={s.delay} key={i}>
                {i < 2 && <div className="kc-step-connector" />}
                <div className="kc-step-num-badge">{s.num}</div>
                <h3 className="kc-step-title">{s.title}</h3>
                <p className="kc-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="kc-testimonials-section kc-section" id="testimonials">
        <div className="kc-container">
          <div className="kc-section-eyebrow">Farmer Stories</div>
          <h2 className="kc-section-title">Voices from<br /><em>the field</em></h2>
          <div className="kc-testimonials-grid">
            {[
              {
                quote: '"I doubled my tomato yield in one season using the soil recommendations. The AI told me exactly when to irrigate and which fertiliser to use. It speaks Marathi so my whole family understands."',
                initials: 'RP', name: 'Ramesh Patil', role: 'Vegetable Farmer, Pune District',
                avatarBg: 'var(--green-700)', delay: 0,
              },
              {
                quote: '"The market price alerts saved me from selling my cotton at a loss. I waited three days after the KrishiConnect notification and got 18% more per quintal. Incredible tool."',
                initials: 'SK', name: 'Sunita Khanna', role: 'Cotton Farmer, Vidarbha',
                avatarBg: 'var(--green-600)', delay: 120,
              },
              {
                quote: '"Finally an app that understands our land. The 14-day weather forecast for my specific village helped me plan the entire rabi season. No more guessing. My father can\'t believe the difference."',
                initials: 'AM', name: 'Arjun Mehta', role: 'Wheat Farmer, Punjab',
                avatarBg: 'var(--green-500)', delay: 240,
              },
            ].map((t, i) => (
              <div className="kc-testimonial-card" data-reveal data-delay={t.delay} key={i}>
                <Stars />
                <p className="kc-testimonial-quote">{t.quote}</p>
                <div className="kc-testimonial-author">
                  <div className="kc-author-avatar" style={{ background: t.avatarBg }}>{t.initials}</div>
                  <div>
                    <div className="kc-author-name">{t.name}</div>
                    <div className="kc-author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="kc-cta-section kc-section">
        <div className="kc-cta-inner">
          <div className="kc-cta-ring kc-cta-ring-1" style={{ width: 600, height: 600, top: '50%', left: '15%' }} />
          <div className="kc-cta-ring kc-cta-ring-2" style={{ width: 380, height: 380, top: '20%', left: '80%' }} />
          <h2 className="kc-cta-title">
            Ready to transform<br />your <em>harvest?</em>
          </h2>
          <p className="kc-cta-sub">Join 50,000+ modern farmers leveraging AI to secure their season, their income, and their legacy.</p>
          <div className="kc-cta-btns">
            <a href="#" className="kc-btn-white">Create Free Account</a>
            <a href="#" className="kc-btn-ghost-white">Watch Demo</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="kc-footer">
        <div className="kc-footer-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 34, height: 34, background: 'var(--green-600)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C12 3 6 8 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 8 12 3 12 3Z" fill="rgba(255,255,255,0.9)" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#fff' }}>
                Krishi<em style={{ color: 'var(--green-400)', fontStyle: 'italic' }}>Connect</em>
              </span>
            </div>
            <p className="kc-footer-brand-desc">AI-powered agriculture intelligence for India's modern farmers. From soil to sale, we've got your season covered.</p>
          </div>
          <div>
            <div className="kc-footer-col-title">Platform</div>
            {['Crop Intelligence', 'Climate Foresight', 'Market Oracle', 'AI Agronomist'].map(l => (
              <a href="#" className="kc-footer-link" key={l}>{l}</a>
            ))}
          </div>
          <div>
            <div className="kc-footer-col-title">Company</div>
            {['About Us', 'Careers', 'Press Kit', 'Blog'].map(l => (
              <a href="#" className="kc-footer-link" key={l}>{l}</a>
            ))}
          </div>
          <div>
            <div className="kc-footer-col-title">Support</div>
            {['Help Centre', 'Community', 'Contact', 'Privacy Policy'].map(l => (
              <a href="#" className="kc-footer-link" key={l}>{l}</a>
            ))}
          </div>
        </div>
        <div className="kc-footer-bottom">
          <div>© 2026 KrishiConnect Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="kc-footer-bottom-links">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a href="#" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontSize: 13 }} key={l}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      <button
        className="kc-scroll-top"
        ref={scrollBtnRef}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15L12 9L6 15" />
        </svg>
      </button>
    </div>
  );
}