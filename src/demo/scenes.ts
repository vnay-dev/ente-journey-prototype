/** EnsuFieldReveal: sweep + fade + reveal */
export const ENSU_HIGHLIGHT_MS = 7600;

/** EnsuShimmer pulse when locating an existing change */
export const ENSU_LOCATE_HIGHLIGHT_MS = 3900;

export const ENSU_DEMO_PROMPT =
  "Change the Batu Caves tagline to golden light on the rainbow steps";

/** Intro + 6 stops + outro at 2200ms each */
export const STORY_WATCH_MS = 18000;

export const DEMO_ITINERARY_STOP_CARDS = [
  "#stop-klcc",
  "#stop-batu-caves",
  "#stop-chinatown",
  "#stop-bukit-bintang",
  "#stop-merdeka",
  "#stop-food-spots",
] as const;

export const DEMO_ITINERARY_PREVIEW_CARDS = DEMO_ITINERARY_STOP_CARDS.slice(0, 3);

export type DemoAction =
  | { type: "wait"; ms: number }
  | { type: "wait-for"; selector: string; timeoutMs?: number; root?: DemoRoot }
  | { type: "tap"; selector: string; root?: DemoRoot }
  | { type: "tap-label"; label: string; root?: DemoRoot }
  | { type: "scroll"; selector: string; top: number; root?: DemoRoot }
  | { type: "scroll-end"; selector: string; root?: DemoRoot }
  | {
      type: "scroll-cards";
      container: string;
      cards: readonly string[];
      pauseMs?: number;
      root?: DemoRoot;
    }
  | { type: "ensu-type"; text: string; charMs?: number }
  | { type: "swipe"; selector: string; direction: "left" | "right"; root?: DemoRoot }
  | { type: "preview-advance"; selector: string; direction: "left" | "right"; root?: DemoRoot }
  | { type: "reveal-notification" }
  | { type: "share-preview-open" }
  | { type: "share-preview-close" };

export type DemoRoot = "shell" | "document";

export type DemoScene = {
  id: string;
  act: number;
  scene: number;
  title: string;
  annotation: string;
  /** Finger rests here when the scene begins (e.g. home gallery before nav tap). */
  fingerStartSelector?: string;
  targetSelector?: string;
  holdMs?: number;
  action?: DemoAction;
  actions?: DemoAction[];
};

