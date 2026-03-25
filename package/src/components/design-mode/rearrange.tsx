import { createSignal, createEffect, onMount, onCleanup, Show, For, JSX, batch } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { captureElement } from "./section-detection";
import { AnnotationPopupCSS } from "../annotation-popup-css";
import type { DetectedSection, RearrangeState } from "./types";
import styles from "./styles.module.scss";

// =============================================================================
// Rearrange Overlay — Click-to-capture, free drag, resize
// =============================================================================

const SECTION_COLOR = { bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.5)", pill: "#3b82f6" };

type HandleDir = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: HandleDir[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const MIN_SIZE = 24;
const MIN_CAPTURE_SIZE = 16;
const SNAP_THRESHOLD = 5;

type Guide = { axis: "x" | "y"; pos: number };

type SnapRect = { x: number; y: number; width: number; height: number };

function computeSectionSnap(
  rect: SnapRect,
  sections: DetectedSection[],
  excludeIds: Set<string>,
  extraRects?: SnapRect[],
): { dx: number; dy: number; guides: Guide[] } {
  let bestDx = Infinity;
  let bestDy = Infinity;

  const mL = rect.x, mR = rect.x + rect.width, mCx = rect.x + rect.width / 2;
  const mT = rect.y, mB = rect.y + rect.height, mCy = rect.y + rect.height / 2;

  // Build unified list of target rects (sections + extra rects from placements)
  const allTargets: SnapRect[] = [];
  for (const s of sections) {
    if (!excludeIds.has(s.id)) allTargets.push(s.currentRect);
  }
  if (extraRects) allTargets.push(...extraRects);

  for (const o of allTargets) {
    const oL = o.x, oR = o.x + o.width, oCx = o.x + o.width / 2;
    const oT = o.y, oB = o.y + o.height, oCy = o.y + o.height / 2;

    for (const from of [mL, mR, mCx]) {
      for (const to of [oL, oR, oCx]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD && Math.abs(d) < Math.abs(bestDx)) bestDx = d;
      }
    }
    for (const from of [mT, mB, mCy]) {
      for (const to of [oT, oB, oCy]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD && Math.abs(d) < Math.abs(bestDy)) bestDy = d;
      }
    }
  }

  const dx = Math.abs(bestDx) < SNAP_THRESHOLD ? bestDx : 0;
  const dy = Math.abs(bestDy) < SNAP_THRESHOLD ? bestDy : 0;

  const guides: Guide[] = [];
  const seen = new Set<string>();
  const sL = mL + dx, sR = mR + dx, sCx = mCx + dx;
  const sT = mT + dy, sB = mB + dy, sCy = mCy + dy;

  for (const o of allTargets) {
    const oL = o.x, oR = o.x + o.width, oCx = o.x + o.width / 2;
    const oT = o.y, oB = o.y + o.height, oCy = o.y + o.height / 2;

    for (const xPos of [oL, oCx, oR]) {
      for (const sx of [sL, sCx, sR]) {
        if (Math.abs(sx - xPos) < 0.5) {
          const key = `x:${Math.round(xPos)}`;
          if (!seen.has(key)) { seen.add(key); guides.push({ axis: "x", pos: xPos }); }
        }
      }
    }
    for (const yPos of [oT, oCy, oB]) {
      for (const sy of [sT, sCy, sB]) {
        if (Math.abs(sy - yPos) < 0.5) {
          const key = `y:${Math.round(yPos)}`;
          if (!seen.has(key)) { seen.add(key); guides.push({ axis: "y", pos: yPos }); }
        }
      }
    }
  }

  return { dx, dy, guides };
}

const SKIP_TAGS = new Set(["script", "style", "noscript", "link", "meta", "br", "hr"]);

/**
 * Pick a reasonable capture target from any element. Walk up only to skip
 * tiny inline elements (span, em, strong, etc.) — otherwise take whatever
 * was clicked, same as normal agentation annotations.
 */
