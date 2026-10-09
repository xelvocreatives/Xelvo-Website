"use client";
import { useEffect } from "react";

/**
 * Analytics Component
 *
 * To integrate Google Analytics:
 * 1. Get your GA4 Measurement ID (G-XXXXXXXXXX)
 * 2. Replace 'GA_MEASUREMENT_ID' below with your actual ID
 * 3. Uncomment the script injection code
 *
 * For other analytics (Plausible, Fathom, etc.),
 * add their script tags in a similar way.
 */

export function Analytics() {
  useEffect(() => {
    // Google Analytics Integration (currently disabled)
    // Uncomment and replace with your GA4 ID to enable

    /*
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your ID
    
    // Load GA script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);
    
    // Initialize GA
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);
    */

    // Track page view (example)
    console.log("Page view tracked:", window.location.pathname);
  }, []);

  return null;
}
