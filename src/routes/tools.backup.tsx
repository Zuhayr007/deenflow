import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import Tool from "@/components/BackupTool";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/tools/backup")({
  head: () =>
    seo(
      "Offline & backup",
      "Offline & backup with DeenFlow, your daily Islamic companion.",
      "/tools/backup",
    ),
  component: () => (
    <Page title="Offline & backup">
      <Tool />
    </Page>
  ),
});
