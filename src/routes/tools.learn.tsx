import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import Tool from "@/components/LearnTool";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/tools/learn")({
  head: () =>
    seo(
      "Learn salah",
      "Learn salah with DeenFlow, your daily Islamic companion.",
      "/tools/learn",
    ),
  component: () => (
    <Page title="Learn salah">
      <Tool />
    </Page>
  ),
});
