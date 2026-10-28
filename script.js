/* Branded welcome intro, once per browser session. */
(() => {
  const splash = document.querySelector('.intro-splash');
  if (splash) {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('divanIntroSeen') === '1';
      if (!alreadySeen) sessionStorage.setItem('divanIntroSeen', '1');
    } catch (_) {}

    if (alreadySeen) {
      splash.remove();
    } else {
      window.setTimeout(() => {
        splash.classList.add('is-exiting');
        window.setTimeout(() => splash.remove(), 700);
      }, 2850);
    }
  }
})();

/* Lightweight adaptive cursor: difference blending inverts its appearance against each background. */
(() => {
  if (!window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches) return;

  const cursor = document.createElement('img');
  cursor.className = 'inverting-cursor';
  cursor.src = 'logo-icon.svg';
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
