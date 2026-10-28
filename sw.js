const V='rb-v2';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const lib=/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if(u.origin===location.origin&&e.request.mode==='navigate'){
    e.respondWith(fetch(new Request(e.request.url,{cache:'no-cache'})).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put('index.html',c));return r}).catch(()=>caches.match('index.html')));return}
  if(u.origin===location.origin&&/index\.html$|\/$/.test(u.pathname)){e.respondWith(fetch(new Request(e.request.url,{cache:'no-cache'})).catch(()=>caches.match('index.html')));return}
  if(u.origin===location.origin||lib){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r})))}
});
