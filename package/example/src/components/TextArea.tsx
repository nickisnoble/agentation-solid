import type { JSX } from "solid-js";

interface TextAreaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextArea(props: TextAreaProps) {
  return (
    <label style={{ "font-size": "0.875rem", "font-weight": "500" }}>
      {props.label}
      <textarea
        {...props}
        style={{
          display: "block",
          width: "100%",
          "margin-top": "0.25rem",
          padding: "0.5rem 0.75rem",
          border: "1px solid #ddd",
          "border-radius": "6px",
          "font-size": "0.875rem",
          resize: "vertical",
          ...(typeof props.style === "object" ? props.style : {}),
        }}
      />
    </label>
  );
}
