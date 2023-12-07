let pre_cache_file_version = 'pre-v1.0.0';
let auto_cache_file_version = 'auto-v1.0.0'

const ASSETS = [
  'generators/images/lifeadventurer-192x192.png',
  'generators/images/lifeadventurer-512x512.png',
  'generators/images/lifeadventurer-180x180.png',
  'generators/images/lifeadventurer-270x270.png',
  'generators/images/lifeadventurer.jpg',

  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js'
];

const NEED_UPDATE = [
  'generators/fortune_generator/styles.css',
  'generators/fortune_generator/fortune.js',
  'generators/fortune_generator/matrix.js',
  'generators/fortune_generator/special.json',
  'generators/fortune_generator/fortune.json',
]

/**
 * 
 */

let limit_cache_size = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(key => {
      if (key.length > size) {
        cache.delete(key[0]).then(limit_cache_size(name, size));
      }
    });
  });
};


let is_in_array = (str, array) => {
  let path = '';
  
  // Check domain of request is same of current domain.
  if (str.indexOf(self.origin) === 0) {
    path = str.substring(self.origin.length); // Remove https://lifeadventurer.github.io
  } else {
    path = str; // outside request
  }

  return array.indexOf(array) > -1;
}

// install 
self.addEventListener('install', event => {
  self.skipWaiting();

  // pre cache files
  event.waitUntil(
    caches.open(pre_cache_file_version).then(cache => {
      cache.addAll(ASSETS);
    })
  );
});

// activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (pre_cache_file_version.indexOf(key) === -1 && auto_cache_file_version.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  )
});

// fetch event
self.addEventListener('fetch', event => {
  if (is_in_array(event.request.url, ASSETS)) {
    // Cache only strategy    

    event.respondWith(
      caches.match(event.request)
    );
  } else if (is_in_array(event.request.url, NEED_UPDATE)) {
    // Cache then network strategy

    event.respondWith(
      caches.open(auto_cache_file_version).then(async cache => {
        const res = await fetch(event.request);
        cache.put(event.request, res.clone());

        return res;
      })
    );
  } else if (event.request.url.indexOf('https://api.ipify.org?format=json') > -1) {
    fetch(event.request).then(async response => {
      const cache = await caches.open(auto_cache_file_version);
      cache.put(event.request.url, response.clone());
      return response; 

    }).catch(async () => {
      const cache = await caches.open(auto_cache_file_version);
      return await cache.match(event.request);
    });
  }
});