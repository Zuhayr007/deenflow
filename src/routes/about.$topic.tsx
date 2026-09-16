import { createFileRoute, notFound } from "@tanstack/react-router";
import AboutPage from "@/components/AboutPage";
import { ABOUT } from "@/lib/about-content";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/about/$topic")({
  loader: ({ params }) => {
    if (!Object.hasOwn(ABOUT, params.topic) || params.topic === "about")
      throw notFound();
    return params.topic as keyof typeof ABOUT;
  },
  head: ({ loaderData }) =>
    seo(
      loaderData ? ABOUT[loaderData].title : "Not found",
      loaderData ? ABOUT[loaderData].paragraphs[0] : "Page not found.",
      "/about/" + loaderData,
    ),
  component: Topic,
});
function Topic() {
  return <AboutPage topic={Route.useLoaderData()} />;
}
