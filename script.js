/* Branded welcome intro: replay on every homepage display, including back/forward restores. */
(() => {
  const path = window.location.pathname;
  const isHome = path.endsWith('/') || path.endsWith('/index.html') || path === '';
  if (!isHome) return;

  let splashTimer;
  let removeTimer;

  function playIntro() {
    let splash = document.querySelector('.intro-splash');
    if (!splash) {
      splash = document.createElement('div');
      splash.className = 'intro-splash';
      splash.setAttribute('aria-label', 'Welcome');
      splash.setAttribute('role', 'status');
      splash.style.backgroundColor = '#F0442E';
      splash.style.color = '#F2EBDD';
      splash.innerHTML = '<div class="intro-splash-content"><img src="logo-icon.svg?v=spin3" alt="" class="intro-splash-logo"><p>Welcome</p></div>';
      document.body.prepend(splash);
    }

    window.clearTimeout(splashTimer);
    window.clearTimeout(removeTimer);
    splash.style.backgroundColor = '#F0442E';
    splash.style.color = '#F2EBDD';
    const logo = splash.querySelector('.intro-splash-logo');
    const label = splash.querySelector('.intro-splash-content p');
    if (logo) logo.style.filter = 'brightness(0) saturate(100%) invert(93%) sepia(8%) saturate(440%) hue-rotate(334deg) brightness(101%) contrast(91%)';
    if (label) label.style.color = '#F2EBDD';
    splash.classList.remove('is-exiting', 'is-entering');
    splash.style.opacity = '1';
    splash.style.visibility = 'visible';
    void splash.offsetWidth;
    splash.classList.add('is-entering');

    splashTimer = window.setTimeout(() => {
      splash.classList.remove('is-entering');
      splash.classList.add('is-exiting');
      removeTimer = window.setTimeout(() => splash.remove(), 700);
    }, 2850);
  }

  // Normal page load and browser back/forward cache restore both pass through pageshow.
  window.addEventListener('pageshow', playIntro);
  if (document.readyState === 'complete') playIntro();
  else window.addEventListener('load', playIntro, { once: true });
})();

/* Lightweight adaptive cursor: difference blending inverts its appearance against each background. */
(() => {
  if (!window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches) return;

  const cursor = document.createElement('img');
  cursor.className = 'inverting-cursor';
  cursor.src = 'logo-icon.svg?v=spin3';
  cursor.alt = '';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  let visible = false;
  document.addEventListener('pointermove', (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    if (!visible) {
      cursor.classList.add('is-visible');
      visible = true;
    }
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    cursor.classList.remove('is-visible');
    visible = false;
  });
})();



/* Texture pack announcement: show after the homepage welcome intro has fully cleared. */
(() => {
  const path = window.location.pathname;
  const isHome = path.endsWith('/') || path.endsWith('/index.html') || path === '';
  if (!isHome) return;

  let sawSplash = false;
  let noticeTimer;
  let pollTimer;
  let shown = false;

  function showNotice() {
    if (shown || document.querySelector('.texture-notice')) return;
    shown = true;
    const notice = document.createElement('aside');
    notice.className = 'texture-notice';
    notice.setAttribute('aria-label', 'New free design resource');
    notice.innerHTML = `
      <button class="texture-notice-close" type="button" aria-label="Dismiss texture pack announcement">×</button>
      <a class="texture-notice-image-link" href="resources.html" tabindex="-1" aria-hidden="true">
        <img class="texture-notice-image" src="resources/preview_image2.jpg" alt="">
      </a>
      <div class="texture-notice-copy">
        <p class="texture-notice-eyebrow">FREE DOWNLOAD / 001</p>
        <h2>Warehouse Textures<br>Vol. 01</h2>
        <p class="texture-notice-description">Four original textures, ready to use.</p>
        <a class="texture-notice-link" href="resources.html">Explore textures <span aria-hidden="true">↗</span></a>
      </div>`;
    document.body.appendChild(notice);
    requestAnimationFrame(() => notice.classList.add('is-visible'));
    notice.querySelector('.texture-notice-close').addEventListener('click', () => {
      notice.classList.remove('is-visible');
      window.setTimeout(() => notice.remove(), 220);
    });
  }

  function checkIntro() {
    const splash = document.querySelector('.intro-splash');
    if (splash) {
      sawSplash = true;
      return;
    }
    if (!sawSplash) return;
    window.clearInterval(pollTimer);
    noticeTimer = window.setTimeout(showNotice, 400);
  }

  function beginWatching() {
    if (shown || document.querySelector('.texture-notice')) return;
    pollTimer = window.setInterval(checkIntro, 150);
    checkIntro();
  }

  window.addEventListener('load', beginWatching, { once: true });
  window.addEventListener('pageshow', () => {
    if (document.readyState === 'complete') beginWatching();
  });
  window.addEventListener('pagehide', () => {
    window.clearTimeout(noticeTimer);
    window.clearInterval(pollTimer);
  });
})();


/* Accessible mobile navigation shared by every page. */
(() => {
  const header = document.querySelector('.topnav');
  if (!header) return;
  const toggle = header.querySelector('.mobile-menu-toggle');
  const menu = header.querySelector('#site-menu');
  if (!toggle || !menu) return;
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open site menu');
    menu.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close site menu' : 'Open site menu');
    menu.classList.toggle('is-open', open);
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      toggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 801px)').matches) closeMenu();
  });
})();
