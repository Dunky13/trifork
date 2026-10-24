if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('worker-basic.min.js').catch(function (error) {
      console.error('Service worker registration failed', error);
    });
  });
}
