// =============================================================================
// Source Location Detection Utilities
// =============================================================================
//
// This module provides types and stubs for source file location detection.
// Source location detection was React-specific (using _debugSource on fiber
// nodes) and does not apply to SolidJS. The annotations system still works
// fully without source location info.
//
// The exported types and function signatures are preserved for API
// compatibility, but the implementation gracefully returns "not supported".
// =============================================================================

/**
 * Source location information for a component
 */
export interface SourceLocation {
  /** Absolute or relative file path */
  fileName: string;
  /** Line number (1-indexed) */
  lineNumber: number;
  /** Column number (0-indexed, may be undefined) */
  columnNumber?: number;
  /** Component display name if available */
  componentName?: string;
}

/**
 * Result of source location detection
 */
export interface SourceLocationResult {
  /** Whether source location was found */
  found: boolean;
  /** Source location data (if found) */
  source?: SourceLocation;
  /** Reason if not found */
  reason?: SourceLocationNotFoundReason;
  /** Whether the app appears to be a React app */
  isReactApp: boolean;
  /** Whether running in production mode */
  isProduction: boolean;
}

/**
 * Reasons why source location might not be found
 */
export type SourceLocationNotFoundReason =
  | "not-react-app"
  | "not-supported"
  | "production-build"
  | "no-fiber"
  | "no-debug-source"
  | "react-19-changed"
  | "element-not-in-react-tree"
  | "unknown";

/**
 * Gets the source file location for a DOM element.
 *
 * Source location detection is not supported in the SolidJS port.
 * This was a React-specific feature that relied on _debugSource metadata
 * attached to React fiber nodes in development builds.
 *
 * @param _element - DOM element (unused)
 * @returns SourceLocationResult indicating not supported
 */
export function getSourceLocation(
  _element: HTMLElement,
): SourceLocationResult {
  return {
    found: false,
    reason: "not-supported",
    isReactApp: false,
    isProduction: false,
  };
}

/**
 * Formats a source location as a clickable file path string
 *
 * @param source - Source location object
 * @param format - Output format: "vscode" for VSCode URL, "path" for file:line format
 * @returns Formatted string
 *
 * @example
 * ```ts
 * formatSourceLocation(source, "path")
 * // Returns: "src/components/Button.tsx:42:8"
 *
 * formatSourceLocation(source, "vscode")
 * // Returns: "vscode://file/absolute/path/src/components/Button.tsx:42:8"
 * ```
 */
export function formatSourceLocation(
  source: SourceLocation,
  format: "path" | "vscode" = "path",
): string {
  const { fileName, lineNumber, columnNumber } = source;

  // Build line:column suffix
  let location = `${fileName}:${lineNumber}`;
  if (columnNumber !== undefined) {
    location += `:${columnNumber}`;
  }

  if (format === "vscode") {
    // VSCode can open files via URL protocol
    // Assumes fileName is absolute or can be resolved
    return `vscode://file${fileName.startsWith("/") ? "" : "/"}${location}`;
  }

  return location;
}

/**
 * Gets source locations for multiple elements at once
 *
 * @param elements - Array of DOM elements
 * @returns Array of source location results
 */
export function getSourceLocations(
  elements: HTMLElement[],
): SourceLocationResult[] {
  return elements.map((element) => getSourceLocation(element));
}

/**
 * Finds the nearest component ancestor that has source info.
 *
 * In the SolidJS port, this delegates to getSourceLocation which
 * always returns not-supported.
 *
 * @param element - Starting DOM element
 * @param _maxAncestors - Maximum DOM ancestors to check (unused)
 * @returns Source location result
 */
export function findNearestComponentSource(
  element: HTMLElement,
  _maxAncestors = 10,
): SourceLocationResult {
  return getSourceLocation(element);
}

/**
 * Gets all component sources in the ancestor chain.
 *
 * Not supported in the SolidJS port - always returns an empty array.
 *
 * @param _element - Starting DOM element (unused)
 * @returns Empty array
 */
export function getComponentHierarchy(
  _element: HTMLElement,
): SourceLocation[] {
  return [];
}

/**
 * Checks if source location detection is likely to work in the current environment.
 *
 * In the SolidJS port, source location is not supported.
 *
 * @returns Object describing support status
 */
export function checkSourceLocationSupport(): {
  supported: boolean;
  reason: string;
  suggestions: string[];
} {
  return {
    supported: false,
    reason:
      "Source location detection is not available in the SolidJS version. " +
      "This feature relied on React's _debugSource fiber metadata.",
    suggestions: [],
  };
}
