const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const year = document.querySelector('[data-year]');

if (year) year.textContent = new Date().getFullYear();
if (navigation && !navigation.id) navigation.id = 'site-nav';

// Case studies belong to the Work area; expose that context to assistive technology.
if (document.body.classList.contains('case-page') && navigation) {
  const workLink = navigation.querySelector('a[href*="#work"]');
  const aboutLink = navigation.querySelector('a[href$="#about"]');
  if (workLink) workLink.setAttribute('aria-current', 'page');
  if (aboutLink) aboutLink.href = '../about.html';
}

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}


const indicator = document.querySelector('.project-indicator');
const brandLockup = document.querySelector('.brand-lockup');
const logoLink = brandLockup?.querySelector('.site-logo');
const projectCards = document.querySelectorAll('.project-card[data-indicator-color]');
const defaultIndicatorColor = '#b8b8b2';

if (indicator) {
  indicator.style.setProperty('--indicator-color', defaultIndicatorColor);
  indicator.addEventListener('animationend', event => {
    if (event.animationName === 'indicator-intro') {
      indicator.classList.add('has-intro-complete');
    }
  }, { once: true });
}

if (brandLockup && logoLink) {
  const setLogoActive = () => brandLockup.classList.add('is-logo-active');
  const unsetLogoActive = () => brandLockup.classList.remove('is-logo-active');

  logoLink.addEventListener('mouseenter', setLogoActive);
  logoLink.addEventListener('mouseleave', unsetLogoActive);
  logoLink.addEventListener('focus', setLogoActive);
  logoLink.addEventListener('blur', unsetLogoActive);
}

if (indicator && projectCards.length) {
  const activateIndicator = card => {
    const color = card.dataset.indicatorColor || defaultIndicatorColor;
    indicator.style.setProperty('--indicator-color', color);
    indicator.classList.add('is-project-active');
  };

  const resetIndicator = () => {
    indicator.style.setProperty('--indicator-color', defaultIndicatorColor);
    indicator.classList.remove('is-project-active');
  };

  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => activateIndicator(card));
    card.addEventListener('mouseleave', resetIndicator);
    card.addEventListener('focusin', () => activateIndicator(card));
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) resetIndicator();
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}
