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

const SAMPLE_ORDERS = [
  {
    id: "ORD-875",
    status: "new",
    type: "delivery",
    customer: "Hrishi Uralath",
    phone: "971585691229",
    items: 2,
    time: "less than a minute ago",
    subtotal: 201.0,
    deliveryCharge: 5.0,
    total: 206.0,
    paymentMethod: "Card",
    orderItems: [
      {
        qty: 3,
        name: "UAE's Best Karak",
        price: 81.0,
        variant: "Combo Test",
        addons: ["1 x Olives", "1 x Cheese Cubes"],
        addonLabel: null,
      },
      {
        qty: 4,
        name: "Hrishi's Chicken Fried Rice",
        price: 120.0,
        variant: null,
        addons: ["Red Chutney", "White Chutney"],
        addonLabel: "SAUCE",
      },
    ],
    receiver: {
      name: "Hrishikesh Uralath",
      phone: "971585691229",
      address:
        "Al taawun, 1202, Laffah restaurant building, Al Mamzar Plaza - Al Taawun St - Al Mamzar - Sharjah - UAE",
    },
    notes: "No Notes Added",
  },
  {
    id: "ORD-874",
    status: "accepted",
    type: "pickup",
    customer: "Sara Ahmed",
    phone: "971501234567",
    items: 3,
    time: "5 minutes ago",
    subtotal: 95.0,
    deliveryCharge: 0.0,
    total: 95.0,
    paymentMethod: "Cash",
    orderItems: [
      {
        qty: 2,
        name: "Chicken Shawarma",
        price: 50.0,
        variant: null,
        addons: ["Extra Sauce"],
        addonLabel: "EXTRAS",
      },
      {
        qty: 1,
        name: "Mango Juice",
        price: 15.0,
        variant: null,
        addons: [],
        addonLabel: null,
      },
      {
        qty: 1,
        name: "Hummus Platter",
        price: 30.0,
        variant: "Large",
        addons: ["Extra Pita"],
        addonLabel: "ADD-ONS",
      },
    ],
    receiver: {
      name: "Sara Ahmed",
      phone: "971501234567",
      address: "Pickup - Al Nahda, Dubai",
    },
    notes: "Extra napkins please",
  },
];

const INITIAL_ADDONS = [
  {
    id: "ao-1",
    name: "Extra Sauce",
    price: 2.0,
    group: "Sauces",
    enabled: true,
  },
  {
    id: "ao-2",
    name: "Cheese Cubes",
    price: 5.0,
    group: "Extras",
    enabled: true,
  },
  { id: "ao-3", name: "Olives", price: 3.0, group: "Extras", enabled: true },
  {
    id: "ao-4",
    name: "Extra Pita",
    price: 4.0,
    group: "Breads",
    enabled: true,
  },
  {
    id: "ao-5",
    name: "Red Chutney",
    price: 1.5,
    group: "Sauces",
    enabled: true,
  },
  {
    id: "ao-6",
    name: "White Chutney",
    price: 1.5,
    group: "Sauces",
    enabled: false,
  },
  {
    id: "ao-7",
    name: "Onion Raita",
    price: 3.0,
    group: "Sides",
    enabled: true,
  },
];

