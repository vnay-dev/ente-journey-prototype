import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Itinerary } from "../data/mockItinerary";

type RequestPreviewOptions = {
  showPrompt?: boolean;
  openRecipient?: boolean;
  itinerary?: Itinerary;
};

type SharePreviewContextValue = {
  shareUrl: string | null;
  sharedItinerary: Itinerary | null;
  previewPromptVisible: boolean;
  previewOpen: boolean;
  requestPreview: (url: string, options?: RequestPreviewOptions) => void;
  openRecipientPreview: () => void;
  togglePreview: () => void;
  dismissPreviewPrompt: () => void;
};

const SharePreviewContext = createContext<SharePreviewContextValue | null>(null);

export function SharePreviewProvider({ children }: { children: ReactNode }) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharedItinerary, setSharedItinerary] = useState<Itinerary | null>(null);
  const [previewPromptVisible, setPreviewPromptVisible] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const openRecipientPreview = useCallback(() => {
    setPreviewOpen(true);
    setPreviewPromptVisible(false);
  }, []);

  const requestPreview = useCallback(
    (url: string, options?: RequestPreviewOptions) => {
      setShareUrl(url);
      if (options?.itinerary) {
        setSharedItinerary(options.itinerary);
      }
      if (options?.showPrompt !== false) {
        setPreviewPromptVisible(true);
      }
      if (options?.openRecipient) {
        openRecipientPreview();
      }
    },
    [openRecipientPreview],
  );

  const togglePreview = useCallback(() => {
    setPreviewOpen((open) => {
      if (open) {
        setPreviewPromptVisible(false);
      }
      return !open;
    });
  }, []);

  const dismissPreviewPrompt = useCallback(() => {
    setPreviewPromptVisible(false);
    setPreviewOpen(false);
    setSharedItinerary(null);
  }, []);

  const value = useMemo(
    () => ({
      shareUrl,
      sharedItinerary,
      previewPromptVisible,
      previewOpen,
      requestPreview,
      openRecipientPreview,
      togglePreview,
      dismissPreviewPrompt,
    }),
    [
      shareUrl,
      sharedItinerary,
      previewPromptVisible,
      previewOpen,
      requestPreview,
      openRecipientPreview,
      togglePreview,
      dismissPreviewPrompt,
    ],
  );

  return (
    <SharePreviewContext.Provider value={value}>{children}</SharePreviewContext.Provider>
  );
}

export function useSharePreview() {
  const context = useContext(SharePreviewContext);
  if (!context) {
    throw new Error("useSharePreview must be used within SharePreviewProvider");
  }
  return context;
}

/** Safe for components that may render outside the provider (e.g. tests). */
export function useSharePreviewOptional() {
  return useContext(SharePreviewContext);
}
