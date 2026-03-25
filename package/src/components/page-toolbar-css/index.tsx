import { createSignal, createEffect, on, onMount, onCleanup, batch } from "solid-js";
import { Portal, Show, For } from "solid-js/web";
import type { JSX } from "solid-js";

import {
  AnnotationPopupCSS,
  AnnotationPopupCSSHandle,
} from "../annotation-popup-css";
import {
  IconListSparkle,
  IconGear,
  IconCopyAnimated,
  IconSendArrow,
  IconTrashAlt,
  IconEyeAnimated,
  IconPausePlayAnimated,
  IconXmarkLarge,
  IconEdit,
  IconChevronLeft,
  IconChevronRight,
  IconLayout,
} from "../icons";
import { HelpTooltip } from "../help-tooltip";
import { DesignMode } from "../design-mode";
import { DesignPalette } from "../design-mode/palette";
import designStyles from "../design-mode/styles.module.scss";
import { RearrangeOverlay } from "../design-mode/rearrange";
import { generateDesignOutput, generateRearrangeOutput } from "../design-mode/output";
import { detectPageSections } from "../design-mode/section-detection";
import { DEFAULT_SIZES, type DesignPlacement, type ComponentType as DesignComponentType, type RearrangeState } from "../design-mode/types";
import {
  identifyElement,
  getElementPath,
  getNearbyText,
  getElementClasses,
  getDetailedComputedStyles,
  getForensicComputedStyles,
  parseComputedStylesString,
  getFullElementPath,
  getAccessibilityInfo,
  getNearbyElements,
  closestCrossingShadow,
} from "../../utils/element-identification";
import {
  loadAnnotations,
  loadAllAnnotations,
  saveAnnotations,
  getStorageKey,
  loadSessionId,
  saveSessionId,
  clearSessionId,
  saveAnnotationsWithSyncMarker,
  loadDesignPlacements,
  saveDesignPlacements,
  clearDesignPlacements,
  loadRearrangeState,
  saveRearrangeState,
  clearRearrangeState,
  loadWireframeState,
  saveWireframeState,
  clearWireframeState,
  loadToolbarHidden,
  saveToolbarHidden,
} from "../../utils/storage";
import {
  createSession,
  getSession,
  syncAnnotation,
  updateAnnotation as updateAnnotationOnServer,
  deleteAnnotation as deleteAnnotationFromServer,
} from "../../utils/sync";
import { getSolidComponentName } from "../../utils/solid-detection";
import {
  getSourceLocation,
  findNearestComponentSource,
  formatSourceLocation,
} from "../../utils/source-location";
import {
  freeze as freezeAll,
  unfreeze as unfreezeAll,
  originalSetTimeout,
  originalSetInterval,
} from "../../utils/freeze-animations";

import type { Annotation } from "../../types";
import styles from "./styles.module.scss";
import { generateOutput } from "../../utils/generate-output";
import { AnnotationMarker, ExitingMarker, PendingMarker } from "./annotation-marker";
import { SettingsPanel } from "./settings-panel";

/**
 * Composes element identification with component detection.
 * This is the boundary where we combine framework-agnostic element ID
 * with Solid-specific component name detection.
 */
function identifyElementWithComponents(
  element: HTMLElement,
  componentMode: ReactComponentMode = "filtered",
): {
  /** Combined name for display (component path + element) */
  name: string;
  /** Raw element name without component path */
  elementName: string;
  /** DOM path (relative to innermost component when available) */
  path: string;
  /** Component path (e.g., '<SideNav> <LinkComponent>') */
  reactComponents: string | null;
} {
  const { name: elementName, path: fullPath } = identifyElement(element);

  // If component detection is off, just return element info
  if (componentMode === "off") {
    return { name: elementName, elementName, path: fullPath, reactComponents: null };
  }

  const info = getSolidComponentName(element, { mode: componentMode });

  // Build path relative to innermost component when available
  let path = fullPath;
  if (info.innermostElement && info.innermostElement instanceof HTMLElement) {
    const relativePath = getElementPath(element, 6, info.innermostElement);
    if (relativePath) {
      path = relativePath;
    }
  }

  return {
    name: info.path ? `${info.path} ${elementName}` : elementName,
    elementName,
    path,
    reactComponents: info.path,
  };
}

// Module-level flag to prevent re-animating on SPA page navigation
let hasPlayedEntranceAnimation = false;

// =============================================================================
// Types
// =============================================================================

type HoverInfo = {
  element: string;
  elementName: string;
  elementPath: string;
  rect: DOMRect | null;
  reactComponents?: string | null;
};

export type OutputDetailLevel = "compact" | "standard" | "detailed" | "forensic";
// ReactComponentMode is now derived from outputDetail when reactEnabled is true
export type ReactComponentMode = "smart" | "filtered" | "all" | "off";
type MarkerClickBehavior = "edit" | "delete";

export type ToolbarSettings = {
  outputDetail: OutputDetailLevel;
  autoClearAfterCopy: boolean;
  annotationColorId: string;
  blockInteractions: boolean;
  reactEnabled: boolean;
  markerClickBehavior: MarkerClickBehavior;
  webhookUrl: string;
  webhooksEnabled: boolean;
};

const DEFAULT_SETTINGS: ToolbarSettings = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColorId: "blue",
  blockInteractions: true,
  reactEnabled: true,
  markerClickBehavior: "edit",
  webhookUrl: "",
  webhooksEnabled: true,
};

// Simple URL validation - checks for valid http(s) URL format
const isValidUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Maps output detail level to component detection mode.
// "smart" mode (DOM class correlation) was designed for React's deep fiber trees
// and is too aggressive for SolidJS's tracked-owner approach where every match
// is already verified via DOM containment. Use "filtered" for all active modes.
const OUTPUT_TO_REACT_MODE: Record<OutputDetailLevel, ReactComponentMode> = {
  compact: "off",
  standard: "filtered",
  detailed: "filtered",
  forensic: "all",
};

export const COLOR_OPTIONS = [
  { id: "indigo",  label: "Indigo",  srgb: "#6155F5", p3: "color(display-p3 0.38 0.33 0.96)" },
  { id: "blue",    label: "Blue",    srgb: "#0088FF", p3: "color(display-p3 0.00 0.53 1.00)" },
  { id: "cyan",    label: "Cyan",    srgb: "#00C3D0", p3: "color(display-p3 0.00 0.76 0.82)" },
  { id: "green",   label: "Green",   srgb: "#34C759", p3: "color(display-p3 0.20 0.78 0.35)" },
  { id: "yellow",  label: "Yellow",  srgb: "#FFCC00", p3: "color(display-p3 1.00 0.80 0.00)" },
  { id: "orange",  label: "Orange",  srgb: "#FF8D28", p3: "color(display-p3 1.00 0.55 0.16)" },
  { id: "red",     label: "Red",     srgb: "#FF383C", p3: "color(display-p3 1.00 0.22 0.24)" },
];

const injectAgentationColorTokens = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("agentation-color-tokens")) return;
  const style = document.createElement("style");
  style.id = "agentation-color-tokens";
  style.textContent = [
    ...COLOR_OPTIONS.map(c => `
      [data-agentation-accent="${c.id}"] {
        --agentation-color-accent: ${c.srgb};
      }

      @supports (color: color(display-p3 0 0 0)) {
        [data-agentation-accent="${c.id}"] {
          --agentation-color-accent: ${c.p3};
        }
      }
    `),
    `:root {
      ${COLOR_OPTIONS.map(c => `--agentation-color-${c.id}: ${c.srgb};`).join("\n")}
    }`,
    `@supports (color: color(display-p3 0 0 0)) {
      :root {
        ${COLOR_OPTIONS.map(c => `--agentation-color-${c.id}: ${c.p3};`).join("\n")}
      }
    }`,
  ].join("");
  document.head.appendChild(style);
}

injectAgentationColorTokens();

// =============================================================================
// Utils
// =============================================================================

/**
 * Recursively pierces shadow DOMs to find the deepest element at a point.
 * document.elementFromPoint() stops at shadow hosts, so we need to
 * recursively check inside open shadow roots to find the actual target.
 */
function deepElementFromPoint(x: number, y: number): HTMLElement | null {
  let element = document.elementFromPoint(x, y) as HTMLElement | null;
  if (!element) return null;

  // Keep drilling down through shadow roots
  while (element?.shadowRoot) {
    const deeper = element.shadowRoot.elementFromPoint(x, y) as HTMLElement | null;
    if (!deeper || deeper === element) break;
    element = deeper;
  }

  return element;
}

