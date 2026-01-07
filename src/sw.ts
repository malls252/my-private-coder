/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { NetworkOnly } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

// Waktu tunggu untuk background sync (dalam menit)
const BG_SYNC_QUEUE_NAME = 'alarm-queue';
const BG_SYNC_MAX_RETENTION_TIME = 24 * 60; // 24 hours

// 1. Setup Dasar Service Worker
self.skipWaiting()
clientsClaim()

// 2. Precache & Cleanup
cleanupOutdatedCaches()

// Precache semua assets yang digenerate oleh build process
// @ts-expect-error - __WB_MANIFEST is injected by workbox-build
precacheAndRoute(self.__WB_MANIFEST)

// 3. Navigation Routing (SPA Support)
// Mengarahkan semua navigasi (e.g. /about, /login) ke index.html supaya React Router bisa handle
const navigateRoute = new NavigationRoute(
    createHandlerBoundToURL('/index.html'),
    { denylist: [new RegExp('^/_'), new RegExp('/[^/?]+\\.[^/]+$')] } // Ignore API routes or files with extensions
)
registerRoute(navigateRoute)

// 4. Background Sync Implementation (WorkManager Equivalent)
const bgSyncPlugin = new BackgroundSyncPlugin(BG_SYNC_QUEUE_NAME, {
    maxRetentionTime: BG_SYNC_MAX_RETENTION_TIME,
    onSync: async ({ queue }) => {
        console.log('Background Sync triggered!', queue.name);
        // Disini loop queue dan process request
        // Contoh: Mengirim data offline ke server
        await queue.replayRequests();
    }
});

// Contoh route yang menggunakan Background Sync
// Misalnya kita punya endpoint '/api/sync-logs' yang ingin kita retry kalau offline
registerRoute(
    /\/api\/sync-logs/,
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    'POST'
);

// 5. Notification Handling
// Handle klik notifikasi
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Buka App kalau user klik notifikasi
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Kalau app sudah terbuka, focus ke window tersebut
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            // Kalau belum terbuka, buka window baru
            return self.clients.openWindow('/');
        })
    );
});

// Listener untuk pesan dari Main Thread (Opsional, untuk komunikasi)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
