import { useLocation } from "@tanstack/react-router";
export default function StructuredData() {
  const { pathname } = useLocation();
  const origin =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  if (!origin) return null;
  const site = { "@type": "WebSite", name: "DeenFlow", url: origin };
  const data =
    pathname === "/"
      ? { "@context": "https://schema.org", ...site }
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: new URL(pathname, origin).href,
          isPartOf: site,
        };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
