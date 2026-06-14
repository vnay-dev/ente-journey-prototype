import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoGuide } from "../../../context/DemoGuideContext";
import { useItineraryGeneration } from "../../../context/ItineraryGenerationContext";
import { useSharePreview } from "../../../context/SharePreviewContext";
import type { DemoAction, DemoRoot, DemoScene } from "../../../demo/scenes";
import {
  delay,
  findButtonByLabel,
  measureFingerHint,
  queryInRoot,
  simulateScroll,
  simulateScrollCards,
  simulateScrollToEnd,
  simulatePreviewAdvance,
  simulateSwipe,
  simulateTap,
  tapElementAt,
  waitForElement,
  type TargetRect,
} from "../../../demo/player";
import { DemoFingerTap } from "./DemoFingerTap";
import styles from "./DemoOverlay.module.css";

function sceneActions(scene: DemoScene): DemoAction[] {
  if (scene.actions?.length) {
    return scene.actions;
  }
  if (scene.action) {
    return [scene.action];
  }
  return [{ type: "wait", ms: 1200 }];
}

function resolveRoot(shell: HTMLElement, root: DemoRoot = "shell"): ParentNode {
  return root === "document" ? document : shell;
}

type FingerPoint = {
  x: number;
  y: number;
};

type Props = {
  shellRef: React.RefObject<HTMLElement | null>;
};

