import { useState, useEffect } from "react";

export function useTypewriter(text, speed = 30) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplay((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return display;
}
