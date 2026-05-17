import React, { useState, useEffect } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0d0d0d;
    font-family: 'Inter', sans-serif;
  }

  .ttt-root {
    min-height: 100vh;
    background: #0d0d0d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .ttt-root::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .ttt-root::after {
    content: '';
    position: fixed;
    bottom: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .title {
    font-size: 11px;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 2.5rem;
  }

  .scoreboard {
    display: flex;
    gap: 1px;
    margin-bottom: 2.5rem;
    background: #1a1a1a;
    border: 1px solid #222;
    border-radius: 14px;
    overflow: hidden;
  }

  .score-cell {
    padding: 14px 32px;
    text-align: center;
    background: #111;
    transition: background 0.2s;
  }

  .score-cell:not(:last-child) {
    border-right: 1px solid #1a1a1a;
  }

  .score-cell.active-player {
    background: #161616;
  }

  .score-label {
    font-size: 10px;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .score-label.x { color: #7c3aed; }
  .score-label.d { color: #444; }
  .score-label.o { color: #14b8a6; }

  .score-val {
    font-size: 26px;
    font-weight: 800;
    color: #eee;
  }

  .status-bar {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .status-text {
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.12em;
    color: #555;
  }

  .status-text.winner {
    color: #a3e635;
    font-weight: 500;
  }

  .status-text.draw {
    color: #f59e0b;
    font-weight: 500;
  }

  .status-text .mark-x { color: #7c3aed; }
  .status-text .mark-o { color: #14b8a6; }

  .board-wrap {
    position: relative;
    padding: 3px;
    border-radius: 20px;
    background: linear-gradient(135deg, #2a1f3d, #1a1a1a, #0f2d2b);
    margin-bottom: 2rem;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 110px);
    grid-template-rows: repeat(3, 110px);
    gap: 3px;
    background: #1c1c1c;
    border-radius: 18px;
    overflow: hidden;
  }

  .sq {
    background: #111;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    position: relative;
    overflow: hidden;
  }

  .sq::after {
    content: '';
    position: absolute;
    inset: 0;
    background: white;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .sq:hover:not(.filled)::after {
    opacity: 0.03;
  }

  .sq.filled { cursor: default; }

  .sq.win-cell {
    background: #161616;
  }

  .mark {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s;
    transform: scale(0);
    opacity: 0;
  }

  .mark.show {
    transform: scale(1);
    opacity: 1;
  }

  .mark.x-mark { color: #7c3aed; }
  .mark.o-mark { color: #14b8a6; }

  .mark.win-mark {
    filter: brightness(1.3);
  }

  .reset-btn {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: transparent;
    color: #444;
    border: 1px solid #222;
    padding: 12px 32px;
    border-radius: 100px;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }

  .reset-btn:hover {
    color: #ccc;
    border-color: #444;
    background: #161616;
  }

  .reset-btn:active {
    transform: scale(0.97);
  }
`;

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function findWinner(squares) {
  for (let [a, b, c] of WINS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return { winner: squares[a], line: [a, b, c] };
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 });
  const [shown, setShown] = useState(Array(9).fill(false));

  const result = findWinner(board);
  const isDraw = !board.includes(null) && !result;
  const winLine = result ? result.line : [];

  const handleClick = (i) => {
    if (board[i] || result) return;
    const newBoard = [...board];
    newBoard[i] = player;
    setBoard(newBoard);

    const newShown = [...shown];
    newShown[i] = true;
    setShown(newShown);

    const r = findWinner(newBoard);
    if (r) {
      setScores(s => ({ ...s, [r.winner]: s[r.winner] + 1 }));
    } else if (!newBoard.includes(null)) {
      setScores(s => ({ ...s, D: s.D + 1 }));
    } else {
      setPlayer(player === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setShown(Array(9).fill(false));
  };

  const statusContent = result ? (
    <span className="status-text winner">
      <span className={result.winner === "X" ? "mark-x" : "mark-o"}>{result.winner}</span>
      {" wins"}
    </span>
  ) : isDraw ? (
    <span className="status-text draw">draw</span>
  ) : (
    <span className="status-text">
      <span className={player === "X" ? "mark-x" : "mark-o"}>{player}</span>
      {" to play"}
    </span>
  );

  return (
    <>
      <style>{style}</style>
      <div className="ttt-root">
        <p className="title">tic · tac · toe</p>

        <div className="scoreboard">
          <div className={`score-cell${player === "X" && !result && !isDraw ? " active-player" : ""}`}>
            <div className="score-label x">X</div>
            <div className="score-val">{scores.X}</div>
          </div>
          <div className="score-cell">
            <div className="score-label d">draws</div>
            <div className="score-val">{scores.D}</div>
          </div>
          <div className={`score-cell${player === "O" && !result && !isDraw ? " active-player" : ""}`}>
            <div className="score-label o">O</div>
            <div className="score-val">{scores.O}</div>
          </div>
        </div>

        <div className="status-bar">{statusContent}</div>

        <div className="board-wrap">
          <div className="board">
            {board.map((cell, i) => (
              <button
                key={i}
                className={`sq${cell ? " filled" : ""}${winLine.includes(i) ? " win-cell" : ""}`}
                onClick={() => handleClick(i)}
                aria-label={`Square ${i + 1}${cell ? ", " + cell : ""}`}
              >
                <span
                  className={`mark ${shown[i] ? "show" : ""} ${
                    cell === "X" ? "x-mark" : cell === "O" ? "o-mark" : ""
                  } ${winLine.includes(i) ? "win-mark" : ""}`}
                >
                  {cell}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button className="reset-btn" onClick={resetGame}>new game</button>
      </div>
    </>
  );
}