export function DemoOverlay({ shellRef }: Props) {
  const navigate = useNavigate();
  const { dismissPreviewPrompt, previewOpen, openRecipientPreview } = useSharePreview();
  const { resetGeneration } = useItineraryGeneration();
  const {
    playback,
    presentationPhase,
    scene,
    sceneIndex,
    advanceScene,
    restartScenes,
    beginEnsuType,
    registerRestartHandler,
    revealNotification,
  } = useDemoGuide();

  const [fingerPos, setFingerPos] = useState<FingerPoint | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sceneActing, setSceneActing] = useState(false);
  const runIdRef = useRef(0);
  const playbackRef = useRef(playback);

  playbackRef.current = playback;

  const moveFingerToRect = useCallback((rect: TargetRect) => {
    setFingerPos({ x: rect.x, y: rect.y });
  }, []);

  const moveFingerToSelector = useCallback(
    (selector?: string, root: DemoRoot = "shell") => {
      const shell = shellRef.current;
      if (!shell || !selector) {
        return false;
      }
      const element = queryInRoot(resolveRoot(shell, root), selector);
      if (!element) {
        return false;
      }
      moveFingerToRect(measureFingerHint(shell, element));
      return true;
    },
    [moveFingerToRect, shellRef],
  );

  const handleRestart = useCallback(() => {
    runIdRef.current += 1;
    setFingerPos(null);
    setIsClicking(false);
    setIsDragging(false);
    setSceneActing(false);
    resetGeneration();
    dismissPreviewPrompt();
    restartScenes();
    navigate("/v2?demo=1");
  }, [dismissPreviewPrompt, navigate, resetGeneration, restartScenes]);

  useEffect(() => {
    registerRestartHandler(handleRestart);
    return () => registerRestartHandler(null);
  }, [handleRestart, registerRestartHandler]);

  useEffect(() => {
    if (!scene.fingerStartSelector || playback === "ended" || sceneActing) {
      return;
    }

    let alive = true;

    const tick = () => {
      if (!alive) {
        return;
      }
      moveFingerToSelector(scene.fingerStartSelector);
    };

    tick();
    const timer = window.setInterval(tick, 80);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [moveFingerToSelector, playback, scene.fingerStartSelector, scene.id, sceneActing]);

  useEffect(() => {
    if (!scene.targetSelector || playback === "ended") {
      return;
    }

    let alive = true;

    const tick = () => {
      if (!alive) {
        return;
      }
      moveFingerToSelector(scene.targetSelector);
    };

    tick();
    const timer = window.setInterval(tick, 80);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [moveFingerToSelector, playback, scene.id, scene.targetSelector]);

  useEffect(() => {
    if (playback !== "playing" || presentationPhase !== "running") {
      return;
    }

    setSceneActing(false);
    const abort = new AbortController();
    let cancelled = false;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    async function waitForShell(signal: AbortSignal): Promise<HTMLElement | null> {
      const start = Date.now();
      while (!cancelled && !signal.aborted) {
        const shell = shellRef.current;
        if (shell) {
          return shell;
        }
        if (Date.now() - start > 5000) {
          return null;
        }
        await delay(40, signal);
      }
      return null;
    }

    async function runTap(shell: HTMLElement, element: HTMLElement, signal: AbortSignal) {
      const hint = measureFingerHint(shell, element);
      moveFingerToRect(hint);
      setIsClicking(true);
      await delay(1000, signal);
      tapElementAt(shell, element, hint);
      await delay(450, signal);
      setIsClicking(false);
    }

    async function runAction(shell: HTMLElement, action: DemoAction) {
      if (cancelled || abort.signal.aborted) {
        return;
      }

      switch (action.type) {
        case "wait":
          await delay(action.ms, abort.signal);
          return;
        case "wait-for":
          await waitForElement(
            resolveRoot(shell, action.root ?? "shell"),
            action.selector,
            action.timeoutMs ?? 15000,
            abort.signal,
          );
          moveFingerToSelector(action.selector, action.root ?? "shell");
          return;
        case "tap":
          await simulateTap(
            shell,
            resolveRoot(shell, action.root ?? "shell"),
            action.selector,
            abort.signal,
            (rect, clicking) => {
              if (rect) {
                moveFingerToRect(rect);
              }
              setIsClicking(clicking ?? false);
            },
          );
          return;
        case "tap-label": {
          const rootNode = resolveRoot(shell, action.root ?? "shell");
          const button = findButtonByLabel(rootNode, action.label);
          if (!button) {
            throw new Error(`Demo player could not find button: ${action.label}`);
          }
          await runTap(shell, button, abort.signal);
          return;
        }
        case "scroll":
          await simulateScroll(
            resolveRoot(shell, action.root ?? "shell"),
            action.selector,
            action.top,
            abort.signal,
          );
          return;
        case "scroll-end":
          await simulateScrollToEnd(
            resolveRoot(shell, action.root ?? "shell"),
            action.selector,
            abort.signal,
          );
          return;
        case "scroll-cards":
          await simulateScrollCards(
            resolveRoot(shell, action.root ?? "shell"),
            action.container,
            [...action.cards],
            action.pauseMs ?? 2800,
            abort.signal,
          );
          return;
        case "ensu-type":
          await beginEnsuType(action.text, action.charMs ?? 42);
          return;
        case "preview-advance":
          await simulatePreviewAdvance(
            resolveRoot(shell, action.root ?? "shell"),
            action.selector,
            action.direction,
            abort.signal,
          );
          return;
        case "swipe":
          await simulateSwipe(
            shell,
            resolveRoot(shell, action.root ?? "shell"),
            action.selector,
            action.direction,
            abort.signal,
          );
          return;
        case "reveal-notification":
          revealNotification();
          return;
        case "share-preview-open":
          openRecipientPreview();
          return;
        case "share-preview-close":
          if (previewOpen) {
            dismissPreviewPrompt();
          }
          return;
        default:
          return;
      }
    }

    (async () => {
      try {
        const shell = await waitForShell(abort.signal);
        if (!shell || cancelled || abort.signal.aborted) {
          return;
        }

        await delay(scene.holdMs ?? 2800, abort.signal);

        setSceneActing(true);

        for (const action of sceneActions(scene)) {
          await runAction(shell, action);
        }

        if (!cancelled && runId === runIdRef.current && playbackRef.current === "playing") {
          advanceScene();
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Demo scene failed:", scene.id, error);
      }
    })();

    return () => {
      cancelled = true;
      abort.abort();
      setIsClicking(false);
      setIsDragging(false);
      setSceneActing(false);
    };
  }, [
    advanceScene,
    beginEnsuType,
    moveFingerToRect,
    moveFingerToSelector,
    playback,
    revealNotification,
    presentationPhase,
    scene.id,
    scene.holdMs,
    scene.action,
    scene.actions,
    sceneIndex,
    shellRef,
    dismissPreviewPrompt,
  ]);

  if (!fingerPos || previewOpen || presentationPhase !== "running") {
    return null;
  }

  return (
    <div className={styles.layer} aria-hidden>
      <DemoFingerTap
        x={fingerPos.x}
        y={fingerPos.y}
        clicking={isClicking}
        dragging={isDragging}
      />
    </div>
  );
}
