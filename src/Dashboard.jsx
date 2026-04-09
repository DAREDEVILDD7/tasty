import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "./supabaseClient";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const LIGHT = {
  bg: "#F7F5F0",
  surface: "#FFFFFF",
  surface2: "#F0EDE6",
  border: "#E4DFD6",
  border2: "#D6D0C6",
  muted: "#B0A898",
  subtle: "#6E6558",
  text: "#1C1A16",
  accent: "#C4711A",
  accentHover: "#A85E12",
  accentBg: "rgba(196,113,26,0.08)",
  accentBorder: "rgba(196,113,26,0.30)",
  scrollTrack: "#F0EDE6",
  scrollThumb: "#D6D0C6",
  toggleOff: "#D6D0C6",
  green: "#2D7A4F",
  greenBg: "#EBF5EF",
  greenBorder: "#B8DEC9",
  red: "#B83232",
};

const DARK = {
  bg: "#111210",
  surface: "#1A1917",
  surface2: "#222120",
  border: "#2C2A27",
  border2: "#363330",
  muted: "#4A4740",
  subtle: "#7A7568",
  text: "#F0EAD8",
  accent: "#D4821E",
  accentHover: "#E8911A",
  accentBg: "rgba(212,130,30,0.10)",
  accentBorder: "rgba(212,130,30,0.35)",
  scrollTrack: "#1A1917",
  scrollThumb: "#363330",
  toggleOff: "#363330",
  green: "#4ade80",
  greenBg: "#0a1f10",
  greenBorder: "#1a4d25",
  red: "#f87171",
};

// ─── Static data ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: "⊞", label: "Home", id: "home" },
  { icon: "🛒", label: "Orders", id: "orders" },
  { icon: "📖", label: "Menu", id: "menu" },
  { icon: "👤", label: "Customers", id: "customers" },
  { icon: "🏷️", label: "Discounts", id: "discounts" },
  { icon: "✕", label: "Cancellations", id: "cancellations" },
  { icon: "📡", label: "Broadcast", id: "broadcast" },
  { icon: "💬", label: "Inbox", id: "inbox", badge: 3 },
  { icon: "🚴", label: "Delivery", id: "delivery" },
  { icon: "⭐", label: "Reviews", id: "reviews", badge: 0 },
];

const STAT_CARDS = [
  {
    icon: "🛒",
    label: "Total Accepted Orders",
    value: "22",
    sub: "↗ 15% from yesterday",
    green: true,
  },
  {
    icon: "💰",
    label: "Total Revenue",
    value: "AED 3,399",
    sub: "↗ 8% from yesterday",
    green: true,
  },
  {
    icon: "💎",
    label: "Revenue saved by FeastRush",
    value: "AED 120.00",
    sub: "0% change from yesterday",
  },
  {
    icon: "👥",
    label: "Customers",
    value: "18",
    sub: "↗ 3% from yesterday",
    green: true,
  },
  {
    icon: "⏱️",
    label: "Total Delayed Orders",
    value: "2",
    sub: "0 order(s) less from yesterday",
    green: true,
  },
];

const TOP_ITEMS = [
  { rank: 1, name: "Hrishi's Chicken Fried Rice", count: 51, emoji: "🍚" },
  { rank: 2, name: "Ramen", count: 17, emoji: "🍜" },
  { rank: 3, name: "Ethan's Smashed Beef Burger", count: 12, emoji: "🍔" },
  { rank: 4, name: "Chatti Chor", count: 11, emoji: "🍛" },
  { rank: 5, name: "UAE's Best Karak", count: 8, emoji: "☕" },
  { rank: 6, name: "Deepesh's Palak Chicken", count: 3, emoji: "🍗" },
  { rank: 7, name: "Masala Dosa", count: 2, emoji: "🥞" },
  { rank: 8, name: "Mango Lassi", count: 1, emoji: "🥭" },
];

const TOP_CUSTOMERS = [
  { name: "Hrishi Uralath", value: "AED 2,651" },
  { name: "Sara Ahmed", value: "AED 603" },
  { name: "Sreeparvathy", value: "AED 95" },
  { name: "Deepesh Raul", value: "AED 50" },
  { name: "Ethan Clark", value: "AED 40" },
];

const PAYMENT_DATA = [
  { label: "Cash", count: 5, color: "#C4711A" },
  { label: "Card", count: 17, color: "#2D7A4F" },
  { label: "Online", count: 0, color: "#B0A898" },
];

const ORDER_TYPE_DATA = [
  { label: "Delivery", count: 21, color: "#C4711A" },
  { label: "Pickup", count: 1, color: "#2D7A4F" },
];

const ZONES = [
  { label: "Zone 1", count: 21, color: "#C4711A" },
  { label: "Zone 2", count: 1, color: "#2D7A4F" },
];

const PEAK_DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  return {
    label: `${d.getDate()}/${d.getMonth() + 1}`,
    orders: Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
  };
});

const BEHAVIOR = [
  {
    icon: "👁️",
    label: "Total Users Landed on Menu",
    value: "109",
    sub: "↘ 13% decrease from last quarter",
    red: true,
  },
  {
    icon: "💬",
    label: "WhatsApp Conversations Started",
    value: "80",
    sub: "↗ 3% increase from last quarter",
    green: true,
  },
];

const TOP_ADDED = [
  { rank: 1, name: "Hrishi's Chicken Fried Rice", count: 20, emoji: "🍚" },
  { rank: 2, name: "Ramen", count: 8, emoji: "🍜" },
  { rank: 3, name: "Ronaldo's Water", count: 8, emoji: "💧" },
  { rank: 4, name: "UAE's Best Karak", count: 5, emoji: "☕" },
];

const TOP_VIEWED = [
  { rank: 1, name: "Hrishi's Chicken Fried Rice", count: 21, emoji: "🍚" },
  { rank: 2, name: "Ronaldo's Water", count: 9, emoji: "💧" },
  { rank: 3, name: "Ramen", count: 9, emoji: "🍜" },
  { rank: 4, name: "Chatti Chor", count: 4, emoji: "🍛" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, t }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{ background: value ? t.accent : t.toggleOff }}
      className="relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none flex-shrink-0"
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${value ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

function ThemeBtn({ dark, onToggle, t }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: t.surface2,
        border: `1px solid ${t.border2}`,
        color: t.subtle,
      }}
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:opacity-80 active:scale-95 transition-all"
    >
      <span className="text-sm">{dark ? "☀️" : "🌙"}</span>
      <span
        className="text-xs font-medium hidden sm:inline"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        {dark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}

function Modal({ title, onClose, children, t }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          fontFamily: "'Lato', sans-serif",
        }}
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div
          style={{ borderBottom: `1px solid ${t.border}` }}
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        >
          <p
            style={{ color: t.text, fontFamily: "'Cormorant Garamond', serif" }}
            className="text-xl font-bold tracking-wide"
          >
            {title}
          </p>
          <button
            onClick={onClose}
            style={{ color: t.subtle }}
            className="text-lg leading-none hover:opacity-60 transition-opacity w-8 h-8 flex items-center justify-center rounded-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, t }) {
  return (
    <div className="mb-5">
      <label
        style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
        className="text-xs font-semibold tracking-widest uppercase block mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: t.surface2,
          border: `1px solid ${t.border2}`,
          color: t.text,
          fontFamily: "'Lato', sans-serif",
        }}
        className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
      />
    </div>
  );
}

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
function DonutChart({ data, size = 140, thickness = 28 }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let angle = -90;
  const cx = size / 2,
    cy = size / 2,
    r = (size - thickness) / 2;
  const slices = data.map((d) => {
    const pct = d.count / total;
    const start = angle;
    angle += pct * 360;
    return { ...d, pct, start, end: angle };
  });
  const arc = (cx, cy, r, startDeg, endDeg) => {
    const s = startDeg * (Math.PI / 180),
      e = endDeg * (Math.PI / 180);
    const x1 = cx + r * Math.cos(s),
      y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e),
      y2 = cy + r * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2}`;
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="flex-shrink-0"
    >
      {slices.map(
        (s, i) =>
          s.pct > 0 && (
            <path
              key={i}
              d={arc(cx, cy, r, s.start, s.end)}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeLinecap="butt"
            />
          ),
      )}
    </svg>
  );
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function PeakChart({ data, t, height = 120 }) {
  const max = Math.max(...data.map((d) => d.orders), 1);
  const w = 600,
    h = height,
    pad = { l: 32, r: 8, t: 10, b: 28 };
  const iw = w - pad.l - pad.r,
    ih = h - pad.t - pad.b;
  const step = iw / (data.length - 1);
  const pts = data.map((d, i) => ({
    x: pad.l + i * step,
    y: pad.t + ih - (d.orders / max) * ih,
    v: d.orders,
    l: d.label,
  }));
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area =
    `M${pts[0].x},${pad.t + ih} ` +
    pts.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length - 1].x},${pad.t + ih} Z`;
  const yTicks = [0, 1, 2, 3].filter((v) => v <= max);
  return (
    <div className="overflow-x-auto w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ minWidth: 400, width: "100%", height: "auto" }}
        preserveAspectRatio="none"
      >
        {yTicks.map((v) => {
          const y = pad.t + ih - (v / max) * ih;
          return (
            <g key={v}>
              <line
                x1={pad.l}
                y1={y}
                x2={w - pad.r}
                y2={y}
                stroke={t.border}
                strokeWidth="0.8"
              />
              <text
                x={pad.l - 4}
                y={y + 3}
                textAnchor="end"
                fontSize="8"
                fill={t.muted}
              >
                {v}
              </text>
            </g>
          );
        })}
        <path d={area} fill={t.accent} fillOpacity="0.07" />
        <polyline
          points={polyline}
          fill="none"
          stroke={t.accent}
          strokeWidth="2"
        />
        {pts.map(
          (p, i) =>
            p.v > 0 && (
              <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={t.accent} />
            ),
        )}
        {pts
          .filter((_, i) => i % 5 === 0 || i === pts.length - 1)
          .map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={h - 4}
              textAnchor="middle"
              fontSize="7"
              fill={t.muted}
            >
              {p.l}
            </text>
          ))}
      </svg>
    </div>
  );
}

