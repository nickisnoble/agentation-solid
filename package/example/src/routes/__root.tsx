import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import { Agentation } from "agentation-solid";
import { Nav } from "../components/Nav";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Agentation SolidJS Demo</title>
        <HydrationScript />
        <HeadContent />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #fafafa;
          }
          nav {
            display: flex;
            gap: 1.5rem;
            padding: 1rem 2rem;
            background: #fff;
            border-bottom: 1px solid #eee;
          }
          nav a {
            color: #555;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.875rem;
          }
          nav a:hover { color: #000; }
          nav a[data-status="active"] { color: #000; border-bottom: 2px solid #000; }
          main { max-width: 720px; margin: 0 auto; padding: 2rem; }
        `}</style>
      </head>
      <body>
        <Nav />
        <main>
          <Outlet />
        </main>
        <Agentation />
        <Scripts />
      </body>
    </html>
  );
}
