import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
import type { Plugin } from "esbuild";

// Read version from package.json at build time
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const VERSION = pkg.version;

// Custom SCSS CSS Modules plugin with SSR-safe style injection
function scssModulesPlugin(): Plugin {
  return {
    name: "scss-modules",
    setup(build) {
      // Handle all .scss files
      build.onLoad({ filter: /\.scss$/ }, async (args) => {
        const isModule = args.path.includes(".module.");
        // Use parent directory + filename for unique style IDs
        const parentDir = path.basename(path.dirname(args.path));
        const baseName = path.basename(args.path, isModule ? ".module.scss" : ".scss");
        const styleId = `${parentDir}-${baseName}`;

        // Compile SCSS to CSS
        const result = sass.compile(args.path);
        let css = result.css;

        if (isModule) {
          // Process with postcss-modules to get class name mappings
          let classNames: Record<string, string> = {};
          const postcssResult = await postcss([
            postcssModules({
              getJSON(cssFileName, json) {
                classNames = json;
              },
              generateScopedName: "[name]__[local]___[hash:base64:5]",
            }),
          ]).process(css, { from: args.path });

          css = postcssResult.css;

          // Generate JS that exports class names and injects styles (SSR-safe)
          const contents = `
const css = ${JSON.stringify(css)};
const classNames = ${JSON.stringify(classNames)};

// SSR-safe style injection
if (typeof document !== 'undefined') {
  let style = document.getElementById('feedback-tool-styles-${styleId}');
  if (!style) {
    style = document.createElement('style');
    style.id = 'feedback-tool-styles-${styleId}';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

export default classNames;
`;
          return { contents, loader: "js" };
        } else {
          // Regular SCSS - no CSS modules processing
          const contents = `
const css = ${JSON.stringify(css)};
if (typeof document !== 'undefined') {
  let style = document.getElementById('feedback-tool-styles-${styleId}');
  if (!style) {
    style = document.createElement('style');
    style.id = 'feedback-tool-styles-${styleId}';
    style.textContent = css;
    document.head.appendChild(style);
  }
}
export default {};
`;
          return { contents, loader: "js" };
        }
      });
    },
  };
}

const presetOptions: preset.PresetOptions = {
  entries: [
    {
      // .tsx entry so the preset generates a `solid` export condition
      // with preserved JSX for bundlers, plus compiled builds for Node/SSR
      entry: "src/index.tsx",
      server_entry: true,
    },
  ],
  cjs: true,
  esbuild_plugins: [scssModulesPlugin()],
};

export default defineConfig((config) => {
  const watching = !!config.watch;
  const parsed = preset.parsePresetOptions(presetOptions, watching);

  if (!watching) {
    const packageFields = preset.generatePackageExports(parsed);
    console.log(
      `\npackage.json exports:\n${JSON.stringify(packageFields, null, 2)}\n`
    );
    preset.writePackageJson(packageFields);
  }

  return preset.generateTsupOptions(parsed).map((tsupOptions) => ({
    ...tsupOptions,
    splitting: false,
    sourcemap: true,
    define: {
      ...tsupOptions.define,
      __VERSION__: JSON.stringify(VERSION),
      __DEV_MODE__: "import.meta.env.DEV",
    },
  }));
});
