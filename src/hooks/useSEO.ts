import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function useSEO({ title, description, ogTitle, ogDescription, ogImage }: SEOProps) {
  useEffect(() => {
    const suffix = "Jeryl";
    document.title = title ? `${title} — ${suffix}` : suffix;

    const setMeta = (property: string, content: string | undefined) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setNameMeta = (name: string, content: string | undefined) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setNameMeta("description", description);
    setMeta("og:title", ogTitle ?? title);
    setMeta("og:description", ogDescription ?? description);
    setMeta("og:image", ogImage);
  }, [title, description, ogTitle, ogDescription, ogImage]);
}
