"use client";

import { useEffect } from "react";

export function SEO() {
  useEffect(() => {
    // Set page title
    document.title =
      "Yelvo Creatives - Shariah-Compliant Branding & Marketing Agency";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Build Shariah-compliant brands that scale and compete in global markets. Expert branding, visual communication, and marketing solutions for Muslim businesses worldwide."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Build Shariah-compliant brands that scale and compete in global markets. Expert branding, visual communication, and marketing solutions for Muslim businesses worldwide.";
      document.head.appendChild(meta);
    }

    // Set meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        "Shariah-compliant branding, Islamic marketing, halal branding agency, Muslim business branding, ethical marketing, Islamic graphic design"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content =
        "Shariah-compliant branding, Islamic marketing, halal branding agency, Muslim business branding, ethical marketing, Islamic graphic design";
      document.head.appendChild(meta);
    }

    // Set Open Graph tags for social sharing
    const ogTags = [
      {
        property: "og:title",
        content: "Yelvo Creatives - Shariah-Compliant Branding Agency",
      },
      {
        property: "og:description",
        content:
          "Build Shariah-compliant brands that scale and compete in global markets.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
    ];

    ogTags.forEach(({ property, content }) => {
      const existingTag = document.querySelector(
        `meta[property="${property}"]`
      );
      if (existingTag) {
        existingTag.setAttribute("content", content);
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute("property", property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Set theme color for mobile browsers
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", "#FF6600");
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#FF6600";
      document.head.appendChild(meta);
    }
  }, []);

  return null;
}
