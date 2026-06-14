import { MALAYSIA_ALBUM_PHOTO_IDS, photoThumbUrl } from "./mockHomeGallery";
import type { PrototypeVersion } from "../routes/paths";

export type ItineraryStop = {
  id: string;
  /** 1-based trip day number. */
  day: number;
  location: string;
  tagline: string;
  /** Indices into MALAYSIA_ALBUM_PHOTO_IDS — photos for this stop's carousel. */
  photoIndices: number[];
  mustTry: string[];
  /** Distance-related context derivable from coordinates — typically 1-3 per stop. */
  insights: string[];
  additionalInfo?: string;
};

export type TripGroup = "solo" | "friends" | "family";

export type TripContext = {
  group: TripGroup;
};

export type Itinerary = {
  destination: string;
  countryCode: string;
  travelerCount: number;
  tripContext: TripContext;
  stops: ItineraryStop[];
};

export function itineraryCountryName(itinerary: Itinerary): string {
  const parts = itinerary.destination.split(",").map((part) => part.trim());
  return parts[parts.length - 1] ?? itinerary.destination;
}

export function itineraryPlaceName(itinerary: Itinerary): string {
  return itinerary.destination.split(",")[0]?.trim() ?? itinerary.destination;
}

export function itineraryStopDayLabel(day: number): string {
  return `Day ${day}`;
}

export function itineraryDateRange(itinerary: Itinerary): string {
  const count = itinerary.stops.length;
  if (count === 0) {
    return "";
  }
  return count === 1 ? "1 day" : `${count} days`;
}

export function itineraryTravelerLabel(count: number): string {
  return count === 1 ? "1 traveler" : `${count} travelers`;
}

export function itineraryTripGroupLabel(group: TripGroup): string {
  switch (group) {
    case "solo":
      return "Solo trip";
    case "friends":
      return "Friends trip";
    case "family":
      return "Family trip";
  }
}

export function itineraryShareTitle(itinerary: Itinerary): string {
  const range = itineraryDateRange(itinerary);
  const group = itineraryTripGroupLabel(itinerary.tripContext.group);
  return `${itinerary.destination} · ${range} · ${group}`;
}

export function itineraryPhotoCount(itinerary: Itinerary): number {
  return itinerary.stops.reduce((total, stop) => total + stop.photoIndices.length, 0);
}

