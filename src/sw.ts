import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { Route, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// CacheFirst offline functionality
const getReadingsRoute = new Route(({ request }) => {
  return request.url.includes('/readings/get')
}, new NetworkFirst())

const getIconRoute = new Route(({ request }) => {
  return request.url.includes('assets/svg')
}, new CacheFirst())

registerRoute(getReadingsRoute)
registerRoute(getIconRoute)

// background sync
const bgSync = new BackgroundSyncPlugin('requestQueue', { maxRetentionTime: 24 * 60 * 7 })
const postRoute = new Route(({ request }) => {
  if (request.url.includes('token'))
    return false
  return request.method === 'POST' || request.method === 'DELETE'
}, new NetworkOnly({ plugins: [bgSync] }))

registerRoute(postRoute)
