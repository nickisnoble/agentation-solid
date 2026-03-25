import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [count, setCount] = createSignal(0);
  const [progress, setProgress] = createSignal(42);

  return (
    <div>
      <section style={{ "margin-bottom": "2rem" }}>
        <h1 style={{ "font-size": "2rem", "font-weight": "700", "margin-bottom": "0.5rem" }}>
          Agentation SolidJS Demo
        </h1>
        <p style={{ color: "#666" }}>
          Click any element on this page to annotate it.
          The floating toolbar in the bottom-right activates feedback mode.
        </p>
      </section>

      <section style={{ "margin-bottom": "2rem" }}>
        <h2 style={{ "font-size": "1.25rem", "font-weight": "600", "margin-bottom": "0.75rem" }}>
          Interactive Elements
        </h2>
        <div style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}>
          <button
            style={{
              padding: "0.5rem 1rem",
              background: "#111",
              color: "#fff",
              border: "none",
              "border-radius": "6px",
              cursor: "pointer",
              "font-size": "0.875rem",
            }}
            onClick={() => setCount((c) => c + 1)}
          >
            Count: {count()}
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              background: "#fff",
              color: "#111",
              border: "1px solid #ddd",
              "border-radius": "6px",
              cursor: "pointer",
              "font-size": "0.875rem",
            }}
          >
            Secondary
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              background: "#e54",
              color: "#fff",
              border: "none",
              "border-radius": "6px",
              cursor: "pointer",
              "font-size": "0.875rem",
            }}
          >
            Danger
          </button>
        </div>
      </section>

      <section style={{ "margin-bottom": "2rem" }}>
        <h2 style={{ "font-size": "1.25rem", "font-weight": "600", "margin-bottom": "0.75rem" }}>
          Card Component
        </h2>
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            "border-radius": "12px",
            padding: "1.5rem",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ "font-size": "1rem", "font-weight": "600", "margin-bottom": "0.5rem" }}>
            Example Card
          </h3>
          <p style={{ color: "#666", "font-size": "0.875rem", "margin-bottom": "1rem" }}>
            This card demonstrates how agentation handles structured components.
            Try annotating the card, the heading, or this paragraph individually.
          </p>
          <div
            style={{
              height: "6px",
              background: "#eee",
              "border-radius": "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress()}%`,
                background: "#111",
                "border-radius": "3px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress()}
            onInput={(e) => setProgress(Number(e.currentTarget.value))}
            style={{ width: "100%", "margin-top": "0.75rem" }}
          />
        </div>
      </section>

      <section style={{ "margin-bottom": "2rem" }}>
        <h2 style={{ "font-size": "1.25rem", "font-weight": "600", "margin-bottom": "0.75rem" }}>
          Form
        </h2>
        <form
          style={{ display: "flex", "flex-direction": "column", gap: "0.75rem" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <label style={{ "font-size": "0.875rem", "font-weight": "500" }}>
            Name
            <input
              type="text"
              placeholder="Enter your name"
              style={{
                display: "block",
                width: "100%",
                "margin-top": "0.25rem",
                padding: "0.5rem 0.75rem",
                border: "1px solid #ddd",
                "border-radius": "6px",
                "font-size": "0.875rem",
              }}
            />
          </label>
          <label style={{ "font-size": "0.875rem", "font-weight": "500" }}>
            Message
            <textarea
              placeholder="Write something..."
              rows="3"
              style={{
                display: "block",
                width: "100%",
                "margin-top": "0.25rem",
                padding: "0.5rem 0.75rem",
                border: "1px solid #ddd",
                "border-radius": "6px",
                "font-size": "0.875rem",
                resize: "vertical",
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              "align-self": "flex-start",
              padding: "0.5rem 1.5rem",
              background: "#111",
              color: "#fff",
              border: "none",
              "border-radius": "6px",
              cursor: "pointer",
              "font-size": "0.875rem",
            }}
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
