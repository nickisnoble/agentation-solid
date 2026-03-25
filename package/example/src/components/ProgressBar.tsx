interface ProgressBarProps {
  value: number;
}

export function ProgressBar(props: ProgressBarProps) {
  return (
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
          width: `${props.value}%`,
          background: "#111",
          "border-radius": "3px",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}
