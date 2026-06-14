import { scrollElementIntoContainer } from "../utils/scrollElementIntoContainer";

export type TargetRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = window.setTimeout(() => resolve(), ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

const FINGER_SIZE = 28;

/** Matches DemoFingerTap.module.css glide transition duration. */
export const FINGER_GLIDE_MS = 1100;

type FingerCandidate = {
  x: number;
  y: number;
  score: number;
};

function shellPoint(shell: HTMLElement, element: HTMLElement, offsetX: number, offsetY: number) {
  const shellRect = shell.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - shellRect.left + offsetX,
    y: rect.top - shellRect.top + offsetY,
  };
}

function viewportPoint(shell: HTMLElement, shellX: number, shellY: number) {
  const shellRect = shell.getBoundingClientRect();
  return {
    x: shellRect.left + shellX,
    y: shellRect.top + shellY,
  };
}

/**
 * Keep the finger on the target, but prefer padding and low-content corners
 * so titles, body copy, and photos stay readable.
 */
export function measureFingerHint(shell: HTMLElement, element: HTMLElement): TargetRect {
  const shellRect = shell.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const inset = FINGER_SIZE / 2 + 3;

  const isCompact = width <= 56 && height <= 56;
  const isWide = width >= 110 && width > height * 1.35;
  const isComposer = height >= 40 && width >= 140 && height <= 72;

  const candidates: FingerCandidate[] = [];

  if (isCompact) {
    candidates.push({ ...shellPoint(shell, element, width / 2, height / 2), score: 30 });
  }

  if (isWide) {
    candidates.push(
      { ...shellPoint(shell, element, width - inset, inset + 2), score: 26 },
      { ...shellPoint(shell, element, inset + 10, inset + 8), score: 22 },
      { ...shellPoint(shell, element, width - inset, height - inset), score: 18 },
      { ...shellPoint(shell, element, inset + 10, height - inset), score: 16 },
    );
  }

  if (isComposer) {
    candidates.push(
      { ...shellPoint(shell, element, width - inset, height - inset), score: 24 },
      { ...shellPoint(shell, element, width - inset, height / 2), score: 18 },
    );
  }

  if (!isCompact && !isWide && !isComposer) {
    candidates.push(
      { ...shellPoint(shell, element, width - inset, height / 2), score: 16 },
      { ...shellPoint(shell, element, inset + 2, height / 2), score: 14 },
      { ...shellPoint(shell, element, width / 2, height - inset), score: 12 },
      { ...shellPoint(shell, element, width / 2, inset + 2), score: 10 },
    );
  }

  candidates.push({ ...shellPoint(shell, element, width / 2, height / 2), score: 1 });

  function insideTarget(x: number, y: number) {
    const relLeft = rect.left - shellRect.left;
    const relTop = rect.top - shellRect.top;
    return (
      x - inset >= relLeft &&
      x + inset <= relLeft + width &&
      y - inset >= relTop &&
      y + inset <= relTop + height
    );
  }

  const picked =
    [...candidates]
      .filter((candidate) => insideTarget(candidate.x, candidate.y))
      .sort((a, b) => b.score - a.score)[0] ??
    shellPoint(shell, element, width / 2, height / 2);

  return {
    x: picked.x,
    y: picked.y,
    width,
    height,
  };
}

export function tapElementAt(shell: HTMLElement, element: HTMLElement, hint: TargetRect) {
  const point = viewportPoint(shell, hint.x, hint.y);
  const eventInit: PointerEventInit & MouseEventInit = {
    bubbles: true,
    cancelable: true,
    clientX: point.x,
    clientY: point.y,
    view: window,
  };

  element.dispatchEvent(
    new PointerEvent("pointerdown", {
      ...eventInit,
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
    }),
  );
  element.dispatchEvent(
    new PointerEvent("pointerup", {
      ...eventInit,
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
    }),
  );
  element.dispatchEvent(new MouseEvent("click", eventInit));
}

/** @deprecated Use measureFingerHint for display positioning. */
export function measureTarget(shell: HTMLElement, element: HTMLElement): TargetRect {
  return measureFingerHint(shell, element);
}

export function queryInRoot(root: ParentNode, selector: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(selector);
}

export async function waitForElement(
  root: ParentNode,
  selector: string,
  timeoutMs = 15000,
  signal?: AbortSignal,
): Promise<HTMLElement> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const element = queryInRoot(root, selector);
    if (element) {
      return element;
    }

    await delay(80, signal);
  }

  throw new Error(`Demo player timed out waiting for: ${selector}`);
}

