import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute, Route } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const getReadingsRoute = new Route(({ request }) => {
  return request.url.includes("/readings/get");
}, new CacheFirst());

const getIconRoute = new Route(({ request }) => {
  return request.url.includes("assets/svg");
}, new CacheFirst());

registerRoute(getReadingsRoute);
registerRoute(getIconRoute);
