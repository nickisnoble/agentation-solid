import type { JSX } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input(props: InputProps) {
  return (
    <label style={{ "font-size": "0.875rem", "font-weight": "500" }}>
      {props.label}
      <input
        {...props}
        style={{
          display: "block",
          width: "100%",
          "margin-top": "0.25rem",
          padding: "0.5rem 0.75rem",
          border: "1px solid #ddd",
          "border-radius": "6px",
          "font-size": "0.875rem",
          ...(typeof props.style === "object" ? props.style : {}),
        }}
      />
    </label>
  );
}
