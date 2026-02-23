import React, { useState } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activePage, setActivePage] = useState("game");
  const [difficulty, setDifficulty] = useState("Easy");
  const [course, setCourse] = useState("Marketing");
  const [started, setStarted] = useState(false);
  const [year, setYear] = useState(1);
  const [budget, setBudget] = useState(100000);
  const [ad, setAd] = useState(0);
  const [digital, setDigital] = useState(0);
  const [influencer, setInfluencer] = useState(0);
  const [price, setPrice] = useState("Medium");
  const [audience, setAudience] = useState("Millennials");
  const [results, setResults] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const t = {
    bg: darkMode ? "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)" : "linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 100%)",
    sidebar: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    sidebarBorder: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    text: darkMode ? "white" : "#1a1a2e",
    textMuted: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
    card: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
    cardBorder: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    input: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    inputBorder: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)",
    select: darkMode ? "#1a1a2e" : "#ffffff",
    dropdown: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
  };

  const S = {
    root: { minHeight: "100vh", background: t.bg, fontFamily: "'Segoe UI', sans-serif", color: t.text, display: "flex", transition: "all 0.3s" },
    sidebar: { width: "240px", minHeight: "100vh", background: t.sidebar, borderRight: `1px solid ${t.sidebarBorder}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 },
    logo: { padding: "28px 24px 20px", borderBottom: `1px solid ${t.sidebarBorder}` },
    logoText: { fontSize: "22px", fontWeight: "800", background: "linear-gradient(90deg, #f7c948, #ff6b6b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    logoSub: { fontSize: "11px", color: t.textMuted, marginTop: "2px", letterSpacing: "1px", textTransform: "uppercase" },
    navSection: { padding: "16px 12px", flex: 1, overflowY: "auto" },
    navLabel: { fontSize: "10px", color: t.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px", marginTop: "12px" },
    navBtn: (active) => ({ width: "100%", padding: "10px 14px", background: active ? "linear-gradient(90deg, rgba(247,201,72,0.15), rgba(255,107,107,0.1))" : "transparent", border: active ? "1px solid rgba(247,201,72,0.3)" : "1px solid transparent", borderRadius: "10px", color: active ? "#f7c948" : t.textMuted, textAlign: "left", cursor: "pointer", fontSize: "13px", fontWeight: active ? "600" : "400", marginBottom: "4px", display: "flex", alignItems: "center", gap: "10px" }),
    courseTag: (color, active) => ({ padding: "6px 14px", borderRadius: "20px", border: `1px solid ${color}44`, background: active ? `${color}22` : "transparent", color: color, fontSize: "12px", fontWeight: "600", cursor: "pointer", marginBottom: "6px", width: "100%", textAlign: "left" }),
    signout: { padding: "16px 24px", borderTop: `1px solid ${t.sidebarBorder}` },
    signoutBtn: { width: "100%", padding: "10px", background: "rgba(255,75,75,0.1)", border: "1px solid rgba(255,75,75,0.2)", borderRadius: "8px", color: "#ff4b4b", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    main: { marginLeft: "240px", flex: 1, padding: "30px", minHeight: "100vh" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    topBarTitle: { fontSize: "24px", fontWeight: "700", color: t.text },
    topBarRight: { display: "flex", gap: "10px", alignItems: "center" },
    dropdown: { padding: "10px 14px", background: t.dropdown, border: `1px solid ${t.inputBorder}`, borderRadius: "10px", color: t.text, fontSize: "13px", cursor: "pointer", outline: "none", fontWeight: "500" },
    darkBtn: { padding: "10px 14px", background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", border: `1px solid ${t.inputBorder}`, borderRadius: "10px", fontSize: "16px", cursor: "pointer", color: t.text },
    card: { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: "16px", padding: "24px", marginBottom: "20px" },
    scenarioCard: { background: darkMode ? "linear-gradient(135deg, rgba(247,201,72,0.08), rgba(255,107,107,0.05))" : "linear-gradient(135deg, rgba(247,201,72,0.2), rgba(255,107,107,0.1))", border: "1px solid rgba(247,201,72,0.2)", borderRadius: "16px", padding: "24px", marginBottom: "20px" },
    input: { width: "100%", padding: "12px", background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: "8px", color: t.text, fontSize: "15px", outline: "none", boxSizing: "border-box" },
    select: { width: "100%", padding: "10px", background: t.select, border: `1px solid ${t.inputBorder}`, borderRadius: "8px", color: t.text, fontSize: "14px", outline: "none", cursor: "pointer", boxSizing: "border-box" },
    nextBtn: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #f7c948, #ff9f43)", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", color: "#000", cursor: "pointer" },
    startBtn: { padding: "14px 36px", background: "linear-gradient(135deg, #f7c948, #ff6b6b)", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "800", color: "#000", cursor: "pointer" },
    inputCard: { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: "12px", padding: "16px" },
    inputLabel: { fontSize: "12px", color: t.textMuted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
    resultRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: "10px", marginBottom: "8px", border: `1px solid ${t.cardBorder}` },
    tag: (color) => ({ padding: "4px 12px", borderRadius: "20px", background: `${color}22`, color: color, fontSize: "12px", fontWeight: "700" }),
    statBox: { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: "14px", padding: "20px", textAlign: "center" },
    statNum: { fontSize: "28px", fontWeight: "800", margin: "8px 0 4px" },
    statLabel: { fontSize: "12px", color: t.textMuted },
    yearDot: (active, done) => ({ flex: 1, height: "6px", borderRadius: "3px", background: done ? "#f7c948" : active ? "linear-gradient(90deg, #f7c948, #ff6b6b)" : darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }),
    budgetDisplay: { background: darkMode ? "linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,200,100,0.05))" : "linear-gradient(135deg, rgba(0,200,100,0.2), rgba(0,255,136,0.1))", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    spentBar: (pct) => ({ height: "8px", borderRadius: "4px", background: pct > 90 ? "#ff4b4b" : pct > 70 ? "#f7c948" : "#00ff88", width: `${Math.min(pct, 100)}%`, transition: "width 0.4s ease" }),
  };

  const NAV_ITEMS = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "game", icon: "🎮", label: "Play Game" },
    { id: "problem", icon: "📋", label: "Problem Statement" },
    { id: "leaderboard", icon: "🏆", label: "Leaderboard" },
    { id: "tournament", icon: "⚔️", label: "Tournament" },
    { id: "computer", icon: "🤖", label: "Play with Computer" },
    { id: "others", icon: "👥", label: "Play with Others" },
    { id: "tutorial", icon: "🎓", label: "Tutorial" },
  ];

  const COURSES = [
    { name: "Marketing", color: "#f7c948", active: true },
    { name: "Human Resource", color: "#ff6b6b", active: false },
    { name: "Finance", color: "#00ff88", active: false },
    { name: "Product Mgmt", color: "#a29bfe", active: false },
    { name: "Operations", color: "#74b9ff", active: false },
  ];

  const scenarios = {
    Easy: [
      { title: "🌱 Local Launch", desc: "Launch GreenBrew organic tea in Mumbai. Health-conscious millennials are your target. Market growing 15% annually." },
      { title: "🥊 Fight the Competitor", desc: "TataGreens entered your market. Sales dipped 20%. Time to retain loyal customers and hit back smart." },
      { title: "📱 Go Digital", desc: "Smartphone users doubled. Your traditional ads are losing impact. Shift to digital-first strategy." },
      { title: "🎉 Festive Season", desc: "Diwali season ahead! Massive spending spike. Capture the festive wave with targeted campaigns." },
      { title: "🌍 Expand to Tier 2", desc: "Mumbai saturated. Pune, Nagpur, Surat are wide open. Expand with localized messaging." },
    ],
    Difficult: [
      { title: "💥 Price War", desc: "Competitor slashed prices 30%. Raw material costs up 25%. Margins squeezed. Smart allocation is key." },
      { title: "📉 Brand Crisis", desc: "Negative press hit your brand. Trust is down 40%. Recovery requires bold, authentic communication." },
      { title: "🌐 Market Disruption", desc: "D2C brands eating your market share. Retail channels declining. Pivot your distribution strategy." },
      { title: "🔄 Product Recall", desc: "Quality issue forced partial recall. Customer confidence shaken. Rebuild trust and loyalty fast." },
      { title: "🏦 Funding Crunch", desc: "Investors cut budget by 35%. Do more with less. Every rupee must work 3x harder." },
    ],
    "Very Hard": [
      { title: "🦠 Pandemic Impact", desc: "Physical retail down 80%. Complete pivot to digital required. Traditional marketing is useless." },
      { title: "📊 Economic Slowdown", desc: "Consumer spending dropped 45%. Premium products unsellable. Rethink your entire value proposition." },
      { title: "🌊 Market Collapse", desc: "Entire category shrinking. Competitors shutting down. Fight for survival with razor-thin budgets." },
      { title: "🔥 Regulatory Crackdown", desc: "New ad regulations block 3 of your 5 channels. Innovate or die. Only creative strategies survive." },
      { title: "⚡ Tech Disruption", desc: "AI-powered competitors targeting your customers with hyper-personalized ads. Outthink or lose everything." },
    ],
  };

  const diffSettings = {
    Easy: { multiplier: 1.2, risk: 0.1, budget: 100000 },
    Difficult: { multiplier: 1.0, risk: 0.2, budget: 80000 },
    "Very Hard": { multiplier: 0.8, risk: 0.35, budget: 60000 },
  };

  const startGame = () => {
    setBudget(diffSettings[difficulty].budget);
    setYear(1); setResults([]); setGameOver(false);
    setAd(0); setDigital(0); setInfluencer(0);
    setStarted(true); setActivePage("game");
  };

  const nextYear = () => {
    const totalSpent = ad + digital + influencer;
    if (totalSpent > budget) { alert("⚠️ Budget exceeded!"); return; }
    const { multiplier, risk } = diffSettings[difficulty];
    const rf = 1 - Math.random() * risk;
    const audienceBonus = audience === "Millennials" && digital > ad ? 1.2 : 1;
    const revenue = (ad * 0.3 + digital * 0.5 + influencer * 0.4) * multiplier * rf * audienceBonus;
    const profit = revenue - totalSpent;
    const score = profit > 0 ? Math.round(profit / 1000) : 0;
    const rec = profit < 0
      ? "💡 Tip: Allocate more to Digital for better ROI. Match channels to your audience."
      : profit < 5000
      ? "✅ Decent! Try increasing influencer budget for bigger reach next year."
      : "🌟 Excellent strategy! Keep this channel mix going!";
    const result = { year, revenue: Math.round(revenue), profit: Math.round(profit), score, rec };
    setResults(prev => [...prev, result]);
    setLastResult(result);
    setShowResult(true);
    if (year < 5) { setYear(y => y + 1); setAd(0); setDigital(0); setInfluencer(0); }
    else setGameOver(true);
  };

  const totalProfit = results.reduce((s, r) => s + r.profit, 0);
  const totalScore = results.reduce((s, r) => s + r.score, 0);
  const spent = ad + digital + influencer;
  const spentPct = Math.round((spent / budget) * 100);
  const scenario = scenarios[difficulty]?.[year - 1];

  // ---- PROFILE PAGE (shown first) ----
  if (!profileSaved) return (
    <div style={{ ...S.root, justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...S.scenarioCard, maxWidth: "480px", width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: "60px", marginBottom: "12px" }}>⚡</div>
        <h1 style={{ fontSize: "26px", fontWeight: "800", color: t.text, margin: "0 0 4px" }}>Welcome to BizQuest!</h1>
        <p style={{ color: t.textMuted, marginBottom: "28px", fontSize: "14px" }}>Enter your details to start playing</p>

        <div style={{ textAlign: "left", marginBottom: "16px" }}>
          <div style={S.inputLabel}>👤 Your Name</div>
          <input placeholder="e.g. Priya Sharma" value={playerName}
            onChange={e => setPlayerName(e.target.value)} style={S.input} />
        </div>

        <div style={{ textAlign: "left", marginBottom: "24px" }}>
          <div style={S.inputLabel}>🏢 Organization / College Name</div>
          <input placeholder="e.g. IIM Lucknow" value={orgName}
            onChange={e => setOrgName(e.target.value)} style={S.input} />
        </div>

        <button style={{ ...S.startBtn, width: "100%", opacity: playerName && orgName ? 1 : 0.5 }}
          onClick={() => { if (playerName && orgName) setProfileSaved(true); else alert("Please fill both fields!"); }}>
          🚀 Enter BizQuest
        </button>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
          <span style={{ color: t.textMuted, fontSize: "13px" }}>Theme:</span>
          <button onClick={() => setDarkMode(!darkMode)} style={S.darkBtn}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoText}>⚡ BizQuest</div>
        <div style={S.logoSub}>Simulation Game</div>
      </div>
      <div style={S.navSection}>
        <div style={S.navLabel}>Navigation</div>
        {NAV_ITEMS.map(n => (
          <button key={n.id} style={S.navBtn(activePage === n.id)} onClick={() => setActivePage(n.id)}>
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
        <div style={S.navLabel}>Courses</div>
        {COURSES.map(c => (
          <button key={c.name} style={S.courseTag(c.color, c.active)}
            onClick={() => { setCourse(c.name); if (c.active) setActivePage("game"); }}>
            {c.active ? "🎯 " : "🔒 "}{c.name}
          </button>
        ))}
      </div>
      <div style={S.signout}>
        <button style={S.signoutBtn}
          onClick={() => { setProfileSaved(false); setStarted(false); setResults([]); setPlayerName(""); setOrgName(""); }}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );

  const TopBar = ({ title }) => (
    <div style={S.topBar}>
      <div style={S.topBarTitle}>{title}</div>
      <div style={S.topBarRight}>
        <select style={S.dropdown} value={course} onChange={e => setCourse(e.target.value)}>
          {COURSES.map(c => <option key={c.name}>{c.name}</option>)}
        </select>
        <select style={S.dropdown} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option>Easy</option><option>Difficult</option><option>Very Hard</option>
        </select>
        <div style={{ padding: "10px 14px", background: "rgba(247,201,72,0.1)", border: "1px solid rgba(247,201,72,0.2)", borderRadius: "10px", fontSize: "13px", color: "#f7c948", fontWeight: "600" }}>
          👤 {playerName}
        </div>
        <button onClick={() => setDarkMode(!darkMode)} style={S.darkBtn} title="Toggle Theme">
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );

  const renderPage = () => {
    if (activePage === "dashboard") return (
      <div>
        <TopBar title="📊 Dashboard" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Player", value: playerName, color: "#f7c948" },
            { label: "Organization", value: orgName, color: "#00ff88" },
            { label: "Course", value: course, color: "#a29bfe" },
            { label: "Difficulty", value: difficulty, color: "#ff6b6b" },
          ].map(s => (
            <div key={s.label} style={S.statBox}>
              <div style={S.statLabel}>{s.label}</div>
              <div style={{ ...S.statNum, color: s.color, fontSize: "15px" }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Years Played", value: results.length, color: "#74b9ff" },
            { label: "Total Score", value: totalScore, color: "#f7c948" },
            { label: "Total Profit", value: `₹${totalProfit.toLocaleString()}`, color: totalProfit >= 0 ? "#00ff88" : "#ff4b4b" },
          ].map(s => (
            <div key={s.label} style={S.statBox}>
              <div style={S.statLabel}>{s.label}</div>
              <div style={{ ...S.statNum, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>📈 Year-wise Performance</h3>
          {results.length === 0 ? <p style={{ color: t.textMuted }}>No results yet. Start playing!</p> :
            results.map(r => (
              <div key={r.year} style={S.resultRow}>
                <span style={{ color: "#f7c948", fontWeight: "700" }}>Year {r.year}</span>
                <span style={{ color: t.textMuted }}>₹{r.revenue.toLocaleString()}</span>
                <span style={{ color: r.profit >= 0 ? "#00ff88" : "#ff4b4b", fontWeight: "700" }}>{r.profit >= 0 ? "+" : ""}₹{r.profit.toLocaleString()}</span>
                <span style={S.tag("#a29bfe")}>Score: {r.score}</span>
              </div>
            ))}
        </div>
      </div>
    );

    if (activePage === "problem") return (
      <div>
        <TopBar title="📋 Problem Statement" />
        <div style={S.scenarioCard}>
          <h2 style={{ color: "#f7c948", marginBottom: "8px" }}>🎯 Marketing Simulation — {difficulty}</h2>
          <p style={{ color: t.textMuted, lineHeight: "1.7" }}>You are the Marketing Head of a growing startup. Over 5 years, make strategic decisions on budget allocation, channel selection, pricing, and target audience to maximize profit.</p>
        </div>
        {scenarios[difficulty].map((s, i) => (
          <div key={i} style={S.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={S.tag("#f7c948")}>Year {i + 1}</span>
              <strong style={{ color: t.text }}>{s.title}</strong>
            </div>
            <p style={{ color: t.textMuted, marginTop: "8px", fontSize: "14px" }}>{s.desc}</p>
          </div>
        ))}
      </div>
    );

    if (activePage === "leaderboard") return (
      <div>
        <TopBar title="🏆 Leaderboard" />
        <div style={S.card}>
          <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>Top Players — {course} ({difficulty})</h3>
          {[
            { name: "Priya S.", org: "IIM Lucknow", score: 450, profit: 320000 },
            { name: playerName, org: orgName, score: totalScore, profit: totalProfit },
            { name: "Rahul M.", org: "ISB Hyderabad", score: 310, profit: 210000 },
            { name: "Sneha K.", org: "XLRI", score: 280, profit: 180000 },
          ].sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={i} style={{ ...S.resultRow, background: p.name === playerName ? "rgba(247,201,72,0.08)" : S.resultRow.background, border: p.name === playerName ? "1px solid rgba(247,201,72,0.3)" : `1px solid ${t.cardBorder}` }}>
              <span style={{ fontSize: "20px" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}</span>
              <span style={{ fontWeight: "700", color: p.name === playerName ? "#f7c948" : t.text }}>{p.name}</span>
              <span style={{ color: t.textMuted, fontSize: "13px" }}>{p.org}</span>
              <span style={S.tag("#a29bfe")}>Score: {p.score}</span>
              <span style={{ color: p.profit >= 0 ? "#00ff88" : "#ff4b4b", fontWeight: "700" }}>₹{p.profit.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );

    if (activePage === "tutorial") return (
      <div>
        <TopBar title="🎓 Tutorial" />
        <div style={S.scenarioCard}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ fontSize: "64px" }}>👨‍🏫</div>
            <div>
              <h2 style={{ color: "#f7c948", margin: 0 }}>Meet Prof. Arjun — Your AI Tutor</h2>
              <p style={{ color: t.textMuted, marginTop: "8px" }}>"Welcome {playerName}! I'll guide you through every concept with real-world examples!"</p>
            </div>
          </div>
        </div>
        {[
          { icon: "💰", title: "Budget Allocation", desc: "Digital marketing gives highest ROI (50% multiplier). Advertising is reliable (30%). Influencers are high-risk, high-reward (40%)." },
          { icon: "🎯", title: "Target Audience", desc: "Millennials respond best to Digital & Influencer. Working professionals prefer LinkedIn. Students love Social Media." },
          { icon: "💲", title: "Pricing Strategy", desc: "Low pricing captures volume but signals low quality. Medium balances reach & margin. High builds premium brand perception." },
          { icon: "📊", title: "Reading Results", desc: "Revenue = what you earned. Profit = Revenue - Spending. Score = Profit ÷ 1000. Aim for 200+ total score!" },
        ].map(tt => (
          <div key={tt.title} style={S.card}>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontSize: "32px" }}>{tt.icon}</span>
              <div>
                <h3 style={{ color: "#f7c948", margin: "0 0 8px" }}>{tt.title}</h3>
                <p style={{ color: t.textMuted, fontSize: "14px", lineHeight: "1.6" }}>{tt.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    if (activePage === "computer") return (
      <div>
        <TopBar title="🤖 Play with Computer" />
        <div style={S.scenarioCard}>
          <h2 style={{ color: "#f7c948" }}>🤖 vs 👤 Challenge Mode</h2>
          <p style={{ color: t.textMuted, marginTop: "8px" }}>Compete against our AI opponent. Best strategist wins!</p>
          <button style={{ ...S.startBtn, marginTop: "16px" }} onClick={startGame}>⚔️ Start Battle</button>
        </div>
      </div>
    );

    if (activePage === "others") return (
      <div>
        <TopBar title="👥 Play with Others" />
        <div style={S.scenarioCard}>
          <h2 style={{ color: "#f7c948" }}>👥 Multiplayer Mode</h2>
          <p style={{ color: t.textMuted, marginTop: "8px" }}>Challenge classmates! Firebase multiplayer coming soon!</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={S.card}>
            <h3 style={{ color: "#00ff88" }}>🏠 Create Room</h3>
            <button style={{ ...S.nextBtn, marginTop: "12px" }}>Create Room</button>
          </div>
          <div style={S.card}>
            <h3 style={{ color: "#74b9ff" }}>🚪 Join Room</h3>
            <input placeholder="Enter room code..." style={{ ...S.input, marginTop: "12px" }} />
            <button style={{ ...S.nextBtn, marginTop: "8px", background: "linear-gradient(135deg, #74b9ff, #a29bfe)" }}>Join Room</button>
          </div>
        </div>
      </div>
    );

    if (activePage === "tournament") return (
      <div>
        <TopBar title="⚔️ Tournament" />
        <div style={S.scenarioCard}>
          <h2 style={{ color: "#f7c948" }}>⚔️ BizQuest Tournament</h2>
          <p style={{ color: t.textMuted, marginTop: "8px" }}>Compete in organized tournaments against students from other colleges!</p>
        </div>
        <div style={S.card}>
          <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>🏆 Upcoming Tournaments</h3>
          {[
            { name: "IIM Marketing Cup", date: "March 15, 2026", players: "48/64", status: "Open" },
            { name: "National BizQuest Finals", date: "April 1, 2026", players: "12/32", status: "Open" },
            { name: "Spring Challenge", date: "March 28, 2026", players: "64/64", status: "Full" },
          ].map(tt => (
            <div key={tt.name} style={S.resultRow}>
              <span style={{ fontWeight: "700", color: t.text }}>{tt.name}</span>
              <span style={{ color: t.textMuted, fontSize: "13px" }}>{tt.date}</span>
              <span style={{ color: t.textMuted, fontSize: "13px" }}>👥 {tt.players}</span>
              <span style={S.tag(tt.status === "Open" ? "#00ff88" : "#ff4b4b")}>{tt.status}</span>
            </div>
          ))}
        </div>
      </div>
    );

    if (!started) return (
      <div>
        <TopBar title="🎮 Marketing Game" />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ ...S.scenarioCard, maxWidth: "520px", textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎯</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: t.text, margin: "0 0 8px" }}>Marketing Simulation</h1>
            <p style={{ color: "#f7c948", fontWeight: "600", marginBottom: "4px" }}>Welcome, {playerName}! 👋</p>
            <p style={{ color: t.textMuted, marginBottom: "24px", fontSize: "13px" }}>{orgName}</p>
            <div style={{ textAlign: "left", marginBottom: "16px" }}>
              <div style={S.inputLabel}>Select Difficulty</div>
              <select style={S.select} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option>Easy</option><option>Difficult</option><option>Very Hard</option>
              </select>
            </div>
            <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", textAlign: "left" }}>
              <span style={{ color: t.textMuted, fontSize: "13px" }}>Starting Budget: </span>
              <span style={{ color: "#00ff88", fontWeight: "800", fontSize: "20px" }}>₹{diffSettings[difficulty].budget.toLocaleString()}</span>
            </div>
            <button style={{ ...S.startBtn, width: "100%" }} onClick={startGame}>🚀 Start Game</button>
          </div>
        </div>
      </div>
    );

    if (showResult && lastResult) return (
      <div>
        <TopBar title={`📊 Year ${lastResult.year} Results`} />
        <div style={{ ...S.scenarioCard, textAlign: "center" }}>
          <div style={{ fontSize: "48px" }}>{lastResult.profit >= 0 ? "🎉" : "😬"}</div>
          <h2 style={{ color: lastResult.profit >= 0 ? "#00ff88" : "#ff4b4b", margin: "12px 0" }}>
            {lastResult.profit >= 0 ? "Profit Made!" : "Loss Incurred!"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", margin: "20px 0" }}>
            {[
              { label: "Revenue", value: `₹${lastResult.revenue.toLocaleString()}`, color: "#74b9ff" },
              { label: "Profit/Loss", value: `${lastResult.profit >= 0 ? "+" : ""}₹${lastResult.profit.toLocaleString()}`, color: lastResult.profit >= 0 ? "#00ff88" : "#ff4b4b" },
              { label: "Score", value: lastResult.score, color: "#f7c948" },
            ].map(s => (
              <div key={s.label} style={S.statBox}>
                <div style={S.statLabel}>{s.label}</div>
                <div style={{ ...S.statNum, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ color: t.text, margin: 0 }}>{lastResult.rec}</p>
          </div>
          <button style={S.startBtn} onClick={() => { setShowResult(false); if (gameOver) setActivePage("dashboard"); }}>
            {gameOver ? "📊 See Final Results" : `➡️ Go to Year ${year}`}
          </button>
        </div>
      </div>
    );

    if (gameOver && !showResult) return (
      <div>
        <TopBar title="🏁 Game Complete!" />
        <div style={{ ...S.scenarioCard, textAlign: "center" }}>
          <div style={{ fontSize: "64px" }}>🏁</div>
          <h1 style={{ color: "#f7c948", margin: "16px 0 4px" }}>5 Years Complete!</h1>
          <p style={{ color: t.textMuted }}>{playerName} | {orgName}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "20px 0" }}>
            <div style={S.statBox}>
              <div style={S.statLabel}>Total Profit</div>
              <div style={{ ...S.statNum, color: totalProfit >= 0 ? "#00ff88" : "#ff4b4b" }}>₹{totalProfit.toLocaleString()}</div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>Final Score</div>
              <div style={{ ...S.statNum, color: "#f7c948" }}>{totalScore}</div>
            </div>
          </div>
          <div style={{ ...S.tag(totalScore > 200 ? "#00ff88" : totalScore > 100 ? "#f7c948" : "#ff4b4b"), display: "inline-block", fontSize: "16px", padding: "10px 24px", marginBottom: "20px" }}>
            {totalScore > 200 ? "🌟 Excellent Strategist!" : totalScore > 100 ? "👍 Good Manager" : "📚 Needs Improvement"}
          </div>
          <br />
          <button style={S.startBtn} onClick={() => { setStarted(false); setGameOver(false); setResults([]); setYear(1); }}>
            🔄 Play Again
          </button>
        </div>
      </div>
    );

    return (
      <div>
        <TopBar title={`🎮 Marketing — Year ${year} of 5`} />
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[1,2,3,4,5].map(y => <div key={y} style={S.yearDot(y === year, y < year)} />)}
        </div>
        <div style={S.scenarioCard}>
          <span style={S.tag("#f7c948")}>Year {year} Scenario</span>
          <h2 style={{ color: t.text, margin: "10px 0 6px" }}>{scenario?.title}</h2>
          <p style={{ color: t.textMuted, lineHeight: "1.7", margin: 0 }}>{scenario?.desc}</p>
        </div>
        <div style={S.budgetDisplay}>
          <div>
            <div style={{ color: t.textMuted, fontSize: "13px" }}>Available Budget</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#00ff88" }}>₹{budget.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: t.textMuted, fontSize: "13px" }}>Spent: ₹{spent.toLocaleString()} ({spentPct}%)</div>
            <div style={{ width: "200px", height: "8px", background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderRadius: "4px", marginTop: "8px" }}>
              <div style={S.spentBar(spentPct)} />
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          {[
            { label: "📺 Advertising Budget (₹)", val: ad, setter: setAd },
            { label: "📱 Digital Marketing (₹)", val: digital, setter: setDigital },
            { label: "🌟 Influencer Budget (₹)", val: influencer, setter: setInfluencer },
          ].map(f => (
            <div key={f.label} style={S.inputCard}>
              <div style={S.inputLabel}>{f.label}</div>
              <input type="number" value={f.val} min={0} max={budget}
                onChange={e => f.setter(Number(e.target.value))} style={S.input} />
            </div>
          ))}
          <div style={S.inputCard}>
            <div style={S.inputLabel}>🎯 Target Audience</div>
            <select value={audience} onChange={e => setAudience(e.target.value)} style={S.select}>
              <option>Millennials</option>
              <option>Working Professionals</option>
              <option>College Students</option>
              <option>Tier 2 Cities</option>
            </select>
          </div>
          <div style={S.inputCard}>
            <div style={S.inputLabel}>💲 Pricing Strategy</div>
            <select value={price} onChange={e => setPrice(e.target.value)} style={S.select}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
        </div>
        {results.length > 0 && (
          <div style={{ ...S.card, marginBottom: "20px" }}>
            <h3 style={{ color: "#f7c948", marginBottom: "12px" }}>📊 Previous Results</h3>
            {results.map(r => (
              <div key={r.year} style={S.resultRow}>
                <span style={{ color: "#f7c948", fontWeight: "700" }}>Year {r.year}</span>
                <span style={{ color: t.textMuted }}>₹{r.revenue.toLocaleString()}</span>
                <span style={{ color: r.profit >= 0 ? "#00ff88" : "#ff4b4b", fontWeight: "700" }}>{r.profit >= 0 ? "+" : ""}₹{r.profit.toLocaleString()}</span>
                <span style={S.tag("#a29bfe")}>+{r.score}pts</span>
              </div>
            ))}
          </div>
        )}
        <button style={S.nextBtn} onClick={nextYear}>Submit Year {year} Decisions →</button>
      </div>
    );
  };

  return (
    <div style={S.root}>
      <Sidebar />
      <div style={S.main}>{renderPage()}</div>
    </div>
  );
}

