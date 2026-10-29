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
      splash.innerHTML = '<div class="intro-splash-content"><img src="logo-icon.svg?v=spin3" alt="" class="intro-splash-logo"><p>Welcome</p></div>';
      document.body.prepend(splash);
    }

    window.clearTimeout(splashTimer);
    window.clearTimeout(removeTimer);
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

/* Optional site-wide palette preview, reversible at any time. */
(() => {
  const key = 'divan-palette-study';
  let useIndigo = false;
  try { useIndigo = localStorage.getItem(key) === 'indigo'; } catch (_) {}
  if (useIndigo) document.body.classList.add('palette-indigo');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'palette-toggle';
  toggle.setAttribute('aria-pressed', String(useIndigo));
  toggle.innerHTML = '<span class="palette-toggle-swatch" aria-hidden="true"></span><span class="palette-toggle-label"></span>';
  const label = toggle.querySelector('.palette-toggle-label');
  function render() {
    label.textContent = useIndigo ? 'Return to original colours' : 'Preview indigo palette';
    toggle.setAttribute('aria-pressed', String(useIndigo));
    toggle.setAttribute('aria-label', label.textContent);
  }
  render();
  toggle.addEventListener('click', () => {
    useIndigo = !useIndigo;
    document.body.classList.toggle('palette-indigo', useIndigo);
    try { localStorage.setItem(key, useIndigo ? 'indigo' : 'original'); } catch (_) {}
    render();
  });
  document.body.appendChild(toggle);
})();
