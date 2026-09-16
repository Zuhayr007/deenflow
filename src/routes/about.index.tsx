import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/components/AboutPage";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/about/")({
  head: () =>
    seo(
      "About DeenFlow",
      "Learn about DeenFlow, its Islamic tools and approach to sources and privacy.",
      "/about",
    ),
  component: () => <AboutPage topic="about" />,
});
