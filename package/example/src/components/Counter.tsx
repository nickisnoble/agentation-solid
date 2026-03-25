import { createSignal } from "solid-js";
import { Button } from "./Button";

export function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <Button onClick={() => setCount((c) => c + 1)}>
      Count: {count()}
    </Button>
  );
}
