/* eslint-disable no-restricted-globals */
import { manifest, version } from '@parcel/service-worker';

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}

async function activate() {
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => key !== version && caches.delete(key)));
}

self.addEventListener('install', (e) => e.waitUntil(install()));
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      if (resp) {
        return resp;
      }
      return fetch(event.request);
    }),
  );
});
self.addEventListener('activate', (e) => e.waitUntil(activate()));
