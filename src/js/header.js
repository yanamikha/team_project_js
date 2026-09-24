function initHeader() {
  const burgerBtn = document.querySelector('.header__burger');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!burgerBtn || !closeBtn || !mobileMenu) {
    return;
  }

  const anchorLinks = document.querySelectorAll('.header a[href^="#"]');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    document.body.classList.add('is-menu-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('is-menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  burgerBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  anchorLinks.forEach(link => {
    link.addEventListener('click', event => {
      const targetSection = document.querySelector(link.getAttribute('href'));

      if (!targetSection) {
        return;
      }

      event.preventDefault();
      closeMenu();

      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
}

initHeader();