export function itineraryShareJourneySlug(itinerary: Itinerary): string {
  const slug = itineraryPlaceName(itinerary)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "trip"}-demo`;
}


export function itineraryShareJourneyUrl(
  itinerary: Itinerary,
  version: PrototypeVersion = "v1",
): string {
  const journeySlug = itineraryShareJourneySlug(itinerary);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://ente.io";
  return `${origin}/${version}/journey/${journeySlug}`;
}

export type ItineraryHighlightField = "tagline" | "location" | "mustTry" | "additionalInfo";

export type ItineraryHighlightKind = "apply" | "locate";

export type ItineraryHighlight = {
  stopId: string;
  field: ItineraryHighlightField;
  message: string;
  previousValue?: string;
  nextValue?: string;
  /** apply = full text-change reveal; locate = scroll + shimmer on current value */
  kind?: ItineraryHighlightKind;
  /** Bumps on each edit so animations can replay for successive changes. */
  revision?: number;
};

export type ItineraryChangeRef = {
  stopId: string;
  field: ItineraryHighlightField;
  label: string;
  previousValue?: string;
  nextValue?: string;
};

export function isItineraryChangeValid(itinerary: Itinerary, change: ItineraryChangeRef): boolean {
  const stop = itinerary.stops.find((item) => item.id === change.stopId);
  if (!stop) {
    return false;
  }

  if (change.field === "additionalInfo") {
    return Boolean(stop.additionalInfo);
  }

  if (change.field === "mustTry") {
    return stop.mustTry.length > 0;
  }

  return true;
}

export function itineraryChangeRefFromHighlight(
  itinerary: Itinerary,
  highlight: ItineraryHighlight,
): ItineraryChangeRef {
  const stop = itinerary.stops.find((item) => item.id === highlight.stopId);
  return {
    stopId: highlight.stopId,
    field: highlight.field,
    label: stop?.location ?? "this stop",
    previousValue: highlight.previousValue,
    nextValue: highlight.nextValue,
  };
}

export function itineraryHighlightFromChangeRef(change: ItineraryChangeRef): ItineraryHighlight {
  ensuLocateRevision += 1;
  return {
    stopId: change.stopId,
    field: change.field,
    message: "",
    kind: "locate",
    revision: ensuLocateRevision,
  };
}

export type EnsuReply = {
  itinerary: Itinerary;
  highlight: ItineraryHighlight | null;
  reply: string;
};

export function stopPhotoUrl(photoIndex: number, width = 640) {
  return photoThumbUrl(photoIndex, width);
}

export type ItineraryStorySlideKind = "intro" | "stop" | "outro";

export type ItineraryStorySlide = {
  id: string;
  kind: ItineraryStorySlideKind;
  imageUrl: string;
  location: string;
  tagline: string;
  dayLabel: string;
};

export function demoItineraryStorySlides(): ItineraryStorySlide[] {
  return itineraryStorySlides(demoItinerary);
}

export function itineraryStorySlides(itinerary: Itinerary): ItineraryStorySlide[] {
  const firstPhoto = itinerary.stops[0]?.photoIndices[0] ?? 0;
  const lastStop = itinerary.stops[itinerary.stops.length - 1];
  const lastPhoto = lastStop?.photoIndices[0] ?? firstPhoto;

  const stopSlides: ItineraryStorySlide[] = itinerary.stops.map((stop) => ({
    id: stop.id,
    kind: "stop",
    imageUrl: stopPhotoUrl(stop.photoIndices[0], 900),
    location: stop.location,
    tagline: stop.tagline,
    dayLabel: itineraryStopDayLabel(stop.day),
  }));

  return [
    {
      id: "story-intro",
      kind: "intro",
      imageUrl: stopPhotoUrl(firstPhoto, 900),
      dayLabel: "",
      location: "My 5 day trip to",
      tagline: "Kuala Lumpur",
    },
    ...stopSlides,
    {
      id: "story-outro",
      kind: "outro",
      imageUrl: stopPhotoUrl(lastPhoto, 900),
      dayLabel: "",
      location: "Share this journey",
      tagline: "",
    },
  ];
}

export function nextAvailableStopPhotoIndex(current: number[]) {
  for (let i = 0; i < MALAYSIA_ALBUM_PHOTO_IDS.length; i += 1) {
    if (!current.includes(i)) {
      return i;
    }
  }
  return (current[0] + 1) % MALAYSIA_ALBUM_PHOTO_IDS.length;
}

export const demoItinerary: Itinerary = {
  destination: "Kuala Lumpur, Malaysia",
  countryCode: "MY",
  travelerCount: 4,
  tripContext: {
    group: "friends",
  },
  stops: [
    {
      id: "klcc",
      day: 1,
      location: "KLCC & Petronas",
      tagline: "Twin towers at golden hour",
      photoIndices: [51, 52, 55, 56],
      mustTry: ["Skybridge visit", "KLCC Park fountain show", "Suria mall food court"],
      insights: [
        "Petronas Towers, KLCC Park, and Aquaria are all within walking distance.",
      ],
      additionalInfo: "Book tower tickets early — afternoon slots sell out fast on weekends.",
    },
    {
      id: "batu-caves",
      day: 2,
      location: "Batu Caves",
      tagline: "Rainbow stairs & temple caves",
      photoIndices: [44, 45, 44, 45],
      mustTry: ["Main cave climb", "Dark Cave tour", "Murugan statue photo stop"],
      insights: [
        "About 13 km north of central Kuala Lumpur.",
        "Roughly 25 minutes from the city center by car or KTM Komuter.",
      ],
      additionalInfo: "Wear comfortable shoes. The 272 steps are worth it for the views at the top.",
    },
    {
      id: "chinatown",
      day: 3,
      location: "Petaling Street",
      tagline: "Neon lanes & night markets",
      photoIndices: [46, 47, 48, 49],
      mustTry: ["Central Market batik", "Lantern-lit alleys", "Night market bargain hunt"],
      insights: ["Central Market is a 5-minute walk away."],
      additionalInfo: "Go hungry — the best street food picks up after 8 pm.",
    },
    {
      id: "bukit-bintang",
      day: 4,
      location: "Bukit Bintang",
      tagline: "City lights & rooftop views",
      photoIndices: [68, 69, 57, 58],
      mustTry: ["Pavilion shopping walk", "Rooftop bar sunset", "Jalan Bukit Bintang street art"],
      insights: ["Jalan Alor is about a 10-minute walk from here."],
    },
    {
      id: "merdeka",
      day: 5,
      location: "Merdeka Square",
      tagline: "Heritage heart of KL",
      photoIndices: [28, 29, 30, 31],
      mustTry: ["Sultan Abdul Samad Building", "River of Life night walk", "Little India brunch"],
      insights: ["About a 10-minute walk from Petaling Street."],
      additionalInfo: "Your Petronas night shot from this trip is the perfect cover for the album recap.",
    },
    {
      id: "food-spots",
      day: 6,
      location: "Jalan Alor & Hawker Stalls",
      tagline: "Nasi lemak, satay & late-night eats",
      photoIndices: [3, 4, 5, 6],
      mustTry: ["Char kuey teow", "Satay with peanut sauce", "Cendol for dessert"],
      insights: ["Just a 10-minute walk from Bukit Bintang."],
      additionalInfo: "Most stalls open after sunset — follow the smoke and the crowds.",
    },
  ],
};

let ensuHighlightRevision = 0;
let ensuLocateRevision = 0;

function withRevision(highlight: Omit<ItineraryHighlight, "revision">): ItineraryHighlight {
  ensuHighlightRevision += 1;
  return { ...highlight, kind: highlight.kind ?? "apply", revision: ensuHighlightRevision };
}

function findStop(itinerary: Itinerary, text: string): ItineraryStop | undefined {
  const lower = text.toLowerCase();

  const byIdOrFullLocation = itinerary.stops.find(
    (stop) => lower.includes(stop.location.toLowerCase()) || lower.includes(stop.id),
  );
  if (byIdOrFullLocation) {
    return byIdOrFullLocation;
  }

  return itinerary.stops.find((stop) =>
    stop.location
      .toLowerCase()
      .split(/[&,]/)
      .some((part) => {
        const trimmed = part.trim();
        return trimmed.length > 3 && lower.includes(trimmed);
      }),
  );
}

function stopPatchChanged(stop: ItineraryStop, patch: Partial<ItineraryStop>): boolean {
  if (patch.tagline !== undefined && patch.tagline !== stop.tagline) {
    return true;
  }
  if (patch.location !== undefined && patch.location !== stop.location) {
    return true;
  }
  if (patch.additionalInfo !== undefined && patch.additionalInfo !== stop.additionalInfo) {
    return true;
  }
  if (
    patch.mustTry !== undefined &&
    JSON.stringify(patch.mustTry) !== JSON.stringify(stop.mustTry)
  ) {
    return true;
  }
  return false;
}

function updateStop(
  itinerary: Itinerary,
  stopId: string,
  patch: Partial<ItineraryStop>,
  highlight: Omit<ItineraryHighlight, "stopId">,
): EnsuReply {
  const index = itinerary.stops.findIndex((stop) => stop.id === stopId);
  const stop = itinerary.stops[index];
  if (!stop) {
    return {
      itinerary,
      highlight: null,
      reply: "I couldn't find that stop in the journey.",
    };
  }

  if (!stopPatchChanged(stop, patch)) {
    return {
      itinerary,
      highlight: null,
      reply: `That is already set on ${stop.location}. Try a different edit.`,
    };
  }

  const next = cloneItinerary(itinerary);
  next.stops[index] = { ...stop, ...patch };

  return {
    itinerary: next,
    highlight: withRevision({ stopId, ...highlight }),
    reply: highlight.message,
  };
}

/** Exact demo prompts — type these verbatim during the prototype walkthrough. */
const DEMO_PROMPT_EDITS: Record<
  string,
  (itinerary: Itinerary) => EnsuReply
> = {
  "change the batu caves tagline to golden light on the rainbow steps": (itinerary) => {
    const stop = itinerary.stops.find((item) => item.id === "batu-caves");
    const nextTagline = "Golden light on the rainbow steps";
    return updateStop(itinerary, "batu-caves", { tagline: nextTagline }, {
      field: "tagline",
      message: `Done — Batu Caves now highlights the evening light on the stairs.`,
      previousValue: stop?.tagline,
      nextValue: nextTagline,
    });
  },
  "add roti canai to must try at jalan alor": (itinerary) => {
    const stop = itinerary.stops.find((item) => item.id === "food-spots");
    const item = "Roti canai with dhal";
    if (stop?.mustTry.includes(item)) {
      return {
        itinerary,
        highlight: null,
        reply: `"${item}" is already on the must try list for Jalan Alor.`,
      };
    }
    const mustTry = stop ? [...stop.mustTry, item] : [item];
    return updateStop(itinerary, "food-spots", { mustTry }, {
      field: "mustTry",
      message: `Added "${item}" to the Jalan Alor food stop.`,
      nextValue: item,
    });
  },
  "rename petaling street to chinatown market": (itinerary) => {
    const stop = itinerary.stops.find((item) => item.id === "chinatown");
    const nextName = "Chinatown Market";
    return updateStop(itinerary, "chinatown", { location: nextName }, {
      field: "location",
      message: `Renamed the stop to ${nextName}.`,
      previousValue: stop?.location,
      nextValue: nextName,
    });
  },
  "add a tip for klcc and petronas": (itinerary) => {
    const stop = itinerary.stops.find((item) => item.id === "klcc");
    const note =
      "Book skybridge tickets online — morning slots have the shortest queues.";
    return updateStop(itinerary, "klcc", { additionalInfo: note }, {
      field: "additionalInfo",
      message: `Added a booking tip for KLCC & Petronas.`,
      previousValue: stop?.additionalInfo,
      nextValue: note,
    });
  },
  "change the merdeka square tagline to colonial square at blue hour": (itinerary) => {
    const stop = itinerary.stops.find((item) => item.id === "merdeka");
    const nextTagline = "Colonial square at blue hour";
    return updateStop(itinerary, "merdeka", { tagline: nextTagline }, {
      field: "tagline",
      message: `Updated Merdeka Square for that heritage evening mood.`,
      previousValue: stop?.tagline,
      nextValue: nextTagline,
    });
  },
  "add durian ice cream to must try at jalan alor": (itinerary) => {
    const stop = itinerary.stops.find((item) => item.id === "food-spots");
    const item = "Durian ice cream";
    if (stop?.mustTry.includes(item)) {
      return {
        itinerary,
        highlight: null,
        reply: `"${item}" is already on the must try list for Jalan Alor.`,
      };
    }
    const mustTry = stop ? [...stop.mustTry, item] : [item];
    return updateStop(itinerary, "food-spots", { mustTry }, {
      field: "mustTry",
      message: `Added "${item}" — a fun extra for the food crawl.`,
      nextValue: item,
    });
  },
};

function normalizeDemoPrompt(message: string) {
  return message
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ");
}

function cloneItinerary(itinerary: Itinerary): Itinerary {
  return {
    ...itinerary,
    stops: itinerary.stops.map((stop) => ({
      ...stop,
      mustTry: [...stop.mustTry],
      photoIndices: stop.photoIndices,
    })),
  };
}

export function applyEnsuMessage(itinerary: Itinerary, message: string): EnsuReply {
  const text = message.trim();
  const lower = text.toLowerCase();
  const demoEdit = DEMO_PROMPT_EDITS[normalizeDemoPrompt(text)];
  if (demoEdit) {
    return demoEdit(itinerary);
  }

  const next = cloneItinerary(itinerary);

  const taglineMatch = text.match(/tagline\s+(?:for\s+.+?\s+)?to\s+["']?(.+?)["']?$/i);
  if (taglineMatch || (lower.includes("tagline") && lower.includes("to"))) {
    const stop = findStop(next, text) ?? next.stops[0];
    const previousTagline = stop.tagline;
    const newTagline = taglineMatch?.[1]?.trim() ?? "Misty mornings, endless green";
    if (previousTagline === newTagline) {
      return {
        itinerary,
        highlight: null,
        reply: `${stop.location} already uses that tagline.`,
      };
    }
    const index = next.stops.findIndex((s) => s.id === stop.id);
    next.stops[index] = { ...stop, tagline: newTagline };
    return {
      itinerary: next,
      highlight: withRevision({
        stopId: stop.id,
        field: "tagline",
        message: `Updated tagline on ${stop.location}`,
        previousValue: previousTagline,
        nextValue: newTagline,
      }),
      reply: `Done. I refreshed the tagline for ${stop.location}.`,
    };
  }

  if (lower.includes("add") && (lower.includes("must try") || lower.includes("must-try"))) {
    const stop = findStop(next, text) ?? next.stops[next.stops.length - 1];
    const itemMatch = text.match(/add\s+(.+?)\s+to\s+must/i);
    const item = itemMatch?.[1]?.replace(/in\s+\w+$/i, "").trim() ?? "Local filter coffee";
    const index = next.stops.findIndex((s) => s.id === stop.id);
    if (stop.mustTry.includes(item)) {
      return {
        itinerary,
        highlight: null,
        reply: `"${item}" is already on the must try list for ${stop.location}.`,
      };
    }
    next.stops[index] = { ...stop, mustTry: [...stop.mustTry, item] };
    return {
      itinerary: next,
      highlight: withRevision({
        stopId: stop.id,
        field: "mustTry",
        message: `Added to must try in ${stop.location}`,
        previousValue: stop.mustTry.join(", "),
        nextValue: item,
      }),
      reply: `Added "${item}" to must try in ${stop.location}.`,
    };
  }

  if (lower.includes("rename") || (lower.includes("change") && lower.includes("location"))) {
    const stop = findStop(next, text) ?? next.stops[2];
    const previousName = stop.location;
    const nameMatch = text.match(/to\s+([A-Za-z\s]+)$/i);
    const newName = nameMatch?.[1]?.trim() ?? stop.location;
    if (previousName === newName) {
      return {
        itinerary,
        highlight: null,
        reply: `${stop.location} already uses that name.`,
      };
    }
    const index = next.stops.findIndex((s) => s.id === stop.id);
    next.stops[index] = { ...stop, location: newName };
    return {
      itinerary: next,
      highlight: withRevision({
        stopId: stop.id,
        field: "location",
        message: `Renamed stop to ${newName}`,
        previousValue: previousName,
        nextValue: newName,
      }),
      reply: `Updated the location name to ${newName}.`,
    };
  }

  if (lower.includes("note") || lower.includes("tip") || lower.includes("additional")) {
    const stop = findStop(next, text) ?? next.stops[0];
    const previousNote = stop.additionalInfo ?? "";
    const noteByStop: Record<string, string> = {
      "klcc": "Book skybridge tickets online — morning slots have the shortest queues.",
      "batu-caves": "Wear modest clothing for the temple — scarves are available at the entrance.",
      "food-spots": "Bring cash; most hawker stalls don't take cards.",
    };
    const note = noteByStop[stop.id] ?? "Best visited early morning before the crowds arrive.";
    if (previousNote === note) {
      return {
        itinerary,
        highlight: null,
        reply: `That note is already on ${stop.location}.`,
      };
    }
    const index = next.stops.findIndex((s) => s.id === stop.id);
    next.stops[index] = { ...stop, additionalInfo: note };
    return {
      itinerary: next,
      highlight: withRevision({
        stopId: stop.id,
        field: "additionalInfo",
        message: `Added a note for ${stop.location}`,
        previousValue: previousNote,
        nextValue: note,
      }),
      reply: `I added a travel note for ${stop.location}.`,
    };
  }

  const stop = findStop(next, text) ?? next.stops[1];
  const previousTagline = stop.tagline;
  const newTagline =
    text.length > 24
      ? `${text.slice(0, 48).trim()}…`
      : text.trim().length > 0
        ? text.trim()
        : "Slow lanes & spice air";
  if (previousTagline === newTagline) {
    return {
      itinerary,
      highlight: null,
      reply: `That tagline is already set for ${stop.location}. Try a different wording.`,
    };
  }
  const index = next.stops.findIndex((s) => s.id === stop.id);
  next.stops[index] = {
    ...stop,
    tagline: newTagline,
  };
  return {
    itinerary: next,
    highlight: withRevision({
      stopId: stop.id,
      field: "tagline",
      message: `Polished ${stop.location}`,
      previousValue: previousTagline,
      nextValue: newTagline,
    }),
    reply: `I tuned the ${stop.location} section to feel warmer and more shareable.`,
  };
}
