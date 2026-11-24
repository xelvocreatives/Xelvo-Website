import Script from "next/script";
import { getSiteDoc } from "@/lib/site/store";

/**
 * Google Analytics, switched on by entering a Measurement ID in
 * Admin → Website → SEO & Google. Rendered on public pages only, so admin
 * visits don't count as website traffic.
 */
export async function SiteAnalytics() {
  const { analyticsId } = await getSiteDoc("seo");
  // The schema already restricts the ID to G-XXXX; re-check before it goes into a script.
  if (!/^G-[A-Z0-9]{4,15}$/i.test(analyticsId)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analyticsId}');`}
      </Script>
    </>
  );
}

/** Organisation + website details for Google, as JSON-LD. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
