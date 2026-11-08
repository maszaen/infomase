/**
 * InfoMase Template Bridge — Remote CDN Stub Loader
 * ----------------------------------------------------------------------------
 * Core DOM synchronization, gate auto-open, and RSVP capture engine are
 * decoupled and loaded from the external CDN Vault (`template-bridge.js`).
 * When CDN is unreachable, templates fall back to static native HTML preview
 * (unsynchronized dummy state).
 */
(function () {
  'use strict';

  // Buffer incoming postMessage payloads while remote bridge script is loading
  window.addEventListener('message', function (event) {
    if (!event || !event.data) return;
    if (
      event.data.type === 'INIT_INVITATION_DATA' ||
      event.data.type === 'UPDATE_INVITATION_DATA'
    ) {
      window.__PENDING_BRIDGE_MSG__ = event.data;
    }
  });

  function resolveCdnBaseUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      var fromQuery = params.get('cdn');
      if (fromQuery) return fromQuery.replace(/\/+$/, '');
    } catch (e) {}

    try {
      if (window.parent && window.parent !== window && window.parent.__CDN_BASE_URL__) {
        return String(window.parent.__CDN_BASE_URL__).replace(/\/+$/, '');
      }
    } catch (e) {}

    if (window.__CDN_BASE_URL__) {
      return String(window.__CDN_BASE_URL__).replace(/\/+$/, '');
    }

    return 'http://localhost:9090';
  }

  var cdnBase = resolveCdnBaseUrl();
  if (!cdnBase) return;

  var script = document.createElement('script');
  script.src = cdnBase + '/template-bridge.js?v=4';
  script.async = true;
  script.onerror = function () {
    console.warn(
      '[InfoMase Bridge] Remote template-bridge engine unreachable (' +
        cdnBase +
        '). Running in static native fallback mode (live sync disabled).'
    );
  };
  (document.head || document.documentElement).appendChild(script);
})();