function isElementFixed(element: HTMLElement): boolean {
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    if (position === "fixed" || position === "sticky") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function isRenderableAnnotation(annotation: Annotation): boolean {
  return annotation.status !== "resolved" && annotation.status !== "dismissed";
}

function detectSourceFile(element: Element): string | undefined {
  const result = getSourceLocation(element as HTMLElement);
  const loc = result.found ? result : findNearestComponentSource(element as HTMLElement);
  if (loc.found && loc.source) {
    return formatSourceLocation(loc.source, "path");
  }
  return undefined;
}

// =============================================================================
// Types for Props
// =============================================================================

export type DemoAnnotation = {
  selector: string;
  comment: string;
  selectedText?: string;
};

export type PageFeedbackToolbarCSSProps = {
  demoAnnotations?: DemoAnnotation[];
  demoDelay?: number;
  enableDemoMode?: boolean;
  /** Callback fired when an annotation is added. */
  onAnnotationAdd?: (annotation: Annotation) => void;
  /** Callback fired when an annotation is deleted. */
  onAnnotationDelete?: (annotation: Annotation) => void;
  /** Callback fired when an annotation comment is edited. */
  onAnnotationUpdate?: (annotation: Annotation) => void;
  /** Callback fired when all annotations are cleared. Receives the annotations that were cleared. */
  onAnnotationsClear?: (annotations: Annotation[]) => void;
  /** Callback fired when the copy button is clicked. Receives the markdown output. */
  onCopy?: (markdown: string) => void;
  /** Callback fired when "Send to Agent" is clicked. Receives the markdown output and annotations. */
  onSubmit?: (output: string, annotations: Annotation[]) => void;
  /** Whether to copy to clipboard when the copy button is clicked. Defaults to true. */
  copyToClipboard?: boolean;
  /** Server URL for sync (e.g., "http://localhost:4747"). If not provided, uses localStorage only. */
  endpoint?: string;
  /** Pre-existing session ID to join. If not provided with endpoint, creates a new session. */
  sessionId?: string;
  /** Called when a new session is created (only when endpoint is provided without sessionId). */
  onSessionCreated?: (sessionId: string) => void;
  /** Webhook URL to receive annotation events. */
  webhookUrl?: string;
  /** Custom class name applied to the toolbar container. Use to adjust positioning or z-index. */
  class?: string;
};

/** Alias for PageFeedbackToolbarCSSProps */
export type AgentationProps = PageFeedbackToolbarCSSProps;

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbarCSS(props: PageFeedbackToolbarCSSProps = {}) {
  const [isActive, setIsActive] = createSignal(false);
  const [annotations, setAnnotations] = createSignal<Annotation[]>([]);
  const [showMarkers, setShowMarkers] = createSignal(true);
  const [isToolbarHidden, setIsToolbarHidden] = createSignal(loadToolbarHidden());
  const [isToolbarHiding, setIsToolbarHiding] = createSignal(false);

  // Mark events that originate inside the toolbar portal so app-level
  // "click outside" handlers can ignore them. We avoid stopPropagation()
  // because SolidJS delegates events to `document` — stopping propagation
  // at `document.body` would break all delegated handlers inside the portal.
  let portalWrapperRef: HTMLDivElement | undefined;
  onMount(() => {
    const mark = (e: Event) => {
      if (portalWrapperRef && portalWrapperRef.contains(e.target as Node)) {
        (e as any).__agentationInternal = true;
      }
    };
    const events = ["mousedown", "click", "pointerdown"] as const;
    events.forEach((evt) => document.body.addEventListener(evt, mark, true));
    onCleanup(() => {
      events.forEach((evt) => document.body.removeEventListener(evt, mark, true));
    });
  });

  // Unified marker visibility state - controls both toolbar and eye toggle
  const [markersVisible, setMarkersVisible] = createSignal(false);
  const [markersExiting, setMarkersExiting] = createSignal(false);
  const [hoverInfo, setHoverInfo] = createSignal<HoverInfo | null>(null);
  const [hoverPosition, setHoverPosition] = createSignal({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = createSignal<{
    x: number;
    y: number;
    clientY: number;
    element: string;
    elementPath: string;
    selectedText?: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
    nearbyText?: string;
    cssClasses?: string;
    isMultiSelect?: boolean;
    isFixed?: boolean;
    fullPath?: string;
    accessibility?: string;
    computedStyles?: string;
    computedStylesObj?: Record<string, string>;
    nearbyElements?: string;
    reactComponents?: string;
    sourceFile?: string;
    elementBoundingBoxes?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    // Element references for cmd+shift+click multi-select (for live position queries)
    multiSelectElements?: HTMLElement[];
    // Element reference for single-select (for live position queries)
    targetElement?: HTMLElement;
  } | null>(null);
  const [copied, setCopied] = createSignal(false);
  const [sendState, setSendState] = createSignal<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const [cleared, setCleared] = createSignal(false);
  const [isClearing, setIsClearing] = createSignal(false);
  const [hoveredMarkerId, setHoveredMarkerId] = createSignal<string | null>(null);
  const [hoveredTargetElement, setHoveredTargetElement] =
    createSignal<HTMLElement | null>(null);
  const [hoveredTargetElements, setHoveredTargetElements] = createSignal<
    HTMLElement[]
  >([]); // For cmd+shift+click multi-select hover
  const [deletingMarkerId, setDeletingMarkerId] = createSignal<string | null>(null);
  const [renumberFrom, setRenumberFrom] = createSignal<number | null>(null);
  const [editingAnnotation, setEditingAnnotation] = createSignal<Annotation | null>(
    null,
  );
  const [editingTargetElement, setEditingTargetElement] =
    createSignal<HTMLElement | null>(null);
  const [editingTargetElements, setEditingTargetElements] = createSignal<
    HTMLElement[]
  >([]); // For cmd+shift+click multi-select
  const [scrollY, setScrollY] = createSignal(0);
  const [isScrolling, setIsScrolling] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [isFrozen, setIsFrozen] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [showSettingsVisible, setShowSettingsVisible] = createSignal(false);
  const [settingsPage, setSettingsPage] = createSignal<"main" | "automations">(
    "main",
  );
  const [tooltipsHidden, setTooltipsHidden] = createSignal(false);

  // Layout mode state
  const [isDesignMode, setIsDesignMode] = createSignal(false);
  const [designOverlayExiting, setDesignOverlayExiting] = createSignal(false);
  const [designPlacements, setDesignPlacements] = createSignal<DesignPlacement[]>([]);
  const [activeDesignComponent, setActiveDesignComponent] = createSignal<DesignComponentType | null>(null);
  let designPlacementsLoaded = false;
  const [blankCanvas, setBlankCanvas] = createSignal(false);
  const [canvasReady, setCanvasReady] = createSignal(false);
  const [canvasOpacity, setCanvasOpacity] = createSignal(1);
  const [canvasPurpose, setCanvasPurpose] = createSignal<import("../design-mode/types").CanvasPurpose>("new-page");
  const [wireframePurpose, setWireframePurpose] = createSignal("");
  const [designInteracting, setDesignInteracting] = createSignal(false);
  const [rearrangeState, setRearrangeState] = createSignal<RearrangeState | null>(null);
  let rearrangeLoaded = false;
  let exploreStashRef = { rearrange: null as RearrangeState | null, placements: [] as DesignPlacement[] };
  let wireframeStashRef = { rearrange: null as RearrangeState | null, placements: [] as DesignPlacement[] };
  const [designDeselectSignal, setDesignDeselectSignal] = createSignal(0);
  const [rearrangeDeselectSignal, setRearrangeDeselectSignal] = createSignal(0);
  const [designClearSignal, setDesignClearSignal] = createSignal(0);
  const [rearrangeClearSignal, setRearrangeClearSignal] = createSignal(0);
  let designSelectedIdsRef = new Set<string>();
  let rearrangeSelectedIdsRef = new Set<string>();
  let crossDragStartRef: Map<string, { x: number; y: number }> | null = null;
  let designExitTimer: ReturnType<typeof setTimeout> | undefined;

  // Draw mode state
  const [isDrawMode, setIsDrawMode] = createSignal(false);
  const [drawStrokes, setDrawStrokes] = createSignal<Array<{ id: string; points: Array<{x: number, y: number}>; color: string; fixed: boolean }>>([]);
  let drawStrokesRef = drawStrokes();
  const [hoveredDrawingIdx, setHoveredDrawingIdx] = createSignal<number | null>(null);
  let drawCanvasRef: HTMLCanvasElement | undefined;
  let isDrawingRef = false;
  let currentStrokeRef: Array<{x: number, y: number}> = [];
  let dimAmountRef = 0;
  let visualHighlightRef: number | null = null;
  let exitingStrokeIdRef: string | null = null;
  let exitingAlphaRef = 1;

  // Shadow annotation tracking
  let placementAnnotationMap = new Map<string, string>();
  let rearrangeAnnotationMap = new Map<string, string>();
  let rearrangeDebounceTimer: ReturnType<typeof setTimeout> | undefined;

  const [tooltipSessionActive, setTooltipSessionActive] = createSignal(false);
  let tooltipSessionTimerRef: ReturnType<typeof setTimeout> | null = null;

  // Cmd+shift+click multi-select state
  const [pendingMultiSelectElements, setPendingMultiSelectElements] = createSignal<
    Array<{
      element: HTMLElement;
      rect: DOMRect;
      name: string;
      path: string;
      reactComponents?: string;
    }>
  >([]);
  let modifiersHeld = { cmd: false, shift: false };

  // Hide tooltips after button click until mouse leaves
  const hideTooltipsUntilMouseLeave = () => {
    setTooltipsHidden(true);
  };

  const showTooltipsAgain = () => {
    setTooltipsHidden(false);
  };

  const handleControlsMouseEnter = () => {
    if (!tooltipSessionActive()) {
      tooltipSessionTimerRef = setTimeout(
        () => setTooltipSessionActive(true),
        850,
      );
    }
  };

  const handleControlsMouseLeave = () => {
    if (tooltipSessionTimerRef) {
      clearTimeout(tooltipSessionTimerRef);
      tooltipSessionTimerRef = null;
    }
    setTooltipSessionActive(false);
    showTooltipsAgain();
  };

  onCleanup(() => {
    if (tooltipSessionTimerRef)
      clearTimeout(tooltipSessionTimerRef);
  });

  const [settings, setSettings] = createSignal<ToolbarSettings>((() => {
    try {
      const saved = JSON.parse(localStorage.getItem("feedback-toolbar-settings") ?? "");
      return {
        ...DEFAULT_SETTINGS,
        ...saved,
        annotationColorId: COLOR_OPTIONS.find(c => c.id === saved.annotationColorId)
          ? saved.annotationColorId
          : DEFAULT_SETTINGS.annotationColorId,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  })());
  const [isDarkMode, setIsDarkMode] = createSignal(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = createSignal(false);

  const toggleTheme = () => {
    portalWrapperRef?.classList.add(styles.disableTransitions);
    setIsDarkMode((previous) => !previous);
    requestAnimationFrame(() => {
      portalWrapperRef?.classList.remove(styles.disableTransitions);
    });
  }

  // Check if running in development mode - component detection only works in development mode
  const isDevMode = typeof __DEV_MODE__ !== "undefined" ? __DEV_MODE__ : process.env.NODE_ENV === "development";

  // Effective component mode - derived from outputDetail when enabled
  const effectiveReactMode = (): ReactComponentMode =>
    isDevMode && settings().reactEnabled
      ? OUTPUT_TO_REACT_MODE[settings().outputDetail]
      : "off";

  // Server sync state
  const [currentSessionId, setCurrentSessionId] = createSignal<string | null>(
    props.sessionId ?? null,
  );
  let sessionInitializedRef = false;
  const [connectionStatus, setConnectionStatus] = createSignal<
    "disconnected" | "connecting" | "connected"
  >(props.endpoint ? "connecting" : "disconnected");

  // Draggable toolbar state
  const [toolbarPosition, setToolbarPosition] = createSignal<{
    x: number;
    y: number;
  } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = createSignal(false);
  const [dragStartPos, setDragStartPos] = createSignal<{
    x: number;
    y: number;
    toolbarX: number;
    toolbarY: number;
  } | null>(null);
  let justFinishedToolbarDragRef = false;

  // For animations - track which markers have animated in and which are exiting
  const [animatedMarkers, setAnimatedMarkers] = createSignal<Set<string>>(
    new Set(),
  );
  const [exitingMarkers, setExitingMarkers] = createSignal<Set<string>>(new Set());
  const [pendingExiting, setPendingExiting] = createSignal(false);
  const [editExiting, setEditExiting] = createSignal(false);

  // Multi-select drag state - use plain variables for all drag visuals to avoid re-renders
  const [isDragging, setIsDragging] = createSignal(false);
  let mouseDownPosRef: { x: number; y: number } | null = null;
  let dragStartRef: { x: number; y: number } | null = null;
  let dragRectRef: HTMLDivElement | null = null;
  let highlightsContainerRef: HTMLDivElement | null = null;
  let justFinishedDragRef = false;
  let lastElementUpdateRef = 0;
  let recentlyAddedIdRef: string | null = null;
  let prevConnectionStatusRef: "disconnected" | "connecting" | "connected" | null = null;
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50; // Faster updates since no framework re-renders

  let popupRef: AnnotationPopupCSSHandle | undefined;
  let editPopupRef: AnnotationPopupCSSHandle | undefined;
  let scrollTimeoutRef: ReturnType<typeof setTimeout> | null = null;

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // Handle showSettings changes with exit animation
  createEffect(() => {
    if (showSettings()) {
      setShowSettingsVisible(true);
    } else {
      // Reset tooltips when settings close (fixes tooltips not showing after closing settings)
      setTooltipsHidden(false);
      // Reset to main page when settings close
      setSettingsPage("main");
      const timer = originalSetTimeout(() => setShowSettingsVisible(false), 0);
      onCleanup(() => clearTimeout(timer));
    }
  });

  // Delay blank canvas .visible by one frame when becoming visible so CSS transition fires
  createEffect(() => {
    const canvasShouldBeVisible = isDesignMode() && isActive() && !designOverlayExiting() && blankCanvas();
    if (canvasShouldBeVisible) {
      setCanvasReady(false);
      const raf = requestAnimationFrame(() => {
        setCanvasReady(true);
      });
      onCleanup(() => cancelAnimationFrame(raf));
    } else {
      setCanvasReady(false);
    }
  });

  // Unified marker visibility - depends on toolbar active, showMarkers toggle, and not blank canvas
  // This single effect handles all marker show/hide animations
  const shouldShowMarkers = () => isActive() && showMarkers() && !isDesignMode();
  createEffect(() => {
    if (shouldShowMarkers()) {
      // Show markers - reset animations and make visible
      setMarkersExiting(false);
      setMarkersVisible(true);
      setAnimatedMarkers(new Set<string>());
      // After enter animations complete, mark all as animated
      const timer = originalSetTimeout(() => {
        setAnimatedMarkers((prev) => {
          const newSet = new Set(prev);
          annotations().forEach((a) => newSet.add(a.id));
          return newSet;
        });
      }, 350);
      onCleanup(() => clearTimeout(timer));
    } else if (markersVisible()) {
      // Hide markers - start exit animation, then unmount
      setMarkersExiting(true);
      const timer = originalSetTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      onCleanup(() => clearTimeout(timer));
    }
  });

  // Mount and load
  onMount(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations<Annotation>(pathname);
    setAnnotations(stored.filter(isRenderableAnnotation));

    // Trigger entrance animation only on first load (not on SPA navigation)
    if (!hasPlayedEntranceAnimation) {
      setShowEntranceAnimation(true);
      hasPlayedEntranceAnimation = true;
      // Remove animation class after it completes (toolbar: 500ms, badge: 400ms delay + 300ms)
      originalSetTimeout(() => setShowEntranceAnimation(false), 750);
    }

    // Load saved theme preference, default to dark mode
    try {
      const savedTheme = localStorage.getItem("feedback-toolbar-theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
      // If no saved preference, keep default (dark mode)
    } catch (e) {
      // Ignore localStorage errors
    }

    // Load saved toolbar position
    try {
      const savedPosition = localStorage.getItem("feedback-toolbar-position");
      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          setToolbarPosition(pos);
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  });

  // Save settings
  createEffect(() => {
    const s = settings();
    if (mounted()) {
      localStorage.setItem(
        "feedback-toolbar-settings",
        JSON.stringify(s),
      );
    }
  });

  // Save theme preference
  createEffect(() => {
    const dark = isDarkMode();
    if (mounted()) {
      localStorage.setItem(
        "feedback-toolbar-theme",
        dark ? "dark" : "light",
      );
    }
  });

  // Save toolbar position when drag ends
  let prevDraggingRef = false;
  createEffect(() => {
    const wasDragging = prevDraggingRef;
    prevDraggingRef = isDraggingToolbar();

    // Save position when dragging ends (transition from true to false)
    if (wasDragging && !isDraggingToolbar() && toolbarPosition() && mounted()) {
      localStorage.setItem(
        "feedback-toolbar-position",
        JSON.stringify(toolbarPosition()),
      );
    }
  });

  // Initialize server session (when endpoint is provided)
  createEffect(() => {
    const endpoint = props.endpoint;
    const initialSessionId = props.sessionId;
    const onSessionCreated = props.onSessionCreated;
    if (!endpoint || !mounted() || sessionInitializedRef) return;
    sessionInitializedRef = true;
    setConnectionStatus("connecting");

    const initSession = async () => {
      try {
        // Check for stored session ID to rejoin on refresh
        const storedSessionId = loadSessionId(pathname);
        const sessionIdToJoin = initialSessionId || storedSessionId;
        let sessionEstablished = false;

        if (sessionIdToJoin) {
          // Join existing session - server annotations are authoritative
          try {
            const session = await getSession(endpoint, sessionIdToJoin);
            setCurrentSessionId(session.id);
            setConnectionStatus("connected");
            saveSessionId(pathname, session.id);
            sessionEstablished = true;

            // Find local annotations that need to be synced:
            // 1. Annotations never synced to any session
            // 2. Annotations synced to a different session
            // 3. Annotations marked as synced to THIS session but missing from server
            //    (handles server-side deletion)
            const allLocalAnnotations = loadAnnotations<Annotation>(pathname);
            const serverIds = new Set(session.annotations.map((a: Annotation) => a.id));
            const localToMerge = allLocalAnnotations.filter((a: Annotation) => {
              // If it exists on server, don't re-upload
              if (serverIds.has(a.id)) return false;
              // Otherwise, needs to be synced (whether never synced, synced elsewhere, or missing from server)
              return true;
            });

            // Sync unsynced local annotations to this session
            if (localToMerge.length > 0) {
              const baseUrl =
                typeof window !== "undefined" ? window.location.origin : "";
              const pageUrl = `${baseUrl}${pathname}`;

              const results = await Promise.allSettled(
                localToMerge.map((annotation: Annotation) =>
                  syncAnnotation(endpoint, session.id, {
                    ...annotation,
                    sessionId: session.id,
                    url: pageUrl,
                  }),
                ),
              );

              const syncedAnnotations = results.map((result, i) => {
                if (result.status === "fulfilled") {
                  return result.value;
                }
                console.warn(
                  "[Agentation] Failed to sync annotation:",
                  result.reason,
                );
                return localToMerge[i];
              });

              // Mark merged annotations as synced
              const allAnnotations = [
                ...session.annotations,
                ...syncedAnnotations,
              ];
              setAnnotations(allAnnotations.filter(isRenderableAnnotation));
              saveAnnotationsWithSyncMarker(
                pathname,
                allAnnotations.filter(isRenderableAnnotation),
                session.id,
              );
            } else {
              setAnnotations(
                session.annotations.filter(isRenderableAnnotation),
              );
              saveAnnotationsWithSyncMarker(
                pathname,
                session.annotations.filter(isRenderableAnnotation),
                session.id,
              );
            }
          } catch (joinError) {
            // Session doesn't exist or expired - will create new below
            console.warn(
              "[Agentation] Could not join session, creating new:",
              joinError,
            );
            // Clear the stored session ID since it's invalid
            clearSessionId(pathname);
            // sessionEstablished remains false, will create new session
          }
        }

        // Create new session if we don't have one yet (either no stored ID, or rejoin failed)
        if (!sessionEstablished) {
          // Create new session for current page
          const currentUrl =
            typeof window !== "undefined" ? window.location.href : "/";
          const session = await createSession(endpoint, currentUrl);
          setCurrentSessionId(session.id);
          setConnectionStatus("connected");
          saveSessionId(pathname, session.id);
          onSessionCreated?.(session.id);

          // Only sync annotations that have never been synced (no _syncedTo marker)
          const allAnnotations = loadAllAnnotations<Annotation>();
          const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";

          // Sync annotations from all pages in parallel
          const syncPromises: Promise<void>[] = [];
          for (const [pagePath, pageAnnotations] of allAnnotations) {
            // Filter to only unsynced annotations
            const unsyncedAnnotations = pageAnnotations.filter(
              (a: Annotation) => !(a as Annotation & { _syncedTo?: string })._syncedTo,
            );
            if (unsyncedAnnotations.length === 0) continue;

            const pageUrl = `${baseUrl}${pagePath}`;
            const isCurrentPage = pagePath === pathname;

            syncPromises.push(
              (async () => {
                try {
                  // Use current session for current page, create new sessions for other pages
                  const targetSession = isCurrentPage
                    ? session
                    : await createSession(endpoint, pageUrl);

                  const results = await Promise.allSettled(
                    unsyncedAnnotations.map((annotation: Annotation) =>
                      syncAnnotation(endpoint, targetSession.id, {
                        ...annotation,
                        sessionId: targetSession.id,
                        url: pageUrl,
                      }),
                    ),
                  );

                  // Mark synced annotations and update local state for current page
                  const syncedAnnotations = results.map((result, i) => {
                    if (result.status === "fulfilled") {
                      return result.value;
                    }
                    console.warn(
                      "[Agentation] Failed to sync annotation:",
                      result.reason,
                    );
                    return unsyncedAnnotations[i];
                  });

                  const renderableSyncedAnnotations = syncedAnnotations.filter(
                    isRenderableAnnotation,
                  );

                  // Save with sync marker
                  saveAnnotationsWithSyncMarker(
                    pagePath,
                    renderableSyncedAnnotations,
                    targetSession.id,
                  );

                  if (isCurrentPage) {
                    const originalIds = new Set(
                      unsyncedAnnotations.map((a: Annotation) => a.id),
                    );
                    setAnnotations((prev) => {
                      const newDuringSync = prev.filter(
                        (a) => !originalIds.has(a.id),
                      );
                      return [...renderableSyncedAnnotations, ...newDuringSync];
                    });
                  }
                } catch (err) {
                  console.warn(
                    `[Agentation] Failed to sync annotations for ${pagePath}:`,
                    err,
                  );
                }
              })(),
            );
          }

          await Promise.allSettled(syncPromises);
        }
      } catch (error) {
        // Network error - continue in local-only mode
        setConnectionStatus("disconnected");
        console.warn(
          "[Agentation] Failed to initialize session, using local storage:",
          error,
        );
      }
    };

    initSession();
  });

  // Periodic health check for server connection
  createEffect(() => {
    const endpoint = props.endpoint;
    if (!endpoint || !mounted()) return;

    const checkHealth = async () => {
      try {
        const response = await fetch(`${endpoint}/health`);
        if (response.ok) {
          setConnectionStatus("connected");
        } else {
          setConnectionStatus("disconnected");
        }
      } catch {
        setConnectionStatus("disconnected");
      }
    };

    // Check immediately, then every 10 seconds
    checkHealth();
    const interval = originalSetInterval(checkHealth, 10000);
    onCleanup(() => clearInterval(interval));
  });

  // Listen for server-side annotation updates (e.g. resolved by agent)
  createEffect(() => {
    const endpoint = props.endpoint;
    const sessId = currentSessionId();
    if (!endpoint || !mounted() || !sessId) return;

    const eventSource = new EventSource(
      `${endpoint}/sessions/${sessId}/events`
    );

    const removedStatuses = ["resolved", "dismissed"];

    const handler = (e: MessageEvent) => {
      try {
        const event = JSON.parse(e.data);
        if (removedStatuses.includes(event.payload?.status)) {
          const id = event.payload.id as string;
          const kind = event.payload.kind as string | undefined;

          if (kind === "placement") {
            // Reverse-lookup: find which placementId maps to this annotation ID
            for (const [placementId, annotationId] of placementAnnotationMap) {
              if (annotationId === id) {
                placementAnnotationMap.delete(placementId);
                setDesignPlacements((prev) => prev.filter((p) => p.id !== placementId));
                break;
              }
            }
          } else if (kind === "rearrange") {
            // Reverse-lookup: find which sectionId maps to this annotation ID
            for (const [sectionId, annotationId] of rearrangeAnnotationMap) {
              if (annotationId === id) {
                rearrangeAnnotationMap.delete(sectionId);
                setRearrangeState((prev) => {
                  if (!prev) return null;
                  const remaining = prev.sections.filter((s) => s.id !== sectionId);
                  if (remaining.length === 0) return null;
                  return { ...prev, sections: remaining };
                });
                break;
              }
            }
          } else {
            // Feedback annotation — trigger exit animation then remove
            setExitingMarkers((prev) => new Set(prev).add(id));
            originalSetTimeout(() => {
              setAnnotations((prev) => prev.filter((a) => a.id !== id));
              setExitingMarkers((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
            }, 150);
          }
        }
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.addEventListener("annotation.updated", handler);

    onCleanup(() => {
      eventSource.removeEventListener("annotation.updated", handler);
      eventSource.close();
    });
  });

  // Sync local annotations when connection is restored
  createEffect(() => {
    const endpoint = props.endpoint;
    const status = connectionStatus();
    const sessId = currentSessionId();
    if (!endpoint || !mounted()) return;

    // Check if we just reconnected (was disconnected, now connected)
    const wasDisconnected = prevConnectionStatusRef === "disconnected";
    const isNowConnected = status === "connected";
    prevConnectionStatusRef = status;

    if (wasDisconnected && isNowConnected) {
      // Sync any local annotations that aren't on the server
      const syncLocalAnnotations = async () => {
        try {
          const localAnnotations = loadAnnotations<Annotation>(pathname);
          if (localAnnotations.length === 0) return;

          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          const pageUrl = `${baseUrl}${pathname}`;

          // Get or create session
          let sessionId = sessId;
          let serverAnnotations: Annotation[] = [];

          if (sessionId) {
            // Try to get existing session
            try {
              const session = await getSession(endpoint, sessionId);
              serverAnnotations = session.annotations;
            } catch {
              // Session doesn't exist anymore, create new one
              sessionId = null;
            }
          }

          if (!sessionId) {
            // Create new session
            const newSession = await createSession(endpoint, pageUrl);
            sessionId = newSession.id;
            setCurrentSessionId(sessionId);
            saveSessionId(pathname, sessionId);
          }

          // Find annotations that need syncing
          const serverIds = new Set(serverAnnotations.map((a) => a.id));
          const unsyncedLocal = localAnnotations.filter((a) => !serverIds.has(a.id));

          if (unsyncedLocal.length > 0) {
            const results = await Promise.allSettled(
              unsyncedLocal.map((annotation) =>
                syncAnnotation(endpoint, sessionId!, {
                  ...annotation,
                  sessionId: sessionId!,
                  url: pageUrl,
                })
              )
            );

            const syncedAnnotations = results.map((result, i) => {
              if (result.status === "fulfilled") {
                return result.value;
              }
              console.warn("[Agentation] Failed to sync annotation on reconnect:", result.reason);
              return unsyncedLocal[i];
            });

            // Update local state with server + synced annotations
            const allAnnotations = [...serverAnnotations, ...syncedAnnotations];
            const renderableAnnotations = allAnnotations.filter(
              isRenderableAnnotation,
            );
            setAnnotations(renderableAnnotations);
            saveAnnotationsWithSyncMarker(
              pathname,
              renderableAnnotations,
              sessionId!,
            );
          }
        } catch (err) {
          console.warn("[Agentation] Failed to sync on reconnect:", err);
        }
      };

      syncLocalAnnotations();
    }
  });

  const hideToolbarTemporarily = () => {
    if (isToolbarHiding()) return;
    setIsToolbarHiding(true);
    setShowSettings(false);
    setIsActive(false);
    originalSetTimeout(() => {
      saveToolbarHidden(true);
      setIsToolbarHidden(true);
      setIsToolbarHiding(false);
    }, 400);
  };

  // Demo annotations
  createEffect(() => {
    if (!props.enableDemoMode) return;
    if (!mounted() || !props.demoAnnotations || props.demoAnnotations.length === 0) return;
    if (annotations().length > 0) return;

    const demoDelay = props.demoDelay ?? 1000;
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    timeoutIds.push(
      originalSetTimeout(() => {
        setIsActive(true);
      }, demoDelay - 200),
    );

    props.demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay + index * 300;

      timeoutIds.push(
        originalSetTimeout(() => {
          const element = document.querySelector(demo.selector) as HTMLElement;
          if (!element) return;

          const rect = element.getBoundingClientRect();
          const { name, path } = identifyElement(element);

          const newAnnotation: Annotation = {
            id: `demo-${Date.now()}-${index}`,
            x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
            y: rect.top + rect.height / 2 + window.scrollY,
            comment: demo.comment,
            element: name,
            elementPath: path,
            timestamp: Date.now(),
            selectedText: demo.selectedText,
            boundingBox: {
              x: rect.left,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height,
            },
            nearbyText: getNearbyText(element),
            cssClasses: getElementClasses(element),
          };

          setAnnotations((prev) => [...prev, newAnnotation]);
        }, annotationDelay),
      );
    });

    onCleanup(() => {
      timeoutIds.forEach(clearTimeout);
    });
  });

  // Track scroll
  onMount(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }

      scrollTimeoutRef = originalSetTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }
    });
  });

  // Save annotations (preserving sync markers if connected to a session)
  createEffect(() => {
    const anns = annotations();
    const sessId = currentSessionId();
    if (mounted() && anns.length > 0) {
      if (sessId) {
        // Connected to session - save with sync marker to prevent re-upload on refresh
        saveAnnotationsWithSyncMarker(pathname, anns, sessId);
      } else {
        // Not connected - save without markers (will sync when connected)
        saveAnnotations(pathname, anns);
      }
    } else if (mounted() && anns.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  });

  // Load design placements from localStorage on mount
  createEffect(() => {
    if (mounted() && !designPlacementsLoaded) {
      designPlacementsLoaded = true;
      const stored = loadDesignPlacements<DesignPlacement>(pathname);
      if (stored.length > 0) setDesignPlacements(stored);
    }
  });

  // Save design placements to localStorage (only explore-mode data — wireframe has its own key)
  createEffect(() => {
    const placements = designPlacements();
    const bc = blankCanvas();
    if (mounted() && designPlacementsLoaded && !bc) {
      if (placements.length > 0) {
        saveDesignPlacements(pathname, placements);
      } else {
        clearDesignPlacements(pathname);
      }
    }
  });

  // Load rearrange state from localStorage on mount
  createEffect(() => {
    if (mounted() && !rearrangeLoaded) {
      rearrangeLoaded = true;
      const stored = loadRearrangeState<RearrangeState>(pathname);
      if (stored) {
        // Migrate old state that lacks currentRect
        const migrated = {
          ...stored,
          sections: stored.sections.map(s => ({
            ...s,
            currentRect: s.currentRect ?? { ...s.originalRect },
          })),
        };
        setRearrangeState(migrated);
      }
    }
  });

  // Save rearrange state to localStorage (only explore-mode data — wireframe has its own key)
  createEffect(() => {
    const rs = rearrangeState();
    const bc = blankCanvas();
    if (mounted() && rearrangeLoaded && !bc) {
      if (rs) {
        saveRearrangeState(pathname, rs);
      } else {
        clearRearrangeState(pathname);
      }
    }
  });

  // Load wireframe stash from localStorage on mount
  let wireframeLoaded = false;
  createEffect(() => {
    if (mounted() && !wireframeLoaded) {
      wireframeLoaded = true;
      const stored = loadWireframeState<RearrangeState>(pathname);
      if (stored) {
        wireframeStashRef = {
          rearrange: stored.rearrange,
          placements: (stored.placements || []) as DesignPlacement[],
        };
        if (stored.purpose) setWireframePurpose(stored.purpose);
      }
    }
  });

  // Save wireframe stash to localStorage when it changes
  createEffect(() => {
    const rs = rearrangeState();
    const placements = designPlacements();
    const wp = wireframePurpose();
    const bc = blankCanvas();
    if (!mounted() || !wireframeLoaded) return;
    const stash = wireframeStashRef;
    // Save current wireframe state: either from stash (if in explore mode) or live (if in wireframe mode)
    if (bc) {
      // Currently in wireframe — save live state
      const hasContent = (rs?.sections?.length ?? 0) > 0 || placements.length > 0 || wp;
      if (hasContent) {
        saveWireframeState(pathname, { rearrange: rs, placements: placements, purpose: wp });
      } else {
        clearWireframeState(pathname);
      }
    } else {
      // In explore mode — save stash
      const hasContent = (stash.rearrange?.sections?.length ?? 0) > 0 || stash.placements.length > 0 || wp;
      if (hasContent) {
        saveWireframeState(pathname, { rearrange: stash.rearrange, placements: stash.placements, purpose: wp });
      } else {
        clearWireframeState(pathname);
      }
    }
  });

  // Initialize empty rearrange state when entering explore mode
  createEffect(() => {
    if (isDesignMode() && !rearrangeState()) {
      setRearrangeState({
        sections: [],
        originalOrder: [],
        detectedAt: Date.now(),
      });
    }
  });

  // Sync placement shadow annotations to server
  createEffect(() => {
    const endpoint = props.endpoint;
    const sessId = currentSessionId();
    const placements = designPlacements();
    if (!endpoint || !sessId) return;

    const currentMap = placementAnnotationMap;
    const currentIds = new Set(placements.map((p) => p.id));

    // Create annotations for new placements
    for (const p of placements) {
      if (currentMap.has(p.id)) continue;

      // Mark as in-flight to avoid duplicates
      currentMap.set(p.id, "");

      const pageUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search + window.location.hash
          : pathname;

      syncAnnotation(endpoint, sessId, {
        id: p.id,
        x: (p.x / window.innerWidth) * 100,
        y: p.y,
        comment: `Place ${p.type} at (${Math.round(p.x)}, ${Math.round(p.y)}), ${p.width}×${p.height}px${p.text ? ` — "${p.text}"` : ""}`,
        element: `[design:${p.type}]`,
        elementPath: "[placement]",
        timestamp: p.timestamp,
        url: pageUrl,
        intent: "change",
        severity: "important",
        kind: "placement",
        placement: {
          componentType: p.type,
          width: p.width,
          height: p.height,
          scrollY: p.scrollY,
          text: p.text,
        },
      } as Annotation)
        .then((serverAnnotation) => {
          if (currentMap.has(p.id)) {
            currentMap.set(p.id, serverAnnotation.id);
          }
        })
        .catch((err) => {
          console.warn("[Agentation] Failed to sync placement annotation:", err);
          currentMap.delete(p.id);
        });
    }

    // Delete annotations for removed placements
    for (const [placementId, annotationId] of currentMap) {
      if (!currentIds.has(placementId)) {
        currentMap.delete(placementId);
        if (annotationId) {
          deleteAnnotationFromServer(endpoint, annotationId).catch(() => {});
        }
      }
    }
  });

  // Sync rearrange shadow annotations to server (debounced)
  createEffect(() => {
    const endpoint = props.endpoint;
    const sessId = currentSessionId();
    const rs = rearrangeState();
    if (!endpoint || !sessId) return;

    if (rearrangeDebounceTimer) {
      clearTimeout(rearrangeDebounceTimer);
    }

    rearrangeDebounceTimer = originalSetTimeout(() => {
      const currentMap = rearrangeAnnotationMap;

      if (!rs || rs.sections.length === 0) {
        // Rearrange cleared — delete all shadow annotations
        for (const [, annotationId] of currentMap) {
          if (annotationId) {
            deleteAnnotationFromServer(endpoint, annotationId).catch(() => {});
          }
        }
        currentMap.clear();
        return;
      }

      const currentIds = new Set(rs.sections.map((s) => s.id));
      const pageUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search + window.location.hash
          : pathname;

      // Check which sections have actually changed from original
      for (const section of rs.sections) {
        const orig = section.originalRect;
        const curr = section.currentRect;
        const hasMoved =
          Math.abs(orig.x - curr.x) > 1 ||
          Math.abs(orig.y - curr.y) > 1 ||
          Math.abs(orig.width - curr.width) > 1 ||
          Math.abs(orig.height - curr.height) > 1;

        if (!hasMoved) {
          // Section returned to original — delete annotation if exists
          const existingId = currentMap.get(section.id);
          if (existingId) {
            currentMap.delete(section.id);
            deleteAnnotationFromServer(endpoint, existingId).catch(() => {});
          }
          continue;
        }

        const existingAnnotationId = currentMap.get(section.id);
        if (existingAnnotationId) {
          // Update existing
          updateAnnotationOnServer(endpoint, existingAnnotationId, {
            comment: `Move ${section.label} section (${section.tagName}) — from (${Math.round(orig.x)},${Math.round(orig.y)}) ${Math.round(orig.width)}×${Math.round(orig.height)} to (${Math.round(curr.x)},${Math.round(curr.y)}) ${Math.round(curr.width)}×${Math.round(curr.height)}`,
          }).catch((err) => {
            console.warn("[Agentation] Failed to update rearrange annotation:", err);
          });
        } else {
          // Create new
          currentMap.set(section.id, "");

          syncAnnotation(endpoint, sessId, {
            id: section.id,
            x: (curr.x / window.innerWidth) * 100,
            y: curr.y,
            comment: `Move ${section.label} section (${section.tagName}) — from (${Math.round(orig.x)},${Math.round(orig.y)}) ${Math.round(orig.width)}×${Math.round(orig.height)} to (${Math.round(curr.x)},${Math.round(curr.y)}) ${Math.round(curr.width)}×${Math.round(curr.height)}`,
            element: section.selector,
            elementPath: "[rearrange]",
            timestamp: Date.now(),
            url: pageUrl,
            intent: "change",
            severity: "important",
            kind: "rearrange",
            rearrange: {
              selector: section.selector,
              label: section.label,
              tagName: section.tagName,
              originalRect: orig,
              currentRect: curr,
            },
          } as Annotation)
            .then((serverAnnotation) => {
              if (currentMap.has(section.id)) {
                currentMap.set(section.id, serverAnnotation.id);
              }
            })
            .catch((err) => {
              console.warn("[Agentation] Failed to sync rearrange annotation:", err);
              currentMap.delete(section.id);
            });
        }
      }

      // Delete annotations for sections no longer in state
      for (const [sectionId, annotationId] of currentMap) {
        if (!currentIds.has(sectionId)) {
          currentMap.delete(sectionId);
          if (annotationId) {
            deleteAnnotationFromServer(endpoint, annotationId).catch(() => {});
          }
        }
      }
    }, 300);

    onCleanup(() => {
      if (rearrangeDebounceTimer) {
        clearTimeout(rearrangeDebounceTimer);
      }
    });
  });

  // Visually move/resize original DOM elements to match rearrange state.
  type MovedEntry = {
    el: HTMLElement;
    origStyles: { transform: string; transformOrigin: string; opacity: string; position: string; zIndex: string; display: string };
    ancestors: { el: HTMLElement; overflow: string }[];
  };
  let rearrangeMovedEls = new Map<string, MovedEntry>();
  createEffect(() => {
    const sections = rearrangeState()?.sections ?? [];
    const active = new Set<string>();
    const dm = isDesignMode();
    const doe = designOverlayExiting();
    const ia = isActive();

    if ((dm || doe) && ia) {
      for (const s of sections) {
        active.add(s.id);
        try {
          const el = document.querySelector(s.selector) as HTMLElement | null;
          if (!el) continue;

          // Elevate on first encounter
          if (!rearrangeMovedEls.has(s.id)) {
            const origStyles = {
              transform: el.style.transform,
              transformOrigin: el.style.transformOrigin,
              opacity: el.style.opacity,
              position: el.style.position,
              zIndex: el.style.zIndex,
              display: el.style.display,
            };

            const ancestors: { el: HTMLElement; overflow: string }[] = [];
            let parent = el.parentElement;
            while (parent && parent !== document.body) {
              const cs = getComputedStyle(parent);
              if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible") {
                ancestors.push({ el: parent, overflow: parent.style.overflow });
                parent.style.overflow = "visible";
              }
              parent = parent.parentElement;
            }

            const computed = getComputedStyle(el);
            if (computed.display === "inline") {
              el.style.display = "inline-block";
            }

            rearrangeMovedEls.set(s.id, { el, origStyles, ancestors });
            el.style.transformOrigin = "top left";
            el.style.zIndex = "9999";
          }
        } catch { /* invalid selector */ }
      }
    }

    // Restore elements that are no longer captured or layout mode exited
    for (const [id, entry] of rearrangeMovedEls) {
      if (!active.has(id)) {
        const { el, origStyles, ancestors } = entry;
        el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = origStyles.transform;
        el.style.transformOrigin = origStyles.transformOrigin;
        el.style.opacity = origStyles.opacity;
        el.style.position = origStyles.position;
        el.style.zIndex = origStyles.zIndex;
        rearrangeMovedEls.delete(id);
        originalSetTimeout(() => {
          el.style.transition = "";
          el.style.display = origStyles.display;
          for (const a of ancestors) {
            a.el.style.overflow = a.overflow;
          }
        }, 450);
      }
    }
  });

  // Clean up all moved elements on unmount
  onCleanup(() => {
    for (const [, entry] of rearrangeMovedEls) {
      const { el, origStyles, ancestors } = entry;
      el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = origStyles.transform;
      el.style.transformOrigin = origStyles.transformOrigin;
      el.style.opacity = origStyles.opacity;
      el.style.position = origStyles.position;
      el.style.zIndex = origStyles.zIndex;
      setTimeout(() => {
        el.style.transition = "";
        el.style.display = origStyles.display;
        for (const a of ancestors) {
          a.el.style.overflow = a.overflow;
        }
      }, 450);
    }
    rearrangeMovedEls.clear();
  });

  // Close layout mode — palette + overlays exit concurrently
  const closeDesignMode = () => {
    setDesignOverlayExiting(true);
    setIsDesignMode(false);
    setActiveDesignComponent(null);
    clearTimeout(designExitTimer);
    designExitTimer = setTimeout(() => {
      setDesignOverlayExiting(false);
    }, 300);
  };

  // Deactivate toolbar — if in layout mode, animate out overlays independently
  const deactivate = () => {
    if (isDesignMode()) {
      setDesignOverlayExiting(true);
      setIsDesignMode(false);
      setActiveDesignComponent(null);
      clearTimeout(designExitTimer);
      designExitTimer = setTimeout(() => {
        setDesignOverlayExiting(false);
      }, 300);
    }
    setIsActive(false);
  };

  // Freeze animations (delegates to freeze-animations utility)
  const freezeAnimations = () => {
    if (isFrozen()) return;
    freezeAll();
    setIsFrozen(true);
  };

  const unfreezeAnimations = () => {
    if (!isFrozen()) return;
    unfreezeAll();
    setIsFrozen(false);
  };

  const toggleFreeze = () => {
    if (isFrozen()) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  };

  // Create pending annotation from cmd+shift+click multi-select
  const createMultiSelectPendingAnnotation = () => {
    if (pendingMultiSelectElements().length === 0) return;

    const elements = pendingMultiSelectElements();
    const firstItem = elements[0];
    const firstEl = firstItem.element;
    const isMulti = elements.length > 1;

    // Get fresh rects for all elements
    const freshRects = elements.map((item) =>
      item.element.getBoundingClientRect(),
    );

    if (!isMulti) {
      // Single element - treat as regular annotation (not multi-select)
      const rect = freshRects[0];
      const isFixed = isElementFixed(firstEl);

      setPendingAnnotation({
        x: (rect.left / window.innerWidth) * 100,
        y: isFixed ? rect.top : rect.top + window.scrollY,
        clientY: rect.top,
        element: firstItem.name,
        elementPath: firstItem.path,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        isFixed,
        fullPath: getFullElementPath(firstEl),
        accessibility: getAccessibilityInfo(firstEl),
        computedStyles: getForensicComputedStyles(firstEl),
        computedStylesObj: getDetailedComputedStyles(firstEl),
        nearbyElements: getNearbyElements(firstEl),
        cssClasses: getElementClasses(firstEl),
        nearbyText: getNearbyText(firstEl),
        reactComponents: firstItem.reactComponents,
        sourceFile: detectSourceFile(firstEl),
      });
    } else {
      // Multiple elements - multi-select annotation
      const bounds = {
        left: Math.min(...freshRects.map((r) => r.left)),
        top: Math.min(...freshRects.map((r) => r.top)),
        right: Math.max(...freshRects.map((r) => r.right)),
        bottom: Math.max(...freshRects.map((r) => r.bottom)),
      };

      const names = elements
        .slice(0, 5)
        .map((item) => item.name)
        .join(", ");
      const suffix =
        elements.length > 5
          ? ` +${elements.length - 5} more`
          : "";

      const elementBoundingBoxes = freshRects.map((rect) => ({
        x: rect.left,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      }));

      // Position marker near the last selected element (most recent click)
      const lastItem = elements[elements.length - 1];
      const lastEl = lastItem.element;
      const lastRect = freshRects[freshRects.length - 1];
      const lastCenterX = lastRect.left + lastRect.width / 2;
      const lastCenterY = lastRect.top + lastRect.height / 2;
      const lastIsFixed = isElementFixed(lastEl);

      setPendingAnnotation({
        x: (lastCenterX / window.innerWidth) * 100,
        y: lastIsFixed ? lastCenterY : lastCenterY + window.scrollY,
        clientY: lastCenterY,
        element: `${elements.length} elements: ${names}${suffix}`,
        elementPath: "multi-select",
        boundingBox: {
          x: bounds.left,
          y: bounds.top + window.scrollY,
          width: bounds.right - bounds.left,
          height: bounds.bottom - bounds.top,
        },
        isMultiSelect: true,
        isFixed: lastIsFixed,
        elementBoundingBoxes,
        multiSelectElements: elements.map((item) => item.element),
        targetElement: lastEl, // Anchor marker/popup to last clicked element
        fullPath: getFullElementPath(firstEl),
        accessibility: getAccessibilityInfo(firstEl),
        computedStyles: getForensicComputedStyles(firstEl),
        computedStylesObj: getDetailedComputedStyles(firstEl),
        nearbyElements: getNearbyElements(firstEl),
        cssClasses: getElementClasses(firstEl),
        nearbyText: getNearbyText(firstEl),
        sourceFile: detectSourceFile(firstEl),
      });
    }

    setPendingMultiSelectElements([]);
    setHoverInfo(null);
  };

  // Reset state when deactivating
  createEffect(() => {
    if (!isActive()) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setHoverInfo(null);
      setShowSettings(false); // Close settings when toolbar closes
      setPendingMultiSelectElements([]); // Clear multi-select
      modifiersHeld = { cmd: false, shift: false }; // Reset modifier tracking
      if (isFrozen()) {
        unfreezeAnimations();
      }
    }
  });

  // Unmount safety — if component is removed while frozen, unfreeze the page
  onCleanup(() => {
    unfreezeAll();
  });

  // Custom cursor
  createEffect(() => {
    if (!isActive()) return;

    const textElementsSelector = [
      "p", "span", "h1", "h2", "h3", "h4", "h5", "h6",
      "li", "td", "th", "label", "blockquote", "figcaption",
      "caption", "legend", "dt", "dd", "pre", "code",
      "em", "strong", "b", "i", "u", "s", "a",
      "time", "address", "cite", "q", "abbr", "dfn",
      "mark", "small", "sub", "sup", "[contenteditable]"
    ].join(", ");

    const notAgentationSelector = `:not([data-agentation-root]):not([data-agentation-root] *)`;

    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
    // Text elements get text cursor (higher specificity with body prefix)
    // Everything else gets crosshair
    style.textContent = `
      body ${notAgentationSelector} {
        cursor: crosshair !important;
      }

      body :is(${textElementsSelector})${notAgentationSelector} {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);

    onCleanup(() => {
      const existingStyle = document.getElementById("feedback-cursor-styles");
      if (existingStyle) existingStyle.remove();
    });
  });

  // Cursor change when hovering a drawing stroke
  createEffect(() => {
    if (hoveredDrawingIdx() !== null && isActive()) {
      document.documentElement.setAttribute("data-drawing-hover", "");
      onCleanup(() => document.documentElement.removeAttribute("data-drawing-hover"));
    }
  });

  // Handle mouse move
  createEffect(() => {
    if (!isActive() || pendingAnnotation() || isDrawMode() || isDesignMode()) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Use composedPath to get actual target inside shadow DOM
      const target = (e.composedPath()[0] || e.target) as HTMLElement;
      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }

      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (
        !elementUnder ||
        closestCrossingShadow(elementUnder, "[data-feedback-toolbar]")
      ) {
        setHoverInfo(null);
        return;
      }

      const { name, elementName, path, reactComponents } =
        identifyElementWithComponents(elementUnder, effectiveReactMode());
      const rect = elementUnder.getBoundingClientRect();

      setHoverInfo({
        element: name,
        elementName,
        elementPath: path,
        rect,
        reactComponents,
      });
      setHoverPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });

  // Handle click
  createEffect(() => {
    if (!isActive() || isDrawMode() || isDesignMode()) return;

    const handleClick = (e: MouseEvent) => {
      if (justFinishedDragRef) {
        justFinishedDragRef = false;
        return;
      }

      // Use composedPath to get actual target inside shadow DOM, falling back to e.target
      const target = (e.composedPath()[0] || e.target) as HTMLElement;

      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;

      // Handle cmd+shift+click for multi-element selection
      if (e.metaKey && e.shiftKey && !pendingAnnotation() && !editingAnnotation()) {
        e.preventDefault();
        e.stopPropagation();

        const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
        if (!elementUnder) return;

        const rect = elementUnder.getBoundingClientRect();
        const { name, path, reactComponents } = identifyElementWithComponents(
          elementUnder,
          effectiveReactMode(),
        );

        // Toggle: check if already selected
        const existingIndex = pendingMultiSelectElements().findIndex(
          (item) => item.element === elementUnder,
        );

        if (existingIndex >= 0) {
          // Deselect
          setPendingMultiSelectElements((prev) =>
            prev.filter((_, i) => i !== existingIndex),
          );
        } else {
          // Select
          setPendingMultiSelectElements((prev) => [
            ...prev,
            {
              element: elementUnder,
              rect,
              name,
              path,
              reactComponents: reactComponents ?? undefined,
            },
          ]);
        }
        return;
      }

      const isInteractive = closestCrossingShadow(
        target,
        "button, a, input, select, textarea, [role='button'], [onclick]",
      );

      // Block interactions on interactive elements when enabled
      if (settings().blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
        // Still create annotation on the interactive element
      }

      if (pendingAnnotation()) {
        if (isInteractive && !settings().blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef?.shake();
        return;
      }

      if (editingAnnotation()) {
        if (isInteractive && !settings().blockInteractions) {
          return;
        }
        e.preventDefault();
        editPopupRef?.shake();
        return;
      }

      e.preventDefault();

      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (!elementUnder) return;

      const { name, path, reactComponents } = identifyElementWithComponents(
        elementUnder,
        effectiveReactMode(),
      );
      const rect = elementUnder.getBoundingClientRect();
      const x = (e.clientX / window.innerWidth) * 100;

      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;

      const selection = window.getSelection();
      let selectedText: string | undefined;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }

      // Capture computed styles - filtered for popup, full for forensic output
      const computedStylesObj = getDetailedComputedStyles(elementUnder);
      const computedStylesStr = getForensicComputedStyles(elementUnder);

      setPendingAnnotation({
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed,
        fullPath: getFullElementPath(elementUnder),
        accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: computedStylesStr,
        computedStylesObj,
        nearbyElements: getNearbyElements(elementUnder),
        reactComponents: reactComponents ?? undefined,
        sourceFile: detectSourceFile(elementUnder),
        targetElement: elementUnder, // Store for live position queries
      });
      setHoverInfo(null);
    };

    // Use capture phase to intercept before element handlers
    document.addEventListener("click", handleClick, true);
    onCleanup(() => document.removeEventListener("click", handleClick, true));
  });

  // Cmd+shift+click multi-select: keyup listener for modifier release
  createEffect(() => {
    if (!isActive()) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta") modifiersHeld.cmd = true;
      if (e.key === "Shift") modifiersHeld.shift = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const wasHoldingBoth =
        modifiersHeld.cmd && modifiersHeld.shift;

      if (e.key === "Meta") modifiersHeld.cmd = false;
      if (e.key === "Shift") modifiersHeld.shift = false;

      const nowHoldingBoth =
        modifiersHeld.cmd && modifiersHeld.shift;

      // Released modifier while holding elements -> trigger popup
      if (
        wasHoldingBoth &&
        !nowHoldingBoth &&
        pendingMultiSelectElements().length > 0
      ) {
        createMultiSelectPendingAnnotation();
      }
    };

    // Reset modifier state AND clear selection when window loses focus (e.g., cmd+tab away)
    const handleBlur = () => {
      modifiersHeld = { cmd: false, shift: false };
      setPendingMultiSelectElements([]);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    });
  });

  // Multi-select drag - mousedown
  createEffect(() => {
    if (!isActive() || pendingAnnotation() || isDrawMode() || isDesignMode()) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Use composedPath to get actual target inside shadow DOM
      const target = (e.composedPath()[0] || e.target) as HTMLElement;

      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;

      // Don't start drag on text elements - allow native text selection
      const textTags = new Set([
        "P",
        "SPAN",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "LI",
        "TD",
        "TH",
        "LABEL",
        "BLOCKQUOTE",
        "FIGCAPTION",
        "CAPTION",
        "LEGEND",
        "DT",
        "DD",
        "PRE",
        "CODE",
        "EM",
        "STRONG",
        "B",
        "I",
        "U",
        "S",
        "A",
        "TIME",
        "ADDRESS",
        "CITE",
        "Q",
        "ABBR",
        "DFN",
        "MARK",
        "SMALL",
        "SUB",
        "SUP",
      ]);

      if (textTags.has(target.tagName) || target.isContentEditable) {
        return;
      }

      e.preventDefault(); // Prevent text selection during drag area annotation
      mouseDownPosRef = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousedown", handleMouseDown);
    onCleanup(() => document.removeEventListener("mousedown", handleMouseDown));
  });

  // Multi-select drag - mousemove (fully optimized with direct DOM updates)
  createEffect(() => {
    if (!isActive() || pendingAnnotation()) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownPosRef) return;

      const dx = e.clientX - mouseDownPosRef.x;
      const dy = e.clientY - mouseDownPosRef.y;
      const distance = dx * dx + dy * dy;
      const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;

      if (!isDragging() && distance >= thresholdSq) {
        dragStartRef = mouseDownPosRef;
        setIsDragging(true);
        e.preventDefault(); // Prevent text selection during drag
      }

      if ((isDragging() || distance >= thresholdSq) && dragStartRef) {
        // Direct DOM update for drag rectangle - no state
        if (dragRectRef) {
          const left = Math.min(dragStartRef.x, e.clientX);
          const top = Math.min(dragStartRef.y, e.clientY);
          const width = Math.abs(e.clientX - dragStartRef.x);
          const height = Math.abs(e.clientY - dragStartRef.y);
          dragRectRef.style.transform = `translate(${left}px, ${top}px)`;
          dragRectRef.style.width = `${width}px`;
          dragRectRef.style.height = `${height}px`;
        }

        // Throttle element detection (still no framework re-renders)
        const now = Date.now();
        if (now - lastElementUpdateRef < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef = now;

        const startX = dragStartRef.x;
        const startY = dragStartRef.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;

        // Sample corners, edges, and center for element detection
        const candidateElements = new Set<HTMLElement>();
        const points = [
          [left, top],
          [right, top],
          [left, bottom],
          [right, bottom],
          [midX, midY],
          [midX, top],
          [midX, bottom],
          [left, midY],
          [right, midY],
        ];

        for (const [x, y] of points) {
          const elements = document.elementsFromPoint(x, y);
          for (const el of elements) {
            if (el instanceof HTMLElement) candidateElements.add(el);
          }
        }

        // Also check nearby elements
        const nearbyElements = document.querySelectorAll(
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav",
        );
        for (const el of nearbyElements) {
          if (el instanceof HTMLElement) {
            const rect = el.getBoundingClientRect();
            // Check if element's center point is inside or if it overlaps significantly
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const centerInside =
              centerX >= left &&
              centerX <= right &&
              centerY >= top &&
              centerY <= bottom;

            const overlapX =
              Math.min(rect.right, right) - Math.max(rect.left, left);
            const overlapY =
              Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
            const overlapArea =
              overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
            const elementArea = rect.width * rect.height;
            const overlapRatio =
              elementArea > 0 ? overlapArea / elementArea : 0;

            if (centerInside || overlapRatio > 0.5) {
              candidateElements.add(el);
            }
          }
        }

        const allMatching: DOMRect[] = [];
        const meaningfulTags = new Set([
          "BUTTON",
          "A",
          "INPUT",
          "IMG",
          "P",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "LI",
          "LABEL",
          "TD",
          "TH",
          "SECTION",
          "ARTICLE",
          "ASIDE",
          "NAV",
        ]);

        for (const el of candidateElements) {
          if (
            closestCrossingShadow(el, "[data-feedback-toolbar]") ||
            closestCrossingShadow(el, "[data-annotation-marker]")
          )
            continue;

          const rect = el.getBoundingClientRect();
          if (
            rect.width > window.innerWidth * 0.8 &&
            rect.height > window.innerHeight * 0.5
          )
            continue;
          if (rect.width < 10 || rect.height < 10) continue;

          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            const tagName = el.tagName;
            let shouldInclude = meaningfulTags.has(tagName);

            // For divs and spans, only include if they have meaningful content
            if (!shouldInclude && (tagName === "DIV" || tagName === "SPAN")) {
              const hasText =
                el.textContent && el.textContent.trim().length > 0;
              const isInteractive =
                el.onclick !== null ||
                el.getAttribute("role") === "button" ||
                el.getAttribute("role") === "link" ||
                el.classList.contains("clickable") ||
                el.hasAttribute("data-clickable");

              if (
                (hasText || isInteractive) &&
                !el.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")
              ) {
                shouldInclude = true;
              }
            }

            if (shouldInclude) {
              // Check if any existing match contains this element (filter children)
              let dominated = false;
              for (const existingRect of allMatching) {
                if (
                  existingRect.left <= rect.left &&
                  existingRect.right >= rect.right &&
                  existingRect.top <= rect.top &&
                  existingRect.bottom >= rect.bottom
                ) {
                  // Existing rect contains this one - keep the smaller one
                  dominated = true;
                  break;
                }
              }
              if (!dominated) allMatching.push(rect);
            }
          }
        }

        // Direct DOM update for highlights - no state
        if (highlightsContainerRef) {
          const container = highlightsContainerRef;
          // Reuse existing divs or create new ones
          while (container.children.length > allMatching.length) {
            container.removeChild(container.lastChild!);
          }
          allMatching.forEach((rect, i) => {
            let div = container.children[i] as HTMLDivElement;
            if (!div) {
              div = document.createElement("div");
              div.className = styles.selectedElementHighlight;
              container.appendChild(div);
            }
            div.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
          });
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });

  // Multi-select drag - mouseup
  createEffect(() => {
    if (!isActive()) return;

    const handleMouseUp = (e: MouseEvent) => {
      const wasDragging = isDragging();
      const dragStart = dragStartRef;

      if (isDragging() && dragStart) {
        justFinishedDragRef = true;

        // Do final element detection for accurate count
        const left = Math.min(dragStart.x, e.clientX);
        const top = Math.min(dragStart.y, e.clientY);
        const right = Math.max(dragStart.x, e.clientX);
        const bottom = Math.max(dragStart.y, e.clientY);

        // Query all meaningful elements and check bounding box intersection
        const allMatching: { element: HTMLElement; rect: DOMRect }[] = [];
        const selector =
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th";

        document.querySelectorAll(selector).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (
            closestCrossingShadow(el, "[data-feedback-toolbar]") ||
            closestCrossingShadow(el, "[data-annotation-marker]")
          )
            return;

          const rect = el.getBoundingClientRect();
          if (
            rect.width > window.innerWidth * 0.8 &&
            rect.height > window.innerHeight * 0.5
          )
            return;
          if (rect.width < 10 || rect.height < 10) return;

          // Check if element intersects with selection
          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            allMatching.push({ element: el, rect });
          }
        });

        // Filter out parent elements that contain other matched elements
        const finalElements = allMatching.filter(
          ({ element: el }) =>
            !allMatching.some(
              ({ element: other }) => other !== el && el.contains(other),
            ),
        );

        const x = (e.clientX / window.innerWidth) * 100;
        const y = e.clientY + window.scrollY;

        if (finalElements.length > 0) {
          const bounds = finalElements.reduce(
            (acc, { rect }) => ({
              left: Math.min(acc.left, rect.left),
              top: Math.min(acc.top, rect.top),
              right: Math.max(acc.right, rect.right),
              bottom: Math.max(acc.bottom, rect.bottom),
            }),
            {
              left: Infinity,
              top: Infinity,
              right: -Infinity,
              bottom: -Infinity,
            },
          );

          const elementNames = finalElements
            .slice(0, 5)
            .map(({ element }) => identifyElement(element).name)
            .join(", ");
          const suffix =
            finalElements.length > 5
              ? ` +${finalElements.length - 5} more`
              : "";

          // Capture computed styles from first element - filtered for popup, full for forensic output
          const firstElement = finalElements[0].element;
          const firstElementComputedStyles =
            getDetailedComputedStyles(firstElement);
          const firstElementComputedStylesStr =
            getForensicComputedStyles(firstElement);

          setPendingAnnotation({
            x,
            y,
            clientY: e.clientY,
            element: `${finalElements.length} elements: ${elementNames}${suffix}`,
            elementPath: "multi-select",
            boundingBox: {
              x: bounds.left,
              y: bounds.top + window.scrollY,
              width: bounds.right - bounds.left,
              height: bounds.bottom - bounds.top,
            },
            isMultiSelect: true,
            // Forensic data from first element
            fullPath: getFullElementPath(firstElement),
            accessibility: getAccessibilityInfo(firstElement),
            computedStyles: firstElementComputedStylesStr,
            computedStylesObj: firstElementComputedStyles,
            nearbyElements: getNearbyElements(firstElement),
            cssClasses: getElementClasses(firstElement),
            nearbyText: getNearbyText(firstElement),
            sourceFile: detectSourceFile(firstElement),
          });
        } else {
          // No elements selected, but allow annotation on empty area
          const width = Math.abs(right - left);
          const height = Math.abs(bottom - top);

          // Only create if drag area is meaningful size (not just a click)
          if (width > 20 && height > 20) {
            setPendingAnnotation({
              x,
              y,
              clientY: e.clientY,
              element: "Area selection",
              elementPath: `region at (${Math.round(left)}, ${Math.round(top)})`,
              boundingBox: {
                x: left,
                y: top + window.scrollY,
                width,
                height,
              },
              isMultiSelect: true,
            });
          }
        }
        setHoverInfo(null);
      } else if (wasDragging) {
        justFinishedDragRef = true;
      }

      mouseDownPosRef = null;
      dragStartRef = null;
      setIsDragging(false);
      // Clear highlights container
      if (highlightsContainerRef) {
        highlightsContainerRef.innerHTML = "";
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    onCleanup(() => document.removeEventListener("mouseup", handleMouseUp));
  });

  // Fire webhook for annotation events - returns true on success, false on failure
  const fireWebhook = async (
    event: string,
    payload: Record<string, unknown>,
    force?: boolean,
  ): Promise<boolean> => {
    // Settings webhookUrl overrides prop
    const targetUrl = settings().webhookUrl || props.webhookUrl;
    // Skip if no URL, or if webhooks disabled (unless force is true for manual sends)
    if (!targetUrl || (!settings().webhooksEnabled && !force)) return false;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          timestamp: Date.now(),
          url:
            typeof window !== "undefined" ? window.location.href : undefined,
          ...payload,
        }),
      });
      return response.ok;
    } catch (error) {
      console.warn("[Agentation] Webhook failed:", error);
      return false;
    }
  };

  // Add annotation
  const addAnnotation = (comment: string) => {
    const pending = pendingAnnotation();
    if (!pending) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x: pending.x,
      y: pending.y,
      comment,
      element: pending.element,
      elementPath: pending.elementPath,
      timestamp: Date.now(),
      selectedText: pending.selectedText,
      boundingBox: pending.boundingBox,
      nearbyText: pending.nearbyText,
      cssClasses: pending.cssClasses,
      isMultiSelect: pending.isMultiSelect,
      isFixed: pending.isFixed,
      fullPath: pending.fullPath,
      accessibility: pending.accessibility,
      computedStyles: pending.computedStyles,
      nearbyElements: pending.nearbyElements,
      reactComponents: pending.reactComponents,
      sourceFile: pending.sourceFile,
      elementBoundingBoxes: pending.elementBoundingBoxes,
      // Protocol fields for server sync
      ...(props.endpoint && currentSessionId()
        ? {
            sessionId: currentSessionId()!,
            url:
              typeof window !== "undefined"
                ? window.location.href
                : undefined,
            status: "pending" as const,
          }
        : {}),
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    // Prevent immediate hover on newly added marker
    recentlyAddedIdRef = newAnnotation.id;
    originalSetTimeout(() => {
      recentlyAddedIdRef = null;
    }, 300);
    // Mark as needing animation (will be set to animated after animation completes)
    originalSetTimeout(() => {
      setAnimatedMarkers((prev) => new Set(prev).add(newAnnotation.id));
    }, 250);

    // Fire callback
    props.onAnnotationAdd?.(newAnnotation);
    fireWebhook("annotation.add", { annotation: newAnnotation });

    // Animate out the pending annotation UI
    setPendingExiting(true);
    originalSetTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);

    window.getSelection()?.removeAllRanges();

    // Sync to server (non-blocking, but update local ID with server's ID)
    if (props.endpoint && currentSessionId()) {
      syncAnnotation(props.endpoint, currentSessionId()!, newAnnotation)
        .then((serverAnnotation) => {
          // Update local annotation with server-assigned ID
          if (serverAnnotation.id !== newAnnotation.id) {
            setAnnotations((prev) =>
              prev.map((a) =>
                a.id === newAnnotation.id
                  ? { ...a, id: serverAnnotation.id }
                  : a,
              ),
            );
            // Also update the animated markers set
            setAnimatedMarkers((prev) => {
              const next = new Set(prev);
              next.delete(newAnnotation.id);
              next.add(serverAnnotation.id);
              return next;
            });
          }
        })
        .catch((error) => {
          console.warn("[Agentation] Failed to sync annotation:", error);
        });
    }
  };

  // Cancel annotation with exit animation
  const cancelAnnotation = () => {
    setPendingExiting(true);
    originalSetTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150); // Match exit animation duration
  };

  // Delete annotation with exit animation
  const deleteAnnotation = (id: string) => {
    const anns = annotations();
    const deletedIndex = anns.findIndex((a) => a.id === id);
    const deletedAnnotation = anns[deletedIndex];

    // Close edit panel with exit animation if deleting the annotation being edited
    if (editingAnnotation()?.id === id) {
      setEditExiting(true);
      originalSetTimeout(() => {
        setEditingAnnotation(null);
        setEditingTargetElement(null);
        setEditingTargetElements([]);
        setEditExiting(false);
      }, 150);
    }

    setDeletingMarkerId(id);
    setExitingMarkers((prev) => new Set(prev).add(id));

    // Fire callback
    if (deletedAnnotation) {
      props.onAnnotationDelete?.(deletedAnnotation);
      fireWebhook("annotation.delete", { annotation: deletedAnnotation });
    }

    // Sync delete to server (non-blocking)
    if (props.endpoint) {
      deleteAnnotationFromServer(props.endpoint, id).catch((error) => {
        console.warn(
          "[Agentation] Failed to delete annotation from server:",
          error,
        );
      });
    }

    // Wait for exit animation then remove
    originalSetTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
      setExitingMarkers((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDeletingMarkerId(null);

      // Trigger renumber animation for markers after deleted one
      if (deletedIndex < anns.length - 1) {
        setRenumberFrom(deletedIndex);
        originalSetTimeout(() => setRenumberFrom(null), 200);
      }
    }, 150);
  };

  // Start editing an annotation (right-click)
  const startEditAnnotation = (annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
    setHoveredTargetElement(null);
    setHoveredTargetElements([]);

    // Try to find elements at the annotation's position(s) for live tracking
    if (annotation.elementBoundingBoxes?.length) {
      // Cmd+shift+click: find element at each bounding box center
      const elements: HTMLElement[] = [];
      for (const bb of annotation.elementBoundingBoxes) {
        const centerX = bb.x + bb.width / 2;
        const centerY = bb.y + bb.height / 2 - window.scrollY;
        const el = deepElementFromPoint(centerX, centerY);
        if (el) elements.push(el);
      }
      setEditingTargetElements(elements);
      setEditingTargetElement(null);
    } else if (annotation.boundingBox) {
      // Single element
      const bb = annotation.boundingBox;
      const centerX = bb.x + bb.width / 2;
      // Convert document coords to viewport coords (unless fixed)
      const centerY = annotation.isFixed
        ? bb.y + bb.height / 2
        : bb.y + bb.height / 2 - window.scrollY;
      const el = deepElementFromPoint(centerX, centerY);

      // Validate found element's size roughly matches stored bounding box
      if (el) {
        const elRect = el.getBoundingClientRect();
        const widthRatio = elRect.width / bb.width;
        const heightRatio = elRect.height / bb.height;
        if (widthRatio < 0.5 || heightRatio < 0.5) {
          setEditingTargetElement(null);
        } else {
          setEditingTargetElement(el);
        }
      } else {
        setEditingTargetElement(null);
      }
      setEditingTargetElements([]);
    } else {
      setEditingTargetElement(null);
      setEditingTargetElements([]);
    }
  };

  // Handle marker hover - finds element(s) for live position tracking
  const handleMarkerHover = (annotation: Annotation | null) => {
    if (!annotation) {
      setHoveredMarkerId(null);
      setHoveredTargetElement(null);
      setHoveredTargetElements([]);
      return;
    }

    setHoveredMarkerId(annotation.id);

    // Find elements at the annotation's position(s) for live tracking
    if (annotation.elementBoundingBoxes?.length) {
      // Cmd+shift+click: find element at each bounding box center
      const elements: HTMLElement[] = [];
      for (const bb of annotation.elementBoundingBoxes) {
        const centerX = bb.x + bb.width / 2;
        const centerY = bb.y + bb.height / 2 - window.scrollY;
        // Use elementsFromPoint to look through the marker if it's covering
        const allEls = document.elementsFromPoint(centerX, centerY);
        const el = allEls.find(
          (e) => !e.closest('[data-annotation-marker]') && !e.closest('[data-agentation-root]'),
        ) as HTMLElement | undefined;
        if (el) elements.push(el);
      }
      setHoveredTargetElements(elements);
      setHoveredTargetElement(null);
    } else if (annotation.boundingBox) {
      // Single element
      const bb = annotation.boundingBox;
      const centerX = bb.x + bb.width / 2;
      const centerY = annotation.isFixed
        ? bb.y + bb.height / 2
        : bb.y + bb.height / 2 - window.scrollY;
      const el = deepElementFromPoint(centerX, centerY);

      // Validate found element's size roughly matches stored bounding box
      // (prevents using wrong child element when clicking center of a container)
      if (el) {
        const elRect = el.getBoundingClientRect();
        const widthRatio = elRect.width / bb.width;
        const heightRatio = elRect.height / bb.height;
        // If found element is much smaller than stored, it's probably a child - don't use it
        if (widthRatio < 0.5 || heightRatio < 0.5) {
          setHoveredTargetElement(null);
        } else {
          setHoveredTargetElement(el);
        }
      } else {
        setHoveredTargetElement(null);
      }
      setHoveredTargetElements([]);
    } else {
      setHoveredTargetElement(null);
      setHoveredTargetElements([]);
    }
  };

  // Update annotation (edit mode submit)
  const updateAnnotation = (newComment: string) => {
    const editing = editingAnnotation();
    if (!editing) return;

    const updatedAnnotation = { ...editing, comment: newComment };

    setAnnotations((prev) =>
      prev.map((a) =>
        a.id === editing.id ? updatedAnnotation : a,
      ),
    );

    // Fire callback
    props.onAnnotationUpdate?.(updatedAnnotation);
    fireWebhook("annotation.update", { annotation: updatedAnnotation });

    // Sync update to server (non-blocking)
    if (props.endpoint) {
      updateAnnotationOnServer(props.endpoint, editing.id, {
        comment: newComment,
      }).catch((error) => {
        console.warn(
          "[Agentation] Failed to update annotation on server:",
          error,
        );
      });
    }

    // Animate out the edit popup
    setEditExiting(true);
    originalSetTimeout(() => {
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setEditExiting(false);
    }, 150);
  };

  // Cancel editing with exit animation
  const cancelEditAnnotation = () => {
    setEditExiting(true);
    originalSetTimeout(() => {
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setEditExiting(false);
    }, 150);
  };

  // Clear all with staggered animation
  const clearAll = () => {
    const anns = annotations();
    const count = anns.length;
    const hasDesign = designPlacements().length > 0 || !!rearrangeState();
    if (count === 0 && drawStrokes().length === 0 && !hasDesign) return;

    // Fire callback with all annotations before clearing
    props.onAnnotationsClear?.(anns);
    fireWebhook("annotations.clear", { annotations: anns });

    // Sync deletions to server (non-blocking)
    if (props.endpoint) {
      Promise.all(
        anns.map((a) =>
          deleteAnnotationFromServer(props.endpoint!, a.id).catch((error) => {
            console.warn(
              "[Agentation] Failed to delete annotation from server:",
              error,
            );
          }),
        ),
      );

      // Delete shadow annotations for placements
      for (const [, annotationId] of placementAnnotationMap) {
        if (annotationId) {
          deleteAnnotationFromServer(props.endpoint!, annotationId).catch(() => {});
        }
      }
      placementAnnotationMap.clear();

      // Delete shadow annotations for rearrange
      for (const [, annotationId] of rearrangeAnnotationMap) {
        if (annotationId) {
          deleteAnnotationFromServer(props.endpoint!, annotationId).catch(() => {});
        }
      }
      rearrangeAnnotationMap.clear();
    }

    setIsClearing(true);
    setCleared(true);

    // Clear draw strokes
    setDrawStrokes([]);
    if (drawCanvasRef) {
      const ctx = drawCanvasRef.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, drawCanvasRef.width, drawCanvasRef.height);
    }

    // Animate out design placements and rearrange sections, then clear
    if (designPlacements().length > 0 || rearrangeState()) {
      setDesignClearSignal(n => n + 1);
      setRearrangeClearSignal(n => n + 1);
      originalSetTimeout(() => {
        setDesignPlacements([]);
        setRearrangeState(null);
      }, 200);
    }
    if (blankCanvas()) setBlankCanvas(false);
    if (wireframePurpose()) setWireframePurpose("");
    wireframeStashRef = { rearrange: null, placements: [] };
    clearWireframeState(pathname);

    const totalAnimationTime = count * 30 + 200;
    originalSetTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(new Set<string>()); // Reset animated markers
      localStorage.removeItem(getStorageKey(pathname));
      setIsClearing(false);
    }, totalAnimationTime);

    originalSetTimeout(() => setCleared(false), 1500);
  };

  // Copy output
  const copyOutput = async () => {
    const displayUrl =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search +
          window.location.hash
        : pathname;
    const wireframeOnly = isDesignMode() && blankCanvas();

    let output: string;
    if (wireframeOnly) {
      // In wireframe mode, skip annotations and draw strokes — only include layout
      if (designPlacements().length === 0 && !rearrangeState() && !wireframePurpose()) return;
      output = "";
    } else {
      output = generateOutput(
        annotations(),
        displayUrl,
        settings().outputDetail,
      );
      if (!output && drawStrokes().length === 0 && designPlacements().length === 0 && !rearrangeState()) return;
      if (!output) output = `## Page Feedback: ${displayUrl}\n`;
    }

    // Append design layout section if there are placements (or purpose in wireframe mode)
    if (designPlacements().length > 0 || (wireframeOnly && wireframePurpose())) {
      output += "\n" + generateDesignOutput(designPlacements(), {
        width: window.innerWidth,
        height: window.innerHeight,
      }, { blankCanvas: blankCanvas(), wireframePurpose: wireframePurpose() || undefined }, settings().outputDetail);
    }

    // Append rearrange section if sections were reordered
    if (rearrangeState()) {
      const rearrangeOutput = generateRearrangeOutput(rearrangeState()!, settings().outputDetail, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (rearrangeOutput) {
        output += "\n" + rearrangeOutput;
      }
    }

    if (props.copyToClipboard !== false) {
      try {
        await navigator.clipboard.writeText(output);
      } catch {
        // Clipboard may fail (permissions, not HTTPS, etc.) - continue anyway
      }
    }

    // Fire callback with markdown output (always, regardless of clipboard success)
    props.onCopy?.(output);

    setCopied(true);
    originalSetTimeout(() => setCopied(false), 2000);

    if (settings().autoClearAfterCopy) {
      originalSetTimeout(() => clearAll(), 500);
    }
  };

  // Send to webhook
  const sendToWebhook = async () => {
    const displayUrl =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search +
          window.location.hash
        : pathname;
    let output = generateOutput(
      annotations(),
      displayUrl,
      settings().outputDetail,
    );
    if (!output && designPlacements().length === 0 && !rearrangeState()) return;
    if (!output) output = `## Page Feedback: ${displayUrl}\n`;

    // Append design layout section if there are placements
    if (designPlacements().length > 0) {
      output += "\n" + generateDesignOutput(designPlacements(), {
        width: window.innerWidth,
        height: window.innerHeight,
      }, { blankCanvas: blankCanvas(), wireframePurpose: wireframePurpose() || undefined }, settings().outputDetail);
    }

    // Append rearrange section if sections were reordered
    if (rearrangeState()) {
      const rearrangeOutput = generateRearrangeOutput(rearrangeState()!, settings().outputDetail, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (rearrangeOutput) {
        output += "\n" + rearrangeOutput;
      }
    }

    // Fire onSubmit callback
    if (props.onSubmit) {
      props.onSubmit(output, annotations());
    }

    // Start sending (arrow fades)
    setSendState("sending");

    // Brief delay for the fade effect
    await new Promise((resolve) => originalSetTimeout(resolve, 150));

    // Fire webhook and check result (force=true to bypass webhooksEnabled check for manual sends)
    const success = await fireWebhook("submit", { output, annotations: annotations() }, true);

    // Show result
    setSendState(success ? "sent" : "failed");
    originalSetTimeout(() => setSendState("idle"), 2500);

    // Clear annotations if send succeeded and autoClearAfterCopy is enabled
    if (success && settings().autoClearAfterCopy) {
      originalSetTimeout(() => clearAll(), 500);
    }
  };

  // Toolbar dragging - mousemove and mouseup
  createEffect(() => {
    const dsp = dragStartPos();
    if (!dsp) return;

    const TOOLBAR_DRAG_THRESHOLD = 10; // pixels

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dsp.x;
      const deltaY = e.clientY - dsp.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Start dragging once threshold is exceeded
      if (!isDraggingToolbar() && distance > TOOLBAR_DRAG_THRESHOLD) {
        setIsDraggingToolbar(true);
      }

      if (isDraggingToolbar() || distance > TOOLBAR_DRAG_THRESHOLD) {
        // Calculate new position
        let newX = dsp.toolbarX + deltaX;
        let newY = dsp.toolbarY + deltaY;

        // Constrain to viewport
        const padding = 20;
        const wrapperWidth = 337; // .toolbar wrapper width
        const toolbarHeight = 44;

        // Content is right-aligned within wrapper via margin-left: auto
        // Calculate content width based on state
        const contentWidth = isActive()
          ? connectionStatus() === "connected"
            ? 297
            : 257
          : 44; // collapsed circle

        // Content offset from wrapper left edge
        const contentOffset = wrapperWidth - contentWidth;

        // Min X: content left edge >= padding
        const minX = padding - contentOffset;
        // Max X: wrapper right edge <= viewport - padding
        const maxX = window.innerWidth - padding - wrapperWidth;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(
          padding,
          Math.min(window.innerHeight - toolbarHeight - padding, newY),
        );

        setToolbarPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      // If we were actually dragging, set flag to prevent click event
      if (isDraggingToolbar()) {
        justFinishedToolbarDragRef = true;
      }
      setIsDraggingToolbar(false);
      setDragStartPos(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    onCleanup(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    });
  });

  // Handle toolbar drag start
  const handleToolbarMouseDown = (e: MouseEvent) => {
    // Only drag when clicking the toolbar background (not buttons or settings)
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest('[data-agentation-settings-panel]')
    ) {
      return;
    }

    // Don't prevent default yet - let onClick work for collapsed state

    // Get toolbar parent's actual current position (toolbarPosition is applied to parent)
    const toolbarParent = (e.currentTarget as HTMLElement).parentElement;
    if (!toolbarParent) return;

    const rect = toolbarParent.getBoundingClientRect();
    const pos = toolbarPosition();
    const currentX = pos?.x ?? rect.left;
    const currentY = pos?.y ?? rect.top;

    setDragStartPos({
      x: e.clientX,
      y: e.clientY,
      toolbarX: currentX,
      toolbarY: currentY,
    });
    // Don't set isDraggingToolbar yet - wait for actual movement
  };

  // Keep toolbar in view on window resize and when toolbar expands/collapses
  createEffect(() => {
    const pos = toolbarPosition();
    if (!pos) return;

    const constrainPosition = () => {
      const padding = 20;
      const wrapperWidth = 337; // .toolbar wrapper width
      const toolbarHeight = 44;

      let newX = pos.x;
      let newY = pos.y;

      // Content is right-aligned within wrapper via margin-left: auto
      // Calculate content width based on state
      const contentWidth = isActive()
        ? connectionStatus() === "connected"
          ? 297
          : 257
        : 44; // collapsed circle

      // Content offset from wrapper left edge
      const contentOffset = wrapperWidth - contentWidth;

      // Min X: content left edge >= padding
      const minX = padding - contentOffset;
      // Max X: wrapper right edge <= viewport - padding
      const maxX = window.innerWidth - padding - wrapperWidth;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(
        padding,
        Math.min(window.innerHeight - toolbarHeight - padding, newY),
      );

      // Only update if position changed
      if (newX !== pos.x || newY !== pos.y) {
        setToolbarPosition({ x: newX, y: newY });
      }
    };

    // Constrain immediately when isActive changes or on mount
    constrainPosition();

    window.addEventListener("resize", constrainPosition);
    onCleanup(() => window.removeEventListener("resize", constrainPosition));
  });

  // Keyboard shortcuts
  createEffect(() => {
    // Track reactive deps
    const active = isActive();
    const pending = pendingAnnotation();
    const annsLength = annotations().length;
    const sett = settings();
    const sState = sendState();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        // Exit layout mode first if active
        if (isDesignMode()) {
          if (activeDesignComponent()) {
            setActiveDesignComponent(null);
          } else {
            closeDesignMode();
          }
          return;
        }
        // Exit draw mode first if active
        if (isDrawMode()) {
          setIsDrawMode(false);
          return;
        }
        // Clear multi-select if active
        if (pendingMultiSelectElements().length > 0) {
          setPendingMultiSelectElements([]);
          return;
        }
        if (pending) {
          // Let popup handle
        } else if (active) {
          hideTooltipsUntilMouseLeave();
          deactivate();
        }
      }

      // Cmd+Shift+F / Ctrl+Shift+F to toggle feedback mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        if (active) {
          deactivate();
        } else {
          setIsActive(true);
        }
        return;
      }

      // Skip other shortcuts if typing or modifier keys are held
      if (isTyping || e.metaKey || e.ctrlKey) return;

      // "P" to toggle pause/freeze
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        toggleFreeze();
      }

      // "L" to toggle layout mode
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        if (isDrawMode()) setIsDrawMode(false);
        if (showSettings()) setShowSettings(false);
        if (pending) cancelAnnotation();
        if (isDesignMode()) {
          closeDesignMode();
        } else {
          setIsDesignMode(true);
        }
      }

      // "H" to toggle marker visibility
      if (e.key === "h" || e.key === "H") {
        if (annsLength > 0) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          setShowMarkers((prev) => !prev);
        }
      }

      // "C" to copy output
      if (e.key === "c" || e.key === "C") {
        if (annsLength > 0 || designPlacements().length > 0 || rearrangeState()) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          copyOutput();
        }
      }

      // "X" to clear all
      if (e.key === "x" || e.key === "X") {
        if (annsLength > 0 || designPlacements().length > 0 || rearrangeState()) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          clearAll();
          if (designPlacements().length > 0) setDesignPlacements([]);
          if (rearrangeState()) setRearrangeState(null);
        }
      }

      // "S" to send annotations
      if (e.key === "s" || e.key === "S") {
        const hasValidWebhook =
          isValidUrl(sett.webhookUrl) || isValidUrl(props.webhookUrl || "");
        if (
          annsLength > 0 &&
          hasValidWebhook &&
          sState === "idle"
        ) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          sendToWebhook();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  const hasAnnotations = () => annotations().length > 0;

  // Filter annotations for rendering (exclude exiting ones and design-mode kinds from normal flow)
  const visibleAnnotations = () => annotations().filter(
    (a) => !exitingMarkers().has(a.id) && (a as any).kind !== "placement" && (a as any).kind !== "rearrange",
  );
  const hasVisibleAnnotations = () => visibleAnnotations().length > 0;
  const exitingAnnotationsList = () => annotations().filter((a) =>
    exitingMarkers().has(a.id),
  );

  // Helper function to calculate viewport-aware tooltip positioning
  const getTooltipPosition = (annotation: Annotation): JSX.CSSProperties => {
    // Tooltip dimensions (from CSS)
    const tooltipMaxWidth = 200;
    const tooltipEstimatedHeight = 80; // Estimated max height
    const markerSize = 22;
    const gap = 10;

    // Convert percentage-based x to pixels
    const markerX = (annotation.x / 100) * window.innerWidth;
    const markerY =
      typeof annotation.y === "string"
        ? parseFloat(annotation.y)
        : annotation.y;

    const result: JSX.CSSProperties = {};

    // Vertical positioning: flip if near bottom
    const spaceBelow = window.innerHeight - markerY - markerSize - gap;
    if (spaceBelow < tooltipEstimatedHeight) {
      // Show above marker
      result.top = "auto";
      result.bottom = `calc(100% + ${gap}px)`;
    }
    // If enough space below, use default CSS (top: calc(100% + 10px))

    // Horizontal positioning: adjust if near edges
    const centerX = markerX - tooltipMaxWidth / 2;
    const edgePadding = 10;

    if (centerX < edgePadding) {
      // Too close to left edge
      const offset = edgePadding - centerX;
      result.left = `calc(50% + ${offset}px)`;
    } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
      // Too close to right edge
      const overflow =
        centerX + tooltipMaxWidth - (window.innerWidth - edgePadding);
      result.left = `calc(50% - ${overflow}px)`;
    }
    // If centered position is fine, use default CSS (left: 50%)

    return result;
  };

  return (
    <Show when={mounted() && !isToolbarHidden()}>
      <Portal mount={document.body}>
        <div ref={(el) => portalWrapperRef = el} style={{ display: "contents" }} data-agentation-theme={isDarkMode() ? "dark" : "light"} data-agentation-accent={settings().annotationColorId} data-agentation-root="">
          {/* Toolbar */}
          <div
            class={`${styles.toolbar}${props.class ? ` ${props.class}` : ""}`}
            data-feedback-toolbar
            data-agentation-toolbar
            style={
              toolbarPosition()
                ? {
                    left: `${toolbarPosition()!.x}px`,
                    top: `${toolbarPosition()!.y}px`,
                    right: "auto",
                    bottom: "auto",
                  }
                : undefined
            }
          >
            {/* Morphing container */}
            <div
              class={styles.toolbarContainer}
              classList={{
                [styles.expanded]: isActive(),
                [styles.collapsed]: !isActive(),
                [styles.entrance]: showEntranceAnimation(),
                [styles.hiding]: isToolbarHiding(),
                [styles.serverConnected]: !settings().webhooksEnabled && (isValidUrl(settings().webhookUrl) || isValidUrl(props.webhookUrl || "")),
              }}
              onClick={(e: MouseEvent) => {
                if (isActive()) return;
                // Don't activate if we just finished dragging
                if (justFinishedToolbarDragRef) {
                  justFinishedToolbarDragRef = false;
                  e.preventDefault();
                  return;
                }
                setIsActive(true);
              }}
              onMouseDown={handleToolbarMouseDown}
              role={!isActive() ? "button" : undefined}
              tabIndex={!isActive() ? 0 : -1}
              title={!isActive() ? "Start feedback mode" : undefined}
            >
              {/* Toggle content - visible when collapsed */}
              <div
                class={styles.toggleContent}
                classList={{
                  [styles.visible]: !isActive(),
                  [styles.hidden]: isActive(),
                }}
              >
                <IconListSparkle size={24} />
                <Show when={hasVisibleAnnotations()}>
                  <span
                    class={`${styles.badge} ${isActive() ? styles.fadeOut : ""} ${showEntranceAnimation() ? styles.entrance : ""}`}
                  >
                    {visibleAnnotations().length}
                  </span>
                </Show>
              </div>

              {/* Controls content - visible when expanded */}
              <div
                class={styles.controlsContent}
                classList={{
                  [styles.visible]: isActive(),
                  [styles.hidden]: !isActive(),
                  [styles.tooltipBelow]: !!(toolbarPosition() && toolbarPosition()!.y < 100),
                  [styles.tooltipsHidden]: tooltipsHidden() || showSettings(),
                  [styles.tooltipsInSession]: tooltipSessionActive(),
                }}
                onMouseEnter={handleControlsMouseEnter}
                onMouseLeave={handleControlsMouseLeave}
              >
                <div
                  class={`${styles.buttonWrapper} ${
                    toolbarPosition() && toolbarPosition()!.x < 120
                      ? styles.buttonWrapperAlignLeft
                      : ""
                  }`}
                >
                  <button
                    class={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      toggleFreeze();
                    }}
                    data-active={isFrozen()}
                  >
                    <IconPausePlayAnimated size={24} isPaused={isFrozen()} />
                  </button>
                  <span class={styles.buttonTooltip}>
                    {isFrozen() ? "Resume animations" : "Pause animations"}
                    <span class={styles.shortcut}>P</span>
                  </span>
                </div>

                <div class={styles.buttonWrapper}>
                  <button
                    class={`${styles.controlButton} ${!isDarkMode() ? styles.light : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      if (isDrawMode()) setIsDrawMode(false);
                      if (showSettings()) setShowSettings(false);
                      if (pendingAnnotation()) cancelAnnotation();
                      if (isDesignMode()) {
                        closeDesignMode();
                      } else {
                        setIsDesignMode(true);
                      }
                    }}
                    data-active={isDesignMode()}
                    style={isDesignMode() && blankCanvas() ? { color: '#f97316', background: 'rgba(249, 115, 22, 0.25)' } : undefined}
                  >
                    <IconLayout size={21} />
                  </button>
                  <span class={styles.buttonTooltip}>
                    {isDesignMode() ? "Exit layout mode" : "Layout mode"}
                    <span class={styles.shortcut}>L</span>
                  </span>
                </div>

                <div class={styles.buttonWrapper}>
                  <button
                    class={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      setShowMarkers(!showMarkers());
                    }}
                    disabled={!hasAnnotations() || isDesignMode()}
                  >
                    <IconEyeAnimated size={24} isOpen={showMarkers()} />
                  </button>
                  <span class={styles.buttonTooltip}>
                    {showMarkers() ? "Hide markers" : "Show markers"}
                    <span class={styles.shortcut}>H</span>
                  </span>
                </div>

                <div class={styles.buttonWrapper}>
                  <button
                    class={`${styles.controlButton} ${copied() ? styles.statusShowing : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      copyOutput();
                    }}
                    disabled={isDesignMode() && blankCanvas()
                      ? designPlacements().length === 0 && !(rearrangeState()?.sections?.length)
                      : !hasAnnotations() && drawStrokes().length === 0 && designPlacements().length === 0 && !(rearrangeState()?.sections?.length)}
                    data-active={copied()}
                  >
                    <IconCopyAnimated size={24} copied={copied()} tint={isDesignMode() && blankCanvas() && (designPlacements().length > 0 || !!(rearrangeState()?.sections?.length)) ? "#f97316" : undefined} />
                  </button>
                  <span class={styles.buttonTooltip}>
                    {isDesignMode() && blankCanvas() ? "Copy layout" : "Copy feedback"}
                    <span class={styles.shortcut}>C</span>
                  </span>
                </div>

                {/* Send button - only visible when webhook URL is available AND auto-send is off */}
                <div
                  class={`${styles.buttonWrapper} ${styles.sendButtonWrapper} ${isActive() && !settings().webhooksEnabled && (isValidUrl(settings().webhookUrl) || isValidUrl(props.webhookUrl || "")) ? styles.sendButtonVisible : ""}`}
                >
                  <button
                    class={`${styles.controlButton} ${sendState() === "sent" || sendState() === "failed" ? styles.statusShowing : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      sendToWebhook();
                    }}
                    disabled={
                      !hasAnnotations() ||
                      (!isValidUrl(settings().webhookUrl) &&
                        !isValidUrl(props.webhookUrl || "")) ||
                      sendState() === "sending"
                    }
                    data-no-hover={sendState() === "sent" || sendState() === "failed"}
                    tabIndex={
                      isValidUrl(settings().webhookUrl) ||
                      isValidUrl(props.webhookUrl || "")
                        ? 0
                        : -1
                    }
                  >
                    <IconSendArrow size={24} state={sendState()} />
                    <Show when={hasAnnotations() && sendState() === "idle"}>
                      <span
                        class={styles.buttonBadge}
                      >
                        {annotations().length}
                      </span>
                    </Show>
                  </button>
                  <span class={styles.buttonTooltip}>
                    Send Annotations
                    <span class={styles.shortcut}>S</span>
                  </span>
                </div>

                <div class={styles.buttonWrapper}>
                  <button
                    class={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      clearAll();
                    }}
                    disabled={!hasAnnotations() && drawStrokes().length === 0 && designPlacements().length === 0 && !(rearrangeState()?.sections?.length)}
                    data-danger
                  >
                    <IconTrashAlt size={24} />
                  </button>
                  <span class={styles.buttonTooltip}>
                    Clear all
                    <span class={styles.shortcut}>X</span>
                  </span>
                </div>

                <div class={styles.buttonWrapper}>
                  <button
                    class={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      if (isDesignMode()) closeDesignMode();
                      setShowSettings(!showSettings());
                    }}
                  >
                    <IconGear size={24} />
                  </button>
                  <Show when={props.endpoint && connectionStatus() !== "disconnected"}>
                    <span
                      class={`${styles.mcpIndicator} ${styles[connectionStatus()]} ${showSettings() ? styles.hidden : ""}`}
                      title={
                        connectionStatus() === "connected"
                          ? "MCP Connected"
                          : "MCP Connecting..."
                      }
                    />
                  </Show>
                  <span class={styles.buttonTooltip}>Settings</span>
                </div>

                <div
                  class={styles.divider}
                />

                <div
                  class={`${styles.buttonWrapper} ${
                    toolbarPosition() &&
                    typeof window !== "undefined" &&
                    toolbarPosition()!.x > window.innerWidth - 120
                      ? styles.buttonWrapperAlignRight
                      : ""
                  }`}
                >
                  <button
                    class={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      deactivate();
                    }}
                  >
                    <IconXmarkLarge size={24} />
                  </button>
                  <span class={styles.buttonTooltip}>
                    Exit
                    <span class={styles.shortcut}>Esc</span>
                  </span>
                </div>
              </div>

              {/* Layout Mode Palette */}
              <DesignPalette
                visible={isDesignMode() && isActive()}
                activeType={activeDesignComponent()}
                onSelect={(type) => {
                  setActiveDesignComponent(activeDesignComponent() === type ? null : type);
                }}
                isDarkMode={isDarkMode()}
                sectionCount={rearrangeState()?.sections.length ?? 0}
                onDetectSections={() => {
                  const sections = detectPageSections();
                  const existing = rearrangeState()?.sections ?? [];
                  const existingSelectors = new Set(existing.map(s => s.selector));
                  const newSections = sections.filter(s => !existingSelectors.has(s.selector));
                  const merged = [...existing, ...newSections];
                  const mergedOrder = [...(rearrangeState()?.originalOrder ?? []), ...newSections.map(s => s.id)];
                  setRearrangeState({
                    sections: merged,
                    originalOrder: mergedOrder,
                    detectedAt: Date.now(),
                  });
                }}
                placementCount={designPlacements().length}
                onClearPlacements={() => {
                  setDesignClearSignal(n => n + 1);
                  setRearrangeClearSignal(n => n + 1);
                  originalSetTimeout(() => {
                    setRearrangeState({
                      sections: [],
                      originalOrder: [],
                      detectedAt: Date.now(),
                    });
                  }, 200);
                }}
                blankCanvas={blankCanvas()}
                onBlankCanvasChange={(on) => {
                  const emptyRearrange = { sections: [], originalOrder: [], detectedAt: Date.now() };
                  if (on) {
                    exploreStashRef = { rearrange: rearrangeState(), placements: designPlacements() };
                    setRearrangeState(wireframeStashRef.rearrange || emptyRearrange);
                    setDesignPlacements(wireframeStashRef.placements);
                    setActiveDesignComponent(null);
                  } else {
                    wireframeStashRef = { rearrange: rearrangeState(), placements: designPlacements() };
                    setRearrangeState(exploreStashRef.rearrange || emptyRearrange);
                    setDesignPlacements(exploreStashRef.placements);
                  }
                  setBlankCanvas(on);
                }}
                wireframePurpose={wireframePurpose()}
                onWireframePurposeChange={setWireframePurpose}
                Tooltip={HelpTooltip}
                onDragStart={(type, e) => {
                  e.preventDefault();
                  const def = DEFAULT_SIZES[type];
                  let preview: HTMLDivElement | null = null;
                  let didDrag = false;
                  const startX = e.clientX;
                  const startY = e.clientY;

                  const toolbar = (e.target as HTMLElement).closest("[data-feedback-toolbar]");
                  const toolbarTop = toolbar?.getBoundingClientRect().top ?? window.innerHeight;

                  const onMove = (ev: MouseEvent) => {
                    const dx = ev.clientX - startX;
                    const dy = ev.clientY - startY;

                    if (!didDrag && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
                      didDrag = true;
                      preview = document.createElement("div");
                      preview.className = `${designStyles.dragPreview}${blankCanvas() ? ` ${designStyles.dragPreviewWireframe}` : ""}`;
                      document.body.appendChild(preview);
                    }

                    if (!preview) return;

                    const dist = Math.max(0, toolbarTop - ev.clientY);
                    const progress = Math.min(1, dist / 180);
                    const eased = 1 - Math.pow(1 - progress, 2);

                    const minW = 28;
                    const minH = 20;
                    const maxW = Math.min(140, def.width * 0.18);
                    const maxH = Math.min(90, def.height * 0.18);
                    const w = minW + (maxW - minW) * eased;
                    const h = minH + (maxH - minH) * eased;

                    preview.style.width = `${w}px`;
                    preview.style.height = `${h}px`;
                    preview.style.left = `${ev.clientX - w / 2}px`;
                    preview.style.top = `${ev.clientY - h / 2}px`;
                    preview.style.opacity = `${0.5 + 0.5 * eased}`;
                    preview.textContent = eased > 0.25 ? type : "";
                  };

                  const onUp = (ev: MouseEvent) => {
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                    if (preview) document.body.removeChild(preview);

                    if (didDrag) {
                      const w = def.width;
                      const h = def.height;
                      const scrollY = window.scrollY;
                      const x = Math.max(0, ev.clientX - w / 2);
                      const y = Math.max(0, ev.clientY + scrollY - h / 2);
                      const placement: DesignPlacement = {
                        id: `dp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                        type,
                        x,
                        y,
                        width: w,
                        height: h,
                        scrollY,
                        timestamp: Date.now(),
                      };
                      setDesignPlacements((prev) => [...prev, placement]);
                      setActiveDesignComponent(null);
                      designSelectedIdsRef = new Set();
                      setDesignDeselectSignal(n => n + 1);
                    }
                  };

                  window.addEventListener("mousemove", onMove);
                  window.addEventListener("mouseup", onUp);
                }}
              />

              <SettingsPanel
                settings={settings()}
                onSettingsChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
                isDarkMode={isDarkMode()}
                onToggleTheme={toggleTheme}
                isDevMode={isDevMode}
                connectionStatus={connectionStatus()}
                endpoint={props.endpoint}
                isVisible={showSettingsVisible()}
                toolbarNearBottom={!!toolbarPosition() && toolbarPosition()!.y < 230}
                settingsPage={settingsPage()}
                onSettingsPageChange={setSettingsPage}
                onHideToolbar={hideToolbarTemporarily}
              />
            </div>
          </div>

          {/* Blank canvas backdrop */}
          <Show when={isDesignMode() || designOverlayExiting()}>
            <div
              class={`${designStyles.blankCanvas} ${canvasReady() ? designStyles.visible : ""} ${designInteracting() ? designStyles.gridActive : ""}`}
              style={{ "--canvas-opacity": canvasOpacity() }}
              data-feedback-toolbar
            />
          </Show>

          {/* Wireframe hint — bottom-left notice */}
          <Show when={isDesignMode() && blankCanvas() && canvasReady()}>
            <div class={designStyles.wireframeNotice} data-feedback-toolbar>
              <div class={designStyles.wireframeOpacityRow}>
                <span class={designStyles.wireframeOpacityLabel}>Toggle Opacity</span>
                <input
                  type="range"
                  class={designStyles.wireframeOpacitySlider}
                  min={0}
                  max={1}
                  step={0.01}
                  value={canvasOpacity()}
                  onInput={(e) => setCanvasOpacity(Number((e.target as HTMLInputElement).value))}
                />
              </div>
              <div class={designStyles.wireframeNoticeTitleRow}>
                <span class={designStyles.wireframeNoticeTitle}>Wireframe Mode</span>
                <span class={designStyles.wireframeNoticeDivider} />
                <button
                  class={designStyles.wireframeStartOver}
                  onClick={() => {
                    setDesignClearSignal(n => n + 1);
                    setRearrangeState({ sections: [], originalOrder: [], detectedAt: Date.now() });
                    wireframeStashRef = { rearrange: null, placements: [] };
                    setWireframePurpose("");
                    clearWireframeState(pathname);
                  }}
                >
                  Start Over
                </button>
              </div>
              Drag components onto the canvas.<br />Copied output will only include the wireframed layout.
            </div>
          </Show>

          {/* Layout mode overlay — passthrough when no component selected */}
          <Show when={isDesignMode() || designOverlayExiting()}>
            <DesignMode
              placements={designPlacements()}
              onChange={setDesignPlacements}
              activeComponent={designOverlayExiting() ? null : activeDesignComponent()}
              onActiveComponentChange={setActiveDesignComponent}
              isDarkMode={isDarkMode()}
              exiting={designOverlayExiting()}
              onInteractionChange={setDesignInteracting}
              passthrough={!activeDesignComponent()}
              extraSnapRects={rearrangeState()?.sections.map(s => s.currentRect)}
              deselectSignal={designDeselectSignal()}
              clearSignal={designClearSignal()}
              wireframe={blankCanvas()}
              onSelectionChange={(ids, isShift) => {
                designSelectedIdsRef = ids;
                if (!isShift) {
                  rearrangeSelectedIdsRef = new Set();
                  setRearrangeDeselectSignal(n => n + 1);
                }
              }}
              onDragMove={(dx, dy) => {
                const selIds = rearrangeSelectedIdsRef;
                const rs = rearrangeState();
                if (!selIds.size || !rs) return;
                if (!crossDragStartRef) {
                  crossDragStartRef = new Map();
                  for (const s of rs.sections) {
                    if (selIds.has(s.id)) {
                      crossDragStartRef.set(s.id, { x: s.currentRect.x, y: s.currentRect.y });
                    }
                  }
                }
                for (const s of rs.sections) {
                  if (!selIds.has(s.id)) continue;
                  const start = crossDragStartRef.get(s.id);
                  if (!start) continue;
                  const outlineEl = document.querySelector(`[data-rearrange-section="${s.id}"]`) as HTMLElement | null;
                  if (outlineEl) outlineEl.style.transform = `translate(${dx}px, ${dy}px)`;
                }
              }}
              onDragEnd={(dx, dy, committed) => {
                const selIds = rearrangeSelectedIdsRef;
                const starts = crossDragStartRef;
                crossDragStartRef = null;
                const rs = rearrangeState();
                if (!selIds.size || !rs || !starts) return;
                for (const id of selIds) {
                  const el = document.querySelector(`[data-rearrange-section="${id}"]`) as HTMLElement | null;
                  if (el) el.style.transform = "";
                }
                if (committed) {
                  setRearrangeState(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      sections: prev.sections.map(s => {
                        const start = starts.get(s.id);
                        if (!start) return s;
                        return { ...s, currentRect: { ...s.currentRect, x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy) } };
                      }),
                    };
                  });
                }
              }}
            />
          </Show>

          {/* Rearrange overlay — always active alongside design overlay */}
          <Show when={(isDesignMode() || designOverlayExiting()) && rearrangeState()}>
            <RearrangeOverlay
              rearrangeState={rearrangeState()!}
              onChange={setRearrangeState}
              isDarkMode={isDarkMode()}
              exiting={designOverlayExiting()}
              blankCanvas={blankCanvas()}
              extraSnapRects={designPlacements().map(p => ({ x: p.x, y: p.y, width: p.width, height: p.height }))}
              clearSignal={rearrangeClearSignal()}
              deselectSignal={rearrangeDeselectSignal()}
              onSelectionChange={(ids, isShift) => {
                rearrangeSelectedIdsRef = ids;
                if (!isShift) {
                  designSelectedIdsRef = new Set();
                  setDesignDeselectSignal(n => n + 1);
                }
              }}
              onDragMove={(dx, dy) => {
                const selIds = designSelectedIdsRef;
                if (!selIds.size) return;
                if (!crossDragStartRef) {
                  crossDragStartRef = new Map();
                  for (const p of designPlacements()) {
                    if (selIds.has(p.id)) {
                      crossDragStartRef.set(p.id, { x: p.x, y: p.y });
                    }
                  }
                }
                for (const id of selIds) {
                  const el = document.querySelector(`[data-design-placement="${id}"]`) as HTMLElement | null;
                  if (el) el.style.transform = `translate(${dx}px, ${dy}px)`;
                }
              }}
              onDragEnd={(dx, dy, committed) => {
                const selIds = designSelectedIdsRef;
                const starts = crossDragStartRef;
                crossDragStartRef = null;
                if (!selIds.size || !starts) return;
                for (const id of selIds) {
                  const el = document.querySelector(`[data-design-placement="${id}"]`) as HTMLElement | null;
                  if (el) el.style.transform = "";
                }
                if (committed) {
                  setDesignPlacements(prev => prev.map(p => {
                    const start = starts.get(p.id);
                    if (!start) return p;
                    return { ...p, x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy) };
                  }));
                }
              }}
            />
          </Show>

          {/* Draw canvas */}
          <canvas
            ref={(el) => drawCanvasRef = el}
            class={`${styles.drawCanvas} ${isDrawMode() ? styles.active : ""}`}
            style={{ opacity: shouldShowMarkers() ? 1 : 0, transition: "opacity 0.15s ease" }}
            data-feedback-toolbar
          />

          {/* Markers layer - normal scrolling markers */}
          <div class={styles.markersLayer} data-feedback-toolbar>
            <Show when={markersVisible()}>
              <For each={visibleAnnotations().filter((a) => !a.isFixed)}>
                {(annotation, layerIndexFn) => {
                  const layerIndex = layerIndexFn();
                  const arr = visibleAnnotations().filter((a) => !a.isFixed);
                  return (
                    <AnnotationMarker
                      annotation={annotation}
                      globalIndex={visibleAnnotations().findIndex((a) => a.id === annotation.id)}
                      layerIndex={layerIndex}
                      layerSize={arr.length}
                      isExiting={markersExiting()}
                      isClearing={isClearing()}
                      isAnimated={animatedMarkers().has(annotation.id)}
                      isHovered={!markersExiting() && hoveredMarkerId() === annotation.id}
                      isDeleting={deletingMarkerId() === annotation.id}
                      isEditingAny={!!editingAnnotation()}
                      renumberFrom={renumberFrom()}
                      markerClickBehavior={settings().markerClickBehavior}
                      tooltipStyle={getTooltipPosition(annotation)}
                      onHoverEnter={(a) =>
                        !markersExiting() &&
                        a.id !== recentlyAddedIdRef &&
                        handleMarkerHover(a)
                      }
                      onHoverLeave={() => handleMarkerHover(null)}
                      onClick={(a) =>
                        settings().markerClickBehavior === "delete"
                          ? deleteAnnotation(a.id)
                          : startEditAnnotation(a)
                      }
                      onContextMenu={startEditAnnotation}
                    />
                  );
                }}
              </For>
              <Show when={!markersExiting()}>
                <For each={exitingAnnotationsList().filter((a) => !a.isFixed)}>
                  {(a) => <ExitingMarker annotation={a} />}
                </For>
              </Show>
            </Show>
          </div>

          {/* Fixed markers layer */}
          <div class={styles.fixedMarkersLayer} data-feedback-toolbar>
            <Show when={markersVisible()}>
              <For each={visibleAnnotations().filter((a) => a.isFixed)}>
                {(annotation, layerIndexFn) => {
                  const layerIndex = layerIndexFn();
                  const arr = visibleAnnotations().filter((a) => a.isFixed);
                  return (
                    <AnnotationMarker
                      annotation={annotation}
                      globalIndex={visibleAnnotations().findIndex((a) => a.id === annotation.id)}
                      layerIndex={layerIndex}
                      layerSize={arr.length}
                      isExiting={markersExiting()}
                      isClearing={isClearing()}
                      isAnimated={animatedMarkers().has(annotation.id)}
                      isHovered={!markersExiting() && hoveredMarkerId() === annotation.id}
                      isDeleting={deletingMarkerId() === annotation.id}
                      isEditingAny={!!editingAnnotation()}
                      renumberFrom={renumberFrom()}
                      markerClickBehavior={settings().markerClickBehavior}
                      tooltipStyle={getTooltipPosition(annotation)}
                      onHoverEnter={(a) =>
                        !markersExiting() &&
                        a.id !== recentlyAddedIdRef &&
                        handleMarkerHover(a)
                      }
                      onHoverLeave={() => handleMarkerHover(null)}
                      onClick={(a) =>
                        settings().markerClickBehavior === "delete"
                          ? deleteAnnotation(a.id)
                          : startEditAnnotation(a)
                      }
                      onContextMenu={startEditAnnotation}
                    />
                  );
                }}
              </For>
              <Show when={!markersExiting()}>
                <For each={exitingAnnotationsList().filter((a) => a.isFixed)}>
                  {(a) => <ExitingMarker annotation={a} fixed />}
                </For>
              </Show>
            </Show>
          </div>


          {/* Interactive overlay */}
          <Show when={isActive()}>
            <div
              class={styles.overlay}
              data-feedback-toolbar
              style={
                pendingAnnotation() || editingAnnotation()
                  ? { "z-index": 99999 }
                  : undefined
              }
            >
              {/* Hover highlight */}
              <Show when={hoverInfo()?.rect && !pendingAnnotation() && !isScrolling() && !isDragging()}>
                {(() => {
                  const hi = hoverInfo()!;
                  return (
                    <div
                      class={`${styles.hoverHighlight} ${styles.enter}`}
                      style={{
                        left: `${hi.rect!.left}px`,
                        top: `${hi.rect!.top}px`,
                        width: `${hi.rect!.width}px`,
                        height: `${hi.rect!.height}px`,
                        "border-color": "color-mix(in srgb, var(--agentation-color-accent) 50%, transparent)",
                        "background-color": "color-mix(in srgb, var(--agentation-color-accent) 4%, transparent)",
                      }}
                    />
                  );
                })()}
              </Show>

              {/* Cmd+shift+click multi-select highlights (during selection, before releasing modifiers) */}
              <For each={pendingMultiSelectElements().filter((item) => document.contains(item.element))}>
                {(item) => {
                  const rect = item.element.getBoundingClientRect();
                  // Only show green if 2+ elements selected, otherwise use default blue
                  const isMulti = pendingMultiSelectElements().length > 1;
                  return (
                    <div
                      class={
                        isMulti
                          ? styles.multiSelectOutline
                          : styles.singleSelectOutline
                      }
                      style={{
                        position: "fixed",
                        left: `${rect.left}px`,
                        top: `${rect.top}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        ...(isMulti
                          ? {}
                          : {
                              "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                              "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                            }),
                      }}
                    />
                  );
                }}
              </For>

              {/* Marker hover outline (shows bounding box of hovered annotation) */}
              <Show when={hoveredMarkerId() && !pendingAnnotation()}>
                {(() => {
                  const hoveredAnnotation = () => annotations().find(
                    (a) => a.id === hoveredMarkerId(),
                  );

                  return (
                    <Show when={hoveredAnnotation()?.boundingBox}>
                      {(() => {
                        const ha = hoveredAnnotation()!;

                        // Render individual element boxes if available (cmd+shift+click multi-select)
                        if (ha.elementBoundingBoxes?.length) {
                          // Use live positions from hoveredTargetElements when available
                          if (hoveredTargetElements().length > 0) {
                            return (
                              <For each={hoveredTargetElements().filter((el) => document.contains(el))}>
                                {(el) => {
                                  const rect = el.getBoundingClientRect();
                                  return (
                                    <div
                                      class={`${styles.multiSelectOutline} ${styles.enter}`}
                                      style={{
                                        left: `${rect.left}px`,
                                        top: `${rect.top}px`,
                                        width: `${rect.width}px`,
                                        height: `${rect.height}px`,
                                      }}
                                    />
                                  );
                                }}
                              </For>
                            );
                          }
                          // Fallback to stored bounding boxes
                          return (
                            <For each={ha.elementBoundingBoxes}>
                              {(bb) => (
                                <div
                                  class={`${styles.multiSelectOutline} ${styles.enter}`}
                                  style={{
                                    left: `${bb.x}px`,
                                    top: `${bb.y - scrollY()}px`,
                                    width: `${bb.width}px`,
                                    height: `${bb.height}px`,
                                  }}
                                />
                              )}
                            </For>
                          );
                        }

                        // Single element: use live position from hoveredTargetElement when available
                        const hte = hoveredTargetElement();
                        const rect =
                          hte && document.contains(hte)
                            ? hte.getBoundingClientRect()
                            : null;

                        const bb = rect
                          ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
                          : {
                              x: ha.boundingBox!.x,
                              y: ha.isFixed
                                ? ha.boundingBox!.y
                                : ha.boundingBox!.y - scrollY(),
                              width: ha.boundingBox!.width,
                              height: ha.boundingBox!.height,
                            };

                        const isMulti = ha.isMultiSelect;
                        return (
                          <div
                            class={`${isMulti ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                            style={{
                              left: `${bb.x}px`,
                              top: `${bb.y}px`,
                              width: `${bb.width}px`,
                              height: `${bb.height}px`,
                              ...(isMulti
                                ? {}
                                : {
                                    "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                                    "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                                  }),
                            }}
                          />
                        );
                      })()}
                    </Show>
                  );
                })()}
              </Show>

              {/* Hover tooltip */}
              <Show when={hoverInfo() && !pendingAnnotation() && !isScrolling() && !isDragging()}>
                {(() => {
                  const hi = hoverInfo()!;
                  const hp = hoverPosition();
                  return (
                    <div
                      class={`${styles.hoverTooltip} ${styles.enter}`}
                      style={{
                        left: `${Math.max(
                          8,
                          Math.min(hp.x, window.innerWidth - 100),
                        )}px`,
                        top: `${Math.max(
                          hp.y - (hi.reactComponents ? 48 : 32),
                          8,
                        )}px`,
                      }}
                    >
                      <Show when={hi.reactComponents}>
                        <div class={styles.hoverReactPath}>
                          {hi.reactComponents}
                        </div>
                      </Show>
                      <div class={styles.hoverElementName}>
                        {hi.elementName}
                      </div>
                    </div>
                  );
                })()}
              </Show>

              {/* Pending annotation marker + popup */}
              <Show when={pendingAnnotation()}>
                {(() => {
                  const pa = pendingAnnotation()!;
                  return (
                    <>
                      {/* Show element/area outline while adding annotation */}
                      {pa.multiSelectElements?.length
                        ? // Cmd+shift+click multi-select: show individual boxes with live positions
                          <For each={pa.multiSelectElements.filter((el) => document.contains(el))}>
                            {(el) => {
                              const rect = el.getBoundingClientRect();
                              return (
                                <div
                                  class={`${styles.multiSelectOutline} ${pendingExiting() ? styles.exit : styles.enter}`}
                                  style={{
                                    left: `${rect.left}px`,
                                    top: `${rect.top}px`,
                                    width: `${rect.width}px`,
                                    height: `${rect.height}px`,
                                  }}
                                />
                              );
                            }}
                          </For>
                        : // Single element or drag multi-select: show single box
                          pa.targetElement &&
                          document.contains(pa.targetElement)
                            ? // Single-click: use live getBoundingClientRect for consistent positioning
                              (() => {
                                const rect =
                                  pa.targetElement!.getBoundingClientRect();
                                return (
                                  <div
                                    class={`${styles.singleSelectOutline} ${pendingExiting() ? styles.exit : styles.enter}`}
                                    style={{
                                      left: `${rect.left}px`,
                                      top: `${rect.top}px`,
                                      width: `${rect.width}px`,
                                      height: `${rect.height}px`,
                                      "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                                      "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                                    }}
                                  />
                                );
                              })()
                            : // Drag selection or fallback: use stored boundingBox
                              pa.boundingBox && (
                                <div
                                  class={`${pa.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${pendingExiting() ? styles.exit : styles.enter}`}
                                  style={{
                                    left: `${pa.boundingBox.x}px`,
                                    top: `${pa.boundingBox.y - scrollY()}px`,
                                    width: `${pa.boundingBox.width}px`,
                                    height: `${pa.boundingBox.height}px`,
                                    ...(pa.isMultiSelect
                                      ? {}
                                      : {
                                          "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                                          "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                                        }),
                                  }}
                                />
                              )}

                      {(() => {
                        // Use stored coordinates - they match what will be saved
                        const markerX = pa.x;
                        const markerY = pa.isFixed
                          ? pa.y
                          : pa.y - scrollY();

                        return (
                          <>
                            <PendingMarker
                              x={markerX}
                              y={markerY}
                              isMultiSelect={pa.isMultiSelect}
                              isExiting={pendingExiting()}
                            />

                            <AnnotationPopupCSS
                              ref={(handle) => popupRef = handle}
                              element={pa.element}
                              selectedText={pa.selectedText}
                              computedStyles={pa.computedStylesObj}
                              placeholder={
                                pa.element === "Area selection"
                                  ? "What should change in this area?"
                                  : pa.isMultiSelect
                                    ? "Feedback for this group of elements..."
                                    : "What should change?"
                              }
                              onSubmit={addAnnotation}
                              onCancel={cancelAnnotation}
                              isExiting={pendingExiting()}
                              lightMode={!isDarkMode()}
                              accentColor={
                                pa.isMultiSelect
                                  ? "var(--agentation-color-green)"
                                  : "var(--agentation-color-accent)"
                              }
                              style={{
                                // Popup is 280px wide, centered with translateX(-50%), so 140px each side
                                // Clamp so popup stays 20px from viewport edges
                                left: `${Math.max(
                                  160,
                                  Math.min(
                                    window.innerWidth - 160,
                                    (markerX / 100) * window.innerWidth,
                                  ),
                                )}px`,
                                // Position popup above or below marker to keep marker visible
                                ...(markerY > window.innerHeight - 290
                                  ? { bottom: `${window.innerHeight - markerY + 20}px` }
                                  : { top: `${markerY + 20}px` }),
                              }}
                            />
                          </>
                        );
                      })()}
                    </>
                  );
                })()}
              </Show>

              {/* Edit annotation popup */}
              <Show when={editingAnnotation()}>
                {(() => {
                  const ea = editingAnnotation()!;
                  return (
                    <>
                      {/* Show element/area outline while editing */}
                      {ea.elementBoundingBoxes?.length
                        ? // Cmd+shift+click: show individual element boxes (use live rects when available)
                          (() => {
                            // Use live positions from editingTargetElements when available
                            if (editingTargetElements().length > 0) {
                              return (
                                <For each={editingTargetElements().filter((el) => document.contains(el))}>
                                  {(el) => {
                                    const rect = el.getBoundingClientRect();
                                    return (
                                      <div
                                        class={`${styles.multiSelectOutline} ${styles.enter}`}
                                        style={{
                                          left: `${rect.left}px`,
                                          top: `${rect.top}px`,
                                          width: `${rect.width}px`,
                                          height: `${rect.height}px`,
                                        }}
                                      />
                                    );
                                  }}
                                </For>
                              );
                            }
                            // Fallback to stored bounding boxes
                            return (
                              <For each={ea.elementBoundingBoxes!}>
                                {(bb) => (
                                  <div
                                    class={`${styles.multiSelectOutline} ${styles.enter}`}
                                    style={{
                                      left: `${bb.x}px`,
                                      top: `${bb.y - scrollY()}px`,
                                      width: `${bb.width}px`,
                                      height: `${bb.height}px`,
                                    }}
                                  />
                                )}
                              </For>
                            );
                          })()
                        : // Single element or drag multi-select: show single box
                          (() => {
                            // Use live position from editingTargetElement when available
                            const ete = editingTargetElement();
                            const rect =
                              ete &&
                              document.contains(ete)
                                ? ete.getBoundingClientRect()
                                : null;

                            const bb = rect
                              ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
                              : ea.boundingBox
                                ? {
                                    x: ea.boundingBox.x,
                                    y: ea.isFixed
                                      ? ea.boundingBox.y
                                      : ea.boundingBox.y - scrollY(),
                                    width: ea.boundingBox.width,
                                    height: ea.boundingBox.height,
                                  }
                                : null;

                            if (!bb) return null;

                            return (
                              <div
                                class={`${ea.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                                style={{
                                  left: `${bb.x}px`,
                                  top: `${bb.y}px`,
                                  width: `${bb.width}px`,
                                  height: `${bb.height}px`,
                                  ...(ea.isMultiSelect
                                    ? {}
                                    : {
                                        "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                                        "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                                      }),
                                }}
                              />
                            );
                          })()}

                      <AnnotationPopupCSS
                        ref={(handle) => editPopupRef = handle}
                        element={ea.element}
                        selectedText={ea.selectedText}
                        computedStyles={parseComputedStylesString(
                          ea.computedStyles,
                        )}
                        placeholder="Edit your feedback..."
                        initialValue={ea.comment}
                        submitLabel="Save"
                        onSubmit={updateAnnotation}
                        onCancel={cancelEditAnnotation}
                        onDelete={() => deleteAnnotation(ea.id)}
                        isExiting={editExiting()}
                        lightMode={!isDarkMode()}
                        accentColor={
                          ea.isMultiSelect
                            ? "var(--agentation-color-green)"
                            : "var(--agentation-color-accent)"
                        }
                        style={(() => {
                          const markerY = ea.isFixed
                            ? ea.y
                            : ea.y - scrollY();
                          return {
                            // Popup is 280px wide, centered with translateX(-50%), so 140px each side
                            // Clamp so popup stays 20px from viewport edges
                            left: `${Math.max(
                              160,
                              Math.min(
                                window.innerWidth - 160,
                                (ea.x / 100) * window.innerWidth,
                              ),
                            )}px`,
                            // Position popup above or below marker to keep marker visible
                            ...(markerY > window.innerHeight - 290
                              ? { bottom: `${window.innerHeight - markerY + 20}px` }
                              : { top: `${markerY + 20}px` }),
                          };
                        })()}
                      />
                    </>
                  );
                })()}
              </Show>

              {/* Drag selection - all visuals use refs for smooth 60fps */}
              <Show when={isDragging()}>
                <div ref={(el) => dragRectRef = el} class={styles.dragSelection} />
                <div
                  ref={(el) => highlightsContainerRef = el}
                  class={styles.highlightsContainer}
                />
              </Show>
            </div>
          </Show>
        </div>
      </Portal>
    </Show>
  );
}

export default PageFeedbackToolbarCSS;
