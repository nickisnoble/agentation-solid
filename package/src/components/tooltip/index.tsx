import { createSignal, onCleanup, JSX, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { Show } from "solid-js";
import { originalSetTimeout } from "../../utils/freeze-animations";

export const Tooltip = (
  props: {
    content: string;
    children: JSX.Element;
  } & JSX.HTMLAttributes<HTMLSpanElement>
) => {
  const [local, rest] = splitProps(props, ["content", "children"]);

  const [visible, setVisible] = createSignal(false);
  const [shouldRender, setShouldRender] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, right: 0 });
  let triggerRef: HTMLSpanElement | undefined;
  let timeoutRef: ReturnType<typeof setTimeout> | null = null;
  let exitTimeoutRef: ReturnType<typeof setTimeout> | null = null;

  const updatePosition = () => {
    if (triggerRef) {
      const rect = triggerRef.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        right: window.innerWidth - rect.left + 8,
      });
    }
  };

  const handleMouseEnter = () => {
    setShouldRender(true);
    if (exitTimeoutRef) {
      clearTimeout(exitTimeoutRef);
      exitTimeoutRef = null;
    }
    updatePosition();
    timeoutRef = originalSetTimeout(() => {
      setVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      timeoutRef = null;
    }
    setVisible(false);
    // Keep rendered during exit animation
    exitTimeoutRef = originalSetTimeout(() => {
      setShouldRender(false);
    }, 150);
  };

  onCleanup(() => {
    if (timeoutRef) clearTimeout(timeoutRef);
    if (exitTimeoutRef) clearTimeout(exitTimeoutRef);
  });

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {local.children}
      </span>
      <Show when={shouldRender()}>
        <Portal mount={document.body}>
          <div
            data-feedback-toolbar
            style={{
              position: "fixed",
              top: `${position().top}px`,
              right: `${position().right}px`,
              transform: "translateY(-50%)",
              padding: "6px 10px",
              background: "#383838",
              color: "rgba(255, 255, 255, 0.7)",
              "font-size": "11px",
              "font-weight": 400,
              "line-height": "14px",
              "border-radius": "10px",
              width: "180px",
              "text-align": "left",
              "z-index": 100020,
              "pointer-events": "none",
              "box-shadow": "0px 1px 8px rgba(0, 0, 0, 0.28)",
              opacity: visible() ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}
          >
            {local.content}
          </div>
        </Portal>
      </Show>
    </>
  );
};
