import { createSignal, createEffect, onMount, onCleanup, JSX, Show } from "solid-js";
import styles from "./styles.module.scss";
import { IconTrash } from "../icons";
import { originalSetTimeout } from "../../utils/freeze-animations";

// =============================================================================
// Helpers
// =============================================================================

/** Focus an element while temporarily blocking focus-trap libraries (e.g. Radix
 *  FocusScope) from reclaiming focus via focusin/focusout handlers. */
function focusBypassingTraps(el: HTMLElement | null | undefined) {
  if (!el) return;
  const trap = (e: Event) => e.stopImmediatePropagation();
  document.addEventListener("focusin", trap, true);
  document.addEventListener("focusout", trap, true);
  try {
    el.focus();
  } finally {
    document.removeEventListener("focusin", trap, true);
    document.removeEventListener("focusout", trap, true);
  }
}

// =============================================================================
// Types
// =============================================================================

export interface AnnotationPopupCSSProps {
  /** Element name to display in header */
  element: string;
  /** Optional timestamp display (e.g., "@ 1.23s" for animation feedback) */
  timestamp?: string;
  /** Optional selected/highlighted text */
  selectedText?: string;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Initial value for textarea (for edit mode) */
  initialValue?: string;
  /** Label for submit button (default: "Add") */
  submitLabel?: string;
  /** Called when annotation is submitted with text */
  onSubmit: (text: string) => void;
  /** Called when popup is cancelled/dismissed */
  onCancel: () => void;
  /** Called when delete button is clicked (only shown if provided) */
  onDelete?: () => void;
  /** Position styles (left, top) */
  style?: JSX.CSSProperties;
  /** Custom color for submit button and textarea focus (hex) */
  accentColor?: string;
  /** External exit state (parent controls exit animation) */
  isExiting?: boolean;
  /** Light mode styling */
  lightMode?: boolean;
  /** Computed styles for the selected element */
  computedStyles?: Record<string, string>;
}

