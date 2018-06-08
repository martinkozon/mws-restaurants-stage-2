// sw.js

const cacheName = 'v18';
const filesToCache = [
    'sw.js',
    './',
    './index.html',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './js/manifest.json',
    './js/echo.min.js',
    './restaurant.html',
    './restaurant.html?id=1',
    './restaurant.html?id=2',
    './restaurant.html?id=3',
    './restaurant.html?id=4',
    './restaurant.html?id=5',
    './restaurant.html?id=6',
    './restaurant.html?id=7',
    './restaurant.html?id=8',
    './restaurant.html?id=9',
    './restaurant.html?id=10',
];

self.addEventListener("install", function (event) {
    // Perform install steps
    console.log("[Servicework] Install");
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[ServiceWorker] Caching app shell");
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", function (event) {
    console.log("[Servicework] Activate");
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log("[ServiceWorker] Removing old cache shell", key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log("[ServiceWorker] Fetch");
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});


//this tutorials helped me the most: https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker-slides and https://www.youtube.com/watch?v=BfL3pprhnms