export const DEMO_SCENES: DemoScene[] = [
  {
    id: "open-albums",
    act: 1,
    scene: 1,
    title: "Finding the trip",
    annotation: "Open Albums to find the KL trip.",
    fingerStartSelector: '[data-demo-target="home-photo"]',
    holdMs: 2400,
    action: { type: "tap", selector: 'button[aria-label="Albums"]' },
  },
  {
    id: "open-trip-album",
    act: 1,
    scene: 2,
    title: "Open the album",
    annotation: "Open the Trip to KL '26 album.",
    targetSelector: 'button[aria-label*="Trip to KL"]',
    holdMs: 3000,
    action: { type: "tap", selector: 'button[aria-label*="Trip to KL"]' },
  },
  {
    id: "wait-generation",
    act: 2,
    scene: 1,
    title: "Journey is brewing",
    annotation: "The journey is being processed in the background.",
    holdMs: 1000,
    action: {
      type: "wait-for",
      selector: '[data-demo-target="journey-banner"]',
      timeoutMs: 12000,
    },
  },
  {
    id: "journey-ready-banner",
    act: 2,
    scene: 2,
    title: "Journey is ready",
    annotation: "A ready banner appears on the album.",
    targetSelector: '[data-demo-target="journey-banner"]',
    holdMs: 3000,
    action: { type: "wait", ms: 0 },
  },
  {
    id: "notification-arrives",
    act: 2,
    scene: 3,
    title: "Notification arrives",
    annotation: "A notification slides in.",
    holdMs: 800,
    actions: [
      { type: "wait", ms: 2000 },
      { type: "reveal-notification" },
      {
        type: "wait-for",
        selector: '[data-demo-target="journey-notification"]',
        timeoutMs: 6000,
      },
      { type: "wait", ms: 900 },
    ],
  },
  {
    id: "open-from-notification",
    act: 2,
    scene: 4,
    title: "Open from notification",
    annotation: "Open the journey from the notification.",
    targetSelector: '[data-demo-target="journey-notification"]',
    holdMs: 1000,
    action: { type: "tap", selector: '[data-demo-target="journey-notification"]' },
  },
  {
    id: "explore-journey",
    act: 3,
    scene: 1,
    title: "Walk through KL",
    annotation: "Scroll through the first few stops, day by day.",
    holdMs: 2200,
    actions: [
      {
        type: "scroll-cards",
        container: '[data-demo-target="itinerary-scroll"]',
        cards: DEMO_ITINERARY_PREVIEW_CARDS,
        pauseMs: 1800,
      },
      {
        type: "scroll-cards",
        container: '[data-demo-target="itinerary-scroll"]',
        cards: ["#stop-klcc"],
        pauseMs: 600,
      },
    ],
  },
  {
    id: "open-photo",
    act: 3,
    scene: 2,
    title: "Relive a moment",
    annotation: "Tap a photo to open fullscreen preview.",
    targetSelector: '[data-demo-target="stop-photo"]',
    holdMs: 3000,
    action: { type: "tap", selector: '[data-demo-target="stop-photo"]' },
  },
  {
    id: "photo-preview",
    act: 3,
    scene: 3,
    title: "Fullscreen memories",
    annotation: "Swipe through photos in fullscreen preview.",
    targetSelector: '[data-demo-target="photo-preview-stage"]',
    holdMs: 2200,
    actions: [
      {
        type: "wait-for",
        selector: '[data-demo-target="photo-preview-stage"]',
        timeoutMs: 5000,
      },
      {
        type: "preview-advance",
        selector: '[data-demo-target="photo-preview-stage"]',
        direction: "left",
      },
      { type: "wait", ms: 500 },
      {
        type: "preview-advance",
        selector: '[data-demo-target="photo-preview-stage"]',
        direction: "left",
      },
      { type: "wait", ms: 600 },
    ],
  },
  {
    id: "close-photo",
    act: 3,
    scene: 4,
    title: "Back to the journey",
    annotation: "Return to the journey view.",
    targetSelector: 'button[aria-label="Close preview"]',
    holdMs: 2600,
    action: { type: "tap", selector: 'button[aria-label="Close preview"]' },
  },
  {
    id: "edit-ensu",
    act: 4,
    scene: 1,
    title: "Edit with Ensu",
    annotation: "Edit the Batu Caves tagline with Ensu.",
    targetSelector: 'button[aria-label="Edit journey"]',
    holdMs: 3200,
    action: { type: "tap", selector: 'button[aria-label="Edit journey"]' },
  },
  {
    id: "ensu-type",
    act: 4,
    scene: 2,
    title: "Describe the change",
    annotation: "Describe the change in natural language.",
    targetSelector: '[data-demo-target="ensu-input"]',
    holdMs: 1200,
    action: {
      type: "ensu-type",
      text: ENSU_DEMO_PROMPT,
      charMs: 48,
    },
  },
  {
    id: "ensu-send",
    act: 4,
    scene: 3,
    title: "Send to Ensu",
    annotation: "Send the edit request to Ensu.",
    targetSelector: '[data-demo-target="ensu-send"]',
    holdMs: 2200,
    action: { type: "tap", selector: '[data-demo-target="ensu-send"]' },
  },
  {
    id: "ensu-update",
    act: 4,
    scene: 4,
    title: "Update on journey",
    annotation: "The sheet closes and the journey scrolls to the update.",
    targetSelector: '[data-demo-target="ensu-highlight-active"]',
    holdMs: 2400,
    actions: [
      {
        type: "wait-for",
        selector: '[data-demo-target="ensu-highlight-active"]',
        timeoutMs: 10000,
      },
      { type: "wait", ms: ENSU_HIGHLIGHT_MS },
    ],
  },
  {
    id: "ensu-reopen",
    act: 4,
    scene: 5,
    title: "Reopen Ensu",
    annotation: "Reopen Ensu to review the edit.",
    targetSelector: 'button[aria-label="Edit journey"]',
    holdMs: 2800,
    action: { type: "tap", selector: 'button[aria-label="Edit journey"]' },
  },
  {
    id: "ensu-reply",
    act: 4,
    scene: 6,
    title: "Ensu responds",
    annotation: "Ensu confirms the update with a View changes link.",
    holdMs: 2800,
    actions: [
      {
        type: "wait-for",
        selector: '[data-demo-target="ensu-view-changes"]',
        timeoutMs: 8000,
      },
      { type: "wait", ms: 1200 },
    ],
  },
  {
    id: "ensu-view-changes",
    act: 4,
    scene: 7,
    title: "View changes",
    annotation: "Tap View changes to jump to the highlighted update.",
    targetSelector: '[data-demo-target="ensu-view-changes"]',
    holdMs: 2800,
    action: { type: "tap", selector: '[data-demo-target="ensu-view-changes"]' },
  },
  {
    id: "ensu-highlight-again",
    act: 4,
    scene: 8,
    title: "See the highlight",
    annotation: "The updated tagline is highlighted on Batu Caves.",
    targetSelector: '[data-demo-target="ensu-highlight-active"]',
    holdMs: 2400,
    actions: [
      {
        type: "wait-for",
        selector: '[data-demo-target="ensu-highlight-active"]',
        timeoutMs: 8000,
      },
      { type: "wait", ms: ENSU_LOCATE_HIGHLIGHT_MS },
    ],
  },
  {
    id: "add-photo-open",
    act: 5,
    scene: 1,
    title: "Add a photo",
    annotation: "Add a missing photo to the journey.",
    targetSelector: 'button[aria-label="Add photo"]',
    holdMs: 3000,
    action: { type: "tap", selector: 'button[aria-label="Add photo"]' },
  },
  {
    id: "add-photo-pick",
    act: 5,
    scene: 2,
    title: "Select photos",
    annotation: "Select a few photos to add.",
    targetSelector: 'button[aria-label="Photo 1"]',
    holdMs: 2600,
    actions: [
      { type: "tap", selector: 'button[aria-label="Photo 1"]' },
      { type: "wait", ms: 350 },
      { type: "tap", selector: 'button[aria-label="Photo 2"]' },
      { type: "wait", ms: 350 },
      { type: "tap", selector: 'button[aria-label="Photo 3"]' },
      { type: "wait", ms: 350 },
      { type: "tap", selector: 'button[aria-label="Photo 4"]' },
      { type: "wait", ms: 600 },
      { type: "tap-label", label: "Done" },
      { type: "wait", ms: 900 },
    ],
  },
  {
    id: "add-photo-place",
    act: 5,
    scene: 3,
    title: "Choose a place",
    annotation: "Assign photos to a stop.",
    targetSelector: '[data-demo-target="add-photo-place"]',
    holdMs: 2800,
    action: { type: "tap", selector: '[data-demo-target="add-photo-place"]' },
  },
  {
    id: "add-photo-success",
    act: 5,
    scene: 4,
    title: "Photo added",
    annotation: "The photos are added to that stop.",
    targetSelector: '[data-demo-target="add-photo-success"]',
    holdMs: 3200,
    action: { type: "wait", ms: 2400 },
  },
  {
    id: "add-photo-done",
    act: 5,
    scene: 5,
    title: "Back to journey",
    annotation: "Return to the journey view.",
    targetSelector: 'button[aria-label="Back to journey"]',
    holdMs: 2600,
    action: { type: "tap-label", label: "Back to journey" },
  },
  {
    id: "play-story",
    act: 6,
    scene: 1,
    title: "Play the story",
    annotation: "Play the journey as a story.",
    targetSelector: 'button[aria-label="Play journey"]',
    holdMs: 3200,
    action: { type: "tap", selector: 'button[aria-label="Play journey"]' },
  },
  {
    id: "story-watch",
    act: 6,
    scene: 2,
    title: "Story mode",
    annotation: "Story mode steps through every stop.",
    holdMs: 3600,
    action: { type: "wait", ms: STORY_WATCH_MS },
  },
  {
    id: "story-close",
    act: 6,
    scene: 3,
    title: "Back to itinerary",
    annotation: "Close story mode and return.",
    targetSelector: '[data-demo-target="story-close"]',
    holdMs: 2600,
    action: { type: "tap", selector: '[data-demo-target="story-close"]' },
  },
  {
    id: "share-open",
    act: 6,
    scene: 4,
    title: "Share the journey",
    annotation: "Share your journey with someone.",
    targetSelector: 'button[aria-label="Share journey"]',
    holdMs: 3000,
    action: { type: "tap", selector: 'button[aria-label="Share journey"]' },
  },
  {
    id: "share-copy",
    act: 6,
    scene: 5,
    title: "Copy the link",
    annotation: "Copy your journey link.",
    targetSelector: '[data-demo-target="share-copy"]',
    holdMs: 3200,
    actions: [
      {
        type: "wait-for",
        selector: '[data-demo-target="share-sheet"]',
        timeoutMs: 5000,
      },
      { type: "tap", selector: '[data-demo-target="share-copy"]' },
      { type: "wait", ms: 1200 },
    ],
  },
  {
    id: "share-preview",
    act: 6,
    scene: 6,
    title: "Recipient opens the link",
    annotation:
      "On the right, a friend opens your link in their browser and scrolls through the trip.",
    holdMs: 5200,
    actions: [{ type: "wait", ms: 4800 }],
  },
  {
    id: "finale",
    act: 6,
    scene: 7,
    title: "That's the journey",
    annotation: "A trip album becomes a shareable journey anyone can open.",
    holdMs: 4800,
    action: { type: "wait", ms: 1400 },
  },
];
