import { useEffect, useState } from "react";

/** A single, finite typing pass. Full text remains available to assistive technology. */
export function Typewriter({ text }: { text: string }) {
  const [visible, setVisible] = useState(text);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    let index = 0;
    setVisible("");
    const timer = window.setInterval(() => {
      index += 1;
      setVisible(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 55);
    const stop = () => {
      if (preference.matches) {
        window.clearInterval(timer);
        setVisible(text);
      }
    };
    preference.addEventListener("change", stop);
    return () => { window.clearInterval(timer); preference.removeEventListener("change", stop); };
  }, [text]);
  return <span className="typewriter" aria-label={text} role="text"><span className="typewriter-reserve" aria-hidden="true">{text}</span><span className="typewriter-visible" aria-hidden="true">{visible}<span className={visible.length < text.length ? "typing-caret" : "typing-caret finished"} /></span></span>;
}
