self.addEventListener('install', (e) => {
  console.log('[Service Worker] تم التثبيت بنجاح');
});

self.addEventListener('fetch', (e) => {
  // هذا السطر إلزامي لكي يعترف جوجل كروم بأن هذا تطبيق حقيقي
});