const uid = () => Math.random().toString(36).slice(2, 9);

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
function OrdersPage({ t }) {
  const [orderTab, setOrderTab] = useState("new");
  const [selectedOrder, setSelected] = useState(null);
  const [mobileView, setMobileView] = useState("list");

  const newOrders = SAMPLE_ORDERS.filter((o) => o.status === "new");
  const acceptedOrders = SAMPLE_ORDERS.filter((o) => o.status === "accepted");
  const displayed = orderTab === "new" ? newOrders : acceptedOrders;

  const selectOrder = (order) => {
    setSelected(order);
    setMobileView("detail");
  };

  const OrderCard = ({ order }) => (
    <button
      onClick={() => selectOrder(order)}
      style={{
        background: selectedOrder?.id === order.id ? t.accentBg : t.surface,
        border: `1px solid ${selectedOrder?.id === order.id ? t.accentBorder : t.border}`,
      }}
      className="w-full text-left rounded-xl p-4 transition-all duration-200 active:scale-[0.98] hover:shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">
            {order.type === "delivery" ? "🚴" : "🏪"}
          </span>
          <span
            style={{
              color: order.type === "delivery" ? t.accent : t.green,
              fontFamily: "'Lato', sans-serif",
            }}
            className="text-xs font-bold tracking-wider uppercase"
          >
            {order.type}
          </span>
        </div>
        <span
          style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
          className="text-xs"
        >
          {order.time}
        </span>
      </div>
      <p
        style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
        className="text-sm font-semibold"
      >
        {order.customer}
      </p>
      <div className="flex justify-between mt-1.5">
        <p
          style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
          className="text-xs"
        >
          {order.id}
        </p>
        <p
          style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
          className="text-xs font-bold"
        >
          AED {order.total.toFixed(2)}
        </p>
      </div>
      <p
        style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
        className="text-xs mt-1"
      >
        {order.items} items · {order.paymentMethod}
      </p>
    </button>
  );

  const OrderDetail = () =>
    !selectedOrder ? null : (
      <div
        style={{ background: t.surface, border: `1px solid ${t.border}` }}
        className="flex-1 flex flex-col rounded-xl overflow-hidden min-w-0"
      >
        <div
          style={{ borderBottom: `1px solid ${t.border}` }}
          className="px-5 pt-5 pb-4 flex items-center gap-3 flex-shrink-0"
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
              className="text-xl md:text-2xl font-bold"
            >
              {selectedOrder.id}
            </h2>
            <p
              style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
              className="text-xs"
            >
              {selectedOrder.items} items · {selectedOrder.customer}
            </p>
          </div>
          <span
            style={{
              background: t.accentBg,
              color: t.accent,
              border: `1px solid ${t.accentBorder}`,
              fontFamily: "'Lato', sans-serif",
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg tracking-wider uppercase flex-shrink-0"
          >
            {selectedOrder.paymentMethod}
          </span>
        </div>

        {/* FIX: changed overflow-y-auto to be on this wrapper so the whole detail scrolls */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="px-5 py-3 space-y-1.5 flex-shrink-0"
          >
            {[
              ["Sub-total", `AED ${selectedOrder.subtotal.toFixed(2)}`],
              ...(selectedOrder.type === "delivery"
                ? [
                    [
                      "Delivery",
                      `AED ${selectedOrder.deliveryCharge.toFixed(2)}`,
                    ],
                  ]
                : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                >
                  {k}
                </span>
                <span
                  style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                >
                  {v}
                </span>
              </div>
            ))}
            <div
              style={{ borderTop: `1px solid ${t.border}` }}
              className="flex justify-between text-sm pt-2"
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
                AED {selectedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="grid grid-cols-12 px-5 py-2 flex-shrink-0"
          >
            {[
              ["Qty", "col-span-2"],
              ["Items", "col-span-7"],
              ["AED", "col-span-3 text-right"],
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

          {selectedOrder.orderItems.map((item, i) => (
            <div
              key={i}
              style={{ borderBottom: `1px solid ${t.border}` }}
              className="grid grid-cols-12 px-5 py-4 flex-shrink-0"
            >
              <div className="col-span-2">
                <span
                  style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-bold"
                >
                  {item.qty}
                </span>
              </div>
              <div className="col-span-7">
                <p
                  style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-semibold"
                >
                  {item.name}
                </p>
                {item.variant && (
                  <p
                    style={{
                      color: t.accent,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs mt-0.5"
                  >
                    {item.variant}
                  </p>
                )}
                {item.addonLabel && (
                  <p
                    style={{
                      color: t.accent,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs font-bold mt-1 tracking-wider"
                  >
                    {item.addonLabel}
                  </p>
                )}
                {item.addons.map((a, j) => (
                  <p
                    key={j}
                    style={{
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs"
                  >
                    · {a}
                  </p>
                ))}
              </div>
              <div className="col-span-3 text-right">
                <span
                  style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm font-semibold"
                >
                  {item.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="px-5 py-4 space-y-1.5 flex-shrink-0"
          >
            <p
              style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
              className="text-xs font-bold tracking-widest uppercase mb-2"
            >
              Receiver
            </p>
            {[
              ["Name", selectedOrder.receiver.name],
              ["Contact", selectedOrder.receiver.phone],
              ["Address", selectedOrder.receiver.address],
            ].map(([k, v]) => (
              <p
                key={k}
                style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                className="text-sm leading-relaxed"
              >
                <span style={{ color: t.text }} className="font-semibold">
                  {k}:{" "}
                </span>
                {v}
              </p>
            ))}
          </div>

          <div
            className="mx-5 my-4 rounded-xl overflow-hidden relative flex-shrink-0"
            style={{
              height: 120,
              background: t.surface2,
              border: `1px solid ${t.border}`,
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              viewBox="0 0 300 120"
              preserveAspectRatio="xMidYMid slice"
            >
              {[0, 30, 60, 90, 120].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke={t.accent}
                  strokeWidth="0.5"
                />
              ))}
              {[0, 50, 100, 150, 200, 250, 300].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="120"
                  stroke={t.accent}
                  strokeWidth="0.5"
                />
              ))}
              <path
                d="M0,60 Q75,40 150,70 T300,50"
                stroke={t.accent}
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <circle cx="150" cy="70" r="7" fill={t.accent} opacity="0.9" />
              <circle cx="150" cy="70" r="3" fill={t.bg} />
            </svg>
            <div className="absolute bottom-2 left-2 right-2">
              <div
                style={{
                  background: `${t.surface}dd`,
                  border: `1px solid ${t.border}`,
                }}
                className="rounded-lg px-3 py-1.5"
              >
                <p
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs"
                >
                  📍 {selectedOrder.receiver.address.split(",")[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 mb-2 flex-shrink-0">
            <p
              style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
              className="text-xs font-bold tracking-widest uppercase mb-1.5"
            >
              Notes
            </p>
            <p
              style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
              className="text-sm italic"
            >
              {selectedOrder.notes}
            </p>
          </div>

          {/* Accept/Reject buttons — now inside the scrollable area at the bottom */}
          <div
            style={{ borderTop: `1px solid ${t.border}` }}
            className="px-5 py-4 flex gap-3 flex-shrink-0 mt-auto"
          >
            <button
              style={{
                border: `1px solid ${t.red}`,
                color: t.red,
                fontFamily: "'Lato', sans-serif",
              }}
              className="flex-1 py-3 rounded-lg text-sm font-semibold hover:opacity-80 active:scale-95 transition-all"
            >
              Reject
            </button>
            <button
              style={{
                background: t.accent,
                color: "#fff",
                fontFamily: "'Lato', sans-serif",
              }}
              className="flex-1 py-3 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Accept Order
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 md:px-8 pt-6 pb-4 flex-shrink-0">
        <h1
          style={{ fontFamily: "'Cormorant Garamond', serif", color: t.text }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Active Orders
        </h1>
      </div>

      <div className="hidden lg:flex flex-1 overflow-hidden px-5 md:px-6 pb-6 gap-4">
        <div
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
          className="w-64 flex-shrink-0 flex flex-col rounded-xl overflow-hidden"
        >
          <div
            style={{ borderBottom: `1px solid ${t.border}` }}
            className="flex"
          >
            {[
              ["new", newOrders.length, t.accent],
              ["accepted", acceptedOrders.length, t.green],
            ].map(([tab, count, col]) => (
              <button
                key={tab}
                onClick={() => setOrderTab(tab)}
                style={{
                  color: orderTab === tab ? col : t.subtle,
                  borderBottomColor: orderTab === tab ? col : "transparent",
                  fontFamily: "'Lato', sans-serif",
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors"
              >
                {tab[0].toUpperCase() + tab.slice(1)}
                <span
                  style={{
                    background: orderTab === tab ? col : t.surface2,
                    color: orderTab === tab ? "#fff" : t.text,
                  }}
                  className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {displayed.length === 0 && (
              <p
                style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                className="text-sm text-center mt-8"
              >
                No orders
              </p>
            )}
            {displayed.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
        {selectedOrder ? (
          <OrderDetail />
        ) : (
          <div
            style={{ background: t.surface, border: `1px solid ${t.border}` }}
            className="flex-1 flex flex-col items-center justify-center rounded-xl gap-3"
          >
            <span className="text-5xl opacity-30">🍽️</span>
            <p
              style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
              className="text-sm"
            >
              Select an order to view details
            </p>
          </div>
        )}
        {selectedOrder && (
          <div className="hidden xl:flex w-64 flex-shrink-0 flex-col gap-4">
            <div
              style={{ background: t.surface, border: `1px solid ${t.border}` }}
              className="rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{
                    background: t.accentBg,
                    border: `1px solid ${t.accentBorder}`,
                    color: t.accent,
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                >
                  {selectedOrder.customer.charAt(0)}
                </div>
                <div>
                  <p
                    style={{ color: t.text, fontFamily: "'Lato', sans-serif" }}
                    className="text-sm font-semibold"
                  >
                    {selectedOrder.customer}
                  </p>
                  <p
                    style={{
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs"
                  >
                    {selectedOrder.phone}
                  </p>
                </div>
              </div>
              <div
                style={{ borderTop: `1px solid ${t.border}` }}
                className="pt-3 space-y-1.5"
              >
                <p
                  style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                >
                  Receiver
                </p>
                {[
                  ["Name", selectedOrder.receiver.name],
                  ["Contact", selectedOrder.receiver.phone],
                  ["Address", selectedOrder.receiver.address],
                ].map(([k, v]) => (
                  <p
                    key={k}
                    style={{
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs leading-relaxed"
                  >
                    <span style={{ color: t.text }} className="font-semibold">
                      {k}:{" "}
                    </span>
                    {v}
                  </p>
                ))}
              </div>
            </div>
            <div
              style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                height: 160,
              }}
              className="rounded-xl overflow-hidden relative"
            >
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                viewBox="0 0 300 160"
                preserveAspectRatio="xMidYMid slice"
              >
                {[0, 40, 80, 120, 160].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="300"
                    y2={y}
                    stroke={t.accent}
                    strokeWidth="0.5"
                  />
                ))}
                {[0, 60, 120, 180, 240, 300].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="160"
                    stroke={t.accent}
                    strokeWidth="0.5"
                  />
                ))}
                <path
                  d="M0,80 Q75,60 150,90 T300,70"
                  stroke={t.accent}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="150" cy="90" r="7" fill={t.accent} opacity="0.9" />
                <circle cx="150" cy="90" r="3" fill={t.bg} />
              </svg>
              <div className="absolute bottom-3 left-3 right-3">
                <div
                  style={{
                    background: `${t.surface}dd`,
                    border: `1px solid ${t.border}`,
                  }}
                  className="rounded-lg px-3 py-2"
                >
                  <p
                    style={{
                      color: t.subtle,
                      fontFamily: "'Lato', sans-serif",
                    }}
                    className="text-xs truncate"
                  >
                    📍 {selectedOrder.receiver.address.split(",")[0]}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{ background: t.surface, border: `1px solid ${t.border}` }}
              className="rounded-xl p-4"
            >
              <p
                style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
                className="text-xs font-bold tracking-widest uppercase mb-2"
              >
                Notes
              </p>
              <p
                style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                className="text-sm italic"
              >
                {selectedOrder.notes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile order views ── */}
      <div className="lg:hidden flex-1 overflow-hidden relative">
        {/* List panel */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ${mobileView === "list" ? "translate-x-0" : "-translate-x-full"}`}
          style={{ background: t.bg }}
        >
          <div
            style={{
              borderBottom: `1px solid ${t.border}`,
              background: t.surface,
            }}
            className="flex flex-shrink-0"
          >
            {[
              ["new", newOrders.length, t.accent],
              ["accepted", acceptedOrders.length, t.green],
            ].map(([tab, count, col]) => (
              <button
                key={tab}
                onClick={() => setOrderTab(tab)}
                style={{
                  color: orderTab === tab ? col : t.subtle,
                  borderBottomColor: orderTab === tab ? col : "transparent",
                  fontFamily: "'Lato', sans-serif",
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors"
              >
                {tab[0].toUpperCase() + tab.slice(1)}
                <span
                  style={{
                    background: orderTab === tab ? col : t.surface2,
                    color: orderTab === tab ? "#fff" : t.text,
                  }}
                  className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
            {displayed.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <span className="text-4xl opacity-30">🍽️</span>
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm"
                >
                  No {orderTab} orders
                </p>
              </div>
            )}
            {displayed.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Detail panel — FIX: removed inner padding wrapper so OrderDetail fills the panel
            and its own internal overflow-y-auto handles all scrolling */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ${mobileView === "detail" ? "translate-x-0" : "translate-x-full"}`}
          style={{ background: t.bg }}
        >
          {selectedOrder && <OrderDetail />}
        </div>
      </div>
    </div>
  );
}

// ─── Menu Page ────────────────────────────────────────────────────────────────
function MenuPage({ t, user }) {
  // categories shape: { id, name, visible, sort_order, items: [...] }
  // items shape: { id, name, price, is_available, visible, description, image_path, sort_order, categ_id, rest_id, emoji }
  const [categories, setCategories] = useState([]);
  const [addons, setAddons] = useState(INITIAL_ADDONS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [itemOrderDirty, setItemOrderDirty] = useState(false);
  const [savingItemOrder, setSavingItemOrder] = useState(false);

  const [section, setSection] = useState("menu");
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [mobilePanel, setMobilePanel] = useState("categories");
  const [showAddCat, setShowAddCat] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingAddon, setEditingAddon] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    emoji: "🍽️",
    description: "",
  });
  const [addonForm, setAddonForm] = useState({
    name: "",
    price: "",
    group: "",
  });
  const [savingItem, setSavingItem] = useState(false);

  // Derive rest_id from user role
  const restId = user?.role === "owner" ? user?.main_rest : user?.rest_id;

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
            "id, name, price, is_available, visible, description, image_path, sort_order, categ_id, recommended",
          )
          .eq("rest_id", restId)
          .order("sort_order", { ascending: true });

        if (itemErr) throw itemErr;

        // Map emoji from name/description (not in schema, default to 🍽️)
        const itemsBycat = {};
        (items || []).forEach((item) => {
          const cid = item.categ_id;
          if (!itemsBycat[cid]) itemsBycat[cid] = [];
          itemsBycat[cid].push({ ...item });
        });

        const built = cats.map((c) => ({
          ...c,
          enabled: c.visible, // alias for UI consistency
          items: itemsBycat[c.id] || [],
        }));

        setCategories(built);
        setSelectedCatId(built[0]?.id || null);
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
  const deleteCat = async (id) => {
    // Optimistic remove from UI
    setCategories((p) => p.filter((c) => c.id !== id));
    if (selectedCatId === id) {
      const remaining = categories.filter((c) => c.id !== id);
      setSelectedCatId(remaining[0]?.id || null);
    }
    setMobilePanel("categories");
    const { error } = await supabase.from("Categories").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete category:", error);
      // Re-fetch to restore correct state
      window.location.reload();
    }
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

  // ── Item is_available toggle → immediate DB ────────────────────────────────
  const toggleItemStock = async (cid, iid) => {
    const cat = categories.find((c) => c.id === cid);
    const item = cat?.items.find((i) => i.id === iid);
    if (!item) return;
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

  // ── Delete item → DB ───────────────────────────────────────────────────────
  const deleteItem = async (cid, iid) => {
    setCategories((p) =>
      p.map((c) =>
        c.id !== cid ? c : { ...c, items: c.items.filter((i) => i.id !== iid) },
      ),
    );
    const { error } = await supabase.from("Menu").delete().eq("id", iid);
    if (error) console.error("Failed to delete item:", error);
  };

  // ── Open item modal ────────────────────────────────────────────────────────
  const openAddItem = () => {
    setEditingItem(null);
    setItemForm({ name: "", price: "", emoji: "🍽️", description: "" });
    setShowItemModal(true);
  };
  const openEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      price: String(item.price),
      emoji: item.emoji || "🍽️",
      description: item.description || "",
    });
    setShowItemModal(true);
  };

  // ── Save item → INSERT or UPDATE DB ───────────────────────────────────────
  const saveItem = async () => {
    const p = parseFloat(itemForm.price);
    if (!itemForm.name.trim() || isNaN(p)) return;
    setSavingItem(true);
    try {
      if (editingItem) {
        // UPDATE
        const { error } = await supabase
          .from("Menu")
          .update({
            name: itemForm.name.trim(),
            price: p,
            description: itemForm.description.trim() || null,
          })
          .eq("id", editingItem.id);
        if (error) throw error;
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
                          emoji: itemForm.emoji,
                        }
                      : i,
                  ),
                },
          ),
        );
      } else {
        // INSERT
        const sortOrder = (selectedCat?.items?.length || 0) + 1;
        const { data, error } = await supabase
          .from("Menu")
          .insert({
            rest_id: restId,
            categ_id: selectedCatId,
            name: itemForm.name.trim(),
            price: p,
            description: itemForm.description.trim() || null,
            image_path: "",
            is_available: true,
            visible: true,
            recommended: false,
            sort_order: sortOrder,
          })
          .select()
          .single();
        if (error) throw error;
        setCategories((prev) =>
          prev.map((c) =>
            c.id !== selectedCatId
              ? c
              : {
                  ...c,
                  items: [...c.items, { ...data, emoji: itemForm.emoji }],
                },
          ),
        );
      }
      setShowItemModal(false);
    } catch (err) {
      console.error("Failed to save item:", err);
    } finally {
      setSavingItem(false);
    }
  };

  // ── Add-ons (still local — not in current scope) ───────────────────────────
  const toggleAddon = (id) =>
    setAddons((p) =>
      p.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );
  const deleteAddon = (id) => setAddons((p) => p.filter((a) => a.id !== id));
  const openAddAddon = () => {
    setEditingAddon(null);
    setAddonForm({ name: "", price: "", group: "" });
    setShowAddonModal(true);
  };
  const openEditAddon = (a) => {
    setEditingAddon(a);
    setAddonForm({ name: a.name, price: String(a.price), group: a.group });
    setShowAddonModal(true);
  };
  const saveAddon = () => {
    const p = parseFloat(addonForm.price);
    if (!addonForm.name.trim() || isNaN(p)) return;
    if (editingAddon)
      setAddons((prev) =>
        prev.map((a) =>
          a.id === editingAddon.id
            ? {
                ...a,
                name: addonForm.name.trim(),
                price: p,
                group: addonForm.group || "General",
              }
            : a,
        ),
      );
    else
      setAddons((prev) => [
        ...prev,
        {
          id: `ao-${uid()}`,
          name: addonForm.name.trim(),
          price: p,
          group: addonForm.group || "General",
          enabled: true,
        },
      ]);
    setShowAddonModal(false);
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

  const addonGroups = [...new Set(addons.map((a) => a.group))];
  const EMOJIS = [
    "🍽️",
    "🍛",
    "🍜",
    "🥞",
    "☕",
    "🍚",
    "🥭",
    "🍋",
    "🍲",
    "🥗",
    "🍗",
    "🥩",
    "🧆",
    "🫔",
    "🥘",
    "🍱",
  ];

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
          className="flex items-center justify-between pb-4 mb-4"
        >
          <p
            style={{ fontFamily: "'Cormorant Garamond', serif", color: t.text }}
            className="text-xl font-bold"
          >
            {selectedCat.name}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteCat(selectedCat.id)}
              style={{ color: t.subtle }}
              className="text-sm hover:text-red-500 transition-colors p-1"
            >
              🗑️
            </button>
            <Toggle
              value={selectedCat.visible}
              onChange={() => toggleCat(selectedCat.id)}
              t={t}
            />
          </div>
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
                  : "/logo.png"
              }
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
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
            </div>
            <p
              style={{ color: t.accent, fontFamily: "'Lato', sans-serif" }}
              className="text-sm font-bold mt-0.5"
            >
              AED {Number(item.price).toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => openEditItem(item)}
              style={{ color: t.subtle }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-60 transition-opacity text-sm"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteItem(selectedCatId, item.id)}
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
                    {itemOrderDirty && (
                      <button
                        onClick={saveItemOrder}
                        disabled={savingItemOrder}
                        style={{
                          background: t.green,
                          color: "#fff",
                          fontFamily: "'Lato', sans-serif",
                          opacity: savingItemOrder ? 0.7 : 1,
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      >
                        {savingItemOrder ? "Saving…" : "💾 Save"}
                      </button>
                    )}
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
              {addonGroups.length === 0 && (
                <p
                  style={{ color: t.muted, fontFamily: "'Lato', sans-serif" }}
                  className="text-sm italic"
                >
                  No add-ons yet.
                </p>
              )}
              {addonGroups.map((group) => (
                <div key={group} className="mb-8">
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: t.text,
                      borderBottom: `1px solid ${t.border}`,
                    }}
                    className="text-xl font-bold pb-3 mb-3"
                  >
                    {group}
                  </p>
                  <div className="space-y-2">
                    {addons
                      .filter((a) => a.group === group)
                      .map((addon) => (
                        <div
                          key={addon.id}
                          style={{
                            background: t.surface,
                            border: `1px solid ${t.border}`,
                          }}
                          className="flex items-center gap-3 rounded-xl px-4 py-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              style={{
                                color: t.text,
                                fontFamily: "'Lato', sans-serif",
                              }}
                              className="text-sm font-semibold"
                            >
                              {addon.name}
                            </p>
                            <p
                              style={{
                                color: t.accent,
                                fontFamily: "'Lato', sans-serif",
                              }}
                              className="text-xs font-bold mt-0.5"
                            >
                              AED {addon.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditAddon(addon)}
                              style={{ color: t.subtle }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-60 transition-opacity text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteAddon(addon.id)}
                              style={{ color: t.subtle }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:text-red-500 transition-colors text-sm"
                            >
                              🗑️
                            </button>
                            <Toggle
                              value={addon.enabled}
                              onChange={() => toggleAddon(addon.id)}
                              t={t}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
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
              onClose={() => setShowItemModal(false)}
              t={t}
            >
              <div className="mb-5">
                <label
                  style={{ color: t.subtle, fontFamily: "'Lato', sans-serif" }}
                  className="text-xs font-bold tracking-widest uppercase block mb-2"
                >
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setItemForm((f) => ({ ...f, emoji: e }))}
                      style={{
                        background:
                          itemForm.emoji === e ? t.accentBg : t.surface2,
                        border: `1px solid ${itemForm.emoji === e ? t.accent : t.border2}`,
                      }}
                      className="w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Item Name"
                value={itemForm.name}
                onChange={(v) => setItemForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Chicken Wrap"
                t={t}
              />
              <Field
                label="Price (AED)"
                value={itemForm.price}
                onChange={(v) => setItemForm((f) => ({ ...f, price: v }))}
                type="number"
                placeholder="0.00"
                t={t}
              />
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
          {showAddonModal && (
            <Modal
              title={editingAddon ? "Edit Add-On" : "New Add-On"}
              onClose={() => setShowAddonModal(false)}
              t={t}
            >
              <Field
                label="Add-On Name"
                value={addonForm.name}
                onChange={(v) => setAddonForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Extra Sauce"
                t={t}
              />
              <Field
                label="Price (AED)"
                value={addonForm.price}
                onChange={(v) => setAddonForm((f) => ({ ...f, price: v }))}
                type="number"
                placeholder="0.00"
                t={t}
              />
              <Field
                label="Group"
                value={addonForm.group}
                onChange={(v) => setAddonForm((f) => ({ ...f, group: v }))}
                placeholder="e.g. Sauces"
                t={t}
              />
              <button
                onClick={saveAddon}
                style={{
                  background: t.accent,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                }}
                className="w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                {editingAddon ? "Save Changes" : "Add Add-On"}
              </button>
            </Modal>
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

  const t = darkMode ? DARK : LIGHT;

  const newCount = SAMPLE_ORDERS.filter((o) => o.status === "new").length;
  const acceptedCount = SAMPLE_ORDERS.filter(
    (o) => o.status === "accepted",
  ).length;

  const renderPage = () => {
    switch (activeNav) {
      case "home":
        return <HomePage t={t} />;
      case "orders":
        return <OrdersPage t={t} />;
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
