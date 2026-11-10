
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

  // Ensure all page elements remain hidden until gate opens / until scrolled into view
  const allRevealEls = document.querySelectorAll('.hero-anim, .reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right, .reveal-botanical');
  allRevealEls.forEach(el => el.classList.remove('is-revealed'));
  
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
    const guestEls = document.querySelectorAll('#coverGuestName, .coverGuestNameTarget, [data-guest-name]');
    guestEls.forEach(el => {
      el.textContent = decodeURIComponent(guest);
    });
  }
}

let isGateOpening = false;

function openGate() {
  if (isGateOpening) return;
  isGateOpening = true;

  const gatePage = document.getElementById('gatePage');
  const gateCover = document.getElementById('gateCover');
  const curtainOverlay = document.getElementById('gateCurtainOverlay');
  const nav = document.querySelector('nav');
  const musicWrap = document.getElementById('musicControlWrap');

  // Guarantee page is locked at the very top (never jump/drop)
  window.scrollTo(0, 0);

  // 1. Hilangkan isi teks dan tombol kartu sampul seketika
  const centerCard = document.getElementById('gateCenterCard');
  if (centerCard) {
    centerCard.style.opacity = '0';
    centerCard.style.visibility = 'hidden';
    centerCard.style.pointerEvents = 'none';
  }

  // 2. Bersihkan pintu lama seketika tanpa animasi berlebih agar CPU/GPU bebas beban
  const doorLeft = document.getElementById('gateDoorLeft');
  const doorRight = document.getElementById('gateDoorRight');
  if (doorLeft) doorLeft.style.opacity = '0';
  if (doorRight) doorRight.style.opacity = '0';

  // 3. Putar musik romantis
  playMusic();

  if (curtainOverlay && gatePage) {
    // ========================================================
    // FASE 1: TIRAI MENUTUP DENGAN KELENTURAN ALAMI (0.70s)
    // ========================================================
    curtainOverlay.classList.remove('curtain-opening', 'curtain-play');
    curtainOverlay.classList.add('curtain-closing');

    // Saat tirai tertutup rapat di tengah (0.70s = 700ms):
    setTimeout(() => {
      // Sembunyikan pintu lama & buat transparan di balik tirai
      gatePage.classList.add('doors-opened');
      if (doorLeft) doorLeft.style.visibility = 'hidden';
      if (doorRight) doorRight.style.visibility = 'hidden';

      // Picu reveal halaman utama di balik tirai
      triggerHeroReveal();

      // Jeda sejenak (150ms) agar terasa mantap dan megah:
      setTimeout(() => {
        // ========================================================
        // FASE 2: TIRAI MEMBUKA DENGAN SIBIKAN ANGGUN (0.95s)
        // ========================================================
        curtainOverlay.classList.remove('curtain-closing');
        curtainOverlay.classList.add('curtain-opening');

        // Munculkan kontrol musik & navigasi saat tirai menyibak
        setTimeout(() => {
          if (musicWrap) {
            musicWrap.style.opacity = '1';
            musicWrap.style.pointerEvents = 'auto';
          }
          if (nav) {
            nav.style.opacity = '1';
            nav.style.pointerEvents = 'auto';
          }
        }, 450);

        // Saat tirai tuntas melewati batas layar (950ms):
        setTimeout(() => {
          if (gateCover) {
            gateCover.classList.add('gate-fade-out');
            setTimeout(() => {
              gateCover.style.display = 'none';
              curtainOverlay.style.display = 'none';
            }, 100);
          }

          // Buka kunci scroll body dengan mulus tanpa lonjakan layout
          document.body.style.overflow = 'auto';

          // Inisialisasi scroll reveal untuk section-section berikutnya
          initScrollReveal();

          isGateOpening = false;
        }, 950);

      }, 150);

    }, 700);

  } else {
    // Fallback jika curtain overlay tidak terpasang
    if (gatePage) {
      gatePage.classList.add('doors-opened');
    }
    triggerHeroReveal();
    setTimeout(() => {
      if (gateCover) {
        gateCover.classList.add('gate-fade-out');
        setTimeout(() => {
          gateCover.style.display = 'none';
        }, 100);
      }
      document.body.style.overflow = 'auto';
      if (nav) {
        nav.style.opacity = '1';
        nav.style.pointerEvents = 'auto';
      }
      if (musicWrap) {
        musicWrap.style.opacity = '1';
        musicWrap.style.pointerEvents = 'auto';
      }
      initScrollReveal();
      isGateOpening = false;
    }, 500);
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
    btnElement.classList.add('brightness-125');
    setTimeout(() => {
      btnElement.innerHTML = originalHTML;
      btnElement.classList.remove('brightness-125');
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
    bankTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E8C995] via-[#F3DEB8] to-[#E8C995] text-[#21100F] shadow-[0_4px_15px_rgba(232,201,149,0.35)] transition-all cursor-pointer';
    physicalTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-transparent text-[#F5E8D8]/75 hover:text-[#E8C995] transition-all cursor-pointer';
    bankContent.classList.remove('hidden');
    physicalContent.classList.add('hidden');
  } else {
    physicalTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E8C995] via-[#F3DEB8] to-[#E8C995] text-[#21100F] shadow-[0_4px_15px_rgba(232,201,149,0.35)] transition-all cursor-pointer';
    bankTab.className = 'px-4 py-1.5 rounded-full text-xs font-semibold bg-transparent text-[#F5E8D8]/75 hover:text-[#E8C995] transition-all cursor-pointer';
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
  const status = statusInput ? statusInput.value : 'hadir';
  if (!name || !message) return;

  // Notify the parent page (public invite wrapper) so the RSVP is persisted server-side.
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
  card.className = 'p-3.5 rounded-2xl bg-gradient-to-br from-[#2D0811]/90 to-[#1B0408]/95 border border-[#E8C995]/35 shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all';
  card.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1.5">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8C995] to-[#C49A55] text-[#21100F] flex items-center justify-center text-xs font-serif font-bold shadow-xs">
          ${escapeHTML(name.charAt(0).toUpperCase())}
        </div>
        <div>
          <h4 class="text-xs font-bold text-[#F5E8D8]">${escapeHTML(name)}</h4>
          <span class="text-[10px] text-[#E8C995]/70">Baru saja</span>
        </div>
      </div>
      <span class="text-[9.5px] px-2.5 py-0.5 rounded-full ${status === 'hadir' ? 'bg-[#E8C995]/20 border border-[#E8C995]/40 text-[#E8C995]' : 'bg-[#790F25]/30 border border-[#790F25]/50 text-[#F5E8D8]/70'} font-medium">
        ${status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
      </span>
    </div>
    <p class="text-xs text-[#F5E8D8]/85 leading-relaxed mb-2">${escapeHTML(message)}</p>
    <div class="flex items-center justify-end">
      <button onclick="toggleLike(this)" class="inline-flex items-center gap-1 text-xs text-[#E8C995] hover:scale-110 transition cursor-pointer">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
        <span class="text-[10px] font-bold">1</span>
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
  // Observe animated elements across subsequent sections (preserve #home hero cover framing)
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
          // Two-way scroll animation: remove is-revealed when scrolled past
          // so it smoothly resets and re-animates every time you return to that section!
          // Protect #home elements so hero framing bouquets remain visible
          if (!entry.target.closest('#home')) {
            entry.target.classList.remove('is-revealed');
          }
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '20px 0px 20px 0px'
    });

    revealElements.forEach(el => scrollObserver.observe(el));

    // Guarantee footer section elements reveal when reaching near bottom
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 250)) {
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
  
  // Staggered luxury blooming reveal right as the 3D doors part
  setTimeout(() => {
    homeElements.forEach(el => {
      el.classList.add('is-revealed');
    });
  }, 220);
}

window.onload = function () {
  initCountdown();
  initGate();
  const gateCover = document.getElementById('gateCover');
  if (!gateCover || gateCover.style.display === 'none' || gateCover.classList.contains('hidden')) {
    initScrollReveal();
  }
  initAudio();
};