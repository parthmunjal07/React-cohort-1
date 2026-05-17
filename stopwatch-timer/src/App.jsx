import React, { useState, useEffect, useRef, useCallback } from "react";

function formatTime(ms, showMs = true) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  const cc = String(cs).padStart(2, "0");
  
  if (h > 0) return `${hh}:${mm}:${ss}${showMs ? `.${cc}` : ""}`;
  return `${mm}:${ss}${showMs ? `.${cc}` : ""}`;
}

function Ring({ progress, running, isTimer, done }) {
  const r = 88, cx = 110, cy = 110;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, Math.max(0, progress)));
  const stroke = done ? "#f87171" : isTimer ? "#34d399" : "#facc15";
  
  const dotAngle = (-90 + progress * 360) * (Math.PI / 180);
  const dotX = cx + r * Math.cos(dotAngle);
  const dotY = cy + r * Math.sin(dotAngle);
  
  return (
    <svg width="220" height="220" className="absolute inset-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="3" />
      <circle 
        cx={cx} cy={cy} r={r} 
        fill="none" stroke={stroke} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: running ? "stroke-dashoffset 0.1s linear" : "none", opacity: progress > 0 ? 1 : 0.18 }} 
      />
      {running && progress > 0 && <circle cx={dotX} cy={dotY} r={4.5} fill={stroke} />}
    </svg>
  );
}

function LapList({ laps, onClear }) {
  if (!laps.length) return null;
  return (
    <div className="mt-5 border-t border-gray-800 pt-3 max-h-40 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono tracking-widest text-gray-600">LAPS</span>
        <button onClick={onClear} className="text-xs font-mono tracking-widest text-gray-700 hover:text-gray-400 transition-colors">CLEAR</button>
      </div>
      {[...laps].reverse().map((l, i) => (
        <div key={i} className="flex justify-between py-1.5 border-t border-gray-800/60" style={{ opacity: Math.max(0.2, 1 - i * 0.1) }}>
          <span className="text-xs font-mono text-gray-600">LAP {laps.length - i}</span>
          <span className="text-xs font-mono text-gray-400">{formatTime(l)}</span>
        </div>
      ))}
    </div>
  );
}

