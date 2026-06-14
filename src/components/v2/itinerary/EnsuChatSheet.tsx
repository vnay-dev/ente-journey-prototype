import { Navigation06Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ItineraryChangeRef } from "../../../data/mockItinerary";
import { EnteSheetPanel } from "../../EnteSheetPanel";
import styles from "./EnsuChatSheet.module.css";

export type EnsuChatResult = {
  reply: string;
  changeRef?: ItineraryChangeRef;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  changeRef?: ItineraryChangeRef;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<EnsuChatResult>;
  isChangeValid: (change: ItineraryChangeRef) => boolean;
  onGoToChange: (change: ItineraryChangeRef) => void;
  demoTypeRequest?: { text: string; charMs: number } | null;
  onDemoTypeComplete?: () => void;
};

export function EnsuChatSheet({
  open,
  onClose,
  onSend,
  isChangeValid,
  onGoToChange,
  demoTypeRequest = null,
  onDemoTypeComplete,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I'm Ensu. Want to change a tagline, add a recommendation, or tweak a stop? Just ask.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const demoTypeKeyRef = useRef<string | null>(null);

  function resizeInput() {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    input.style.height = "auto";
    const nextHeight = Math.min(input.scrollHeight, 120);
    input.style.height = `${nextHeight}px`;
    input.style.overflowY = input.scrollHeight > 120 ? "auto" : "hidden";
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    resizeInput();
  }, [draft, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    requestAnimationFrame(resizeInput);
    setSending(true);

    try {
      const result = await onSend(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: result.reply,
          changeRef: result.changeRef,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function handleSend() {
    await sendMessage(draft);
  }

  useEffect(() => {
    if (!open || !demoTypeRequest) {
      return;
    }

    const typeKey = `${demoTypeRequest.text}:${demoTypeRequest.charMs}`;
    if (demoTypeKeyRef.current === typeKey) {
      return;
    }

    demoTypeKeyRef.current = typeKey;
    setDraft("");

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDraft(demoTypeRequest.text.slice(0, index));

      if (index >= demoTypeRequest.text.length) {
        window.clearInterval(timer);
        requestAnimationFrame(resizeInput);
        onDemoTypeComplete?.();
      }
    }, demoTypeRequest.charMs);

    return () => window.clearInterval(timer);
  }, [demoTypeRequest, onDemoTypeComplete, open]);

  useEffect(() => {
    if (!open) {
      demoTypeKeyRef.current = null;
    }
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <EnteSheetPanel
      open={open}
      title={
        <>
          Edit with
          <img src="/assets/ensu-logo.svg" alt="Ensu" className={styles.ensuLogo} />
        </>
      }
      onClose={onClose}
      closeDemoTarget="ensu-close"
    >
      <div className={styles.chat}>
        <p className={styles.intro}>Your on-device assistant for quick journey edits.</p>
        <div className={styles.messages} ref={listRef}>
          {messages.map((message) => {
            const showChangeLink =
              message.role === "assistant" && message.changeRef && isChangeValid(message.changeRef);

            return (
              <div
                key={message.id}
                className={`${styles.bubble} ${message.role === "user" ? styles.user : styles.assistant}`}
              >
                <p className={styles.bubbleText}>{message.text}</p>
                {showChangeLink ? (
                  <button
                    type="button"
                    className={styles.changeLink}
                    data-demo-target="ensu-view-changes"
                    onClick={() => onGoToChange(message.changeRef!)}
                  >
                    View changes
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className={styles.composer}>
          <div className={styles.composerField}>
            <textarea
              ref={inputRef}
              className={styles.input}
              data-demo-target="ensu-input"
              rows={1}
              placeholder="Describe a change"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                resizeInput();
              }}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
            <button
              type="button"
              className={styles.send}
              aria-label="Send message"
              data-demo-target="ensu-send"
              disabled={sending || !draft.trim()}
              onClick={() => void handleSend()}
            >
              <span className={styles.sendIcon} aria-hidden>
                <HugeiconsIcon icon={Navigation06Icon} size={18} strokeWidth={2} />
              </span>
            </button>
          </div>
          <p className={styles.disclaimer}>
            Ensu can make mistakes. Please double-check key details.
          </p>
        </div>
      </div>
    </EnteSheetPanel>
  );
}
