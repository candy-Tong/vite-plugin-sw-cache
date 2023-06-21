const swUrl = '<SW_URL>';
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(swUrl)
    .then((registration) => {
      console.log('Service Worker 注册成功:', registration);
      registration.addEventListener('updatefound', () => {
        console.log('Service Worker update found!');
      });
    })
    .catch((error) => {
      console.error('Service Worker 注册失败:', error);
    });
}
