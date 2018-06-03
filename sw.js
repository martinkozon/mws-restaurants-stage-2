//
//service worker file

//cacheName
const cacheName = 'v12';
const cacheFiles = [
    './',
    './index.html',
    'sw.js',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './js/app.js',
    './js/echo.min.js',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    'img/1-lazy.jpg',
    'img/2-lazy.jpg',
    'img/3-lazy.jpg',
    'img/4-lazy.jpg',
    'img/5-lazy.jpg',
    'img/6-lazy.jpg',
    'img/7-lazy.jpg',
    'img/8-lazy.jpg',
    'img/9-lazy.jpg',
    'img/10-lazy.jpg'
];


//installing the service worker
self.addEventListener("install", function (event) {
    //install event is going to wait until the waitUntil promise is completed
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(cacheFiles);
        })
    );

});

//activating the service worker
self.addEventListener("activate", function (event) {
    //we're now going to remove everything in cache that doesn't correspond the current cacheName
    event.waitUntil(
        //going throught all the keys in cache
        caches.keys().then(function (cacheNames) {
            //looping through everything in the cache
            return Promise.all(cacheNames.map(function (thisCacheName) {
                //if thisCacheName doesn't correcpond to the current cacheName
                if (thisCacheName !== cacheName) {
                    //remove thisCacheName
                    return caches.delete(thisCacheName);
                }
            }))
        })
    );
});

//fetching
self.addEventListener('fetch', function (event) {
    // event.respondWidth Responds to the fetch event
    event.respondWith(
        // Check in cache for the request being made
        caches.match(event.request)
            .then(function (response) {
                // If the request is in the cache
                if (response) {
                    return response;
                }
                // If the request is NOT in the cache, fetch and cache
                let clone = event.request.clone();
                //fetch and cache
                fetch(clone)
                    .then(function (response) {
                        if (!response) {
                            return response;
                        }
                        let responseClone = response.clone();
                        //  Open the cache
                        caches.open(cacheName).then(function (cache) {
                            // Put the fetched response in the cache
                            cache.put(event.request, responseClone);
                            // Return the response
                            return response;
                        }); // end caches.open
                    })
                    .catch(function (err) {
                        console.log("Error Fetching and Caching new data!", err);
                    });
            }) // end caches.match(event.request)
    ); // end event.respondWith
});

//this tutorials helped me the most: https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker-slides and https://www.youtube.com/watch?v=BfL3pprhnms