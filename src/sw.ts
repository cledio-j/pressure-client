import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("http://192.168.178.11:5000/api/")) {
    console.log(event);
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    });
  }
});
