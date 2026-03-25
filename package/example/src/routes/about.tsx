import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <h1 style={{ "font-size": "2rem", "font-weight": "700", "margin-bottom": "0.5rem" }}>
        About
      </h1>
      <p style={{ color: "#666", "margin-bottom": "1.5rem" }}>
        This is a second page to verify the toolbar persists across client-side navigation.
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          "border-radius": "12px",
          padding: "1.5rem",
          "box-shadow": "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ "font-size": "1.125rem", "font-weight": "600", "margin-bottom": "0.75rem" }}>
          What is Agentation?
        </h2>
        <p style={{ "font-size": "0.875rem", color: "#444", "line-height": "1.7" }}>
          A floating toolbar for annotating web pages and collecting structured feedback
          for AI coding agents. Click elements to annotate them, add comments, and export
          structured feedback that agents can act on.
        </p>
      </div>
    </div>
  );
}
