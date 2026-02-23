import React, { useState } from "react";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [year, setYear] = useState(1);
  const [difficulty, setDifficulty] = useState("Easy");
  const [budget, setBudget] = useState(100000);
  const [ad, setAd] = useState(0);
  const [digital, setDigital] = useState(0);
  const [influencer, setInfluencer] = useState(0);
  const [price, setPrice] = useState("Medium");
  const [results, setResults] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const difficultySettings = {
    Easy: { multiplier: 1.2, risk: 0.1 },
    Difficult: { multiplier: 1, risk: 0.2 },
    "Very Hard": { multiplier: 0.8, risk: 0.35 }
  };

  const startGame = () => {
    if (difficulty === "Easy") setBudget(100000);
    if (difficulty === "Difficult") setBudget(80000);
    if (difficulty === "Very Hard") setBudget(60000);
    setStarted(true);
  };

  const nextYear = () => {
    const totalSpent = ad + digital + influencer;

    if (totalSpent > budget) {
      alert("Budget exceeded! Adjust your spending.");
      return;
    }

    const { multiplier, risk } = difficultySettings[difficulty];

    const randomFactor = 1 - Math.random() * risk;
    const revenue =
      (ad * 0.3 + digital * 0.5 + influencer * 0.4) *
      multiplier *
      randomFactor;

    const profit = revenue - totalSpent;
    const score = profit > 0 ? profit / 1000 : 0;

    const newResult = {
      year,
      revenue: Math.round(revenue),
      profit: Math.round(profit),
      score: Math.round(score)
    };

    setResults([...results, newResult]);

    if (year === 5) {
      setGameOver(true);
    } else {
      setYear(year + 1);
      setAd(0);
      setDigital(0);
      setInfluencer(0);
    }
  };

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const totalProfit = results.reduce((sum, r) => sum + r.profit, 0);

  if (!started) {
    return (
      <div className="container">
        <h1>BizQuest - Marketing Simulation</h1>
        <h3>Select Difficulty</h3>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Difficult</option>
          <option>Very Hard</option>
        </select>
        <br />
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="container">
        <h1>Game Over</h1>
        <h2>Total Profit: ₹{totalProfit}</h2>
        <h2>Final Score: {totalScore}</h2>
        <h3>
          Performance:{" "}
          {totalScore > 200
            ? "Excellent Strategist"
            : totalScore > 100
            ? "Good Manager"
            : "Needs Improvement"}
        </h3>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Year {year}</h2>
      <h3>Available Budget: ₹{budget}</h3>

      <div className="inputs">
        <label>
          Advertising:
          <input
            type="number"
            value={ad}
            onChange={(e) => setAd(Number(e.target.value))}
          />
        </label>

        <label>
          Digital:
          <input
            type="number"
            value={digital}
            onChange={(e) => setDigital(Number(e.target.value))}
          />
        </label>

        <label>
          Influencer:
          <input
            type="number"
            value={influencer}
            onChange={(e) => setInfluencer(Number(e.target.value))}
          />
        </label>

        <label>
          Pricing Strategy:
          <select value={price} onChange={(e) => setPrice(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>

      <button onClick={nextYear}>Next Year</button>

      <h3>Yearly Results</h3>
      {results.map((r) => (
        <div key={r.year}>
          Year {r.year} - Revenue: ₹{r.revenue} | Profit: ₹{r.profit} | Score:{" "}
          {r.score}
        </div>
      ))}
    </div>
  );
}

export default App;