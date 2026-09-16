import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { AppLoader } from "./components/AppLoader";
import "./styles.css";

const router = getRouter();

function AppBootstrap() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <AppLoader onComplete={() => setIsLoading(false)} />
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

// Prerendered metadata serves crawlers before JavaScript. React owns it after boot.
// Remove only the route-managed tags, keeping viewport, icons and styles intact.
document.head
  .querySelectorAll(
    'title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], meta[name="robots"], link[rel="canonical"], script[type="application/ld+json"]',
  )
  .forEach((tag) => tag.remove());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppBootstrap />
  </React.StrictMode>,
);
