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

const GENERATION_MS = 6000;
const GENERATION_MS_DEMO = 2500;

export type ItineraryGenerationStatus = "idle" | "processing" | "ready";

export type ItineraryGenerationJob = {
  albumId: string;
  albumTitle: string;
  destination: string;
  status: ItineraryGenerationStatus;
  /** Notification shade only — albums highlight stays visible while status is ready. */
  bannerVisible: boolean;
};

type ItineraryGenerationContextValue = {
  job: ItineraryGenerationJob | null;
  startGeneration: (albumId: string, albumTitle: string, destination?: string) => void;
  dismissBanner: () => void;
  openItinerary: () => void;
  resetGeneration: () => void;
};

const ItineraryGenerationContext = createContext<ItineraryGenerationContextValue | null>(null);

export function ItineraryGenerationProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [job, setJob] = useState<ItineraryGenerationJob | null>(null);
  const timerRef = useRef<number | null>(null);
  const isDemoRoute = location.pathname.startsWith("/v2");

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const resetGeneration = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setJob(null);
  }, []);

  const startGeneration = useCallback(
    (albumId: string, albumTitle: string, destination = "Kuala Lumpur") => {
      setJob((current) => {
        if (current?.status === "ready" || current?.status === "processing") {
          return current;
        }

        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }

        const duration = isDemoRoute ? GENERATION_MS_DEMO : GENERATION_MS;

        timerRef.current = window.setTimeout(() => {
          setJob((latest) => {
            if (!latest || latest.status !== "processing") {
              return latest;
            }
            return { ...latest, status: "ready", bannerVisible: true };
          });
          timerRef.current = null;
        }, duration);

        return {
          albumId,
          albumTitle,
          destination,
          status: "processing",
          bannerVisible: false,
        };
      });
    },
    [isDemoRoute],
  );

  const dismissBanner = useCallback(() => {
    setJob((current) => (current ? { ...current, bannerVisible: false } : current));
  }, []);

  const openItinerary = useCallback(() => {
    setJob((current) => (current ? { ...current, bannerVisible: false } : current));
  }, []);

  const value = useMemo(
    () => ({
      job,
      startGeneration,
      dismissBanner,
      openItinerary,
      resetGeneration,
    }),
    [job, startGeneration, dismissBanner, openItinerary, resetGeneration],
  );

  return (
    <ItineraryGenerationContext.Provider value={value}>
      {children}
    </ItineraryGenerationContext.Provider>
  );
}

export function useItineraryGeneration() {
  const context = useContext(ItineraryGenerationContext);
  if (!context) {
    throw new Error("useItineraryGeneration must be used within ItineraryGenerationProvider");
  }
  return context;
}
