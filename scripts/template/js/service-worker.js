const pre_cache_file_version = "pre-v1.0.0";
const auto_cache_file_version = "auto-v1.0.0";

const ASSETS = [
  "/{{ repo_name }}/{{ folder_path }}/images/logo-192x192.png",
  "/{{ repo_name }}/{{ folder_path }}/images/logo-512x512.png",
  "/{{ repo_name }}/{{ folder_path }}/images/logo-180x180.png",
  "/{{ repo_name }}/{{ folder_path }}/images/logo-270x270.png",
  "/{{ repo_name }}/{{ folder_path }}/images/logo.jpg",

  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js",
];

const NEED_UPDATE = [
  "/{{ repo_name }}/{{ folder_path }}/",
  "/{{ repo_name }}/{{ folder_path }}/index.html",
  "/{{ repo_name }}/{{ folder_path }}/css/styles.css",
  "/{{ repo_name }}/{{ folder_path }}/js/{{ name }}.js",
  "/{{ repo_name }}/{{ folder_path }}/js/matrix.js",
  "/{{ repo_name }}/{{ folder_path }}/json/theme.json",
  "/{{ repo_name }}/{{ folder_path }}/json/manifest.json",
];

const limit_cache_size = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => {
          limit_cache_size(name, size);
        });
      }
    });
  });
};

const is_in_array = (str, array) => {
  let path = "";

  // Check the request's domain is the same as the current domain.
  if (str.indexOf(self.origin) === 0) {
    path = str.substring(self.origin.length); // Remove https://lifeadventurer.github.io
  } else {
    path = str; // outside request
  }

  return array.indexOf(path) > -1;
};

// install
self.addEventListener("install", (event) => {
  self.skipWaiting();

  //pre-cache files
  event.waitUntil(
    caches.open(pre_cache_file_version).then((cache) => {
      cache.addAll(ASSETS);
    }),
  );
});

// activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (
          pre_cache_file_version.indexOf(key) === -1 &&
          auto_cache_file_version.indexOf(key) === -1
        ) {
          return caches.delete(key);
        }
      }));
    }),
  );
});

// fetch event
self.addEventListener("fetch", (event) => {
  if (is_in_array(event.request.url, ASSETS)) {
    // cache only strategy

    event.respondWith(
      caches.match(event.request.url),
    );
  } else if (is_in_array(event.request.url, NEED_UPDATE)) {
    event.respondWith(
      fetch(event.request.url).then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(auto_cache_file_version);
          cache.put(event.request.url, response.clone());
          return response;
        }

        throw new Error("Network response was not ok.");
      }).catch(async (_error) => {
        const cache = await caches.open(auto_cache_file_version);
        return cache.match(event.request.url);
      }),
    );
  }
});
