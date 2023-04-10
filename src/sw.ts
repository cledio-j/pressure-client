import { BackgroundSyncPlugin, Queue } from 'workbox-background-sync'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { Route, registerRoute } from 'workbox-routing'
import { NetworkFirst, NetworkOnly } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

const getReadingsRoute = new Route(({ request }) => {
  return request.url.includes('/readings/get')
}, new NetworkFirst())

const getIconRoute = new Route(({ request }) => {
  return request.url.includes('assets/svg')
}, new NetworkFirst())

registerRoute(getReadingsRoute)
registerRoute(getIconRoute)

// background sync
// const bgSync = new BackgroundSyncPlugin('requestQueue', { maxRetentionTime: 24 * 60 * 7 })
// const postRoute = new Route(
//   ({ request }) => {
//     if (request.url.includes('token'))
//       return false
//     return request.method === 'POST'
//   },
//   new NetworkOnly({ plugins: [bgSync] }),
//   'POST',
// )

// const deleteRout = new Route(
//   ({ request }) => {
//     if (request.url.includes('token'))
//       return false
//     return request.method === 'DELETE'
//   },
//   new NetworkOnly({ plugins: [bgSync] }),
//   'DELETE',
// )

// registerRoute(postRoute)

const queue = new Queue('syncQueue')

self.addEventListener('fetch', (event) => {
  const syncLogic = async () => {
    try {
      const response = await fetch(event.request.clone())
      return response
    }
    catch (error) {
      await queue.pushRequest({ request: event.request })
      return error
    }
  }
  event.respondWith(syncLogic())
})
