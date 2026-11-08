/* Lets the website open offline after the first visit. The page itself is fetched fresh when there's a connection
   (so updates arrive), the recordings are kept once played, and nothing from Firebase is ever stored here. */
const V='afrev-be23fb62c3',AUDIO='afrev-audio-v1',SHELL=["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./fonts/atkinson-hyperlegible-latin-400-normal.woff2", "./fonts/atkinson-hyperlegible-latin-700-normal.woff2", "./fonts/atkinson-hyperlegible-latin-400-italic.woff2", "./fonts/dm-mono-latin-400-normal.woff2", "./fonts/dm-mono-latin-500-normal.woff2", "./fonts/inter-latin-400-normal.woff2", "./fonts/inter-latin-600-normal.woff2", "./fonts/inter-latin-800-normal.woff2", "./fonts/lexend-latin-400-normal.woff2", "./fonts/lexend-latin-600-normal.woff2", "./fonts/lexend-latin-700-normal.woff2", "./fonts/nunito-latin-400-normal.woff2", "./fonts/nunito-latin-700-normal.woff2", "./fonts/nunito-latin-800-normal.woff2", "./fonts/bricolage-grotesque-latin-opsz-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==AUDIO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  const scope=new URL(self.registration.scope).pathname;
  if(r.mode==='navigate'||u.pathname===scope||u.pathname===scope+'index.html'){
    const net=fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('./index.html',cp));}return res;});   /* no-cache: always ask GitHub whether the page changed, so updates arrive straight away */
    const late=new Promise(ok=>setTimeout(()=>ok(caches.match('./index.html')),4000));
    e.respondWith(Promise.race([net,late]).then(x=>x||net).catch(()=>caches.match('./index.html')));return;}
  if(u.pathname.startsWith(scope+'audio/')){e.respondWith(caches.open(AUDIO).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res;}))));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));});
