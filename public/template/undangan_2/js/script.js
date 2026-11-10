
// ==============================================================
// GATE COVER / PINTU MASUK LOGIC
// ==============================================================
function initGate() {
  // Prevent browser from restoring scroll to middle of page
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const gateCover = document.getElementById('gateCover');
  if (!gateCover || gateCover.style.display === 'none' || gateCover.classList.contains('hidden')) {
    document.body.style.overflow = 'auto';
    triggerHeroReveal();
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
    return;
  }

  // Ensure hero page elements remain hidden until gate opens
  const homeInitEls = document.querySelectorAll('#home .hero-anim, #home .reveal, #home .reveal-fade, #home .reveal-scale, #home .reveal-botanical');
  homeInitEls.forEach(el => el.classList.remove('is-revealed'));
  
  // Lock body scroll while on gate
  document.body.style.overflow = 'hidden';

  // Hide bottom nav while on gate
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.opacity = '0';
    nav.style.pointerEvents = 'none';
    nav.style.transition = 'opacity 0.6s ease';
  }
  const musicWrap = document.getElementById('musicControlWrap');
  if (musicWrap) {
    musicWrap.style.opacity = '0';
    musicWrap.style.pointerEvents = 'none';
    musicWrap.style.transition = 'opacity 0.6s ease';
  }

  // Get guest name from URL (?to=Nama+Tamu or ?u=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get('to') || urlParams.get('u');
  if (guest) {
    const guestEl = document.getElementById('coverGuestName');
    if (guestEl) {
      guestEl.textContent = decodeURIComponent(guest);
    }
  }
}

function openGate() {
  const gatePage = document.getElementById('gatePage');
  const gateCover = document.getElementById('gateCover');
  const nav = document.querySelector('nav');
  const musicWrap = document.getElementById('musicControlWrap');

  // Guarantee page is locked at the very top (never jump/drop)
  window.scrollTo(0, 0);

  if (gatePage) {
    // 3D Luxury Book Open Flip Animation
    gatePage.classList.add('book-opened');

    // Trigger smooth blooming entrance on main page
    triggerHeroReveal();

    // Auto-start romantic audio
    playMusic();

    // Smoothly fade in floating nav and music controller near completion of door open
    setTimeout(() => {
      if (musicWrap) {
        musicWrap.style.opacity = '1';
        musicWrap.style.pointerEvents = 'auto';
      }
      if (nav) {
        nav.style.opacity = '1';
        nav.style.pointerEvents = 'auto';
      }
    }, 550);

    // Keep body scroll LOCKED until book open animation finishes completely (1150ms)
    setTimeout(() => {
      if (gateCover) {
        gateCover.style.display = 'none';
      }

      // NOW unlock body scroll safely without any layout jerk or reflow snap!
      document.body.style.overflow = 'auto';

      // Initialize scroll reveal for subsequent sections as user scrolls down
      initScrollReveal();
    }, 1150);
  } else if (gateCover) {
    gateCover.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (nav) {
      nav.style.opacity = '1';
      nav.style.pointerEvents = 'auto';
    }
    if (musicWrap) {
      musicWrap.style.opacity = '1';
      musicWrap.style.pointerEvents = 'auto';
    }
    triggerHeroReveal();
    playMusic();
  }
}

// 1. Smooth "Buka Undangan" Action + Romantic Audio Auto-Start
function openInvitation(e) {
  if (e) e.preventDefault();
  const targetSection = document.getElementById('prologue') || document.getElementById('mempelai');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
  if (!isPlayingAudio) {
    playMusic();
  }
}

// ==============================================================
// 2. BACKGROUND MUSIC CONTROLLER (Coral Island Overture MP3)
// ==============================================================
let isPlayingAudio = false;

function initAudio() {
  const audio = document.getElementById('weddingMusic');
  if (!audio) return;

  // Gentle, romantic background volume
  audio.volume = 0.75;

  // Keep state and UI synchronized whenever playback status changes
  audio.addEventListener('play', () => {
    isPlayingAudio = true;
    updateMusicUI(true);
  });

  audio.addEventListener('pause', () => {
    isPlayingAudio = false;
    updateMusicUI(false);
  });

  // Seamless loop fallback if browser loop attribute fails
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio loop restart error:', e));
  });
}

function playMusic() {
  const audio = document.getElementById('weddingMusic');
  if (!audio) return;

  audio.muted = false;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlayingAudio = true;
      updateMusicUI(true);
    }).catch(err => {
      console.log('Autoplay waiting for user interaction or blocked:', err);
      isPlayingAudio = false;
      updateMusicUI(false);
    });
  }
}

