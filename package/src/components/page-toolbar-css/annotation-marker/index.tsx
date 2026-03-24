import { JSX, Show } from "solid-js";
import { Annotation } from "../../../types";
import { IconEdit, IconPlus, IconXmark } from "../../icons";
import styles from "./styles.module.scss";

type MarkerClickBehavior = "edit" | "delete";

// =============================================================================
// AnnotationMarker
// =============================================================================

type AnnotationMarkerProps = {
  annotation: Annotation;
  globalIndex: number;
  /** Display index within this layer (for staggered animation delays) */
  layerIndex: number;
  layerSize: number;
  isExiting: boolean;
  isClearing: boolean;
  isAnimated: boolean;
  isHovered: boolean;
  isDeleting: boolean;
  isEditingAny: boolean;
  renumberFrom: number | null;
  markerClickBehavior: MarkerClickBehavior;
  tooltipStyle?: JSX.CSSProperties;
  onHoverEnter: (annotation: Annotation) => void;
  onHoverLeave: () => void;
  onClick: (annotation: Annotation) => void;
  onContextMenu?: (annotation: Annotation) => void;
};

export function AnnotationMarker(props: AnnotationMarkerProps) {
  const showDeleteState = () =>
    (props.isHovered || props.isDeleting) && !props.isEditingAny;
  const showDeleteHover = () =>
    showDeleteState() && props.markerClickBehavior === "delete";
  const isMulti = () => props.annotation.isMultiSelect;

  const markerColor = () =>
    isMulti()
      ? "var(--agentation-color-green)"
      : "var(--agentation-color-accent)";

  const animClass = () =>
    props.isExiting
      ? styles.exit
      : props.isClearing
        ? styles.clearing
        : !props.isAnimated
          ? styles.enter
          : "";

  const animationDelay = () =>
    props.isExiting
      ? `${(props.layerSize - 1 - props.layerIndex) * 20}ms`
      : `${props.layerIndex * 20}ms`;

  return (
    <div
      class={`${styles.marker} ${isMulti() ? styles.multiSelect : ""} ${animClass()} ${showDeleteHover() ? styles.hovered : ""}`}
      data-annotation-marker
      style={{
        left: `${props.annotation.x}%`,
        top: `${props.annotation.y}px`,
        "background-color": showDeleteHover() ? undefined : markerColor(),
        "animation-delay": animationDelay(),
      }}
      onMouseEnter={() => props.onHoverEnter(props.annotation)}
      onMouseLeave={props.onHoverLeave}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        if (!props.isExiting) props.onClick(props.annotation);
      }}
      onContextMenu={
        props.onContextMenu
          ? (e: MouseEvent) => {
              if (props.markerClickBehavior === "delete") {
                e.preventDefault();
                e.stopPropagation();
                if (!props.isExiting) props.onContextMenu!(props.annotation);
              }
            }
          : undefined
      }
    >
      <Show
        when={showDeleteState()}
        fallback={
          <span
            class={
              props.renumberFrom !== null &&
              props.globalIndex >= props.renumberFrom
                ? styles.renumber
                : undefined
            }
          >
            {props.globalIndex + 1}
          </span>
        }
      >
        <Show when={showDeleteHover()} fallback={<IconEdit size={16} />}>
          <IconXmark size={isMulti() ? 18 : 16} />
        </Show>
      </Show>

      <Show when={props.isHovered && !props.isEditingAny}>
        <div
          class={`${styles.markerTooltip} ${styles.enter}`}
          style={props.tooltipStyle}
        >
          <span class={styles.markerQuote}>
            {props.annotation.element}
            {props.annotation.selectedText &&
              ` "${props.annotation.selectedText.slice(0, 30)}${props.annotation.selectedText.length > 30 ? "..." : ""}"`}
          </span>
          <span class={styles.markerNote}>{props.annotation.comment}</span>
        </div>
      </Show>
    </div>
  );
}

// =============================================================================
// PendingMarker
// =============================================================================

type PendingMarkerProps = {
  x: number;
  y: number;
  isMultiSelect?: boolean;
  isExiting: boolean;
};

export function PendingMarker(props: PendingMarkerProps) {
  return (
    <div
      class={`${styles.marker} ${styles.pending} ${props.isMultiSelect ? styles.multiSelect : ""} ${props.isExiting ? styles.exit : styles.enter}`}
      style={{
        left: `${props.x}%`,
        top: `${props.y}px`,
        "background-color": props.isMultiSelect
          ? "var(--agentation-color-green)"
          : "var(--agentation-color-accent)",
      }}
    >
      <IconPlus size={12} />
    </div>
  );
}

// =============================================================================
// ExitingMarker
// =============================================================================

type ExitingMarkerProps = {
  annotation: Annotation;
  fixed?: boolean;
};

export function ExitingMarker(props: ExitingMarkerProps) {
  const isMulti = () => props.annotation.isMultiSelect;
  return (
    <div
      class={`${styles.marker} ${props.fixed ? styles.fixed : ""} ${styles.hovered} ${isMulti() ? styles.multiSelect : ""} ${styles.exit}`}
      data-annotation-marker
      style={{
        left: `${props.annotation.x}%`,
        top: `${props.annotation.y}px`,
      }}
    >
      <IconXmark size={isMulti() ? 12 : 10} />
    </div>
  );
}
