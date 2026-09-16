import { createFileRoute, notFound } from "@tanstack/react-router";
import Page from "@/components/Page";
import DuaCollection from "@/components/DuaCollection";
import { CATEGORIES } from "@/lib/dua-content";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/duas/$category")({
  loader: ({ params }) => {
    const category = CATEGORIES.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return category;
  },
  head: ({ loaderData }) =>
    seo(
      "Duas: " + (loaderData?.name || "Topic"),
      "Arabic supplications with English meanings and references for " +
        (loaderData?.name || "daily life") +
        ".",
      "/duas/" + loaderData?.slug,
    ),
  component: Category,
});
function Category() {
  const c = Route.useLoaderData();
  return (
    <Page
      title={c.name}
      intro="Read the wording and meaning, and follow the source for its full context."
    >
      <DuaCollection category={c.name} />
    </Page>
  );
}