function pickTarget(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current !== document.documentElement) {
    if (current.closest("[data-feedback-toolbar]")) return null;
    if (SKIP_TAGS.has(current.tagName.toLowerCase())) {
      current = current.parentElement;
      continue;
    }
    const rect = current.getBoundingClientRect();
    if (rect.width >= MIN_CAPTURE_SIZE && rect.height >= MIN_CAPTURE_SIZE) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

type RearrangeOverlayProps = {
  rearrangeState: RearrangeState;
  onChange: (state: RearrangeState) => void;
  isDarkMode: boolean;
  exiting?: boolean;
  className?: string;
  blankCanvas?: boolean;
  extraSnapRects?: SnapRect[];
  onSelectionChange?: (selectedIds: Set<string>, isShift: boolean) => void;
  deselectSignal?: number;
  onDragMove?: (dx: number, dy: number) => void;
  onDragEnd?: (dx: number, dy: number, committed: boolean) => void;
  clearSignal?: number;
};

export function RearrangeOverlay(props: RearrangeOverlayProps) {
  // Local store for sections — reconcile by id keeps proxy references stable
  // so <For> doesn't destroy/recreate DOM elements on property changes.
  const [sectionStore, setSectionStore] = createStore({ items: [] as DetectedSection[] });
  createEffect(() => {
    setSectionStore("items", reconcile(props.rearrangeState.sections, { key: "id" }));
  });
  const sections = () => sectionStore.items;
  let rearrangeStateRef = props.rearrangeState;
  createEffect(() => { rearrangeStateRef = props.rearrangeState; });
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());

  // Animate all out when clearSignal fires
  const [exitingAll, setExitingAll] = createSignal(false);
  let clearRef = props.clearSignal;
  createEffect(() => {
    if (props.clearSignal !== undefined && props.clearSignal !== clearRef) {
      clearRef = props.clearSignal;
      if (sections().length > 0) {
        setExitingAll(true);
      }
    }
  });

  // Clear selection when the other overlay signals deselect
  let deselectRef = props.deselectSignal;
  createEffect(() => {
    if (props.deselectSignal !== deselectRef) {
      deselectRef = props.deselectSignal;
      setSelectedIds(new Set());
    }
  });
  // --- Double-click annotation editing ---
  const [editingId, setEditingId] = createSignal<string | null>(null);
  const [editExiting, setEditExiting] = createSignal(false);
  let editHadNoteRef = false;

  const handleDoubleClick = (id: string) => {
    const s = sections().find(sec => sec.id === id);
    if (!s) return;
    editHadNoteRef = !!s.note;
    setEditingId(id);
    setEditExiting(false);
  };

  const dismissEdit = () => {
    if (!editingId()) return;
    setEditExiting(true);
    setTimeout(() => { setEditingId(null); setEditExiting(false); }, 150);
  };

  const submitEdit = (text: string) => {
    if (!editingId()) return;
    props.onChange({
      ...props.rearrangeState,
      sections: sections().map(s => s.id === editingId() ? { ...s, note: text.trim() || undefined } : s),
    });
    dismissEdit();
  };

  // Dismiss popup when overlay exits
  createEffect(() => {
    if (props.exiting && editingId()) dismissEdit();
  });

  const [exitingIds, setExitingIds] = createSignal<Set<string>>(new Set());
  let lastNoteTextRef: Map<string, string> = new Map();
  const [hoverHighlight, setHoverHighlight] = createSignal<{ x: number; y: number; w: number; h: number } | null>(null);
  const [sizeIndicator, setSizeIndicator] = createSignal<{ x: number; y: number; text: string } | null>(null);
  const [snapGuides, setSnapGuides] = createSignal<Guide[]>([]);
  const [scrollY, setScrollY] = createSignal(0);
  let interactionRef: string | null = null;
  // Track which sections have already appeared as ghosts (skip ghostEnter replay)
  let seenGhostIdsRef: Set<string> = new Set();
  // Track which action (move/resize) happened first per section, for badge ordering
  let firstActionRef: Map<string, "move" | "resize"> = new Map();
  // Live drag/resize positions for connector lines during interaction
  const [dragPositions, setDragPositions] = createSignal<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());
  // Exiting connectors: sections that returned to original position, animating out
  const [exitingConnectors, setExitingConnectors] = createSignal<Map<string, { orig: { x: number; y: number; width: number; height: number }; target: { x: number; y: number; width: number; height: number }; isFixed?: boolean }>>(new Map());
  let prevChangedIdsRef: Set<string> = new Set();
  // Track last known currentRect for each changed section (for exit animation)
  let lastChangedRectsRef: Map<string, { currentRect: { x: number; y: number; width: number; height: number }; originalRect: { x: number; y: number; width: number; height: number }; isFixed?: boolean }> = new Map();

  // Stable refs for callbacks (avoids stale closures in event handlers)
  let onSelectionChangeRef = props.onSelectionChange;
  createEffect(() => { onSelectionChangeRef = props.onSelectionChange; });
  let onDragMoveRef = props.onDragMove;
  createEffect(() => { onDragMoveRef = props.onDragMove; });
  let onDragEndRef = props.onDragEnd;
  createEffect(() => { onDragEndRef = props.onDragEnd; });

  // Clear selection when blank canvas is toggled on
  createEffect(() => {
    if (props.blankCanvas) setSelectedIds(new Set());
  });

  // Delay showing outlines on mount if sections are already moved (elements animate first)
  const [outlinesReady, setOutlinesReady] = createSignal(
    !props.rearrangeState.sections.some(s => {
      const o = s.originalRect, c = s.currentRect;
      return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1 || Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
    })
  );
  onMount(() => {
    if (!outlinesReady()) {
      const timer = setTimeout(() => setOutlinesReady(true), 380);
      onCleanup(() => clearTimeout(timer));
    }
  });

  // Track captured selectors for dedup
  let capturedSelectors = new Set<string>();
  createEffect(() => {
    capturedSelectors = new Set(sections().map(s => s.selector));
  });

  // --- Keep scrollY in sync so outlines track the page ---
  onMount(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });
  });

  // --- Hover: highlight whatever element is under cursor ---
  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (interactionRef) { setHoverHighlight(null); return; }

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el) { setHoverHighlight(null); return; }
      if (el.closest("[data-feedback-toolbar]")) { setHoverHighlight(null); return; }
      if (el.closest("[data-design-placement]")) { setHoverHighlight(null); return; }
      if (el.closest("[data-annotation-popup]")) { setHoverHighlight(null); return; }

      const target = pickTarget(el);
      if (!target) { setHoverHighlight(null); return; }

      // Skip already-captured elements (exact match or target is parent of captured)
      for (const sel of capturedSelectors) {
        try {
          const captured = document.querySelector(sel);
          if (captured && (captured === target || target.contains(captured))) {
            setHoverHighlight(null);
            return;
          }
        } catch { /* invalid selector */ }
      }

      const rect = target.getBoundingClientRect();
      setHoverHighlight({ x: rect.x, y: rect.y, w: rect.width, h: rect.height });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });

  // --- Prevent text selection while rearrange mode is active ---
  onMount(() => {
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    onCleanup(() => { document.body.style.userSelect = prev; });
  });

  // --- Mousedown to capture new elements (+ immediate drag) ---
  onMount(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (interactionRef) return;
      if (e.button !== 0) return;
      const el = e.target as HTMLElement;
      if (!el || el.closest("[data-feedback-toolbar]")) return;
      if (el.closest("[data-design-placement]")) return;
      if (el.closest("[data-annotation-popup]")) return;

      const target = pickTarget(el);
      let alreadyCaptured = false;
      if (target) {
        for (const sel of capturedSelectors) {
          try {
            const captured = document.querySelector(sel);
            if (captured && (captured === target || target.contains(captured))) {
              alreadyCaptured = true;
              break;
            }
          } catch { /* invalid selector */ }
        }
      }

      const isShift = !!(e.shiftKey || e.metaKey || e.ctrlKey);
      if (target && !alreadyCaptured) {
        e.preventDefault();
        e.stopPropagation();
        const section = captureElement(target);
        const newSections = [...sections(), section];
        const newOrder = [...props.rearrangeState.originalOrder, section.id];
        props.onChange({
          ...props.rearrangeState,
          sections: newSections,
          originalOrder: newOrder,
        });
        const newIds = new Set([section.id]);
        setSelectedIds(newIds);
        onSelectionChangeRef?.(newIds, isShift);
        setHoverHighlight(null);

        // Start drag tracking immediately
        const startX = e.clientX;
        const startY = e.clientY;
        const startPos = { x: section.currentRect.x, y: section.currentRect.y };
        let moved = false;
        let lastDx = 0, lastDy = 0;
        interactionRef = "move";

        const onMove = (ev: MouseEvent) => {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          if (!moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) moved = true;
          if (!moved) return;

          const rect = { x: startPos.x + dx, y: startPos.y + dy, width: section.currentRect.width, height: section.currentRect.height };
          const snap = computeSectionSnap(rect, newSections, new Set([section.id]), props.extraSnapRects);
          setSnapGuides(snap.guides);
          const snappedDx = dx + snap.dx;
          const snappedDy = dy + snap.dy;
          lastDx = snappedDx;
          lastDy = snappedDy;

          // Ghost mode: only move outline (ghost preview), not the page element
          const outlineEl = document.querySelector(`[data-rearrange-section="${section.id}"]`) as HTMLElement | null;
          if (outlineEl) outlineEl.style.transform = `translate(${snappedDx}px, ${snappedDy}px)`;
          // Update live drag position for connector lines
          setDragPositions(new Map([[section.id, { x: startPos.x + snappedDx, y: startPos.y + snappedDy, width: section.currentRect.width, height: section.currentRect.height }]]));
          onDragMoveRef?.(snappedDx, snappedDy);
        };

        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          interactionRef = null;
          setSnapGuides([]);
          setDragPositions(new Map());
          const outlineEl = document.querySelector(`[data-rearrange-section="${section.id}"]`) as HTMLElement | null;
          if (outlineEl) outlineEl.style.transform = "";
          if (moved) {

            props.onChange({
              ...props.rearrangeState,
              sections: newSections.map(s =>
                s.id === section.id
                  ? { ...s, currentRect: { ...s.currentRect, x: Math.max(0, startPos.x + lastDx), y: Math.max(0, startPos.y + lastDy) } }
                  : s,
              ),
              originalOrder: newOrder,
            });
          }
          onDragEndRef?.(lastDx, lastDy, moved);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      } else if (alreadyCaptured && target) {
        e.preventDefault();
        // Clicked directly on a captured element's page node — select that section
        for (const s of sections()) {
          try {
            const captured = document.querySelector(s.selector);
            if (captured && captured === target) {
              const newIds = new Set([s.id]);
              setSelectedIds(newIds);
              onSelectionChangeRef?.(newIds, isShift);
              return;
            }
          } catch { /* invalid selector */ }
        }
        if (!isShift) {
          setSelectedIds(new Set());
          onSelectionChangeRef?.(new Set(), false);
        }
      } else {
        if (!isShift) {
          setSelectedIds(new Set());
          onSelectionChangeRef?.(new Set(), false);
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown, true);
    onCleanup(() => document.removeEventListener("mousedown", handleMouseDown, true));
  });

  // --- Keyboard: delete, nudge, escape ---
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;

      if ((e.key === "Backspace" || e.key === "Delete") && selectedIds().size > 0) {
        e.preventDefault();
        const idsToDelete = new Set(selectedIds());
        setExitingIds(prev => { const next = new Set(prev); for (const id of idsToDelete) next.add(id); return next; });
        setSelectedIds(new Set());
        setTimeout(() => {
          const rs = rearrangeStateRef;
          props.onChange({
            ...rs,
            sections: rs.sections.filter(s => !idsToDelete.has(s.id)),
            originalOrder: rs.originalOrder.filter(id => !idsToDelete.has(id)),
          });
          setExitingIds(prev => { const next = new Set(prev); for (const id of idsToDelete) next.delete(id); return next; });
        }, 180);
        return;
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && selectedIds().size > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        props.onChange({
          ...props.rearrangeState,
          sections: sections().map(s =>
            selectedIds().has(s.id)
              ? { ...s, currentRect: { ...s.currentRect, x: Math.max(0, s.currentRect.x + dx), y: Math.max(0, s.currentRect.y + dy) } }
              : s,
          ),
        });
        return;
      }

      if (e.key === "Escape" && selectedIds().size > 0) {
        setSelectedIds(new Set());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  // --- Click outline: select + drag ---
  const handleOutlineMouseDown = (e: MouseEvent, id: string) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest(`.${styles.handle}`) || target.closest(`.${styles.deleteButton}`)) return;
    e.preventDefault();
    e.stopPropagation();

    let newSelected: Set<string>;
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      newSelected = new Set(selectedIds());
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
    } else if (!selectedIds().has(id)) {
      newSelected = new Set([id]);
    } else {
      newSelected = new Set(selectedIds());
    }
    setSelectedIds(newSelected);
    // Only notify if selection actually changed (avoids deselecting other overlay when clicking an already-selected item to drag)
    const changed = newSelected.size !== selectedIds().size || [...newSelected].some(x => !selectedIds().has(x));
    if (changed) onSelectionChangeRef?.(newSelected, !!(e.shiftKey || e.metaKey || e.ctrlKey));

    const startX = e.clientX;
    const startY = e.clientY;
    const startPositions = new Map<string, { x: number; y: number }>();
    for (const s of sections()) {
      if (newSelected.has(s.id)) {
        startPositions.set(s.id, { x: s.currentRect.x, y: s.currentRect.y });
      }
    }

    interactionRef = "move";
    let moved = false;
    let lastDx = 0, lastDy = 0;

    // Cache outline divs for direct updates during drag (zero re-renders)
    // Ghost mode: only outlines move, page elements stay put
    const dragEls = new Map<string, {
      outlineEl: HTMLElement | null;
      curW: number; curH: number;
    }>();
    for (const s of sections()) {
      if (newSelected.has(s.id)) {
        const outlineEl = document.querySelector(`[data-rearrange-section="${s.id}"]`) as HTMLElement | null;
        dragEls.set(s.id, {
          outlineEl,
          curW: s.currentRect.width, curH: s.currentRect.height,
        });
      }
    }

    const onMove = (ev: MouseEvent) => {
      const rawDx = ev.clientX - startX;
      const rawDy = ev.clientY - startY;
      if (rawDx === 0 && rawDy === 0) return;
      moved = true;

      // Compute bounding box of all selected sections at current drag position
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const [id, { curW, curH }] of dragEls) {
        const start = startPositions.get(id);
        if (!start) continue;
        const cx = start.x + rawDx, cy = start.y + rawDy;
        minX = Math.min(minX, cx); minY = Math.min(minY, cy);
        maxX = Math.max(maxX, cx + curW); maxY = Math.max(maxY, cy + curH);
      }
      const snap = computeSectionSnap(
        { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
        sections(),
        newSelected,
        props.extraSnapRects,
      );
      const dx = rawDx + snap.dx;
      const dy = rawDy + snap.dy;
      lastDx = dx;
      lastDy = dy;
      setSnapGuides(snap.guides);

      // Ghost mode: only move outline divs, page elements stay put
      for (const [, { outlineEl }] of dragEls) {
        if (outlineEl) {
          outlineEl.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      }
      // Update live drag positions for connector lines + ghost clones
      const livePos = new Map<string, { x: number; y: number; width: number; height: number }>();
      for (const [id, { curW, curH }] of dragEls) {
        const start = startPositions.get(id);
        if (start) {
          const pos = { x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy), width: curW, height: curH };
          livePos.set(id, pos);
        }
      }
      setDragPositions(livePos);
      onDragMoveRef?.(dx, dy);
    };

    const onUp = (ev: MouseEvent) => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      interactionRef = null;
      setSnapGuides([]);
      setDragPositions(new Map());

      // Clear outline transforms — state update will set correct left/top
      for (const [, { outlineEl }] of dragEls) {
        if (outlineEl) outlineEl.style.transform = "";
      }

      if (moved) {
        const totalDx = ev.clientX - startX;
        const totalDy = ev.clientY - startY;
        if (Math.abs(totalDx) < 5 && Math.abs(totalDy) < 5) {
          // Snap back — revert to pre-drag position
          props.onChange({
            ...props.rearrangeState,
            sections: sections().map(s => {
              const start = startPositions.get(s.id);
              if (!start) return s;
              return { ...s, currentRect: { ...s.currentRect, x: start.x, y: start.y } };
            }),
          });
        } else {
          // Suppress ghostEnter animation for sections transitioning to changed
          // Commit final ghost position
          props.onChange({
            ...props.rearrangeState,
            sections: sections().map(s => {
              const start = startPositions.get(s.id);
              if (!start) return s;
              return { ...s, currentRect: { ...s.currentRect, x: Math.max(0, start.x + lastDx), y: Math.max(0, start.y + lastDy) } };
            }),
          });
          onDragEndRef?.(lastDx, lastDy, true);
          return;
        }
      }
      onDragEndRef?.(0, 0, false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // --- Resize ---
  const handleResizeMouseDown = (e: MouseEvent, id: string, dir: HandleDir) => {
    e.preventDefault();
    e.stopPropagation();
    const section = sections().find(s => s.id === id);
    if (!section) return;

    setSelectedIds(new Set([id]));
    interactionRef = "resize";

    const startX = e.clientX;
    const startY = e.clientY;
    const startRect = { ...section.currentRect };
    const aspectRatio = startRect.width / startRect.height;
    let lastRect = { ...startRect };

    // Cache outline for direct updates — ghost mode, no page element transforms
    const resizeOutlineEl = document.querySelector(`[data-rearrange-section="${id}"]`) as HTMLElement | null;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let nx = startRect.x, ny = startRect.y, nw = startRect.width, nh = startRect.height;

      if (dir.includes("e")) nw = Math.max(MIN_SIZE, startRect.width + dx);
      if (dir.includes("w")) { nw = Math.max(MIN_SIZE, startRect.width - dx); nx = startRect.x + startRect.width - nw; }
      if (dir.includes("s")) nh = Math.max(MIN_SIZE, startRect.height + dy);
      if (dir.includes("n")) { nh = Math.max(MIN_SIZE, startRect.height - dy); ny = startRect.y + startRect.height - nh; }

      // Shift = constrain aspect ratio
      if (ev.shiftKey) {
        const isCorner = dir.length === 2;
        if (isCorner) {
          const wDelta = Math.abs(nw - startRect.width);
          const hDelta = Math.abs(nh - startRect.height);
          if (wDelta > hDelta) {
            nh = nw / aspectRatio;
          } else {
            nw = nh * aspectRatio;
          }
          if (dir.includes("w")) nx = startRect.x + startRect.width - nw;
          if (dir.includes("n")) ny = startRect.y + startRect.height - nh;
        } else {
          if (dir === "e" || dir === "w") {
            nh = nw / aspectRatio;
          } else {
            nw = nh * aspectRatio;
          }
          if (dir === "w") nx = startRect.x + startRect.width - nw;
          if (dir === "n") ny = startRect.y + startRect.height - nh;
        }
      }

      lastRect = { x: nx, y: ny, width: nw, height: nh };

      // Ghost mode: only update outline, not page element
      if (resizeOutlineEl) {
        resizeOutlineEl.style.left = `${nx}px`;
        resizeOutlineEl.style.top = `${ny - scrollY()}px`;
        resizeOutlineEl.style.width = `${nw}px`;
        resizeOutlineEl.style.height = `${nh}px`;
      }
      setSizeIndicator({ x: ev.clientX + 12, y: ev.clientY + 12, text: `${Math.round(nw)} \u00d7 ${Math.round(nh)}` });
      setDragPositions(new Map([[id, lastRect]]));
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setSizeIndicator(null);
      interactionRef = null;
      setDragPositions(new Map());
      // Suppress ghostEnter animation for resized section
      // Commit final size — element already at right spot from direct DOM
      props.onChange({
        ...props.rearrangeState,
        sections: sections().map(s => s.id === id ? { ...s, currentRect: lastRect } : s),
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleDelete = (id: string) => {
    setExitingIds(prev => { const next = new Set(prev); next.add(id); return next; });
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    setTimeout(() => {
      const rs = rearrangeStateRef;
      props.onChange({
        ...rs,
        sections: rs.sections.filter(s => s.id !== id),
        originalOrder: rs.originalOrder.filter(oid => oid !== id),
      });
      setExitingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }, 180);
  };

  const hasChanged = (s: DetectedSection): boolean => {
    const o = s.originalRect, c = s.currentRect;
    return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1 || Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
  };

  const isMoved = (s: DetectedSection): boolean => {
    const o = s.originalRect, c = s.currentRect;
    return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1;
  };

  const isResized = (s: DetectedSection): boolean => {
    const o = s.originalRect, c = s.currentRect;
    return Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
  };

  // Filter to visible sections (DOM element still exists on page)
  const visibleSections = () => sections().filter(s => { try {
    if (exitingIds().has(s.id)) return true; // keep visible during exit animation
    if (selectedIds().has(s.id)) return true;
    const el = document.querySelector(s.selector);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const expected = s.originalRect;
    const sizeDiff = Math.abs(rect.width - expected.width) + Math.abs(rect.height - expected.height);
    return sizeDiff < 200;
  } catch { return false; } });

  // Separate changed vs unchanged sections
  const changedSections = () => visibleSections().filter(s => hasChanged(s));
  const unchangedSections = () => visibleSections().filter(s => !hasChanged(s));

  // Track first action per section for badge ordering + clean up deleted sections
  // + Clean up seenGhostIds for sections no longer changed
  // + Keep last known positions of changed sections up to date
  // + Detect sections that just returned to original (connector exit animation)
  createEffect(() => {
    const secs = sections();
    // Track first action per section for badge ordering
    for (const s of secs) {
      if (!firstActionRef.has(s.id)) {
        if (isMoved(s)) firstActionRef.set(s.id, "move");
        else if (isResized(s)) firstActionRef.set(s.id, "resize");
      }
    }
    // Clean up deleted sections
    for (const id of firstActionRef.keys()) {
      if (!secs.some(s => s.id === id)) firstActionRef.delete(id);
    }

    const currentChangedIds = new Set(changedSections().map(s => s.id));

    // Clean up seenGhostIds for sections no longer changed (so animation replays if they become ghosts again)
    for (const id of seenGhostIdsRef) {
      if (!currentChangedIds.has(id)) seenGhostIdsRef.delete(id);
    }

    // Keep last known positions of changed sections up to date
    for (const s of changedSections()) {
      lastChangedRectsRef.set(s.id, { currentRect: s.currentRect, originalRect: s.originalRect, isFixed: s.isFixed });
    }

    // Detect sections that just returned to original (connector exit animation)
    const prev = prevChangedIdsRef;
    prevChangedIdsRef = currentChangedIds;
    const exitingMap = new Map<string, { orig: { x: number; y: number; width: number; height: number }; target: { x: number; y: number; width: number; height: number }; isFixed?: boolean }>();
    for (const id of prev) {
      if (!currentChangedIds.has(id)) {
        // Skip if section was deleted — exitingIds connector fade handles that
        if (!secs.some(s => s.id === id)) continue;
        // Use the last known position before it snapped back
        const last = lastChangedRectsRef.get(id);
        if (last) {
          exitingMap.set(id, { orig: last.originalRect, target: last.currentRect, isFixed: last.isFixed });
          lastChangedRectsRef.delete(id);
        }
      }
    }
    if (exitingMap.size > 0) {
      setExitingConnectors(prevMap => {
        const next = new Map(prevMap);
        for (const [id, data] of exitingMap) next.set(id, data);
        return next;
      });
      const timer = setTimeout(() => {
        setExitingConnectors(prevMap => {
          const next = new Map(prevMap);
          for (const id of exitingMap.keys()) next.delete(id);
          return next;
        });
      }, 250);
      onCleanup(() => clearTimeout(timer));
    }
  });

  return (
    <>
      <div
        class={`${styles.rearrangeOverlay} ${!props.isDarkMode ? styles.light : ""} ${props.exiting ? styles.overlayExiting : ""}${props.className ? ` ${props.className}` : ""}`}
        data-feedback-toolbar
      >
        {/* Hover highlight */}
        <Show when={hoverHighlight()}>
          {(hl) => (
            <div
              class={styles.hoverHighlight}
              style={{ left: `${hl().x}px`, top: `${hl().y}px`, width: `${hl().w}px`, height: `${hl().h}px` }}
            />
          )}
        </Show>

        {/* Unchanged sections — render at currentRect (same as originalRect) */}
        <For each={unchangedSections()}>{(section) => {
          const rect = () => section.currentRect;
          const screenY = () => section.isFixed ? rect().y : rect().y - scrollY();
          const color = SECTION_COLOR;
          const isSelected = () => selectedIds().has(section.id);

          return (
            <div
              data-rearrange-section={section.id}
              class={`${styles.sectionOutline} ${isSelected() ? styles.selected : ""} ${exitingAll() || props.exiting || exitingIds().has(section.id) ? styles.exiting : ""}`}
              style={{ left: `${rect().x}px`, top: `${screenY()}px`, width: `${rect().width}px`, height: `${rect().height}px`, "border-color": color.border, "background-color": color.bg, ...(outlinesReady() ? {} : { opacity: 0, animation: "none", transition: "none" }) }}
              onMouseDown={(e) => handleOutlineMouseDown(e, section.id)}
              onDblClick={() => handleDoubleClick(section.id)}
            >
              <span class={styles.sectionLabel} style={{ "background-color": color.pill }}>
                {section.label}
              </span>
              <span class={`${styles.sectionAnnotation} ${section.note ? styles.annotationVisible : ""}`}>{() => { if (section.note) lastNoteTextRef.set(section.id, section.note); return section.note || lastNoteTextRef.get(section.id) || ""; }}</span>
              <span class={styles.sectionDimensions}>
                {Math.round(rect().width)} &times; {Math.round(rect().height)}
              </span>
              <div
                class={styles.deleteButton}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(section.id)}
              >
                ✕
              </div>
              <For each={HANDLES}>{(dir) => (
                <div
                  class={`${styles.handle} ${styles[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}` as keyof typeof styles]}`}
                  onMouseDown={(e) => handleResizeMouseDown(e, section.id, dir)}
                />
              )}</For>
            </div>
          );
        }}</For>

        {/* No original outlines — connector line is sufficient */}

        {/* Changed sections — ghost outlines at currentRect (interactive) */}
        <For each={changedSections()}>{(section) => {
          const rect = () => section.currentRect;
          const screenY = () => section.isFixed ? rect().y : rect().y - scrollY();
          const isSelected = () => selectedIds().has(section.id);
          const moved = () => isMoved(section);
          const resized = () => isResized(section);
          const settled = () => !isSelected();

          // Only animate ghostEnter the first time a section appears as a ghost
          const isNewGhost = !seenGhostIdsRef.has(section.id);
          if (isNewGhost) seenGhostIdsRef.add(section.id);

          return (
            <Show when={!(props.blankCanvas && settled())}>
              <div
                data-rearrange-section={section.id}
                class={`${styles.ghostOutline} ${isSelected() ? styles.selected : ""} ${exitingAll() || props.exiting || exitingIds().has(section.id) ? styles.exiting : ""}`}
                style={{ left: `${rect().x}px`, top: `${screenY()}px`, width: `${rect().width}px`, height: `${rect().height}px`, ...(outlinesReady() ? {} : { opacity: 0, animation: "none", transition: "none" }), ...(!isNewGhost ? { animation: "none" } : {}) }}
                onMouseDown={(e) => handleOutlineMouseDown(e, section.id)}
                onDblClick={() => handleDoubleClick(section.id)}
              >
                <span class={styles.sectionLabel} style={{ "background-color": SECTION_COLOR.pill }}>
                  {section.label}
                </span>
                <span class={`${styles.sectionAnnotation} ${section.note ? styles.annotationVisible : ""}`}>{() => { if (section.note) lastNoteTextRef.set(section.id, section.note); return section.note || lastNoteTextRef.get(section.id) || ""; }}</span>
                <span class={styles.sectionDimensions}>
                  {Math.round(rect().width)} &times; {Math.round(rect().height)}
                </span>
                <div
                  class={styles.deleteButton}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => handleDelete(section.id)}
                >
                  ✕
                </div>
                <For each={HANDLES}>{(dir) => (
                  <div
                    class={`${styles.handle} ${styles[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}` as keyof typeof styles]}`}
                    onMouseDown={(e) => handleResizeMouseDown(e, section.id, dir)}
                  />
                )}</For>
                <span class={styles.ghostBadge}>
                  {(() => {
                    const first = firstActionRef.get(section.id);
                    if (moved() && resized()) {
                      const [a, b] = first === "resize" ? ["Resize", "Move"] : ["Move", "Resize"];
                      return <>Suggested {a} <span class={styles.ghostBadgeExtra}>&amp; {b}</span></>;
                    }
                    return `Suggested ${resized() ? "Resize" : "Move"}`;
                  })()}
                </span>
              </div>
            </Show>
          );
        }}</For>
      </div>

      {/* Annotation connector lines — SVG from original to ghost/drag position */}
      <Show when={!props.blankCanvas}>
        {(() => {
          // Build list of sections that need connectors: committed changes + live drags
          const connectorSections = (): { id: string; orig: { x: number; y: number; width: number; height: number }; target: { x: number; y: number; width: number; height: number }; isFixed?: boolean; isSelected: boolean; isExiting?: boolean }[] => {
            const result: { id: string; orig: { x: number; y: number; width: number; height: number }; target: { x: number; y: number; width: number; height: number }; isFixed?: boolean; isSelected: boolean; isExiting?: boolean }[] = [];
            for (const s of changedSections()) {
              const livePos = dragPositions().get(s.id);
              result.push({ id: s.id, orig: s.originalRect, target: livePos || s.currentRect, isFixed: s.isFixed, isSelected: selectedIds().has(s.id), isExiting: exitingIds().has(s.id) });
            }
            // Also add sections being dragged that haven't changed yet (first drag)
            for (const [id, pos] of dragPositions()) {
              if (!result.some(c => c.id === id)) {
                const s = sections().find(sec => sec.id === id);
                if (s) result.push({ id, orig: s.originalRect, target: pos, isFixed: s.isFixed, isSelected: selectedIds().has(id) });
              }
            }
            // Add exiting connectors (sections that returned to original)
            for (const [id, data] of exitingConnectors()) {
              if (!result.some(c => c.id === id)) {
                result.push({ id, orig: data.orig, target: data.target, isFixed: data.isFixed, isSelected: false, isExiting: true });
              }
            }
            return result;
          };

          return (
            <Show when={connectorSections().length > 0}>
              <svg class={`${styles.connectorSvg} ${exitingAll() || props.exiting ? styles.connectorExiting : ""}`}>
                <For each={connectorSections()}>{({ id, orig, target, isFixed, isSelected, isExiting: isExitingConn }) => {
                  const ox = orig.x + orig.width / 2;
                  const oy = (isFixed ? orig.y : orig.y - scrollY()) + orig.height / 2;
                  const cx = target.x + target.width / 2;
                  const cy = (isFixed ? target.y : target.y - scrollY()) + target.height / 2;

                  const ddx = cx - ox;
                  const ddy = cy - oy;
                  const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                  if (dist < 2) return null;

                  // Scale dots down as they approach each other
                  const proximityScale = Math.min(1, dist / 40);
                  const perpOffset = Math.min(dist * 0.3, 60);
                  const nx = dist > 0 ? -ddy / dist : 0;
                  const ny = dist > 0 ? ddx / dist : 0;
                  const cpx = (ox + cx) / 2 + nx * perpOffset;
                  const cpy = (oy + cy) / 2 + ny * perpOffset;
                  const isDragging = dragPositions().has(id);
                  const baseOpacity = isDragging || isSelected ? 1 : 0.4;
                  const dotBaseOpacity = isDragging || isSelected ? 1 : 0.5;

                  return (
                    <g class={isExitingConn ? styles.connectorExiting : ""}>
                      <path
                        class={styles.connectorLine}
                        d={`M ${ox} ${oy} Q ${cpx} ${cpy} ${cx} ${cy}`}
                        fill="none"
                        stroke="rgba(59, 130, 246, 0.45)"
                        stroke-width="1.5"
                        opacity={baseOpacity * proximityScale}
                      />
                      {/* Endpoint circles */}
                      <circle class={styles.connectorDot} cx={ox} cy={oy} r={4 * proximityScale} fill="rgba(59, 130, 246, 0.8)" stroke="#fff" stroke-width="1.5" opacity={dotBaseOpacity * proximityScale} filter="url(#connDotShadow)" />
                      <circle class={styles.connectorDot} cx={cx} cy={cy} r={4 * proximityScale} fill="rgba(59, 130, 246, 0.8)" stroke="#fff" stroke-width="1.5" opacity={dotBaseOpacity * proximityScale} filter="url(#connDotShadow)" />
                    </g>
                  );
                }}</For>
                <defs>
                  <filter id="connDotShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0.5" stdDeviation="1" flood-opacity="0.15" />
                  </filter>
                </defs>
              </svg>
            </Show>
          );
        })()}
      </Show>

      {/* Note editing popup */}
      <Show when={editingId()}>
        {(eid) => {
          const es = () => sections().find(s => s.id === eid());
          return (
            <Show when={es()}>
              {(editSection) => {
                const rect = () => editSection().currentRect;
                const screenY = () => editSection().isFixed ? rect().y : rect().y - scrollY();
                const centerX = () => rect().x + rect().width / 2;
                const aboveY = () => screenY() - 8;
                const belowY = () => screenY() + rect().height + 8;
                const fitsAbove = () => aboveY() > 200;
                const fitsBelow = () => belowY() < window.innerHeight - 100;
                const popupLeft = () => Math.max(160, Math.min(window.innerWidth - 160, centerX()));
                const popupStyle = (): JSX.CSSProperties => {
                  if (fitsAbove()) {
                    return { left: `${popupLeft()}px`, bottom: `${window.innerHeight - aboveY()}px` };
                  } else if (fitsBelow()) {
                    return { left: `${popupLeft()}px`, top: `${belowY()}px` };
                  } else {
                    return { left: `${popupLeft()}px`, top: `${Math.max(80, window.innerHeight / 2 - 80)}px` };
                  }
                };
                return (
                  <AnnotationPopupCSS
                    element={editSection().label}
                    placeholder="Add a note about this section"
                    initialValue={editSection().note ?? ""}
                    submitLabel={editHadNoteRef ? "Save" : "Set"}
                    onSubmit={submitEdit}
                    onCancel={dismissEdit}
                    onDelete={editHadNoteRef ? () => { submitEdit(""); } : undefined}
                    isExiting={editExiting()}
                    lightMode={!props.isDarkMode}
                    style={popupStyle()}
                  />
                );
              }}
            </Show>
          );
        }}
      </Show>

      <Show when={sizeIndicator()}>
        {(si) => (
          <div class={styles.sizeIndicator} style={{ left: `${si().x}px`, top: `${si().y}px` }} data-feedback-toolbar>
            {si().text}
          </div>
        )}
      </Show>

      {/* Snap alignment guides */}
      <For each={snapGuides()}>{(g) => (
        <div
          class={styles.guideLine}
          style={
            g.axis === "x"
              ? { position: "fixed", left: `${g.pos}px`, top: "0", width: "1px", height: "100vh" }
              : { position: "fixed", left: "0", top: `${g.pos - scrollY()}px`, width: "100vw", height: "1px" }
          }
        />
      )}</For>
    </>
  );
}
