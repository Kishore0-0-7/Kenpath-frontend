import * as React from "react";

export function CloudflareAnalytics() {
  React.useEffect(() => {
    // Cloudflare Web Analytics token from environment variable
    const token =
      import.meta.env.VITE_CF_BEACON_TOKEN ||
      import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN;

    if (!token || typeof document === "undefined") return;

    // Check if script is already present
    if (document.querySelector('script[src*="cloudflareinsights.com/beacon.min.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.setAttribute("data-cf-beacon", JSON.stringify({ token, spa: true }));
    document.head.appendChild(script);
  }, []);

  return null;
}
