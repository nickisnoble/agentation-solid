import { JSX, splitProps, createUniqueId } from "solid-js";
import { Show } from "solid-js";
import { Checkbox } from "../../../checkbox";
import { HelpTooltip } from "../../../help-tooltip";
import styles from "./styles.module.scss";

interface CheckboxFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label: string;
  tooltip?: string;
  checked?: boolean;
  onChange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
}

export const CheckboxField = (props: CheckboxFieldProps) => {
  const [local, rest] = splitProps(props, [
    "class",
    "label",
    "tooltip",
    "checked",
    "onChange",
  ]);
  const id = createUniqueId();

  return (
    <div class={`${styles.container} ${local.class ?? ""}`} {...rest}>
      <Checkbox id={id} onChange={local.onChange} checked={local.checked} />
      <label class={styles.label} for={id}>
        {local.label}
      </label>
      <Show when={local.tooltip}>
        <HelpTooltip content={local.tooltip!} />
      </Show>
    </div>
  );
};
