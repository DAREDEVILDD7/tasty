import { useState, useRef } from "react";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const DARK = {
  bg:          "#0f0e0c",
  surface:     "#161512",
  surface2:    "#1e1c18",
  border:      "#2a2620",
  border2:     "#2e2b24",
  muted:       "#3d3a32",
  subtle:      "#6b6457",
  text:        "#f0ead8",
  accent:      "#f4a127",
  accentHover: "#e8911a",
  accentBg:    "rgba(244,161,39,0.10)",
  accentBorder:"rgba(244,161,39,0.40)",
  scrollTrack: "#161512",
  scrollThumb: "#2e2b24",
  toggleOff:   "#2e2b24",
};

const LIGHT = {
  bg:          "#faf8f4",
  surface:     "#ffffff",
  surface2:    "#f4f0e8",
  border:      "#e2ddd4",
  border2:     "#d4cfc4",
  muted:       "#a09880",
  subtle:      "#7a7264",
  text:        "#1a1814",
  accent:      "#d4891a",
  accentHover: "#bf7a15",
  accentBg:    "rgba(212,137,26,0.08)",
  accentBorder:"rgba(212,137,26,0.35)",
  scrollTrack: "#f4f0e8",
  scrollThumb: "#d4cfc4",
  toggleOff:   "#d4cfc4",
};

// ─── Static data ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: "⊞", label: "Home",          id: "home" },
  { icon: "🛒", label: "Orders",        id: "orders" },
  { icon: "📖", label: "Menu",          id: "menu" },
  { icon: "👤", label: "Customers",     id: "customers" },
  { icon: "🏷️", label: "Discounts",     id: "discounts" },
  { icon: "✕",  label: "Cancellations", id: "cancellations" },
  { icon: "📡", label: "Broadcast",     id: "broadcast" },
  { icon: "💬", label: "Inbox",         id: "inbox", badge: 3 },
  { icon: "🚴", label: "Delivery",      id: "delivery" },
  { icon: "⭐", label: "Reviews",       id: "reviews", badge: 0 },
];

const STAT_CARDS = [
  { icon: "🛒", label: "Total Accepted Orders",   value: "0",        sub: "0% change from yesterday" },
  { icon: "💰", label: "Total Revenue",            value: "AED 0",    sub: "0% change from yesterday" },
  { icon: "💎", label: "Revenue saved by tasty",   value: "AED 0.00", sub: "0% change from yesterday" },
  { icon: "👥", label: "Customers",                value: "0",        sub: "0% change from yesterday" },
  { icon: "⏱️", label: "Total Delayed Orders",     value: "0",        sub: "0 order(s) less from yesterday", green: true },
];

const BOTTOM_CARDS = [
  { label: "Top Selling Items" },
  { label: "Top Locations" },
  { label: "Top Customers" },
];

const SAMPLE_ORDERS = [
  {
    id: "ORD-875", status: "new", type: "delivery",
    customer: "Hrishi Uralath", phone: "971585691229",
    items: 2, time: "less than a minute ago",
    subtotal: 201.0, deliveryCharge: 5.0, total: 206.0, paymentMethod: "Card",
    orderItems: [
      { qty: 3, name: "UAE's Best Karak",            price: 81.0,  variant: "Combo Test", addons: ["1 x Olives","1 x Cheese Cubes"], addonLabel: null },
      { qty: 4, name: "Hrishi's Chicken Fried Rice", price: 120.0, variant: null,          addons: ["Red Chutney","White Chutney"],   addonLabel: "SAUCE" },
    ],
    receiver: { name: "Hrishikesh Uralath", phone: "971585691229", address: "Al taawun, 1202, Laffah restaurant building, Al Mamzar Plaza - Al Taawun St - Al Mamzar - Sharjah - UAE" },
    notes: "No Notes Added",
  },
  {
    id: "ORD-874", status: "accepted", type: "pickup",
    customer: "Sara Ahmed", phone: "971501234567",
    items: 3, time: "5 minutes ago",
    subtotal: 95.0, deliveryCharge: 0.0, total: 95.0, paymentMethod: "Cash",
    orderItems: [
      { qty: 2, name: "Chicken Shawarma", price: 50.0, variant: null,    addons: ["Extra Sauce"], addonLabel: "EXTRAS" },
      { qty: 1, name: "Mango Juice",       price: 15.0, variant: null,    addons: [],              addonLabel: null },
      { qty: 1, name: "Hummus Platter",    price: 30.0, variant: "Large", addons: ["Extra Pita"],  addonLabel: "ADD-ONS" },
    ],
    receiver: { name: "Sara Ahmed", phone: "971501234567", address: "Pickup - Al Nahda, Dubai" },
    notes: "Extra napkins please",
  },
];

