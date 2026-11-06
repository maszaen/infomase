/**
 * Digital Invitation - Luxury 09 Clone
 * Fully Interactive Script
 */

(function () {
  'use strict';

  // 1. Viewport Height Fix for Mobile Browsers
  function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);

  // 2. Query Parameter Reader for Guest Name (?to=Nama+Tamu or ?u=Nama)
  function getGuestName() {
    const params = new URLSearchParams(window.location.search);
    return params.get('to') || params.get('u') || params.get('guest') || 'Nama Tamu';
  }

  const guestName = getGuestName();
  const guestDisplayEl = document.querySelector('.cover-guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');
  if (guestDisplayEl && guestName) {
    guestDisplayEl.textContent = guestName;
  }
  if (rsvpNameInput && guestName && guestName !== 'Nama Tamu') {
    rsvpNameInput.value = guestName;
  }

  // 3. Page Lock on Load
  document.body.classList.add('locked');

  // 4. Background Audio Controller (Template 1 Logic)
  const audio = document.getElementById('wedding-audio');
  const musicBtn = document.getElementById('music-toggle');
  let isPlaying = false;
  let wasPlayingBeforeBlur = false;

  function updateMusicUI(playing) {
    const mutedIcon = document.getElementById('audioIconMuted');
    const playingIcon = document.getElementById('audioIconPlaying');
    if (playing) {
      if (mutedIcon) mutedIcon.classList.add('hidden');
      if (playingIcon) {
        playingIcon.classList.remove('hidden');
        playingIcon.classList.add('music-disc-spin');
      }
      if (musicBtn) {
        musicBtn.classList.remove('paused');
        musicBtn.setAttribute('title', 'Matikan Musik');
        musicBtn.setAttribute('aria-label', 'Matikan Musik');
      }
    } else {
      if (mutedIcon) mutedIcon.classList.remove('hidden');
      if (playingIcon) {
        playingIcon.classList.add('hidden');
        playingIcon.classList.remove('music-disc-spin');
      }
      if (musicBtn) {
        musicBtn.classList.add('paused');
        musicBtn.setAttribute('title', 'Putar Musik');
        musicBtn.setAttribute('aria-label', 'Putar Musik');
      }
    }
  }

  function playAudio() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      updateMusicUI(true);
    }).catch(() => {
      isPlaying = false;
      updateMusicUI(false);
    });
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updateMusicUI(false);
  }

  function toggleAudio() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleAudio);
  }

  // Auto pause when leaving tab, resume when returning
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      wasPlayingBeforeBlur = isPlaying;
      if (isPlaying) pauseAudio();
    } else {
      if (wasPlayingBeforeBlur) playAudio();
    }
  });

  // 5. Open Invitation Trigger (#open)
  const btnOpen = document.getElementById('open');
  const secCover = document.getElementById('sec');
  const kolomCover = document.getElementById('kolom');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // Slide cover up
      if (kolomCover) {
        kolomCover.style.transform = 'translateY(-100%)';
      }
      if (secCover) {
        secCover.classList.add('hide');
        setTimeout(() => {
          secCover.style.display = 'none';
        }, 1500);
      }

      // Unlock body scroll
      document.body.classList.remove('locked');

      // Start music
      playAudio();

      // Trigger scroll animations for visible items
      checkScroll();
      initScrollReveal();
    }, { once: true });
  }

  // 6. Countdown Timer (Target: 28 Dec 2026, 08:00 WIB)
  const targetDate = new Date('2026-12-28T08:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMinutes) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 7. Day Counter Animation (0 -> 28 on scroll)
  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    const counterElements = document.querySelectorAll('.animate-num-28');
    if (!counterElements.length) return;

    const first = counterElements[0];
    const rect = first.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      countersAnimated = true;
      let count = 0;
      const target = 28;
      const stepTime = Math.abs(Math.floor(1500 / target));
      const timer = setInterval(() => {
        count += 1;
        counterElements.forEach(el => el.textContent = count);
        if (count >= target) {
          clearInterval(timer);
          counterElements.forEach(el => el.textContent = '28');
        }
      }, stepTime);
    }
  }

  // 8. Slideshows (Hero & Closing & Event Carousels)
  function initSlideshow(containerSelector, slideSelector, interval) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const slides = container.querySelectorAll(slideSelector);
    if (slides.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, interval);
  }

  initSlideshow('.hero-slideshow', '.hero-slide', 4000);
  initSlideshow('.closing-slideshow', '.closing-slide', 4000);
  initSlideshow('.event-carousel-1', '.event-carousel-slide', 3500);
  initSlideshow('.event-carousel-2', '.event-carousel-slide', 3500);

  // 8b. Interactive Love Story Journey Storyboard
  const storyStepBtns = document.querySelectorAll('.story-step-btn');
  const storyChapters = document.querySelectorAll('.story-chapter');
  const storyDots = document.querySelectorAll('.story-dot');
  const storyProgress = document.getElementById('storyProgress');
  const storyPrevBtn = document.getElementById('storyPrevBtn');
  const storyNextBtn = document.getElementById('storyNextBtn');
  const storyShowcase = document.querySelector('.story-showcase');

  let currentStoryIdx = 0;
  const totalChapters = storyChapters.length;
  let storyAutoTimer = null;
  let isStoryTransitioning = false;
  let isStoryInitialized = false;

  function showStoryChapter(targetIndex) {
    if (targetIndex < 0) targetIndex = totalChapters - 1;
    if (targetIndex >= totalChapters) targetIndex = 0;

    // Prevent re-trigger while currently transitioning
    if (isStoryInitialized && (targetIndex === currentStoryIdx || isStoryTransitioning)) {
      return;
    }

    const prevIndex = currentStoryIdx;
    currentStoryIdx = targetIndex;

    // Update stepper & dots indicator
    storyStepBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentStoryIdx);
    });

    storyDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentStoryIdx);
    });

    if (storyProgress && totalChapters > 1) {
      const progressPercent = (currentStoryIdx / (totalChapters - 1)) * 100;
      storyProgress.style.width = progressPercent + '%';
    }

    const prevChapter = storyChapters[prevIndex];
    const nextChapter = storyChapters[currentStoryIdx];

    // Initial mount: display slide immediately without animation
    if (!isStoryInitialized) {
      isStoryInitialized = true;
      storyChapters.forEach((ch, idx) => {
        ch.classList.toggle('active', idx === currentStoryIdx);
      });
      return;
    }

    if (!prevChapter || !nextChapter) return;

    isStoryTransitioning = true;

    // Clean up any remaining animation classes
    storyChapters.forEach(ch => {
      ch.classList.remove('fade-out-up', 'fade-in-bottom-prep');
    });

    // 1. Position incoming slide at bottom starting position without transition
    nextChapter.classList.add('fade-in-bottom-prep');

    // 2. Force layout reflow
    void nextChapter.offsetWidth;

    // 3. Execute smooth bottom-to-top rising fade animation
    requestAnimationFrame(() => {
      prevChapter.classList.remove('active');
      prevChapter.classList.add('fade-out-up');

      nextChapter.classList.remove('fade-in-bottom-prep');
      nextChapter.classList.add('active');

      setTimeout(() => {
        prevChapter.classList.remove('fade-out-up');
        isStoryTransitioning = false;
      }, 900);
    });
  }

  storyStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-story-idx') || '0', 10);
      showStoryChapter(idx);
      resetStoryAuto();
    });
  });

  storyDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-story-idx') || '0', 10);
      showStoryChapter(idx);
      resetStoryAuto();
    });
  });

  if (storyPrevBtn) {
    storyPrevBtn.addEventListener('click', () => {
      showStoryChapter(currentStoryIdx - 1);
      resetStoryAuto();
    });
  }

  if (storyNextBtn) {
    storyNextBtn.addEventListener('click', () => {
      showStoryChapter(currentStoryIdx + 1);
      resetStoryAuto();
    });
  }

  if (storyShowcase) {
    let touchStartX = 0;
    let touchEndX = 0;
    storyShowcase.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    storyShowcase.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        showStoryChapter(currentStoryIdx + 1);
        resetStoryAuto();
      } else if (touchEndX - touchStartX > 40) {
        showStoryChapter(currentStoryIdx - 1);
        resetStoryAuto();
      }
    }, { passive: true });
  }

  function startStoryAuto() {
    storyAutoTimer = setInterval(() => {
      showStoryChapter(currentStoryIdx + 1);
    }, 6000);
  }

  function resetStoryAuto() {
    clearInterval(storyAutoTimer);
    startStoryAuto();
  }

  if (totalChapters > 0) {
    showStoryChapter(0);
    startStoryAuto();
  }

  // 9. Amplop Digital Accordion Toggle (#klik, #amplop)
  const btnAmplop = document.getElementById('klik');
  const drawerAmplop = document.getElementById('amplop');
  if (btnAmplop && drawerAmplop) {
    btnAmplop.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = drawerAmplop.classList.toggle('show');
      btnAmplop.classList.toggle('active', isOpen);
      if (isOpen) {
        setTimeout(() => {
          drawerAmplop.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  }

  // 10. Copy to Clipboard with Toast Notification
  const toastMsg = document.getElementById('toast-msg');
  function showToast(text) {
    if (!toastMsg) return;
    toastMsg.textContent = text;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 2500);
  }

  const copyButtons = document.querySelectorAll('[data-copy-target]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-target');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Tersalin ke clipboard!');
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('Tersalin ke clipboard!');
    } catch (e) {
      showToast('Gagal menyalin');
    }
    document.body.removeChild(tempInput);
  }

  // 11. Lightbox for Gallery Photos
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentLightboxIdx = 0;
  const galleryUrls = [];

  galleryItems.forEach((item, idx) => {
    const img = item.querySelector('img');
    if (img) {
      galleryUrls.push(img.src);
      item.addEventListener('click', () => {
        currentLightboxIdx = idx;
        openLightbox(currentLightboxIdx);
      });
    }
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryUrls.length) return;
    lightboxImg.src = galleryUrls[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIdx = (currentLightboxIdx - 1 + galleryUrls.length) % galleryUrls.length;
      openLightbox(currentLightboxIdx);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIdx = (currentLightboxIdx + 1) % galleryUrls.length;
      openLightbox(currentLightboxIdx);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // 12. RSVP Presence Pills & Wishes System
  let selectedPresence = 'hadir';
  const pillHadir = document.getElementById('pill-hadir');
  const pillTidak = document.getElementById('pill-tidak');

  if (pillHadir && pillTidak) {
    pillHadir.addEventListener('click', () => {
      selectedPresence = 'hadir';
      pillHadir.classList.add('active');
      pillTidak.classList.remove('active');
    });

    pillTidak.addEventListener('click', () => {
      selectedPresence = 'tidak';
      pillTidak.classList.add('active');
      pillHadir.classList.remove('active');
    });
  }

  // Initial wishes data
  const defaultWishes = [
    {
      name: 'Rian & Maya',
      presence: 'hadir',
      message: 'Selamat menempuh hidup baru Habib & Adiba! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.',
      time: '1 jam yang lalu'
    },
    {
      name: 'Dinda Ayu',
      presence: 'hadir',
      message: 'Happy wedding Adiba sayang & Mas Habib! Semoga bahagia selalu hingga maut memisahkan.',
      time: '3 jam yang lalu'
    },
    {
      name: 'Bagus Pratama',
      presence: 'tidak',
      message: 'Barakallahu lakum wa baraka alaikum. Mohon maaf belum bisa hadir langsung kawan, doa terbaik selalu untuk kalian!',
      time: '5 jam yang lalu'
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem('luxury09_wishes');
      return stored ? JSON.parse(stored) : defaultWishes;
    } catch (e) {
      return defaultWishes;
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('luxury09_wishes', JSON.stringify(wishes));
    } catch (e) {}
  }

  function renderWishes() {
    const listEl = document.getElementById('wishes-list');
    if (!listEl) return;
    const wishes = getStoredWishes();
    listEl.innerHTML = '';

    wishes.forEach(item => {
      const wishDiv = document.createElement('div');
      wishDiv.className = 'wish-item';
      const isHadir = item.presence === 'hadir';

      wishDiv.innerHTML = `
        <div class="wish-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="wish-body">
          <div class="wish-header">
            <span class="wish-name">${escapeHtml(item.name)}</span>
            <span class="wish-badge ${isHadir ? 'hadir' : 'tidak'}">${isHadir ? 'Hadir' : 'Tidak Hadir'}</span>
          </div>
          <div class="wish-message">${escapeHtml(item.message)}</div>
          <div class="wish-time">${escapeHtml(item.time || 'Baru saja')}</div>
        </div>
      `;
      listEl.appendChild(wishDiv);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderWishes();

  const btnSendRsvp = document.getElementById('btn-send-rsvp');
  const rsvpMsgInput = document.getElementById('rsvp-message');

  if (btnSendRsvp) {
    btnSendRsvp.addEventListener('click', () => {
      const name = rsvpNameInput ? rsvpNameInput.value.trim() : '';
      const msg = rsvpMsgInput ? rsvpMsgInput.value.trim() : '';

      if (!name) {
        alert('Silakan masukkan nama Anda.');
        if (rsvpNameInput) rsvpNameInput.focus();
        return;
      }
      if (!msg) {
        alert('Silakan tuliskan ucapan atau doa Anda.');
        if (rsvpMsgInput) rsvpMsgInput.focus();
        return;
      }

      const wishes = getStoredWishes();
      wishes.unshift({
        name: name,
        presence: selectedPresence,
        message: msg,
        time: 'Baru saja'
      });
      saveWishes(wishes);
      renderWishes();

      if (rsvpMsgInput) rsvpMsgInput.value = '';
      showToast('Terima kasih! Ucapan Anda berhasil dikirim.');
    });
  }

  // 13. SMOOTH SCROLL REVEAL SYSTEM (PERSIS TEMPLATE 1 - TWO-WAY & SLOW LUXURY)
  let scrollObserver = null;

  function initScrollReveal() {
    const selector = '.reveal, .reveal-item, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right';
    const revealElements = document.querySelectorAll(selector);

    if ('IntersectionObserver' in window) {
      if (scrollObserver) {
        scrollObserver.disconnect();
      }

      scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            entry.target.classList.add('revealed');
            if (entry.target.querySelector && entry.target.querySelector('.counter-val')) {
              animateCounters();
            }
          } else {
            // Anti-Flicker / Anti Kedat-Kedut:
            // Hanya reset jika elemen berada di bawah viewport (ketika scroll balik ke atas).
            // JANGAN pernah reset jika elemen berada di atas viewport (rect.top <= 0),
            // agar transform translateY tidak memicu loop osilasi/getar di tepi atas layar.
            const rect = entry.boundingClientRect;
            const vh = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top > vh + 50) {
              entry.target.classList.remove('is-revealed');
              entry.target.classList.remove('revealed');
            }
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '20px 0px -20px 0px'
      });

      revealElements.forEach(el => scrollObserver.observe(el));
    } else {
      // Fallback
      revealElements.forEach(el => {
        el.classList.add('is-revealed');
        el.classList.add('revealed');
      });
    }
  }

  function checkScroll() {
    animateCounters();
  }

  // 14. Bottom Navigation Active State on Scroll
  const navSections = [
    { id: 'hero', btn: document.querySelector('.bottom-nav-btn[href="#hero"]') },
    { id: 'mempelai', btn: document.querySelector('.bottom-nav-btn[href="#mempelai"]') },
    { id: 'acara', btn: document.querySelector('.bottom-nav-btn[href="#acara"]') },
    { id: 'galeri', btn: document.querySelector('.bottom-nav-btn[href="#galeri"]') },
    { id: 'rsvp', btn: document.querySelector('.bottom-nav-btn[href="#rsvp"]') },
  ];

  function updateNavActiveState() {
    const scrollPos = window.scrollY + 250;
    let currentId = 'hero';
    navSections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el && el.offsetTop <= scrollPos) {
        currentId = sec.id;
      }
    });

    navSections.forEach(sec => {
      if (sec.btn) {
        if (sec.id === currentId) {
          sec.btn.classList.add('active');
        } else {
          sec.btn.classList.remove('active');
        }
      }
    });
  }

  let isScrollThrottled = false;
  window.addEventListener('scroll', () => {
    if (!isScrollThrottled) {
      window.requestAnimationFrame(() => {
        checkScroll();
        updateNavActiveState();
        isScrollThrottled = false;
      });
      isScrollThrottled = true;
    }
  }, { passive: true });

  window.addEventListener('load', () => {
    checkScroll();
    updateNavActiveState();
    initScrollReveal();
  });

})();
