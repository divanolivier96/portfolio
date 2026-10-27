(() => {
  const hero = document.querySelector('.hero');
  const photo = document.querySelector('.hero-photo');
  if (!hero || !photo) return;

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  let frame = 0;
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    hero.style.setProperty('--pointer-x', (x * 100).toFixed(2) + '%');
    hero.style.setProperty('--pointer-y', (y * 100).toFixed(2) + '%');

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const moveX = (x - 0.5) * -12;
      const moveY = (y - 0.5) * -8;
      photo.style.transform = 'translate3d(' + moveX.toFixed(2) + 'px,' + moveY.toFixed(2) + 'px,0) scale(1.015)';
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
})();