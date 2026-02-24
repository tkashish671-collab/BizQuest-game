import React, { useState, useEffect, useRef, useCallback } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";

// ===================== DATA =====================
const MOCK_STUDENTS = [
  { id: 1, name: "Priya Sharma", email: "priya@student.com", org: "IIM Lucknow", score: 450, profit: 320000, results: [{ year: 1, profit: 80000, score: 80 }, { year: 2, profit: 60000, score: 60 }, { year: 3, profit: 90000, score: 90 }, { year: 4, profit: 50000, score: 50 }, { year: 5, profit: 40000, score: 40 }] },
  { id: 2, name: "Rahul Mehta", email: "rahul@student.com", org: "IIM Lucknow", score: 310, profit: 210000, results: [{ year: 1, profit: 50000, score: 50 }, { year: 2, profit: 40000, score: 40 }, { year: 3, profit: 60000, score: 60 }, { year: 4, profit: 30000, score: 30 }, { year: 5, profit: 30000, score: 30 }] },
  { id: 3, name: "Sneha Kapoor", email: "sneha@student.com", org: "ISB Hyderabad", score: 280, profit: 180000, results: [{ year: 1, profit: 40000, score: 40 }, { year: 2, profit: 30000, score: 30 }, { year: 3, profit: 50000, score: 50 }, { year: 4, profit: 40000, score: 40 }, { year: 5, profit: 20000, score: 20 }] },
  { id: 4, name: "Arjun Singh", email: "arjun@student.com", org: "XLRI Jamshedpur", score: 390, profit: 280000, results: [{ year: 1, profit: 70000, score: 70 }, { year: 2, profit: 50000, score: 50 }, { year: 3, profit: 80000, score: 80 }, { year: 4, profit: 40000, score: 40 }, { year: 5, profit: 40000, score: 40 }] },
];

const MOCK_TEACHER = { email: "teacher@university.edu", password: "teacher123" };

const NEWS_FEED = {
  Easy: [
    "📢 BREAKING: Health food trend surging 40%! Perfect time to launch organic products.",
    "📢 BREAKING: Social media influencers driving 3x more sales than traditional ads this quarter!",
    "📢 BREAKING: Digital ad costs dropped 20%! More bang for your buck this year.",
    "📢 BREAKING: Festive season spending up 35%! Consumers ready to splurge.",
    "📢 BREAKING: Tier-2 cities showing 50% growth in premium product adoption!",
  ],
  Difficult: [
    "📢 BREAKING: Inflation hits 8%! Consumer spending tightening across all segments.",
    "📢 BREAKING: Competitor launches aggressive ₹10Cr campaign. Battle stations ready!",
    "📢 BREAKING: Supply chain disruption hits FMCG sector. Costs rising 15%.",
    "📢 BREAKING: Regulatory changes restrict certain ad channels. Pivot fast!",
    "📢 BREAKING: Economic slowdown fears grip market. Consumer confidence at 5-year low.",
  ],
  "Very Hard": [
    "📢 BREAKING: Global recession fears. Markets in freefall. Survival mode activated.",
    "📢 BREAKING: 3 major competitors shut down. Market chaos — opportunity or threat?",
    "📢 BREAKING: Government imposes strict advertising caps. Most channels blocked.",
    "📢 BREAKING: Currency devaluation hits import costs by 30%. Margins collapsing.",
    "📢 BREAKING: Consumer boycott movement gaining momentum. Brand crisis imminent.",
  ],
};

const SURPRISE_EVENTS = [
  { text: "🌟 A celebrity just mentioned your brand on social media! Bonus: +20% revenue this year!", multiplier: 1.2 },
  { text: "⚡ Flash sale trend goes viral! Your campaign timing is perfect! Bonus: +15% revenue!", multiplier: 1.15 },
  { text: "🌧️ Monsoon disrupted your distribution network. Revenue hit by -10%.", multiplier: 0.9 },
  { text: "🔥 Competitor had a PR disaster! Customers switching to your brand! Bonus: +25%!", multiplier: 1.25 },
  { text: "📉 Stock market crash reduced consumer spending. Revenue down -15%.", multiplier: 0.85 },
  { text: "🎯 Your ad went viral on Instagram! Organic reach exploded! Bonus: +30%!", multiplier: 1.3 },
  { text: "🏭 Factory strike disrupted supply for 2 weeks. Revenue down -20%.", multiplier: 0.8 },
  { text: "💡 New market research reveals untapped segment! Bonus: +18% revenue!", multiplier: 1.18 },
];

const RIVAL_CEO = { name: "Rajiv Kapoor", company: "RivalCorp", avatar: "😈" };

const ACHIEVEMENTS = [
  { id: "first_profit", title: "💰 First Profit!", desc: "Made profit in Year 1!", condition: (results) => results.length >= 1 && results[0].profit > 0 },
  { id: "risk_taker", title: "🎲 Risk Taker!", desc: "Spent 90%+ of budget!", condition: (results, spent, budget) => spent / budget >= 0.9 },
  { id: "marketing_genius", title: "🧠 Marketing Genius!", desc: "Score above 80 in a year!", condition: (results) => results.some(r => r.score >= 80) },
  { id: "comeback_kid", title: "💪 Comeback Kid!", desc: "Loss then profit!", condition: (results) => results.length >= 2 && results[results.length - 2].profit < 0 && results[results.length - 1].profit > 0 },
  { id: "consistent", title: "📈 Consistent Winner!", desc: "Profit 3 years in a row!", condition: (results) => results.length >= 3 && results.slice(-3).every(r => r.profit > 0) },
  { id: "big_winner", title: "👑 BOSS MODE!", desc: "Total score above 300!", condition: (results) => results.reduce((s, r) => s + r.score, 0) >= 300 },
];

