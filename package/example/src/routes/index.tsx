import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Counter } from "../components/Counter";
import { ContactForm } from "../components/ContactForm";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
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
          <Counter />
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section style={{ "margin-bottom": "2rem" }}>
        <h2 style={{ "font-size": "1.25rem", "font-weight": "600", "margin-bottom": "0.75rem" }}>
          Card Component
        </h2>
        <Card>
          <h3 style={{ "font-size": "1rem", "font-weight": "600", "margin-bottom": "0.5rem" }}>
            Example Card
          </h3>
          <p style={{ color: "#666", "font-size": "0.875rem", "margin-bottom": "1rem" }}>
            This card demonstrates how agentation handles structured components.
            Try annotating the card, the heading, or this paragraph individually.
          </p>
          <ProgressBar value={progress()} />
          <input
            type="range"
            min="0"
            max="100"
            value={progress()}
            onInput={(e) => setProgress(Number(e.currentTarget.value))}
            style={{ width: "100%", "margin-top": "0.75rem" }}
          />
        </Card>
      </section>

      <section style={{ "margin-bottom": "2rem" }}>
        <h2 style={{ "font-size": "1.25rem", "font-weight": "600", "margin-bottom": "0.75rem" }}>
          Form
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}
