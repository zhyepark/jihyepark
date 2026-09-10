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


const brandLockup = document.querySelector('.brand-lockup');
const logo = brandLockup?.querySelector('.site-logo');
const orb = brandLockup?.querySelector('.cursor-orb');
const projectCards = document.querySelectorAll('.project-card[data-orb-color]');
const defaultOrbColor = '#B8B8B2';
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
let orbFrame = null;
let orbX = 0;
let orbY = 0;

const setOrbColor = color => {
  orb?.style.setProperty('--orb-color', color || defaultOrbColor);
};

const setOrbOffset = (x = 0, y = 0) => {
  if (!orb) return;
  orb.style.setProperty('--orb-x', `${x.toFixed(2)}px`);
  orb.style.setProperty('--orb-y', `${y.toFixed(2)}px`);
};

const scheduleOrbOffset = (x, y) => {
  orbX = x;
  orbY = y;
  if (orbFrame) return;
  orbFrame = window.requestAnimationFrame(() => {
    setOrbOffset(orbX, orbY);
    orbFrame = null;
  });
};

const activateProjectOrb = card => {
  setOrbColor(card.dataset.orbColor);
  orb?.classList.add('is-project-active');
};

const resetProjectOrb = () => {
  setOrbColor(defaultOrbColor);
  orb?.classList.remove('is-project-active');
};

if (orb) setOrbColor(defaultOrbColor);

if (brandLockup && logo) {
  const setLogoActive = () => brandLockup.classList.add('is-logo-active');
  const unsetLogoActive = () => brandLockup.classList.remove('is-logo-active');

  logo.addEventListener('mouseenter', setLogoActive);
  logo.addEventListener('mouseleave', unsetLogoActive);
  logo.addEventListener('focus', setLogoActive);
  logo.addEventListener('blur', unsetLogoActive);

  const canTrackPointer = () => !reducedMotionQuery.matches && !coarsePointerQuery.matches;

  brandLockup.addEventListener('pointermove', event => {
    if (!canTrackPointer()) return;
    const rect = brandLockup.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
    scheduleOrbOffset(Math.max(-3, Math.min(3, x)), Math.max(-3, Math.min(3, y)));
  });

  brandLockup.addEventListener('pointerleave', () => {
    if (orbFrame) {
      window.cancelAnimationFrame(orbFrame);
      orbFrame = null;
    }
    setOrbOffset(0, 0);
  });

  reducedMotionQuery.addEventListener?.('change', event => {
    if (event.matches) setOrbOffset(0, 0);
  });
}

if (orb && projectCards.length) {
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => activateProjectOrb(card));
    card.addEventListener('mouseleave', resetProjectOrb);
    card.addEventListener('focusin', () => activateProjectOrb(card));
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) resetProjectOrb();
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