const SCENARIOS = {
  Easy: [
    { title: "🌱 Local Launch", desc: "Launch GreenBrew organic tea in Mumbai. Health-conscious millennials are your target. Market growing 15% annually. You have the wind at your back — seize it!" },
    { title: "🥊 Fight the Competitor", desc: "TataGreens entered your market with ₹50L budget. Sales dipped 20%. Time to retain loyal customers and hit back smart. The boardroom doesn't wait!" },
    { title: "📱 Go Digital", desc: "Smartphone users doubled in your target market. Traditional ads losing impact fast. Shift to digital-first or get left behind. Adapt or die." },
    { title: "🎉 Festive Season", desc: "Diwali season ahead! Massive consumer spending spike expected. Capture the festive wave with targeted campaigns. This is your golden window!" },
    { title: "🌍 Expand to Tier 2", desc: "Mumbai market saturated. Pune, Nagpur, Surat wide open with less competition. Expand with localized messaging. New territory, new empire!" },
  ],
  Difficult: [
    { title: "💥 Price War", desc: "Competitor slashed prices 30%. Your raw material costs up 25%. Margins squeezed from both sides. Smart allocation is your only weapon." },
    { title: "📉 Brand Crisis", desc: "A viral negative review tanked brand trust by 40%. Recovery requires bold, authentic communication. Your reputation is on the line." },
    { title: "🌐 Market Disruption", desc: "D2C brands disrupting traditional retail. Your distribution channels declining. Pivot your entire strategy or become irrelevant." },
    { title: "🔄 Product Recall", desc: "Quality issue forced partial recall. Customer confidence shaken. Trust must be rebuilt before competitors exploit the gap." },
    { title: "🏦 Funding Crunch", desc: "Investors cut budget by 35% citing market uncertainty. Do more with less. Every rupee must deliver 3x returns." },
  ],
  "Very Hard": [
    { title: "🦠 Pandemic Impact", desc: "Global health crisis. Physical retail down 80%. Complete digital pivot required immediately. Your old playbook is useless." },
    { title: "📊 Economic Recession", desc: "GDP shrinking. Consumer spending dropped 45%. Premium positioning dead. Rethink everything or watch the company collapse." },
    { title: "🌊 Market Collapse", desc: "Entire category shrinking 30% YoY. Three competitors already shut down. This is survival of the most strategic." },
    { title: "🔥 Regulatory Crackdown", desc: "Government regulations block 3 of 5 ad channels overnight. Massive fines threatened. Innovate within constraints or face shutdown." },
    { title: "⚡ AI Disruption", desc: "AI-powered competitors delivering hyper-personalized campaigns at 1/10th your cost. Outthink the algorithm or lose everything." },
  ],
};

const DIFF_SETTINGS = {
  Easy: { multiplier: 1.2, risk: 0.1, budget: 100000 },
  Difficult: { multiplier: 1.0, risk: 0.2, budget: 80000 },
  "Very Hard": { multiplier: 0.8, risk: 0.35, budget: 60000 },
};

