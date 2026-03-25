import type { JSX } from "solid-js";

interface CardProps {
  children: JSX.Element;
}

export function Card(props: CardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        "border-radius": "12px",
        padding: "1.5rem",
        "box-shadow": "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {props.children}
    </div>
  );
}
