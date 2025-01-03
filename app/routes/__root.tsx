import {
  createRootRoute,
  Outlet,
  ScriptOnce,
  ScrollRestoration,
} from '@tanstack/react-router';
import { createServerFn, Meta, Scripts } from '@tanstack/start';
import { lazy, Suspense } from 'react';

import { getAuthSession } from '../server/auth';
import appCss from '../styles/tailwind.css?url';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { user } = await getAuthSession();
  return user;
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await getUser();
    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStarter',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Suspense>
          <TanStackRouterDevtools position="bottom-left" />
        </Suspense>

        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>

        <Scripts />
      </body>
    </html>
  );
}
