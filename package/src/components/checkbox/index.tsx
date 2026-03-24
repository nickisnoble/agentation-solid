import { JSX, splitProps } from "solid-js";
import styles from "./styles.module.scss";

interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = (props: CheckboxProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={`${styles.checkboxContainer} ${local.class ?? ""}`}>
      <input class={styles.checkboxInput} type="checkbox" {...rest} />
      <svg
        class={styles.checkboxCheck}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          class={styles.checkboxCheckPath}
          d="M3.94 7L6.13 9.19L10.5 4.81"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
