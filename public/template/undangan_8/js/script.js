(() => {
  "use strict";

  const STORAGE_KEY = "undangan8_batik_putih_rsvp_v1";
  const DEFAULT_WISHES = [
    {
      name: "Keluarga Besar Kanjeng Raden Tumenggung Suryo",
      presence: "Hadir",
      message: "Nderek mangayubagya atas pawiwahan suci Habib & Adiba. Semoga senantiasa diberkahi ketenteraman, sakinah, mawaddah, warahmah.",
      createdAt: Date.now() - 3600 * 1000 * 4,
    },
    {
      name: "Nadia & Raka Pratama",
      presence: "Hadir",
      message: "Anggun sekali tema Batik Putihnya! Selamat menempuh hidup baru Habib dan Adiba, lancar sampai hari H.",
      createdAt: Date.now() - 3600 * 1000 * 16,
    },
    {
      name: "Bapak H. Hendra Wijaya",
      presence: "Tidak Hadir",
      message: "Mohon maaf belum dapat hadir langsung ke Kediri, doa tulus kami menyertai kebahagiaan kedua mempelai.",
      createdAt: Date.now() - 3600 * 1000 * 28,
    },
  ];

  // 1. Dynamic Guest Name (?to=... | ?guest=... | ?kepada=...)
  const params = new URLSearchParams(window.location.search);
  const rawGuest = (params.get("to") || params.get("guest") || params.get("kepada") || "").trim();
  const guestEl = document.getElementById("guest-name");
  const rsvpNameInput = document.getElementById("rsvp-name");
  if (rawGuest) {
    if (guestEl) guestEl.textContent = rawGuest;
    if (rsvpNameInput) rsvpNameInput.value = rawGuest;
  }

  // 2. Ambient Falling Jasmine Petals (Kelopak Melati Gugur — Sisi Kiri & Sisi Kanan)
  const petalStage = document.getElementById("melati-petals");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (petalStage && !reduceMotion) {
    const isDesktop = window.innerWidth >= 1024;
    const countPerSide = isDesktop ? 12 : 7;
    const frag = document.createDocumentFragment();

    const createPetal = (side, idx) => {
      const p = document.createElement("span");
      p.className = `melati-petal melati-petal--${side}`;

      let leftPct;
      if (isDesktop) {
        // Sisi Kiri (sayap kiri): 1.5% - 28%
        // Sisi Kanan (sayap kanan): 72% - 98.5%
        const ratio = idx / Math.max(1, countPerSide - 1);
        const jitter = ((idx * 7) % 5) - 2;
        leftPct = side === "left"
          ? 2 + ratio * 24 + jitter
          : 73 + ratio * 24 + jitter;
      } else {
        // Mode Mobile: Terbagi merata di sisi kiri (2% - 44%) dan sisi kanan (56% - 98%)
        const ratio = idx / Math.max(1, countPerSide - 1);
        const jitter = ((idx * 5) % 4) - 1.5;
        leftPct = side === "left"
          ? 2 + ratio * 40 + jitter
          : 56 + ratio * 40 + jitter;
      }

      const size = 8.5 + ((idx * 3) % 5) * 1.5;
      const dur = 10.5 + ((idx * 7) % 6) * 1.9;
      const delay = -(((idx * 3.7) + (side === "right" ? 2.3 : 0)) % 16);
      const drift = (idx % 2 === 0 ? 1 : -1) * (14 + ((idx * 5) % 18));

      p.style.left = `${Math.min(99, Math.max(1, leftPct)).toFixed(1)}%`;
      p.style.setProperty("--sz", `${size.toFixed(1)}px`);
      p.style.setProperty("--dur", `${dur.toFixed(1)}s`);
      p.style.setProperty("--delay", `${delay.toFixed(1)}s`);
      p.style.setProperty("--drift-x", `${drift}px`);
      return p;
    };

    for (let i = 0; i < countPerSide; i++) {
      frag.appendChild(createPetal("left", i));
      frag.appendChild(createPetal("right", i));
    }

    petalStage.appendChild(frag);
  }

  // 3. Toast Helper
  const toastEl = document.getElementById("kraton-toast");
  let toastTimer = 0;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.hidden = true;
    }, 2400);
  }

  // 4. Gamelan Audio Controller (Start at 15s, Smooth Fade, Visibility & YouTube Ducking)
  const audio = document.getElementById("bg-audio");
  const musicBtn = document.getElementById("btn-music");
  const musicIcon = document.getElementById("music-icon");
  const START_SEC = 15;
  const TARGET_VOL = 0.8;
  let musicAllowed = false;
  let resumeAfterHide = false;
  let resumeAfterVideo = false;
  let fadeTimer = 0;

  function setMusicUI(playing) {
    if (!musicBtn || !musicIcon) return;
    musicBtn.classList.toggle("is-playing", playing);
    musicIcon.className = playing ? "fas fa-compact-disc" : "fas fa-volume-mute";
  }

  function fadeVolume(to, ms, done) {
    if (!audio) return;
    clearInterval(fadeTimer);
    const from = audio.volume;
    const steps = 15;
    let i = 0;
    fadeTimer = window.setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, from + ((to - from) * i) / steps));
      if (i >= steps) {
        clearInterval(fadeTimer);
        if (done) done();
      }
    }, Math.max(16, Math.floor(ms / steps)));
  }

  function playMusic() {
    if (!audio || !musicAllowed) return;
    try {
      if (audio.currentTime < START_SEC) audio.currentTime = START_SEC;
    } catch {}
    audio.volume = 0;
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        setMusicUI(true);
        fadeVolume(TARGET_VOL, 600);
      }).catch(() => setMusicUI(false));
    }
  }

  function pauseMusic() {
    if (!audio) return;
    setMusicUI(false);
    fadeVolume(0, 450, () => audio.pause());
  }

  if (audio) {
    audio.addEventListener("ended", () => {
      audio.currentTime = START_SEC;
      playMusic();
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      musicAllowed = true;
      if (!audio || audio.paused) playMusic();
      else pauseMusic();
    });
  }

  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("is-page-hidden", document.hidden);
    if (!audio) return;
    if (document.hidden) {
      resumeAfterHide = !audio.paused;
      if (resumeAfterHide) audio.pause();
    } else if (resumeAfterHide && musicAllowed) {
      resumeAfterHide = false;
      playMusic();
    }
  });

  window.addEventListener("message", (ev) => {
    if (!ev.data || typeof ev.data !== "string") return;
    try {
      const data = JSON.parse(ev.data);
      if (data.event === "onStateChange") {
        if (data.info === 1 && audio && !audio.paused) {
          resumeAfterVideo = true;
          pauseMusic();
        } else if ((data.info === 0 || data.info === 2) && resumeAfterVideo) {
          resumeAfterVideo = false;
          playMusic();
        }
      }
    } catch {}
  });

  // 5. 3D Double-Door Gebyog Gate Cover Unlock
  const gateCover = document.getElementById("gate-cover");
  const openBtn = document.getElementById("btn-open-gate");
  if (openBtn && gateCover) {
    openBtn.addEventListener("click", () => {
      musicAllowed = true;
      playMusic();
      document.body.classList.remove("is-locked");
      gateCover.classList.add("is-opening");
      // Move ambient petals behind interactive dialogs once opened
      if (petalStage) petalStage.style.zIndex = "80";
      window.setTimeout(() => {
        gateCover.classList.add("is-hidden");
      }, 1150);
    });
  }

  // 6. Multi-Directional Scroll Reveal, Ornament Pop-Slow & Almanac Date Count-Up
  const revealSelector = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-ornament";
  const revealObs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(revealSelector).forEach((el) => revealObs.observe(el));

  // Almanac Date Count-Up (Ref: Undangan 4 — 01 -> 28)
  const dateNumEl = document.getElementById("almanac-date-num");
  if (dateNumEl && !reduceMotion) {
    const targetDate = parseInt(dateNumEl.getAttribute("data-count-to") || "28", 10);
    const countObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          countObs.unobserve(dateNumEl);
          let current = 1;
          dateNumEl.textContent = "01";
          const stepMs = Math.max(24, Math.floor(850 / targetDate));
          const timer = window.setInterval(() => {
            current += 1;
            dateNumEl.textContent = String(Math.min(current, targetDate)).padStart(2, "0");
            if (current >= targetDate) clearInterval(timer);
          }, stepMs);
        }
      },
      { threshold: 0.4 }
    );
    countObs.observe(dateNumEl);
  }

  // Dock Scroll-Spy & Smooth Navigation
  const dockLinks = Array.from(document.querySelectorAll(".dock-link"));
  const spyObs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dockLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === id));
        }
      }
    },
    { rootMargin: "-38% 0px -50% 0px" }
  );
  ["beranda", "mempelai", "acara", "galeri", "ucapan"].forEach((id) => {
    const sec = document.getElementById(id);
    if (sec) spyObs.observe(sec);
  });

  dockLinks.forEach((link) => {
    link.addEventListener("click", (evt) => {
      const targetHash = link.getAttribute("href");
      if (targetHash && targetHash.startsWith("#")) {
        const targetEl = document.getElementById(targetHash.slice(1));
        if (targetEl) {
          evt.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          dockLinks.forEach((a) => a.classList.toggle("is-active", a === link));
        }
      }
    });
  });

  // 7. Live Countdown
  const cdWrap = document.querySelector(".countdown-ribbon");
  if (cdWrap) {
    const targetMs = Date.parse(cdWrap.getAttribute("data-target") || "2026-12-28T01:00:00Z");
    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-mins");
    const sEl = document.getElementById("cd-secs");
    const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

    const tick = () => {
      const diff = Math.max(0, targetMs - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);
    };
    tick();
    window.setInterval(tick, 1000);
  }

  // 8. Gift Tabs & Clipboard Copy
  const giftTabs = Array.from(document.querySelectorAll(".gift-tab"));
  giftTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("aria-controls");
      giftTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !active;
      });
      const activePanel = document.getElementById(targetId);
      if (activePanel) activePanel.classList.add("is-visible");
    });
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      const msg = btn.getAttribute("data-toast") || "Berhasil disalin";
      try {
        await navigator.clipboard.writeText(text);
        showToast(msg);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast(msg);
      }
    });
  });

  // 9. Native <dialog> Lightbox with Top-Layer Exit Animation Fallback (modern-web-guidance)
  const dialog = document.getElementById("lightbox-dialog");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");
  const lbCount = document.getElementById("lightbox-counter");
  const lbCloseBtn = document.getElementById("lb-close");
  const tiles = Array.from(document.querySelectorAll(".bento-tile"));
  const galleryItems = tiles.map((btn) => {
    const img = btn.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" };
  });
  let currentIdx = 0;

  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
      return false;
    }
    const probe = document.createElement("div");
    probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = "none";
    supportsDisplayTransition = getComputedStyle(probe).display === "block";
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay();
  }

  async function closeTopLayer(el) {
    if (!el || !el.open) return;
    if (!supportsTopLayerExit()) {
      el.setAttribute("data-closing", "");
      const animations = el.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 400)),
        ]);
      }
      if (!el.hasAttribute("data-closing")) return;
      el.removeAttribute("data-closing");
    }
    el.close();
  }

  function renderSlide(idx) {
    if (!galleryItems.length) return;
    currentIdx = (idx + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIdx];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCap.textContent = item.alt;
    lbCount.textContent = `${currentIdx + 1} / ${galleryItems.length}`;
  }

  tiles.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      renderSlide(i);
      if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    });
  });

  document.getElementById("lb-prev")?.addEventListener("click", () => renderSlide(currentIdx - 1));
  document.getElementById("lb-next")?.addEventListener("click", () => renderSlide(currentIdx + 1));
  lbCloseBtn?.addEventListener("click", () => closeTopLayer(dialog));

  if (dialog) {
    dialog.addEventListener("cancel", (ev) => {
      ev.preventDefault();
      closeTopLayer(dialog);
    });

    if (!("closedBy" in HTMLDialogElement.prototype)) {
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!inside) closeTopLayer(dialog);
      });
    }

    dialog.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowLeft") renderSlide(currentIdx - 1);
      if (ev.key === "ArrowRight") renderSlide(currentIdx + 1);
    });

    let touchX = 0;
    dialog.addEventListener("touchstart", (ev) => {
      touchX = ev.changedTouches[0].clientX;
    }, { passive: true });
    dialog.addEventListener("touchend", (ev) => {
      const dx = ev.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 42) renderSlide(dx < 0 ? currentIdx + 1 : currentIdx - 1);
    }, { passive: true });
  }

  // 10. RSVP & Guestbook Wall (localStorage)
  function loadWishes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {}
    return DEFAULT_WISHES.slice();
  }

  function saveWishes(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

  function relTime(ts) {
    const mins = Math.max(0, Math.floor((Date.now() - ts) / 60000));
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} jam lalu`;
    return `${Math.floor(hrs / 24)} hari lalu`;
  }

  const feedEl = document.getElementById("wishes-feed");
  const hadirEl = document.getElementById("count-hadir");
  const absenEl = document.getElementById("count-absen");
  let wishes = loadWishes();

  function renderWishes() {
    let hadir = 0;
    let absen = 0;
    if (feedEl) feedEl.innerHTML = "";

    wishes.forEach((w) => {
      const isHadir = w.presence === "Hadir";
      if (isHadir) hadir++;
      else absen++;

      if (!feedEl) return;
      const card = document.createElement("article");
      card.className = "wish-card";

      const ava = document.createElement("div");
      ava.className = "wish-avatar";
      ava.textContent = (w.name || "T").trim().charAt(0).toUpperCase();

      const body = document.createElement("div");
      const meta = document.createElement("div");
      meta.className = "wish-meta";

      const author = document.createElement("span");
      author.className = "wish-author";
      author.textContent = w.name;

      const badge = document.createElement("span");
      badge.className = "wish-badge" + (isHadir ? " wish-badge--hadir" : "");
      badge.textContent = w.presence;

      const text = document.createElement("p");
      text.className = "wish-text";
      text.textContent = w.message;

      const time = document.createElement("span");
      time.className = "wish-time";
      time.textContent = relTime(w.createdAt || Date.now());

      meta.append(author, badge);
      body.append(meta, text, time);
      card.append(ava, body);
      feedEl.appendChild(card);
    });

    if (hadirEl) hadirEl.textContent = String(hadir);
    if (absenEl) absenEl.textContent = String(absen);
  }

  renderWishes();

  const rsvpForm = document.getElementById("rsvp-form");
  const feedbackEl = document.getElementById("rsvp-feedback");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(rsvpForm);
      const name = String(fd.get("name") || "").trim();
      const presence = String(fd.get("presence") || "Hadir");
      const message = String(fd.get("message") || "").trim();

      if (!name || !message) {
        if (feedbackEl) {
          feedbackEl.textContent = "Mohon lengkapi nama dan ucapan doa Anda.";
          feedbackEl.className = "rsvp-feedback is-error";
          feedbackEl.hidden = false;
        }
        return;
      }

      wishes.unshift({ name, presence, message, createdAt: Date.now() });
      saveWishes(wishes);
      renderWishes();
      document.getElementById("rsvp-msg").value = "";

      if (feedbackEl) {
        feedbackEl.textContent = "Matur nuwun! Doa dan konfirmasi Anda telah tersimpan.";
        feedbackEl.className = "rsvp-feedback is-ok";
        feedbackEl.hidden = false;
      }
      showToast("Ucapan & konfirmasi terkirim");
    });
  }
})();
