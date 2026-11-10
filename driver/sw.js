// WA Driver Test service worker: precaches the whole app for offline use. Cache name changes on every rebuild => auto update.
const CACHE="wa-driver-test-1.1.0-ios-d4c20ea004";const PRE=["./","index.html","manifest.webmanifest","icons/icon-120.png","icons/icon-152.png","icons/icon-167.png","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PRE.map(u=>fetch(new Request(u,{cache:"reload"})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("wa-driver-test-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
 if(q.mode==="navigate"){e.respondWith(fetch(q).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put("index.html",c))}return r}).catch(()=>caches.match("index.html",{cacheName:CACHE})));return}
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q)))});
