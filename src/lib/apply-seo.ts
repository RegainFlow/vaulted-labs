import { getRouteSeo, SEO_SITE_URL } from "./seo";

function upsertMeta(
  selector: string,
  attrName: "name" | "property",
  attrValue: string,
  content: string
) {
  let meta = document.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export function applySeo(pathname: string) {
  if (typeof document === "undefined") return;

  const seo = getRouteSeo(pathname);
  const canonicalUrl = new URL(seo.canonicalPath, SEO_SITE_URL).toString();
  const ogTitle = seo.ogTitle ?? seo.title;
  const ogDescription = seo.ogDescription ?? seo.description;
  const ogImage = seo.ogImage ?? "/og-image.png";
  const twitterTitle = seo.twitterTitle ?? seo.title;
  const twitterDescription = seo.twitterDescription ?? seo.description;
  const twitterImage = seo.twitterImage ?? ogImage;
  const robots = seo.robots ?? "index,follow";

  document.title = seo.title;

  upsertMeta("meta[name='description']", "name", "description", seo.description);
  upsertMeta("meta[name='robots']", "name", "robots", robots);

  upsertCanonical(canonicalUrl);

  upsertMeta("meta[property='og:type']", "property", "og:type", "website");
  upsertMeta("meta[property='og:title']", "property", "og:title", ogTitle);
  upsertMeta(
    "meta[property='og:description']",
    "property",
    "og:description",
    ogDescription
  );
  upsertMeta("meta[property='og:url']", "property", "og:url", canonicalUrl);
  upsertMeta("meta[property='og:image']", "property", "og:image", ogImage);

  upsertMeta(
    "meta[name='twitter:card']",
    "name",
    "twitter:card",
    "summary_large_image"
  );
  upsertMeta(
    "meta[name='twitter:title']",
    "name",
    "twitter:title",
    twitterTitle
  );
  upsertMeta(
    "meta[name='twitter:description']",
    "name",
    "twitter:description",
    twitterDescription
  );
  upsertMeta(
    "meta[name='twitter:image']",
    "name",
    "twitter:image",
    twitterImage
  );
}