const INITIAL_MENU = [
  {
    id: "cat-1", name: "Recommended For You", enabled: true,
    items: [
      { id: "i-1", name: "UAE's Best Karak",     price: 27.0, addOns: 2, inStock: true,  enabled: true, emoji: "☕" },
      { id: "i-2", name: "Chicken Fried Rice",   price: 45.0, addOns: 1, inStock: true,  enabled: true, emoji: "🍚" },
    ],
  },
  {
    id: "cat-2", name: "Dosas", enabled: true,
    items: [
      { id: "i-3", name: "Set Dosa",    price: 20.0, addOns: 1, inStock: true,  enabled: true, emoji: "🥞" },
      { id: "i-4", name: "Masala Dosa", price: 25.0, addOns: 0, inStock: false, enabled: true, emoji: "🥞" },
    ],
  },
  {
    id: "cat-3", name: "South Indian Delicacies", enabled: true,
    items: [
      { id: "i-5", name: "Chatti Chor", price: 24.0, addOns: 0, inStock: true, enabled: true, emoji: "🍛" },
      { id: "i-6", name: "Idli Sambar", price: 18.0, addOns: 1, inStock: true, enabled: true, emoji: "🍲" },
    ],
  },
  {
    id: "cat-4", name: "Rice & Noodles", enabled: true,
    items: [
      { id: "i-7", name: "Ramen",           price: 40.0, addOns: 1, inStock: true, enabled: true, emoji: "🍜" },
      { id: "i-8", name: "Biryani Special", price: 55.0, addOns: 2, inStock: true, enabled: true, emoji: "🍚" },
    ],
  },
  {
    id: "cat-5", name: "Beverages", enabled: true,
    items: [
      { id: "i-9",  name: "Mango Lassi",    price: 15.0, addOns: 0, inStock: true, enabled: true, emoji: "🥭" },
      { id: "i-10", name: "Fresh Lime Soda", price: 12.0, addOns: 0, inStock: true, enabled: true, emoji: "🍋" },
    ],
  },
];

const INITIAL_ADDONS = [
  { id: "ao-1", name: "Extra Sauce",   price: 2.0, group: "Sauces", enabled: true },
  { id: "ao-2", name: "Cheese Cubes",  price: 5.0, group: "Extras", enabled: true },
  { id: "ao-3", name: "Olives",        price: 3.0, group: "Extras", enabled: true },
  { id: "ao-4", name: "Extra Pita",    price: 4.0, group: "Breads", enabled: true },
  { id: "ao-5", name: "Red Chutney",   price: 1.5, group: "Sauces", enabled: true },
  { id: "ao-6", name: "White Chutney", price: 1.5, group: "Sauces", enabled: false },
  { id: "ao-7", name: "Onion Raita",   price: 3.0, group: "Sides",  enabled: true },
];

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Shared components ────────────────────────────────────────────────────────
function Toggle({ value, onChange, t }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{ background: value ? t.accent : t.toggleOff }}
      className="relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none flex-shrink-0"
    >
      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${value ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function ThemeBtn({ dark, onToggle, t }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Switch to Light" : "Switch to Dark"}
      style={{ background: t.surface2, border: `1px solid ${t.border2}`, color: t.text }}
      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 hover:opacity-80 active:scale-95 transition-all"
    >
      <span className="text-sm">{dark ? "☀️" : "🌙"}</span>
      <span className="text-xs tracking-wider hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

function Modal({ title, onClose, children, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, fontFamily: "'DM Mono', monospace" }}
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div style={{ borderBottom: `1px solid ${t.border}` }} className="flex items-center justify-between px-5 py-4">
          <p style={{ color: t.text, fontFamily: "'Playfair Display', serif" }} className="text-lg font-black">{title}</p>
          <button onClick={onClose} style={{ color: t.subtle }} className="text-xl leading-none hover:opacity-60 transition-opacity">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, t }) {
  return (
    <div className="mb-4">
      <label style={{ color: t.subtle }} className="text-xs tracking-widest uppercase block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ background: t.surface2, border: `1px solid ${t.border2}`, color: t.text, fontFamily: "'DM Mono', monospace" }}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      />
    </div>
  );
}

