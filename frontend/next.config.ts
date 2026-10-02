import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * NOTE on cross-origin deployments and authentication:
   * When deploying the frontend and backend on different origins (e.g., frontend on Vercel, backend on Railway),
   * you cannot rely on Next.js `redirects` for proxying because cross-domain requests will drop `HttpOnly` cookies.
   * Ensure the `rewrites` function is used properly in production to mask the backend under the same origin,
   * or ensure proper CORS `credentials: true` and `SameSite=None` attributes are configured on the backend.
   */
};

export default nextConfig;
