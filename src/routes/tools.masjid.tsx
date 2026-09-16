import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import Tool from "@/components/MasjidTool";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/tools/masjid")({
  head: () =>
    seo(
      "My masjid",
      "My masjid with DeenFlow, your daily Islamic companion.",
      "/tools/masjid",
    ),
  component: () => (
    <Page title="My masjid">
      <Tool />
    </Page>
  ),
});