function Btn({ onClick, label, icon, variant = "ghost", disabled }) {
  const base = "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    yellow: "bg-yellow-400 text-black hover:bg-yellow-300",
    green:  "bg-emerald-400 text-black hover:bg-emerald-300",
    ghost:  "border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant] || variants.ghost}`}>
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </button>
  );
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps]       = useState([]);
  const startRef = useRef(null);
  const rafRef   = useRef(null);

  const tick = useCallback(() => {
    setElapsed(Date.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running) { 
      startRef.current = Date.now() - elapsed; 
      rafRef.current = requestAnimationFrame(tick); 
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, elapsed, tick]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setElapsed(0); setLaps([]); };
  const lap   = () => setLaps(p => [...p, elapsed]);

  return (
    <div>
      <div className="relative w-[220px] h-[220px] mx-auto mb-6">
        <Ring progress={(elapsed % 60000) / 60000} running={running} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold tracking-wider text-white ${elapsed >= 3600000 ? "text-3xl" : "text-4xl"}`}
                style={{ textShadow: running ? "0 0 24px rgba(250,204,21,0.4)" : "none", transition: "text-shadow 0.3s" }}>
            {formatTime(elapsed)}
          </span>
          <span className="mt-1 text-[10px] font-mono tracking-[0.3em] text-gray-600">
            {running ? "RUNNING" : elapsed > 0 ? "PAUSED" : "READY"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {!running && elapsed === 0 && <Btn onClick={start}  label="START"  icon="▶" variant="yellow" />}
        {!running && elapsed > 0   && <><Btn onClick={start} label="RESUME" icon="▶" variant="yellow" /><Btn onClick={reset} label="RESET" icon="↺" /></>}
        {running                   && <><Btn onClick={pause} label="PAUSE"  icon="⏸" /><Btn onClick={lap} label="LAP" icon="⊕" /></>}
      </div>

      <LapList laps={laps} onClear={() => setLaps([])} />
    </div>
  );
}

// --- Component: Timer Number Input ---
function SpinInput({ value, onChange, max, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button onClick={() => onChange(Math.min(max, value + 1))}
              className="w-9 h-7 bg-gray-800 border border-gray-700 rounded-md text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-colors">▲</button>
      <input type="number" min={0} max={max} value={String(value).padStart(2, "0")}
             onChange={e => onChange(Math.max(0, Math.min(max, parseInt(e.target.value) || 0)))}
             className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-lg text-white text-2xl font-mono font-bold text-center focus:outline-none focus:border-emerald-500 transition-colors" />
      <button onClick={() => onChange(Math.max(0, value - 1))}
              className="w-9 h-7 bg-gray-800 border border-gray-700 rounded-md text-gray-600 hover:text-white hover:border-gray-500 text-sm transition-colors">▼</button>
      <span className="text-[10px] font-mono tracking-[0.3em] text-gray-600">{label}</span>
    </div>
  );
}

function Timer() {
  const [hrs, setHrs] = useState(0);
  const [min, setMin] = useState(5);
  const [sec, setSec] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning]     = useState(false);
  const [done, setDone]           = useState(false);
  
  const startRef  = useRef(null);
  const rafRef    = useRef(null);
  const initialMs = useRef(null);

  const totalMs   = (hrs * 3600 + min * 60 + sec) * 1000;
  const displayMs = remaining !== null ? remaining : totalMs;
  const progress  = remaining !== null && initialMs.current ? 1 - remaining / initialMs.current : 1;

  const tick = useCallback(() => {
    const rem = initialMs.current - (Date.now() - startRef.current);
    if (rem <= 0) { 
      setRemaining(0); 
      setRunning(false); 
      setDone(true); 
      return; 
    }
    setRemaining(rem);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, tick]);

  const start = () => {
    const ms = remaining !== null ? remaining : totalMs;
    if (ms <= 0) return;
    if (remaining === null) initialMs.current = ms;
    
    setDone(false);
    startRef.current = Date.now() - (initialMs.current - ms);
    setRemaining(ms);
    setRunning(true);
  };

  const pause = () => setRunning(false);
  const reset = () => { 
    cancelAnimationFrame(rafRef.current); 
    setRunning(false); 
    setRemaining(null); 
    setDone(false); 
    initialMs.current = null; 
  };
  
  const editing = remaining === null && !running;

  return (
    <div>
      <div className="relative w-[220px] h-[220px] mx-auto mb-6">
        <Ring progress={progress} running={running} isTimer done={done} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold tracking-wider transition-colors duration-300 ${done ? "text-red-400" : "text-white"} ${displayMs >= 3600000 ? "text-3xl" : "text-4xl"}`}
                style={{ textShadow: running ? "0 0 24px rgba(52,211,153,0.35)" : done ? "0 0 24px rgba(248,113,113,0.4)" : "none", transition: "text-shadow 0.3s" }}>
            {formatTime(displayMs, false)}
          </span>
          <span className={`mt-1 text-[10px] font-mono tracking-[0.3em] ${done ? "text-red-500" : "text-gray-600"}`}>
            {done ? "TIME'S UP!" : running ? "COUNTING DOWN" : remaining !== null ? "PAUSED" : "SET TIME"}
          </span>
        </div>
      </div>

      {editing && (
        <div className="flex items-center justify-center gap-2 mb-5">
          <SpinInput value={hrs} onChange={setHrs} max={23} label="HRS" />
          <span className="text-gray-700 text-3xl font-mono mb-5">:</span>
          <SpinInput value={min} onChange={setMin} max={59} label="MIN" />
          <span className="text-gray-700 text-3xl font-mono mb-5">:</span>
          <SpinInput value={sec} onChange={setSec} max={59} label="SEC" />
        </div>
      )}

      <div className="flex gap-2 justify-center flex-wrap">
        {!running && !done && <Btn onClick={start} label={remaining !== null ? "RESUME" : "START"} icon="▶" variant="green" disabled={!totalMs && remaining === null} />}
        {running && <Btn onClick={pause} label="PAUSE" icon="⏸" />}
        {(remaining !== null || done) && <Btn onClick={reset} label="RESET" icon="↺" />}
      </div>

      {done && (
        <div className="mt-4 py-3 rounded-lg border border-red-900/50 bg-red-950/30 text-center">
          <span className="text-red-400 font-mono text-xs tracking-widest">⏰ TIMER COMPLETE</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("stopwatch");

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-5">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <p className="font-mono text-[10px] tracking-[0.5em] text-gray-700 mb-1">CHRONOS</p>
          <p className="font-mono text-[9px] tracking-[0.3em] text-gray-800">PRECISION TIME CONTROL</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex bg-gray-950 rounded-xl p-1 mb-7 gap-1">
            {["stopwatch", "timer"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-[11px] font-mono font-bold tracking-widest transition-all duration-200
                  ${tab === t
                    ? t === "stopwatch"
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                      : "bg-emerald-400 text-black shadow-lg shadow-emerald-400/20"
                    : "text-gray-600 hover:text-gray-400"}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {tab === "stopwatch" ? <Stopwatch /> : <Timer />}
        </div>

        <p className="text-center mt-5 font-mono text-[9px] tracking-[0.4em] text-gray-800">
          RAF-BASED · CENTISECOND PRECISION
        </p>
      </div>
    </div>
  );
}