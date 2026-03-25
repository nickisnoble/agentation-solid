import type { JSX } from "solid-js";

const variantStyles: Record<string, JSX.CSSProperties> = {
  primary: {
    background: "#111",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "#fff",
    color: "#111",
    border: "1px solid #ddd",
  },
  danger: {
    background: "#e54",
    color: "#fff",
    border: "none",
  },
};

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        padding: "0.5rem 1rem",
        "border-radius": "6px",
        cursor: "pointer",
        "font-size": "0.875rem",
        ...variantStyles[props.variant ?? "primary"],
        ...(typeof props.style === "object" ? props.style : {}),
      }}
    />
  );
}
