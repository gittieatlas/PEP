importScripts('./node_modules/workbox-sw/build/workbox-sw.js'); // import the workbox script and path in the path for workbox - use the dev version for help during development

const staticAssests = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './fallback.json',
  './images/icons/icon_96x96.png'
];
//

if (workbox) {
  workbox.precaching.precacheAndRoute(staticAssests);
}
// Precache Assets During Installation

workbox.routing.registerRoute(
  new RegExp('https://itunes.apple.com/'),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  /.*\.(png|jpg|jpeg|gif)/,
  workbox.strategies.cacheFirst({
    cacheName: 'podcasts-images',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 12 * 60 * 60,
        maxEntries: 20
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ],
    cacheableResponse: { statuses: [0, 200] }
  })
);
