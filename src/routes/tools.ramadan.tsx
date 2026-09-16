import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import Tool from "@/components/RamadanTool";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/tools/ramadan")({
  head: () =>
    seo(
      "Ramadan & fasting",
      "Ramadan & fasting with DeenFlow, your daily Islamic companion.",
      "/tools/ramadan",
    ),
  component: () => (
    <Page title="Ramadan & fasting">
      <Tool />
    </Page>
  ),
});
