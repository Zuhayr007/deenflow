import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { prerenderToNodeStream } from "react-dom/static";
import { getRouter } from "./router";
export async function renderPage(path: string): Promise<string> {
  const router = getRouter(createMemoryHistory({ initialEntries: [path] }));
  await router.load();
  // Static HTML must contain resolved content, not hidden streaming segments
  // that need JavaScript to reveal them.
  let renderError: unknown;
  const { prelude } = await prerenderToNodeStream(
    <RouterProvider router={router} />,
    {
      // Even resolved Suspense boundaries are split into hidden segments above
      // React's streaming size threshold. Keep static pages fully inline.
      progressiveChunkSize: Number.MAX_SAFE_INTEGER,
      onError(error) {
        renderError = error;
      },
    },
  );
  if (renderError) throw renderError;
  return new Promise((resolve, reject) => {
    prelude.setEncoding("utf8");
    let html = "";
    prelude.on("data", (chunk) => {
      html += chunk;
    });
    prelude.on("end", () => resolve(html));
    prelude.on("error", reject);
  });
}
