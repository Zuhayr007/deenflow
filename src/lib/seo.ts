export function seo(title: string, description: string, path: string) {
  const origin =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const url = origin ? new URL(path, origin).href : undefined;
  return {
    meta: [
      { title: title + " | DeenFlow" },
      { name: "description", content: description },
      { property: "og:title", content: title + " | DeenFlow" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      ...(url
        ? [
            { property: "og:url", content: url },
            {
              property: "og:image",
              content: new URL("/og-image.png", origin).href,
            },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: url ? [{ rel: "canonical", href: url }] : [],
  };
}