// ─── Drag hook ────────────────────────────────────────────────────────────────
function useTouchDrag(items, setItems, getId) {
  const itemRefs = useRef({});

  const drag = useRef({
    active: false,
    dragId: null,
    startY: 0,
    isDragging: false,
  });

  const setItemsRef = useRef(setItems);
  const getIdRef = useRef(getId);
  useEffect(() => {
    setItemsRef.current = setItems;
  }, [setItems]);
  useEffect(() => {
    getIdRef.current = getId;
  }, [getId]);

  const applyStyle = (id, on) => {
    const el = itemRefs.current[id];
    if (!el) return;
    el.style.opacity = on ? "0.45" : "";
    el.style.transform = on ? "scale(0.975)" : "";
    el.style.transition = on ? "none" : "";
    el.style.zIndex = on ? "20" : "";
  };

  useEffect(() => {
    const THRESHOLD = 6;

    const onMove = (e) => {
      const d = drag.current;
      if (!d.active) return;

      const dy = Math.abs(e.clientY - d.startY);

      if (!d.isDragging) {
        if (dy < THRESHOLD) return;
        d.isDragging = true;
        applyStyle(d.dragId, true);
      }

      e.preventDefault();

      const cy = e.clientY;
      let overId = null;
      for (const [id, el] of Object.entries(itemRefs.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (cy >= r.top && cy <= r.bottom) {
          overId = id;
          break;
        }
      }

      if (overId && overId !== d.dragId) {
        setItemsRef.current((prev) => {
          const from = prev.findIndex((x) => getIdRef.current(x) === d.dragId);
          const to = prev.findIndex((x) => getIdRef.current(x) === overId);
          if (from === -1 || to === -1 || from === to) return prev;
          const next = [...prev];
          const [m] = next.splice(from, 1);
          next.splice(to, 0, m);
          return next;
        });
      }
    };

    const onEnd = () => {
      const d = drag.current;
      if (!d.active) return;
      if (d.isDragging) applyStyle(d.dragId, false);
      drag.current = {
        active: false,
        dragId: null,
        startY: 0,
        isDragging: false,
      };
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
  }, []);

  const onPointerDown = useCallback((id, e) => {
    if (e.button && e.button !== 0) return;
    drag.current = {
      active: true,
      dragId: id,
      startY: e.clientY,
      isDragging: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  }, []);

  return { itemRefs, onPointerDown };
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ card, t }) {
  return (
    <div
      style={{ background: t.surface, border: `1px solid ${t.border}` }}
      className="rounded-xl p-5 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          style={{ background: t.surface2, border: `1px solid ${t.border}` }}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        >
          {card.icon}
        </div>
        <span
          style={{ color: card.green ? t.green : card.red ? t.red : t.muted }}
          className="text-xs font-semibold mt-1"
        >
          {card.sub.split(" ")[0]}
        </span>
      </div>
      <p
        style={{ fontFamily: "'Cormorant Garamond', serif", color: t.text }}
        className="text-3xl font-bold mb-1 leading-none"
      >
        {card.value}
      </p>
      <p
        style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
        className="text-xs leading-snug mt-2"
      >
        {card.label}
      </p>
      <p
        style={{ color: card.green ? t.green : card.red ? t.red : t.muted }}
        className="text-xs mt-1 font-medium"
      >
        {card.sub}
      </p>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ t }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("Today");
  const [custFilter, setCustFilter] = useState("Sales based");

  const maxItem = TOP_ITEMS[0].count;
  const totalPay = PAYMENT_DATA.reduce((s, d) => s + d.count, 0);
  const totalType = ORDER_TYPE_DATA.reduce((s, d) => s + d.count, 0);
  const totalZone = ZONES.reduce((s, d) => s + d.count, 0);

  return (
    <div className="p-5 md:p-8 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif", color: t.text }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Dashboard
          </h1>
          <p
            style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
            className="text-sm mt-0.5"
          >
            Welcome back — here's what's happening today
          </p>
        </div>
        <button
          style={{
            background: t.accent,
            color: "#fff",
            fontFamily: "'Lato', sans-serif",
          }}
          className="text-xs font-semibold px-4 py-2.5 rounded-lg tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          Z-Report 📋
        </button>
      </div>

      <div
        style={{ borderBottom: `1px solid ${t.border}` }}
        className="flex items-center justify-between"
      >
        <div className="flex gap-6">
          {["overview", "sales"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                color: activeTab === tab ? t.accent : t.subtle,
                borderBottomColor: activeTab === tab ? t.accent : "transparent",
                fontFamily: "'Lato', sans-serif",
              }}
              className="pb-3 text-sm font-semibold tracking-wide capitalize border-b-2 transition-colors"
            >
              {tab}
            </button>
          ))}
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            background: t.surface2,
            border: `1px solid ${t.border2}`,
            color: t.text,
            fontFamily: "'Lato', sans-serif",
          }}
          className="text-sm rounded-lg px-3 py-2 outline-none mb-2 cursor-pointer font-medium"
        >
          {["Today", "Yesterday", "This Week", "This Month"].map((p) => (
            <option key={p} value={p} style={{ background: t.surface2 }}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p
          style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
          className="text-xs font-bold tracking-widest uppercase mb-4"
        >
          Sales Analytics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map((card, i) => (
            <StatCard key={i} card={card} t={t} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
          className="rounded-xl overflow-hidden"
        >
          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="px-5 py-4"
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: t.text,
              }}
              className="text-lg font-bold"
            >
              Top Selling Items
            </p>
          </div>
          <div className="p-5 space-y-3">
            {TOP_ITEMS.map((item) => (
              <div key={item.rank} className="flex items-center gap-3">
                <span
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs font-bold w-5 text-right flex-shrink-0"
                >
                  {item.rank}
                </span>
                <span className="text-base flex-shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p
                      style={{
                        color: t.text,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm font-semibold truncate pr-2"
                    >
                      {item.name}
                    </p>
                    <span
                      style={{
                        color: t.accent,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm font-bold flex-shrink-0"
                    >
                      {item.count}
                    </span>
                  </div>
                  <div
                    style={{ background: t.surface2 }}
                    className="h-1.5 rounded-full overflow-hidden"
                  >
                    <div
                      style={{
                        width: `${(item.count / maxItem) * 100}%`,
                        background: t.accent,
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
          className="rounded-xl overflow-hidden"
        >
          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="px-5 py-4 flex items-center justify-between"
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: t.text,
              }}
              className="text-lg font-bold"
            >
              Top Customers
            </p>
            <select
              value={custFilter}
              onChange={(e) => setCustFilter(e.target.value)}
              style={{
                background: t.surface2,
                border: `1px solid ${t.border2}`,
                color: t.text,
                fontFamily: "'Lato', sans-serif",
              }}
              className="text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer font-medium"
            >
              {["Sales based", "Order based"].map((f) => (
                <option key={f} value={f} style={{ background: t.surface2 }}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 space-y-2">
            {TOP_CUSTOMERS.map((c, i) => (
              <div
                key={i}
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-3"
              >
                <div
                  style={{
                    background: t.accentBg,
                    border: `1px solid ${t.accentBorder}`,
                    color: t.accent,
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                >
                  {c.name.charAt(0)}
                </div>
                <p
                  style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-semibold flex-1"
                >
                  {c.name}
                </p>
                <p
                  style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-bold flex-shrink-0"
                >
                  {c.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{ background: t.surface, border: `1px solid ${t.border}` }}
        className="rounded-xl overflow-hidden"
      >
        <div
          style={{ borderBottom: `1px solid ${t.border}` }}
          className="px-5 py-4"
        >
          <p
            style={{ fontFamily: "'Cormorant Garamond', serif", color: t.text }}
            className="text-lg font-bold"
          >
            Ordering Zones
          </p>
        </div>
        <div className="p-5 flex flex-col sm:flex-row items-center gap-8">
          <DonutChart data={ZONES} size={150} thickness={32} />
          <div className="flex-1 w-full space-y-4">
            {ZONES.map((z, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  style={{ background: z.color }}
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                />
                <p
                  style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-semibold flex-1"
                >
                  {z.label}
                </p>
                <p
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm"
                >
                  {z.count} orders
                </p>
                <div
                  style={{ background: t.surface2 }}
                  className="w-28 h-2 rounded-full overflow-hidden"
                >
                  <div
                    style={{
                      width: `${(z.count / totalZone) * 100}%`,
                      background: z.color,
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: "Payment Modes",
            data: PAYMENT_DATA,
            total: totalPay,
            sub: "Total Transactions",
          },
          {
            title: "Orders By Type",
            data: ORDER_TYPE_DATA,
            total: totalType,
            sub: "Total Orders",
          },
        ].map(({ title, data, total, sub }) => (
          <div
            key={title}
            style={{ background: t.surface, border: `1px solid ${t.border}` }}
            className="rounded-xl overflow-hidden"
          >
            <div
              style={{ borderBottom: `1px solid ${t.border}` }}
              className="px-5 py-4"
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: t.text,
                }}
                className="text-lg font-bold"
              >
                {title}
              </p>
            </div>
            <div className="p-5 flex items-center gap-6">
              <div className="flex-shrink-0">
                <DonutChart data={data} size={130} thickness={28} />
              </div>
              <div className="flex-1 space-y-2.5">
                <div className="mb-3">
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: t.text,
                    }}
                    className="text-3xl font-bold"
                  >
                    {total}
                  </p>
                  <p
                    style={{
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-medium mt-0.5"
                  >
                    {sub}
                  </p>
                </div>
                {data.map((d, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span
                      style={{ background: d.color }}
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    />
                    <p
                      style={{
                        color: t.text,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm"
                    >
                      {d.label} —{" "}
                      <span style={{ color: t.accent }} className="font-bold">
                        {d.count}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ background: t.surface, border: `1px solid ${t.border}` }}
        className="rounded-xl overflow-hidden"
      >
        <div
          style={{ borderBottom: `1px solid ${t.border}` }}
          className="px-5 py-4 flex items-center justify-between flex-wrap gap-2"
        >
          <p
            style={{ fontFamily: "'Cormorant Garamond', serif", color: t.text }}
            className="text-lg font-bold"
          >
            Peak Days
          </p>
          <div className="flex items-center gap-2">
            <span
              style={{ background: t.accent }}
              className="w-4 h-0.5 inline-block rounded-full"
            />
            <p
              style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
              className="text-xs font-medium"
            >
              Orders per day
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 flex items-baseline gap-3">
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: t.text,
              }}
              className="text-3xl font-bold"
            >
              {PEAK_DAYS.reduce((s, d) => s + d.orders, 0)}
            </p>
            <p
              style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
              className="text-sm"
            >
              total orders, last 30 days
            </p>
          </div>
          <PeakChart data={PEAK_DAYS} t={t} />
        </div>
      </div>

      <div>
        <p
          style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
          className="text-xs font-bold tracking-widest uppercase mb-4"
        >
          Customer Behaviour Analytics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {BEHAVIOR.map((b, i) => (
            <div
              key={i}
              style={{ background: t.surface, border: `1px solid ${t.border}` }}
              className="rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{
                    background: t.surface2,
                    border: `1px solid ${t.border2}`,
                  }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                >
                  {b.icon}
                </div>
                <p
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm leading-tight"
                >
                  {b.label}
                </p>
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: t.text,
                }}
                className="text-3xl font-bold mb-1"
              >
                {b.value}
              </p>
              <p
                style={{
                  color: b.green ? t.green : b.red ? t.red : t.muted,
                  fontFamily: "'Lato', sans-serif",
                }}
                className="text-sm font-medium"
              >
                {b.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Top Added to Cart", data: TOP_ADDED },
            { title: "Top Viewed Items", data: TOP_VIEWED },
          ].map(({ title, data }) => (
            <div
              key={title}
              style={{ background: t.surface, border: `1px solid ${t.border}` }}
              className="rounded-xl overflow-hidden"
            >
              <div
                style={{ borderBottom: `1px solid ${t.border}` }}
                className="px-5 py-4"
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: t.text,
                  }}
                  className="text-lg font-bold"
                >
                  {title}
                </p>
              </div>
              <div className="p-4 space-y-2">
                {data.map((item) => (
                  <div
                    key={item.rank}
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border}`,
                    }}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5"
                  >
                    <span
                      style={{
                        color: t.muted,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-xs font-bold w-5 text-right flex-shrink-0"
                    >
                      {item.rank}
                    </span>
                    <span className="text-base flex-shrink-0">
                      {item.emoji}
                    </span>
                    <p
                      style={{
                        color: t.text,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm font-semibold flex-1 truncate"
                    >
                      {item.name}
                    </p>
                    <span
                      style={{
                        color: t.accent,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm font-bold flex-shrink-0"
                    >
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
// ─── Orders helpers ───────────────────────────────────────────────────────────
const fmtKD = (n) => `KD ${Number(n || 0).toFixed(3)}`;
const fmtDate = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString("en-KW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const STATUS_META = {
  pending: { label: "New", color: "#C4711A", bg: "rgba(196,113,26,0.1)" },
  accepted: { label: "Accepted", color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
  preparing: {
    label: "Preparing",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  on_the_way: {
    label: "Out for Delivery",
    color: "#2D7A4F",
    bg: "rgba(45,122,79,0.08)",
  },
  delivered: {
    label: "Delivered",
    color: "#2D7A4F",
    bg: "rgba(45,122,79,0.08)",
  },
  rejected: { label: "Rejected", color: "#B83232", bg: "rgba(184,50,50,0.08)" },
};

// ─── Invoice Generator (opens print dialog with styled HTML) ─────────────────
function printInvoice(order, items, restaurant) {
  const rows = (items || [])
    .map(
      (it) => `
    <tr>
      <td style="padding:8px 12px;color:#555;font-size:13px">${it.quantity}×</td>
      <td style="padding:8px 12px;font-size:13px">
        ${it.menu_name || it.menu_id}
        ${it.item_note ? `<div style="font-size:11px;color:#888;font-style:italic">↳ ${it.item_note}</div>` : ""}
        ${(it.variants || []).map((v) => `<div style="font-size:11px;color:#C4711A">· ${v}</div>`).join("")}
      </td>
      <td style="padding:8px 12px;text-align:right;font-weight:600;font-size:13px">KD ${Number(it.unit_price).toFixed(3)}</td>
      <td style="padding:8px 12px;text-align:right;font-weight:700;font-size:13px">KD ${Number(it.subtotal).toFixed(3)}</td>
    </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Invoice #${order.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a1a;padding:40px;max-width:680px;margin:0 auto}
    .logo{font-size:28px;font-weight:900;color:#C4711A;letter-spacing:-0.5px}
    .tagline{font-size:11px;color:#999;letter-spacing:.12em;text-transform:uppercase;margin-top:2px}
    .divider{border:none;border-top:1px solid #eee;margin:20px 0}
    .header-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}
    .label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin-bottom:4px}
    .value{font-size:14px;font-weight:600;color:#1a1a1a}
    .badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;background:#fff3e0;color:#C4711A;border:1px solid #fed7aa}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    thead th{background:#f9f6f2;padding:10px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#888}
    thead th:nth-child(3),thead th:nth-child(4){text-align:right}
    tbody tr:nth-child(even){background:#fafafa}
    tbody tr:last-child td{border-bottom:1px solid #eee}
    .total-row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#555}
    .total-row.grand{font-size:17px;font-weight:800;color:#1a1a1a;border-top:2px solid #1a1a1a;margin-top:8px;padding-top:12px}
    .footer{text-align:center;font-size:11px;color:#bbb;margin-top:36px;padding-top:20px;border-top:1px solid #eee}
    @media print{body{padding:20px}.no-print{display:none}}
  </style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
    <div>
      <div class="logo">${restaurant?.name || "FeastRush"}</div>
      <div class="tagline">${restaurant?.branch_name || "Restaurant"}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:22px;font-weight:800;color:#1a1a1a">INVOICE</div>
      <div style="font-size:13px;color:#888;margin-top:2px">#${order.id}</div>
      <div class="badge" style="margin-top:6px">${STATUS_META[order.status]?.label || order.status}</div>
    </div>
  </div>
  <hr class="divider">
  <div class="header-grid">
    <div>
      <div class="label">Customer</div>
      <div class="value">${order.cust_name || "—"}</div>
      <div style="font-size:13px;color:#555;margin-top:2px">${order.cust_phone || ""}</div>
    </div>
    <div>
      <div class="label">Order date</div>
      <div class="value">${fmtDate(order.created_at)}</div>
    </div>
    <div>
      <div class="label">Payment method</div>
      <div class="value">${order.payment_method}</div>
    </div>
    <div>
      <div class="label">Payment status</div>
      <div class="value">${order.payment_status || "Pending"}</div>
    </div>
    ${order.delivery_rider_name ? `<div><div class="label">Delivery rider</div><div class="value">${order.delivery_rider_name}</div><div style="font-size:13px;color:#555;margin-top:2px">${order.delivery_rider_phone || ""}</div></div>` : ""}
    ${order.notes ? `<div style="grid-column:1/-1"><div class="label">Order notes</div><div style="font-size:13px;color:#555;font-style:italic">${order.notes}</div></div>` : ""}
  </div>
  <hr class="divider">
  <table>
    <thead><tr><th>Qty</th><th>Item</th><th>Unit price</th><th>Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div style="margin-top:20px;padding:16px 12px;background:#f9f6f2;border-radius:10px">
    <div class="total-row"><span>Subtotal</span><span>KD ${Number(order.total_amount).toFixed(3)}</span></div>
    <div class="total-row grand"><span>Total</span><span>KD ${Number(order.total_amount).toFixed(3)}</span></div>
  </div>
  <div class="footer">Thank you for ordering from ${restaurant?.name || "us"}! · Powered by FeastRush</div>
  <script>window.onload=()=>window.print()</script>
  </body></html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

// ─── OrdersPage (full real-data implementation) ───────────────────────────────
function OrdersPage({ t, user }) {
  const restId = user?.role === "owner" ? user?.main_rest : user?.rest_id;

  // ── State ──────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(null);
  const [orderTab, setOrderTab] = useState("pending"); // pending | accepted | preparing | on_the_way | history
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]); // items for selected order
  const [itemsLoading, setItemsLoading] = useState(false);
  const [mobileView, setMobileView] = useState("list"); // list | detail

  // Action modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectCustom, setRejectCustom] = useState("");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [riderDirect, setRiderDirect] = useState({ name: "", phone: "" });
  const [orderNote, setOrderNote] = useState("");
  const [showAddRider, setShowAddRider] = useState(false);
  const [newRider, setNewRider] = useState({ name: "", phone: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErr, setActionErr] = useState("");

  const REJECT_REASONS = [
    "Item(s) unavailable",
    "Restaurant is closed",
    "Outside delivery zone",
    "Order too large to fulfill",
    "Customer unreachable",
    "Other",
  ];

  // ── Fetch orders ───────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (!restId) {
      setLoading(false);
      setLoadErr("No restaurant linked.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select(
          `id, status, total_amount, payment_method, payment_status, notes, created_at,
                 cust_id, Customer(cust_name, ph_num)`,
        )
        .eq("rest_id", restId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (e) {
      setLoadErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [restId]);

  // ── Fetch riders ───────────────────────────────────────────────────────────
  const fetchRiders = useCallback(async () => {
    if (!restId) return;
    const { data } = await supabase
      .from("Delivery_Riders")
      .select("*")
      .eq("rest_id", restId)
      .eq("active", true)
      .order("name");
    setRiders(data || []);
  }, [restId]);

  // ── Fetch order items ──────────────────────────────────────────────────────
  const fetchOrderItems = useCallback(async (orderId) => {
    setItemsLoading(true);
    try {
      const { data: items, error } = await supabase
        .from("Order_Items")
        .select(
          `id, menu_id, quantity, unit_price, subtotal, item_note, Menu(name)`,
        )
        .eq("order_id", orderId);
      if (error) throw error;

      // Fetch variant option names for each item
      const enriched = await Promise.all(
        (items || []).map(async (it) => {
          const { data: vars } = await supabase
            .from("Order_Item_Variants")
            .select(`variant_opt_id, price_adj, "Variant Options"(name)`)
            .eq("order_item_id", it.id);
          return {
            ...it,
            menu_name: it.Menu?.name || "—",
            variants: (vars || [])
              .map((v) => v["Variant Options"]?.name)
              .filter(Boolean),
          };
        }),
      );
      setOrderItems(enriched);
    } catch (e) {
      console.error("[fetchOrderItems]", e);
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  // ── Real-time subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!restId) return;
    fetchOrders();
    fetchRiders();

    const channel = supabase
      .channel(`orders-rest-${restId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Orders",
          filter: `rest_id=eq.${restId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch with Customer join
            const { data } = await supabase
              .from("Orders")
              .select(
                `id, status, total_amount, payment_method, payment_status, notes, created_at, cust_id, Customer(cust_name, ph_num)`,
              )
              .eq("id", payload.new.id)
              .single();
            if (data) setOrders((prev) => [data, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? { ...o, ...payload.new } : o,
              ),
            );
            // If this is the selected order, update it too
            setSelectedOrder((prev) =>
              prev?.id === payload.new.id ? { ...prev, ...payload.new } : prev,
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restId, fetchOrders, fetchRiders]);

  // ── Select order ───────────────────────────────────────────────────────────
  const selectOrder = (order) => {
    setSelectedOrder(order);
    setMobileView("detail");
    fetchOrderItems(order.id);
    setActionErr("");
  };

  // ── Computed order lists ───────────────────────────────────────────────────
  const byStatus = {
    pending: orders.filter((o) => o.status === "pending"),
    accepted: orders.filter((o) => o.status === "accepted"),
    preparing: orders.filter((o) => o.status === "preparing"),
    on_the_way: orders.filter((o) => o.status === "on_the_way"),
    history: orders.filter((o) => ["delivered", "rejected"].includes(o.status)),
  };
  const displayed = byStatus[orderTab] || [];

  // Count of active orders for header badge
  const activeCount =
    (byStatus.pending?.length || 0) +
    (byStatus.accepted?.length || 0) +
    (byStatus.preparing?.length || 0);

  // ── Status update helper ───────────────────────────────────────────────────
  const updateStatus = async (orderId, newStatus, extraFields = {}) => {
    setActionLoading(true);
    setActionErr("");
    try {
      const { error } = await supabase
        .from("Orders")
        .update({ status: newStatus, ...extraFields })
        .eq("id", orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus, ...extraFields } : o,
        ),
      );
      setSelectedOrder((prev) =>
        prev?.id === orderId
          ? { ...prev, status: newStatus, ...extraFields }
          : prev,
      );
    } catch (e) {
      setActionErr(e.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Accept order ───────────────────────────────────────────────────────────
  const handleAccept = () => updateStatus(selectedOrder.id, "accepted");

  // ── Mark preparing ─────────────────────────────────────────────────────────
  const handlePreparing = () => updateStatus(selectedOrder.id, "preparing");

  // ── Reject order ───────────────────────────────────────────────────────────
  const handleReject = async () => {
    const reason =
      rejectReason === "Other" ? rejectCustom.trim() : rejectReason;
    if (!reason) {
      setActionErr("Please select or enter a rejection reason.");
      return;
    }
    await updateStatus(selectedOrder.id, "rejected", { notes: reason });
    setShowRejectModal(false);
    setRejectReason("");
    setRejectCustom("");
  };

  // ── Save new rider ─────────────────────────────────────────────────────────
  const handleSaveRider = async () => {
    if (!newRider.name.trim() || !newRider.phone.trim()) {
      setActionErr("Rider name and phone are required.");
      return;
    }
    setActionLoading(true);
    setActionErr("");
    try {
      const { data, error } = await supabase
        .from("Delivery_Riders")
        .insert({
          rest_id: restId,
          name: newRider.name.trim(),
          phone: newRider.phone.trim(),
          active: true,
        })
        .select()
        .single();
      if (error) throw error;
      setRiders((prev) => [...prev, data]);
      setSelectedRider(data);
      setNewRider({ name: "", phone: "" });
      setShowAddRider(false);
    } catch (e) {
      setActionErr(e.message || "Failed to save rider.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Send for delivery ──────────────────────────────────────────────────────
  const handleSendDelivery = async () => {
    const riderName = selectedRider
      ? selectedRider.name
      : riderDirect.name.trim();
    const riderPhone = selectedRider
      ? selectedRider.phone
      : riderDirect.phone.trim();
    if (!riderName) {
      setActionErr("Please select or enter a delivery rider.");
      return;
    }

    await updateStatus(selectedOrder.id, "on_the_way", {
      notes: orderNote || selectedOrder.notes || "",
      delivery_rider_name: riderName,
      delivery_rider_phone: riderPhone,
    });
    setShowDeliveryModal(false);
    setSelectedRider(null);
    setRiderDirect({ name: "", phone: "" });
    setOrderNote("");
  };

  // ── Mark delivered ─────────────────────────────────────────────────────────
  const handleDelivered = () => updateStatus(selectedOrder.id, "delivered");

  // ─── OrderCard ─────────────────────────────────────────────────────────────
  const OrderCard = ({ order }) => {
    const meta = STATUS_META[order.status] || STATUS_META.pending;
    const custName = order.Customer?.cust_name || "Customer";
    const isSelected = selectedOrder?.id === order.id;
    return (
      <button
        onClick={() => selectOrder(order)}
        style={{
          background: isSelected ? t.accentBg : t.surface,
          border: `1px solid ${isSelected ? t.accentBorder : t.border}`,
          textAlign: "left",
          width: "100%",
        }}
        className="rounded-xl p-3.5 transition-all duration-150 hover:shadow-sm active:scale-[0.98]"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span
            style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
            className="text-xs"
          >
            #{order.id}
          </span>
          <span
            style={{
              background: meta.bg,
              color: meta.color,
              fontFamily: "'Lato', sans-serif",
            }}
            className="text-xs font-bold px-2 py-0.5 rounded-full"
          >
            {meta.label}
          </span>
        </div>
        <p
          style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
          className="text-sm font-semibold truncate"
        >
          {custName}
        </p>
        <div className="flex justify-between mt-1">
          <p
            style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
            className="text-xs"
          >
            {fmtDate(order.created_at)}
          </p>
          <p
            style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
            className="text-xs font-bold"
          >
            {fmtKD(order.total_amount)}
          </p>
        </div>
        <p
          style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
          className="text-xs mt-0.5"
        >
          {order.payment_method}
        </p>
      </button>
    );
  };

  // ─── OrderDetail ───────────────────────────────────────────────────────────
  const OrderDetail = () => {
    if (!selectedOrder) return null;
    const meta = STATUS_META[selectedOrder.status] || STATUS_META.pending;
    const custName = selectedOrder.Customer?.cust_name || "Customer";
    const custPhone = selectedOrder.Customer?.ph_num || "—";
    const isPending = selectedOrder.status === "pending";
    const isAccepted = selectedOrder.status === "accepted";
    const isPreparing = selectedOrder.status === "preparing";
    const isOnWay = selectedOrder.status === "on_the_way";
    const isClosed = ["delivered", "rejected"].includes(selectedOrder.status);

    return (
      <div
        style={{ background: t.surface, border: `1px solid ${t.border}` }}
        className="flex-1 flex flex-col rounded-xl overflow-hidden min-w-0"
      >
        {/* Header */}
        <div
          style={{ borderBottom: `1px solid ${t.border}` }}
          className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0"
        >
          <button
            onClick={() => setMobileView("list")}
            style={{
              color: t.accent,
              background: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
            }}
            className="lg:hidden flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: t.text,
              }}
              className="text-xl font-bold"
            >
              Order #{selectedOrder.id}
            </h2>
            <p
              style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
              className="text-xs"
            >
              {fmtDate(selectedOrder.created_at)}
            </p>
          </div>
          <span
            style={{
              background: meta.bg,
              color: meta.color,
              fontFamily: "'Lato', sans-serif",
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
          >
            {meta.label}
          </span>
          {/* Print invoice */}
          <button
            onClick={() =>
              printInvoice(
                {
                  ...selectedOrder,
                  cust_name: custName,
                  cust_phone: custPhone,
                },
                orderItems,
                null,
              )
            }
            style={{
              color: t.subtle,
              background: t.surface2,
              border: `1px solid ${t.border2}`,
            }}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:opacity-70 transition-opacity"
            title="Download invoice"
          >
            🧾
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Customer info */}
          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="px-5 py-4 flex items-center gap-3"
          >
            <div
              style={{
                background: t.accentBg,
                border: `1px solid ${t.accentBorder}`,
                color: t.accent,
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            >
              {custName[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p
                style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                className="text-sm font-semibold"
              >
                {custName}
              </p>
              <p
                style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                className="text-xs"
              >
                {custPhone}
              </p>
            </div>
            {custPhone !== "—" && (
              <a
                href={`https://wa.me/${custPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#25D366",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                }}
                className="ml-auto flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:opacity-70 transition-opacity"
              >
                💬
              </a>
            )}
          </div>

          {/* Bill summary */}
          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="px-5 py-3 space-y-1"
          >
            <div className="flex justify-between text-sm">
              <span
                style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
              >
                Payment
              </span>
              <span
                style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                className="font-semibold"
              >
                {selectedOrder.payment_method}
              </span>
            </div>
            <div
              className="flex justify-between text-sm pt-1"
              style={{ borderTop: `1px solid ${t.border}` }}
            >
              <span
                style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                className="font-bold"
              >
                Total
              </span>
              <span
                style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
                className="font-bold"
              >
                {fmtKD(selectedOrder.total_amount)}
              </span>
            </div>
          </div>

          {/* Items table */}
          <div style={{ borderBottom: `1px solid ${t.border}` }}>
            <div className="grid grid-cols-12 px-5 py-2">
              {[
                ["Qty", "col-span-2"],
                ["Items", "col-span-7"],
                ["KD", "col-span-3 text-right"],
              ].map(([l, c]) => (
                <span
                  key={l}
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className={`${c} text-xs font-bold tracking-widest uppercase`}
                >
                  {l}
                </span>
              ))}
            </div>
            {itemsLoading ? (
              <div className="px-5 py-4">
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm"
                >
                  Loading items…
                </p>
              </div>
            ) : orderItems.length === 0 ? (
              <div className="px-5 py-4">
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm italic"
                >
                  No items found
                </p>
              </div>
            ) : (
              orderItems.map((it, i) => (
                <div
                  key={i}
                  style={{ borderTop: `1px solid ${t.border}` }}
                  className="grid grid-cols-12 px-5 py-3"
                >
                  <div className="col-span-2">
                    <span
                      style={{
                        color: t.accent,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm font-bold"
                    >
                      {it.quantity}×
                    </span>
                  </div>
                  <div className="col-span-7">
                    <p
                      style={{
                        color: t.text,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm font-semibold"
                    >
                      {it.menu_name}
                    </p>
                    {it.variants?.map((v, vi) => (
                      <p
                        key={vi}
                        style={{
                          color: t.accent,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="text-xs mt-0.5"
                      >
                        · {v}
                      </p>
                    ))}
                    {it.item_note && (
                      <p
                        style={{
                          color: t.muted,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="text-xs mt-0.5 italic"
                      >
                        📝 {it.item_note}
                      </p>
                    )}
                  </div>
                  <div className="col-span-3 text-right">
                    <span
                      style={{
                        color: t.text,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-sm font-semibold"
                    >
                      {Number(it.unit_price).toFixed(3)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notes */}
          {selectedOrder.notes && (
            <div
              style={{ borderBottom: `1px solid ${t.border}` }}
              className="px-5 py-3"
            >
              <p
                style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
                className="text-xs font-bold tracking-widest uppercase mb-1"
              >
                Order Notes
              </p>
              <p
                style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                className="text-sm italic"
              >
                {selectedOrder.notes}
              </p>
            </div>
          )}

          {/* Delivery rider info if on the way */}
          {selectedOrder.delivery_rider_name && (
            <div
              style={{
                borderBottom: `1px solid ${t.border}`,
                background: t.greenBg,
              }}
              className="px-5 py-3"
            >
              <p
                style={{ color: t.green, fontFamily: "'Lato', sans-serif" }}
                className="text-xs font-bold tracking-widest uppercase mb-1"
              >
                Delivery Rider
              </p>
              <p
                style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                className="text-sm font-semibold"
              >
                {selectedOrder.delivery_rider_name}
              </p>
              {selectedOrder.delivery_rider_phone && (
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs"
                >
                  {selectedOrder.delivery_rider_phone}
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {actionErr && (
            <div
              className="mx-5 my-3 px-4 py-3 rounded-lg"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
            >
              <p
                style={{ color: "#B83232", fontFamily: "'Lato', sans-serif" }}
                className="text-sm"
              >
                ⚠️ {actionErr}
              </p>
            </div>
          )}
        </div>

        {/* Action footer */}
        {!isClosed && (
          <div
            style={{ borderTop: `1px solid ${t.border}` }}
            className="px-5 py-4 flex gap-2.5 flex-shrink-0 flex-wrap"
          >
            {isPending && (
              <>
                <button
                  onClick={() => {
                    setActionErr("");
                    setShowRejectModal(true);
                  }}
                  style={{
                    border: `1px solid ${t.red}`,
                    color: t.red,
                    fontFamily: "'Lato', sans-serif",
                  }}
                  className="flex-1 min-w-[110px] py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 active:scale-95 transition-all"
                >
                  ✕ Reject
                </button>
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  style={{
                    background: t.accent,
                    color: "#fff",
                    fontFamily: "'Lato', sans-serif",
                    opacity: actionLoading ? 0.7 : 1,
                  }}
                  className="flex-1 min-w-[110px] py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                >
                  {actionLoading ? "…" : "✓ Accept"}
                </button>
              </>
            )}
            {isAccepted && (
              <>
                <button
                  onClick={() => {
                    setActionErr("");
                    setShowRejectModal(true);
                  }}
                  style={{
                    border: `1px solid ${t.red}`,
                    color: t.red,
                    fontFamily: "'Lato', sans-serif",
                  }}
                  className="flex-1 min-w-[80px] py-2.5 rounded-lg text-xs font-semibold hover:opacity-80 active:scale-95 transition-all"
                >
                  ✕ Reject
                </button>
                <button
                  onClick={handlePreparing}
                  disabled={actionLoading}
                  style={{
                    background: "#7C3AED",
                    color: "#fff",
                    fontFamily: "'Lato', sans-serif",
                    opacity: actionLoading ? 0.7 : 1,
                  }}
                  className="flex-1 min-w-[110px] py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                >
                  {actionLoading ? "…" : "👨‍🍳 Preparing"}
                </button>
              </>
            )}
            {isPreparing && (
              <button
                onClick={() => {
                  setActionErr("");
                  setShowDeliveryModal(true);
                  fetchRiders();
                }}
                style={{
                  background: t.green,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                🛵 Send for Delivery
              </button>
            )}
            {isOnWay && (
              <button
                onClick={handleDelivered}
                disabled={actionLoading}
                style={{
                  background: t.green,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                  opacity: actionLoading ? 0.7 : 1,
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                {actionLoading ? "…" : "✅ Mark Delivered"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── Tab strip with counts ──────────────────────────────────────────────────
  const TABS = [
    { id: "pending", label: "New", color: t.accent },
    { id: "accepted", label: "Accepted", color: "#2563EB" },
    { id: "preparing", label: "Preparing", color: "#7C3AED" },
    { id: "on_the_way", label: "On Way", color: t.green },
    { id: "history", label: "History", color: t.muted },
  ];

  const TabStrip = () => (
    <div
      style={{ borderBottom: `1px solid ${t.border}` }}
      className="flex overflow-x-auto scrollbar-none"
    >
      {TABS.map(({ id, label, color }) => (
        <button
          key={id}
          onClick={() => setOrderTab(id)}
          style={{
            color: orderTab === id ? color : t.subtle,
            borderBottomColor: orderTab === id ? color : "transparent",
            fontFamily: "'Lato', sans-serif",
            flexShrink: 0,
          }}
          className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap"
        >
          {label}
          <span
            style={{
              background: orderTab === id ? color : t.surface2,
              color: orderTab === id ? "#fff" : t.muted,
            }}
            className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {byStatus[id]?.length || 0}
          </span>
        </button>
      ))}
    </div>
  );

  // ─── Reject Modal ──────────────────────────────────────────────────────────
  const RejectModal = () => (
    <Modal
      title="Reject Order"
      onClose={() => {
        setShowRejectModal(false);
        setRejectReason("");
        setRejectCustom("");
        setActionErr("");
      }}
      t={t}
    >
      <p
        style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
        className="text-sm mb-4"
      >
        Please select the reason for rejecting order #{selectedOrder?.id}. This
        will be shown to the customer.
      </p>
      <div className="space-y-2 mb-4">
        {REJECT_REASONS.map((r) => (
          <button
            key={r}
            onClick={() => setRejectReason(r)}
            style={{
              background: rejectReason === r ? t.accentBg : t.surface2,
              border: `1px solid ${rejectReason === r ? t.accentBorder : t.border2}`,
              color: rejectReason === r ? t.accent : t.text,
              fontFamily: "'Lato', sans-serif",
            }}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all"
          >
            {r}
          </button>
        ))}
      </div>
      {rejectReason === "Other" && (
        <div className="mb-4">
          <label
            style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
            className="text-xs font-bold tracking-widest uppercase block mb-2"
          >
            Specify reason
          </label>
          <textarea
            value={rejectCustom}
            onChange={(e) => setRejectCustom(e.target.value)}
            placeholder="Enter custom rejection reason…"
            rows={3}
            style={{
              background: t.surface2,
              border: `1px solid ${t.border2}`,
              color: t.text,
              fontFamily: "'Lato', sans-serif",
              resize: "none",
            }}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none"
          />
        </div>
      )}
      {actionErr && (
        <p
          style={{ color: t.red, fontFamily: "'Lato', sans-serif" }}
          className="text-sm mb-3"
        >
          ⚠️ {actionErr}
        </p>
      )}
      <button
        onClick={handleReject}
        disabled={actionLoading || !rejectReason}
        style={{
          background: t.red,
          color: "#fff",
          fontFamily: "'Lato', sans-serif",
          opacity: !rejectReason ? 0.5 : 1,
        }}
        className="w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
      >
        {actionLoading ? "Rejecting…" : "Confirm Rejection"}
      </button>
    </Modal>
  );

  // ─── Delivery Modal ────────────────────────────────────────────────────────
  const DeliveryModal = () => (
    <Modal
      title="Send for Delivery"
      onClose={() => {
        setShowDeliveryModal(false);
        setSelectedRider(null);
        setRiderDirect({ name: "", phone: "" });
        setActionErr("");
      }}
      t={t}
    >
      <p
        style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
        className="text-sm mb-4"
      >
        Assign a delivery rider for order #{selectedOrder?.id}.
      </p>

      {/* Saved riders */}
      {riders.length > 0 && (
        <div className="mb-4">
          <p
            style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
            className="text-xs font-bold tracking-widest uppercase mb-2"
          >
            Saved Riders
          </p>
          <div className="space-y-2">
            {riders.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRider(r);
                  setRiderDirect({ name: "", phone: "" });
                }}
                style={{
                  background:
                    selectedRider?.id === r.id ? t.accentBg : t.surface2,
                  border: `1px solid ${selectedRider?.id === r.id ? t.accentBorder : t.border2}`,
                  color: t.text,
                  fontFamily: "'Lato', sans-serif",
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
              >
                <span className="font-semibold">{r.name}</span>
                <span style={{ color: t.muted }} className="text-xs ml-2">
                  {r.phone}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add new rider */}
      {!showAddRider ? (
        <button
          onClick={() => {
            setShowAddRider(true);
            setSelectedRider(null);
          }}
          style={{
            color: t.accent,
            fontFamily: "'Lato', sans-serif",
            border: `1px solid ${t.accentBorder}`,
            background: t.accentBg,
          }}
          className="w-full py-2.5 rounded-lg text-sm font-semibold mb-4 hover:opacity-80 transition-opacity"
        >
          + Save new rider profile
        </button>
      ) : (
        <div
          style={{ background: t.surface2, border: `1px solid ${t.border2}` }}
          className="rounded-xl p-4 mb-4 space-y-3"
        >
          <p
            style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
            className="text-sm font-semibold"
          >
            New Rider Profile
          </p>
          <Field
            label="Rider Name"
            value={newRider.name}
            onChange={(v) => setNewRider((p) => ({ ...p, name: v }))}
            placeholder="e.g. Mohammed Ali"
            t={t}
          />
          <Field
            label="Phone Number"
            value={newRider.phone}
            onChange={(v) => setNewRider((p) => ({ ...p, phone: v }))}
            placeholder="+965 XXXX XXXX"
            t={t}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddRider(false)}
              style={{
                color: t.subtle,
                border: `1px solid ${t.border2}`,
                fontFamily: "'Lato', sans-serif",
              }}
              className="flex-1 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRider}
              disabled={actionLoading}
              style={{
                background: t.accent,
                color: "#fff",
                fontFamily: "'Lato', sans-serif",
              }}
              className="flex-1 py-2 rounded-lg text-sm font-semibold"
            >
              {actionLoading ? "Saving…" : "Save & Select"}
            </button>
          </div>
        </div>
      )}

      {/* Or enter directly */}
      <div style={{ borderTop: `1px solid ${t.border}` }} className="pt-4 mb-4">
        <p
          style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
          className="text-xs font-bold tracking-widest uppercase mb-3"
        >
          Or Enter Directly (one-time)
        </p>
        <Field
          label="Rider Name"
          value={riderDirect.name}
          onChange={(v) => {
            setRiderDirect((p) => ({ ...p, name: v }));
            setSelectedRider(null);
          }}
          placeholder="Name"
          t={t}
        />
        <Field
          label="Phone"
          value={riderDirect.phone}
          onChange={(v) => {
            setRiderDirect((p) => ({ ...p, phone: v }));
            setSelectedRider(null);
          }}
          placeholder="Phone"
          t={t}
        />
      </div>

      {/* Order note */}
      <div className="mb-4">
        <label
          style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
          className="text-xs font-bold tracking-widest uppercase block mb-2"
        >
          Note (optional)
        </label>
        <textarea
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="Any delivery instructions…"
          rows={2}
          style={{
            background: t.surface2,
            border: `1px solid ${t.border2}`,
            color: t.text,
            fontFamily: "'Lato', sans-serif",
            resize: "none",
          }}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none"
        />
      </div>

      {actionErr && (
        <p
          style={{ color: t.red, fontFamily: "'Lato', sans-serif" }}
          className="text-sm mb-3"
        >
          ⚠️ {actionErr}
        </p>
      )}
      <button
        onClick={handleSendDelivery}
        disabled={actionLoading || (!selectedRider && !riderDirect.name.trim())}
        style={{
          background: t.green,
          color: "#fff",
          fontFamily: "'Lato', sans-serif",
          opacity: !selectedRider && !riderDirect.name.trim() ? 0.5 : 1,
        }}
        className="w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
      >
        {actionLoading ? "Sending…" : "🛵 Confirm — Send for Delivery"}
      </button>
    </Modal>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p
          style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
          className="text-sm"
        >
          Loading orders…
        </p>
      </div>
    );
  }
  if (loadErr) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <p
          style={{ color: t.red, fontFamily: "'Lato', sans-serif" }}
          className="text-sm"
        >
          {loadErr}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-5 md:px-8 pt-6 pb-3 flex-shrink-0 flex items-center justify-between">
        <h1
          style={{ fontFamily: "'Cormorant Garamond', serif", color: t.text }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Orders
        </h1>
        {activeCount > 0 && (
          <span
            style={{
              background: t.accentBg,
              color: t.accent,
              border: `1px solid ${t.accentBorder}`,
              fontFamily: "'Lato', sans-serif",
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-full"
          >
            {activeCount} active
          </span>
        )}
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden px-5 md:px-6 pb-6 gap-4">
        {/* Left: list */}
        <div
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
          className="w-72 flex-shrink-0 flex flex-col rounded-xl overflow-hidden"
        >
          <TabStrip />
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <span className="text-3xl opacity-20">🍽️</span>
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs"
                >
                  No {orderTab} orders
                </p>
              </div>
            ) : (
              displayed.map((o) => <OrderCard key={o.id} order={o} />)
            )}
          </div>
        </div>
        {/* Right: detail */}
        {selectedOrder ? (
          <OrderDetail />
        ) : (
          <div
            style={{ background: t.surface, border: `1px solid ${t.border}` }}
            className="flex-1 flex flex-col items-center justify-center rounded-xl gap-3"
          >
            <span className="text-5xl opacity-20">🍽️</span>
            <p
              style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
              className="text-sm"
            >
              Select an order to view details
            </p>
          </div>
        )}
      </div>

      {/* ── MOBILE layout ── */}
      <div className="lg:hidden flex-1 overflow-hidden relative">
        {/* List panel */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ${mobileView === "list" ? "translate-x-0" : "-translate-x-full"}`}
          style={{ background: t.bg }}
        >
          <div
            style={{ background: t.surface, border: `1px solid ${t.border}` }}
          >
            <TabStrip />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <span className="text-4xl opacity-20">🍽️</span>
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm"
                >
                  No {orderTab} orders
                </p>
              </div>
            ) : (
              displayed.map((o) => <OrderCard key={o.id} order={o} />)
            )}
          </div>
        </div>
        {/* Detail panel */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ${mobileView === "detail" ? "translate-x-0" : "translate-x-full"}`}
          style={{ background: t.bg }}
        >
          {selectedOrder && <OrderDetail />}
        </div>
      </div>

      {/* Modals */}
      {showRejectModal && selectedOrder && <RejectModal />}
      {showDeliveryModal && selectedOrder && <DeliveryModal />}
    </div>
  );
}

// ─── Add-On Item Row ──────────────────────────────────────────────────────────
function AddonItemRow({ addon, t, onEdit, onDelete }) {
  const imgSrc =
    addon.image_path && addon.image_path.trim() !== ""
      ? addon.image_path
      : "/sides.jpg";

  return (
    <div
      style={{ background: t.surface, border: `1px solid ${t.border}` }}
      className="flex items-center gap-3 rounded-xl px-4 py-3"
    >
      <div
        style={{ background: t.surface2, border: `1px solid ${t.border}` }}
        className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden"
      >
        <img
          src={imgSrc}
          alt={addon.name}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = "/sides.jpg";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
          className="text-sm font-semibold"
        >
          {addon.name}
        </p>
        <p
          style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
          className="text-xs font-bold mt-0.5"
        >
          KD {Number(addon.price ?? 0).toFixed(3)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          style={{ color: t.subtle }}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-60 transition-opacity text-sm"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          style={{ color: t.subtle }}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:text-red-500 transition-colors text-sm"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// ─── Menu Page ────────────────────────────────────────────────────────────────
function MenuPage({ t, user }) {
  // categories shape: { id, name, visible, sort_order, items: [...] }
  // items shape: { id, name, price, is_available, visible, description, image_path, sort_order, categ_id, rest_id }
  const [categories, setCategories] = useState([]);
  // ── Add-Ons DB state ──────────────────────────────────────────────────────
  const [addonTypes, setAddonTypes] = useState([]); // Add_Ons_Type rows
  const [addonItems, setAddonItems] = useState([]); // Add_Ons rows
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [itemOrderDirty, setItemOrderDirty] = useState(false);
  const [savingItemOrder, setSavingItemOrder] = useState(false);
  // Snapshots of last-saved order for dirty detection
  const savedCatOrder = useRef([]);
  const savedItemOrder = useRef({});

  const [section, setSection] = useState("menu");
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [mobilePanel, setMobilePanel] = useState("categories");
  const [showAddCat, setShowAddCat] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingAddon, setEditingAddon] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [savingCatName, setSavingCatName] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    description: "",
    imageFile: null,
    imagePreview: null,
    imageError: "",
    avail_from: "", // "HH:MM" Kuwait time, "" = no limit
    avail_to: "", // "HH:MM" Kuwait time, "" = no limit
  });
  const [addonForm, setAddonForm] = useState({
    // shared
    name: "",
    price: "",
    imageFile: null,
    imagePreview: null,
    imageError: "",
    // for item: which type (null = uncategorized)
    typeId: null,
    // for type modal
    minQty: "",
  });
  const [showAddonTypeModal, setShowAddonTypeModal] = useState(false);
  const [editingAddonType, setEditingAddonType] = useState(null);
  const [addonTypeForm, setAddonTypeForm] = useState({ name: "", minQty: "" });
  const [confirmDeleteAddon, setConfirmDeleteAddon] = useState(null); // { kind: "type"|"item", id, name }
  const [savingAddon, setSavingAddon] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  // Confirm-delete dialog: { type: "cat"|"item", catId, itemId, name }
  const [confirmDelete, setConfirmDelete] = useState(null);
  // Time-limit override warning: item that user tried to toggle against its window
  const [timeBlockedItem, setTimeBlockedItem] = useState(null);

  // ── Variant Groups modal state ─────────────────────────────────────────────
  // variantItem: the menu item whose variants we are editing
  const [variantItem, setVariantItem] = useState(null);
  // variantGroups: [{ id?, name, is_required, is_multiple, options: [{ id?, name, price_adj }] }]
  const [variantGroups, setVariantGroups] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [savingVariants, setSavingVariants] = useState(false);

  // Derive rest_id from user role
  const restId = user?.role === "owner" ? user?.main_rest : user?.rest_id;

  // ── Kuwait time helpers (UTC+3, no DST) ───────────────────────────────────
  const getKuwaitHHMM = () => {
    const now = new Date();
    const totalMins =
      (now.getUTCHours() * 60 + now.getUTCMinutes() + 180) % 1440;
    return `${String(Math.floor(totalMins / 60)).padStart(2, "0")}:${String(totalMins % 60).padStart(2, "0")}`;
  };

  // Returns "in-window" | "out-window" | "no-limit"
  // Handles overnight spans e.g. 22:00 → 02:00
  const getWindowStatus = (avail_from, avail_to) => {
    if (!avail_from || !avail_to) return "no-limit";
    const now = getKuwaitHHMM();
    const overnight = avail_to <= avail_from; // e.g. 22:00 → 02:00
    const inWindow = overnight
      ? now >= avail_from || now < avail_to
      : now >= avail_from && now < avail_to;
    return inWindow ? "in-window" : "out-window";
  };

  // Auto-check every minute: set is_available based on window, reset at avail_from
  useEffect(() => {
    const tick = async () => {
      const nowHHMM = getKuwaitHHMM();
      const toUpdate = []; // { id, is_available }
      setCategories((prev) => {
        const next = prev.map((c) => ({
          ...c,
          items: c.items.map((item) => {
            const { avail_from, avail_to } = item;
            if (!avail_from || !avail_to) return item;
            const status = getWindowStatus(avail_from, avail_to);
            // At the start of the window → restore to In Stock
            if (nowHHMM === avail_from.slice(0, 5) && !item.is_available) {
              toUpdate.push({ id: item.id, is_available: true });
              return { ...item, is_available: true };
            }
            // Outside window → mark Out of Stock
            if (status === "out-window" && item.is_available) {
              toUpdate.push({ id: item.id, is_available: false });
              return { ...item, is_available: false };
            }
            return item;
          }),
        }));
        return next;
      });
      for (const { id, is_available } of toUpdate) {
        await supabase.from("Menu").update({ is_available }).eq("id", id);
      }
    };
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect touch-primary device (used to swap drag handle for arrow buttons)
  const isTouch = useRef(
    typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window),
  ).current;

  // ── Arrow-based reorder helpers (mobile) ───────────────────────────────────
  const moveCat = (index, dir) => {
    const next = [...categories];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    setOrderDirty(true);
  };

  const moveItem = (index, dir) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== selectedCatId) return c;
        const items = [...c.items];
        const target = index + dir;
        if (target < 0 || target >= items.length) return c;
        [items[index], items[target]] = [items[target], items[index]];
        return { ...c, items };
      }),
    );
    setItemOrderDirty(true);
  };

  // ── Fetch categories + items on mount ──────────────────────────────────────
  useEffect(() => {
    if (!restId) {
      setLoading(false);
      setLoadError("No restaurant associated with this account.");
      return;
    }
    const fetchMenu = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        // Fetch categories sorted by sort_order asc
        const { data: cats, error: catErr } = await supabase
          .from("Categories")
          .select("id, name, visible, sort_order")
          .eq("rest_id", restId)
          .order("sort_order", { ascending: true });

        if (catErr) throw catErr;

        if (!cats || cats.length === 0) {
          setCategories([]);
          setSelectedCatId(null);
          setLoading(false);
          return;
        }

        // Fetch all menu items for this restaurant
        const { data: items, error: itemErr } = await supabase
          .from("Menu")
          .select(
            "id, name, price, is_available, visible, description, image_path, sort_order, categ_id, recommended, avail_from, avail_to, is_customizable",
          )
          .eq("rest_id", restId)
          .order("sort_order", { ascending: true });

        if (itemErr) throw itemErr;

        // Group items by category
        const itemsBycat = {};
        (items || []).forEach((item) => {
          const cid = item.categ_id;
          if (!itemsBycat[cid]) itemsBycat[cid] = [];
          itemsBycat[cid].push({ ...item });
        });

        const built = cats.map((c) => ({
          ...c,
          enabled: c.visible,
          items: itemsBycat[c.id] || [],
        }));

        setCategories(built);
        setSelectedCatId(built[0]?.id || null);
        // Snapshot DB order for dirty detection
        savedCatOrder.current = built.map((c) => c.id);
        savedItemOrder.current = Object.fromEntries(
          built.map((c) => [c.id, c.items.map((i) => i.id)]),
        );
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load menu. " + (err.message || ""));
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restId]);

  // ── Drag refs ───────────────────────────────────────────────────────────────
  const dragCat = useRef(null);
  const overCat = useRef(null);
  const dragItem = useRef(null);
  const overItem = useRef(null);

  const catTouchDrag = useTouchDrag(
    categories,
    (updater) => {
      setCategories((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        setOrderDirty(true);
        return next;
      });
    },
    (c) => c.id,
  );

  const selectedCat =
    categories.find((c) => c.id === selectedCatId) || categories[0];
  const catItems = selectedCat?.items || [];

  const setItemsForCat = useCallback(
    (updater) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCatId
            ? {
                ...c,
                items:
                  typeof updater === "function" ? updater(c.items) : updater,
              }
            : c,
        ),
      );
    },
    [selectedCatId],
  );

  const itemTouchDrag = useTouchDrag(catItems, setItemsForCat, (i) => i.id);

  const onCatDrop = () => {
    if (dragCat.current === null || overCat.current === null) return;
    const next = [...categories];
    const [m] = next.splice(dragCat.current, 1);
    next.splice(overCat.current, 0, m);
    setCategories(next);
    setOrderDirty(true);
    dragCat.current = null;
    overCat.current = null;
  };

  const onItemDrop = (catId) => {
    if (
      !dragItem.current ||
      !overItem.current ||
      dragItem.current === overItem.current
    )
      return;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        const items = [...c.items];
        const fi = items.findIndex((x) => x.id === dragItem.current);
        const ti = items.findIndex((x) => x.id === overItem.current);
        const [m] = items.splice(fi, 1);
        items.splice(ti, 0, m);
        return { ...c, items };
      }),
    );
    setItemOrderDirty(true);
    dragItem.current = null;
    overItem.current = null;
  };

  // ── Save category sort_order to DB ─────────────────────────────────────────
  const saveCategoryOrder = async () => {
    setSavingOrder(true);
    try {
      const updates = categories.map((c, i) =>
        supabase
          .from("Categories")
          .update({ sort_order: i + 1 })
          .eq("id", c.id),
      );
      await Promise.all(updates);
      // reflect new sort_order in local state
      setCategories((prev) =>
        prev.map((c, i) => ({ ...c, sort_order: i + 1 })),
      );
      setOrderDirty(false);
    } catch (err) {
      console.error("Failed to save order:", err);
    } finally {
      setSavingOrder(false);
    }
  };

  // ── Save item sort_order to DB ─────────────────────────────────────────────
  const saveItemOrder = async () => {
    if (!selectedCat) return;
    setSavingItemOrder(true);
    try {
      const updates = selectedCat.items.map((item, i) =>
        supabase
          .from("Menu")
          .update({ sort_order: i + 1 })
          .eq("id", item.id),
      );
      await Promise.all(updates);
      setCategories((prev) =>
        prev.map((c) =>
          c.id !== selectedCatId
            ? c
            : {
                ...c,
                items: c.items.map((item, i) => ({
                  ...item,
                  sort_order: i + 1,
                })),
              },
        ),
      );
      setItemOrderDirty(false);
    } catch (err) {
      console.error("Failed to save item order:", err);
    } finally {
      setSavingItemOrder(false);
    }
  };

  // ── Category visible toggle → immediate DB ─────────────────────────────────
  const toggleCat = async (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newVal = !cat.visible;
    // Optimistic update
    setCategories((p) =>
      p.map((c) =>
        c.id === id ? { ...c, visible: newVal, enabled: newVal } : c,
      ),
    );
    const { error } = await supabase
      .from("Categories")
      .update({ visible: newVal })
      .eq("id", id);
    if (error) {
      // Revert on failure
      setCategories((p) =>
        p.map((c) =>
          c.id === id ? { ...c, visible: !newVal, enabled: !newVal } : c,
        ),
      );
      console.error("Failed to toggle category visibility:", error);
    }
  };

  // ── Delete category → DB ───────────────────────────────────────────────────
  const confirmDeleteCat = (id) => {
    const cat = categories.find((c) => c.id === id);
    setConfirmDelete({
      type: "cat",
      catId: id,
      name: cat?.name || "this category",
    });
  };

  const executeDeleteCat = async () => {
    const { catId } = confirmDelete;
    setConfirmDelete(null);
    const remaining = categories.filter((c) => c.id !== catId);
    const resequenced = remaining.map((c, i) => ({ ...c, sort_order: i + 1 }));
    setCategories(resequenced);
    if (selectedCatId === catId) setSelectedCatId(resequenced[0]?.id || null);
    setMobilePanel("categories");
    savedCatOrder.current = resequenced.map((c) => c.id);
    try {
      const { error: delErr } = await supabase
        .from("Categories")
        .delete()
        .eq("id", catId);
      if (delErr) throw delErr;
      if (resequenced.length > 0) {
        await Promise.all(
          resequenced.map((c) =>
            supabase
              .from("Categories")
              .update({ sort_order: c.sort_order })
              .eq("id", c.id),
          ),
        );
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
      window.location.reload();
    }
  };

  // ── Rename category → immediate DB ────────────────────────────────────────
  const renameCat = async () => {
    const trimmed = editingCatName.trim();
    if (!trimmed || !editingCatId) {
      setEditingCatId(null);
      return;
    }
    const original = categories.find((c) => c.id === editingCatId)?.name;
    if (trimmed === original) {
      setEditingCatId(null);
      return;
    }
    setSavingCatName(true);
    // Optimistic update
    setCategories((p) =>
      p.map((c) => (c.id === editingCatId ? { ...c, name: trimmed } : c)),
    );
    const { error } = await supabase
      .from("Categories")
      .update({ name: trimmed })
      .eq("id", editingCatId);
    if (error) {
      console.error("Failed to rename category:", error);
      setCategories((p) =>
        p.map((c) => (c.id === editingCatId ? { ...c, name: original } : c)),
      );
    }
    setSavingCatName(false);
    setEditingCatId(null);
  };

  // ── Item visible toggle → immediate DB ────────────────────────────────────
  const toggleItem = async (cid, iid) => {
    const cat = categories.find((c) => c.id === cid);
    const item = cat?.items.find((i) => i.id === iid);
    if (!item) return;
    const newVal = !item.visible;
    setCategories((p) =>
      p.map((c) =>
        c.id !== cid
          ? c
          : {
              ...c,
              items: c.items.map((i) =>
                i.id === iid ? { ...i, visible: newVal } : i,
              ),
            },
      ),
    );
    const { error } = await supabase
      .from("Menu")
      .update({ visible: newVal })
      .eq("id", iid);
    if (error) {
      setCategories((p) =>
        p.map((c) =>
          c.id !== cid
            ? c
            : {
                ...c,
                items: c.items.map((i) =>
                  i.id === iid ? { ...i, visible: !newVal } : i,
                ),
              },
        ),
      );
      console.error("Failed to toggle item visibility:", error);
    }
  };

  // ── Item is_available toggle → immediate DB (with time-window guard) ────────
  const toggleItemStock = async (cid, iid) => {
    const cat = categories.find((c) => c.id === cid);
    const item = cat?.items.find((i) => i.id === iid);
    if (!item) return;

    const status = getWindowStatus(item.avail_from, item.avail_to);

    // Trying to mark In Stock but outside the time window → block and warn
    if (!item.is_available && status === "out-window") {
      setTimeBlockedItem(item);
      return;
    }

    const newVal = !item.is_available;
    setCategories((p) =>
      p.map((c) =>
        c.id !== cid
          ? c
          : {
              ...c,
              items: c.items.map((i) =>
                i.id === iid ? { ...i, is_available: newVal } : i,
              ),
            },
      ),
    );
    const { error } = await supabase
      .from("Menu")
      .update({ is_available: newVal })
      .eq("id", iid);
    if (error) {
      setCategories((p) =>
        p.map((c) =>
          c.id !== cid
            ? c
            : {
                ...c,
                items: c.items.map((i) =>
                  i.id === iid ? { ...i, is_available: !newVal } : i,
                ),
              },
        ),
      );
      console.error("Failed to toggle item stock:", error);
    }
  };

  // ── Delete item → confirmation then DB ────────────────────────────────────
  const confirmDeleteItem = (cid, iid) => {
    const item = categories
      .find((c) => c.id === cid)
      ?.items.find((i) => i.id === iid);
    setConfirmDelete({
      type: "item",
      catId: cid,
      itemId: iid,
      name: item?.name || "this item",
    });
  };

  const executeDeleteItem = async () => {
    const { catId, itemId } = confirmDelete;
    setConfirmDelete(null);
    const cat = categories.find((c) => c.id === catId);
    const remaining = (cat?.items || []).filter((i) => i.id !== itemId);
    const resequenced = remaining.map((item, i) => ({
      ...item,
      sort_order: i + 1,
    }));
    setCategories((p) =>
      p.map((c) => (c.id !== catId ? c : { ...c, items: resequenced })),
    );
    savedItemOrder.current = {
      ...savedItemOrder.current,
      [catId]: resequenced.map((i) => i.id),
    };
    try {
      const { error: delErr } = await supabase
        .from("Menu")
        .delete()
        .eq("id", itemId);
      if (delErr) throw delErr;
      if (resequenced.length > 0) {
        await Promise.all(
          resequenced.map((item) =>
            supabase
              .from("Menu")
              .update({ sort_order: item.sort_order })
              .eq("id", item.id),
          ),
        );
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // ── Open item modal ────────────────────────────────────────────────────────
  const openAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: "",
      price: "",
      description: "",
      imageFile: null,
      imagePreview: null,
      imageError: "",
      avail_from: "",
      avail_to: "",
    });
    setShowItemModal(true);
  };
  const openEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      price: String(item.price),
      description: item.description || "",
      imageFile: null,
      imagePreview:
        item.image_path && item.image_path.trim() !== ""
          ? item.image_path
          : null,
      imageError: "",
      avail_from: item.avail_from ? item.avail_from.slice(0, 5) : "",
      avail_to: item.avail_to ? item.avail_to.slice(0, 5) : "",
    });
    setShowItemModal(true);
  };

  // ── Save item → INSERT or UPDATE DB ───────────────────────────────────────
  const saveItem = async () => {
    // ── Client-side validation ───────────────────────────────────────────────
    if (!itemForm.name.trim()) {
      setItemForm((f) => ({ ...f, imageError: "Item name is required." }));
      return;
    }
    const p = parseFloat(itemForm.price);
    if (isNaN(p) || p < 0) {
      setItemForm((f) => ({
        ...f,
        imageError: "Price must be a valid positive number.",
      }));
      return;
    }
    if (!restId) {
      setItemForm((f) => ({
        ...f,
        imageError: "No restaurant found. Please re-login.",
      }));
      return;
    }
    if (!selectedCatId) {
      setItemForm((f) => ({ ...f, imageError: "No category selected." }));
      return;
    }

    setSavingItem(true);
    setItemForm((f) => ({ ...f, imageError: "" }));

    try {
      // ── Upload image if a new file was selected ──────────────────────────
      let imagePath = editingItem?.image_path || "/foodlogo.jpg";

      if (itemForm.imageFile) {
        const bucketName = "feastrush-menu";
        const ext = itemForm.imageFile.name.split(".").pop().toLowerCase();
        const filePath = `${restId}/menu/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        console.log(
          "[saveItem] Uploading to bucket:",
          bucketName,
          "path:",
          filePath,
        );

        const { error: uploadErr } = await supabase.storage
          .from(bucketName)
          .upload(filePath, itemForm.imageFile, { upsert: false });

        if (uploadErr) {
          console.error("[saveItem] Upload error:", uploadErr);
          throw new Error("Image upload failed: " + uploadErr.message);
        }

        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        imagePath = urlData?.publicUrl || "/foodlogo.jpg";
        console.log("[saveItem] Image public URL:", imagePath);
      }

      // ── UPDATE existing item ─────────────────────────────────────────────
      if (editingItem) {
        const updates = {
          name: itemForm.name.trim(),
          price: p,
          description: itemForm.description.trim() || null,
          avail_from: itemForm.avail_from || null,
          avail_to: itemForm.avail_to || null,
        };
        if (itemForm.imageFile) updates.image_path = imagePath;

        console.log("[saveItem] Updating item id:", editingItem.id, updates);

        const { error } = await supabase
          .from("Menu")
          .update(updates)
          .eq("id", editingItem.id);

        if (error) {
          console.error("[saveItem] Update error:", error);
          throw new Error(error.message || "Failed to update item.");
        }

        setCategories((prev) =>
          prev.map((c) =>
            c.id !== selectedCatId
              ? c
              : {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === editingItem.id
                      ? {
                          ...i,
                          name: itemForm.name.trim(),
                          price: p,
                          description: itemForm.description.trim() || null,
                          avail_from: itemForm.avail_from || null,
                          avail_to: itemForm.avail_to || null,
                          image_path: itemForm.imageFile
                            ? imagePath
                            : i.image_path,
                        }
                      : i,
                  ),
                },
          ),
        );

        // ── INSERT new item ──────────────────────────────────────────────────
      } else {
        const sortOrder = (selectedCat?.items?.length || 0) + 1;
        const payload = {
          rest_id: restId,
          categ_id: selectedCatId,
          name: itemForm.name.trim(),
          price: p,
          description: itemForm.description.trim() || null,
          image_path: imagePath,
          is_available: true,
          visible: true,
          recommended: false,
          sort_order: sortOrder,
          avail_from: itemForm.avail_from || null,
          avail_to: itemForm.avail_to || null,
        };

        console.log("[saveItem] Inserting payload:", payload);

        const { data, error } = await supabase
          .from("Menu")
          .insert(payload)
          .select()
          .single();

        if (error) {
          console.error("[saveItem] Insert error:", error);
          throw new Error(error.message || "Failed to insert item.");
        }

        console.log("[saveItem] Inserted successfully:", data);

        setCategories((prev) =>
          prev.map((c) =>
            c.id !== selectedCatId
              ? c
              : { ...c, items: [...c.items, { ...data }] },
          ),
        );

        // Update item order snapshot for new item
        savedItemOrder.current = {
          ...savedItemOrder.current,
          [selectedCatId]: [
            ...(savedItemOrder.current[selectedCatId] || []),
            data.id,
          ],
        };
      }

      setShowItemModal(false);
    } catch (err) {
      console.error("[saveItem] Caught error:", err);
      setItemForm((f) => ({
        ...f,
        imageError: err.message || "Something went wrong. Please try again.",
      }));
    } finally {
      setSavingItem(false);
    }
  };

  // ── Open Variant Groups modal for a menu item ──────────────────────────────
  const openVariants = async (item) => {
    setVariantItem(item);
    setLoadingVariants(true);
    try {
      const { data: groups, error: gErr } = await supabase
        .from("Variant_Groups")
        .select("id, name, is_required, is_multiple")
        .eq("menu_id", item.id)
        .order("id", { ascending: true });
      if (gErr) throw gErr;

      const groupIds = (groups || []).map((g) => g.id);
      let options = [];
      if (groupIds.length > 0) {
        const { data: opts, error: oErr } = await supabase
          .from("Variant Options")
          .select("id, var_group_id, name, price_adj")
          .in("var_group_id", groupIds)
          .order("id", { ascending: true });
        if (oErr) throw oErr;
        options = opts || [];
      }

      setVariantGroups(
        (groups || []).map((g) => ({
          ...g,
          options: options.filter((o) => o.var_group_id === g.id),
        })),
      );
    } catch (err) {
      console.error("[openVariants] error:", err);
      alert("Failed to load variants: " + (err.message || "Unknown error"));
    } finally {
      setLoadingVariants(false);
    }
  };

  const closeVariants = () => {
    setVariantItem(null);
    setVariantGroups([]);
  };

  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      {
        _localId: Date.now(),
        name: "",
        is_required: false,
        is_multiple: false,
        options: [],
      },
    ]);
  };

  const updateVariantGroup = (idx, key, val) => {
    setVariantGroups((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, [key]: val } : g)),
    );
  };

  const removeVariantGroup = (idx) => {
    setVariantGroups((prev) => prev.filter((_, i) => i !== idx));
  };

  const addVariantOption = (groupIdx) => {
    setVariantGroups((prev) =>
      prev.map((g, i) =>
        i !== groupIdx
          ? g
          : {
              ...g,
              options: [
                ...g.options,
                { _localId: Date.now(), name: "", price_adj: 0 },
              ],
            },
      ),
    );
  };

  const updateVariantOption = (groupIdx, optIdx, key, val) => {
    setVariantGroups((prev) =>
      prev.map((g, i) =>
        i !== groupIdx
          ? g
          : {
              ...g,
              options: g.options.map((o, j) =>
                j !== optIdx ? o : { ...o, [key]: val },
              ),
            },
      ),
    );
  };

  const removeVariantOption = (groupIdx, optIdx) => {
    setVariantGroups((prev) =>
      prev.map((g, i) =>
        i !== groupIdx
          ? g
          : { ...g, options: g.options.filter((_, j) => j !== optIdx) },
      ),
    );
  };

  const saveVariants = async () => {
    if (!variantItem) return;
    // Basic validation
    for (const g of variantGroups) {
      if (!g.name.trim()) {
        alert("Each variant group must have a name.");
        return;
      }
      for (const o of g.options) {
        if (!o.name.trim()) {
          alert(`All options in "${g.name}" must have a name.`);
          return;
        }
      }
    }

    setSavingVariants(true);
    try {
      // 1. Fetch existing groups from DB to know what to delete
      const { data: existingGroups } = await supabase
        .from("Variant_Groups")
        .select("id")
        .eq("menu_id", variantItem.id);

      const existingGroupIds = (existingGroups || []).map((g) => g.id);
      const newGroupIds = variantGroups.filter((g) => g.id).map((g) => g.id);
      const groupsToDelete = existingGroupIds.filter(
        (id) => !newGroupIds.includes(id),
      );

      // Delete removed groups (cascade deletes their options via FK)
      if (groupsToDelete.length > 0) {
        // First delete options for these groups
        await supabase
          .from("Variant Options")
          .delete()
          .in("var_group_id", groupsToDelete);
        await supabase.from("Variant_Groups").delete().in("id", groupsToDelete);
      }

      // 2. Upsert each group + its options
      for (const group of variantGroups) {
        if (group.id) {
          // UPDATE existing group
          await supabase
            .from("Variant_Groups")
            .update({
              name: group.name.trim(),
              is_required: group.is_required,
              is_multiple: group.is_multiple,
            })
            .eq("id", group.id);

          // Fetch existing options for this group
          const { data: existingOpts } = await supabase
            .from("Variant Options")
            .select("id")
            .eq("var_group_id", group.id);
          const existingOptIds = (existingOpts || []).map((o) => o.id);
          const newOptIds = group.options.filter((o) => o.id).map((o) => o.id);
          const optsToDelete = existingOptIds.filter(
            (id) => !newOptIds.includes(id),
          );
          if (optsToDelete.length > 0) {
            await supabase
              .from("Variant Options")
              .delete()
              .in("id", optsToDelete);
          }
          for (const opt of group.options) {
            if (opt.id) {
              await supabase
                .from("Variant Options")
                .update({
                  name: opt.name.trim(),
                  price_adj: parseFloat(opt.price_adj) || 0,
                })
                .eq("id", opt.id);
            } else {
              await supabase.from("Variant Options").insert({
                var_group_id: group.id,
                name: opt.name.trim(),
                price_adj: parseFloat(opt.price_adj) || 0,
              });
            }
          }
        } else {
          // INSERT new group
          const { data: newGroup, error: ngErr } = await supabase
            .from("Variant_Groups")
            .insert({
              menu_id: variantItem.id,
              name: group.name.trim(),
              is_required: group.is_required,
              is_multiple: group.is_multiple,
            })
            .select()
            .single();
          if (ngErr) throw ngErr;
          for (const opt of group.options) {
            await supabase.from("Variant Options").insert({
              var_group_id: newGroup.id,
              name: opt.name.trim(),
              price_adj: parseFloat(opt.price_adj) || 0,
            });
          }
        }
      }

      // 3. Update is_customizable on the Menu item
      const isCustomizable = variantGroups.length > 0;
      await supabase
        .from("Menu")
        .update({ is_customizable: isCustomizable })
        .eq("id", variantItem.id);

      // 4. Update local state
      setCategories((prev) =>
        prev.map((c) => ({
          ...c,
          items: c.items.map((i) =>
            i.id === variantItem.id
              ? { ...i, is_customizable: isCustomizable }
              : i,
          ),
        })),
      );

      closeVariants();
    } catch (err) {
      console.error("[saveVariants] error:", err);
      alert("Failed to save variants: " + (err.message || "Unknown error"));
    } finally {
      setSavingVariants(false);
    }
  };

  // ── Fetch Add-Ons types + items from DB ────────────────────────────────────
  const fetchAddons = useCallback(async () => {
    if (!restId) return;
    setLoadingAddons(true);
    try {
      const { data: types, error: tErr } = await supabase
        .from("Add_Ons_Type")
        .select("id, name, min_qty, rest_id")
        .eq("rest_id", restId)
        .order("id", { ascending: true });
      if (tErr) throw tErr;

      const { data: items, error: iErr } = await supabase
        .from("Add_Ons")
        .select("id, type_id, name, price, image_path");
      // Filter client-side: items that belong to one of this restaurant's types OR have no type
      // We'll only show items whose type_id is in this restaurant's types, or type_id IS NULL
      // But we need to scope uncategorised ones to this restaurant — the schema has no rest_id on Add_Ons.
      // So we filter: type_id in types[], or type_id is null (shown as uncategorized — all restaurants share these).
      // Best practice: show only items whose type_id is in this restaurant's type ids.
      // Uncategorized: items whose type_id IS NULL — these are considered "restaurant-generic" by the schema.
      if (iErr) throw iErr;

      const typeIds = new Set((types || []).map((t) => t.id));
      const filtered = (items || []).filter(
        (a) => a.type_id === null || typeIds.has(a.type_id),
      );

      setAddonTypes(types || []);
      setAddonItems(filtered);
    } catch (err) {
      console.error("[fetchAddons] error:", err);
    } finally {
      setLoadingAddons(false);
    }
  }, [restId]);

  useEffect(() => {
    if (section === "addons") fetchAddons();
  }, [section, fetchAddons]);

  // ── Open Add-On TYPE modal ─────────────────────────────────────────────────
  const openAddType = () => {
    setEditingAddonType(null);
    setAddonTypeForm({ name: "", minQty: "" });
    setShowAddonTypeModal(true);
  };
  const openEditType = (type) => {
    setEditingAddonType(type);
    setAddonTypeForm({ name: type.name, minQty: String(type.min_qty ?? "") });
    setShowAddonTypeModal(true);
  };

  const saveAddonType = async () => {
    if (!addonTypeForm.name.trim()) {
      return;
    }
    setSavingAddon(true);
    try {
      if (editingAddonType) {
        const { error } = await supabase
          .from("Add_Ons_Type")
          .update({
            name: addonTypeForm.name.trim(),
            min_qty: parseInt(addonTypeForm.minQty) || 0,
          })
          .eq("id", editingAddonType.id);
        if (error) throw error;
        setAddonTypes((prev) =>
          prev.map((t) =>
            t.id === editingAddonType.id
              ? {
                  ...t,
                  name: addonTypeForm.name.trim(),
                  min_qty: parseInt(addonTypeForm.minQty) || 0,
                }
              : t,
          ),
        );
      } else {
        const { data, error } = await supabase
          .from("Add_Ons_Type")
          .insert({
            rest_id: restId,
            name: addonTypeForm.name.trim(),
            min_qty: parseInt(addonTypeForm.minQty) || 0,
          })
          .select()
          .single();
        if (error) throw error;
        setAddonTypes((prev) => [...prev, data]);
      }
      setShowAddonTypeModal(false);
    } catch (err) {
      console.error("[saveAddonType] error:", err);
      alert("Failed to save type: " + (err.message || "Unknown error"));
    } finally {
      setSavingAddon(false);
    }
  };

  const executeDeleteAddonType = async () => {
    if (!confirmDeleteAddon || confirmDeleteAddon.kind !== "type") return;
    const { id } = confirmDeleteAddon;
    setConfirmDeleteAddon(null);
    try {
      // Nullify type_id for items belonging to this type (they become uncategorized)
      await supabase
        .from("Add_Ons")
        .update({ type_id: null })
        .eq("type_id", id);
      const { error } = await supabase
        .from("Add_Ons_Type")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setAddonTypes((prev) => prev.filter((t) => t.id !== id));
      setAddonItems((prev) =>
        prev.map((a) => (a.type_id === id ? { ...a, type_id: null } : a)),
      );
    } catch (err) {
      console.error("[deleteAddonType] error:", err);
      alert("Failed to delete type: " + (err.message || "Unknown error"));
    }
  };

  // ── Open Add-On ITEM modal ─────────────────────────────────────────────────
  const openAddAddonItem = (typeId) => {
    setEditingAddon(null);
    setAddonForm({
      name: "",
      price: "",
      imageFile: null,
      imagePreview: null,
      imageError: "",
      typeId: typeId || null,
      minQty: "",
    });
    setShowAddonModal(true);
  };
  const openAddAddon = () => openAddAddonItem(null);

  const openEditAddonItem = (addon) => {
    setEditingAddon(addon);
    setAddonForm({
      name: addon.name,
      price: String(addon.price ?? ""),
      imageFile: null,
      imagePreview:
        addon.image_path && addon.image_path.trim() !== ""
          ? addon.image_path
          : null,
      imageError: "",
      typeId: addon.type_id ?? null,
      minQty: "",
    });
    setShowAddonModal(true);
  };

  const saveAddon = async () => {
    if (!addonForm.name.trim()) {
      setAddonForm((f) => ({ ...f, imageError: "Name is required." }));
      return;
    }
    const p = parseFloat(addonForm.price);
    if (isNaN(p) || p < 0) {
      setAddonForm((f) => ({
        ...f,
        imageError: "Price must be a valid positive number.",
      }));
      return;
    }

    setSavingAddon(true);
    setAddonForm((f) => ({ ...f, imageError: "" }));

    try {
      // ── Upload image if provided ────────────────────────────────────────────
      let imagePath = editingAddon?.image_path || null;

      if (addonForm.imageFile) {
        const bucketName = "feastrush-menu";
        const ext = addonForm.imageFile.name.split(".").pop().toLowerCase();
        const folderPath = `${restId}/add_ons`;
        const filePath = `${folderPath}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        // Ensure folder exists by checking a dummy list (storage auto-creates folders on upload)
        const { error: uploadErr } = await supabase.storage
          .from(bucketName)
          .upload(filePath, addonForm.imageFile, { upsert: false });

        if (uploadErr) {
          throw new Error("Image upload failed: " + uploadErr.message);
        }

        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        imagePath = urlData?.publicUrl || null;
      }

      const payload = {
        name: addonForm.name.trim(),
        price: p,
        type_id: addonForm.typeId || null,
        image_path: imagePath,
      };

      if (editingAddon) {
        if (!addonForm.imageFile) {
          // Keep existing image, don't overwrite
          delete payload.image_path;
        }
        const { error } = await supabase
          .from("Add_Ons")
          .update(payload)
          .eq("id", editingAddon.id);
        if (error) throw error;
        setAddonItems((prev) =>
          prev.map((a) =>
            a.id === editingAddon.id
              ? {
                  ...a,
                  name: payload.name,
                  price: payload.price,
                  type_id: payload.type_id,
                  image_path: addonForm.imageFile ? imagePath : a.image_path,
                }
              : a,
          ),
        );
      } else {
        const { data, error } = await supabase
          .from("Add_Ons")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        setAddonItems((prev) => [...prev, data]);
      }

      setShowAddonModal(false);
    } catch (err) {
      console.error("[saveAddon] error:", err);
      setAddonForm((f) => ({
        ...f,
        imageError: err.message || "Something went wrong.",
      }));
    } finally {
      setSavingAddon(false);
    }
  };

  const executeDeleteAddonItem = async () => {
    if (!confirmDeleteAddon || confirmDeleteAddon.kind !== "item") return;
    const { id } = confirmDeleteAddon;
    setConfirmDeleteAddon(null);
    try {
      const { error } = await supabase.from("Add_Ons").delete().eq("id", id);
      if (error) throw error;
      setAddonItems((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("[deleteAddonItem] error:", err);
      alert("Failed to delete add-on: " + (err.message || "Unknown error"));
    }
  };

  // ── Add category → INSERT DB ───────────────────────────────────────────────
  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const sortOrder = categories.length + 1;
    try {
      const { data, error } = await supabase
        .from("Categories")
        .insert({
          rest_id: restId,
          name: newCatName.trim(),
          sort_order: sortOrder,
          visible: true,
        })
        .select()
        .single();
      if (error) throw error;
      const cat = { ...data, enabled: true, items: [] };
      setCategories((p) => [...p, cat]);
      setSelectedCatId(cat.id);
      setNewCatName("");
      setShowAddCat(false);
      setMobilePanel("items");
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  // addonTypes and addonItems are fetched from DB (see fetchAddons above)

  const CategoryList = () => (
    <div className="flex flex-col gap-0.5">
      {categories.map((cat, i) => (
        <div
          key={cat.id}
          ref={(el) => {
            catTouchDrag.itemRefs.current[cat.id] = el;
          }}
          onDragEnter={() => {
            overCat.current = i;
          }}
          onDragEnd={onCatDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => {
            setSelectedCatId(cat.id);
            setMobilePanel("items");
          }}
          style={{
            background: selectedCatId === cat.id ? t.accentBg : "transparent",
            borderLeft: `3px solid ${selectedCatId === cat.id ? t.accent : "transparent"}`,
            color: selectedCatId === cat.id ? t.accent : t.subtle,
            userSelect: "none",
            cursor: "pointer",
          }}
          className="flex items-center gap-2 px-3 py-3 rounded-lg transition-colors duration-150"
        >
          {/* Desktop: drag handle | Mobile: arrow buttons */}
          {isTouch ? (
            <div className="flex flex-col gap-0.5 flex-shrink-0 -ml-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveCat(i, -1);
                }}
                disabled={i === 0}
                style={{
                  color: i === 0 ? t.muted : t.subtle,
                  opacity: i === 0 ? 0.3 : 1,
                  lineHeight: 1,
                }}
                className="text-xs px-1 rounded active:scale-90 transition-transform"
              >
                ▲
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveCat(i, 1);
                }}
                disabled={i === categories.length - 1}
                style={{
                  color: i === categories.length - 1 ? t.muted : t.subtle,
                  opacity: i === categories.length - 1 ? 0.3 : 1,
                  lineHeight: 1,
                }}
                className="text-xs px-1 rounded active:scale-90 transition-transform"
              >
                ▼
              </button>
            </div>
          ) : (
            <span
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                dragCat.current = i;
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                catTouchDrag.onPointerDown(cat.id, e);
              }}
              style={{ color: t.muted, touchAction: "none", cursor: "grab" }}
              className="text-sm flex-shrink-0 select-none px-1 py-1 -ml-1 rounded hover:opacity-60"
            >
              ⠿
            </span>
          )}
          <span
            style={{ fontFamily: "'Lato', sans-serif" }}
            className="text-sm font-semibold flex-1 truncate"
          >
            {cat.name}
          </span>
          <span
            style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
            className="text-xs"
          >
            {cat.items.length}
          </span>
          {!cat.visible && (
            <span style={{ color: t.muted }} className="text-xs">
              ●
            </span>
          )}
          <span style={{ color: t.muted }} className="text-xs md:hidden">
            ›
          </span>
        </div>
      ))}
      {/* Save Order button — appears after drag reorder */}
      {orderDirty && (
        <button
          onClick={saveCategoryOrder}
          disabled={savingOrder}
          style={{
            background: t.accent,
            color: "#fff",
            fontFamily: "'Lato', sans-serif",
            opacity: savingOrder ? 0.7 : 1,
          }}
          className="mt-3 w-full py-2 rounded-lg text-xs font-semibold tracking-wider hover:opacity-90 active:scale-95 transition-all"
        >
          {savingOrder ? "Saving…" : "💾 Save Order"}
        </button>
      )}
    </div>
  );

  const ItemsPanel = () => (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {selectedCat && (
        <div
          style={{ borderBottom: `1px solid ${t.border}` }}
          className="flex items-center justify-between pb-4 mb-4 gap-3"
        >
          {/* Category name — static or inline edit */}
          {editingCatId === selectedCat.id ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                autoFocus
                value={editingCatName}
                onChange={(e) => setEditingCatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") renameCat();
                  if (e.key === "Escape") setEditingCatId(null);
                }}
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.accent}`,
                  color: t.text,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                className="text-xl font-bold rounded-lg px-3 py-1 outline-none flex-1 min-w-0"
              />
              <button
                onClick={renameCat}
                disabled={savingCatName}
                style={{
                  background: t.accent,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {savingCatName ? "…" : "Save"}
              </button>
              <button
                onClick={() => setEditingCatId(null)}
                style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                className="text-xs px-2 py-1.5 rounded-lg flex-shrink-0 hover:opacity-60"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: t.text,
              }}
              className="text-xl font-bold truncate flex-1 min-w-0"
            >
              {selectedCat.name}
            </p>
          )}
          {/* Action buttons — only shown when not in rename mode */}
          {editingCatId !== selectedCat.id && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setEditingCatId(selectedCat.id);
                  setEditingCatName(selectedCat.name);
                }}
                style={{ color: t.subtle }}
                className="text-sm hover:opacity-60 transition-opacity p-1"
                title="Rename category"
              >
                ✏️
              </button>
              <button
                onClick={() => confirmDeleteCat(selectedCat.id)}
                style={{ color: t.subtle }}
                className="text-sm hover:text-red-500 transition-colors p-1"
                title="Delete category"
              >
                🗑️
              </button>
              <Toggle
                value={selectedCat.visible}
                onChange={() => toggleCat(selectedCat.id)}
                t={t}
              />
            </div>
          )}
        </div>
      )}
      {catItems.length === 0 && (
        <div
          style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
          className="text-sm italic py-6 text-center"
        >
          No items yet. Tap "+ Add Item" to get started.
        </div>
      )}
      {catItems.map((item, itemIdx) => (
        <div
          key={item.id}
          ref={(el) => {
            itemTouchDrag.itemRefs.current[item.id] = el;
          }}
          onDragEnter={() => {
            overItem.current = item.id;
          }}
          onDragEnd={() => onItemDrop(selectedCatId)}
          onDragOver={(e) => e.preventDefault()}
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            userSelect: "none",
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-3 mb-2.5 transition-colors hover:shadow-sm"
        >
          {/* Desktop: drag handle | Mobile: arrow buttons */}
          {isTouch ? (
            <div className="flex flex-col gap-0.5 flex-shrink-0 -ml-1">
              <button
                onClick={() => moveItem(itemIdx, -1)}
                disabled={itemIdx === 0}
                style={{
                  color: itemIdx === 0 ? t.muted : t.subtle,
                  opacity: itemIdx === 0 ? 0.3 : 1,
                  lineHeight: 1,
                }}
                className="text-xs px-1 rounded active:scale-90 transition-transform"
              >
                ▲
              </button>
              <button
                onClick={() => moveItem(itemIdx, 1)}
                disabled={itemIdx === catItems.length - 1}
                style={{
                  color: itemIdx === catItems.length - 1 ? t.muted : t.subtle,
                  opacity: itemIdx === catItems.length - 1 ? 0.3 : 1,
                  lineHeight: 1,
                }}
                className="text-xs px-1 rounded active:scale-90 transition-transform"
              >
                ▼
              </button>
            </div>
          ) : (
            <span
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                dragItem.current = item.id;
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                itemTouchDrag.onPointerDown(item.id, e);
              }}
              style={{ color: t.muted, touchAction: "none", cursor: "grab" }}
              className="text-xs select-none flex-shrink-0 px-1 py-2 -ml-1 rounded hover:opacity-60"
            >
              ⠿
            </span>
          )}
          <div
            style={{ background: t.surface2, border: `1px solid ${t.border}` }}
            className="w-11 h-11 rounded-lg flex-shrink-0 select-none overflow-hidden"
          >
            <img
              src={
                item.image_path && item.image_path.trim() !== ""
                  ? item.image_path
                  : "/foodlogo.jpg"
              }
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/foodlogo.jpg";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p
                style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                className="text-sm font-semibold"
              >
                {item.name}
              </p>
              <span
                onClick={() => toggleItemStock(selectedCatId, item.id)}
                style={{
                  background: item.is_available ? t.greenBg : "#FEF2F2",
                  color: item.is_available ? t.green : t.red,
                  border: `1px solid ${item.is_available ? t.greenBorder : "#FECACA"}`,
                }}
                className="text-xs px-2 py-0.5 rounded-full cursor-pointer select-none flex-shrink-0 font-semibold"
              >
                {item.is_available ? "In Stock" : "Out of Stock"}
              </span>
              {item.is_customizable && (
                <span
                  style={{
                    background: t.accentBg,
                    color: t.accent,
                    border: `1px solid ${t.accentBorder}`,
                  }}
                  className="text-xs px-2 py-0.5 rounded-full select-none flex-shrink-0 font-semibold"
                >
                  ⚙️ Customizable
                </span>
              )}
            </div>
            <p
              style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
              className="text-sm font-bold mt-0.5"
            >
              KD {Number(item.price).toFixed(3)}
            </p>
            {item.avail_from && item.avail_to && (
              <p
                style={{
                  color:
                    getWindowStatus(item.avail_from, item.avail_to) ===
                    "in-window"
                      ? t.green
                      : t.muted,
                  fontFamily: "'Lato', sans-serif",
                }}
                className="text-xs mt-0.5"
              >
                🕐 {item.avail_from.slice(0, 5)} – {item.avail_to.slice(0, 5)}{" "}
                KWT
                {getWindowStatus(item.avail_from, item.avail_to) ===
                  "out-window" && " · Outside window"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => openVariants(item)}
              style={{
                color: item.is_customizable ? t.accent : t.subtle,
                background: item.is_customizable ? t.accentBg : "transparent",
                border: `1px solid ${item.is_customizable ? t.accentBorder : "transparent"}`,
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-60 transition-opacity text-sm"
              title="Manage Variants"
            >
              ⚙️
            </button>
            <button
              onClick={() => openEditItem(item)}
              style={{ color: t.subtle }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-60 transition-opacity text-sm"
            >
              ✏️
            </button>
            <button
              onClick={() => confirmDeleteItem(selectedCatId, item.id)}
              style={{ color: t.subtle }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:text-red-500 transition-colors text-sm"
            >
              🗑️
            </button>
            {/* visible toggle → Categories.visible in DB */}
            <Toggle
              value={item.visible}
              onChange={() => toggleItem(selectedCatId, item.id)}
              t={t}
            />
          </div>
        </div>
      ))}
      {/* Save Item Order button — appears after arrow reorder */}
      {itemOrderDirty && (
        <button
          onClick={saveItemOrder}
          disabled={savingItemOrder}
          style={{
            background: t.accent,
            color: "#fff",
            fontFamily: "'Lato', sans-serif",
            opacity: savingItemOrder ? 0.7 : 1,
          }}
          className="mt-1 mb-2 w-full py-2 rounded-lg text-xs font-semibold tracking-wider hover:opacity-90 active:scale-95 transition-all"
        >
          {savingItemOrder ? "Saving…" : "💾 Save Item Order"}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Loading / error overlay */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <p
            style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
            className="text-sm"
          >
            Loading menu…
          </p>
        </div>
      )}
      {!loading && loadError && (
        <div className="flex-1 flex items-center justify-center">
          <p
            style={{ color: t.red, fontFamily: "'Lato', sans-serif" }}
            className="text-sm text-center px-6"
          >
            {loadError}
          </p>
        </div>
      )}
      {!loading && !loadError && (
        <>
          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="px-5 md:px-8 pt-5 pb-0 flex-shrink-0"
          >
            <div className="md:hidden flex items-center gap-3 mb-3">
              {(mobilePanel === "items" || mobilePanel === "addons") && (
                <button
                  onClick={() => setMobilePanel("categories")}
                  style={{
                    background: t.accentBg,
                    border: `1px solid ${t.accentBorder}`,
                    color: t.accent,
                    fontFamily: "'Lato', sans-serif",
                  }}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold"
                >
                  ← Back
                </button>
              )}
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: t.text,
                }}
                className="text-2xl font-bold"
              >
                {mobilePanel === "categories"
                  ? "Menu"
                  : mobilePanel === "items"
                    ? selectedCat?.name
                    : "Add-Ons"}
              </h1>
            </div>
            <div className="hidden md:flex items-center justify-between mb-4 flex-wrap gap-3">
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: t.text,
                }}
                className="text-3xl md:text-4xl font-bold tracking-tight"
              >
                Menu
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  ["Download CSV 📥", null],
                  ["Upload CSV 📤", null],
                ].map(([label]) => (
                  <button
                    key={label}
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border2}`,
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-medium px-4 py-2.5 rounded-lg tracking-wide hover:opacity-80 transition-all active:scale-95"
                  >
                    {label}
                  </button>
                ))}

                <button
                  onClick={section === "menu" ? openAddItem : openAddAddon}
                  style={{
                    background: t.accent,
                    color: "#fff",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  className="text-xs font-semibold px-4 py-2.5 rounded-lg tracking-wide hover:opacity-90 transition-all active:scale-95"
                >
                  + {section === "menu" ? "Add Item" : "Add Add-On"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-5">
                {[
                  ["menu", "Menu Items"],
                  ["addons", "Add-Ons"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSection(id);
                      setMobilePanel(id === "addons" ? "addons" : "categories");
                    }}
                    style={{
                      color: section === id ? t.accent : t.subtle,
                      borderBottomColor:
                        section === id ? t.accent : "transparent",
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="pb-3 text-sm font-semibold tracking-wide border-b-2 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="md:hidden flex items-center gap-2 pb-3">
                {section === "menu" && mobilePanel === "categories" && (
                  <button
                    onClick={() => setShowAddCat(true)}
                    style={{
                      background: t.accentBg,
                      border: `1px solid ${t.accentBorder}`,
                      color: t.accent,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    + Category
                  </button>
                )}
                {section === "menu" && mobilePanel === "items" && (
                  <>
                    <button
                      onClick={openAddItem}
                      style={{
                        background: t.accent,
                        color: "#fff",
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      + Add Item
                    </button>
                  </>
                )}
                {section === "addons" && (
                  <button
                    onClick={openAddAddon}
                    style={{
                      background: t.accent,
                      color: "#fff",
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    + Add-On
                  </button>
                )}
              </div>
            </div>
          </div>

          {section === "menu" ? (
            <>
              <div className="hidden md:flex flex-1 overflow-hidden">
                <div
                  style={{
                    background: t.surface,
                    borderRight: `1px solid ${t.border}`,
                    width: 220,
                    minWidth: 180,
                  }}
                  className="flex-shrink-0 flex flex-col overflow-hidden"
                >
                  <div
                    style={{ borderBottom: `1px solid ${t.border}` }}
                    className="px-4 pt-4 pb-3 flex items-center justify-between"
                  >
                    <p
                      style={{
                        color: t.subtle,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-xs font-bold tracking-widest uppercase"
                    >
                      Categories
                    </p>
                    <button
                      onClick={() => setShowAddCat(true)}
                      style={{
                        color: t.accent,
                        background: t.accentBg,
                        border: `1px solid ${t.accentBorder}`,
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    <CategoryList />
                  </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ItemsPanel />
                </div>
              </div>

              <div className="md:hidden flex-1 overflow-hidden relative">
                <div
                  className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ${mobilePanel === "categories" ? "translate-x-0" : "-translate-x-full"}`}
                  style={{ background: t.bg }}
                >
                  <div className="p-4">
                    <CategoryList />
                    <button
                      onClick={() => setShowAddCat(true)}
                      style={{
                        background: t.accentBg,
                        border: `1px solid ${t.accentBorder}`,
                        color: t.accent,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="w-full mt-3 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-center"
                    >
                      + New Category
                    </button>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 flex flex-col overflow-hidden transition-transform duration-300 ${mobilePanel === "items" ? "translate-x-0" : "translate-x-full"}`}
                  style={{ background: t.bg }}
                >
                  <ItemsPanel />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {/* ── Top action bar ── */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div />
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={openAddType}
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border2}`,
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-semibold px-4 py-2.5 rounded-lg tracking-wide hover:opacity-80 transition-all active:scale-95"
                  >
                    + New Type
                  </button>
                  <button
                    onClick={() => openAddAddonItem(null)}
                    style={{
                      background: t.accent,
                      color: "#fff",
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-semibold px-4 py-2.5 rounded-lg tracking-wide hover:opacity-90 transition-all active:scale-95"
                  >
                    + Add Add-On
                  </button>
                </div>
              </div>

              {loadingAddons ? (
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm"
                >
                  Loading add-ons…
                </p>
              ) : (
                <>
                  {/* ── Typed sections ── */}
                  {addonTypes.map((type) => {
                    const items = addonItems.filter(
                      (a) => a.type_id === type.id,
                    );
                    return (
                      <div key={type.id} className="mb-8">
                        <div
                          style={{ borderBottom: `1px solid ${t.border}` }}
                          className="flex items-center justify-between pb-3 mb-3 flex-wrap gap-2"
                        >
                          <div>
                            <p
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: t.text,
                              }}
                              className="text-xl font-bold"
                            >
                              {type.name}
                            </p>
                            {type.min_qty > 0 && (
                              <p
                                style={{
                                  color: t.muted,
                                  fontFamily: "'Lato', sans-serif",
                                }}
                                className="text-xs mt-0.5"
                              >
                                Min. required: {type.min_qty}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openAddAddonItem(type.id)}
                              style={{
                                background: t.accentBg,
                                border: `1px solid ${t.accentBorder}`,
                                color: t.accent,
                                fontFamily: "'Lato', sans-serif",
                              }}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                            >
                              + Add Item
                            </button>
                            <button
                              onClick={() => openEditType(type)}
                              style={{ color: t.subtle }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:opacity-60 transition-opacity text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                setConfirmDeleteAddon({
                                  kind: "type",
                                  id: type.id,
                                  name: type.name,
                                })
                              }
                              style={{ color: t.subtle }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:text-red-500 transition-colors text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        {items.length === 0 ? (
                          <p
                            style={{
                              color: t.muted,
                              fontFamily: "'Lato', sans-serif",
                            }}
                            className="text-sm italic"
                          >
                            No items in this type yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {items.map((addon) => (
                              <AddonItemRow
                                key={addon.id}
                                addon={addon}
                                t={t}
                                onEdit={() => openEditAddonItem(addon)}
                                onDelete={() =>
                                  setConfirmDeleteAddon({
                                    kind: "item",
                                    id: addon.id,
                                    name: addon.name,
                                  })
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* ── Uncategorized section ── */}
                  {(() => {
                    const uncat = addonItems.filter((a) => !a.type_id);
                    if (uncat.length === 0 && addonTypes.length > 0)
                      return null;
                    return (
                      <div className="mb-8">
                        <div
                          style={{ borderBottom: `1px solid ${t.border}` }}
                          className="flex items-center justify-between pb-3 mb-3 flex-wrap gap-2"
                        >
                          <p
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              color: t.text,
                            }}
                            className="text-xl font-bold"
                          >
                            Uncategorized
                          </p>
                          <button
                            onClick={() => openAddAddonItem(null)}
                            style={{
                              background: t.accentBg,
                              border: `1px solid ${t.accentBorder}`,
                              color: t.accent,
                              fontFamily: "'Lato', sans-serif",
                            }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            + Add Item
                          </button>
                        </div>
                        {uncat.length === 0 ? (
                          <p
                            style={{
                              color: t.muted,
                              fontFamily: "'Lato', sans-serif",
                            }}
                            className="text-sm italic"
                          >
                            No add-ons yet. Click "+ Add Add-On" or "+ New Type"
                            to get started.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {uncat.map((addon) => (
                              <AddonItemRow
                                key={addon.id}
                                addon={addon}
                                t={t}
                                onEdit={() => openEditAddonItem(addon)}
                                onDelete={() =>
                                  setConfirmDeleteAddon({
                                    kind: "item",
                                    id: addon.id,
                                    name: addon.name,
                                  })
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {showAddCat && (
            <Modal
              title="New Category"
              onClose={() => setShowAddCat(false)}
              t={t}
            >
              <Field
                label="Category Name"
                value={newCatName}
                onChange={setNewCatName}
                placeholder="e.g. Wraps"
                t={t}
              />
              <button
                onClick={addCategory}
                style={{
                  background: t.accent,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                }}
                className="w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                Create Category
              </button>
            </Modal>
          )}
          {showItemModal && (
            <Modal
              title={editingItem ? "Edit Item" : "Add Item"}
              onClose={() => {
                setShowItemModal(false);
              }}
              t={t}
            >
              {/* ── Error banner — shown at top so it's never missed ── */}
              {itemForm.imageError && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2"
                >
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <p
                    style={{ color: "#B83232" }}
                    className="text-sm leading-snug"
                  >
                    {itemForm.imageError}
                  </p>
                </div>
              )}

              {/* ── Image Upload ── */}
              <div className="mb-5">
                <label
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs font-bold tracking-widest uppercase block mb-2"
                >
                  Item Image{" "}
                  <span
                    style={{ color: t.muted }}
                    className="normal-case font-normal"
                  >
                    (optional)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="item-image-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      setItemForm((f) => ({
                        ...f,
                        imageError: "Image must be under 5 MB.",
                      }));
                      return;
                    }
                    const preview = URL.createObjectURL(file);
                    setItemForm((f) => ({
                      ...f,
                      imageFile: file,
                      imagePreview: preview,
                      imageError: "",
                    }));
                  }}
                />
                <label
                  htmlFor="item-image-upload"
                  className="flex flex-col items-center justify-center rounded-xl overflow-hidden transition-all hover:opacity-80 active:scale-[0.98]"
                  style={{
                    background: t.surface2,
                    border: `2px dashed ${itemForm.imagePreview ? t.accent : t.border2}`,
                    cursor: "pointer",
                    minHeight: 140,
                  }}
                >
                  {itemForm.imagePreview ? (
                    <img
                      src={itemForm.imagePreview}
                      alt="Preview"
                      className="w-full object-cover"
                      style={{ maxHeight: 180 }}
                      onError={(e) => {
                        e.currentTarget.src = "/foodlogo.jpg";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
                      <span className="text-3xl">🖼️</span>
                      <p
                        style={{
                          color: t.subtle,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="text-sm font-medium"
                      >
                        Tap to upload image
                      </p>
                      <p
                        style={{
                          color: t.muted,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="text-xs"
                      >
                        PNG, JPG, WEBP · max 5 MB
                      </p>
                    </div>
                  )}
                </label>
                {itemForm.imagePreview && (
                  <button
                    onClick={() =>
                      setItemForm((f) => ({
                        ...f,
                        imageFile: null,
                        imagePreview: null,
                      }))
                    }
                    style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                    className="text-xs mt-2 hover:opacity-60 transition-opacity"
                  >
                    ✕ Remove image
                  </button>
                )}
              </div>

              {/* ── Item Name ── */}
              <Field
                label="Item Name"
                value={itemForm.name}
                onChange={(v) => setItemForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Chicken Wrap"
                t={t}
              />

              {/* ── Description (optional) ── */}
              <div className="mb-5">
                <label
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs font-semibold tracking-widest uppercase block mb-2"
                >
                  Description{" "}
                  <span
                    style={{ color: t.muted }}
                    className="normal-case font-normal"
                  >
                    (optional)
                  </span>
                </label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="A short description of the item…"
                  rows={2}
                  style={{
                    background: t.surface2,
                    border: `1px solid ${t.border2}`,
                    color: t.text,
                    fontFamily: "'Lato', sans-serif",
                    resize: "none",
                  }}
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
                />
              </div>

              {/* ── Price ── */}
              <Field
                label="Price (KD)"
                value={itemForm.price}
                onChange={(v) => setItemForm((f) => ({ ...f, price: v }))}
                type="number"
                placeholder="0.000"
                t={t}
              />

              {/* ── Availability Window ── */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label
                    style={{
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-semibold tracking-widest uppercase"
                  >
                    Availability Window{" "}
                    <span
                      style={{ color: t.muted }}
                      className="normal-case font-normal"
                    >
                      (Kuwait time · optional)
                    </span>
                  </label>
                  {(itemForm.avail_from || itemForm.avail_to) && (
                    <button
                      onClick={() =>
                        setItemForm((f) => ({
                          ...f,
                          avail_from: "",
                          avail_to: "",
                        }))
                      }
                      style={{
                        color: t.muted,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-xs hover:opacity-60 transition-opacity"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "avail_from", label: "From" },
                    { key: "avail_to", label: "To" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <p
                        style={{
                          color: t.muted,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="text-xs mb-1.5"
                      >
                        {label}
                      </p>
                      {/* Custom styled time picker — scrollable hour/minute columns */}
                      {(() => {
                        const val = itemForm[key] || "";
                        const [hh, mm] = val ? val.split(":") : ["", ""];
                        const curH = hh !== "" ? parseInt(hh) : null;
                        const curM = mm !== "" ? parseInt(mm) : null;
                        const setTime = (h, m) => {
                          if (h === null || m === null) {
                            setItemForm((f) => ({ ...f, [key]: "" }));
                          } else {
                            setItemForm((f) => ({
                              ...f,
                              [key]: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
                            }));
                          }
                        };
                        return (
                          <div
                            style={{
                              background: t.surface2,
                              border: `1px solid ${val ? t.accent : t.border2}`,
                              borderRadius: 12,
                              overflow: "hidden",
                            }}
                          >
                            {/* Display row */}
                            <div
                              style={{
                                borderBottom: `1px solid ${t.border}`,
                                background: val ? t.accentBg : "transparent",
                              }}
                              className="flex items-center justify-center gap-1 py-2.5"
                            >
                              <span
                                style={{
                                  color: val ? t.accent : t.muted,
                                  fontFamily: "'Lato', sans-serif",
                                }}
                                className="text-lg font-bold tabular-nums"
                              >
                                {val
                                  ? `${String(curH).padStart(2, "0")}:${String(curM).padStart(2, "0")}`
                                  : "--:--"}
                              </span>
                            </div>
                            {/* Hour scroll */}
                            <div className="flex" style={{ height: 120 }}>
                              <div
                                className="flex-1 overflow-y-auto"
                                style={{ scrollbarWidth: "none" }}
                              >
                                {Array.from({ length: 24 }, (_, h) => (
                                  <button
                                    key={h}
                                    onClick={() => setTime(h, curM ?? 0)}
                                    style={{
                                      background:
                                        curH === h ? t.accent : "transparent",
                                      color: curH === h ? "#fff" : t.subtle,
                                      fontFamily: "'Lato', sans-serif",
                                      width: "100%",
                                      display: "block",
                                      padding: "5px 0",
                                      fontSize: 13,
                                      fontWeight: curH === h ? 700 : 400,
                                      borderBottom: `1px solid ${t.border}`,
                                    }}
                                  >
                                    {String(h).padStart(2, "0")}
                                  </button>
                                ))}
                              </div>
                              <div style={{ width: 1, background: t.border }} />
                              {/* Minute scroll — 5-min steps */}
                              <div
                                className="flex-1 overflow-y-auto"
                                style={{ scrollbarWidth: "none" }}
                              >
                                {Array.from(
                                  { length: 12 },
                                  (_, i) => i * 5,
                                ).map((m) => (
                                  <button
                                    key={m}
                                    onClick={() => setTime(curH ?? 0, m)}
                                    style={{
                                      background:
                                        curM === m ? t.accent : "transparent",
                                      color: curM === m ? "#fff" : t.subtle,
                                      fontFamily: "'Lato', sans-serif",
                                      width: "100%",
                                      display: "block",
                                      padding: "5px 0",
                                      fontSize: 13,
                                      fontWeight: curM === m ? 700 : 400,
                                      borderBottom: `1px solid ${t.border}`,
                                    }}
                                  >
                                    :{String(m).padStart(2, "0")}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
                {itemForm.avail_from && itemForm.avail_to && (
                  <p
                    style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                    className="text-xs mt-2"
                  >
                    Item available {itemForm.avail_from} → {itemForm.avail_to}{" "}
                    KWT daily.
                    {itemForm.avail_to <= itemForm.avail_from
                      ? " (overnight span)"
                      : ""}
                  </p>
                )}
                {(itemForm.avail_from || itemForm.avail_to) &&
                  !(itemForm.avail_from && itemForm.avail_to) && (
                    <p
                      style={{
                        color: "#B45309",
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-xs mt-2"
                    >
                      ⚠️ Set both From and To to enable the time window.
                    </p>
                  )}
              </div>

              {/* ── Submit ── */}
              <button
                onClick={saveItem}
                disabled={savingItem}
                style={{
                  background: t.accent,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                  opacity: savingItem ? 0.7 : 1,
                }}
                className="w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                {savingItem
                  ? "Saving…"
                  : editingItem
                    ? "Save Changes"
                    : "Add Item"}
              </button>
            </Modal>
          )}

          {/* ── Variant Groups Modal ──────────────────────────────────────── */}
          {variantItem && (
            <div
              className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) closeVariants();
              }}
            >
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Lato', sans-serif",
                }}
                className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
              >
                {/* Header */}
                <div
                  style={{ borderBottom: `1px solid ${t.border}` }}
                  className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p
                      style={{
                        color: t.text,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                      className="text-xl font-bold tracking-wide truncate"
                    >
                      Variants — {variantItem.name}
                    </p>
                    <p
                      style={{
                        color: t.muted,
                        fontFamily: "'Lato', sans-serif",
                      }}
                      className="text-xs mt-0.5"
                    >
                      Add groups (e.g. Size, Spice Level) and their options
                    </p>
                  </div>
                  <button
                    onClick={closeVariants}
                    style={{ color: t.subtle }}
                    className="text-lg leading-none hover:opacity-60 transition-opacity w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {loadingVariants ? (
                    <p
                      style={{ color: t.muted }}
                      className="text-sm text-center py-6"
                    >
                      Loading variants…
                    </p>
                  ) : (
                    <>
                      {variantGroups.length === 0 && (
                        <div
                          style={{
                            border: `2px dashed ${t.border2}`,
                            color: t.muted,
                          }}
                          className="rounded-xl p-6 text-center text-sm italic"
                        >
                          No variant groups yet. Add one below to make this item
                          customizable.
                        </div>
                      )}

                      {variantGroups.map((group, gIdx) => (
                        <div
                          key={group.id || group._localId}
                          style={{
                            background: t.surface2,
                            border: `1px solid ${t.border}`,
                          }}
                          className="rounded-xl p-4"
                        >
                          {/* Group header row */}
                          <div className="flex items-start gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <input
                                value={group.name}
                                onChange={(e) =>
                                  updateVariantGroup(
                                    gIdx,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                placeholder="Group name (e.g. Size, Spice Level)"
                                style={{
                                  background: t.surface,
                                  border: `1px solid ${t.border2}`,
                                  color: t.text,
                                  fontFamily: "'Lato', sans-serif",
                                }}
                                className="w-full rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                              />
                            </div>
                            <button
                              onClick={() => removeVariantGroup(gIdx)}
                              style={{ color: t.muted }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:text-red-500 transition-colors flex-shrink-0 mt-0.5 text-sm"
                            >
                              🗑️
                            </button>
                          </div>

                          {/* Toggles */}
                          <div className="flex items-center gap-4 mb-3">
                            <button
                              onClick={() =>
                                updateVariantGroup(
                                  gIdx,
                                  "is_required",
                                  !group.is_required,
                                )
                              }
                              style={{
                                background: group.is_required
                                  ? t.accentBg
                                  : t.surface,
                                border: `1px solid ${group.is_required ? t.accentBorder : t.border2}`,
                                color: group.is_required ? t.accent : t.subtle,
                                fontFamily: "'Lato', sans-serif",
                              }}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                            >
                              <span>{group.is_required ? "✓" : "○"}</span>{" "}
                              Required
                            </button>
                            <button
                              onClick={() =>
                                updateVariantGroup(
                                  gIdx,
                                  "is_multiple",
                                  !group.is_multiple,
                                )
                              }
                              style={{
                                background: group.is_multiple
                                  ? t.accentBg
                                  : t.surface,
                                border: `1px solid ${group.is_multiple ? t.accentBorder : t.border2}`,
                                color: group.is_multiple ? t.accent : t.subtle,
                                fontFamily: "'Lato', sans-serif",
                              }}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                            >
                              <span>{group.is_multiple ? "✓" : "○"}</span>{" "}
                              Multi-select
                            </button>
                          </div>

                          {/* Options */}
                          <div className="space-y-2 mb-2">
                            {group.options.map((opt, oIdx) => (
                              <div
                                key={opt.id || opt._localId}
                                className="flex items-center gap-2"
                              >
                                <input
                                  value={opt.name}
                                  onChange={(e) =>
                                    updateVariantOption(
                                      gIdx,
                                      oIdx,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Option name (e.g. Large, Extra Spicy)"
                                  style={{
                                    background: t.surface,
                                    border: `1px solid ${t.border2}`,
                                    color: t.text,
                                    fontFamily: "'Lato', sans-serif",
                                  }}
                                  className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none"
                                />
                                <div
                                  className="flex items-center flex-shrink-0"
                                  style={{ width: 100 }}
                                >
                                  <span
                                    style={{
                                      color: t.muted,
                                      fontFamily: "'Lato', sans-serif",
                                    }}
                                    className="text-xs mr-1 flex-shrink-0"
                                  >
                                    KD
                                  </span>
                                  <input
                                    type="number"
                                    value={opt.price_adj}
                                    onChange={(e) =>
                                      updateVariantOption(
                                        gIdx,
                                        oIdx,
                                        "price_adj",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="0.000"
                                    step="0.001"
                                    style={{
                                      background: t.surface,
                                      border: `1px solid ${t.border2}`,
                                      color: t.text,
                                      fontFamily: "'Lato', sans-serif",
                                    }}
                                    className="w-full rounded-lg px-2 py-2 text-sm outline-none"
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    removeVariantOption(gIdx, oIdx)
                                  }
                                  style={{ color: t.muted }}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:text-red-500 transition-colors flex-shrink-0 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addVariantOption(gIdx)}
                            style={{
                              color: t.accent,
                              background: t.accentBg,
                              border: `1px solid ${t.accentBorder}`,
                              fontFamily: "'Lato', sans-serif",
                            }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity mt-1"
                          >
                            + Add Option
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={addVariantGroup}
                        style={{
                          background: t.surface2,
                          border: `2px dashed ${t.border2}`,
                          color: t.subtle,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="w-full py-3 rounded-xl text-xs font-semibold tracking-wider hover:opacity-80 transition-opacity"
                      >
                        + Add Variant Group
                      </button>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div
                  style={{ borderTop: `1px solid ${t.border}` }}
                  className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
                >
                  <button
                    onClick={closeVariants}
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border2}`,
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveVariants}
                    disabled={savingVariants || loadingVariants}
                    style={{
                      background: t.accent,
                      color: "#fff",
                      fontFamily: "'Lato', sans-serif",
                      opacity: savingVariants || loadingVariants ? 0.7 : 1,
                    }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
                  >
                    {savingVariants ? "Saving…" : "Save Variants"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Add-On Type Modal ─────────────────────────────────────────── */}
          {showAddonTypeModal && (
            <Modal
              title={editingAddonType ? "Edit Add-On Type" : "New Add-On Type"}
              onClose={() => setShowAddonTypeModal(false)}
              t={t}
            >
              <Field
                label="Type Name"
                value={addonTypeForm.name}
                onChange={(v) => setAddonTypeForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Sauces, Toppings, Extras"
                t={t}
              />
              <Field
                label="Minimum Required (optional)"
                value={addonTypeForm.minQty}
                onChange={(v) => setAddonTypeForm((f) => ({ ...f, minQty: v }))}
                type="number"
                placeholder="0"
                t={t}
              />
              <button
                onClick={saveAddonType}
                disabled={savingAddon}
                style={{
                  background: t.accent,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                  opacity: savingAddon ? 0.7 : 1,
                }}
                className="w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                {savingAddon
                  ? "Saving…"
                  : editingAddonType
                    ? "Save Changes"
                    : "Create Type"}
              </button>
            </Modal>
          )}

          {/* ── Add/Edit Add-On Item Modal ────────────────────────────────── */}
          {showAddonModal && (
            <Modal
              title={editingAddon ? "Edit Add-On" : "Add Add-On"}
              onClose={() => setShowAddonModal(false)}
              t={t}
            >
              {/* Error banner */}
              {addonForm.imageError && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2"
                >
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <p
                    style={{ color: "#B83232" }}
                    className="text-sm leading-snug"
                  >
                    {addonForm.imageError}
                  </p>
                </div>
              )}

              {/* Image upload */}
              <div className="mb-5">
                <label
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs font-bold tracking-widest uppercase block mb-2"
                >
                  Image{" "}
                  <span
                    style={{ color: t.muted }}
                    className="normal-case font-normal"
                  >
                    (optional)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="addon-image-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      setAddonForm((f) => ({
                        ...f,
                        imageError: "Image must be under 5 MB.",
                      }));
                      return;
                    }
                    const preview = URL.createObjectURL(file);
                    setAddonForm((f) => ({
                      ...f,
                      imageFile: file,
                      imagePreview: preview,
                      imageError: "",
                    }));
                  }}
                />
                <label
                  htmlFor="addon-image-upload"
                  className="flex flex-col items-center justify-center rounded-xl overflow-hidden transition-all hover:opacity-80 active:scale-[0.98]"
                  style={{
                    background: t.surface2,
                    border: `2px dashed ${addonForm.imagePreview ? t.accent : t.border2}`,
                    cursor: "pointer",
                    minHeight: 120,
                  }}
                >
                  {addonForm.imagePreview ? (
                    <img
                      src={addonForm.imagePreview}
                      alt="Preview"
                      className="w-full object-cover"
                      style={{ maxHeight: 160 }}
                      onError={(e) => {
                        e.currentTarget.src = "/sides.jpg";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
                      <span className="text-3xl">🖼️</span>
                      <p
                        style={{
                          color: t.subtle,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="text-sm font-medium"
                      >
                        Tap to upload image
                      </p>
                      <p
                        style={{
                          color: t.muted,
                          fontFamily: "'Lato', sans-serif",
                        }}
                        className="text-xs"
                      >
                        PNG, JPG, WEBP · max 5 MB
                      </p>
                    </div>
                  )}
                </label>
                {addonForm.imagePreview && (
                  <button
                    onClick={() =>
                      setAddonForm((f) => ({
                        ...f,
                        imageFile: null,
                        imagePreview: null,
                      }))
                    }
                    style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                    className="text-xs mt-2 hover:opacity-60 transition-opacity"
                  >
                    ✕ Remove image
                  </button>
                )}
              </div>

              {/* Name */}
              <Field
                label="Add-On Name"
                value={addonForm.name}
                onChange={(v) => setAddonForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Ketchup, Mayo, Extra Cheese"
                t={t}
              />

              {/* Price */}
              <Field
                label="Price (KD)"
                value={addonForm.price}
                onChange={(v) => setAddonForm((f) => ({ ...f, price: v }))}
                type="number"
                placeholder="0.000"
                t={t}
              />

              {/* Type selector */}
              <div className="mb-5">
                <label
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs font-bold tracking-widest uppercase block mb-2"
                >
                  Add-On Type{" "}
                  <span
                    style={{ color: t.muted }}
                    className="normal-case font-normal"
                  >
                    (optional — leave empty for Uncategorized)
                  </span>
                </label>
                <select
                  value={addonForm.typeId ?? ""}
                  onChange={(e) =>
                    setAddonForm((f) => ({
                      ...f,
                      typeId: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  style={{
                    background: t.surface2,
                    border: `1px solid ${t.border2}`,
                    color: t.text,
                    fontFamily: "'Lato', sans-serif",
                  }}
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                >
                  <option value="">Uncategorized</option>
                  {addonTypes.map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                      style={{ background: t.surface2 }}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={saveAddon}
                disabled={savingAddon}
                style={{
                  background: t.accent,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                  opacity: savingAddon ? 0.7 : 1,
                }}
                className="w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                {savingAddon
                  ? "Saving…"
                  : editingAddon
                    ? "Save Changes"
                    : "Add Add-On"}
              </button>
            </Modal>
          )}

          {/* ── Confirm Delete Addon ──────────────────────────────────────── */}
          {confirmDeleteAddon && (
            <div
              className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setConfirmDeleteAddon(null);
              }}
            >
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Lato', sans-serif",
                }}
                className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="px-6 pt-6 pb-2 text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                    }}
                  >
                    🗑️
                  </div>
                  <p
                    style={{
                      color: t.text,
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                    className="text-xl font-bold mb-2"
                  >
                    {confirmDeleteAddon.kind === "type"
                      ? "Delete Add-On Type?"
                      : "Delete Add-On?"}
                  </p>
                  <p
                    style={{ color: t.subtle }}
                    className="text-sm leading-relaxed"
                  >
                    <span style={{ color: t.text }} className="font-semibold">
                      "{confirmDeleteAddon.name}"
                    </span>{" "}
                    will be permanently deleted.
                    {confirmDeleteAddon.kind === "type" &&
                      " All items in this type will become Uncategorized."}{" "}
                    This cannot be undone.
                  </p>
                </div>
                <div className="p-6 flex gap-3">
                  <button
                    onClick={() => setConfirmDeleteAddon(null)}
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border2}`,
                      color: t.text,
                    }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-80 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      confirmDeleteAddon.kind === "type"
                        ? executeDeleteAddonType()
                        : executeDeleteAddonItem()
                    }
                    style={{ background: "#B83232", color: "#fff" }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Confirm Delete Modal ─────────────────────────────────────── */}
          {confirmDelete && (
            <div
              className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setConfirmDelete(null);
              }}
            >
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Lato', sans-serif",
                }}
                className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="px-6 pt-6 pb-2 text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                    }}
                  >
                    🗑️
                  </div>
                  <p
                    style={{
                      color: t.text,
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                    className="text-xl font-bold mb-2"
                  >
                    {confirmDelete.type === "cat"
                      ? "Delete Category?"
                      : "Delete Item?"}
                  </p>
                  <p
                    style={{ color: t.subtle }}
                    className="text-sm leading-relaxed"
                  >
                    <span style={{ color: t.text }} className="font-semibold">
                      "{confirmDelete.name}"
                    </span>{" "}
                    will be permanently deleted.
                    {confirmDelete.type === "cat" &&
                      " All items in this category will also be removed."}{" "}
                    This cannot be undone.
                  </p>
                </div>
                <div className="p-6 flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border2}`,
                      color: t.text,
                    }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-80 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      confirmDelete.type === "cat"
                        ? executeDeleteCat()
                        : executeDeleteItem()
                    }
                    style={{ background: "#B83232", color: "#fff" }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Time-Limit Override Warning ──────────────────────────────── */}
          {timeBlockedItem && (
            <div
              className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setTimeBlockedItem(null);
              }}
            >
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Lato', sans-serif",
                }}
                className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="px-6 pt-6 pb-2 text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{
                      background: "#FFFBEB",
                      border: "1px solid #FCD34D",
                    }}
                  >
                    🕐
                  </div>
                  <p
                    style={{
                      color: t.text,
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                    className="text-xl font-bold mb-2"
                  >
                    Outside Availability Window
                  </p>
                  <p
                    style={{ color: t.subtle }}
                    className="text-sm leading-relaxed mb-1"
                  >
                    <span style={{ color: t.text }} className="font-semibold">
                      "{timeBlockedItem.name}"
                    </span>{" "}
                    is set to be available only between{" "}
                    <span style={{ color: t.accent }} className="font-semibold">
                      {timeBlockedItem.avail_from?.slice(0, 5)} –{" "}
                      {timeBlockedItem.avail_to?.slice(0, 5)} KWT
                    </span>
                    .
                  </p>
                  <p
                    style={{ color: t.subtle }}
                    className="text-sm leading-relaxed"
                  >
                    To mark it In Stock now, first update the time window to
                    include the current time, or clear the time limit entirely.
                  </p>
                </div>
                <div className="p-6 flex gap-3">
                  <button
                    onClick={() => setTimeBlockedItem(null)}
                    style={{
                      background: t.surface2,
                      border: `1px solid ${t.border2}`,
                      color: t.text,
                    }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-80 active:scale-95 transition-all"
                  >
                    Got it
                  </button>
                  <button
                    onClick={() => {
                      setTimeBlockedItem(null);
                      openEditItem(timeBlockedItem);
                    }}
                    style={{ background: t.accent, color: "#fff" }}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                  >
                    ✏️ Edit Time Limit
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Root Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState("home");
  const [delivery, setDelivery] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [liveNewCount, setLiveNewCount] = useState(0);
  const [liveAcceptedCount, setLiveAcceptedCount] = useState(0);

  const t = darkMode ? DARK : LIGHT;
  const restId = user?.role === "owner" ? user?.main_rest : user?.rest_id;

  // Live order counts for header badges
  useEffect(() => {
    if (!restId) return;
    const fetchCounts = async () => {
      const { data } = await supabase
        .from("Orders")
        .select("id, status")
        .eq("rest_id", restId)
        .in("status", ["pending", "accepted", "preparing", "on_the_way"]);
      const rows = data || [];
      setLiveNewCount(rows.filter((o) => o.status === "pending").length);
      setLiveAcceptedCount(
        rows.filter((o) =>
          ["accepted", "preparing", "on_the_way"].includes(o.status),
        ).length,
      );
    };
    fetchCounts();
    const ch = supabase
      .channel(`dash-counts-${restId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Orders",
          filter: `rest_id=eq.${restId}`,
        },
        fetchCounts,
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [restId]);

  const newCount = liveNewCount;
  const acceptedCount = liveAcceptedCount;

  const renderPage = () => {
    switch (activeNav) {
      case "home":
        return <HomePage t={t} />;
      case "orders":
        return <OrdersPage t={t} user={user} />;
      case "menu":
        return <MenuPage t={t} user={user} />;
      default:
        return (
          <div className="p-8 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: t.text,
                }}
                className="text-2xl font-bold mb-2"
              >
                {NAV_ITEMS.find((n) => n.id === activeNav)?.label}
              </p>
              <p
                style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                className="text-sm"
              >
                Coming soon
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: t.bg, fontFamily: "'Lato', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;600;700&display=swap');
        body { margin: 0; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${t.scrollTrack}; }
        ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 4px; }
      `}</style>

      {/* Fixed header */}
      <header
        style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}
        className="flex-shrink-0 h-16 flex items-center justify-between px-4 md:px-6 z-50"
      >
        <div className="flex items-center gap-3">
          <button
            style={{ color: t.subtle }}
            className="md:hidden text-xl w-8 h-8 flex items-center justify-center"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            ☰
          </button>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: t.accent,
            }}
            className="text-2xl font-bold tracking-tight"
          >
            FeastRush
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div
            style={{
              background: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          >
            <span
              style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
              className="text-xs font-medium"
            >
              New
            </span>
            <span
              style={{ background: t.accent, color: "#fff" }}
              className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {newCount}
            </span>
          </div>
          <div
            style={{
              background: t.greenBg,
              border: `1px solid ${t.greenBorder}`,
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          >
            <span
              style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
              className="text-xs font-medium"
            >
              Accepted
            </span>
            <span
              style={{
                background: t.green,
                color: darkMode ? "#0a1f10" : "#fff",
              }}
              className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {acceptedCount}
            </span>
          </div>
          <div
            style={{ background: t.surface2, border: `1px solid ${t.border2}` }}
            className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5"
          >
            <span
              style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
              className="text-xs font-medium"
            >
              Delivery
            </span>
            <Toggle value={delivery} onChange={setDelivery} t={t} />
          </div>
          <div
            style={{ background: t.surface2, border: `1px solid ${t.border2}` }}
            className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5"
          >
            <span
              style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
              className="text-xs font-medium"
            >
              Pickup
            </span>
            <Toggle value={pickup} onChange={setPickup} t={t} />
          </div>
          <ThemeBtn
            dark={darkMode}
            onToggle={() => setDarkMode((d) => !d)}
            t={t}
          />
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/*
          FIX 1 — Sidebar sign-out visibility on mobile:
          Changed h-[calc(100vh-64px)] to use dvh (dynamic viewport height) which
          accounts for mobile browser chrome (address bar). Also restructured the
          sidebar so nav scrolls independently while the user/sign-out footer is
          always pinned at the bottom regardless of nav item count.
        */}
        <aside
          className={`
            flex-shrink-0 flex flex-col
            fixed md:static top-16 left-0 z-40
            w-52
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          style={{
            background: t.surface,
            borderRight: `1px solid ${t.border}`,
            // Use dvh so mobile browser chrome is excluded from the height calculation.
            // Falls back to svh, then vh for older browsers.
            height: "calc(100dvh - 64px)",
          }}
        >
          {/* Nav items — scrollable independently */}
          <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto min-h-0">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
                style={{
                  background: activeNav === item.id ? t.accent : "transparent",
                  color: activeNav === item.id ? "#fff" : t.subtle,
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 w-full hover:opacity-80"
              >
                <span className="text-base">{item.icon}</span>
                <span
                  style={{ fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-medium flex-1"
                >
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span
                    style={{
                      background:
                        activeNav === item.id
                          ? "rgba(255,255,255,0.25)"
                          : t.surface2,
                      color: activeNav === item.id ? "#fff" : t.text,
                    }}
                    className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/*
            FIX: User info + sign-out pinned at bottom with flex-shrink-0.
            Previously this could get squeezed off-screen when nav was too tall.
          */}
          <div
            style={{ borderTop: `1px solid ${t.border}` }}
            className="p-4 flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{
                  background: t.accentBg,
                  border: `1px solid ${t.accentBorder}`,
                  color: t.accent,
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              >
                {(user.name || user.username || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p
                  style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-semibold truncate"
                >
                  {user.name || user.username || user.id}
                </p>
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs capitalize"
                >
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
              className="text-xs hover:opacity-70 transition-opacity font-medium"
            >
              ← Sign out
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main
          style={{ background: t.bg }}
          className={`flex-1 min-w-0 ${["orders", "menu"].includes(activeNav) ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