export function findButtonByLabel(root: ParentNode, label: string): HTMLButtonElement | null {
  const buttons = root.querySelectorAll<HTMLButtonElement>("button");

  for (const button of buttons) {
    const text = button.textContent?.trim() ?? "";
    const aria = button.getAttribute("aria-label") ?? "";

    if (text === label || aria === label || text.startsWith(label)) {
      return button;
    }
  }

  return null;
}

export async function simulateScroll(
  root: ParentNode,
  selector: string,
  top: number,
  signal?: AbortSignal,
): Promise<void> {
  const element = await waitForElement(root, selector, 10000, signal);
  element.scrollTo({ top, behavior: "smooth" });
  await delay(1800, signal);
}

export async function simulateScrollCards(
  root: ParentNode,
  containerSelector: string,
  cardSelectors: string[],
  pauseMs = 1800,
  signal?: AbortSignal,
): Promise<void> {
  const container = await waitForElement(root, containerSelector, 10000, signal);

  for (const cardSelector of cardSelectors) {
    const card = await waitForElement(root, cardSelector, 10000, signal);
    scrollElementIntoContainer(container, card, { top: 56, bottom: 72 });
    await delay(900, signal);
    await delay(pauseMs, signal);
  }
}

function dispatchPointer(
  element: HTMLElement,
  type: string,
  clientX: number,
  clientY: number,
  pointerId: number,
) {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      pointerId,
      pointerType: "touch",
      isPrimary: true,
      buttons: type === "pointerup" ? 0 : 1,
    }),
  );
}

/** Matches ItineraryPhotoPreview SLIDE_MS + settle buffer */
export const PREVIEW_ADVANCE_MS = 380;

export async function simulatePreviewAdvance(
  root: ParentNode,
  selector: string,
  direction: "left" | "right",
  signal?: AbortSignal,
): Promise<void> {
  const element = await waitForElement(root, selector, 10000, signal);
  element.dispatchEvent(
    new CustomEvent("ente-demo-preview-advance", {
      bubbles: true,
      detail: { direction },
    }),
  );
  await delay(PREVIEW_ADVANCE_MS, signal);
}

export async function simulateSwipe(
  shell: HTMLElement,
  root: ParentNode,
  selector: string,
  direction: "left" | "right",
  signal?: AbortSignal,
  onFinger?: (rect: TargetRect | null, clicking?: boolean) => void,
): Promise<void> {
  const element = await waitForElement(root, selector, 10000, signal);
  const rect = element.getBoundingClientRect();
  const shellRect = shell.getBoundingClientRect();
  const inset = 36;
  const pointerY = rect.bottom - inset;
  const fingerY = pointerY - shellRect.top;
  const startX =
    direction === "left" ? rect.left + rect.width * 0.72 : rect.left + rect.width * 0.28;
  const endX =
    direction === "left" ? rect.left + rect.width * 0.22 : rect.left + rect.width * 0.78;
  const pointerId = 42;

  function fingerAt(clientX: number) {
    onFinger?.(
      {
        x: clientX - shellRect.left,
        y: fingerY,
        width: rect.width,
        height: rect.height,
      },
      true,
    );
  }

  fingerAt(startX);
  await delay(480, signal);
  dispatchPointer(element, "pointerdown", startX, pointerY, pointerId);

  const steps = 12;
  for (let step = 1; step <= steps; step += 1) {
    const clientX = startX + ((endX - startX) * step) / steps;
    dispatchPointer(element, "pointermove", clientX, pointerY, pointerId);
    fingerAt(clientX);
    await delay(28, signal);
  }

  dispatchPointer(element, "pointerup", endX, pointerY, pointerId);
  fingerAt(endX);
  await delay(480, signal);
}

export async function simulateScrollToEnd(
  root: ParentNode,
  selector: string,
  signal?: AbortSignal,
): Promise<void> {
  const element = await waitForElement(root, selector, 10000, signal);
  const top = Math.max(0, element.scrollHeight - element.clientHeight);
  element.scrollTo({ top, behavior: "smooth" });
  await delay(2600, signal);
}

export async function simulateTap(
  shell: HTMLElement,
  root: ParentNode,
  selector: string,
  signal?: AbortSignal,
  onFinger?: (rect: TargetRect | null, clicking?: boolean) => void,
): Promise<void> {
  const element = await waitForElement(root, selector, 15000, signal);
  const hint = measureFingerHint(shell, element);
  onFinger?.(hint, false);
  await delay(FINGER_GLIDE_MS, signal);
  onFinger?.(hint, true);
  await delay(320, signal);
  tapElementAt(shell, element, hint);
  onFinger?.(hint, false);
  await delay(280, signal);
}
