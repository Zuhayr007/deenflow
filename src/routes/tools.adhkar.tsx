import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import Tool from "@/components/AdhkarTool";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/tools/adhkar")({
  head: () =>
    seo(
      "Morning & evening adhkar",
      "Morning & evening adhkar with DeenFlow, your daily Islamic companion.",
      "/tools/adhkar",
    ),
  component: () => (
    <Page title="Morning & evening adhkar">
      <Tool />
    </Page>
  ),
});
