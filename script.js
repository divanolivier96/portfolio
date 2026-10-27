(() => {
  const hero = document.querySelector('.hero');
  const photo = document.querySelector('.hero-photo');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep the portrait's subtle parallax interaction.
  if (hero && photo && finePointer && !reducedMotion) {
    let frame = 0;
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      hero.style.setProperty('--pointer-x', (x * 100).toFixed(2) + '%');
      hero.style.setProperty('--pointer-y', (y * 100).toFixed(2) + '%');
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        photo.style.transform = 'translate3d(' + ((x - .5) * -12).toFixed(2) + 'px,' + ((y - .5) * -8).toFixed(2) + 'px,0) scale(1.015)';
        hero.classList.add('is-interacting');
      });
    });
    hero.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      photo.style.transform = '';
      hero.style.setProperty('--pointer-x', '50%');
      hero.style.setProperty('--pointer-y', '50%');
      hero.classList.remove('is-interacting');
    });
  }

  // Custom difference-blend spotlight and triangular pointer for desktop mice.
  if (!finePointer || reducedMotion || window.matchMedia('(max-width: 800px)').matches) return;
  const spot = document.createElement('div');
  const triangle = document.createElement('div');
  spot.className = 'difference-spot';
  triangle.className = 'triangle-cursor';
  spot.setAttribute('aria-hidden', 'true');
  triangle.setAttribute('aria-hidden', 'true');
  document.body.append(spot, triangle);
  document.body.classList.add('has-custom-cursor');

  let pointerX = -100;
  let pointerY = -100;
  const controls = 'a, button, input, select, textarea, [role="button"], .pill, .topnav nav a';

  window.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    spot.style.left = pointerX + 'px';
    spot.style.top = pointerY + 'px';
    triangle.style.left = pointerX + 'px';
    triangle.style.top = pointerY + 'px';
    const target = event.target instanceof Element ? event.target.closest(controls) : null;
    triangle.classList.toggle('is-over-control', Boolean(target));
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    spot.style.opacity = '0';
    triangle.style.opacity = '0';
  });
  window.addEventListener('pointerenter', () => {
    spot.style.opacity = '';
    triangle.style.opacity = '';
  });
})();