import { useState, useEffect, useCallback } from "react";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand:       #E8340A;
    --brand-light: #FF5733;
    --brand-bg:    #FFF5F2;
    --gold:        #D4A017;
    --dark:        #1A1209;
    --charcoal:    #2D2416;
    --warm-gray:   #6B5E4E;
    --muted:       #A89880;
    --border:      #EDE3D8;
    --surface:     #FFFDF9;
    --card:        #FFFFFF;
    --sidebar-w:   340px;
    --shadow-sm:   0 2px 8px rgba(26,18,9,.07);
    --shadow-md:   0 6px 24px rgba(26,18,9,.10);
    --shadow-lg:   0 16px 48px rgba(26,18,9,.14);
    --radius:      16px;
    --radius-sm:   10px;
    --font-display:'Playfair Display', Georgia, serif;
    --font-body:   'DM Sans', sans-serif;
    --font-mono:   'DM Mono', monospace;
    --transition:  220ms cubic-bezier(.4,0,.2,1);
  }

  html, body { font-family: var(--font-body); background: #F2EDE4; color: var(--dark); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
  @keyframes slideUp { from { transform:translateY(100%); opacity:0 } to { transform:none; opacity:1 } }
  @keyframes pulse   { 0%,100%{ box-shadow:0 0 0 0 rgba(232,52,10,.4) } 70%{ box-shadow:0 0 0 10px rgba(232,52,10,0) } }
  @keyframes bounce  { 0%,100%{ transform:scale(1) } 50%{ transform:scale(1.2) } }

  /* ── HEADER ── */
  .site-header {
    position: sticky; top: 0; z-index: 200;
    background: rgba(255,253,249,.94);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .site-header-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 24px;
    height: 60px; display: flex; align-items: center; gap: 16px;
  }
  .header-logo { font-family: var(--font-display); font-size: 22px; font-weight: 900; color: var(--brand); white-space: nowrap; letter-spacing: -.5px; }
  .header-logo span { color: var(--gold); }
  .header-branch { display: flex; align-items: center; gap: 6px; cursor: pointer; flex: 1; min-width: 0; }
  .branch-label { font-size: 10px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: .06em; }
  .branch-name  { font-size: 13px; font-weight: 600; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .branch-chevron { color: var(--brand); font-size: 11px; flex-shrink: 0; }
  .header-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
  .icon-btn {
    width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    background: var(--brand-bg); color: var(--brand); font-size: 16px;
    transition: background var(--transition), transform var(--transition); position: relative;
  }
  .icon-btn:hover { background: var(--brand); color: #fff; transform: scale(1.05); }
  .badge {
    position: absolute; top: -3px; right: -3px;
    background: var(--brand); color: #fff; font-size: 9px; font-weight: 700;
    font-family: var(--font-mono); width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid var(--surface); display: flex; align-items: center;
    justify-content: center; animation: pulse 2s infinite;
  }

  /* ── PAGE LAYOUT ── */
  .page-body {
    max-width: 1280px; margin: 0 auto; padding: 24px 24px 48px;
    display: grid; grid-template-columns: 1fr var(--sidebar-w);
    gap: 24px; align-items: start;
  }
  .main-col { min-width: 0; }
  .side-col  { position: sticky; top: 84px; display: flex; flex-direction: column; gap: 16px; }

  /* ── LOCATION + TOGGLE ROW ── */
  .loc-toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .loc-row { display: flex; align-items: center; gap: 6px; cursor: pointer; flex: 1; min-width: 0; margin-right: 12px; }
  .loc-pin { color: var(--brand); font-size: 13px; flex-shrink: 0; }
  .loc-text { font-size: 12px; font-weight: 500; color: var(--charcoal); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .loc-chevron { color: var(--warm-gray); font-size: 11px; flex-shrink: 0; }
  .delivery-toggle { display: flex; border-radius: 99px; overflow: hidden; border: 1.5px solid var(--brand); flex-shrink: 0; }
  .toggle-btn { padding: 6px 18px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; transition: background var(--transition), color var(--transition); font-family: var(--font-body); }
  .toggle-btn.active { background: var(--brand); color: #fff; }
  .toggle-btn:not(.active) { background: transparent; color: var(--brand); }

  /* ── CAROUSEL ── */
  .carousel-wrap { border-radius: var(--radius); overflow: hidden; position: relative; margin-bottom: 20px; }
  .carousel-track { display: flex; transition: transform .55s cubic-bezier(.4,0,.2,1); }
  .carousel-slide { min-width: 100%; height: 220px; position: relative; overflow: hidden; flex-shrink: 0; }
  .slide-bg-emoji { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 160px; opacity: .13; }
  .carousel-overlay { position: absolute; inset: 0; background: linear-gradient(120deg, rgba(26,18,9,.72) 0%, rgba(26,18,9,.08) 65%); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px 28px; }
  .slide-tag   { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--gold); margin-bottom: 5px; }
  .slide-title { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: #fff; line-height: 1.15; }
  .slide-sub   { font-size: 13px; color: rgba(255,255,255,.75); margin-top: 4px; }
  .carousel-dots { display: flex; gap: 5px; justify-content: center; padding: 8px 0 2px; }
  .dot { width: 6px; height: 6px; border-radius: 99px; background: var(--border); cursor: pointer; transition: all .3s; }
  .dot.active { background: var(--brand); width: 20px; }

  /* ── SEARCH ── */
  .search-wrap { display: flex; gap: 8px; margin-bottom: 14px; }
  .search-input-wrap { flex: 1; display: flex; align-items: center; gap: 8px; background: var(--card); border: 1.5px solid var(--border); border-radius: 99px; padding: 10px 16px; transition: border-color var(--transition), box-shadow var(--transition); }
  .search-input-wrap:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(232,52,10,.1); }
  .search-icon  { color: var(--muted); font-size: 14px; }
  .search-input { border: none; outline: none; background: transparent; font-family: var(--font-body); font-size: 14px; color: var(--dark); flex: 1; }
  .search-input::placeholder { color: var(--muted); }
  .filter-btn { width: 44px; height: 44px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--charcoal); font-size: 16px; transition: all var(--transition); }
  .filter-btn:hover { border-color: var(--brand); color: var(--brand); }

  /* ── CATEGORIES ── */
  .category-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; margin-bottom: 20px; }
  .category-scroll::-webkit-scrollbar { display: none; }
  .cat-pill { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 99px; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; white-space: nowrap; font-size: 13px; font-weight: 500; color: var(--warm-gray); transition: all var(--transition); flex-shrink: 0; }
  .cat-pill.active { background: var(--brand); border-color: var(--brand); color: #fff; }
  .cat-pill:hover:not(.active) { border-color: var(--brand); color: var(--brand); }

  /* ── MENU GRID ── */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title  { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--dark); }
  .section-count  { font-size: 12px; color: var(--muted); }

  .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .menu-card {
    background: var(--card); border-radius: var(--radius); border: 1.5px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden; cursor: default;
    transition: box-shadow var(--transition), transform var(--transition), border-color var(--transition);
    animation: fadeUp .3s ease both;
  }
  .menu-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: rgba(232,52,10,.25); }
  .menu-card-img { width: 100%; height: 130px; display: flex; align-items: center; justify-content: center; font-size: 60px; background: linear-gradient(135deg,#FFF0EB,#FFF8F5); flex-shrink: 0; }
  .menu-card-body { padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 3px; }
  .veg-indicator { width: 12px; height: 12px; border-radius: 2px; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-bottom: 2px; }
  .veg-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .veg-indicator.veg { color: #2E7D32; }
  .veg-indicator.nonveg { color: var(--brand); }
  .popular-badge { display: inline-flex; align-items: center; gap: 3px; background: var(--gold); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 99px; text-transform: uppercase; letter-spacing: .06em; width: fit-content; margin-bottom: 3px; }
  .menu-card-name  { font-size: 14px; font-weight: 600; color: var(--dark); line-height: 1.3; }
  .menu-card-desc  { font-size: 11px; color: var(--warm-gray); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
  .menu-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .menu-card-price { font-size: 14px; font-weight: 700; color: var(--dark); font-family: var(--font-mono); }

  .add-btn { background: var(--brand); color: #fff; border: none; border-radius: 8px; padding: 6px 16px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all var(--transition); font-family: var(--font-body); box-shadow: 0 2px 8px rgba(232,52,10,.3); }
  .add-btn:hover { background: var(--brand-light); transform: scale(1.04); }
  .qty-ctrl { display: flex; align-items: center; background: var(--brand); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(232,52,10,.3); }
  .qty-btn  { width: 28px; height: 28px; border: none; background: transparent; color: #fff; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: background var(--transition); }
  .qty-btn:hover { background: rgba(255,255,255,.2); }
  .qty-num  { width: 22px; text-align: center; color: #fff; font-size: 12px; font-weight: 700; font-family: var(--font-mono); }

  .empty-card { grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; padding: 48px 20px; text-align: center; background: var(--card); border-radius: var(--radius); border: 1.5px solid var(--border); }
  .empty-icon { font-size: 52px; margin-bottom: 12px; }
  .empty-text { font-size: 16px; font-weight: 600; color: var(--charcoal); }
  .empty-sub  { font-size: 13px; color: var(--muted); margin-top: 4px; }

  /* ── SIDEBAR: RESTAURANT CARD ── */
  .restaurant-card { background: var(--card); border-radius: var(--radius); border: 1.5px solid var(--border); overflow: hidden; box-shadow: var(--shadow-sm); }
  .restaurant-hero { height: 100px; background: linear-gradient(135deg,#1A1209,#3D2010); display: flex; align-items: center; justify-content: center; font-size: 54px; }
  .restaurant-body { padding: 14px 16px; }
  .restaurant-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 10px; }
  .meta-row { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--warm-gray); padding: 3px 0; }

  /* ── SIDEBAR: CART PANEL ── */
  .cart-panel { background: var(--card); border-radius: var(--radius); border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; }
  .cart-panel-header { padding: 14px 16px 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .cart-panel-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--dark); }
  .cart-panel-count { font-size: 12px; color: var(--muted); font-family: var(--font-mono); }
  .cart-panel-empty { padding: 28px 16px; text-align: center; }
  .cp-empty-icon { font-size: 38px; margin-bottom: 8px; }
  .cp-empty-text { font-size: 14px; font-weight: 600; color: var(--charcoal); }
  .cp-empty-sub  { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .cart-panel-items { padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; max-height: 260px; overflow-y: auto; }
  .cp-item { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
  .cp-item:last-child { border-bottom: none; padding-bottom: 0; }
  .cp-emoji { font-size: 22px; flex-shrink: 0; }
  .cp-info  { flex: 1; min-width: 0; }
  .cp-name  { font-size: 12px; font-weight: 600; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cp-price { font-size: 11px; color: var(--muted); font-family: var(--font-mono); margin-top: 2px; }
  .cp-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
  .cp-total { font-size: 12px; font-weight: 700; color: var(--dark); font-family: var(--font-mono); }
  .cp-qty   { display: flex; align-items: center; background: var(--brand); border-radius: 6px; overflow: hidden; }
  .cp-qty-btn { width: 22px; height: 22px; border: none; background: transparent; color: #fff; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: background var(--transition); }
  .cp-qty-btn:hover { background: rgba(255,255,255,.2); }
  .cp-qty-num { width: 20px; text-align: center; color: #fff; font-size: 11px; font-weight: 700; font-family: var(--font-mono); }

  .cp-bill { padding: 10px 16px; border-top: 1px solid var(--border); background: var(--brand-bg); }
  .bill-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--warm-gray); padding: 3px 0; }
  .bill-row span:last-child { font-family: var(--font-mono); }
  .bill-row.total { font-size: 14px; font-weight: 700; color: var(--dark); padding-top: 8px; border-top: 1.5px dashed var(--border); margin-top: 4px; }
  .bill-row.total span:last-child { color: var(--brand); }

  .cp-promo { padding: 10px 16px; border-top: 1px solid var(--border); display: flex; gap: 7px; }
  .promo-input { flex: 1; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 12px; font-family: var(--font-mono); background: var(--card); color: var(--dark); outline: none; text-transform: uppercase; transition: border-color var(--transition); }
  .promo-input:focus { border-color: var(--brand); }
  .promo-apply-btn { padding: 8px 14px; border-radius: var(--radius-sm); border: none; background: var(--brand); color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; font-family: var(--font-body); transition: background var(--transition); white-space: nowrap; }
  .promo-apply-btn:hover { background: var(--brand-light); }
  .promo-msg { padding: 0 16px 8px; font-size: 11px; font-weight: 600; }

  .cp-checkout-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: calc(100% - 32px); margin: 10px 16px 16px;
    background: var(--brand); color: #fff; border: none; border-radius: var(--radius-sm);
    padding: 13px 18px; font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: var(--font-body); transition: all var(--transition);
    box-shadow: 0 4px 14px rgba(232,52,10,.3);
  }
  .cp-checkout-btn:hover { background: var(--brand-light); transform: translateY(-1px); }
  .cp-checkout-btn span:last-child { font-family: var(--font-mono); }

  /* ── MOBILE CART BAR ── */
  .mobile-cart-bar {
    display: none; position: fixed; bottom: 16px; left: 16px; right: 16px; z-index: 199;
    background: var(--dark); color: #fff; border-radius: 14px;
    align-items: center; padding: 14px 18px; cursor: pointer;
    box-shadow: var(--shadow-lg); animation: slideUp .35s ease;
    transition: transform var(--transition);
  }
  .mobile-cart-bar:hover { transform: translateY(-2px); }
  .mcb-icon  { font-size: 18px; margin-right: 10px; }
  .mcb-info  { flex: 1; }
  .mcb-count { font-size: 11px; color: rgba(255,255,255,.55); font-weight: 500; }
  .mcb-label { font-size: 14px; font-weight: 700; }
  .mcb-total { font-family: var(--font-mono); font-size: 15px; font-weight: 700; color: var(--gold); }
  .mcb-arrow { margin-left: 8px; color: rgba(255,255,255,.5); }

  /* ── DRAWERS ── */
  .drawer-overlay { position: fixed; inset: 0; background: rgba(26,18,9,.52); z-index: 300; backdrop-filter: blur(4px); animation: fadeUp .2s ease; }
  .drawer {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 520px; background: var(--surface);
    border-radius: 24px 24px 0 0; z-index: 301;
    max-height: 92vh; overflow-y: auto;
    animation: slideUp .3s cubic-bezier(.4,0,.2,1);
    padding-bottom: env(safe-area-inset-bottom, 16px);
  }
  .drawer-handle { width: 36px; height: 4px; background: var(--border); border-radius: 99px; margin: 10px auto 0; }
  .drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 14px; }
  .drawer-title  { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--dark); }
  .close-btn { width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer; background: var(--border); color: var(--charcoal); font-size: 14px; display: flex; align-items: center; justify-content: center; transition: background var(--transition); }
  .close-btn:hover { background: var(--brand); color: #fff; }

  .drawer-items { padding: 0 20px; display: flex; flex-direction: column; gap: 14px; }
  .d-item { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--border); animation: fadeUp .2s ease; }
  .d-item:last-child { border-bottom: none; }
  .d-emoji { font-size: 28px; }
  .d-info   { flex: 1; min-width: 0; }
  .d-name   { font-size: 14px; font-weight: 600; color: var(--dark); }
  .d-price  { font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-top: 2px; }
  .d-right  { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .d-total  { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: var(--dark); }

  .drawer-promo  { padding: 14px 20px; border-top: 1px solid var(--border); }
  .drawer-bill   { padding: 0 20px 14px; }
  .drawer-pay    { padding: 0 20px 14px; }
  .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 8px; }
  .promo-row { display: flex; gap: 8px; }
  .promo-msg-drawer { font-size: 12px; font-weight: 600; margin-top: 6px; }

  .pay-option { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; margin-bottom: 8px; transition: all var(--transition); }
  .pay-option.selected { border-color: var(--brand); background: var(--brand-bg); }
  .pay-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color var(--transition); }
  .pay-option.selected .pay-radio { border-color: var(--brand); }
  .pay-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); display: none; }
  .pay-option.selected .pay-dot { display: block; }
  .pay-icon { font-size: 20px; }
  .pay-name { font-size: 14px; font-weight: 600; color: var(--dark); }

  .place-order-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: calc(100% - 40px); margin: 0 20px 20px;
    background: var(--brand); color: #fff; border: none; border-radius: var(--radius-sm);
    padding: 16px 20px; font-size: 16px; font-weight: 700; cursor: pointer;
    font-family: var(--font-body); transition: all var(--transition);
    box-shadow: 0 4px 16px rgba(232,52,10,.35);
  }
  .place-order-btn:hover { background: var(--brand-light); transform: translateY(-1px); }

  /* ── PROFILE ── */
  .tab-bar { display: flex; border-bottom: 1.5px solid var(--border); margin: 0 20px 16px; }
  .tab-btn { flex: 1; padding: 10px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--muted); font-family: var(--font-body); border-bottom: 2.5px solid transparent; margin-bottom: -1.5px; transition: all var(--transition); }
  .tab-btn.active { color: var(--brand); border-bottom-color: var(--brand); }
  .profile-section { padding: 0 20px 16px; }
  .profile-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .profile-avatar { width: 66px; height: 66px; border-radius: 50%; background: linear-gradient(135deg,var(--brand),var(--brand-light)); display: flex; align-items: center; justify-content: center; font-size: 26px; color: #fff; font-weight: 700; font-family: var(--font-display); box-shadow: 0 4px 16px rgba(232,52,10,.3); flex-shrink: 0; }
  .profile-display-name { font-family: var(--font-display); font-size: 19px; font-weight: 700; color: var(--dark); }
  .profile-sub { font-size: 12px; color: var(--warm-gray); margin-top: 2px; }
  .form-group { margin-bottom: 12px; }
  .form-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 5px; display: block; }
  .form-input { width: 100%; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 10px 13px; font-size: 14px; font-family: var(--font-body); background: var(--card); color: var(--dark); outline: none; transition: border-color var(--transition), box-shadow var(--transition); }
  .form-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(232,52,10,.1); }
  .form-row { display: flex; gap: 10px; }
  .form-row .form-group { flex: 1; }
  .save-btn { width: calc(100% - 40px); margin: 0 20px 24px; background: var(--brand); color: #fff; border: none; border-radius: var(--radius-sm); padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: var(--font-body); transition: all var(--transition); box-shadow: 0 4px 14px rgba(232,52,10,.3); }
  .save-btn:hover { background: var(--brand-light); transform: translateY(-1px); }

  .addresses-wrap { padding: 0 20px 16px; }
  .address-card { border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 13px; margin-bottom: 10px; cursor: pointer; transition: all var(--transition); }
  .address-card.selected { border-color: var(--brand); background: var(--brand-bg); }
  .address-card:hover:not(.selected) { border-color: rgba(232,52,10,.3); }
  .addr-header { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
  .addr-icon    { font-size: 16px; }
  .addr-label   { font-size: 13px; font-weight: 700; color: var(--dark); flex: 1; }
  .addr-default-badge { font-size: 10px; background: var(--gold); color: #fff; padding: 2px 8px; border-radius: 99px; font-weight: 700; }
  .addr-text    { font-size: 12px; color: var(--warm-gray); line-height: 1.5; }
  .addr-actions { display: flex; gap: 10px; margin-top: 7px; }
  .addr-btn     { font-size: 11px; font-weight: 600; color: var(--brand); background: none; border: none; cursor: pointer; padding: 0; font-family: var(--font-body); transition: color var(--transition); }
  .addr-btn.del { color: var(--muted); }
  .addr-btn.del:hover { color: #c0392b; }
  .add-addr-btn { width: 100%; border: 1.5px dashed var(--border); border-radius: var(--radius-sm); padding: 13px; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--brand); font-family: var(--font-body); transition: all var(--transition); }
  .add-addr-btn:hover { border-color: var(--brand); background: var(--brand-bg); }

  /* ── MAP MODAL ── */
  .map-modal { position: fixed; inset: 0; z-index: 400; background: rgba(26,18,9,.6); display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); animation: fadeUp .2s ease; }
  .map-sheet { width: 100%; max-width: 520px; background: var(--surface); border-radius: 24px 24px 0 0; overflow: hidden; animation: slideUp .3s cubic-bezier(.4,0,.2,1); max-height: 90vh; display: flex; flex-direction: column; }
  .map-view { height: 230px; background: linear-gradient(135deg,#E8F5E9,#E3F2FD,#FFF3E0); position: relative; flex-shrink: 0; overflow: hidden; }
  .map-grid { position: absolute; inset: 0; opacity: .2; background-image: linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px); background-size: 40px 40px; }
  .map-pin  { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-100%); font-size: 36px; filter: drop-shadow(0 4px 8px rgba(232,52,10,.4)); animation: bounce 2s infinite; }
  .map-zoom { position: absolute; right: 12px; bottom: 12px; display: flex; flex-direction: column; gap: 4px; }
  .map-zoom-btn { width: 32px; height: 32px; background: #fff; border: 1px solid var(--border); border-radius: 7px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 15px; box-shadow: var(--shadow-sm); }
  .map-form { padding: 16px 20px; overflow-y: auto; }
  .label-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .label-pill { padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-body); display: flex; align-items: center; gap: 5px; border: 1.5px solid var(--border); background: var(--card); color: var(--warm-gray); transition: all var(--transition); }
  .label-pill.active { border-color: var(--brand); background: var(--brand-bg); color: var(--brand); }
  .map-confirm-btn { width: 100%; background: var(--brand); color: #fff; border: none; border-radius: var(--radius-sm); padding: 13px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: var(--font-body); transition: background var(--transition); margin-top: 4px; }
  .map-confirm-btn:hover { background: var(--brand-light); }

  /* ── TRACKING ── */
  .tracking-wrap { padding: 0 20px 24px; }
  .order-id-label { font-size: 11px; font-family: var(--font-mono); color: var(--muted); margin-bottom: 4px; }
  .tracking-steps { display: flex; flex-direction: column; margin-top: 16px; }
  .t-step  { display: flex; gap: 14px; padding-bottom: 20px; }
  .t-step:last-child { padding-bottom: 0; }
  .t-line  { display: flex; flex-direction: column; align-items: center; }
  .t-dot   { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .t-dot.done   { background: var(--brand); color: #fff; box-shadow: 0 0 0 4px rgba(232,52,10,.18); }
  .t-dot.active { background: var(--brand); color: #fff; animation: pulse 1.5s infinite; }
  .t-dot.pending{ background: var(--border); color: var(--muted); }
  .t-conn  { width: 2px; flex: 1; min-height: 14px; margin: 3px 0; }
  .t-conn.done   { background: var(--brand); }
  .t-conn.pending{ background: var(--border); }
  .t-label { font-size: 14px; font-weight: 600; color: var(--dark); }
  .t-label.pending { color: var(--muted); font-weight: 400; }
  .t-time  { font-size: 11px; color: var(--muted); font-family: var(--font-mono); margin-top: 2px; }
  .wa-btn  { width: 100%; background: #25D366; color: #fff; border: none; border-radius: var(--radius-sm); padding: 13px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: var(--font-body); display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 22px; transition: background var(--transition); }
  .wa-btn:hover { background: #1ebe5a; }
  .delivery-info { background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 13px; margin-top: 16px; }
  .di-title { font-size: 13px; font-weight: 700; color: var(--dark); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .di-row   { display: flex; gap: 8px; align-items: flex-start; padding: 4px 0; font-size: 12px; color: var(--warm-gray); }
  .di-icon  { font-size: 13px; flex-shrink: 0; margin-top: 1px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .page-body { grid-template-columns: 1fr; padding: 14px 14px 80px; gap: 14px; }
    .side-col  { display: none; }
    .mobile-cart-bar { display: flex; }
    .carousel-slide { height: 190px; }
    .slide-title { font-size: 24px; }
  }
  @media (max-width: 520px) {
    .menu-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .menu-card-img { height: 100px; font-size: 44px; }
    .slide-title { font-size: 20px; }
    .carousel-overlay { padding: 16px 18px; }
    .carousel-slide { height: 165px; }
  }
  @media (max-width: 380px) {
    .menu-grid { grid-template-columns: 1fr; }
    .menu-card { flex-direction: row; }
    .menu-card-img { width: 100px; height: auto; min-height: 95px; font-size: 44px; flex-shrink: 0; }
    .site-header-inner { padding: 0 12px; gap: 10px; }
  }
  @media (min-width: 1100px) {
    :root { --sidebar-w: 360px; }
    .carousel-slide { height: 240px; }
    .slide-title { font-size: 32px; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const SLIDES = [
  { tag:"Today's Special", title:"One Place, Endless Flavors!", sub:"Fresh & made to order",   emoji:"🍕", bg:["#1A1209","#3D2010"] },
  { tag:"New Arrival",     title:"Smashed Beef Burger",         sub:"Juicy patties, bold flavors", emoji:"🍔", bg:["#0D1F12","#1A3520"] },
  { tag:"Fan Favorite",    title:"UAE's Best Karak",            sub:"Brewed to perfection daily",  emoji:"☕", bg:["#1F1208","#3D2A0A"] },
  { tag:"Weekend Special", title:"Chicken Fried Rice",          sub:"Tender chunks, wok-tossed",   emoji:"🍛", bg:["#0F1A22","#1A3040"] },
];
const CATS = [
  { id:"all",     label:"All",         emoji:"🍽️" },
  { id:"fav",     label:"Favorites",   emoji:"⭐" },
  { id:"drinks",  label:"Drinks",      emoji:"☕" },
  { id:"rice",    label:"Rice & Bowls",emoji:"🍛" },
  { id:"burgers", label:"Burgers",     emoji:"🍔" },
  { id:"pizza",   label:"Pizza",       emoji:"🍕" },
  { id:"wraps",   label:"Wraps",       emoji:"🌯" },
  { id:"desserts",label:"Desserts",    emoji:"🍰" },
];
const MENU = [
  { id:1, name:"UAE's Best Karak",            price:2,  cat:"drinks",   veg:true,  pop:true,  emoji:"☕", desc:"Karak isn't just tea, it's a way of life in the UAE. Brewed to perfection with the perfect blend of spices." },
  { id:2, name:"Hrishi's Chicken Fried Rice", price:20, cat:"rice",     veg:false, pop:true,  emoji:"🍛", desc:"Chicken fried rice, slightly heavy on the soy sauce with tender chunks of perfectly seasoned chicken." },
  { id:3, name:"Ethan's Smashed Beef Burger", price:30, cat:"burgers",  veg:false, pop:false, emoji:"🍔", desc:"Inspired by Ethan's love for burgers and the nostalgia of late night orders. Double smashed patty, special sauce." },
  { id:4, name:"Margherita Bliss Pizza",      price:35, cat:"pizza",    veg:true,  pop:false, emoji:"🍕", desc:"Classic margherita with San Marzano tomatoes, buffalo mozzarella and fresh basil on a crispy thin crust." },
  { id:5, name:"Crispy Chicken Wrap",         price:22, cat:"wraps",    veg:false, pop:true,  emoji:"🌯", desc:"Golden-fried chicken strips with crunchy slaw, pickled jalapeños, and our signature garlic aioli in a toasted wrap." },
  { id:6, name:"Mango Passion Cooler",        price:15, cat:"drinks",   veg:true,  pop:false, emoji:"🥭", desc:"A refreshing blend of Alphonso mango and passion fruit, lightly sweetened with a hint of lime." },
  { id:7, name:"Cheesy Garlic Bread",         price:12, cat:"pizza",    veg:true,  pop:false, emoji:"🧀", desc:"Thick-cut sourdough loaded with roasted garlic butter and a generous blanket of melted cheddar and mozzarella." },
  { id:8, name:"Date & Caramel Cake",         price:18, cat:"desserts", veg:true,  pop:true,  emoji:"🍰", desc:"A rich date sponge with warm toffee sauce and a scoop of vanilla bean ice cream. UAE's beloved dessert, elevated." },
];
const PROMOS    = { KARAK10:10, MUNCH20:20, WELCOME5:5 };
const DELIV_FEE = 5;
const fmt       = n => `AED ${n.toFixed(2)}`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Customer() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const [slide,      setSlide]      = useState(0);
  const [cat,        setCat]        = useState("all");
  const [search,     setSearch]     = useState("");
  const [cart,       setCart]       = useState({});
  const [mode,       setMode]       = useState("Delivery");
  const [drawer,     setDrawer]     = useState(null);
  const [payMethod,  setPayMethod]  = useState("card");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo,  setAppliedPromo]  = useState(null);
  const [promoMsg,      setPromoMsg]      = useState(null); // { text, ok }
  const [orderPlaced,   setOrderPlaced]   = useState(null);
  const [profileTab,    setProfileTab]    = useState("info");
  const [showMap,       setShowMap]       = useState(false);
  const [editingAddr,   setEditingAddr]   = useState(null);
  const [mapInput,      setMapInput]      = useState("");
  const [selectedAddrId,setSelectedAddrId]= useState(1);
  const [profile, setProfile] = useState({ name:"", phone:"", email:"", flat:"", building:"", area:"" });
  const [addresses, setAddresses] = useState([
    { id:1, label:"Home", icon:"🏠", text:"Al Mamzar Plaza - Al Taawun St - Al Mamzar - Sharjah", default:true },
    { id:2, label:"Work", icon:"🏢", text:"Laffah Restaurant Building, Al Mamzar Plaza - Al Taawun St", default:false },
  ]);

  // Carousel auto-advance
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s+1) % SLIDES.length), 4200);
    return () => clearInterval(t);
  }, []);

  const add    = useCallback(id => setCart(c => ({ ...c, [id]:(c[id]||0)+1 })), []);
  const remove = useCallback(id => setCart(c => { const n={...c}; n[id]>1 ? n[id]-- : delete n[id]; return n; }), []);

  const cartCount    = Object.values(cart).reduce((a,b) => a+b, 0);
  const itemTotal    = Object.entries(cart).reduce((s,[id,q]) => { const it=MENU.find(i=>i.id===+id); return s+(it?it.price*q:0); }, 0);
  const discount     = appliedPromo ? (PROMOS[appliedPromo]/100)*itemTotal : 0;
  const afterDiscount= itemTotal - discount;
  const totalWithVAT = (afterDiscount + DELIV_FEE) * 1.05;
  const currentAddr  = addresses.find(a => a.id===selectedAddrId) || addresses[0];

  const applyPromo = () => {
    if (PROMOS[promoInput]) {
      setAppliedPromo(promoInput);
      setPromoMsg({ text:`✅ ${promoInput} applied — ${PROMOS[promoInput]}% off!`, ok:true });
    } else {
      setAppliedPromo(null);
      setPromoMsg({ text:"❌ Invalid promo code", ok:false });
    }
  };

  const placeOrder = () => {
    const id = "ORD-" + Math.floor(Math.random()*9000+1000);
    setOrderPlaced({ id, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) });
    setCart({}); setAppliedPromo(null); setPromoMsg(null); setDrawer("track");
  };

  const saveAddr = () => {
    if (!mapInput.trim()) return;
    if (editingAddr?.id) {
      setAddresses(a => a.map(x => x.id===editingAddr.id ? {...x,text:mapInput,label:editingAddr.label,icon:editingAddr.icon} : x));
    } else {
      const n = { id:Date.now(), label:editingAddr?.label||"New", icon:editingAddr?.icon||"📍", text:mapInput, default:false };
      setAddresses(a => [...a,n]); setSelectedAddrId(n.id);
    }
    setShowMap(false); setMapInput(""); setEditingAddr(null);
  };

  const filtered = MENU.filter(item => {
    const mc = cat==="all" || item.cat===cat || (cat==="fav" && item.pop);
    const ms = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  // Shared bill display used in both sidebar and drawer
  const BillRows = ({ compact }) => (
    <>
      <div className="bill-row"><span>Item Total</span><span>{fmt(itemTotal)}</span></div>
      {appliedPromo && <div className="bill-row" style={{color:"#2E7D32"}}><span>Discount ({PROMOS[appliedPromo]}%)</span><span>-{fmt(discount)}</span></div>}
      <div className="bill-row"><span>Delivery Fee</span><span>{fmt(DELIV_FEE)}</span></div>
      <div className="bill-row"><span>VAT (5%)</span><span>{fmt((afterDiscount+DELIV_FEE)*0.05)}</span></div>
      <div className="bill-row total"><span>Total</span><span>{fmt(totalWithVAT)}</span></div>
    </>
  );

  return (
    <>
      {/* ── HEADER ── */}
      <header className="site-header">
        <div className="site-header-inner">
          <div className="header-logo">Mix <span>&</span> Munch</div>
          <div className="header-branch">
            <div>
              <div className="branch-label">Delivery from</div>
              <div className="branch-name">Mix & Munch, Sharjah City Centre</div>
            </div>
            <span className="branch-chevron">▾</span>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setDrawer("cart")} aria-label="Cart">
              🛒
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            <button className="icon-btn" onClick={() => setDrawer("profile")} aria-label="Profile">👤</button>
          </div>
        </div>
      </header>

      {/* ── PAGE BODY ── */}
      <div className="page-body">

        {/* ══ MAIN COLUMN ══ */}
        <div className="main-col">

          {/* Location + toggle */}
          <div className="loc-toggle-row">
            <div className="loc-row" onClick={() => { setDrawer("profile"); setProfileTab("addresses"); }}>
              <span className="loc-pin">📍</span>
              <span className="loc-text">{currentAddr?.text || "Set delivery address"}</span>
              <span className="loc-chevron">▾</span>
            </div>
            <div className="delivery-toggle">
              {["Delivery","Pickup"].map(m => (
                <button key={m} className={`toggle-btn${mode===m?" active":""}`} onClick={()=>setMode(m)}>{m}</button>
              ))}
            </div>
          </div>

          {/* Carousel – NO arrows */}
          <div className="carousel-wrap">
            <div className="carousel-track" style={{ transform:`translateX(-${slide*100}%)` }}>
              {SLIDES.map((s,i) => (
                <div key={i} className="carousel-slide"
                  style={{ background:`linear-gradient(135deg,${s.bg[0]} 0%,${s.bg[1]} 100%)` }}>
                  <div className="slide-bg-emoji">{s.emoji}</div>
                  <div className="carousel-overlay">
                    <div className="slide-tag">{s.tag}</div>
                    <div className="slide-title">{s.title}</div>
                    <div className="slide-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-dots">
              {SLIDES.map((_,i) => (
                <div key={i} className={`dot${slide===i?" active":""}`} onClick={()=>setSlide(i)} />
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="search-wrap">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search dishes..." value={search} onChange={e=>setSearch(e.target.value)} />
              {search && <span style={{cursor:"pointer",color:"var(--muted)",fontSize:13}} onClick={()=>setSearch("")}>✕</span>}
            </div>
            <button className="filter-btn">⚙️</button>
          </div>

          {/* Categories */}
          <div className="category-scroll">
            {CATS.map(c => (
              <button key={c.id} className={`cat-pill${cat===c.id?" active":""}`} onClick={()=>setCat(c.id)}>
                <span>{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>

          {/* Section header */}
          <div className="section-header">
            <div className="section-title">{cat==="all" ? "All Dishes" : CATS.find(c=>c.id===cat)?.label}</div>
            <span className="section-count">{filtered.length} item{filtered.length!==1?"s":""}</span>
          </div>

          {/* Menu grid */}
          <div className="menu-grid">
            {filtered.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">🍽️</div>
                <div className="empty-text">Nothing found</div>
                <div className="empty-sub">Try a different search or category</div>
              </div>
            ) : filtered.map((item,idx) => (
              <div key={item.id} className="menu-card" style={{animationDelay:`${idx*40}ms`}}>
                <div className="menu-card-img">{item.emoji}</div>
                <div className="menu-card-body">
                  <div className={`veg-indicator ${item.veg?"veg":"nonveg"}`}><div className="veg-dot"/></div>
                  {item.pop && <div className="popular-badge">⭐ Popular</div>}
                  <div className="menu-card-name">{item.name}</div>
                  <div className="menu-card-desc">{item.desc}</div>
                  <div className="menu-card-footer">
                    <div className="menu-card-price">{fmt(item.price)}</div>
                    {!cart[item.id] ? (
                      <button className="add-btn" onClick={()=>add(item.id)}>Add</button>
                    ) : (
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={()=>remove(item.id)}>−</button>
                        <span className="qty-num">{cart[item.id]}</span>
                        <button className="qty-btn" onClick={()=>add(item.id)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SIDEBAR (desktop only) ══ */}
        <div className="side-col">
          {/* Restaurant card */}
          <div className="restaurant-card">
            <div className="restaurant-hero">🍽️</div>
            <div className="restaurant-body">
              <div className="restaurant-name">Mix & Munch, Sharjah City Centre</div>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[["🕐","6:00 AM – 11:00 PM"],["🛵","~25 min delivery"],["💰","AED 20 min. order"],["⭐","4.8 · 2,100+ reviews"]].map(([icon,text])=>(
                  <div key={text} className="meta-row"><span>{icon}</span><span>{text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart panel */}
          <div className="cart-panel">
            <div className="cart-panel-header">
              <div className="cart-panel-title">Your Order</div>
              {cartCount > 0 && <div className="cart-panel-count">{cartCount} item{cartCount!==1?"s":""}</div>}
            </div>

            {cartCount === 0 ? (
              <div className="cart-panel-empty">
                <div className="cp-empty-icon">🛒</div>
                <div className="cp-empty-text">Cart is empty</div>
                <div className="cp-empty-sub">Add items from the menu</div>
              </div>
            ) : (
              <>
                <div className="cart-panel-items">
                  {Object.entries(cart).map(([id,qty]) => {
                    const it=MENU.find(i=>i.id===+id); if(!it) return null;
                    return (
                      <div key={id} className="cp-item">
                        <span className="cp-emoji">{it.emoji}</span>
                        <div className="cp-info">
                          <div className="cp-name">{it.name}</div>
                          <div className="cp-price">{fmt(it.price)} × {qty}</div>
                        </div>
                        <div className="cp-right">
                          <div className="cp-total">{fmt(it.price*qty)}</div>
                          <div className="cp-qty">
                            <button className="cp-qty-btn" onClick={()=>remove(+id)}>−</button>
                            <span className="cp-qty-num">{qty}</span>
                            <button className="cp-qty-btn" onClick={()=>add(+id)}>+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="cp-promo">
                  <input className="promo-input" placeholder="PROMO CODE" value={promoInput}
                    onChange={e=>{ setPromoInput(e.target.value.toUpperCase()); setPromoMsg(null); }} />
                  <button className="promo-apply-btn" onClick={applyPromo}>Apply</button>
                </div>
                {promoMsg && <div className="promo-msg" style={{color:promoMsg.ok?"#2E7D32":"var(--brand)"}}>{promoMsg.text}</div>}

                <div className="cp-bill"><BillRows /></div>

                {mode==="Delivery" && (
                  <div style={{padding:"10px 16px 0",display:"flex",alignItems:"center",gap:8,borderTop:"1px solid var(--border)"}}>
                    <span style={{fontSize:18}}>{currentAddr?.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--dark)"}}>{currentAddr?.label}</div>
                      <div style={{fontSize:11,color:"var(--warm-gray)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentAddr?.text}</div>
                    </div>
                    <button style={{fontSize:11,color:"var(--brand)",background:"none",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"var(--font-body)",flexShrink:0}}
                      onClick={()=>{setDrawer("profile");setProfileTab("addresses");}}>Change</button>
                  </div>
                )}
                <button className="cp-checkout-btn" onClick={placeOrder}>
                  <span>Place Order →</span><span>{fmt(totalWithVAT)}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE CART BAR ── */}
      {cartCount > 0 && (
        <div className="mobile-cart-bar" onClick={()=>setDrawer("cart")}>
          <span className="mcb-icon">🛒</span>
          <div className="mcb-info">
            <div className="mcb-count">{cartCount} item{cartCount!==1?"s":""} in cart</div>
            <div className="mcb-label">View Order</div>
          </div>
          <span className="mcb-total">{fmt(itemTotal)}</span>
          <span className="mcb-arrow">›</span>
        </div>
      )}

      {/* ══ DRAWERS ══ */}
      {drawer && (
        <>
          <div className="drawer-overlay" onClick={()=>setDrawer(null)} />
          <div className="drawer">
            <div className="drawer-handle" />

            {/* CART DRAWER */}
            {drawer==="cart" && (
              <>
                <div className="drawer-header">
                  <div className="drawer-title">Your Cart</div>
                  <button className="close-btn" onClick={()=>setDrawer(null)}>✕</button>
                </div>
                {cartCount===0 ? (
                  <div className="cart-panel-empty" style={{padding:"40px 20px"}}>
                    <div className="cp-empty-icon">🛒</div>
                    <div className="cp-empty-text">Cart is empty</div>
                    <div className="cp-empty-sub">Add some delicious items!</div>
                  </div>
                ) : (
                  <>
                    <div className="drawer-items">
                      {Object.entries(cart).map(([id,qty]) => {
                        const it=MENU.find(i=>i.id===+id); if(!it) return null;
                        return (
                          <div key={id} className="d-item">
                            <span className="d-emoji">{it.emoji}</span>
                            <div className="d-info"><div className="d-name">{it.name}</div><div className="d-price">{fmt(it.price)} × {qty}</div></div>
                            <div className="d-right">
                              <div className="d-total">{fmt(it.price*qty)}</div>
                              <div className="qty-ctrl">
                                <button className="qty-btn" onClick={()=>remove(+id)}>−</button>
                                <span className="qty-num">{qty}</span>
                                <button className="qty-btn" onClick={()=>add(+id)}>+</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="drawer-promo">
                      <div className="section-label">Promo Code</div>
                      <div className="promo-row">
                        <input className="promo-input" placeholder="ENTER CODE" value={promoInput}
                          onChange={e=>{ setPromoInput(e.target.value.toUpperCase()); setPromoMsg(null); }} />
                        <button className="promo-apply-btn" onClick={applyPromo}>Apply</button>
                      </div>
                      {promoMsg && <div className="promo-msg-drawer" style={{color:promoMsg.ok?"#2E7D32":"var(--brand)"}}>{promoMsg.text}</div>}
                    </div>
                    <div className="drawer-bill">
                      <div className="section-label">Bill Details</div>
                      <BillRows />
                    </div>
                    <div className="drawer-pay">
                      <div className="section-label">Payment</div>
                      {[{id:"cash",icon:"💵",name:"Cash on Delivery"},{id:"card",icon:"💳",name:"Card Machine"},{id:"online",icon:"📱",name:"Online Payment"}].map(p=>(
                        <div key={p.id} className={`pay-option${payMethod===p.id?" selected":""}`} onClick={()=>setPayMethod(p.id)}>
                          <div className="pay-radio"><div className="pay-dot"/></div>
                          <span className="pay-icon">{p.icon}</span>
                          <span className="pay-name">{p.name}</span>
                        </div>
                      ))}
                    </div>
                    {mode==="Delivery" && (
                      <div style={{padding:"0 20px 14px",display:"flex",alignItems:"center",gap:10,borderTop:"1px solid var(--border)",paddingTop:14}}>
                        <span style={{fontSize:20}}>{currentAddr?.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:700,color:"var(--dark)"}}>{currentAddr?.label}</div>
                          <div style={{fontSize:12,color:"var(--warm-gray)"}}>{currentAddr?.text}</div>
                        </div>
                        <button style={{fontSize:12,color:"var(--brand)",background:"none",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"var(--font-body)",flexShrink:0}}
                          onClick={()=>{setDrawer("profile");setProfileTab("addresses");}}>Change</button>
                      </div>
                    )}
                    <button className="place-order-btn" onClick={placeOrder}>
                      <span>Place Order →</span>
                      <span style={{fontFamily:"var(--font-mono)"}}>{fmt(totalWithVAT)}</span>
                    </button>
                  </>
                )}
              </>
            )}

            {/* PROFILE DRAWER */}
            {drawer==="profile" && (
              <>
                <div className="drawer-header">
                  <div className="drawer-title">My Profile</div>
                  <button className="close-btn" onClick={()=>setDrawer(null)}>✕</button>
                </div>
                <div className="tab-bar">
                  {[["info","👤 Info"],["addresses","📍 Addresses"],["orders","📋 Orders"]].map(([t,l])=>(
                    <button key={t} className={`tab-btn${profileTab===t?" active":""}`} onClick={()=>setProfileTab(t)}>{l}</button>
                  ))}
                </div>

                {profileTab==="info" && (
                  <div className="profile-section">
                    <div className="profile-row">
                      <div className="profile-avatar">{profile.name ? profile.name[0].toUpperCase() : "👤"}</div>
                      <div>
                        <div className="profile-display-name">{profile.name||"Your Name"}</div>
                        <div className="profile-sub">{profile.phone||"Add phone number"}</div>
                      </div>
                    </div>
                    {[["Full Name","name","Enter your name","text"],["Phone Number","phone","+971 50 000 0000","tel"],["Email","email","you@example.com","email"]].map(([label,key,ph,type])=>(
                      <div key={key} className="form-group">
                        <label className="form-label">{label}</label>
                        <input className="form-input" type={type} placeholder={ph} value={profile[key]} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))} />
                      </div>
                    ))}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Flat / Unit</label>
                        <input className="form-input" placeholder="Flat 12A" value={profile.flat} onChange={e=>setProfile(p=>({...p,flat:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Building</label>
                        <input className="form-input" placeholder="Building name" value={profile.building} onChange={e=>setProfile(p=>({...p,building:e.target.value}))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Area / Landmark</label>
                      <input className="form-input" placeholder="Nearest landmark or area" value={profile.area} onChange={e=>setProfile(p=>({...p,area:e.target.value}))} />
                    </div>
                  </div>
                )}

                {profileTab==="addresses" && (
                  <div className="addresses-wrap">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`address-card${selectedAddrId===addr.id?" selected":""}`} onClick={()=>setSelectedAddrId(addr.id)}>
                        <div className="addr-header">
                          <span className="addr-icon">{addr.icon}</span>
                          <span className="addr-label">{addr.label}</span>
                          {addr.default && <span className="addr-default-badge">Default</span>}
                        </div>
                        <div className="addr-text">{addr.text}</div>
                        <div className="addr-actions">
                          <button className="addr-btn" onClick={e=>{e.stopPropagation();setEditingAddr(addr);setMapInput(addr.text);setShowMap(true);}}>✏️ Edit</button>
                          <button className="addr-btn" onClick={e=>{e.stopPropagation();setAddresses(a=>a.map(x=>({...x,default:x.id===addr.id})));}}>⭐ Set Default</button>
                          {addresses.length>1 && <button className="addr-btn del" onClick={e=>{e.stopPropagation();setAddresses(a=>a.filter(x=>x.id!==addr.id));}}>🗑 Delete</button>}
                        </div>
                      </div>
                    ))}
                    <button className="add-addr-btn" onClick={()=>{setEditingAddr({label:"New Address",icon:"📍"});setMapInput("");setShowMap(true);}}>
                      <span style={{fontSize:18}}>＋</span> Add New Address
                    </button>
                  </div>
                )}

                {profileTab==="orders" && (
                  <div style={{padding:"0 20px 24px"}}>
                    {orderPlaced ? (
                      <div style={{background:"var(--brand-bg)",border:"1.5px solid rgba(232,52,10,.2)",borderRadius:"var(--radius-sm)",padding:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                          <span style={{fontSize:24}}>🎉</span>
                          <div>
                            <div style={{fontSize:14,fontWeight:700,color:"var(--dark)"}}>Order #{orderPlaced.id}</div>
                            <div style={{fontSize:12,color:"var(--warm-gray)"}}>Placed at {orderPlaced.time}</div>
                          </div>
                        </div>
                        <button className="addr-btn" onClick={()=>setDrawer("track")}>📦 Track Order →</button>
                      </div>
                    ) : (
                      <div style={{textAlign:"center",padding:"40px 0"}}>
                        <div style={{fontSize:48,marginBottom:10}}>📋</div>
                        <div style={{fontSize:15,fontWeight:600,color:"var(--charcoal)"}}>No orders yet</div>
                        <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Your order history will appear here</div>
                      </div>
                    )}
                  </div>
                )}

                {profileTab==="info" && <button className="save-btn" onClick={()=>setDrawer(null)}>Save Profile ✓</button>}
              </>
            )}

            {/* TRACKING DRAWER */}
            {drawer==="track" && orderPlaced && (
              <>
                <div className="drawer-header">
                  <div className="drawer-title">Track Order</div>
                  <button className="close-btn" onClick={()=>setDrawer(null)}>✕</button>
                </div>
                <div className="tracking-wrap">
                  <div className="order-id-label">Order #{orderPlaced.id}</div>
                  <TrackingSteps time={orderPlaced.time} />
                  <button className="wa-btn">💬 Get Order Updates on WhatsApp</button>
                  <div className="delivery-info">
                    <div className="di-title">🏪 Mix & Munch, Sharjah City Centre</div>
                    <div className="di-row"><span className="di-icon">📍</span><span>789 Sharjah City Centre, Sharjah</span></div>
                    <div className="di-row"><span className="di-icon">🛵</span><span>{currentAddr?.text}</span></div>
                    <div className="di-row"><span className="di-icon">🕐</span><span>Placed {new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}, {orderPlaced.time}</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ── MAP MODAL ── */}
      {showMap && (
        <div className="map-modal" onClick={e=>e.target===e.currentTarget&&setShowMap(false)}>
          <div className="map-sheet">
            <div className="drawer-handle" />
            <div className="drawer-header">
              <div className="drawer-title">{editingAddr?.id?"Edit":"Add"} Address</div>
              <button className="close-btn" onClick={()=>setShowMap(false)}>✕</button>
            </div>
            <div className="map-view">
              <div className="map-grid"/>
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.28}} viewBox="0 0 400 230">
                <line x1="0" y1="85"  x2="400" y2="85"  stroke="#90CAF9" strokeWidth="8"/>
                <line x1="0" y1="155" x2="400" y2="155" stroke="#90CAF9" strokeWidth="5"/>
                <line x1="85"  y1="0" x2="85"  y2="230" stroke="#90CAF9" strokeWidth="6"/>
                <line x1="225" y1="0" x2="225" y2="230" stroke="#90CAF9" strokeWidth="4"/>
                <line x1="305" y1="0" x2="305" y2="230" stroke="#90CAF9" strokeWidth="3"/>
                <rect x="95"  y="95"  width="60" height="45" fill="#A5D6A7" rx="4"/>
                <rect x="165" y="95"  width="50" height="45" fill="#FFCC80" rx="4"/>
                <rect x="235" y="100" width="55" height="40" fill="#B3E5FC" rx="4"/>
                <rect x="95"  y="28"  width="50" height="50" fill="#FFCC80" rx="4"/>
                <rect x="155" y="28"  width="60" height="50" fill="#A5D6A7" rx="4"/>
              </svg>
              <div className="map-pin">📍</div>
              <div className="map-zoom">
                <button className="map-zoom-btn">+</button>
                <button className="map-zoom-btn">−</button>
                <button className="map-zoom-btn">🧭</button>
              </div>
            </div>
            <div className="map-form">
              <div className="form-group">
                <div className="form-label">Label</div>
                <div className="label-pills">
                  {[["🏠","Home"],["🏢","Work"],["📍","Other"]].map(([icon,label])=>(
                    <button key={label} className={`label-pill${editingAddr?.label===label?" active":""}`}
                      onClick={()=>setEditingAddr(e=>({...e,icon,label}))}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label">Full Address</div>
                <input className="form-input" placeholder="Enter address or directions..."
                  value={mapInput} onChange={e=>setMapInput(e.target.value)} />
              </div>
              <div className="form-group">
                <div className="form-label">Additional Instructions</div>
                <input className="form-input" placeholder="Building name, floor, landmark..." />
              </div>
              <button className="map-confirm-btn" onClick={saveAddr}>Confirm Location ✓</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Tracking Steps ───────────────────────────────────────────────────────────
function TrackingSteps({ time }) {
  const [step, setStep] = useState(1);
  useEffect(() => {
    let i = 1;
    const t = setInterval(() => { i++; setStep(i); if (i >= 4) clearInterval(t); }, 3000);
    return () => clearInterval(t);
  }, []);
  const STEPS = [
    { label:"Your order has been placed!", icon:"✅" },
    { label:"Waiting for restaurant to accept", icon:"🍴" },
    { label:"Your food is being prepared", icon:"👨‍🍳" },
    { label:"Order arriving soon!", icon:"🛵" },
  ];
  return (
    <div className="tracking-steps">
      {STEPS.map((s,i) => {
        const done=i<step, active=i===step, pending=i>step;
        return (
          <div key={i} className="t-step">
            <div className="t-line">
              <div className={`t-dot ${done?"done":active?"active":"pending"}`}>{done?"✓":active?"…":i+1}</div>
              {i<STEPS.length-1 && <div className={`t-conn ${done?"done":"pending"}`}/>}
            </div>
            <div style={{paddingTop:2}}>
              <div className={`t-label${pending?" pending":""}`}>{s.icon} {s.label}</div>
              {done && <div className="t-time">{time}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}