export interface AnnotationPopupCSSHandle {
  /** Shake the popup (e.g., when user clicks outside) */
  shake: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function AnnotationPopupCSS(
  props: AnnotationPopupCSSProps & { ref?: (handle: AnnotationPopupCSSHandle) => void }
) {
  const [text, setText] = createSignal(props.initialValue ?? "");
  const [isShaking, setIsShaking] = createSignal(false);
  const [animState, setAnimState] = createSignal<"initial" | "enter" | "entered" | "exit">("initial");
  const [isFocused, setIsFocused] = createSignal(false);
  const [isStylesExpanded, setIsStylesExpanded] = createSignal(false);
  let textareaRef: HTMLTextAreaElement | undefined;
  let popupRef: HTMLDivElement | undefined;
  let cancelTimerRef: ReturnType<typeof setTimeout> | null = null;
  let shakeTimerRef: ReturnType<typeof setTimeout> | null = null;

  // Sync with parent exit state
  createEffect(() => {
    if (props.isExiting && animState() !== "exit") {
      setAnimState("exit");
    }
  });

  // Animate in on mount and focus textarea
  onMount(() => {
    // Start enter animation (use originalSetTimeout to bypass freeze patch)
    originalSetTimeout(() => {
      setAnimState("enter");
    }, 0);
    // Transition to entered state after animation completes
    const enterTimer = originalSetTimeout(() => {
      setAnimState("entered");
    }, 200); // Match animation duration
    const focusTimer = originalSetTimeout(() => {
      if (textareaRef) {
        focusBypassingTraps(textareaRef);
        textareaRef.selectionStart = textareaRef.selectionEnd = textareaRef.value.length;
        textareaRef.scrollTop = textareaRef.scrollHeight;
      }
    }, 50);

    onCleanup(() => {
      clearTimeout(enterTimer);
      clearTimeout(focusTimer);
      if (cancelTimerRef) clearTimeout(cancelTimerRef);
      if (shakeTimerRef) clearTimeout(shakeTimerRef);
    });
  });

  // Shake animation
  const shake = () => {
    if (shakeTimerRef) clearTimeout(shakeTimerRef);
    setIsShaking(true);
    shakeTimerRef = originalSetTimeout(() => {
      setIsShaking(false);
      focusBypassingTraps(textareaRef);
    }, 250);
  };

  // Expose handle to parent
  props.ref?.({ shake });

  // Handle cancel with exit animation
  const handleCancel = () => {
    setAnimState("exit");
    cancelTimerRef = originalSetTimeout(() => {
      props.onCancel();
    }, 150); // Match exit animation duration
  };

  // Handle submit
  const handleSubmit = () => {
    if (!text().trim()) return;
    props.onSubmit(text().trim());
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const popupClassName = () =>
    [
      styles.popup,
      props.lightMode ? styles.light : "",
      animState() === "enter" ? styles.enter : "",
      animState() === "entered" ? styles.entered : "",
      animState() === "exit" ? styles.exit : "",
      isShaking() ? styles.shake : "",
    ].filter(Boolean).join(" ");

  return (
    <div
      ref={popupRef}
      class={popupClassName()}
      data-annotation-popup
      style={props.style}
      onClick={(e) => e.stopPropagation()}
    >
      <div class={styles.header}>
        <Show
          when={props.computedStyles && Object.keys(props.computedStyles).length > 0}
          fallback={<span class={styles.element}>{props.element}</span>}
        >
          <button
            class={styles.headerToggle}
            onClick={() => {
              const wasExpanded = isStylesExpanded();
              setIsStylesExpanded(!isStylesExpanded());
              if (wasExpanded) {
                // Refocus textarea when closing
                originalSetTimeout(() => focusBypassingTraps(textareaRef), 0);
              }
            }}
            type="button"
          >
            <svg
              class={`${styles.chevron} ${isStylesExpanded() ? styles.expanded : ""}`}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 10.25L9 7.25L5.75 4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class={styles.element}>{props.element}</span>
          </button>
        </Show>
        <Show when={props.timestamp}>
          <span class={styles.timestamp}>{props.timestamp}</span>
        </Show>
      </div>

      {/* Collapsible computed styles section - uses grid-template-rows for smooth animation */}
      <Show when={props.computedStyles && Object.keys(props.computedStyles).length > 0}>
        <div class={`${styles.stylesWrapper} ${isStylesExpanded() ? styles.expanded : ""}`}>
          <div class={styles.stylesInner}>
            <div class={styles.stylesBlock}>
              {Object.entries(props.computedStyles!).map(([key, value]) => (
                <div class={styles.styleLine}>
                  <span class={styles.styleProperty}>
                    {key.replace(/([A-Z])/g, "-$1").toLowerCase()}
                  </span>
                  : <span class={styles.styleValue}>{value}</span>;
                </div>
              ))}
            </div>
          </div>
        </div>
      </Show>

      <Show when={props.selectedText}>
        <div class={styles.quote}>
          &ldquo;{props.selectedText!.slice(0, 80)}
          {props.selectedText!.length > 80 ? "..." : ""}&rdquo;
        </div>
      </Show>

      <textarea
        ref={textareaRef}
        class={styles.textarea}
        style={{ "border-color": isFocused() ? (props.accentColor ?? "#3c82f7") : undefined }}
        placeholder={props.placeholder ?? "What should change?"}
        value={text()}
        onInput={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={2}
        onKeyDown={handleKeyDown}
      />

      <div class={styles.actions}>
        <Show when={props.onDelete}>
          <div class={styles.deleteWrapper}>
            <button class={styles.deleteButton} onClick={() => props.onDelete?.()} type="button">
              <IconTrash size={22} />
            </button>
          </div>
        </Show>
        <button class={styles.cancel} onClick={handleCancel}>
          Cancel
        </button>
        <button
          class={styles.submit}
          style={{
            "background-color": props.accentColor ?? "#3c82f7",
            opacity: text().trim() ? 1 : 0.4,
          }}
          onClick={handleSubmit}
          disabled={!text().trim()}
        >
          {props.submitLabel ?? "Add"}
        </button>
      </div>
    </div>
  );
}

export default AnnotationPopupCSS;
