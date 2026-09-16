import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DUA_CONTENT } from "@/lib/dua-content";
import { seo } from "@/lib/seo";
import Page from "@/components/Page";
import DuaCard from "@/components/DuaCard";
export const Route = createFileRoute("/dua/$duaId")({
  loader: ({ params }) => {
    const dua = DUA_CONTENT.find((d) => String(d.id) === params.duaId);
    if (!dua) throw notFound();
    return dua;
  },
  head: ({ loaderData }) =>
    seo(
      loaderData?.title || "Dua",
      loaderData?.english || "Arabic dua with meaning and source.",
      "/dua/" + loaderData?.id,
    ),
  component: Detail,
});
function Detail() {
  const dua = Route.useLoaderData();
  return (
    <Page title={dua.title} intro={dua.category}>
      <Link to="/duas" className="text-primary">
        ← Browse all duas
      </Link>
      <DuaCard dua={dua} index={0} />
    </Page>
  );
}
