import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import Tool from "@/components/QiblaTool";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/tools/qibla")({
  head: () =>
    seo(
      "Qibla direction",
      "Qibla direction with DeenFlow, your daily Islamic companion.",
      "/tools/qibla",
    ),
  component: () => (
    <Page title="Qibla direction">
      <Tool />
    </Page>
  ),
});
