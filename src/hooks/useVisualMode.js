import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial || "");
  const [history, setHistory] = useState([initial]);

  //Transition of modes to next or previous
  function transition(nextMode, replace = false) {
    setMode(nextMode);
    if (replace) {
      //If we are caught in error scenarios to revert to previous state and maintain proper state we need to pop the last stale state
      setHistory((prev) => [...prev.slice(0, prev.length - 1), nextMode]);
    } else {
      setHistory((prev) => [...prev, nextMode]); //spread prev state for maintianing immutablity
    }
  }

  //This function helps in tracing back the state mode depending upon the stack size
  function back() {
    let currentHistory = [...history];
    if (currentHistory.length > 1) {
      currentHistory.pop();
      setHistory(currentHistory);
      setMode(currentHistory[currentHistory.length - 1]);
    } else {
      setHistory(currentHistory);
      setMode(currentHistory[currentHistory.length - 1]);
    }
  }

  return { mode, transition, back };
}
