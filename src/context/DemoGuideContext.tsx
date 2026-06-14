import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { DEMO_SCENES, type DemoScene } from "../demo/scenes";
import { DEMO_INTRO_FADE_MS, DEMO_INTRO_HOLD_MS } from "../demo/presentation";

export type DemoPlayback = "playing" | "paused" | "ended";

export type DemoPresentationPhase = "intro" | "running" | "outro" | "complete";

export type EnsuTypeRequest = {
  text: string;
  charMs: number;
};

type DemoGuideContextValue = {
  isV2Demo: boolean;
  isAutomatedDemo: boolean;
  notificationRevealed: boolean;
  presentationPhase: DemoPresentationPhase;
  playback: DemoPlayback;
  sceneIndex: number;
  scene: DemoScene;
  totalScenes: number;
  ensuTypeRequest: EnsuTypeRequest | null;
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  advanceScene: () => void;
  restartScenes: () => void;
  completePresentation: () => void;
  revealNotification: () => void;
  beginEnsuType: (text: string, charMs?: number) => Promise<void>;
  completeEnsuType: () => void;
  registerRestartHandler: (handler: (() => void) | null) => void;
};

const DemoGuideContext = createContext<DemoGuideContextValue | null>(null);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

function resolveAutomatedDemo(): boolean {
  const onV2 = window.location.pathname.startsWith("/v2");
  if (!onV2) {
    return false;
  }
  const demoParam = new URLSearchParams(window.location.search).get("demo") === "1";
  const wideDemo = window.matchMedia("(min-width: 481px)").matches;
  return demoParam || wideDemo;
}

export function DemoGuideProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isV2Demo = location.pathname.startsWith("/v2");
  const [isAutomatedDemo] = useState(resolveAutomatedDemo);
  const [presentationPhase, setPresentationPhase] = useState<DemoPresentationPhase>(
    () => (resolveAutomatedDemo() ? "intro" : "running"),
  );
  const [playback, setPlayback] = useState<DemoPlayback>(() =>
    resolveAutomatedDemo() ? "paused" : "playing",
  );
  const [sceneIndex, setSceneIndex] = useState(0);
  const [notificationRevealed, setNotificationRevealed] = useState(false);
  const [ensuTypeRequest, setEnsuTypeRequest] = useState<EnsuTypeRequest | null>(null);
  const restartHandlerRef = useRef<(() => void) | null>(null);
  const ensuTypeResolveRef = useRef<(() => void) | null>(null);

  const scene = DEMO_SCENES[sceneIndex] ?? DEMO_SCENES[DEMO_SCENES.length - 1];

  const advanceScene = useCallback(() => {
    setSceneIndex((current) => {
      if (current >= DEMO_SCENES.length - 1) {
        setPlayback("ended");
        if (isAutomatedDemo) {
          setPresentationPhase("outro");
        }
        return current;
      }
      return current + 1;
    });
  }, [isAutomatedDemo]);

  const completePresentation = useCallback(() => {
    setPresentationPhase("complete");
  }, []);

  const restartScenes = useCallback(() => {
    setSceneIndex(0);
    setNotificationRevealed(false);
    setEnsuTypeRequest(null);
    ensuTypeResolveRef.current = null;
    setPresentationPhase(isAutomatedDemo ? "intro" : "running");
    setPlayback(isAutomatedDemo ? "paused" : "playing");
  }, [isAutomatedDemo]);

  const revealNotification = useCallback(() => {
    setNotificationRevealed(true);
  }, []);

  const play = useCallback(() => {
    setPlayback((current) => (current === "ended" ? "ended" : "playing"));
  }, []);

  const pause = useCallback(() => {
    setPlayback((current) => (current === "ended" ? "ended" : "paused"));
  }, []);

  const togglePlayback = useCallback(() => {
    setPlayback((current) => {
      if (current === "ended") {
        return "ended";
      }
      return current === "playing" ? "paused" : "playing";
    });
  }, []);

  const beginEnsuType = useCallback((text: string, charMs = 42) => {
    return new Promise<void>((resolve) => {
      ensuTypeResolveRef.current = resolve;
      setEnsuTypeRequest({ text, charMs });
    });
  }, []);

  const completeEnsuType = useCallback(() => {
    ensuTypeResolveRef.current?.();
    ensuTypeResolveRef.current = null;
    setEnsuTypeRequest(null);
  }, []);

  const registerRestartHandler = useCallback((handler: (() => void) | null) => {
    restartHandlerRef.current = handler;
  }, []);

  const requestRestart = useCallback(() => {
    restartHandlerRef.current?.();
  }, []);

  useEffect(() => {
    if (!isAutomatedDemo || presentationPhase !== "intro") {
      return;
    }

    const startTimer = window.setTimeout(() => {
      setPresentationPhase("running");
      setPlayback("playing");
    }, DEMO_INTRO_FADE_MS + DEMO_INTRO_HOLD_MS);

    return () => window.clearTimeout(startTimer);
  }, [isAutomatedDemo, presentationPhase]);

  useEffect(() => {
    if (!isV2Demo) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        togglePlayback();
        return;
      }

      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        requestRestart();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isV2Demo, requestRestart, togglePlayback]);

  const value = useMemo(
    () => ({
      isV2Demo,
      isAutomatedDemo,
      notificationRevealed,
      presentationPhase,
      playback,
      sceneIndex,
      scene,
      totalScenes: DEMO_SCENES.length,
      ensuTypeRequest,
      play,
      pause,
      togglePlayback,
      advanceScene,
      completePresentation,
      restartScenes,
      revealNotification,
      beginEnsuType,
      completeEnsuType,
      registerRestartHandler,
    }),
    [
      advanceScene,
      beginEnsuType,
      completeEnsuType,
      completePresentation,
      ensuTypeRequest,
      isAutomatedDemo,
      isV2Demo,
      notificationRevealed,
      pause,
      play,
      playback,
      presentationPhase,
      registerRestartHandler,
      restartScenes,
      revealNotification,
      scene,
      sceneIndex,
      togglePlayback,
    ],
  );

  return <DemoGuideContext.Provider value={value}>{children}</DemoGuideContext.Provider>;
}

export function useDemoGuide() {
  const context = useContext(DemoGuideContext);
  if (!context) {
    throw new Error("useDemoGuide must be used within DemoGuideProvider");
  }
  return context;
}

export function useDemoGuideOptional() {
  return useContext(DemoGuideContext);
}
