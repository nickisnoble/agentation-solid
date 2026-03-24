import { JSX, Show } from "solid-js";
import { For } from "solid-js";
import { COLOR_OPTIONS, ToolbarSettings } from "..";
import { OUTPUT_DETAIL_OPTIONS } from "../../../utils/generate-output";
import { HelpTooltip } from "../../help-tooltip";
import { IconChevronLeft, IconMoon, IconSun } from "../../icons";
import { Switch } from "../../switch";
import { CheckboxField } from "./checkbox-field";
import styles from "./styles.module.scss";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export type SettingsPanelProps = {
  settings: ToolbarSettings;
  onSettingsChange: (patch: Partial<ToolbarSettings>) => void;

  isDarkMode: boolean;
  onToggleTheme: () => void;

  isDevMode: boolean;

  connectionStatus: ConnectionStatus;
  endpoint?: string;

  /** Whether the panel is mounted (controls enter/exit class) */
  isVisible: boolean;

  /** Position override: show panel above toolbar when toolbar is near bottom */
  toolbarNearBottom: boolean;

  settingsPage: "main" | "automations";
  onSettingsPageChange: (page: "main" | "automations") => void;

  onHideToolbar: () => void;
};

export function SettingsPanel(props: SettingsPanelProps) {
  return (
    <div
      class={`${styles.settingsPanel} ${props.isVisible ? styles.enter : styles.exit}`}
      style={
        props.toolbarNearBottom
          ? { bottom: "auto", top: "calc(100% + 0.5rem)" }
          : undefined
      }
      data-agentation-settings-panel
    >
      <div class={styles.settingsPanelContainer}>
        {/* -- Main page -- */}
        <div
          class={`${styles.settingsPage} ${props.settingsPage === "automations" ? styles.slideLeft : ""}`}
        >
          <div class={styles.settingsHeader}>
            <p class={styles.settingsBrand}>
              <span class={styles.settingsBrandSlash}>/</span>
              agentation
            </p>
            <p class={styles.settingsVersion}>v{__VERSION__}</p>
            <button
              class={styles.themeToggle}
              onClick={props.onToggleTheme}
              title={
                props.isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <span class={styles.themeIconWrapper}>
                <span class={styles.themeIcon}>
                  <Show when={props.isDarkMode} fallback={<IconMoon size={20} />}>
                    <IconSun size={20} />
                  </Show>
                </span>
              </span>
            </button>
          </div>

          <div class={styles.divider}></div>

          {/* Output detail + React toggle */}
          <div class={styles.settingsSection}>
            <div class={styles.settingsRow}>
              <div class={styles.settingsLabel}>
                Output Detail
                <HelpTooltip content="Controls how much detail is included in the copied output" />
              </div>
              <button
                class={styles.cycleButton}
                onClick={() => {
                  const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
                    (opt) => opt.value === props.settings.outputDetail,
                  );
                  const nextIndex =
                    (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length;
                  props.onSettingsChange({
                    outputDetail: OUTPUT_DETAIL_OPTIONS[nextIndex].value,
                  });
                }}
              >
                <span class={styles.cycleButtonText}>
                  {
                    OUTPUT_DETAIL_OPTIONS.find(
                      (opt) => opt.value === props.settings.outputDetail,
                    )?.label
                  }
                </span>
                <span class={styles.cycleDots}>
                  <For each={OUTPUT_DETAIL_OPTIONS}>
                    {(option) => (
                      <span
                        class={`${styles.cycleDot} ${props.settings.outputDetail === option.value ? styles.active : ""}`}
                      />
                    )}
                  </For>
                </span>
              </button>
            </div>

            <div
              class={`${styles.settingsRow} ${styles.settingsRowMarginTop} ${!props.isDevMode ? styles.settingsRowDisabled : ""}`}
            >
              <div class={styles.settingsLabel}>
                React Components
                <HelpTooltip
                  content={
                    !props.isDevMode
                      ? "Disabled — production builds minify component names, making detection unreliable. Use in development mode."
                      : "Include React component names in annotations"
                  }
                />
              </div>
              <Switch
                checked={props.isDevMode && props.settings.reactEnabled}
                onChange={(e) =>
                  props.onSettingsChange({ reactEnabled: e.target.checked })
                }
                disabled={!props.isDevMode}
              />
            </div>

            <div
              class={`${styles.settingsRow} ${styles.settingsRowMarginTop}`}
            >
              <div class={styles.settingsLabel}>
                Hide Until Restart
                <HelpTooltip content="Hides the toolbar until you open a new tab" />
              </div>
              <Switch
                checked={false}
                onChange={(e) => {
                  if (e.target.checked) props.onHideToolbar();
                }}
              />
            </div>
          </div>

          <div class={styles.divider}></div>

          {/* Color picker */}
          <div class={styles.settingsSection}>
            <div
              class={`${styles.settingsLabel} ${styles.settingsLabelMarker}`}
            >
              Marker Color
            </div>
            <div class={styles.colorOptions}>
              <For each={COLOR_OPTIONS}>
                {(color) => (
                  <button
                    class={`${styles.colorOption} ${props.settings.annotationColorId === color.id ? styles.selected : ""}`}
                    style={{
                      "--swatch": color.srgb,
                      "--swatch-p3": color.p3,
                    }}
                    onClick={() =>
                      props.onSettingsChange({ annotationColorId: color.id })
                    }
                    title={color.label}
                    type="button"
                  ></button>
                )}
              </For>
            </div>
          </div>

          <div class={styles.divider}></div>

          {/* Checkboxes */}
          <div class={styles.settingsSection}>
            <CheckboxField
              class="checkbox-field"
              label="Clear on copy/send"
              checked={props.settings.autoClearAfterCopy}
              onChange={(e) =>
                props.onSettingsChange({ autoClearAfterCopy: e.target.checked })
              }
              tooltip="Automatically clear annotations after copying"
            />
            <CheckboxField
              class={styles.checkboxField}
              label="Block page interactions"
              checked={props.settings.blockInteractions}
              onChange={(e) =>
                props.onSettingsChange({ blockInteractions: e.target.checked })
              }
            />
          </div>

          <div class={styles.divider} />

          {/* Nav to automations */}
          <button
            class={styles.settingsNavLink}
            onClick={() => props.onSettingsPageChange("automations")}
          >
            <span>Manage MCP & Webhooks</span>
            <span class={styles.settingsNavLinkRight}>
              <Show when={props.endpoint && props.connectionStatus !== "disconnected"}>
                <span
                  class={`${styles.mcpNavIndicator} ${styles[props.connectionStatus]}`}
                />
              </Show>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 12.5L12 8L7.5 3.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* -- Automations page -- */}
        <div
          class={`${styles.settingsPage} ${styles.automationsPage} ${props.settingsPage === "automations" ? styles.slideIn : ""}`}
        >
          <button
            class={styles.settingsBackButton}
            onClick={() => props.onSettingsPageChange("main")}
          >
            <IconChevronLeft size={16} />
            <span>Manage MCP & Webhooks</span>
          </button>

          <div class={styles.divider}></div>

          {/* MCP section */}
          <div class={styles.settingsSection}>
            <div class={styles.settingsRow}>
              <span class={styles.automationHeader}>
                MCP Connection
                <HelpTooltip content="Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time." />
              </span>
              <Show when={props.endpoint}>
                <div
                  class={`${styles.mcpStatusDot} ${styles[props.connectionStatus]}`}
                  title={
                    props.connectionStatus === "connected"
                      ? "Connected"
                      : props.connectionStatus === "connecting"
                        ? "Connecting..."
                        : "Disconnected"
                  }
                />
              </Show>
            </div>
            <p
              class={styles.automationDescription}
              style={{ "padding-bottom": "6px" }}
            >
              MCP connection allows agents to receive and act on annotations.{" "}
              <a
                href="https://agentation.dev/mcp"
                target="_blank"
                rel="noopener noreferrer"
                class={styles.learnMoreLink}
              >
                Learn more
              </a>
            </p>
          </div>

          <div class={styles.divider}></div>

          {/* Webhooks section */}
          <div
            class={`${styles.settingsSection} ${styles.settingsSectionGrow}`}
          >
            <div class={styles.settingsRow}>
              <span class={styles.automationHeader}>
                Webhooks
                <HelpTooltip content="Send annotation data to any URL endpoint when annotations change. Useful for custom integrations." />
              </span>
              <div class={styles.autoSendContainer}>
                <label
                  for="agentation-auto-send"
                  class={`${styles.autoSendLabel} ${props.settings.webhooksEnabled ? styles.active : ""} ${!props.settings.webhookUrl ? styles.disabled : ""}`}
                >
                  Auto-Send
                </label>
                <Switch
                  id="agentation-auto-send"
                  checked={props.settings.webhooksEnabled}
                  onChange={(e) =>
                    props.onSettingsChange({
                      webhooksEnabled: e.target.checked,
                    })
                  }
                  disabled={!props.settings.webhookUrl}
                />
              </div>
            </div>
            <p class={styles.automationDescription}>
              The webhook URL will receive live annotation changes and
              annotation data.
            </p>
            <textarea
              class={styles.webhookUrlInput}
              placeholder="Webhook URL"
              value={props.settings.webhookUrl}
              onKeyDown={(e) => e.stopPropagation()}
              onInput={(e) => props.onSettingsChange({ webhookUrl: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
