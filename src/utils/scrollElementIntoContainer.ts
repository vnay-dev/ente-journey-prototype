type ScrollPadding = {
  top: number;
  bottom: number;
};

/** Scroll so `element` is fully visible inside `container`, with optional padding. */
export function scrollElementIntoContainer(
  container: HTMLElement,
  element: HTMLElement,
  padding: ScrollPadding = { top: 88, bottom: 120 },
) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const elementTop = container.scrollTop + (elementRect.top - containerRect.top);
  const elementBottom = elementTop + elementRect.height;

  const viewTop = container.scrollTop + padding.top;
  const viewBottom = container.scrollTop + container.clientHeight - padding.bottom;

  let nextTop = container.scrollTop;

  if (elementTop < viewTop) {
    nextTop = elementTop - padding.top;
  } else if (elementBottom > viewBottom) {
    nextTop = elementBottom - container.clientHeight + padding.bottom;
  }

  container.scrollTo({
    top: Math.max(0, nextTop),
    behavior: "smooth",
  });
}
