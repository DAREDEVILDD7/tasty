import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────────────────────────────────────── */
const fmt = (n) => `KD ${Number(n || 0).toFixed(3)}`;

const getRestIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("rest_id");
};

/* ─────────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────────── */
const Icon = {
  cart: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>),
  user: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  close: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  search: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  pin: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>),
  plus: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  minus: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  trash: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  star: (<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  check: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  truck: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>),
  clock: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  edit: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  home: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  work: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>),
  receipt: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
  whatsapp: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>),
};

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #f6f6f6;
      --surface: #ffffff;
      --surface2: #f6f6f6;
      --surface3: #ededed;
      --border: #e8e8e8;
      --text: #000000;
      --text2: #545454;
      --text3: #a0a0a0;
      --green: #06c167;
      --green-hover: #04a857;
      --green-light: #e6f9f0;
      --red: #e74c3c;
      --warning: #ff9f0a;
      --radius: 12px;
      --radius-sm: 8px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --shadow: 0 2px 12px rgba(0,0,0,0.08);
      --shadow-md: 0 4px 20px rgba(0,0,0,0.11);
      --shadow-lg: 0 8px 40px rgba(0,0,0,0.14);
      --transition: 0.18s cubic-bezier(0.4,0,0.2,1);
      --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --navbar-h: 60px;
    }

    html { scroll-behavior: smooth; }
    body { font-family: var(--font); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; min-height: 100vh; }
    button { font-family: var(--font); cursor: pointer; border: none; background: none; outline: none; }
    input, textarea { font-family: var(--font); outline: none; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
    @keyframes pop     { 0%,100% { transform:scale(1); } 50% { transform:scale(1.14); } }
    @keyframes pulse   { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
    @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

    .anim-fade  { animation: fadeUp  0.26s ease forwards; }
    .anim-scale { animation: scaleIn 0.2s ease forwards; }

    .skeleton {
      background: linear-gradient(90deg, #efefef 25%, #e4e4e4 50%, #efefef 75%);
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite;
      border-radius: var(--radius-sm);
    }

    .spinner {
      width: 32px; height: 32px;
      border: 2.5px solid var(--border);
      border-top-color: var(--green);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* Overlay */
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.52);
      backdrop-filter: blur(3px);
      z-index: 200;
      display: flex; align-items: flex-end; justify-content: center;
      animation: scaleIn 0.18s ease;
    }
    @media (min-width: 640px) { .overlay { align-items: center; } }

    /* Sheet */
    .sheet {
      background: var(--surface);
      width: 100%; max-width: 540px;
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      max-height: 94vh; overflow-y: auto; position: relative;
      animation: slideUp 0.28s cubic-bezier(0.34,1.4,0.64,1);
    }
    @media (min-width: 640px) { .sheet { border-radius: var(--radius-xl); max-height: 90vh; } }

    .sheet-handle {
      width: 40px; height: 4px; background: var(--border);
      border-radius: 99px; margin: 14px auto 0;
    }

    /* Navbar */
    .navbar {
      position: sticky; top: 0; z-index: 100;
      height: var(--navbar-h);
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .navbar-inner {
      width: 100%; max-width: 1240px; margin: 0 auto;
      padding: 0 16px; height: 100%;
      display: flex; align-items: center; gap: 10px;
    }

    /* Hero */
    .hero { position: relative; width: 100%; background: #111; overflow: hidden; height: 220px; }
    @media (min-width: 480px) { .hero { height: 260px; } }
    @media (min-width: 768px) { .hero { height: 300px; } }
    @media (min-width: 1080px) { .hero { height: 340px; } }
    .hero-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform 0.5s ease; }
    .hero:hover .hero-img { transform: scale(1.025); }
    .hero-gradient {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.08) 100%);
    }
    .hero-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 16px 20px; }
    @media (min-width: 480px) { .hero-content { padding: 20px 20px 24px; } }

    /* Page */
    .page-wrap {
      max-width: 1240px; margin: 0 auto;
      display: grid; grid-template-columns: 1fr;
      background: var(--bg);
    }
    @media (min-width: 1080px) {
      .page-wrap { grid-template-columns: 1fr 380px; gap: 28px; padding: 28px 24px 60px; align-items: start; }
    }

    .cart-sidebar { display: none; }
    @media (min-width: 1080px) {
      .cart-sidebar { display: block; position: sticky; top: calc(var(--navbar-h) + 20px); }
    }

    /* Category chips */
    .cat-row { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
    .cat-row::-webkit-scrollbar { display: none; }
    .cat-chip {
      flex-shrink: 0; font-size: 13px; font-weight: 600;
      padding: 7px 16px; border-radius: 99px;
      border: 1.5px solid var(--border); background: var(--surface); color: var(--text2);
      white-space: nowrap; transition: all var(--transition);
    }
    .cat-chip:hover:not(.active) { border-color: #bbb; color: var(--text); }
    .cat-chip.active { background: var(--text); color: #fff; border-color: var(--text); }

    /* ─── Menu Layout ─────────────────────────────────────────────────────────── */

    /* Default (mobile <480px): horizontal list rows, 1 column */
    .menu-grid { display: flex; flex-direction: column; }

    .menu-row {
      display: flex; flex-direction: row; align-items: center; gap: 12px;
      padding: 14px 0; border-bottom: 1px solid var(--border);
      cursor: pointer; background: transparent; position: relative;
      transition: background var(--transition);
    }
    .menu-row:last-child { border-bottom: none; }
    .menu-row:active { background: #f7f7f7; }

    .menu-thumb-card {
      width: 80px; height: 80px; flex-shrink: 0;
      border-radius: var(--radius); background: var(--surface3);
      overflow: hidden; position: relative;
      display: flex; align-items: center; justify-content: center;
    }
    .menu-thumb-card img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .menu-card-body {
      flex: 1; min-width: 0;
      display: flex; flex-direction: column; gap: 3px;
    }

    .menu-card-footer {
      display: flex; align-items: center; justify-content: space-between; margin-top: 5px;
    }

    /* Action col always hidden on mobile list */
    .menu-row-action { display: none; }

    /* Mid tablet (480px-767px): 2-column vertical cards */
    @media (min-width: 480px) and (max-width: 767px) {
      .menu-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      }
      .menu-row {
        flex-direction: column; align-items: stretch; gap: 0;
        padding: 0; border-bottom: none;
        border-radius: var(--radius); border: 1px solid var(--border);
        background: var(--surface); overflow: hidden;
      }
      .menu-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }
      .menu-row:active { transform: scale(0.98); background: var(--surface); }
      .menu-thumb-card {
        width: 100%; height: 130px; border-radius: 0; flex-shrink: 0;
      }
      .menu-card-body { padding: 10px 11px 12px; gap: 4px; }
      .menu-card-footer { margin-top: 8px; }
    }

    /* Wide tablet / desktop (768px+): list rows with action column */
    @media (min-width: 768px) {
      .menu-grid { display: flex; flex-direction: column; }
      .menu-row {
        flex-direction: row; align-items: center; gap: 16px;
        padding: 15px 0; border-bottom: 1px solid var(--border);
        border-radius: 0; border: none; background: transparent;
      }
      .menu-row:last-child { border-bottom: none; }
      .menu-row:active { background: #fafafa; }
      .menu-thumb-card { width: 96px; height: 96px; border-radius: var(--radius); flex-shrink: 0; }
      .menu-card-body { padding: 0; }
      .menu-card-footer { display: none; }
      .menu-row-action { display: flex; align-items: center; flex-shrink: 0; }
    }

    /* Add button */
    .add-btn {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--text); border: none; color: #fff; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all var(--transition);
    }
    .add-btn:hover { background: #333; transform: scale(1.08); }
    .add-btn svg { width: 15px; height: 15px; }

    /* Cart stepper — card footer on mobile/2-col */
    .card-qty-row {
      display: inline-flex; align-items: center;
      background: var(--text); border-radius: 99px; overflow: hidden;
    }
    .card-qty-btn {
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; transition: background var(--transition);
    }
    .card-qty-btn:hover { background: rgba(255,255,255,0.18); }
    .card-qty-btn svg { width: 12px; height: 12px; }
    .card-qty-num { font-size: 13px; font-weight: 800; min-width: 22px; text-align: center; color: #fff; }

    /* Qty row — action col on desktop, modals */
    .qty-row {
      display: inline-flex; align-items: center;
      border: 1.5px solid var(--border); border-radius: 99px; overflow: hidden;
    }
    .qty-btn {
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      transition: background var(--transition); color: var(--text);
    }
    .qty-btn:hover { background: var(--surface2); }
    .qty-btn svg { width: 14px; height: 14px; }
    .qty-num { font-size: 14px; font-weight: 700; min-width: 28px; text-align: center; }

    /* Buttons */
    .btn-primary {
      background: var(--green); color: #fff;
      font-size: 15px; font-weight: 700;
      padding: 14px 24px; border-radius: var(--radius);
      transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
      display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
    }
    .btn-primary:hover { background: var(--green-hover); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(6,193,103,0.35); }
    .btn-primary:active { transform: none; box-shadow: none; }
    .btn-primary:disabled { background: var(--border); color: var(--text3); cursor: not-allowed; transform: none; box-shadow: none; }

    .btn-ghost {
      border: 1.5px solid var(--border); color: var(--text);
      font-size: 13px; font-weight: 600; padding: 8px 16px;
      border-radius: var(--radius-sm);
      transition: all var(--transition);
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--surface);
    }
    .btn-ghost:hover { border-color: var(--text); background: var(--surface2); }

    /* Inputs */
    .input-field {
      width: 100%; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      padding: 12px 14px; font-size: 14px; color: var(--text); background: var(--surface);
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .input-field::placeholder { color: var(--text3); }
    .input-field:focus { border-color: var(--text); box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }

    .form-label {
      font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
      text-transform: uppercase; color: var(--text3); margin-bottom: 6px; display: block;
    }

    /* Tabs */
    .tab-btn {
      font-size: 14px; font-weight: 600; color: var(--text3);
      padding: 10px 2px; border-bottom: 2.5px solid transparent;
      transition: all var(--transition); white-space: nowrap;
    }
    .tab-btn.active { color: var(--text); border-bottom-color: var(--text); }
    .tab-btn:hover:not(.active) { color: var(--text2); }

    /* Badge */
    .badge {
      background: var(--green); color: #fff; font-size: 10px; font-weight: 800;
      border-radius: 99px; min-width: 18px; height: 18px;
      display: flex; align-items: center; justify-content: center; padding: 0 5px;
      animation: pop 0.22s ease;
    }

    /* Pill */
    .pill {
      display: inline-flex; align-items: center; gap: 3px;
      font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
      text-transform: uppercase; padding: 3px 7px; border-radius: 99px;
    }

    /* Variant option */
    .var-opt {
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      padding: 11px 14px; display: flex; align-items: center; justify-content: space-between;
      cursor: pointer; transition: all var(--transition); font-size: 14px;
    }
    .var-opt.sel { border-color: var(--text); background: #f7f7f7; }
    .var-opt:hover:not(.sel) { border-color: #ccc; }

    /* Address card */
    .addr-card {
      border: 1.5px solid var(--border); border-radius: var(--radius);
      padding: 14px 16px; cursor: pointer; transition: all var(--transition);
    }
    .addr-card.sel { border-color: var(--text); background: #fafafa; }
    .addr-card:hover:not(.sel) { border-color: #bbb; }

    /* Payment option */
    .pay-opt {
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 4px;
      cursor: pointer; flex: 1; transition: all var(--transition);
      font-size: 12px; font-weight: 600;
    }
    .pay-opt.sel { border-color: var(--text); background: #fafafa; }
    .pay-opt:hover:not(.sel) { border-color: #bbb; }

    /* Order track */
    .track-dot {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 14px; font-weight: 700; transition: all 0.35s ease;
    }
    .track-dot.done   { background: var(--green); color: #fff; }
    .track-dot.active { background: var(--text); color: #fff; animation: pulse 1.6s infinite; }
    .track-dot.pending{ background: var(--surface3); color: var(--text3); }
    .track-line { width: 2px; height: 26px; margin-left: 17px; border-radius: 99px; background: var(--border); transition: background 0.4s ease; }
    .track-line.done  { background: var(--green); }

    /* Toast */
    .toast {
      position: fixed; bottom: 88px; left: 50%; transform: translateX(-50%);
      background: var(--text); color: #fff;
      padding: 10px 22px; border-radius: 99px;
      font-size: 13px; font-weight: 600; z-index: 9999; white-space: nowrap;
      animation: toastIn 0.22s ease; box-shadow: var(--shadow-md);
    }
    @media (min-width: 1080px) { .toast { bottom: 28px; } }

    /* Mobile cart bar */
    .mobile-cart-bar {
      display: flex; position: fixed; bottom: 0; left: 0; right: 0;
      background: var(--text); color: #fff;
      padding: 14px 20px;
      padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
      align-items: center; justify-content: space-between;
      z-index: 150; cursor: pointer; transition: background var(--transition);
      box-shadow: 0 -2px 16px rgba(0,0,0,0.15);
    }
    .mobile-cart-bar:hover { background: #222; }
    @media (min-width: 1080px) { .mobile-cart-bar { display: none; } }

    /* Search */
    .search-wrap { position: relative; }
    .search-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      width: 15px; height: 15px; color: var(--text3); pointer-events: none;
    }
    .search-input {
      width: 100%; background: var(--surface3); border: 1.5px solid transparent;
      border-radius: 99px; padding: 11px 38px 11px 40px;
      font-size: 14px; color: var(--text); transition: all var(--transition);
    }
    .search-input::placeholder { color: var(--text3); }
    .search-input:focus { background: var(--surface); border-color: var(--border); outline: none; box-shadow: 0 0 0 3px rgba(0,0,0,0.04); }

    /* Price: tablet-only inline price hidden on mobile, card-footer hidden on tablet */
    /* Price visibility toggle by breakpoint */
    .tablet-price { display: none; }
    /* Mobile list (<480px): footer shows price, tablet-price hidden */
    /* 2-col cards (480-767px): footer shows price, tablet-price hidden */
    /* List rows (768px+): tablet-price visible, footer hidden */
    @media (min-width: 768px) {
      .tablet-price { display: block; }
      .menu-card-footer { display: none !important; }
    }

    .section-title { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; }

    .info-chip {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.88);
      white-space: nowrap;
    }
    .info-chip svg { width: 12px; height: 12px; flex-shrink: 0; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MINOR COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
const Toast = ({ message }) => message ? <div className="toast">{message}</div> : null;

const LoadingScreen = () => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", gap:16 }}>
    <div className="spinner" />
    <p style={{ fontSize:13, color:"var(--text3)", fontWeight:500 }}>Loading menu…</p>
  </div>
);

const ErrorScreen = ({ message }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", gap:12, padding:24, textAlign:"center" }}>
    <div style={{ fontSize:52 }}>🍽️</div>
    <h2 style={{ fontSize:22, fontWeight:800 }}>Restaurant not found</h2>
    <p style={{ color:"var(--text2)", fontSize:14, maxWidth:300 }}>{message || "Please check the link and try again."}</p>
  </div>
);

const SkeletonRow = () => (
  <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
      <div className="skeleton" style={{ height:14, width:"50%", borderRadius:4 }} />
      <div className="skeleton" style={{ height:12, width:"80%", borderRadius:4 }} />
      <div className="skeleton" style={{ height:13, width:"25%", borderRadius:4 }} />
    </div>
    <div className="skeleton" style={{ width:90, height:90, borderRadius:"var(--radius)", flexShrink:0 }} />
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MENU ITEM MODAL
───────────────────────────────────────────────────────────────────────────── */
const MenuItemModal = ({ item, onClose, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [variantGroups, setVariantGroups] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [vgRes, aoRes] = await Promise.all([
          supabase.from("Variant_Groups").select("*, Variant_Options(*)").eq("menu_id", item.id),
          supabase.from("Add_Ons").select("*").eq("rest_id", item.rest_id),
        ]);
        setVariantGroups(vgRes.data || []);
        setAddOns(aoRes.data || []);
        const defaults = {};
        (vgRes.data || []).forEach(g => {
          if (g.is_required && !g.is_multiple && g["Variant_Options"]?.length)
            defaults[g.id] = g["Variant_Options"][0].id;
        });
        setSelectedVariants(defaults);
      } catch {/* silent */} finally { setLoading(false); }
    };
    fetchExtras();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [item.id, item.rest_id]);

  const toggleVariant = (groupId, optionId, isMultiple) => {
    if (isMultiple) {
      setSelectedVariants(prev => {
        const cur = Array.isArray(prev[groupId]) ? prev[groupId] : [];
        return { ...prev, [groupId]: cur.includes(optionId) ? cur.filter(x => x !== optionId) : [...cur, optionId] };
      });
    } else {
      setSelectedVariants(prev => ({ ...prev, [groupId]: optionId }));
    }
  };

  const toggleAddOn = id => setSelectedAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const calcExtra = () => {
    let extra = 0;
    variantGroups.forEach(g => {
      const allOpts = g["Variant_Options"] || [];
      const sel = selectedVariants[g.id];
      if (Array.isArray(sel)) sel.forEach(sid => { const o = allOpts.find(x => x.id === sid); if (o) extra += Number(o.price_adj); });
      else if (sel) { const o = allOpts.find(x => x.id === sel); if (o) extra += Number(o.price_adj); }
    });
    addOns.forEach(a => { if (selectedAddOns.includes(a.id)) extra += Number(a.price); });
    return extra;
  };

  const unitPrice = Number(item.price) + calcExtra();
  const total = unitPrice * qty;
  const canAdd = () => variantGroups.every(g => {
    if (!g.is_required) return true;
    const sel = selectedVariants[g.id];
    return g.is_multiple ? (Array.isArray(sel) && sel.length > 0) : !!sel;
  });
  const handleAdd = () => { if (!canAdd()) return; onAddToCart({ item, qty, selectedVariants, selectedAddOns, unitPrice, note }); onClose(); };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ margin:"12px 16px 0", borderRadius:"var(--radius)", overflow:"hidden", height:210, background:"var(--surface3)", position:"relative" }}>
          {item.image_path
            ? <img src={item.image_path} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { e.target.style.display="none"; }} />
            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:60 }}>🍽️</div>
          }
          {item.recommended && <span className="pill" style={{ position:"absolute", top:10, left:10, background:"#fff8e1", color:"#e65100" }}>⭐ Popular</span>}
        </div>

        <div style={{ padding:"20px 20px 36px" }}>
          <h2 style={{ fontSize:22, fontWeight:800, marginBottom:5, letterSpacing:"-0.4px" }}>{item.name}</h2>
          {item.description && <p style={{ color:"var(--text2)", fontSize:14, lineHeight:1.65, marginBottom:10 }}>{item.description}</p>}
          <p style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>{fmt(item.price)}</p>

          {loading
            ? <div style={{ display:"flex", justifyContent:"center", padding:"28px 0" }}><div className="spinner" /></div>
            : <>
                {variantGroups.map(g => (
                  <div key={g.id} style={{ marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                      <p style={{ fontWeight:700, fontSize:14 }}>{g.name}</p>
                      {g.is_required && <span className="pill" style={{ background:"#f0f0f0", color:"var(--text2)" }}>Required</span>}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {(g["Variant_Options"] || []).map(opt => {
                        const sel = selectedVariants[g.id];
                        const isSel = g.is_multiple ? (Array.isArray(sel) && sel.includes(opt.id)) : sel === opt.id;
                        return (
                          <div key={opt.id} className={`var-opt${isSel ? " sel" : ""}`} onClick={() => toggleVariant(g.id, opt.id, g.is_multiple)}>
                            <span style={{ fontWeight: isSel ? 600 : 400 }}>{opt.name}</span>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              {Number(opt.price_adj) !== 0 && <span style={{ fontSize:13, color:"var(--text2)", fontWeight:600 }}>+{fmt(opt.price_adj)}</span>}
                              <div style={{ width:20, height:20, borderRadius: g.is_multiple ? 4 : "50%", border:`2px solid ${isSel?"var(--text)":"var(--border)"}`, background:isSel?"var(--text)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all var(--transition)", flexShrink:0 }}>
                                {isSel && <span style={{ color:"#fff", width:12, height:12 }}>{Icon.check}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {addOns.length > 0 && (
                  <div style={{ marginBottom:20 }}>
                    <p style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Add-ons</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {addOns.map(ao => {
                        const isSel = selectedAddOns.includes(ao.id);
                        return (
                          <div key={ao.id} className={`var-opt${isSel ? " sel" : ""}`} onClick={() => toggleAddOn(ao.id)}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              {ao.is_required && <span className="pill" style={{ background:"#f0f0f0", color:"var(--text2)" }}>Required</span>}
                              <span style={{ fontWeight: isSel ? 600 : 400 }}>{ao.name}</span>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              {Number(ao.price) > 0 && <span style={{ fontSize:13, color:"var(--text2)", fontWeight:600 }}>+{fmt(ao.price)}</span>}
                              <div style={{ width:20, height:20, borderRadius:4, border:`2px solid ${isSel?"var(--text)":"var(--border)"}`, background:isSel?"var(--text)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all var(--transition)", flexShrink:0 }}>
                                {isSel && <span style={{ color:"#fff", width:12, height:12 }}>{Icon.check}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom:24 }}>
                  <label className="form-label">Special instructions (optional)</label>
                  <textarea className="input-field" placeholder="E.g. no onions, extra sauce…" rows={2} style={{ resize:"none" }} value={note} onChange={e => setNote(e.target.value)} />
                </div>
              </>
          }

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div className="qty-row">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}>{Icon.minus}</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q+1)}>{Icon.plus}</button>
            </div>
            <button className="btn-primary" style={{ flex:1, opacity:canAdd()?1:0.45 }} onClick={handleAdd} disabled={!canAdd()}>
              Add to order · {fmt(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CART PANEL
───────────────────────────────────────────────────────────────────────────── */
const CartPanel = ({ cart, restaurant, onUpdateQty, onCheckout, isModal, onClose }) => {
  const [promoCode, setPromoCode] = useState("");
  const itemTotal = cart.reduce((s,c) => s + c.unitPrice * c.qty, 0);
  const deliveryFee = itemTotal > 0 ? 0.500 : 0;
  const vat = itemTotal * 0.05;
  const total = itemTotal + deliveryFee + vat;

  const content = (
    <div style={{ padding: isModal ? "20px 20px 36px" : "16px 20px 24px" }}>
      {isModal && (
        <>
          <div className="sheet-handle" style={{ marginBottom:0 }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, marginTop:16 }}>
            <h2 style={{ fontSize:20, fontWeight:800 }}>Your order</h2>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ width:16, height:16 }}>{Icon.close}</span>
            </button>
          </div>
        </>
      )}
      {!isModal && (
        <div style={{ paddingBottom:14, borderBottom:"1px solid var(--border)", marginBottom:16 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:2 }}>{restaurant?.name}</p>
          <h3 style={{ fontSize:18, fontWeight:800 }}>Your order</h3>
        </div>
      )}

      {cart.length === 0 ? (
        <div style={{ textAlign:"center", padding:"44px 0" }}>
          <div style={{ fontSize:44, marginBottom:12 }}>🛒</div>
          <p style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Your cart is empty</p>
          <p style={{ color:"var(--text3)", fontSize:13 }}>Add items to get started</p>
        </div>
      ) : (
        <>
          {cart.map((c, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:14, borderBottom:"1px solid var(--border)", marginBottom:14 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{c.item.name}</p>
                {c.note && <p style={{ fontSize:12, color:"var(--text3)", marginBottom:3, fontStyle:"italic" }}>"{c.note}"</p>}
                <p style={{ fontSize:13, color:"var(--text2)", fontWeight:700 }}>{fmt(c.unitPrice)}</p>
              </div>
              <div className="qty-row" style={{ flexShrink:0 }}>
                <button className="qty-btn" onClick={() => onUpdateQty(i, c.qty-1)}>
                  {c.qty === 1 ? <span style={{ width:14, height:14 }}>{Icon.trash}</span> : Icon.minus}
                </button>
                <span className="qty-num">{c.qty}</span>
                <button className="qty-btn" onClick={() => onUpdateQty(i, c.qty+1)}>{Icon.plus}</button>
              </div>
            </div>
          ))}

          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            <input className="input-field" placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} style={{ flex:1, borderRadius:99, padding:"9px 16px", fontSize:13 }} />
            <button className="btn-ghost" style={{ borderRadius:99, whiteSpace:"nowrap", padding:"9px 18px" }}>Apply</button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:7, paddingBottom:14, borderBottom:"1px solid var(--border)", marginBottom:14 }}>
            {[["Subtotal", fmt(itemTotal)],["Delivery fee", fmt(deliveryFee)],["VAT (5%)", fmt(vat)]].map(([label, val]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text2)" }}>
                <span>{label}</span><span style={{ fontWeight:500 }}>{val}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:800, color:"var(--text)", marginTop:4 }}>
              <span>Total</span><span>{fmt(total)}</span>
            </div>
          </div>

          {restaurant?.min_order && itemTotal < restaurant.min_order && (
            <div style={{ background:"#fff8e1", border:"1px solid #ffe082", borderRadius:"var(--radius-sm)", padding:"10px 14px", marginBottom:14, fontSize:13, color:"#e65100", fontWeight:500 }}>
              ⚠️ Min. order {fmt(restaurant.min_order)} · add {fmt(restaurant.min_order - itemTotal)} more
            </div>
          )}

          <button className="btn-primary" onClick={() => onCheckout(total)} disabled={!!(restaurant?.min_order && itemTotal < restaurant.min_order)}>
            Go to checkout · {fmt(total)}
          </button>
        </>
      )}
    </div>
  );

  if (isModal) return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>{content}</div>
    </div>
  );

  return (
    <div style={{ background:"var(--surface)", borderRadius:"var(--radius-lg)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
      {content}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CHECKOUT MODAL
───────────────────────────────────────────────────────────────────────────── */
const CheckoutModal = ({ total, restaurant, addresses, defaultAddr, onClose, onPlaceOrder, onAddAddress }) => {
  const [selectedAddr, setSelectedAddr] = useState(defaultAddr?.id || null);
  const [payMethod, setPayMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);

  const addr = addresses.find(a => a.id === selectedAddr);
  const handlePlace = async () => {
    if (!addr && restaurant) return alert("Please select a delivery address.");
    setPlacing(true);
    await onPlaceOrder({ address:addr, payMethod, notes });
    setPlacing(false);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ padding:"16px 20px 36px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
            <h2 style={{ fontSize:20, fontWeight:800 }}>Checkout</h2>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ width:16, height:16 }}>{Icon.close}</span>
            </button>
          </div>

          <div style={{ marginBottom:22 }}>
            <label className="form-label">Delivery address</label>
            {addresses.length === 0
              ? <button className="btn-ghost" style={{ width:"100%", justifyContent:"center" }} onClick={onAddAddress}>
                  <span style={{ width:16, height:16 }}>{Icon.plus}</span> Add address
                </button>
              : <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {addresses.map(a => (
                    <div key={a.id} className={`addr-card${selectedAddr===a.id?" sel":""}`} onClick={() => setSelectedAddr(a.id)}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span style={{ width:14, height:14, color:"var(--text2)" }}>{a.label==="Work"?Icon.work:Icon.home}</span>
                        <span style={{ fontWeight:700, fontSize:14 }}>{a.label}</span>
                        {selectedAddr===a.id && <span style={{ marginLeft:"auto", width:18, height:18, color:"var(--green)" }}>{Icon.check}</span>}
                      </div>
                      <p style={{ fontSize:13, color:"var(--text2)", paddingLeft:22 }}>
                        {[a.apartment_no&&`Apt ${a.apartment_no}`,a.floor&&`Floor ${a.floor}`,a.bldg_name,a.street,a.block].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  ))}
                  <button className="btn-ghost" style={{ justifyContent:"center" }} onClick={onAddAddress}>
                    <span style={{ width:14, height:14 }}>{Icon.plus}</span> Add new address
                  </button>
                </div>
            }
          </div>

          <div style={{ marginBottom:22 }}>
            <label className="form-label">Payment method</label>
            <div style={{ display:"flex", gap:8 }}>
              {[["Cash","💵"],["Card","💳"],["Online","📱"]].map(([m,emoji]) => (
                <div key={m} className={`pay-opt${payMethod===m?" sel":""}`} onClick={() => setPayMethod(m)}>
                  <span style={{ fontSize:22 }}>{emoji}</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:22 }}>
            <label className="form-label">Order notes (optional)</label>
            <textarea className="input-field" placeholder="Any requests for the restaurant?" rows={2} style={{ resize:"none" }} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <div style={{ background:"var(--surface2)", borderRadius:"var(--radius-sm)", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <span style={{ fontWeight:600, fontSize:14 }}>Total to pay</span>
            <span style={{ fontWeight:800, fontSize:18 }}>{fmt(total)}</span>
          </div>

          <button className="btn-primary" style={{ height:52 }} onClick={handlePlace} disabled={placing || !selectedAddr}>
            {placing ? <div className="spinner" style={{ width:22, height:22, borderWidth:2, borderTopColor:"#fff" }} /> : `Place order · ${fmt(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ORDER TRACK MODAL
───────────────────────────────────────────────────────────────────────────── */
const OrderTrackModal = ({ order, restaurant, address, onClose }) => {
  const steps = [
    { label:"Order placed!", emoji:"✅" },
    { label:"Waiting for restaurant to accept", emoji:"🍽️" },
    { label:"Your food is being prepared", emoji:"👨‍🍳" },
    { label:"On the way to you!", emoji:"🛵" },
  ];
  const currentStep = order?.status==="accepted"?2:order?.status==="preparing"?3:order?.status==="on_the_way"?4:1;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ padding:"16px 20px 36px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
            <h2 style={{ fontSize:20, fontWeight:800 }}>Track order</h2>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ width:16, height:16 }}>{Icon.close}</span>
            </button>
          </div>
          <p style={{ fontSize:13, color:"var(--text3)", fontWeight:500, marginBottom:24 }}>Order #{order?.id}</p>

          <div style={{ marginBottom:24 }}>
            {steps.map((s,i) => {
              const n=i+1, isDone=n<currentStep, isActive=n===currentStep;
              return (
                <div key={i}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, padding:"8px 0" }}>
                    <div className={`track-dot ${isDone?"done":isActive?"active":"pending"}`}>
                      {isDone ? <span style={{ width:16, height:16 }}>{Icon.check}</span> : <span>{isActive?s.emoji:n}</span>}
                    </div>
                    <p style={{ fontWeight:isActive?700:400, color:isDone||isActive?"var(--text)":"var(--text3)", fontSize:14, transition:"all 0.3s" }}>{s.label}</p>
                  </div>
                  {i < steps.length-1 && <div className={`track-line${isDone?" done":""}`} />}
                </div>
              );
            })}
          </div>

          {restaurant?.ph_no && (
            <a href={`https://wa.me/${restaurant.ph_no.replace(/\D/g,"")}?text=Hi! My order ID is %23${order?.id}. Can you give me an update?`}
              target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", padding:"14px 20px", background:"#25D366", color:"#fff", borderRadius:"var(--radius)", fontWeight:700, fontSize:15, textDecoration:"none", marginBottom:16 }}>
              <span style={{ width:20, height:20 }}>{Icon.whatsapp}</span>
              Get updates on WhatsApp
            </a>
          )}

          <div style={{ background:"var(--surface2)", borderRadius:"var(--radius)", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🏪</span>
              <div>
                <p style={{ fontWeight:700, fontSize:13 }}>{restaurant?.name}{restaurant?.branch_name?`, ${restaurant.branch_name}`:""}</p>
                {restaurant?.address && <p style={{ fontSize:12, color:"var(--text3)" }}>{restaurant.address}</p>}
              </div>
            </div>
            {address && (
              <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <span style={{ fontSize:16 }}>📍</span>
                <p style={{ fontSize:12, color:"var(--text2)" }}>{[address.apartment_no&&`Apt ${address.apartment_no}`,address.street,address.block].filter(Boolean).join(", ")}</p>
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🕒</span>
              <p style={{ fontSize:12, color:"var(--text2)" }}>Placed {new Date().toLocaleString([],{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"short"})}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROFILE MODAL
───────────────────────────────────────────────────────────────────────────── */
const ProfileModal = ({ customer, addresses, onClose, onSaveProfile, onSaveAddress, onDeleteAddress, onSetDefault, defaultAddrId }) => {
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState({ cust_name:customer?.cust_name||"", ph_num:customer?.ph_num||"" });
  const [editAddr, setEditAddr] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [addrForm, setAddrForm] = useState({ label:"Home", street:"", block:"", bldg_name:"", apartment_no:"", floor:"", landmark:"", note:"" });
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => { setSaving(true); await onSaveProfile(form); setSaving(false); };
  const startEditAddr = addr => {
    setEditAddr(addr?.id||null);
    setAddrForm({ label:addr?.label||"Home", street:addr?.street||"", block:addr?.block||"", bldg_name:addr?.bldg_name||"", apartment_no:addr?.apartment_no||"", floor:addr?.floor||"", landmark:addr?.landmark||"", note:addr?.note||"" });
    setAddingNew(!addr);
  };
  const handleSaveAddr = async () => { setSaving(true); await onSaveAddress({ ...addrForm, id:editAddr }); setEditAddr(null); setAddingNew(false); setSaving(false); };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ padding:"16px 20px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <h2 style={{ fontSize:20, fontWeight:800 }}>My profile</h2>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ width:16, height:16 }}>{Icon.close}</span>
            </button>
          </div>
          <div style={{ display:"flex", gap:24, borderBottom:"1.5px solid var(--border)", marginBottom:20 }}>
            {[{key:"info",label:"Profile"},{key:"addresses",label:"Addresses"},{key:"orders",label:"Orders"}].map(t => (
              <button key={t.key} className={`tab-btn${tab===t.key?" active":""}`} onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:"0 20px 36px" }}>
          {tab === "info" && (
            <div className="anim-fade" style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, paddingBottom:16, borderBottom:"1px solid var(--border)" }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ width:24, height:24, color:"var(--text2)" }}>{Icon.user}</span>
                </div>
                <div>
                  <p style={{ fontWeight:700, fontSize:16 }}>{form.cust_name||"Your Name"}</p>
                  <p style={{ fontSize:13, color:"var(--text3)" }}>{form.ph_num||"Add phone number"}</p>
                </div>
              </div>
              <div>
                <label className="form-label">Full name</label>
                <input className="input-field" placeholder="Enter your name" value={form.cust_name} onChange={e => setForm({...form, cust_name:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Phone number</label>
                <input className="input-field" placeholder="+965 0000 0000" value={form.ph_num} onChange={e => setForm({...form, ph_num:e.target.value})} />
              </div>
              <button className="btn-primary" onClick={handleSaveProfile} disabled={saving}>
                {saving ? <div className="spinner" style={{ width:20, height:20, borderWidth:2, borderTopColor:"#fff" }} /> : "Save profile"}
              </button>
            </div>
          )}

          {tab === "addresses" && (
            <div className="anim-fade">
              {(editAddr !== null || addingNew) ? (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <button className="btn-ghost" style={{ padding:"6px 12px", fontSize:12 }} onClick={() => { setEditAddr(null); setAddingNew(false); }}>← Back</button>
                    <span style={{ fontWeight:700, fontSize:15 }}>{addingNew?"New address":"Edit address"}</span>
                  </div>
                  <div>
                    <label className="form-label">Label</label>
                    <div style={{ display:"flex", gap:8 }}>
                      {["Home","Work","Other"].map(l => (
                        <button key={l} onClick={() => setAddrForm({...addrForm,label:l})} style={{ flex:1, padding:"9px 0", borderRadius:"var(--radius-sm)", border:`1.5px solid ${addrForm.label===l?"var(--text)":"var(--border)"}`, background:addrForm.label===l?"#fafafa":"var(--surface)", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all var(--transition)" }}>
                          {l==="Home"?"🏠":l==="Work"?"🏢":"📍"} {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {[{field:"street",label:"Street"},{field:"block",label:"Block"},{field:"bldg_name",label:"Building name"},{field:"apartment_no",label:"Apartment no.",type:"number"},{field:"floor",label:"Floor",type:"number"},{field:"landmark",label:"Landmark (optional)"},{field:"note",label:"Delivery note (optional)"}].map(({field,label,type}) => (
                    <div key={field}>
                      <label className="form-label">{label}</label>
                      <input className="input-field" type={type||"text"} placeholder={label} value={addrForm[field]} onChange={e => setAddrForm({...addrForm,[field]:e.target.value})} />
                    </div>
                  ))}
                  <button className="btn-primary" onClick={handleSaveAddr} disabled={saving||!addrForm.street||!addrForm.block}>
                    {saving ? <div className="spinner" style={{ width:20, height:20, borderWidth:2, borderTopColor:"#fff" }} /> : "Save address"}
                  </button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {addresses.length === 0
                    ? <div style={{ textAlign:"center", padding:"32px 0" }}>
                        <div style={{ fontSize:40, marginBottom:10 }}>📍</div>
                        <p style={{ color:"var(--text2)", fontSize:14 }}>No addresses saved yet</p>
                      </div>
                    : addresses.map(a => (
                        <div key={a.id} className="addr-card" style={{ borderColor:a.id===defaultAddrId?"var(--text)":"var(--border)", background:a.id===defaultAddrId?"#fafafa":"var(--surface)" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                            <span style={{ fontSize:15 }}>{a.label==="Work"?"🏢":a.label==="Home"?"🏠":"📍"}</span>
                            <span style={{ fontWeight:700, fontSize:14 }}>{a.label}</span>
                            {a.id===defaultAddrId && <span className="pill" style={{ marginLeft:4, background:"var(--green-light)", color:"var(--green)" }}>Default</span>}
                          </div>
                          <p style={{ fontSize:13, color:"var(--text2)", marginBottom:10, paddingLeft:23 }}>
                            {[a.apartment_no&&`Apt ${a.apartment_no}`,a.floor&&`Floor ${a.floor}`,a.bldg_name,a.street,a.block].filter(Boolean).join(", ")}
                          </p>
                          <div style={{ display:"flex", gap:8, paddingLeft:23 }}>
                            <button className="btn-ghost" style={{ fontSize:12, padding:"5px 12px" }} onClick={() => startEditAddr(a)}>
                              <span style={{ width:12, height:12 }}>{Icon.edit}</span> Edit
                            </button>
                            {a.id !== defaultAddrId && (
                              <button className="btn-ghost" style={{ fontSize:12, padding:"5px 12px" }} onClick={() => onSetDefault(a.id)}>
                                <span style={{ width:12, height:12 }}>{Icon.star}</span> Default
                              </button>
                            )}
                            <button className="btn-ghost" style={{ fontSize:12, padding:"5px 12px", color:"var(--red)", borderColor:"var(--red)" }} onClick={() => onDeleteAddress(a.id)}>
                              <span style={{ width:12, height:12 }}>{Icon.trash}</span>
                            </button>
                          </div>
                        </div>
                      ))
                  }
                  <button className="btn-ghost" style={{ justifyContent:"center" }} onClick={() => startEditAddr(null)}>
                    <span style={{ width:14, height:14 }}>{Icon.plus}</span> Add new address
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="anim-fade" style={{ textAlign:"center", padding:"44px 0" }}>
              <div style={{ fontSize:44, marginBottom:12 }}>📋</div>
              <p style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No orders yet</p>
              <p style={{ color:"var(--text3)", fontSize:13 }}>Your order history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN CUSTOMER COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Customer() {
  const restId = getRestIdFromUrl();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddrId, setDefaultAddrId] = useState(null);

  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [toast, setToast] = useState("");

  // Ensure viewport meta is set for proper mobile scaling
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
  }, []);

  const CUST_KEY = "food_order_cust_id";
  const showToast = useCallback(msg => { setToast(msg); setTimeout(() => setToast(""), 2500); }, []);

  useEffect(() => {
    if (!restId) { setError("No restaurant ID in URL. Expected: /customer?rest_id=<id>"); setLoading(false); return; }
    const load = async () => {
      try {
        const [restRes, catRes, menuRes] = await Promise.all([
          supabase.from("Restaurants").select("*").eq("id", restId).single(),
          supabase.from("Categories").select("*").eq("rest_id", restId).eq("visible", true).order("sort_order"),
          supabase.from("Menu").select("*").eq("rest_id", restId).eq("visible", true).order("sort_order"),
        ]);
        if (restRes.error || !restRes.data) throw new Error("Restaurant not found");
        setRestaurant(restRes.data);
        setCategories(catRes.data || []);
        setMenuItems((menuRes.data || []).filter(m => m.is_available));
      } catch (e) { setError(e.message); } finally { setLoading(false); }
    };
    load();
  }, [restId]);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const storedId = localStorage.getItem(CUST_KEY);
        if (storedId) {
          const { data } = await supabase.from("Customer").select("*").eq("id", storedId).single();
          if (data) { setCustomer(data); loadAddresses(data.id); return; }
        }
        const { data: newCust } = await supabase.from("Customer").insert({ cust_name:"", broadcast:false }).select().single();
        if (newCust) { localStorage.setItem(CUST_KEY, newCust.id); setCustomer(newCust); }
      } catch {/* silent */}
    };
    loadCustomer();
  }, []);

  const loadAddresses = async custId => {
    const { data } = await supabase.from("Customer_Address").select("*").eq("cust_id", custId);
    if (data) {
      setAddresses(data);
      const stored = localStorage.getItem(`default_addr_${custId}`);
      setDefaultAddrId(stored ? Number(stored) : data[0]?.id || null);
    }
  };

  const filteredMenu = menuItems.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || (m.description||"").toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" ? true : activeCategory === "recommended" ? m.recommended : m.categ_id === activeCategory;
    return matchSearch && matchCat;
  });

  const addToCart = useCallback(({ item, qty, selectedVariants, selectedAddOns, unitPrice, note }) => {
    setCart(prev => {
      const existing = prev.findIndex(c => c.item.id===item.id && JSON.stringify(c.selectedVariants)===JSON.stringify(selectedVariants) && JSON.stringify(c.selectedAddOns)===JSON.stringify(selectedAddOns));
      if (existing >= 0) { const u=[...prev]; u[existing]={...u[existing],qty:u[existing].qty+qty}; return u; }
      return [...prev, { item, qty, selectedVariants, selectedAddOns, unitPrice, note }];
    });
    showToast(`${item.name} added`);
  }, [showToast]);

  const updateQty = (index, newQty) => {
    if (newQty <= 0) setCart(prev => prev.filter((_,i) => i !== index));
    else setCart(prev => prev.map((c,i) => i===index ? {...c,qty:newQty} : c));
  };

  const cartCount = cart.reduce((s,c) => s+c.qty, 0);

  const placeOrder = async ({ address, payMethod, notes }) => {
    if (!customer || !restaurant) return;
    const itemTotal = cart.reduce((s,c) => s+c.unitPrice*c.qty, 0);
    const total = itemTotal + 0.5 + itemTotal*0.05;
    try {
      const { data: order, error: orderErr } = await supabase.from("Orders").insert({
        rest_id:restaurant.id, cust_id:customer.id,
        status:"pending", total_amount:total,
        payment_status:"pending", payment_method:payMethod, notes:notes||"",
      }).select().single();
      if (orderErr) throw orderErr;
      setLastOrder({ ...order, deliveryAddress:address });
      setCart([]); setShowCheckout(false); setShowTrack(true);
      showToast("Order placed! 🎉");
      await supabase.from("Customer").update({ total_orders:(customer.total_orders||0)+1, total_amount:Number(customer.total_amount||0)+total }).eq("id", customer.id);
    } catch { showToast("Failed to place order. Please try again."); }
  };

  const saveProfile = async form => {
    if (!customer) return;
    const { data } = await supabase.from("Customer").update({ cust_name:form.cust_name, ph_num:form.ph_num }).eq("id",customer.id).select().single();
    if (data) { setCustomer(data); showToast("Profile saved!"); }
  };

  const saveAddress = async form => {
    if (!customer) return;
    const payload = { cust_id:customer.id, label:form.label, street:form.street, block:form.block, bldg_name:form.bldg_name||"", apartment_no:Number(form.apartment_no)||0, floor:Number(form.floor)||0, landmark:form.landmark||null, note:form.note||null, longitude:0, latitude:0 };
    if (form.id) {
      const { data } = await supabase.from("Customer_Address").update(payload).eq("id",form.id).select().single();
      if (data) { setAddresses(prev => prev.map(a => a.id===form.id?data:a)); showToast("Address updated!"); }
    } else {
      const { data } = await supabase.from("Customer_Address").insert(payload).select().single();
      if (data) { setAddresses(prev=>[...prev,data]); if (!defaultAddrId) { setDefaultAddrId(data.id); localStorage.setItem(`default_addr_${customer.id}`,data.id); } showToast("Address added!"); }
    }
  };

  const deleteAddress = async id => {
    await supabase.from("Customer_Address").delete().eq("id",id);
    setAddresses(prev=>prev.filter(a=>a.id!==id));
    if (defaultAddrId===id) { const rem=addresses.filter(a=>a.id!==id); setDefaultAddrId(rem[0]?.id||null); }
    showToast("Address removed");
  };

  const setDefaultAddress = id => {
    setDefaultAddrId(id);
    if (customer) localStorage.setItem(`default_addr_${customer.id}`,id);
    showToast("Default address updated");
  };

  if (loading) return (<><GlobalStyle /><LoadingScreen /></>);
  if (error)   return (<><GlobalStyle /><ErrorScreen message={error} /></>);

  const defaultAddr = addresses.find(a => a.id === defaultAddrId);

  return (
    <>
      <GlobalStyle />
      <Toast message={toast} />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div style={{ minWidth:0, flexShrink:0 }}>
            <p style={{ fontSize:15, fontWeight:800, letterSpacing:"-0.3px", lineHeight:1.1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:160 }}>
              {restaurant?.name}
            </p>
            {restaurant?.branch_name && <p style={{ fontSize:11, color:"var(--text3)" }}>{restaurant.branch_name}</p>}
          </div>

          <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, minWidth:0 }} onClick={() => setShowProfile(true)}>
            <span style={{ width:13, height:13, color:"var(--green)", flexShrink:0 }}>{Icon.pin}</span>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--text2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {defaultAddr ? `${defaultAddr.label} · ${defaultAddr.street}` : "Add address"}
            </span>
          </button>

          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
            <button
              style={{ width:36, height:36, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center" }}
              onClick={() => setShowProfile(true)}
            >
              <span style={{ width:17, height:17 }}>{Icon.user}</span>
            </button>
            <button
              style={{ width:36, height:36, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}
              onClick={() => setShowCart(true)}
            >
              <span style={{ width:17, height:17 }}>{Icon.cart}</span>
              {cartCount > 0 && <span className="badge" style={{ position:"absolute", top:-3, right:-3 }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="page-wrap">
        <main style={{ paddingBottom:100 }}>

          {/* ── HERO ── */}
          <div className="hero">
            {restaurant?.image1_path
              ? <img className="hero-img" src={restaurant.image1_path} alt={restaurant.name} onError={e => { e.target.style.display="none"; }} />
              : <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#111 0%,#2a2a2a 100%)" }} />
            }
            <div className="hero-gradient" />
            <div className="hero-content">
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:5 }}>Now serving</p>
              <h1 style={{ fontSize:20, fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:10, letterSpacing:"-0.3px" }}>
                {restaurant?.name}
              </h1>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 14px" }}>
                {restaurant?.working_hours && <span className="info-chip">{Icon.clock} {restaurant.working_hours}</span>}
                {restaurant?.min_order && <span className="info-chip">🔥 Min. {fmt(restaurant.min_order)}</span>}
                <span className="info-chip">{Icon.truck} ~25 min</span>
              </div>
            </div>
          </div>

          {/* ── SEARCH + CATS — sticky ── */}
          <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", position:"sticky", top:"var(--navbar-h)", zIndex:50, padding:"14px 16px 0" }}>
            <div className="search-wrap" style={{ marginBottom:12 }}>
              <span className="search-icon">{Icon.search}</span>
              <input
                className="search-input"
                placeholder="Search dishes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:20, height:20, color:"var(--text3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ width:14, height:14 }}>{Icon.close}</span>
                </button>
              )}
            </div>
            <div className="cat-row" style={{ paddingBottom:13 }}>
              <button className={`cat-chip${activeCategory==="all"?" active":""}`} onClick={() => setActiveCategory("all")}>All</button>
              <button className={`cat-chip${activeCategory==="recommended"?" active":""}`} onClick={() => setActiveCategory("recommended")}>⭐ Popular</button>
              {categories.map(c => (
                <button key={c.id} className={`cat-chip${activeCategory===c.id?" active":""}`} onClick={() => setActiveCategory(c.id)}>{c.name}</button>
              ))}
            </div>
          </div>

          {/* ── MENU LIST ── */}
          <div style={{ background:"var(--surface)", padding:"0 16px 24px" }}>
            {loading ? (
              [1,2,3,4,5].map(k => <SkeletonRow key={k} />)
            ) : filteredMenu.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                <p style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Nothing found</p>
                <p style={{ fontSize:13, color:"var(--text3)" }}>Try a different search or category</p>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0 10px" }}>
                  <h2 className="section-title">
                    {activeCategory==="all"?"All dishes":activeCategory==="recommended"?"Popular":categories.find(c=>c.id===activeCategory)?.name||"Menu"}
                  </h2>
                  <span style={{ fontSize:12, color:"var(--text3)", fontWeight:600 }}>{filteredMenu.length} items</span>
                </div>
                <div className="menu-grid">
                {filteredMenu.map(item => {
                  const inCart = cart.filter(c => c.item.id===item.id).reduce((s,c) => s+c.qty, 0);
                  return (
                    <div key={item.id} className="menu-row anim-fade" onClick={() => setSelectedItem(item)}>

                      {/* Image thumbnail */}
                      <div className="menu-thumb-card">
                        {item.image_path
                          ? <img src={item.image_path} alt={item.name} onError={e => { e.target.style.display="none"; }} />
                          : null
                        }
                        {!item.image_path && <span style={{ fontSize:36 }}>🍽️</span>}
                        {item.recommended && (
                          <span className="pill" style={{ position:"absolute", top:6, left:6, background:"rgba(0,0,0,0.55)", color:"#fff", backdropFilter:"blur(4px)" }}>⭐ Popular</span>
                        )}
                      </div>

                      {/* Text body */}
                      <div className="menu-card-body">
                        <h3 style={{ fontSize:13, fontWeight:700, lineHeight:1.35, color:"var(--text)" }}>{item.name}</h3>
                        {item.description && (
                          <p style={{ fontSize:12, color:"var(--text3)", lineHeight:1.45, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                            {item.description}
                          </p>
                        )}
                        {/* Card footer — mobile only */}
                        <div className="menu-card-footer">
                          <span style={{ fontSize:14, fontWeight:800 }}>{fmt(item.price)}</span>
                          {inCart > 0 ? (
                            <div className="card-qty-row" onClick={e => e.stopPropagation()}>
                              <button className="card-qty-btn" onClick={e => { e.stopPropagation(); const idx=cart.findIndex(c=>c.item.id===item.id); if(idx>=0) updateQty(idx, cart[idx].qty-1); }}>{Icon.minus}</button>
                              <span className="card-qty-num">{inCart}</span>
                              <button className="card-qty-btn" onClick={e => { e.stopPropagation(); setSelectedItem(item); }}>{Icon.plus}</button>
                            </div>
                          ) : (
                            <button className="add-btn" onClick={e => { e.stopPropagation(); setSelectedItem(item); }}>
                              {Icon.plus}
                            </button>
                          )}
                        </div>
                        {/* Price — tablet list view only */}
                        <p className="tablet-price" style={{ fontSize:14, fontWeight:800, marginTop:4 }}>{fmt(item.price)}</p>
                      </div>

                      {/* Action column — tablet only */}
                      <div className="menu-row-action" onClick={e => e.stopPropagation()}>
                        {inCart > 0 ? (
                          <div className="qty-row">
                            <button className="qty-btn" onClick={e => { e.stopPropagation(); const idx=cart.findIndex(c=>c.item.id===item.id); if(idx>=0) updateQty(idx, cart[idx].qty-1); }}>{Icon.minus}</button>
                            <span className="qty-num">{inCart}</span>
                            <button className="qty-btn" onClick={e => { e.stopPropagation(); setSelectedItem(item); }}>{Icon.plus}</button>
                          </div>
                        ) : (
                          <button className="add-btn" onClick={e => { e.stopPropagation(); setSelectedItem(item); }}>
                            {Icon.plus}
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
                </div>
              </>
            )}
          </div>
        </main>

        {/* ── DESKTOP CART ── */}
        <aside className="cart-sidebar">
          <CartPanel
            cart={cart}
            restaurant={restaurant}
            onUpdateQty={updateQty}
            onRemove={i => updateQty(i, 0)}
            onCheckout={total => { setCheckoutTotal(total); setShowCheckout(true); }}
          />
        </aside>
      </div>

      {/* ── MOBILE CART BAR ── */}
      {cartCount > 0 && (
        <div className="mobile-cart-bar" onClick={() => setShowCart(true)}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ background:"rgba(255,255,255,0.12)", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800 }}>{cartCount}</span>
            <span style={{ fontWeight:700, fontSize:15 }}>View cart</span>
          </div>
          <span style={{ fontWeight:800, fontSize:15 }}>{fmt(cart.reduce((s,c)=>s+c.unitPrice*c.qty,0))}</span>
        </div>
      )}

      {/* ── MODALS ── */}
      {selectedItem && <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={addToCart} />}
      {showCart && (
        <CartPanel cart={cart} restaurant={restaurant} onUpdateQty={updateQty} onRemove={i=>updateQty(i,0)}
          onCheckout={total => { setCheckoutTotal(total); setShowCart(false); setShowCheckout(true); }}
          isModal onClose={() => setShowCart(false)}
        />
      )}
      {showCheckout && (
        <CheckoutModal total={checkoutTotal} restaurant={restaurant} customer={customer}
          addresses={addresses} defaultAddr={defaultAddr}
          onClose={() => setShowCheckout(false)} onPlaceOrder={placeOrder}
          onAddAddress={() => { setShowCheckout(false); setShowProfile(true); }}
        />
      )}
      {showTrack && lastOrder && (
        <OrderTrackModal order={lastOrder} restaurant={restaurant} address={lastOrder.deliveryAddress} onClose={() => setShowTrack(false)} />
      )}
      {showProfile && (
        <ProfileModal customer={customer} addresses={addresses}
          onClose={() => setShowProfile(false)} onSaveProfile={saveProfile}
          onSaveAddress={saveAddress} onDeleteAddress={deleteAddress}
          onSetDefault={setDefaultAddress} defaultAddrId={defaultAddrId}
        />
      )}
    </>
  );
}