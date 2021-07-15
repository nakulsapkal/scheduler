import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial || "");
  const [history, setHistory] = useState([initial]);

  //Transition of modes to next or previous
  function transition(nextMode, replace = false) {
    if (replace) history.pop(); //If we are caught in error scenarios to revert to previous state and maintain proper state we need to pop the last stale state

    setMode(nextMode);
    setHistory((prev) => [...prev, nextMode]); //spread prev state for maintianing immutablity
  }

  //This function helps in tracing back the state mode depending upon the stack size
  function back() {
    if (history.length > 1) {
      history.pop();
      setHistory(history);
      setMode(history[history.length - 1]);
    } else {
      setHistory(history);
      setMode(history[history.length - 1]);
    }
  }

  return { mode, transition, back };
}
