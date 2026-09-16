import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
} from "@tanstack/react-router";
import { PrayerProvider } from "@/hooks/use-prayer";
import { PrayerReminders } from "@/hooks/use-prayer-notifications";
import AppStatus from "@/components/AppStatus";
import StructuredData from "@/components/StructuredData";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/use-theme";

function NotFoundComponent() {
  return (
    <div
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-4"
    >
      <title>Page not found | DeenFlow</title>
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  useTheme(); // Initialize theme on mount
  return (
    <PrayerProvider>
      <HeadContent />
      <PrayerReminders />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="mx-auto max-w-lg">
        <StructuredData />
        <AppStatus />
        <Outlet />
        <footer className="px-5 pt-1 pb-24 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <a href="/about">About</a>
          <a href="/about/privacy">Privacy</a>
        </footer>
        <BottomNav />
      </div>
    </PrayerProvider>
  );
}
