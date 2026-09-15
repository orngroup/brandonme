const CACHE="bh-portal-v1";
const ASSETS=["./","./index.html","./app.js","./data.js","./manifest.json","./assets/bh-logo.svg"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))); });
self.addEventListener("fetch",e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(e.request.method==="GET"&&res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); }
    return res;
  }).catch(()=>caches.match("./index.html"))));
});
