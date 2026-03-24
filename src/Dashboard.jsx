import { useState } from "react";

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
  { icon: "🛒", label: "Total Accepted Orders", value: "0", sub: "0% change from yesterday" },
  { icon: "💰", label: "Total Revenue", value: "AED 0", sub: "0% change from yesterday" },
  { icon: "💎", label: "Revenue saved by tasty", value: "AED 0.00", sub: "0% change from yesterday" },
  { icon: "👥", label: "Customers", value: "0", sub: "0% change from yesterday" },
  { icon: "⏱️", label: "Total Delayed Orders", value: "0", sub: "0 order(s) less from yesterday", green: true },
];

const BOTTOM_CARDS = [
  { label: "Top Selling Items" },
  { label: "Top Locations" },
  { label: "Top Customers" },
];

export default function Dashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState("home");
  const [activeTab, setActiveTab] = useState("overview");
  const [delivery, setDelivery] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("Today");

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
        value ? "bg-[#f4a127]" : "bg-[#2e2b24]"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f0e0c] flex flex-col" style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #161512; }
        ::-webkit-scrollbar-thumb { background: #2e2b24; border-radius: 3px; }
      `}</style>

      {/* TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#161512] border-b border-[#2a2620] h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-[#f4a127] text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <span
            className="text-2xl font-black text-[#f4a127] tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            tasty
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
          <div className="flex items-center gap-2 border border-[#2e2b24] rounded-xl px-3 py-1.5 bg-[#1e1c18]">
            <span className="text-[#f0ead8] text-xs tracking-wider">New</span>
            <span className="bg-[#f4a127] text-[#0f0e0c] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </div>
          <div className="flex items-center gap-2 border border-[#2e2b24] rounded-xl px-3 py-1.5 bg-[#1e1c18]">
            <span className="text-[#f0ead8] text-xs tracking-wider">Accepted</span>
            <span className="bg-[#1a3a1a] text-green-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-green-800">0</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 border border-[#2e2b24] rounded-xl px-3 py-1.5 bg-[#1e1c18]">
            <span className="text-[#f0ead8] text-xs tracking-wider">Delivery</span>
            <Toggle value={delivery} onChange={setDelivery} />
          </div>
          <div className="hidden sm:flex items-center gap-2 border border-[#2e2b24] rounded-xl px-3 py-1.5 bg-[#1e1c18]">
            <span className="text-[#f0ead8] text-xs tracking-wider">Pickup</span>
            <Toggle value={pickup} onChange={setPickup} />
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* SIDEBAR */}
        <aside
          className={`fixed md:static z-40 top-16 left-0 h-[calc(100vh-64px)] w-52 bg-[#161512] border-r border-[#2a2620] flex flex-col justify-between transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="flex flex-col gap-1 p-3 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group w-full ${
                  activeNav === item.id
                    ? "bg-[#f4a127] text-[#0f0e0c]"
                    : "text-[#6b6457] hover:bg-[#1e1c18] hover:text-[#f0ead8]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs tracking-wider flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                      activeNav === item.id
                        ? "bg-[#0f0e0c] text-[#f4a127]"
                        : "bg-[#2e2b24] text-[#f0ead8]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[#2a2620]">
            <p className="text-[#6b6457] text-xs tracking-wider">Logged In</p>
            <p className="text-[#f0ead8] text-xs mt-0.5">abc123</p>
            <button
              onClick={onLogout}
              className="mt-3 text-xs text-[#3d3a32] hover:text-[#f4a127] transition-colors tracking-wider"
            >
              ← Sign out
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#0f0e0c] min-h-[calc(100vh-64px)]">
          <div className="p-5 md:p-8 max-w-6xl">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
              <h1
                className="text-3xl md:text-4xl font-black text-[#f0ead8]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Home
              </h1>
              <button className="flex items-center gap-2 bg-[#f4a127] hover:bg-[#e8911a] active:scale-95 text-[#0f0e0c] text-xs font-bold px-4 py-2.5 rounded-xl transition-all tracking-widest uppercase">
                View Z-Report 📋
              </button>
            </div>

            {/* Tabs + Period selector */}
            <div className="flex items-center justify-between mb-6 border-b border-[#2a2620]">
              <div className="flex gap-6">
                {["overview", "sales"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs tracking-widest uppercase transition-colors ${
                      activeTab === tab
                        ? "text-[#f4a127] border-b-2 border-[#f4a127]"
                        : "text-[#6b6457] hover:text-[#f0ead8]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-[#1e1c18] border border-[#2e2b24] text-[#f0ead8] text-xs rounded-xl px-3 py-2 outline-none focus:border-[#f4a127] mb-2 cursor-pointer"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {["Today", "Yesterday", "This Week", "This Month"].map((p) => (
                  <option key={p} value={p} style={{ background: "#1e1c18" }}>{p}</option>
                ))}
              </select>
            </div>

            {/* Section label */}
            <p className="text-[#f0ead8] text-xs tracking-widest uppercase mb-4">
              Sales Analytics
            </p>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {STAT_CARDS.map((card, i) => (
                <div
                  key={i}
                  className="bg-[#161512] border border-[#2a2620] rounded-2xl p-5 hover:border-[#f4a127]/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0f0e0c] rounded-full flex items-center justify-center text-lg border border-[#2e2b24] group-hover:border-[#f4a127]/40 transition-colors">
                      {card.icon}
                    </div>
                    <p className="text-[#6b6457] text-xs tracking-wider leading-tight">{card.label}</p>
                  </div>
                  <p
                    className="text-[#f0ead8] text-3xl font-black mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {card.value}
                  </p>
                  <p className={`text-xs tracking-wider ${card.green ? "text-green-500" : "text-[#3d3a32]"}`}>
                    {card.green && "↗ "}{card.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BOTTOM_CARDS.map((card, i) => (
                <div
                  key={i}
                  className="bg-[#1e1c18] border border-[#2a2620] rounded-2xl p-5 min-h-[140px] flex flex-col justify-between hover:border-[#f4a127]/30 transition-all duration-200"
                >
                  <p
                    className="text-[#f0ead8] text-base font-bold tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {card.label}
                  </p>
                  <p className="text-[#3d3a32] text-xs tracking-wider mt-4">No data yet</p>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}