function pauseMusic() {
  const audio = document.getElementById('weddingMusic');
  if (!audio) return;
  audio.pause();
  isPlayingAudio = false;
  updateMusicUI(false);
}

function toggleMusic() {
  const audio = document.getElementById('weddingMusic');
  if (!audio) return;

  if (audio.paused || !isPlayingAudio) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function updateMusicUI(isPlaying) {
  const mutedIcon = document.getElementById('audioIconMuted');
  const playingIcon = document.getElementById('audioIconPlaying');
  const toggleBtn = document.getElementById('musicToggleBtn');

  if (isPlaying) {
    if (mutedIcon) mutedIcon.classList.add('hidden');
    if (playingIcon) {
      playingIcon.classList.remove('hidden');
      playingIcon.classList.add('music-disc-spin');
    }
    if (toggleBtn) {
      toggleBtn.classList.remove('opacity-60', 'bg-stone-100');
      toggleBtn.classList.add('bg-white/95');
      toggleBtn.setAttribute('title', 'Matikan Musik');
      toggleBtn.setAttribute('aria-label', 'Matikan Musik');
    }
  } else {
    if (mutedIcon) mutedIcon.classList.remove('hidden');
    if (playingIcon) {
      playingIcon.classList.add('hidden');
      playingIcon.classList.remove('music-disc-spin');
    }
    if (toggleBtn) {
      toggleBtn.classList.add('opacity-60', 'bg-stone-100');
      toggleBtn.classList.remove('bg-white/95');
      toggleBtn.setAttribute('title', 'Putar Musik');
      toggleBtn.setAttribute('aria-label', 'Putar Musik');
    }
  }
}

// 3. Live Countdown Timer Logic
function initCountdown() {
  let targetDate = new Date('2025-05-24T08:00:00+07:00').getTime();
  const nowCheck = new Date().getTime();
  if (targetDate <= nowCheck) {
    targetDate = nowCheck + (24 * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000) + (19 * 60 * 1000);
  }

  setInterval(() => {
    const now = new Date().getTime();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');

    if (cdDays) cdDays.textContent = String(d).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(h).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(m).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(s).padStart(2, '0');
  }, 1000);
}

// 4. Salin Nomor Rekening ke Clipboard
function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = btnElement.innerHTML;
    btnElement.innerHTML = `<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Tersalin ✓</span>`;
    btnElement.classList.add('bg-[#727464]');
    btnElement.classList.remove('bg-[#0C0D0C]');
    setTimeout(() => {
      btnElement.innerHTML = originalHTML;
      btnElement.classList.remove('bg-[#727464]');
      btnElement.classList.add('bg-[#0C0D0C]');
    }, 2000);
  }).catch(() => {
    prompt('Salin teks berikut:', text);
  });
}

function switchGiftTab(tab) {
  const bankTab = document.getElementById('giftTabBank');
  const physicalTab = document.getElementById('giftTabPhysical');
  const bankContent = document.getElementById('giftContentBank');
  const physicalContent = document.getElementById('giftContentPhysical');
  
  if (!bankTab || !physicalTab || !bankContent || !physicalContent) return;

  if (tab === 'bank') {
    bankTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0C0D0C] text-white shadow-sm transition-all cursor-pointer';
    physicalTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-transparent text-[#0C0D0C] hover:text-[#727464] transition-all cursor-pointer';
    bankContent.classList.remove('hidden');
    physicalContent.classList.add('hidden');
  } else {
    physicalTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0C0D0C] text-white shadow-sm transition-all cursor-pointer';
    bankTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-transparent text-[#0C0D0C] hover:text-[#727464] transition-all cursor-pointer';
    physicalContent.classList.remove('hidden');
    bankContent.classList.add('hidden');
  }
}

// 5. Buku Tamu (Ucapan & Doa) Character Counter & Live Submission
function updateCharCount() {
  const textarea = document.getElementById('wishMessage');
  const counter = document.getElementById('charCounter');
  if (textarea && counter) {
    counter.textContent = `${textarea.value.length}/200`;
  }
}

function escapeHTML(str) {
  return String(str || '').replace(/[&<>'"]/g, function (tag) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag;
  });
}