// ===================== MAIN APP =====================
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [screen, setScreen] = useState("emailLogin");
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);
  const [surpriseEvent, setSurpriseEvent] = useState(null);
  const [currentNews, setCurrentNews] = useState("");
  const [rivalScore, setRivalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const timerRef = useRef(null);

  // Teacher
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [teacherTab, setTeacherTab] = useState("overview");
  const [teams, setTeams] = useState([
    { id: 1, name: "Team Alpha", members: [1, 2] },
    { id: 2, name: "Team Beta", members: [3, 4] },
  ]);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  const handleNextYear = useCallback(() => {
    setTimerActive(false);
    const totalSpent = ad + digital + influencer;
    if (totalSpent > budget) { alert("⚠️ Budget exceeded!"); return; }

    const event = SURPRISE_EVENTS[Math.floor(Math.random() * SURPRISE_EVENTS.length)];
    setSurpriseEvent(event);

    const { multiplier, risk } = DIFF_SETTINGS[difficulty];
    const rf = 1 - Math.random() * risk;
    const audienceBonus = audience === "Millennials" && digital > ad ? 1.2 : 1;
    const revenue = (ad * 0.3 + digital * 0.5 + influencer * 0.4) * multiplier * rf * audienceBonus * event.multiplier;
    const profit = revenue - totalSpent;
    const score = profit > 0 ? Math.round(profit / 1000) : 0;

    const rivalYearScore = Math.round(Math.random() * 80 + 20);
    setRivalScore(prev => prev + rivalYearScore);

    const rec = profit < 0
      ? `Rajiv Kapoor (RivalCorp) beat you this year! Try allocating more to Digital Marketing.`
      : profit < 5000
      ? `You're ahead of Rajiv slightly. Push harder next year with influencer campaigns!`
      : `You CRUSHED Rajiv Kapoor this year! Keep this momentum going, Boss!`;

    const result = { year, revenue: Math.round(revenue), profit: Math.round(profit), score, rec, rivalScore: rivalYearScore };
    const newResults = [...results, result];
    setResults(newResults);
    setLastResult(result);
    setShowResult(true);

    setAchievements(prev => {
      const newOnes = [];
      ACHIEVEMENTS.forEach(a => {
        if (!prev.find(x => x.id === a.id) && a.condition(newResults, totalSpent, budget)) {
          newOnes.push(a);
        }
      });
      if (newOnes.length > 0) {
        setNewAchievement(newOnes[0]);
        setTimeout(() => setNewAchievement(null), 4000);
        return [...prev, ...newOnes];
      }
      return prev;
    });

    if (year < 5) {
      setYear(y => y + 1);
      setAd(0); setDigital(0); setInfluencer(0);
      const news = NEWS_FEED[difficulty][year];
      setCurrentNews(news);
    } else {
      setGameOver(true);
      // Save to Firestore
      if (auth.currentUser) {
        const totalSc = newResults.reduce((s, r) => s + r.score, 0);
        const totalPr = newResults.reduce((s, r) => s + r.profit, 0);
        const gameRef = doc(collection(db, "leaderboard"), auth.currentUser.uid);
        setDoc(gameRef, {
          name: playerName, org: orgName, email: auth.currentUser.email,
          score: totalSc, profit: totalPr, difficulty,
          results: newResults, playedAt: new Date().toISOString()
        }, { merge: true });
      }
    }
  }, [ad, digital, influencer, budget, difficulty, audience, year, results, playerName, orgName]);

  // Timer
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      alert("⏱️ Time's up! Auto-submitting your decisions...");
      handleNextYear();
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft, handleNextYear]);

  const startTimer = () => { setTimeLeft(60); setTimerActive(true); };

  // Theme
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
    font: "'Times New Roman', Times, serif",
  };

  const S = {
    root: { minHeight: "100vh", background: t.bg, fontFamily: t.font, color: t.text, display: "flex", transition: "all 0.3s" },
    centerPage: { minHeight: "100vh", background: t.bg, fontFamily: t.font, color: t.text, display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.3s" },
    sidebar: { width: "240px", minHeight: "100vh", background: t.sidebar, borderRight: `1px solid ${t.sidebarBorder}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, fontFamily: t.font },
    logo: { padding: "28px 24px 20px", borderBottom: `1px solid ${t.sidebarBorder}` },
    logoText: { fontSize: "22px", fontWeight: "800", background: "linear-gradient(90deg, #f7c948, #ff6b6b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: t.font, letterSpacing: "2px" },
    logoSub: { fontSize: "10px", color: t.textMuted, marginTop: "4px", letterSpacing: "1px", fontStyle: "italic", fontFamily: t.font },
    navSection: { padding: "16px 12px", flex: 1, overflowY: "auto" },
    navLabel: { fontSize: "10px", color: t.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px", marginTop: "12px", fontFamily: t.font },
    navBtn: (active) => ({ width: "100%", padding: "10px 14px", background: active ? "linear-gradient(90deg, rgba(247,201,72,0.15), rgba(255,107,107,0.1))" : "transparent", border: active ? "1px solid rgba(247,201,72,0.3)" : "1px solid transparent", borderRadius: "10px", color: active ? "#f7c948" : t.textMuted, textAlign: "left", cursor: "pointer", fontSize: "13px", fontWeight: active ? "700" : "400", marginBottom: "4px", display: "flex", alignItems: "center", gap: "10px", fontFamily: t.font }),
    courseTag: (color, active) => ({ padding: "6px 14px", borderRadius: "20px", border: `1px solid ${color}44`, background: active ? `${color}22` : "transparent", color: color, fontSize: "12px", fontWeight: "600", cursor: "pointer", marginBottom: "6px", width: "100%", textAlign: "left", fontFamily: t.font }),
    signout: { padding: "16px 24px", borderTop: `1px solid ${t.sidebarBorder}` },
    signoutBtn: { width: "100%", padding: "10px", background: "rgba(255,75,75,0.1)", border: "1px solid rgba(255,75,75,0.2)", borderRadius: "8px", color: "#ff4b4b", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: t.font },
    main: { marginLeft: "240px", flex: 1, padding: "30px", minHeight: "100vh", fontFamily: t.font },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    topBarTitle: { fontSize: "24px", fontWeight: "700", color: t.text, fontFamily: t.font },
    topBarRight: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
    dropdown: { padding: "10px 14px", background: t.dropdown, border: `1px solid ${t.inputBorder}`, borderRadius: "10px", color: t.text, fontSize: "13px", cursor: "pointer", outline: "none", fontFamily: t.font, colorScheme: darkMode ? "dark" : "light" },
    darkBtn: { padding: "10px 14px", background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", border: `1px solid ${t.inputBorder}`, borderRadius: "10px", fontSize: "16px", cursor: "pointer", color: t.text, fontFamily: t.font },
    teacherBtn: { padding: "10px 16px", background: "linear-gradient(135deg, rgba(162,155,254,0.2), rgba(116,185,255,0.2))", border: "1px solid rgba(162,155,254,0.4)", borderRadius: "10px", color: "#a29bfe", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: t.font },
    card: { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: "16px", padding: "24px", marginBottom: "20px" },
    scenarioCard: { background: darkMode ? "linear-gradient(135deg, rgba(247,201,72,0.08), rgba(255,107,107,0.05))" : "linear-gradient(135deg, rgba(247,201,72,0.2), rgba(255,107,107,0.1))", border: "1px solid rgba(247,201,72,0.2)", borderRadius: "16px", padding: "24px", marginBottom: "20px" },
    input: { width: "100%", padding: "12px", background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: "8px", color: t.text, fontSize: "15px", outline: "none", boxSizing: "border-box", fontFamily: t.font },
    select: { width: "100%", padding: "10px", background: t.select, border: `1px solid ${t.inputBorder}`, borderRadius: "8px", color: t.text, fontSize: "14px", outline: "none", cursor: "pointer", boxSizing: "border-box", fontFamily: t.font, colorScheme: darkMode ? "dark" : "light" },
    nextBtn: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #f7c948, #ff9f43)", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", color: "#000", cursor: "pointer", fontFamily: t.font, letterSpacing: "1px" },
    startBtn: { padding: "14px 36px", background: "linear-gradient(135deg, #f7c948, #ff6b6b)", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "800", color: "#000", cursor: "pointer", fontFamily: t.font },
    inputCard: { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: "12px", padding: "16px" },
    inputLabel: { fontSize: "12px", color: t.textMuted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: t.font },
    resultRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: "10px", marginBottom: "8px", border: `1px solid ${t.cardBorder}` },
    tag: (color) => ({ padding: "4px 12px", borderRadius: "20px", background: `${color}22`, color: color, fontSize: "12px", fontWeight: "700", fontFamily: t.font }),
    statBox: { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: "14px", padding: "20px", textAlign: "center" },
    statNum: { fontSize: "28px", fontWeight: "800", margin: "8px 0 4px", fontFamily: t.font },
    statLabel: { fontSize: "12px", color: t.textMuted, fontFamily: t.font },
    yearDot: (active, done) => ({ flex: 1, height: "6px", borderRadius: "3px", background: done ? "#f7c948" : active ? "linear-gradient(90deg, #f7c948, #ff6b6b)" : darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }),
    budgetDisplay: { background: darkMode ? "linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,200,100,0.05))" : "linear-gradient(135deg, rgba(0,200,100,0.2), rgba(0,255,136,0.1))", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    spentBar: (pct) => ({ height: "8px", borderRadius: "4px", background: pct > 90 ? "#ff4b4b" : pct > 70 ? "#f7c948" : "#00ff88", width: `${Math.min(pct, 100)}%`, transition: "width 0.4s ease" }),
    tabBtn: (active) => ({ padding: "10px 20px", background: active ? "linear-gradient(135deg, #a29bfe, #74b9ff)" : "transparent", border: `1px solid ${active ? "#a29bfe" : t.inputBorder}`, borderRadius: "10px", color: active ? "white" : t.textMuted, cursor: "pointer", fontWeight: active ? "700" : "400", fontSize: "13px", fontFamily: t.font }),
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


  const startGame = () => {
    setBudget(DIFF_SETTINGS[difficulty].budget);
    setYear(1); setResults([]); setGameOver(false);
    setAd(0); setDigital(0); setInfluencer(0);
    setRivalScore(0); setAchievements([]);
    const news = NEWS_FEED[difficulty][0];
    setCurrentNews(news);
    setShowNews(true);
    setTimeout(() => setShowNews(false), 5000);
    setStarted(true); setActivePage("game");
    if (timerMode) startTimer();
  };


  const totalProfit = results.reduce((s, r) => s + r.profit, 0);
  const totalScore = results.reduce((s, r) => s + r.score, 0);
  const spent = ad + digital + influencer;
  const spentPct = Math.round((spent / budget) * 100);
  const scenario = SCENARIOS[difficulty]?.[year - 1];

  // ===================== EMAIL LOGIN =====================
  if (screen === "emailLogin") return (
    <div style={S.centerPage}>
      <div style={{ ...S.scenarioCard, maxWidth: "440px", width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>👔</div>
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: t.text, margin: "0", fontFamily: t.font, letterSpacing: "3px" }}>BOSSMODE</h1>
        <p style={{ color: "#f7c948", fontSize: "13px", fontStyle: "italic", margin: "6px 0 28px", fontFamily: t.font }}>
          "Born to lead. Built to win. This is your boardroom."
        </p>
        <div style={{ textAlign: "left", marginBottom: "14px" }}>
          <div style={S.inputLabel}>📧 Email Address</div>
          <input type="email" placeholder="yourname@email.com" value={email} onChange={e => setEmail(e.target.value)} style={S.input} />
        </div>
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <div style={S.inputLabel}>🔒 Password</div>
          <input type="password" placeholder="Enter password (6+ characters)" value={password} onChange={e => setPassword(e.target.value)} style={S.input} />
        </div>
        {emailError && <p style={{ color: "#ff4b4b", fontSize: "13px", marginBottom: "12px" }}>{emailError}</p>}
        <button style={{ ...S.startBtn, width: "100%", marginBottom: "12px" }}
          onClick={() => {
            if (!email || !password) { setEmailError("Please fill all fields!"); return; }
            if (!email.includes("@")) { setEmailError("Enter a valid email!"); return; }
            if (password.length < 6) { setEmailError("Password must be 6+ characters!"); return; }
            setEmailError(""); setAuthLoading(true);
            // Try sign in first, if fails then sign up
            signInWithEmailAndPassword(auth, email, password)
              .then(async (uc) => {
                const snap = await getDoc(doc(db, "users", uc.user.uid));
                if (snap.exists()) {
                  const d = snap.data();
                  setPlayerName(d.name || ""); setOrgName(d.org || "");
                  if (d.name && d.org) { setScreen("game"); } else { setScreen("profile"); }
                } else { setScreen("profile"); }
                setAuthLoading(false);
              })
              .catch(() => {
                createUserWithEmailAndPassword(auth, email, password)
                  .then(() => { setScreen("profile"); setAuthLoading(false); })
                  .catch(err => { setEmailError("❌ " + err.message); setAuthLoading(false); });
              });
          }}>
          {authLoading ? "⏳ Signing In..." : "🚀 Enter The Boardroom"}
        </button>
        <p style={{ color: t.textMuted, fontSize: "12px", marginBottom: "16px", fontStyle: "italic" }}>
          New user? Just enter your email & create a password!
        </p>
        <div style={{ borderTop: `1px solid ${t.cardBorder}`, paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={S.teacherBtn} onClick={() => setScreen("teacherLogin")}>👩‍🏫 Teacher Login</button>
          <button onClick={() => setDarkMode(!darkMode)} style={S.darkBtn}>{darkMode ? "☀️" : "🌙"}</button>
        </div>
      </div>
    </div>
  );

  // ===================== TEACHER LOGIN =====================
  if (screen === "teacherLogin") return (
    <div style={S.centerPage}>
      <div style={{ ...S.scenarioCard, maxWidth: "440px", width: "90%", textAlign: "center", border: "1px solid rgba(162,155,254,0.3)" }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>👩‍🏫</div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#a29bfe", margin: "0 0 4px", fontFamily: t.font }}>Teacher Portal</h1>
        <p style={{ color: t.textMuted, marginBottom: "28px", fontSize: "14px", fontStyle: "italic" }}>Enter your university credentials</p>
        <div style={{ textAlign: "left", marginBottom: "14px" }}>
          <div style={S.inputLabel}>📧 University Email</div>
          <input type="email" placeholder="teacher@university.edu" value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} style={{ ...S.input, border: "1px solid rgba(162,155,254,0.3)" }} />
        </div>
        <div style={{ textAlign: "left", marginBottom: "8px" }}>
          <div style={S.inputLabel}>🔒 Password</div>
          <input type="password" placeholder="University password" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} style={{ ...S.input, border: "1px solid rgba(162,155,254,0.3)" }} />
        </div>
        <p style={{ color: t.textMuted, fontSize: "12px", marginBottom: "16px", textAlign: "left", fontStyle: "italic" }}>
          💡 Demo: teacher@university.edu / teacher123
        </p>
        {teacherError && <p style={{ color: "#ff4b4b", fontSize: "13px", marginBottom: "12px" }}>{teacherError}</p>}
        <button style={{ ...S.startBtn, width: "100%", background: "linear-gradient(135deg, #a29bfe, #74b9ff)", marginBottom: "12px" }}
          onClick={() => {
            if (teacherEmail === MOCK_TEACHER.email && teacherPassword === MOCK_TEACHER.password) {
              setTeacherError(""); setScreen("teacherDashboard");
            } else setTeacherError("❌ Invalid credentials!");
          }}>
          🔓 Login as Teacher
        </button>
        <button style={{ ...S.darkBtn, width: "100%" }} onClick={() => setScreen("emailLogin")}>← Back to Student Login</button>
      </div>
    </div>
  );

  // ===================== TEACHER DASHBOARD =====================
  if (screen === "teacherDashboard") {
    const teamResults = teams.map(team => {
      const members = MOCK_STUDENTS.filter(s => team.members.includes(s.id));
      return { ...team, members, teamScore: members.reduce((s, m) => s + m.score, 0), teamProfit: members.reduce((s, m) => s + m.profit, 0) };
    });
    const createTeam = () => {
      if (!newTeamName || selectedMembers.length === 0) { alert("Enter team name and select members!"); return; }
      setTeams(prev => [...prev, { id: prev.length + 1, name: newTeamName, members: selectedMembers }]);
      setNewTeamName(""); setSelectedMembers([]); setShowCreateTeam(false);
    };
    return (
      <div style={{ ...S.root, flexDirection: "column" }}>
        <div style={{ padding: "16px 30px", background: "rgba(162,155,254,0.1)", borderBottom: "1px solid rgba(162,155,254,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>👩‍🏫</span>
            <div>
              <div style={{ fontWeight: "800", color: "#a29bfe", fontSize: "16px", fontFamily: t.font }}>Teacher Dashboard — BOSSMODE</div>
              <div style={{ color: t.textMuted, fontSize: "12px" }}>{MOCK_TEACHER.email}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setDarkMode(!darkMode)} style={S.darkBtn}>{darkMode ? "☀️" : "🌙"}</button>
            <button style={S.signoutBtn} onClick={() => { setScreen("emailLogin"); setTeacherEmail(""); setTeacherPassword(""); }}>🚪 Logout</button>
          </div>
        </div>
        <div style={{ padding: "30px", fontFamily: t.font }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Total Students", value: MOCK_STUDENTS.length, color: "#f7c948" },
              { label: "Total Teams", value: teams.length, color: "#a29bfe" },
              { label: "Avg Score", value: Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.score, 0) / MOCK_STUDENTS.length), color: "#00ff88" },
              { label: "Top Score", value: Math.max(...MOCK_STUDENTS.map(s => s.score)), color: "#ff6b6b" },
            ].map(s => (
              <div key={s.label} style={S.statBox}>
                <div style={S.statLabel}>{s.label}</div>
                <div style={{ ...S.statNum, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            {[{ id: "overview", label: "📊 Overview" }, { id: "individual", label: "👤 Individual" }, { id: "teams", label: "👥 Teams" }].map(tab => (
              <button key={tab.id} style={S.tabBtn(teacherTab === tab.id)} onClick={() => setTeacherTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          {teacherTab === "overview" && (
            <div style={S.card}>
              <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>📊 All Students Performance</h3>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", gap: "8px", padding: "10px 16px", background: "rgba(247,201,72,0.1)", borderRadius: "8px", marginBottom: "8px", fontWeight: "700", fontSize: "13px" }}>
                <span>Student</span><span>Organization</span><span>Score</span><span>Profit</span><span>Grade</span>
              </div>
              {MOCK_STUDENTS.sort((a, b) => b.score - a.score).map((s, i) => (
                <div key={s.id} style={{ ...S.resultRow, display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr" }}>
                  <span style={{ fontWeight: "700", color: i === 0 ? "#f7c948" : t.text }}>{i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : `#${i+1} `}{s.name}</span>
                  <span style={{ color: t.textMuted, fontSize: "13px" }}>{s.org}</span>
                  <span style={S.tag("#a29bfe")}>{s.score}</span>
                  <span style={{ color: "#00ff88", fontWeight: "700" }}>₹{(s.profit/1000).toFixed(0)}K</span>
                  <span style={S.tag(s.score > 400 ? "#00ff88" : s.score > 300 ? "#f7c948" : "#ff6b6b")}>{s.score > 400 ? "A+" : s.score > 300 ? "A" : s.score > 200 ? "B" : "C"}</span>
                </div>
              ))}
            </div>
          )}
          {teacherTab === "individual" && MOCK_STUDENTS.map(s => (
            <div key={s.id} style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ color: t.text, margin: "0 0 4px" }}>{s.name}</h3>
                  <p style={{ color: t.textMuted, fontSize: "13px", margin: 0 }}>{s.email} • {s.org}</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={S.tag("#a29bfe")}>Score: {s.score}</span>
                  <span style={S.tag("#00ff88")}>₹{(s.profit/1000).toFixed(0)}K</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                {s.results.map(r => (
                  <div key={r.year} style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ color: t.textMuted, fontSize: "11px", marginBottom: "4px" }}>Year {r.year}</div>
                    <div style={{ color: r.profit > 0 ? "#00ff88" : "#ff4b4b", fontWeight: "700", fontSize: "14px" }}>₹{(r.profit/1000).toFixed(0)}K</div>
                    <div style={{ color: "#f7c948", fontSize: "12px" }}>+{r.score}pts</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {teacherTab === "teams" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ color: t.text, margin: 0 }}>👥 Team Results</h3>
                <button style={{ ...S.startBtn, padding: "10px 20px", fontSize: "14px" }} onClick={() => setShowCreateTeam(!showCreateTeam)}>➕ Create Team</button>
              </div>
              {showCreateTeam && (
                <div style={{ ...S.card, border: "1px solid rgba(162,155,254,0.3)", marginBottom: "20px" }}>
                  <h3 style={{ color: "#a29bfe", marginBottom: "16px" }}>➕ New Team</h3>
                  <div style={{ marginBottom: "14px" }}>
                    <div style={S.inputLabel}>Team Name</div>
                    <input placeholder="e.g. Team Gamma" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} style={S.input} />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={S.inputLabel}>Select Members</div>
                    {MOCK_STUDENTS.map(s => (
                      <label key={s.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", cursor: "pointer", color: t.text }}>
                        <input type="checkbox" checked={selectedMembers.includes(s.id)}
                          onChange={e => { if (e.target.checked) setSelectedMembers(prev => [...prev, s.id]); else setSelectedMembers(prev => prev.filter(id => id !== s.id)); }} />
                        {s.name} — {s.org}
                      </label>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button style={{ ...S.nextBtn, background: "linear-gradient(135deg, #a29bfe, #74b9ff)" }} onClick={createTeam}>✅ Create</button>
                    <button style={{ ...S.darkBtn, flex: 1 }} onClick={() => setShowCreateTeam(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {teamResults.map(team => (
                <div key={team.id} style={S.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ color: "#a29bfe", margin: 0 }}>👥 {team.name}</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <span style={S.tag("#a29bfe")}>Team Score: {team.teamScore}</span>
                      <span style={S.tag("#00ff88")}>₹{(team.teamProfit/1000).toFixed(0)}K Total</span>
                    </div>
                  </div>
                  {team.members.map(m => (
                    <div key={m.id} style={S.resultRow}>
                      <span style={{ fontWeight: "600", color: t.text }}>{m.name}</span>
                      <span style={{ color: t.textMuted, fontSize: "13px" }}>{m.org}</span>
                      <span style={S.tag("#f7c948")}>Score: {m.score}</span>
                      <span style={{ color: "#00ff88", fontWeight: "700" }}>₹{(m.profit/1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===================== PROFILE =====================
  if (screen === "profile") return (
    <div style={S.centerPage}>
      <div style={{ ...S.scenarioCard, maxWidth: "440px", width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>👔</div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: t.text, margin: "0 0 4px", fontFamily: t.font }}>Almost There, Boss!</h1>
        <p style={{ color: "#f7c948", marginBottom: "6px", fontSize: "13px", fontStyle: "italic" }}>Signed in as: {email}</p>
        <p style={{ color: t.textMuted, marginBottom: "24px", fontSize: "14px" }}>Complete your profile to enter the boardroom</p>
        <div style={{ textAlign: "left", marginBottom: "14px" }}>
          <div style={S.inputLabel}>👤 Your Full Name</div>
          <input placeholder="e.g. Priya Sharma" value={playerName} onChange={e => setPlayerName(e.target.value)} style={S.input} />
        </div>
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <div style={S.inputLabel}>🏢 Organization / College</div>
          <input placeholder="e.g. IIM Lucknow" value={orgName} onChange={e => setOrgName(e.target.value)} style={S.input} />
        </div>
        <div style={{ textAlign: "left", marginBottom: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", color: t.text, cursor: "pointer" }}>
            <input type="checkbox" checked={timerMode} onChange={e => setTimerMode(e.target.checked)} />
            <span>⏱️ Enable <strong>Timer Mode</strong> — 60 seconds per year decision! (Hard mode)</span>
          </label>
        </div>
        <button style={{ ...S.startBtn, width: "100%" }}
          onClick={async () => {
            if (!playerName || !orgName) { alert("Please fill both fields!"); return; }
            if (auth.currentUser) {
              await setDoc(doc(db, "users", auth.currentUser.uid), { name: playerName, org: orgName, email }, { merge: true });
            }
            setScreen("game");
          }}>
          👔 Enter The Boardroom
        </button>
      </div>
    </div>
  );

  // ===================== MAIN GAME =====================
  const Sidebar = () => (
    <div style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoText}>BOSSMODE</div>
        <div style={S.logoSub}>"Born to lead. Built to win."</div>
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
        {achievements.length > 0 && (
          <>
            <div style={S.navLabel}>🏆 My Badges</div>
            {achievements.map(a => (
              <div key={a.id} style={{ padding: "6px 12px", fontSize: "12px", color: "#f7c948", fontStyle: "italic" }}>{a.title}</div>
            ))}
          </>
        )}
      </div>
      <div style={S.signout}>
        <button style={S.signoutBtn}
          onClick={async () => {
            await signOut(auth);
            setScreen("emailLogin"); setStarted(false); setResults([]);
            setPlayerName(""); setOrgName(""); setEmail(""); setPassword("");
          }}>
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
        <div style={{ padding: "10px 14px", background: "rgba(247,201,72,0.1)", border: "1px solid rgba(247,201,72,0.2)", borderRadius: "10px", fontSize: "13px", color: "#f7c948", fontWeight: "600", fontFamily: t.font }}>
          👔 {playerName}
        </div>
        <button style={S.teacherBtn} onClick={() => setScreen("teacherLogin")}>👩‍🏫 Teacher</button>
        <button onClick={() => setDarkMode(!darkMode)} style={S.darkBtn}>{darkMode ? "☀️" : "🌙"}</button>
      </div>
    </div>
  );

  // Profit Graph
  const ProfitGraph = () => {
    if (results.length === 0) return null;
    const maxVal = Math.max(...results.map(r => Math.abs(r.profit)), 1);
    return (
      <div style={S.card}>
        <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>📈 Profit Graph</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px" }}>
          {results.map(r => (
            <div key={r.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ fontSize: "10px", color: t.textMuted }}>₹{(r.profit/1000).toFixed(0)}K</div>
              <div style={{ width: "100%", height: `${Math.abs(r.profit) / maxVal * 80}px`, background: r.profit >= 0 ? "linear-gradient(180deg, #00ff88, #00cc66)" : "linear-gradient(180deg, #ff4b4b, #cc0000)", borderRadius: "4px 4px 0 0", transition: "height 0.5s ease", minHeight: "4px" }} />
              <div style={{ fontSize: "11px", color: t.textMuted }}>Y{r.year}</div>
            </div>
          ))}
          {year <= 5 && results.length < 5 && [...Array(5 - results.length)].map((_, i) => (
            <div key={`empty-${i}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ fontSize: "10px", color: t.textMuted }}>—</div>
              <div style={{ width: "100%", height: "4px", background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderRadius: "4px" }} />
              <div style={{ fontSize: "11px", color: t.textMuted }}>Y{results.length + i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        <ProfitGraph />
        {achievements.length > 0 && (
          <div style={S.card}>
            <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>🏆 Your Achievements</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {achievements.map(a => (
                <div key={a.id} style={{ ...S.tag("#f7c948"), padding: "8px 16px", fontSize: "13px" }}>
                  {a.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    if (activePage === "problem") return (
      <div>
        <TopBar title="📋 Problem Statement" />
        <div style={S.scenarioCard}>
          <h2 style={{ color: "#f7c948", marginBottom: "8px" }}>🎯 Marketing Simulation — {difficulty}</h2>
          <p style={{ color: t.textMuted, lineHeight: "1.8", fontStyle: "italic" }}>You are the Marketing Head of a growing startup. Over 5 years, make strategic decisions on budget allocation, channel selection, pricing, and target audience to maximize profit and outsmart your rival — Rajiv Kapoor of RivalCorp!</p>
        </div>
        {SCENARIOS[difficulty].map((s, i) => (
          <div key={i} style={S.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={S.tag("#f7c948")}>Year {i + 1}</span>
              <strong style={{ color: t.text }}>{s.title}</strong>
            </div>
            <p style={{ color: t.textMuted, fontSize: "14px", lineHeight: "1.7", fontStyle: "italic" }}>{s.desc}</p>
            <p style={{ color: "#74b9ff", fontSize: "13px", marginTop: "8px" }}>📰 {NEWS_FEED[difficulty][i]}</p>
          </div>
        ))}
      </div>
    );

    if (activePage === "leaderboard") {
      const allPlayers = totalScore > 0
        ? [...MOCK_STUDENTS, { name: playerName, org: orgName, score: totalScore, profit: totalProfit, difficulty }]
        : MOCK_STUDENTS;
      const sorted = [...allPlayers].sort((a, b) => b.score - a.score);
      return (
        <div>
          <TopBar title="🏆 Leaderboard" />
          <div style={S.card}>
            <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>🏆 Top Bosses — {difficulty}</h3>
            {sorted.map((p, i) => (
              <div key={i} style={{ ...S.resultRow, background: p.name === playerName ? "rgba(247,201,72,0.08)" : "transparent", border: p.name === playerName ? "1px solid rgba(247,201,72,0.3)" : `1px solid ${t.cardBorder}` }}>
                <span style={{ fontSize: "20px" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}</span>
                <span style={{ fontWeight: "700", color: p.name === playerName ? "#f7c948" : t.text }}>{p.name} {p.name === playerName ? "👈 You" : ""}</span>
                <span style={{ color: t.textMuted, fontSize: "13px" }}>{p.org}</span>
                <span style={S.tag("#74b9ff")}>{p.difficulty || "Easy"}</span>
                <span style={S.tag("#a29bfe")}>Score: {p.score}</span>
                <span style={{ color: (p.profit || 0) >= 0 ? "#00ff88" : "#ff4b4b", fontWeight: "700" }}>₹{(p.profit || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activePage === "tutorial") return (
      <div>
        <TopBar title="🎓 Tutorial" />
        <div style={S.scenarioCard}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ fontSize: "64px" }}>👨‍🏫</div>
            <div>
              <h2 style={{ color: "#f7c948", margin: 0 }}>Meet Prof. Arjun — Your Boardroom Mentor</h2>
              <p style={{ color: t.textMuted, marginTop: "8px", fontStyle: "italic" }}>"Welcome to BOSSMODE, {playerName}! In this boardroom, every decision shapes your empire. Let me show you how to think like a CEO!"</p>
            </div>
          </div>
        </div>
        {[
          { icon: "💰", title: "Budget Allocation", desc: "Digital marketing gives highest ROI (50% multiplier). Advertising is reliable (30%). Influencers are high-risk, high-reward (40%). Spread wisely — don't put all eggs in one basket!" },
          { icon: "🎯", title: "Target Audience", desc: "Millennials respond best to Digital & Influencer. Working professionals prefer LinkedIn. Students love Social Media. Know your audience — they're your empire's foundation!" },
          { icon: "💲", title: "Pricing Strategy", desc: "Low pricing captures volume but signals low quality. Medium balances reach & margin. High builds premium brand perception. Price is a message — make it count!" },
          { icon: "😈", title: "Rival CEO — Rajiv Kapoor", desc: "Rajiv runs RivalCorp and makes smart decisions every year. Beat his score to dominate the leaderboard. Study his moves, then outthink him. Only one can be the Boss!" },
          { icon: "📰", title: "News Feed", desc: "Every year starts with breaking news that affects the market. Read carefully — it's a hint about what strategy will work best this year!" },
          { icon: "⚡", title: "Surprise Events", desc: "Random events can boost or hurt your revenue. A celebrity endorsement, viral campaign, or natural disaster can change everything. Stay agile, Boss!" },
        ].map(tt => (
          <div key={tt.title} style={S.card}>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontSize: "32px" }}>{tt.icon}</span>
              <div>
                <h3 style={{ color: "#f7c948", margin: "0 0 8px" }}>{tt.title}</h3>
                <p style={{ color: t.textMuted, fontSize: "14px", lineHeight: "1.7", fontStyle: "italic" }}>{tt.desc}</p>
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
          <h2 style={{ color: "#f7c948" }}>🤖 vs 👔 CEO Battle</h2>
          <p style={{ color: t.textMuted, marginTop: "8px", fontStyle: "italic" }}>Compete against our AI opponent. Best strategist wins the boardroom!</p>
          <button style={{ ...S.startBtn, marginTop: "16px" }} onClick={startGame}>⚔️ Challenge the AI</button>
        </div>
      </div>
    );

    if (activePage === "others") return (
      <div>
        <TopBar title="👥 Play with Others" />
        <div style={S.scenarioCard}>
          <h2 style={{ color: "#f7c948" }}>👥 Multiplayer Boardroom</h2>
          <p style={{ color: t.textMuted, marginTop: "8px", fontStyle: "italic" }}>Challenge classmates! Firebase multiplayer coming soon!</p>
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
          <h2 style={{ color: "#f7c948" }}>⚔️ BOSSMODE Tournament</h2>
          <p style={{ color: t.textMuted, marginTop: "8px", fontStyle: "italic" }}>Compete in organized tournaments. Prove you're the ultimate Boss!</p>
        </div>
        <div style={S.card}>
          <h3 style={{ color: "#f7c948", marginBottom: "16px" }}>🏆 Upcoming Tournaments</h3>
          {[
            { name: "IIM Marketing Cup", date: "March 15, 2026", players: "48/64", status: "Open" },
            { name: "National BOSSMODE Finals", date: "April 1, 2026", players: "12/32", status: "Open" },
            { name: "Spring CEO Challenge", date: "March 28, 2026", players: "64/64", status: "Full" },
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
          <div style={{ ...S.scenarioCard, maxWidth: "540px", textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>👔</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: t.text, margin: "0 0 4px", letterSpacing: "2px" }}>BOSSMODE</h1>
            <p style={{ color: "#f7c948", fontStyle: "italic", marginBottom: "4px" }}>Marketing Simulation</p>
            <p style={{ color: "#f7c948", fontWeight: "600", marginBottom: "4px" }}>Welcome, {playerName}! 👋</p>
            <p style={{ color: t.textMuted, marginBottom: "8px", fontSize: "13px" }}>{orgName}</p>
            <div style={{ background: "rgba(255,75,75,0.1)", border: "1px solid rgba(255,75,75,0.2)", borderRadius: "10px", padding: "10px 16px", marginBottom: "16px" }}>
              <span style={{ color: "#ff6b6b", fontSize: "13px" }}>{RIVAL_CEO.avatar} Your rival: <strong>{RIVAL_CEO.name}</strong> from <strong>{RIVAL_CEO.company}</strong> is ready to compete!</span>
            </div>
            <div style={{ textAlign: "left", marginBottom: "16px" }}>
              <div style={S.inputLabel}>Select Difficulty</div>
              <select style={S.select} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option>Easy</option><option>Difficult</option><option>Very Hard</option>
              </select>
            </div>
            <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", textAlign: "left" }}>
              <span style={{ color: t.textMuted, fontSize: "13px" }}>Starting Budget: </span>
              <span style={{ color: "#00ff88", fontWeight: "800", fontSize: "20px" }}>₹{DIFF_SETTINGS[difficulty].budget.toLocaleString()}</span>
            </div>
            {timerMode && <p style={{ color: "#ff9f43", fontSize: "13px", marginBottom: "12px" }}>⏱️ Timer Mode ON — 60 seconds per decision!</p>}
            <button style={{ ...S.startBtn, width: "100%" }} onClick={startGame}>🚀 Enter The Boardroom</button>
          </div>
        </div>
      </div>
    );

    if (showResult && lastResult) return (
      <div>
        <TopBar title={`📊 Year ${lastResult.year} Results`} />
        {surpriseEvent && (
          <div style={{ background: "rgba(116,185,255,0.1)", border: "1px solid rgba(116,185,255,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <strong style={{ color: "#74b9ff" }}>⚡ Surprise Event!</strong>
            <p style={{ color: t.text, margin: "6px 0 0", fontStyle: "italic" }}>{surpriseEvent.text}</p>
          </div>
        )}
        <div style={{ ...S.scenarioCard, textAlign: "center" }}>
          <div style={{ fontSize: "48px" }}>{lastResult.profit >= 0 ? "🎉" : "😬"}</div>
          <h2 style={{ color: lastResult.profit >= 0 ? "#00ff88" : "#ff4b4b", margin: "12px 0" }}>
            {lastResult.profit >= 0 ? "Profit Made, Boss!" : "Loss Incurred. Regroup!"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", margin: "20px 0" }}>
            {[
              { label: "Your Revenue", value: `₹${lastResult.revenue.toLocaleString()}`, color: "#74b9ff" },
              { label: "Profit/Loss", value: `${lastResult.profit >= 0 ? "+" : ""}₹${lastResult.profit.toLocaleString()}`, color: lastResult.profit >= 0 ? "#00ff88" : "#ff4b4b" },
              { label: "Your Score", value: lastResult.score, color: "#f7c948" },
            ].map(s => (
              <div key={s.label} style={S.statBox}>
                <div style={S.statLabel}>{s.label}</div>
                <div style={{ ...S.statNum, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,75,75,0.1)", border: "1px solid rgba(255,75,75,0.2)", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
            <span style={{ color: "#ff6b6b", fontSize: "13px" }}>{RIVAL_CEO.avatar} Rajiv Kapoor scored <strong>{lastResult.rivalScore}</strong> this year!</span>
          </div>
          <div style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ color: t.text, margin: 0, fontStyle: "italic" }}>{lastResult.rec}</p>
          </div>
          {newAchievement && (
            <div style={{ background: "linear-gradient(135deg, rgba(247,201,72,0.2), rgba(255,107,107,0.1))", border: "1px solid rgba(247,201,72,0.4)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ color: "#f7c948", fontWeight: "800", margin: 0 }}>🏆 Achievement Unlocked! {newAchievement.title}</p>
              <p style={{ color: t.textMuted, margin: "4px 0 0", fontSize: "13px" }}>{newAchievement.desc}</p>
            </div>
          )}
          <button style={S.startBtn} onClick={() => { setShowResult(false); setSurpriseEvent(null); if (gameOver) setActivePage("dashboard"); else if (timerMode) startTimer(); }}>
            {gameOver ? "📊 See Final Results" : `➡️ Year ${year} — Enter Boardroom`}
          </button>
        </div>
        <ProfitGraph />
      </div>
    );

    if (gameOver && !showResult) return (
      <div>
        <TopBar title="🏁 Boardroom Verdict!" />
        <div style={{ ...S.scenarioCard, textAlign: "center" }}>
          <div style={{ fontSize: "64px" }}>👑</div>
          <h1 style={{ color: "#f7c948", margin: "16px 0 4px", letterSpacing: "2px" }}>5 Years Complete!</h1>
          <p style={{ color: t.textMuted, fontStyle: "italic" }}>{playerName} | {orgName}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", margin: "20px 0" }}>
            <div style={S.statBox}>
              <div style={S.statLabel}>Your Total Profit</div>
              <div style={{ ...S.statNum, color: totalProfit >= 0 ? "#00ff88" : "#ff4b4b" }}>₹{totalProfit.toLocaleString()}</div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>Your Final Score</div>
              <div style={{ ...S.statNum, color: "#f7c948" }}>{totalScore}</div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>{RIVAL_CEO.avatar} Rival Score</div>
              <div style={{ ...S.statNum, color: "#ff6b6b" }}>{rivalScore}</div>
            </div>
          </div>
          <div style={{ background: totalScore > rivalScore ? "rgba(0,255,136,0.1)" : "rgba(255,75,75,0.1)", border: `1px solid ${totalScore > rivalScore ? "rgba(0,255,136,0.3)" : "rgba(255,75,75,0.3)"}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: totalScore > rivalScore ? "#00ff88" : "#ff4b4b", fontWeight: "800", margin: 0, fontSize: "18px" }}>
              {totalScore > rivalScore ? "🏆 YOU BEAT RAJIV KAPOOR! You're the TRUE BOSS!" : "😈 Rajiv Kapoor wins this round. Study. Return. Dominate."}
            </p>
          </div>
          <div style={{ ...S.tag(totalScore > 200 ? "#00ff88" : totalScore > 100 ? "#f7c948" : "#ff4b4b"), display: "inline-block", fontSize: "16px", padding: "10px 24px", marginBottom: "20px" }}>
            {totalScore > 200 ? "👑 Excellent Strategist — BOSS LEVEL!" : totalScore > 100 ? "👍 Good Manager — Keep Going!" : "📚 Needs Improvement — Try Again!"}
          </div>
          {achievements.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "#f7c948", fontWeight: "700", marginBottom: "10px" }}>🏆 Badges Earned:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {achievements.map(a => <span key={a.id} style={S.tag("#f7c948")}>{a.title}</span>)}
              </div>
            </div>
          )}
          <button style={S.startBtn} onClick={() => { setStarted(false); setGameOver(false); setResults([]); setYear(1); setRivalScore(0); setAchievements([]); }}>
            🔄 Play Again, Boss!
          </button>
        </div>
        <ProfitGraph />
      </div>
    );

    // Active Game
    return (
      <div>
        <TopBar title={`🎮 BOSSMODE — Year ${year} of 5`} />

        {/* News Banner */}
        {showNews && (
          <div style={{ background: "rgba(116,185,255,0.15)", border: "1px solid rgba(116,185,255,0.3)", borderRadius: "12px", padding: "14px 20px", marginBottom: "16px", animation: "fadeIn 0.5s" }}>
            <strong style={{ color: "#74b9ff" }}>📰 Market News: </strong>
            <span style={{ color: t.text, fontStyle: "italic" }}>{currentNews}</span>
          </div>
        )}

        {/* Timer */}
        {timerMode && timerActive && (
          <div style={{ background: timeLeft < 15 ? "rgba(255,75,75,0.2)" : "rgba(247,201,72,0.1)", border: `1px solid ${timeLeft < 15 ? "rgba(255,75,75,0.5)" : "rgba(247,201,72,0.3)"}`, borderRadius: "12px", padding: "12px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: timeLeft < 15 ? "#ff4b4b" : "#f7c948", fontWeight: "800", fontSize: "18px" }}>⏱️ {timeLeft}s</span>
            <span style={{ color: t.textMuted, fontSize: "13px" }}>Make your decision fast, Boss!</span>
          </div>
        )}

        {/* Rival Banner */}
        <div style={{ background: "rgba(255,75,75,0.05)", border: "1px solid rgba(255,75,75,0.15)", borderRadius: "12px", padding: "10px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: t.textMuted, fontSize: "13px" }}>{RIVAL_CEO.avatar} <strong style={{ color: "#ff6b6b" }}>Rajiv Kapoor</strong> is making his move...</span>
          <span style={{ color: "#ff6b6b", fontWeight: "700" }}>Rival Score: {rivalScore}</span>
        </div>

        {/* Year Bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[1,2,3,4,5].map(y => <div key={y} style={S.yearDot(y === year, y < year)} />)}
        </div>

        {/* Scenario */}
        <div style={S.scenarioCard}>
          <span style={S.tag("#f7c948")}>Year {year} Scenario</span>
          <h2 style={{ color: t.text, margin: "10px 0 6px" }}>{scenario?.title}</h2>
          <p style={{ color: t.textMuted, lineHeight: "1.8", margin: 0, fontStyle: "italic" }}>{scenario?.desc}</p>
        </div>

        {/* Budget */}
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

        {/* Decision Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          {[
            { label: "📺 Advertising Budget (₹)", val: ad, setter: setAd },
            { label: "📱 Digital Marketing (₹)", val: digital, setter: setDigital },
            { label: "🌟 Influencer Budget (₹)", val: influencer, setter: setInfluencer },
          ].map(f => (
            <div key={f.label} style={S.inputCard}>
              <div style={S.inputLabel}>{f.label}</div>
              <input type="number" value={f.val} min={0} max={budget} onChange={e => f.setter(Number(e.target.value))} style={S.input} />
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

        {/* Previous Results */}
        {results.length > 0 && (
          <div style={{ ...S.card, marginBottom: "20px" }}>
            <h3 style={{ color: "#f7c948", marginBottom: "12px" }}>📊 Previous Results</h3>
            {results.map(r => (
              <div key={r.year} style={S.resultRow}>
                <span style={{ color: "#f7c948", fontWeight: "700" }}>Year {r.year}</span>
                <span style={{ color: t.textMuted }}>₹{r.revenue.toLocaleString()}</span>
                <span style={{ color: r.profit >= 0 ? "#00ff88" : "#ff4b4b", fontWeight: "700" }}>{r.profit >= 0 ? "+" : ""}₹{r.profit.toLocaleString()}</span>
                <span style={S.tag("#a29bfe")}>+{r.score}pts</span>
                <span style={{ color: "#ff6b6b", fontSize: "12px" }}>😈 Rival: {r.rivalScore}pts</span>
              </div>
            ))}
          </div>
        )}

        <button style={S.nextBtn} onClick={handleNextYear}>
          Submit Year {year} Decisions — Outsmart Rajiv! →
        </button>
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

