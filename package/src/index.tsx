// =============================================================================
// Agentation (SolidJS)
// =============================================================================
//
// A floating toolbar for annotating web pages and collecting structured feedback
// for AI coding agents. SolidJS edition.
//
// Usage:
//   import { Agentation } from 'agentation-solid';
//   <Agentation />
//
// =============================================================================

// Main components
// CSS-only version (default - zero runtime deps)
export { PageFeedbackToolbarCSS } from "./components/page-toolbar-css";

import { sharedConfig, onMount, onCleanup } from "solid-js";
import { render } from "solid-js/web";
import { PageFeedbackToolbarCSS } from "./components/page-toolbar-css";
import type { AgentationProps } from "./components/page-toolbar-css";

/**
 * SSR-safe wrapper around PageFeedbackToolbarCSS.
 *
 * During SSR hydration, SolidJS defers effects created within the hydration
 * context. Since Portal relies on createEffect internally, the toolbar never
 * mounts. This wrapper detects hydration and renders the component in a
 * separate SolidJS root via setTimeout to escape the hydration batch.
 */
export function Agentation(props: AgentationProps = {}) {
  // Not hydrating — render inline (normal client-side path)
  if (!sharedConfig.context) {
    return PageFeedbackToolbarCSS(props) as any;
  }

  // Hydrating — defer to a separate render root outside the hydration batch
  let mountEl: HTMLDivElement | undefined;
  let dispose: (() => void) | undefined;

  onMount(() => {
    setTimeout(() => {
      mountEl = document.createElement("div");
      mountEl.style.display = "contents";
      document.body.appendChild(mountEl);
      dispose = render(() => PageFeedbackToolbarCSS(props) as any, mountEl);
    }, 0);
  });

  onCleanup(() => {
    dispose?.();
    mountEl?.remove();
  });

  return null;
}
export type { DemoAnnotation, AgentationProps } from "./components/page-toolbar-css";

// Shared components (for building custom UIs)
export { AnnotationPopupCSS } from "./components/annotation-popup-css";
export type {
  AnnotationPopupCSSProps,
  AnnotationPopupCSSHandle,
} from "./components/annotation-popup-css";

// Icons (same for both versions - they're pure SVG)
export * from "./components/icons";

// Utilities (for building custom UIs)
export {
  identifyElement,
  identifyAnimationElement,
  getElementPath,
  getNearbyText,
  getElementClasses,
  // Shadow DOM support
  isInShadowDOM,
  getShadowHost,
  closestCrossingShadow,
} from "./utils/element-identification";

export {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
} from "./utils/storage";

// Types
export type { Annotation } from "./types";
