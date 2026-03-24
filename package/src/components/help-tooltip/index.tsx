import { Tooltip } from "../tooltip";
import { IconHelp } from "../icons";
import styles from "./styles.module.scss";

interface HelpTooltipProps {
  content: string;
}

export const HelpTooltip = (props: HelpTooltipProps) => {
  return (
    <Tooltip class={styles.tooltip} content={props.content}>
      <IconHelp class={styles.tooltipIcon} />
    </Tooltip>
  );
};
