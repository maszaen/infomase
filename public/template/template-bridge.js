/**
 * InfoMase Universal Template Bridge
 * Seamlessly integrates standalone digital wedding templates with dynamic InvitationData.
 * Provides bi-directional postMessage sync, automatic guest greeting, countdown binding,
 * and RSVP handling without altering template visual integrity.
 */
(function () {
  'use strict';

  // 0. SANITIZATION HELPER
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, function (tag) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      })[tag] || tag;
    });
  }

  // 1. GUEST NAME RESOLUTION
  function resolveGuestName(customName) {
    if (customName && typeof customName === 'string' && customName.trim()) {
      return customName.trim();
    }
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('to') || params.get('guest') || params.get('kepada') || params.get('u');
    return fromUrl ? decodeURIComponent(fromUrl.replace(/\+/g, ' ')).trim() : '';
  }

  function applyGuestName(name) {
    if (!name) return;
    const selectors = [
      '#coverGuestName',
      '#guest-name',
      '.cover-guest-name',
      '.gate-guest-name',
      '#rsvp-name',
      '#wishName',
      '#guestName'
    ];
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (!el.value) el.value = name;
        } else {
          el.textContent = name;
        }
      }
    });
  }

  // 2. GATE AUTO-OPEN (for Studio Editor phone preview)
  function handleDefaultOpened(forceOpen) {
    const params = new URLSearchParams(window.location.search);
    const shouldOpen = forceOpen || params.get('opened') === '1' || window.__DEFAULT_OPENED__ === true;
    if (!shouldOpen) return;

    // Call native openGate if available
    if (typeof window.openGate === 'function') {
      try {
        window.openGate();
      } catch (e) {
        console.warn('openGate failed, falling back to manual gate dismiss:', e);
      }
    }

    // Undangan 1, 2, 3, 5, 6
    const gateCover = document.getElementById('gateCover');
    if (gateCover) {
      gateCover.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Undangan 4
    const sec = document.getElementById('sec');
    if (sec) {
      sec.style.display = 'none';
      document.body.classList.remove('locked');
    }

    // Undangan 7 & 8
    const gateCoverJawa = document.getElementById('gate-cover');
    if (gateCoverJawa) {
      gateCoverJawa.style.display = 'none';
      gateCoverJawa.classList.add('is-dismissed');
      document.body.classList.remove('is-locked');
    }

    // Reveal elements immediately
    document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale, .reveal-flower-tl, .reveal-flower-br, .reveal-item').forEach(el => {
      el.classList.add('is-revealed', 'in-view');
    });

    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.opacity = '1';
      nav.style.pointerEvents = 'auto';
    }

    const musicWrap = document.getElementById('musicControlWrap');
    if (musicWrap) {
      musicWrap.style.opacity = '1';
      musicWrap.style.pointerEvents = 'auto';
    }
  }

  // 3. DYNAMIC DATA APPLICATION
  function applyInvitationData(data) {
    if (!data) return;

    const groom = data.groom || {};
    const bride = data.bride || {};

    // A. Titles & Couple Names
    const coupleTitle = `${groom.name || ''} & ${bride.name || ''}`.trim();
    if (groom.name && bride.name) {
      document.title = `The Wedding of ${coupleTitle}`;

      // Update couple headings
      const coupleHeadings = document.querySelectorAll(
        '#gatePage h1, #gateCenterCard h1, #home h1, .cover-title, .hero-title, .gate-couple-script, .wing-couple'
      );
      coupleHeadings.forEach(h => {
        if (h.classList.contains('font-serif') || h.classList.contains('font-script') || h.classList.contains('cover-title') || h.classList.contains('gate-couple-script')) {
          // Preserve inner spans if present
          const span = h.querySelector('span');
          if (span) {
            h.innerHTML = `${escapeHTML(groom.name)} <span>&amp;</span> ${escapeHTML(bride.name)}`;
          } else {
            h.innerHTML = `${escapeHTML(groom.name)} &amp; ${escapeHTML(bride.name)}`;
          }
        }
      });
    }

    // B. Groom Profile
    if (groom.name || groom.fullName) {
      const groomTitleEl = document.querySelector('.mempelai-card--pria .mempelai-name, .groom-title, #mempelai h3:first-of-type');
      if (groomTitleEl) groomTitleEl.textContent = groom.fullName || groom.name;
    }
    if (groom.photo) {
      const groomImg = document.querySelector('.mempelai-card--pria img, .groom-photo, #mempelai img[alt*="Raka"], #mempelai img[alt*="Habib"], #mempelai img[alt*="Arga"], #mempelai img:first-of-type');
      if (groomImg) groomImg.src = groom.photo;
    }
    if (groom.fatherName || groom.motherName || groom.bio) {
      const groomBio = groom.bio || `Putra dari ${groom.fatherName ? 'Bpk. ' + groom.fatherName : ''} ${groom.fatherName && groom.motherName ? '& ' : ''}${groom.motherName ? 'Ibu ' + groom.motherName : ''}`.trim();
      const groomDesc = document.querySelector('.mempelai-card--pria .mempelai-parents, .groom-parents, #mempelai p:nth-of-type(2)');
      if (groomDesc && groomBio) groomDesc.textContent = groomBio;
    }

    // C. Bride Profile
    if (bride.name || bride.fullName) {
      const brideTitleEl = document.querySelector('.mempelai-card--wanita .mempelai-name, .bride-title, #mempelai h3:last-of-type');
      if (brideTitleEl) brideTitleEl.textContent = bride.fullName || bride.name;
    }
    if (bride.photo) {
      const brideImg = document.querySelector('.mempelai-card--wanita img, .bride-photo, #mempelai img[alt*="Sinta"], #mempelai img[alt*="Adiba"], #mempelai img[alt*="Maya"], #mempelai img:last-of-type');
      if (brideImg) brideImg.src = bride.photo;
    }
    if (bride.fatherName || bride.motherName || bride.bio) {
      const brideBio = bride.bio || `Putri dari ${bride.fatherName ? 'Bpk. ' + bride.fatherName : ''} ${bride.fatherName && bride.motherName ? '& ' : ''}${bride.motherName ? 'Ibu ' + bride.motherName : ''}`.trim();
      const brideDesc = document.querySelector('.mempelai-card--wanita .mempelai-parents, .bride-parents, #mempelai p:nth-of-type(3), #mempelai p:last-of-type');
      if (brideDesc && brideBio) brideDesc.textContent = brideBio;
    }

    // D. Quote
    if (data.quote && data.quote.text) {
      const quoteEl = document.querySelector('#intro .quote-text, .quote-content p, #home + section p, section[class*="quote"] p, .kraton-quote p');
      if (quoteEl) quoteEl.textContent = `"${data.quote.text}"`;
      const quoteSourceEl = document.querySelector('#intro .quote-source, .quote-content span, #home + section span, section[class*="quote"] span, .kraton-quote cite');
      if (quoteSourceEl && data.quote.source) quoteSourceEl.textContent = data.quote.source;
    }

    // E. Events (Akad & Resepsi)
    if (Array.isArray(data.events) && data.events.length > 0) {
      const akad = data.events.find(e => e.id === 'akad' || /akad/i.test(e.title)) || data.events[0];
      const resepsi = data.events.find(e => e.id === 'resepsi' || /resepsi|walimah/i.test(e.title)) || data.events[1] || data.events[0];

      // Update event venue & address
      if (akad) {
        const akadLoc = document.querySelector('#acara .akad-location, #acara [class*="akad"] .location, .ticket-stub--akad .ticket-venue');
        if (akadLoc && akad.locationName) akadLoc.textContent = akad.locationName;
        const akadAddr = document.querySelector('#acara .akad-address, #acara [class*="akad"] .address, .ticket-stub--akad .ticket-address');
        if (akadAddr && akad.address) akadAddr.textContent = akad.address;
        const akadMaps = document.querySelector('#acara a[href*="maps"], .ticket-stub--akad a[href*="maps"]');
        if (akadMaps && akad.mapsUrl) akadMaps.href = akad.mapsUrl;
      }

      if (resepsi) {
        const resepsiLoc = document.querySelector('#acara .resepsi-location, #acara [class*="resepsi"] .location, .ticket-stub--resepsi .ticket-venue');
        if (resepsiLoc && resepsi.locationName) resepsiLoc.textContent = resepsi.locationName;
        const resepsiAddr = document.querySelector('#acara .resepsi-address, #acara [class*="resepsi"] .address, .ticket-stub--resepsi .ticket-address');
        if (resepsiAddr && resepsi.address) resepsiAddr.textContent = resepsi.address;
        const resepsiMaps = document.querySelector('#acara a[href*="maps"]:last-of-type, .ticket-stub--resepsi a[href*="maps"]');
        if (resepsiMaps && resepsi.mapsUrl) resepsiMaps.href = resepsi.mapsUrl;
      }
    }

    // F. Countdown Binding
    if (data.countdownDate) {
      const targetTime = new Date(data.countdownDate).getTime();
      if (!isNaN(targetTime)) {
        // Expose global target timestamp so countdown intervals adopt it
        window.__TARGET_COUNTDOWN_TIME__ = targetTime;
        const updateTick = () => {
          const now = Date.now();
          const diff = Math.max(0, targetTime - now);
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);

          const daysEl = document.getElementById('cd-days') || document.getElementById('days');
          const hoursEl = document.getElementById('cd-hours') || document.getElementById('hours');
          const minsEl = document.getElementById('cd-minutes') || document.getElementById('cd-mins') || document.getElementById('minutes');
          const secsEl = document.getElementById('cd-seconds') || document.getElementById('cd-secs') || document.getElementById('seconds');

          if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
          if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
          if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
          if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
        };
        updateTick();
        if (window.__countdownInterval) {
          clearInterval(window.__countdownInterval);
        }
        window.__countdownInterval = setInterval(updateTick, 1000);
      }
    }

    // G. Digital Envelope / Bank Accounts
    if (Array.isArray(data.bankAccounts) && data.bankAccounts.length > 0) {
      data.bankAccounts.forEach((acc, idx) => {
        const numEl = document.querySelector(`.bank-acc-${idx + 1}-num, [data-bank-acc="${idx + 1}"], #bankNumber${idx + 1}`);
        if (numEl) numEl.textContent = acc.accountNumber;
        const holderEl = document.querySelector(`.bank-acc-${idx + 1}-holder, [data-bank-holder="${idx + 1}"], #bankHolder${idx + 1}`);
        if (holderEl) holderEl.textContent = acc.accountHolder;
      });
    }

    // H. Audio Background URL
    if (data.music && data.music.url) {
      const audio = document.getElementById('weddingMusic') || document.getElementById('wedding-audio') || document.getElementById('bg-audio');
      if (audio && audio.src !== data.music.url) {
        audio.src = data.music.url;
        audio.load();
      }
    }
  }

  // 4. RSVP SUBMISSION INTERCEPTOR
  function setupRsvpInterceptor() {
    if (window.__rsvpHooked) return;
    window.__rsvpHooked = true;

    // Use capture phase (true) so we grab inputs BEFORE any template script clears form fields!
    document.addEventListener(
      'submit',
      function (e) {
        const form = e.target;
        if (!form || typeof form.querySelector !== 'function') return;

        // Find inputs
        const nameInput = form.querySelector(
          '#wishName, #guestName, #rsvp-name, input[name="name"], input[type="text"]'
        );
        const msgInput = form.querySelector(
          '#wishMessage, #rsvp-msg, #rsvp-message, textarea'
        );
        const statusSelect = form.querySelector(
          '#attendanceSelect, #rsvp-presence, select[name="presence"], select'
        );

        const guestName = nameInput ? nameInput.value.trim() : '';
        const message = msgInput ? msgInput.value.trim() : '';
        const rawStatus = statusSelect ? statusSelect.value.toLowerCase() : 'hadir';
        const attendance = rawStatus.includes('tidak')
          ? 'tidak'
          : rawStatus.includes('ragu')
          ? 'ragu'
          : 'hadir';

        if (guestName && message) {
          const targetOrigin =
            window.location.origin && window.location.origin !== 'null'
              ? window.location.origin
              : '*';
          window.parent.postMessage(
            {
              type: 'RSVP_SUBMIT',
              payload: {
                guestName,
                attendance,
                pax: 1,
                message,
                createdAt: new Date().toISOString(),
              },
            },
            targetOrigin
          );
        }
      },
      true
    );
  }

  // 5. MESSAGE LISTENER FROM NEXT.JS PARENT
  window.addEventListener('message', function (event) {
    if (!event.data) return;
    if (window.location.origin && window.location.origin !== 'null' && event.origin !== window.location.origin) {
      return;
    }
    if (event.data.type === 'INIT_INVITATION_DATA' || event.data.type === 'UPDATE_INVITATION_DATA') {
      const { data, guestName, defaultOpened } = event.data;
      if (guestName) applyGuestName(guestName);
      if (data) applyInvitationData(data);
      if (defaultOpened) handleDefaultOpened(true);
    }
  });

  // 6. INITIAL RUN ON DOMContentLoaded
  function init() {
    const guest = resolveGuestName();
    if (guest) applyGuestName(guest);
    handleDefaultOpened();
    setupRsvpInterceptor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