function submitWish(e) {
  e.preventDefault();
  const nameInput = document.getElementById('wishName');
  const msgInput = document.getElementById('wishMessage');
  const statusInput = document.getElementById('attendanceSelect');
  const container = document.getElementById('wishesContainer');

  const name = nameInput.value.trim();
  const message = msgInput.value.trim();
  const status = statusInput ? statusInput.value : 'Hadir';
  if (!name || !message) return;

  // Notify the public invite wrapper so the RSVP is persisted server-side.
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'RSVP_SUBMIT',
        payload: {
          guestName: name,
          attendance: status,
          message: message,
          totalPax: status === 'tidak' ? 0 : 1
        }
      }, '*');
    }
  } catch (err) { /* ignore cross-origin errors */ }

  const card = document.createElement('div');
  card.className = 'p-3.5 rounded-2xl bg-white/95 border border-cream-300/80 shadow-xs transition-all';
  card.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1.5">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-[#8C735B] text-white flex items-center justify-center text-xs font-serif font-semibold">
          ${escapeHTML(name.charAt(0).toUpperCase())}
        </div>
        <div>
          <h4 class="text-xs font-semibold text-[#3E342B]">${escapeHTML(name)}</h4>
          <span class="text-[10px] text-taupe-500">Baru saja</span>
        </div>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded-full ${status === 'hadir' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} font-medium">
        ${status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
      </span>
    </div>
    <p class="text-xs text-taupe-600 leading-relaxed mb-2">${escapeHTML(message)}</p>
    <div class="flex items-center justify-end">
      <button onclick="toggleLike(this)" class="inline-flex items-center gap-1 text-xs text-[#8C735B] hover:scale-110 transition">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
        <span class="text-[10px]">1</span>
      </button>
    </div>
  `;

  container.prepend(card);
  nameInput.value = '';
  msgInput.value = '';
  updateCharCount();
  alert('Terima kasih atas ucapan dan doa restunya!');
}

function toggleLike(btn) {
  const countSpan = btn.querySelector('span');
  let count = parseInt(countSpan.textContent, 10) || 0;
  if (btn.dataset.liked === 'true') {
    count--;
    btn.dataset.liked = 'false';
  } else {
    count++;
    btn.dataset.liked = 'true';
  }
  countSpan.textContent = count;
}

// 6. Gallery Lightbox
function openLightbox(src, caption) {
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const modal = document.getElementById('lightboxModal');
  if (img) img.src = src;
  if (cap) cap.textContent = caption;
  if (modal) modal.classList.remove('hidden');
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.add('hidden');
}


// ==============================================================
// 7. SMOOTH SCROLL REVEAL & ENTRANCE ANIMATION SYSTEM (STABLE & FLAP-FREE)
// ==============================================================
let scrollObserver = null;

function initScrollReveal() {
  const selector = 'section:not(#home) .reveal, section:not(#home) .reveal-fade, section:not(#home) .reveal-scale, section:not(#home) .reveal-left, section:not(#home) .reveal-right, section:not(#home) .reveal-botanical, section:not(#home).reveal';

  const revealElements = document.querySelectorAll(selector);
  
  if ('IntersectionObserver' in window) {
    if (scrollObserver) {
      scrollObserver.disconnect();
    }
    
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        } else {
          // Keep botanical bouquets and footer elements revealed once seen so they don't disappear at page edges
          if (
            !entry.target.closest('#home') &&
            !entry.target.closest('#gatePage') &&
            !entry.target.classList.contains('reveal-botanical') &&
            !entry.target.closest('#terimakasih')
          ) {
            entry.target.classList.remove('is-revealed');
          }
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '100px 0px 100px 0px'
    });

    revealElements.forEach(el => scrollObserver.observe(el));

    // Guarantee footer section elements reveal when reaching near bottom
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 300)) {
        const footerElements = document.querySelectorAll('#terimakasih .reveal, #terimakasih .reveal-botanical, #terimakasih .reveal-fade, #terimakasih .reveal-scale');
        footerElements.forEach(el => el.classList.add('is-revealed'));
      }
    }, { passive: true });
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

// Trigger smooth, slow blooming entrance on Hero (#home) as Gate book flips open
// Trigger smooth, slow blooming entrance on Hero (#home) as Gate book flips open
function triggerHeroReveal() {
  const homeElements = document.querySelectorAll(
    '#home .hero-anim, #home .reveal, #home .reveal-fade, #home .reveal-scale, #home .reveal-botanical'
  );
  
  // Staggered luxury blooming reveal as door swings open
  setTimeout(() => {
    homeElements.forEach(el => {
      el.classList.add('is-revealed');
    });
  }, 100);
}

window.onload = function () {
  initCountdown();
  initGate();
  initScrollReveal();
  initAudio();
};