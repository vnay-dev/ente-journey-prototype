import { useEffect, useState } from "react";

export type PresentationMode = "demo" | "device";

const WIDE_QUERY = "(min-width: 481px)";

function resolveMode(): PresentationMode {
  const forceDemo = new URLSearchParams(window.location.search).get("demo") === "1";
  const isWide = window.matchMedia(WIDE_QUERY).matches;
  return isWide || forceDemo ? "demo" : "device";
}

/** Demo = framed phone on laptop. Device = full screen on a real phone. */
export function usePresentationMode(): PresentationMode {
  const [mode, setMode] = useState<PresentationMode>(resolveMode);

  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const update = () => setMode(resolveMode());

    mq.addEventListener("change", update);
    window.addEventListener("popstate", update);

    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("popstate", update);
    };
  }, []);

  return mode;
}
