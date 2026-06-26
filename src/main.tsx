import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global fetch interceptor to inject admin credentials for secure endpoints
const originalFetch = window.fetch;
try {
  Object.defineProperty(window, "fetch", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: async function (this: any, input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes("/api/admin/") || url.includes("/api/db/stats") || url.includes("/api/community/")) {
        const adminEmail = localStorage.getItem("sp_logged_email") || "";
        const adminToken = localStorage.getItem("sp_admin_token") || "";
        if (adminEmail && adminToken) {
          const newInit = { ...init };
          const headersObj = { ...newInit.headers } as any;
          headersObj["x-admin-email"] = adminEmail;
          headersObj["x-admin-token"] = adminToken;
          newInit.headers = headersObj;
          return originalFetch.call(this, input, newInit);
        }
      }
      return originalFetch.call(this, input, init);
    }
  });
} catch (e) {
  console.warn("Could not override window.fetch with Object.defineProperty, falling back to prototype override:", e);
  try {
    const proto = Object.getPrototypeOf(window);
    if (proto && "fetch" in proto) {
      Object.defineProperty(proto, "fetch", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: async function (this: any, input: RequestInfo | URL, init?: RequestInit) {
          const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
          if (url.includes("/api/admin/") || url.includes("/api/db/stats") || url.includes("/api/community/")) {
            const adminEmail = localStorage.getItem("sp_logged_email") || "";
            const adminToken = localStorage.getItem("sp_admin_token") || "";
            if (adminEmail && adminToken) {
              const newInit = { ...init };
              const headersObj = { ...newInit.headers } as any;
              headersObj["x-admin-email"] = adminEmail;
              headersObj["x-admin-token"] = adminToken;
              newInit.headers = headersObj;
              return originalFetch.call(this, input, newInit);
            }
          }
          return originalFetch.call(this, input, init);
        }
      });
    }
  } catch (err2) {
    console.error("Failed all fallback attempts to override fetch:", err2);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
