import { JSX, splitProps } from "solid-js";
import styles from "./styles.module.scss";

interface SwitchProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = (props: SwitchProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={`${styles.switchContainer} ${local.class ?? ""}`}>
      <input class={styles.switchInput} type="checkbox" {...rest} />
      <div class={styles.switchThumb}></div>
    </div>
  );
};
