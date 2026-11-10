// My Bread Academia offline cache. A new build changes VERSION, so phones get the update.
const VERSION = "mba-e620a9f9d5";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icons/apple-touch-icon-120.png", "./icons/apple-touch-icon-152.png", "./icons/apple-touch-icon-167.png", "./icons/apple-touch-icon-180.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  // This origin also hosts Bible Explorer and WA Driver Test. Only drop previous
  // My Bread Academia caches (VERSION changes each build, and always starts with "mba-").
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("mba-") && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Show the saved copy right away (works offline), and refresh the copy in the background.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== self.location.origin && !fonts) return;
  // Scope is this folder only. Do not cache or answer other apps on the same origin.
  if (url.origin === self.location.origin && !url.pathname.startsWith(new URL("./", self.location).pathname)) return;
  e.respondWith(caches.open(VERSION).then((cache) =>
    cache.match(req, { ignoreSearch: !fonts }).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
        return res;
      }).catch(() => hit || new Response("You are offline. Open the app once with internet first.", { status: 503, headers: { "Content-Type": "text/plain" } }));
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    })));
});
