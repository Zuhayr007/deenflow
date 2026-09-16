import { createFileRoute } from "@tanstack/react-router";
import Page from "@/components/Page";
import DuaCollection from "@/components/DuaCollection";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/duas/")({
  head: () =>
    seo(
      "Daily Duas: Arabic, Meaning & Sources",
      "Browse duas for forgiveness, family, travel, gratitude and daily life. Search, save favourites and share supplications.",
      "/duas",
    ),
  component: () => (
    <Page
      title="Duas for daily life"
      intro="Arabic supplications, meanings and source references. Topic labels help you browse; they do not promise a particular outcome."
    >
      <DuaCollection />
    </Page>
  ),
});