// ─── Menu Page ────────────────────────────────────────────────────────────────
function MenuPage({ t }) {
  const [categories, setCategories] = useState(INITIAL_MENU);
  const [addons, setAddons]         = useState(INITIAL_ADDONS);
  const [section, setSection]       = useState("menu");
  const [selectedCat, setSelectedCat] = useState("cat-1");

  const [showAddCat,   setShowAddCat]   = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [editingItem,  setEditingItem]  = useState(null);
  const [editingAddon, setEditingAddon] = useState(null);

  const [newCatName, setNewCatName] = useState("");
  const [itemForm, setItemForm]     = useState({ name: "", price: "", emoji: "🍽️" });
  const [addonForm, setAddonForm]   = useState({ name: "", price: "", group: "" });

  const dragCat  = useRef(null);
  const overCat  = useRef(null);
  const dragItem = useRef(null);
  const overItem = useRef(null);

  // Category drag-to-reorder
  const onCatDrop = () => {
    if (dragCat.current === null || overCat.current === null) return;
    const next = [...categories];
    const [m] = next.splice(dragCat.current, 1);
    next.splice(overCat.current, 0, m);
    setCategories(next);
    dragCat.current = null; overCat.current = null;
  };

  // Item drag-to-reorder within a category
  const onItemDrop = (catId) => {
    if (!dragItem.current || !overItem.current || dragItem.current === overItem.current) return;
    setCategories(prev => prev.map(c => {
      if (c.id !== catId) return c;
      const items = [...c.items];
      const fi = items.findIndex(x => x.id === dragItem.current);
      const ti = items.findIndex(x => x.id === overItem.current);
      const [m] = items.splice(fi, 1);
      items.splice(ti, 0, m);
      return { ...c, items };
    }));
    dragItem.current = null; overItem.current = null;
  };

  const toggleCat  = id => setCategories(p => p.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  const deleteCat  = id => { setCategories(p => p.filter(c => c.id !== id)); setSelectedCat(s => s === id ? categories.find(c => c.id !== id)?.id : s); };

  const toggleItem      = (cid, iid) => setCategories(p => p.map(c => c.id !== cid ? c : { ...c, items: c.items.map(i => i.id === iid ? { ...i, enabled: !i.enabled } : i) }));
  const toggleItemStock = (cid, iid) => setCategories(p => p.map(c => c.id !== cid ? c : { ...c, items: c.items.map(i => i.id === iid ? { ...i, inStock: !i.inStock } : i) }));
  const deleteItem      = (cid, iid) => setCategories(p => p.map(c => c.id !== cid ? c : { ...c, items: c.items.filter(i => i.id !== iid) }));

  const openAddItem  = () => { setEditingItem(null);  setItemForm({ name: "", price: "", emoji: "🍽️" }); setShowItemModal(true); };
  const openEditItem = item => { setEditingItem(item); setItemForm({ name: item.name, price: String(item.price), emoji: item.emoji }); setShowItemModal(true); };
  const saveItem = () => {
    const p = parseFloat(itemForm.price);
    if (!itemForm.name.trim() || isNaN(p)) return;
    setCategories(prev => prev.map(c => {
      if (c.id !== selectedCat) return c;
      if (editingItem) return { ...c, items: c.items.map(i => i.id === editingItem.id ? { ...i, name: itemForm.name.trim(), price: p, emoji: itemForm.emoji } : i) };
      return { ...c, items: [...c.items, { id: `i-${uid()}`, name: itemForm.name.trim(), price: p, addOns: 0, inStock: true, enabled: true, emoji: itemForm.emoji }] };
    }));
    setShowItemModal(false);
  };

  const toggleAddon  = id => setAddons(p => p.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  const deleteAddon  = id => setAddons(p => p.filter(a => a.id !== id));
  const openAddAddon  = () => { setEditingAddon(null);   setAddonForm({ name: "", price: "", group: "" }); setShowAddonModal(true); };
  const openEditAddon = a  => { setEditingAddon(a);      setAddonForm({ name: a.name, price: String(a.price), group: a.group }); setShowAddonModal(true); };
  const saveAddon = () => {
    const p = parseFloat(addonForm.price);
    if (!addonForm.name.trim() || isNaN(p)) return;
    if (editingAddon) {
      setAddons(prev => prev.map(a => a.id === editingAddon.id ? { ...a, name: addonForm.name.trim(), price: p, group: addonForm.group || "General" } : a));
    } else {
      setAddons(prev => [...prev, { id: `ao-${uid()}`, name: addonForm.name.trim(), price: p, group: addonForm.group || "General", enabled: true }]);
    }
    setShowAddonModal(false);
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const cat = { id: `cat-${uid()}`, name: newCatName.trim(), enabled: true, items: [] };
    setCategories(p => [...p, cat]);
    setSelectedCat(cat.id);
    setNewCatName(""); setShowAddCat(false);
  };

  const addonGroups = [...new Set(addons.map(a => a.group))];
  const EMOJIS = ["🍽️","🍛","🍜","🥞","☕","🍚","🥭","🍋","🍲","🥗","🍗","🥩","🧆","🫔","🥘","🍱"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 md:px-8 pt-6 pb-4 flex items-center justify-between flex-wrap gap-3">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-3xl md:text-4xl font-black">Menu</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button style={{ background: t.surface2, border: `1px solid ${t.border2}`, color: t.subtle }}
            className="text-xs px-4 py-2.5 rounded-xl tracking-widest uppercase hover:opacity-80 transition-all active:scale-95">
            Download CSV 📥
          </button>
          <button style={{ background: t.surface2, border: `1px solid ${t.border2}`, color: t.subtle }}
            className="text-xs px-4 py-2.5 rounded-xl tracking-widest uppercase hover:opacity-80 transition-all active:scale-95">
            Upload CSV 📤
          </button>
          <button onClick={section === "menu" ? openAddItem : openAddAddon}
            style={{ background: t.accent, color: "#0f0e0c" }}
            className="text-xs font-bold px-4 py-2.5 rounded-xl tracking-widest uppercase hover:opacity-90 transition-all active:scale-95">
            + {section === "menu" ? "Add Item" : "Add Add-On"}
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ borderBottom: `1px solid ${t.border}` }} className="px-5 md:px-8 flex gap-6">
        {[["menu","Menu Items"],["addons","Add-Ons"]].map(([id, label]) => (
          <button key={id} onClick={() => setSection(id)}
            style={{ color: section === id ? t.accent : t.subtle, borderBottomColor: section === id ? t.accent : "transparent" }}
            className="pb-3 text-xs tracking-widest uppercase font-bold border-b-2 transition-colors">
            {label}
          </button>
        ))}
      </div>

      {section === "menu" ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Categories sidebar */}
          <div style={{ background: t.surface, borderRight: `1px solid ${t.border}`, width: 210, minWidth: 160 }}
            className="flex-shrink-0 flex flex-col overflow-hidden">
            <div style={{ borderBottom: `1px solid ${t.border}` }} className="px-4 pt-4 pb-3 flex items-center justify-between">
              <p style={{ color: t.subtle }} className="text-xs tracking-widest uppercase font-bold">Categories</p>
              <button onClick={() => setShowAddCat(true)}
                style={{ color: t.accent, background: t.accentBg, border: `1px solid ${t.accentBorder}` }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity">
                +
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {categories.map((cat, i) => (
                <div key={cat.id}
                  draggable
                  onDragStart={() => { dragCat.current = i; }}
                  onDragEnter={() => { overCat.current = i; }}
                  onDragEnd={onCatDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => setSelectedCat(cat.id)}
                  style={{
                    background: selectedCat === cat.id ? t.accentBg : "transparent",
                    borderLeft: `3px solid ${selectedCat === cat.id ? t.accent : "transparent"}`,
                    color: selectedCat === cat.id ? t.accent : t.subtle,
                    cursor: "grab",
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-150 select-none"
                >
                  <span style={{ color: t.muted }} className="text-xs">⠿</span>
                  <span className="text-xs tracking-wide flex-1 truncate font-bold">{cat.name}</span>
                  {!cat.enabled && <span style={{ color: t.muted }} className="text-xs leading-none">•</span>}
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${t.border}` }} className="p-3">
              <button onClick={() => setSection("addons")} style={{ color: t.accent }}
                className="text-xs tracking-widest font-bold hover:opacity-70 transition-opacity">
                View Add-Ons ↓
              </button>
            </div>
          </div>

          {/* Items panel */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
            {categories.map(cat => (
              <div key={cat.id}>
                {/* Category header row */}
                <div style={{ borderBottom: `1px solid ${t.border}` }} className="flex items-center justify-between pb-2 mb-3">
                  <p style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-lg font-black">{cat.name}</p>
                  <div className="flex items-center gap-2">
                    <button style={{ color: t.subtle }} className="text-base hover:opacity-60 transition-opacity" title="Duplicate">⧉</button>
                    <button style={{ color: t.subtle }} className="text-base hover:opacity-60 transition-opacity" title="Edit">✏️</button>
                    <button onClick={() => deleteCat(cat.id)} style={{ color: t.subtle }} className="text-base hover:text-red-400 transition-colors" title="Delete">🗑️</button>
                    <Toggle value={cat.enabled} onChange={() => toggleCat(cat.id)} t={t} />
                  </div>
                </div>

                {cat.items.length === 0 && (
                  <p style={{ color: t.muted }} className="text-xs italic py-2 px-1">No items yet.</p>
                )}

                {cat.items.map(item => (
                  <div key={item.id}
                    draggable
                    onDragStart={() => { dragItem.current = item.id; }}
                    onDragEnter={() => { overItem.current = item.id; }}
                    onDragEnd={() => onItemDrop(cat.id)}
                    onDragOver={e => e.preventDefault()}
                    style={{ background: t.surface, border: `1px solid ${t.border}`, cursor: "grab" }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-2 transition-all"
                  >
                    <span style={{ color: t.muted }} className="text-xs select-none">⠿</span>
                    <div style={{ background: t.surface2, border: `1px solid ${t.border}` }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 select-none">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p style={{ color: t.text }} className="text-sm font-bold tracking-wide">{item.name}</p>
                        <span
                          onClick={() => toggleItemStock(cat.id, item.id)}
                          style={{ background: item.inStock ? "#14532d" : "#450a0a", color: item.inStock ? "#4ade80" : "#f87171" }}
                          className="text-xs px-2 py-0.5 rounded-full cursor-pointer select-none">
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <p style={{ color: t.accent }} className="text-sm font-bold mt-0.5">AED {item.price.toFixed(2)}</p>
                    </div>
                    <p style={{ color: t.subtle }} className="text-xs tracking-wider hidden sm:block flex-shrink-0">Add Ons | {item.addOns}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button style={{ color: t.subtle }} className="text-base hover:opacity-60 transition-opacity">☆</button>
                      <button onClick={() => openEditItem(item)} style={{ color: t.subtle }} className="text-base hover:opacity-60 transition-opacity">✏️</button>
                      <button onClick={() => deleteItem(cat.id, item.id)} style={{ color: t.subtle }} className="text-base hover:text-red-400 transition-colors">🗑️</button>
                      <Toggle value={item.enabled} onChange={() => toggleItem(cat.id, item.id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Add-Ons panel */
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {addonGroups.length === 0 && <p style={{ color: t.muted }} className="text-xs italic">No add-ons yet.</p>}
          {addonGroups.map(group => (
            <div key={group} className="mb-8">
              <p style={{ fontFamily: "'Playfair Display', serif", color: t.text, borderBottom: `1px solid ${t.border}` }}
                className="text-lg font-black pb-2 mb-3">{group}</p>
              <div className="space-y-2">
                {addons.filter(a => a.group === group).map(addon => (
                  <div key={addon.id}
                    style={{ background: t.surface, border: `1px solid ${t.border}` }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all">
                    <div className="flex-1 min-w-0">
                      <p style={{ color: t.text }} className="text-sm font-bold tracking-wide">{addon.name}</p>
                      <p style={{ color: t.accent }} className="text-xs mt-0.5">AED {addon.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditAddon(addon)} style={{ color: t.subtle }} className="text-base hover:opacity-60 transition-opacity">✏️</button>
                      <button onClick={() => deleteAddon(addon.id)} style={{ color: t.subtle }} className="text-base hover:text-red-400 transition-colors">🗑️</button>
                      <Toggle value={addon.enabled} onChange={() => toggleAddon(addon.id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {showAddCat && (
        <Modal title="New Category" onClose={() => setShowAddCat(false)} t={t}>
          <Field label="Category Name" value={newCatName} onChange={setNewCatName} placeholder="e.g. Wraps" t={t} />
          <button onClick={addCategory} style={{ background: t.accent, color: "#0f0e0c" }}
            className="w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all active:scale-95 mt-1">
            Create Category
          </button>
        </Modal>
      )}

      {showItemModal && (
        <Modal title={editingItem ? "Edit Item" : "Add Item"} onClose={() => setShowItemModal(false)} t={t}>
          <div className="mb-4">
            <label style={{ color: t.subtle }} className="text-xs tracking-widest uppercase block mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setItemForm(f => ({ ...f, emoji: e }))}
                  style={{ background: itemForm.emoji === e ? t.accentBg : t.surface2, border: `1px solid ${itemForm.emoji === e ? t.accent : t.border2}` }}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all">
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Field label="Item Name"    value={itemForm.name}  onChange={v => setItemForm(f => ({ ...f, name: v }))}  placeholder="e.g. Chicken Wrap" t={t} />
          <Field label="Price (AED)"  value={itemForm.price} onChange={v => setItemForm(f => ({ ...f, price: v }))} type="number" placeholder="0.00" t={t} />
          <button onClick={saveItem} style={{ background: t.accent, color: "#0f0e0c" }}
            className="w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all active:scale-95 mt-1">
            {editingItem ? "Save Changes" : "Add Item"}
          </button>
        </Modal>
      )}

      {showAddonModal && (
        <Modal title={editingAddon ? "Edit Add-On" : "New Add-On"} onClose={() => setShowAddonModal(false)} t={t}>
          <Field label="Add-On Name"  value={addonForm.name}  onChange={v => setAddonForm(f => ({ ...f, name: v }))}  placeholder="e.g. Extra Sauce" t={t} />
          <Field label="Price (AED)"  value={addonForm.price} onChange={v => setAddonForm(f => ({ ...f, price: v }))} type="number" placeholder="0.00" t={t} />
          <Field label="Group"        value={addonForm.group} onChange={v => setAddonForm(f => ({ ...f, group: v }))} placeholder="e.g. Sauces" t={t} />
          <button onClick={saveAddon} style={{ background: t.accent, color: "#0f0e0c" }}
            className="w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all active:scale-95 mt-1">
            {editingAddon ? "Save Changes" : "Add Add-On"}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
function OrdersPage({ t }) {
  const [orderTab, setOrderTab]     = useState("new");
  const [selectedOrder, setSelected] = useState(SAMPLE_ORDERS[0]);

  const newOrders      = SAMPLE_ORDERS.filter(o => o.status === "new");
  const acceptedOrders = SAMPLE_ORDERS.filter(o => o.status === "accepted");
  const displayed      = orderTab === "new" ? newOrders : acceptedOrders;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 md:px-8 pt-6 pb-4">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-3xl md:text-4xl font-black">Active Orders</h1>
      </div>

      <div className="flex flex-1 overflow-hidden px-3 md:px-6 pb-6 gap-4">
        {/* List */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}` }}
          className="w-full md:w-56 lg:w-64 flex-shrink-0 flex flex-col rounded-2xl overflow-hidden">
          <div style={{ borderBottom: `1px solid ${t.border}` }} className="flex">
            {[["new", newOrders.length, t.accent],["accepted", acceptedOrders.length, "#4ade80"]].map(([tab, count, col]) => (
              <button key={tab} onClick={() => setOrderTab(tab)}
                style={{ color: orderTab===tab ? col : t.subtle, borderBottomColor: orderTab===tab ? col : "transparent" }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-widest uppercase font-bold border-b-2 transition-colors">
                {tab[0].toUpperCase()+tab.slice(1)}
                <span style={{ background: orderTab===tab ? col : t.surface2, color: orderTab===tab ? "#0f0e0c" : t.text }}
                  className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {displayed.length === 0 && <p style={{ color: t.muted }} className="text-xs text-center mt-8">No orders</p>}
            {displayed.map(order => (
              <button key={order.id} onClick={() => setSelected(order)}
                style={{ background: selectedOrder?.id===order.id ? t.accentBg : t.bg, border: `1px solid ${selectedOrder?.id===order.id ? t.accentBorder : t.border}` }}
                className="w-full text-left rounded-xl p-3 transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{order.type==="delivery"?"🚴":"🏪"}</span>
                  <span style={{ color: order.type==="delivery" ? t.accent : "#4ade80" }} className="text-xs font-bold tracking-widest uppercase">{order.type}</span>
                </div>
                <p style={{ color: t.text }} className="text-xs font-bold">{order.customer}</p>
                <div className="flex justify-between mt-1">
                  <p style={{ color: t.subtle }} className="text-xs">{order.id}</p>
                  <p style={{ color: t.subtle }} className="text-xs">{order.items} items</p>
                </div>
                <p style={{ color: t.muted }} className="text-xs mt-1">{order.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selectedOrder ? (
          <div style={{ background: t.surface, border: `1px solid ${t.border}` }}
            className="flex-1 flex flex-col rounded-2xl overflow-hidden min-w-0">
            <div style={{ borderBottom: `1px solid ${t.border}` }} className="px-5 pt-5 pb-4 flex items-center justify-between">
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-2xl font-black">{selectedOrder.id}</h2>
                <p style={{ color: t.subtle }} className="text-xs tracking-wider mt-0.5">{selectedOrder.items} Items</p>
              </div>
              <span style={{ background: t.surface2, color: t.accent, border: `1px solid ${t.accentBorder}` }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl tracking-widest uppercase">{selectedOrder.paymentMethod}</span>
            </div>
            <div style={{ borderBottom: `1px solid ${t.border}` }} className="px-5 py-4 space-y-1.5">
              <div className="flex justify-between text-xs"><span style={{ color: t.subtle }}>Sub-total Bill:</span><span style={{ color: t.text }}>AED {selectedOrder.subtotal.toFixed(2)}</span></div>
              {selectedOrder.type==="delivery" && <div className="flex justify-between text-xs"><span style={{ color: t.subtle }}>Delivery Charge:</span><span style={{ color: t.text }}>AED {selectedOrder.deliveryCharge.toFixed(2)}</span></div>}
              <div style={{ borderTop: `1px solid ${t.border}` }} className="flex justify-between text-xs pt-1">
                <span style={{ color: t.text }} className="font-bold">Total Bill:</span>
                <span style={{ color: t.accent }} className="font-bold">AED {selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div style={{ borderBottom: `1px solid ${t.border}` }} className="grid grid-cols-12 px-5 py-2">
                <span style={{ color: t.muted }} className="col-span-2 text-xs tracking-widest uppercase">Qty</span>
                <span style={{ color: t.muted }} className="col-span-7 text-xs tracking-widest uppercase">Order Items ({selectedOrder.items})</span>
                <span style={{ color: t.muted }} className="col-span-3 text-xs tracking-widest uppercase text-right">Price (AED)</span>
              </div>
              {selectedOrder.orderItems.map((item, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${t.border}` }} className="grid grid-cols-12 px-5 py-4">
                  <div className="col-span-2"><span style={{ color: t.accent }} className="text-sm font-bold">{item.qty}</span></div>
                  <div className="col-span-7">
                    <p style={{ color: t.text }} className="text-sm font-bold">{item.name}</p>
                    {item.variant && <p style={{ color: t.accent }} className="text-xs mt-1">{item.variant}</p>}
                    {item.addonLabel && <p style={{ color: t.accent }} className="text-xs mt-1">{item.addonLabel}</p>}
                    {item.addons.map((a,j) => <p key={j} style={{ color: t.subtle }} className="text-xs">- {a}</p>)}
                  </div>
                  <div className="col-span-3 text-right"><span style={{ color: t.text }} className="text-sm font-bold">{item.price.toFixed(2)}</span></div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${t.border}` }} className="px-5 py-4 flex gap-3">
              <button className="flex-1 py-3 rounded-xl border border-red-700 text-red-400 text-xs tracking-widest uppercase font-bold hover:bg-red-900/20 active:scale-95 transition-all">Reject</button>
              <button style={{ background: t.accent, color: "#0f0e0c" }} className="flex-1 py-3 rounded-xl text-xs tracking-widest uppercase font-bold hover:opacity-90 active:scale-95 transition-all">Accept</button>
            </div>
          </div>
        ) : (
          <div style={{ background: t.surface, border: `1px solid ${t.border}` }} className="flex-1 flex items-center justify-center rounded-2xl">
            <p style={{ color: t.muted }} className="text-xs">Select an order</p>
          </div>
        )}

        {/* Customer info */}
        {selectedOrder && (
          <div className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col gap-4">
            <div style={{ background: t.surface, border: `1px solid ${t.border}` }} className="rounded-2xl p-4 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}` }} className="w-9 h-9 rounded-full flex items-center justify-center text-sm">👤</div>
                <div>
                  <p style={{ color: t.text }} className="text-xs font-bold">{selectedOrder.customer}</p>
                  <p style={{ color: t.subtle }} className="text-xs">{selectedOrder.phone}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  {["📋","💬"].map(ic => (
                    <button key={ic} style={{ background: t.surface2, border: `1px solid ${t.border2}` }} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs hover:opacity-70 transition-opacity">{ic}</button>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${t.border}` }} className="pt-3 space-y-1">
                <p style={{ color: t.accent }} className="text-xs font-bold tracking-widest uppercase mb-2">Receiver's Info</p>
                {[["Name",selectedOrder.receiver.name],["Contact",selectedOrder.receiver.phone],["Address",selectedOrder.receiver.address]].map(([k,v]) => (
                  <p key={k} style={{ color: t.subtle }} className="text-xs leading-relaxed"><span style={{ color: t.text }}>{k}: </span>{v}</p>
                ))}
              </div>
            </div>
            <div style={{ background: t.surface, border: `1px solid ${t.border}` }} className="flex-1 rounded-2xl overflow-hidden relative min-h-[180px]">
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.surface2}, ${t.bg})` }} />
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
                {[0,40,80,120,160,200].map(y=><line key={y} x1="0" y1={y} x2="300" y2={y} stroke={t.accent} strokeWidth="0.5"/>)}
                {[0,50,100,150,200,250,300].map(x=><line key={x} x1={x} y1="0" x2={x} y2="200" stroke={t.accent} strokeWidth="0.5"/>)}
                <path d="M0,80 Q75,60 150,90 T300,70" stroke={t.accent} strokeWidth="2" fill="none" opacity="0.6"/>
                <circle cx="150" cy="90" r="8" fill={t.accent} opacity="0.9"/>
                <circle cx="150" cy="90" r="3" fill={t.bg}/>
                <circle cx="150" cy="90" r="14" fill="none" stroke={t.accent} strokeWidth="1" opacity="0.4"/>
              </svg>
              <div className="absolute bottom-3 left-3 right-3">
                <div style={{ background: `${t.bg}cc`, border: `1px solid ${t.border}` }} className="rounded-xl px-3 py-2 backdrop-blur-sm">
                  <p style={{ color: t.subtle }} className="text-xs">📍 Delivery Location</p>
                  <p style={{ color: t.text }} className="text-xs mt-0.5 truncate">{selectedOrder.receiver.address.split(",")[0]}</p>
                </div>
              </div>
            </div>
            <div style={{ background: t.surface, border: `1px solid ${t.border}` }} className="rounded-2xl p-4 flex-shrink-0">
              <p style={{ color: t.accent }} className="text-xs font-bold tracking-widest uppercase mb-2">Notes</p>
              <p style={{ color: t.subtle }} className="text-xs italic">{selectedOrder.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ t }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod]       = useState("Today");

  return (
    <div className="p-5 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-3xl md:text-4xl font-black">Home</h1>
        <button style={{ background: t.accent, color: "#0f0e0c" }}
          className="text-xs font-bold px-4 py-2.5 rounded-xl tracking-widest uppercase hover:opacity-90 active:scale-95 transition-all">
          View Z-Report 📋
        </button>
      </div>

      <div style={{ borderBottom: `1px solid ${t.border}` }} className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          {["overview","sales"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ color: activeTab===tab ? t.accent : t.subtle, borderBottomColor: activeTab===tab ? t.accent : "transparent" }}
              className="pb-3 text-xs tracking-widest uppercase border-b-2 transition-colors">{tab}</button>
          ))}
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)}
          style={{ background: t.surface2, border: `1px solid ${t.border2}`, color: t.text, fontFamily: "'DM Mono', monospace" }}
          className="text-xs rounded-xl px-3 py-2 outline-none mb-2 cursor-pointer">
          {["Today","Yesterday","This Week","This Month"].map(p => (
            <option key={p} value={p} style={{ background: t.surface2 }}>{p}</option>
          ))}
        </select>
      </div>

      <p style={{ color: t.text }} className="text-xs tracking-widest uppercase mb-4">Sales Analytics</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {STAT_CARDS.map((card, i) => (
          <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}` }} className="rounded-2xl p-5 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ background: t.bg, border: `1px solid ${t.border2}` }} className="w-10 h-10 rounded-full flex items-center justify-center text-lg">{card.icon}</div>
              <p style={{ color: t.subtle }} className="text-xs tracking-wider leading-tight">{card.label}</p>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-3xl font-black mb-2">{card.value}</p>
            <p style={{ color: card.green ? "#4ade80" : t.muted }} className="text-xs tracking-wider">{card.green && "↗ "}{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BOTTOM_CARDS.map((card, i) => (
          <div key={i} style={{ background: t.surface2, border: `1px solid ${t.border}` }} className="rounded-2xl p-5 min-h-[140px] flex flex-col justify-between transition-all duration-200">
            <p style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-base font-bold">{card.label}</p>
            <p style={{ color: t.muted }} className="text-xs tracking-wider mt-4">No data yet</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ onLogout }) {
  const [activeNav,   setActiveNav]   = useState("home");
  const [delivery,    setDelivery]    = useState(true);
  const [pickup,      setPickup]      = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode,    setDarkMode]    = useState(true);

  const t = darkMode ? DARK : LIGHT;

  const newCount      = SAMPLE_ORDERS.filter(o => o.status === "new").length;
  const acceptedCount = SAMPLE_ORDERS.filter(o => o.status === "accepted").length;

  const renderPage = () => {
    switch (activeNav) {
      case "home":   return <HomePage t={t} />;
      case "orders": return <OrdersPage t={t} />;
      case "menu":   return <MenuPage t={t} />;
      default:
        return (
          <div className="p-8 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p style={{ fontFamily: "'Playfair Display', serif", color: t.text }} className="text-2xl font-black mb-2">
                {NAV_ITEMS.find(n => n.id === activeNav)?.label}
              </p>
              <p style={{ color: t.muted }} className="text-xs tracking-wider">Coming soon</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: t.bg, fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
        * { transition: background-color 0.25s, border-color 0.2s, color 0.2s; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${t.scrollTrack}; }
        ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 3px; }
      `}</style>

      {/* NAVBAR */}
      <header style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button style={{ color: t.accent }} className="md:hidden text-xl" onClick={() => setSidebarOpen(s => !s)}>☰</button>
          <span style={{ fontFamily: "'Playfair Display', serif", color: t.accent }} className="text-2xl font-black tracking-tighter">tasty</span>
        </div>
        <div className="flex items-center gap-2 md:gap-2.5 flex-wrap justify-end">
          <div style={{ background: t.surface2, border: `1px solid ${t.border2}` }} className="flex items-center gap-2 rounded-xl px-3 py-1.5">
            <span style={{ color: t.text }} className="text-xs">New</span>
            <span style={{ background: t.accent, color: "#0f0e0c" }} className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{newCount}</span>
          </div>
          <div style={{ background: t.surface2, border: `1px solid ${t.border2}` }} className="flex items-center gap-2 rounded-xl px-3 py-1.5">
            <span style={{ color: t.text }} className="text-xs">Accepted</span>
            <span className="bg-[#1a3a1a] text-green-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-green-800">{acceptedCount}</span>
          </div>
          <div style={{ background: t.surface2, border: `1px solid ${t.border2}` }} className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5">
            <span style={{ color: t.text }} className="text-xs">Delivery</span>
            <Toggle value={delivery} onChange={setDelivery} t={t} />
          </div>
          <div style={{ background: t.surface2, border: `1px solid ${t.border2}` }} className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5">
            <span style={{ color: t.text }} className="text-xs">Pickup</span>
            <Toggle value={pickup} onChange={setPickup} t={t} />
          </div>
          <ThemeBtn dark={darkMode} onToggle={() => setDarkMode(d => !d)} t={t} />
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* SIDEBAR */}
        <aside style={{ background: t.surface, borderRight: `1px solid ${t.border}` }}
          className={`fixed md:static z-40 top-16 left-0 h-[calc(100vh-64px)] w-52 flex flex-col justify-between transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <nav className="flex flex-col gap-1 p-3 overflow-y-auto">
            {NAV_ITEMS.map(item => (
              <button key={item.id}
                onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
                style={{ background: activeNav===item.id ? t.accent : "transparent", color: activeNav===item.id ? "#0f0e0c" : t.subtle }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 w-full hover:opacity-90">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs tracking-wider flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span style={{ background: activeNav===item.id ? "#0f0e0c" : t.surface2, color: activeNav===item.id ? t.accent : t.text }}
                    className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ borderTop: `1px solid ${t.border}` }} className="p-4">
            <p style={{ color: t.subtle }} className="text-xs tracking-wider">Logged In</p>
            <p style={{ color: t.text }} className="text-xs mt-0.5">abc123</p>
            <button onClick={onLogout} style={{ color: t.muted }}
              className="mt-3 text-xs hover:opacity-70 transition-opacity tracking-wider">
              ← Sign out
            </button>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* MAIN */}
        <main style={{ background: t.bg }}
          className={`flex-1 overflow-y-auto ${["orders","menu"].includes(activeNav) ? "flex flex-col h-[calc(100vh-64px)]" : ""}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}