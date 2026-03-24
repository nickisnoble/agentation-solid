<img src="./package/logo.svg" alt="Agentation" width="50" />

# agentation-solid

An unofficial SolidJS port of **[Agentation](https://agentation.dev)** — an agent-agnostic visual feedback tool. Click elements on your page, add notes, and copy structured output that helps AI coding agents find the exact code you're referring to.

99% identical UX and DX to the React original.

## Install

```bash
npm install agentation-solid -D
```

## Usage

```tsx
import { Agentation } from 'agentation-solid';
import { Show } from 'solid-js';

function App() {
  return (
    <>
      <YourApp />
      <Show when={import.meta.env.DEV}>
        <Agentation />
      </Show>
    </>
  );
}
```

The toolbar appears in the bottom-right corner. Click to activate, then click any element to annotate it.

## Features

- **Click to annotate** -- Click any element with automatic selector identification
- **Text selection** -- Select text to annotate specific content
- **Multi-select** -- Drag to select multiple elements at once
- **Area selection** -- Drag to annotate any region, even empty space
- **Animation pause** -- Freeze all animations (CSS, JS, videos) to capture specific states
- **Component tree** -- Shows SolidJS component names in dev mode
- **Structured output** -- Copy markdown with selectors, positions, and context
- **Programmatic access** -- Callback props for direct integration with tools
- **Dark/light mode** -- Toggle in settings, persists to localStorage
- **Zero dependencies** -- Pure CSS animations, no runtime libraries beyond SolidJS

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onAnnotationAdd` | `(annotation: Annotation) => void` | - | Called when an annotation is created |
| `onAnnotationDelete` | `(annotation: Annotation) => void` | - | Called when an annotation is deleted |
| `onAnnotationUpdate` | `(annotation: Annotation) => void` | - | Called when an annotation is edited |
| `onAnnotationsClear` | `(annotations: Annotation[]) => void` | - | Called when all annotations are cleared |
| `onCopy` | `(markdown: string) => void` | - | Callback with markdown output when copy is clicked |
| `onSubmit` | `(output: string, annotations: Annotation[]) => void` | - | Called when "Send Annotations" is clicked |
| `copyToClipboard` | `boolean` | `true` | Set to false to prevent writing to clipboard |
| `class` | `string` | - | Custom class name for the toolbar container |
| `endpoint` | `string` | - | Server URL for Agent Sync (e.g., `"http://localhost:4747"`) |
| `sessionId` | `string` | - | Pre-existing session ID to join |
| `onSessionCreated` | `(sessionId: string) => void` | - | Called when a new session is created |
| `webhookUrl` | `string` | - | Webhook URL to receive annotation events |

### Programmatic Integration

Use callbacks to receive annotation data directly:

```tsx
import { Agentation, type Annotation } from 'agentation-solid';

function App() {
  const handleAnnotation = (annotation: Annotation) => {
    console.log(annotation.element);      // "Button"
    console.log(annotation.elementPath);  // "body > div > button"
    console.log(annotation.boundingBox);  // { x, y, width, height }
    console.log(annotation.cssClasses);   // "btn btn-primary"

    sendToAgent(annotation);
  };

  return (
    <>
      <YourApp />
      <Agentation
        onAnnotationAdd={handleAnnotation}
        copyToClipboard={false}
      />
    </>
  );
}
```

### Annotation Type

```typescript
type Annotation = {
  id: string;
  x: number;                    // % of viewport width
  y: number;                    // px from top of document
  comment: string;              // User's note
  element: string;              // e.g., "Button"
  elementPath: string;          // e.g., "body > div > button"
  timestamp: number;

  // Optional metadata (when available)
  selectedText?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  nearbyText?: string;
  cssClasses?: string;
  nearbyElements?: string;
  computedStyles?: string;
  fullPath?: string;
  accessibility?: string;
  isMultiSelect?: boolean;
  isFixed?: boolean;
  reactComponents?: string;     // Component hierarchy (named for MCP compat)
};
```

> **Note:** The `reactComponents` field name is preserved for compatibility with the [agentation-mcp](https://www.npmjs.com/package/agentation-mcp) server. It contains SolidJS component names when running in dev mode.

## MCP Server Compatibility

This package works with the same [agentation-mcp](https://www.npmjs.com/package/agentation-mcp) server as the React version. The annotation JSON schema is identical.

## How it works

Agentation captures class names, selectors, and element positions so AI agents can `grep` for the exact code you're referring to. Instead of describing "the blue button in the sidebar," you give the agent `.sidebar > button.primary` and your feedback.

## Requirements

- SolidJS 1.8+
- Desktop browser (mobile not supported)

## Docs

Full documentation at [agentation.dev](https://agentation.dev)

## License

Licensed under PolyForm Shield 1.0.0
