'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 961px)');

/* ---------- header: menu, scrolled state, hide on scroll down ---------- */
const header = $('#header');
const menu = $('.menu');
const nav = $('#navigation');

function setMenu(open) {
  nav.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  document.body.classList.toggle('no-scroll', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', translate(open ? 'Zatvori izbornik' : 'Otvori izbornik'));
}
const closeMenu = () => { if (nav.classList.contains('open')) setMenu(false); };

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
});
desktop.addEventListener('change', closeMenu);

let lastY = scrollY;
function updateHeader() {
  const y = scrollY;
  header.classList.toggle('is-scrolled', y > 24);
  const goingDown = y > lastY && y > 400;
  header.classList.toggle('is-hidden', goingDown && !nav.classList.contains('open') && !header.contains(document.activeElement));
  lastY = y;
}

/* ---------- hero: frame grows to full width as the page scrolls ---------- */
const heroFrame = $('.hero-frame');
function updateHero() {
  if (reducedMotion.matches) { heroFrame.style.setProperty('--p', 1); return; }
  const rect = heroFrame.getBoundingClientRect();
  const progress = Math.min(Math.max(1 - rect.top / (innerHeight * .75), 0), 1);
  heroFrame.style.setProperty('--p', progress.toFixed(4));
}

/* ---------- rAF-batched scroll work ---------- */
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateHeader(); updateHero(); ticking = false; });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll, { passive: true });
updateHeader();
updateHero();

/* ---------- reveal on scroll ---------- */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.fact').forEach((fact, index) => fact.style.setProperty('--delay', index * 90 + 'ms'));
  $$('[data-reveal], .facts').forEach(el => revealObserver.observe(el));
} else {
  $$('[data-reveal], .facts').forEach(el => el.classList.add('is-visible'));
}

/* ---------- a day at the villa: sticky image follows the active step ---------- */
const daySteps = $$('.day-step');
const dayImages = $$('.day-frame img');
const dayClock = $('.day-clock-time');
let activeStep = 0;

function setStep(index) {
  if (index === activeStep) return;
  activeStep = index;
  daySteps.forEach((step, i) => step.classList.toggle('is-active', i === index));
  dayImages.forEach((image, i) => image.classList.toggle('is-active', i === index));
  dayClock.textContent = daySteps[index].dataset.time;
}

if ('IntersectionObserver' in window) {
  const stepObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) setStep(daySteps.indexOf(entry.target));
  }), { rootMargin: '-45% 0px -45% 0px' });
  daySteps.forEach(step => stepObserver.observe(step));
}

/* ---------- gallery rail: buttons, progress, drag to scroll ---------- */
const rail = $('.rail');
const railProgress = $('.rail-progress span');
const [railPrev, railNext] = $$('[data-rail]');

function updateRail() {
  const max = rail.scrollWidth - rail.clientWidth;
  const ratio = max > 0 ? rail.scrollLeft / max : 1;
  const visible = max > 0 ? rail.clientWidth / rail.scrollWidth : 1;
  railProgress.style.setProperty('--progress', Math.min(visible + ratio * (1 - visible), 1).toFixed(4));
  railPrev.disabled = rail.scrollLeft <= 2;
  railNext.disabled = rail.scrollLeft >= max - 2;
}

function scrollRail(direction) {
  const items = $$('.rail-item', rail);
  const railLeft = rail.getBoundingClientRect().left;
  const gutter = parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0;
  const offsets = items.map(item => item.getBoundingClientRect().left - railLeft - gutter);
  const target = direction > 0 ? offsets.find(offset => offset > 4) : offsets.filter(offset => offset < -4).pop();
  if (target !== undefined) rail.scrollBy({ left: target, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

$$('[data-rail]').forEach(button => button.addEventListener('click', () => scrollRail(Number(button.dataset.rail))));
rail.addEventListener('scroll', () => requestAnimationFrame(updateRail), { passive: true });
addEventListener('resize', updateRail, { passive: true });
rail.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); scrollRail(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); scrollRail(-1); }
});
updateRail();

let drag = null;
rail.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = { x: event.clientX, left: rail.scrollLeft, moved: false };
});
addEventListener('pointermove', event => {
  if (!drag) return;
  const distance = event.clientX - drag.x;
  if (!drag.moved && Math.abs(distance) > 6) { drag.moved = true; rail.classList.add('is-dragging'); }
  if (drag.moved) rail.scrollLeft = drag.left - distance;
});
addEventListener('pointerup', () => {
  if (!drag) return;
  const moved = drag.moved;
  drag = null;
  if (!moved) return;
  // Re-enable snapping, then let the browser settle on the nearest photo.
  requestAnimationFrame(() => rail.classList.remove('is-dragging'));
});

/* ---------- lightbox ---------- */
const photos = [
  ['villa-1.avif', 'Villa Marinko · Vaš mali svijet u Istri'],
  ['villa-2.avif', 'Terasa i roštilj u hladu'],
  ['villa-3.avif', 'Bazen okružen mediteranskim zelenilom'],
  ['villa-4.avif', 'Privatni bazen i mediteranski vrt'],
  ['villa-5.avif', 'Kamena kuća uz privatni bazen'],
  ['villa-6.avif', 'Spavaća soba 1 · Bračni krevet i sofa'],
  ['villa-7.avif', 'Spavaća soba 2 · Bračni krevet'],
  ['villa-8.avif', 'Masline, hladovina i vrtni roštilj'],
  ['villa-9.avif', 'Dnevni boravak · Prostor za druženje'],
  ['villa-10.avif', 'Dnevni boravak s izlazom prema vrtu'],
  ['villa-11.avif', 'Dnevni boravak · Vaše mjesto za predah']
];
const dialog = $('#lightbox');
const photo = $('#lightbox-photo');
let currentPhoto = 0;
let galleryTrigger = null;

function showPhoto(index, animate = true) {
  if (animate && !reducedMotion.matches) {
    photo.animate([{ opacity: .2, transform: 'scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  currentPhoto = (index + photos.length) % photos.length;
  const [file, caption] = photos[currentPhoto];
  photo.src = 'assets/' + file;
  photo.alt = translate(caption);
  $('#photo-caption').textContent = translate(caption);
  $('#photo-count').textContent = String(currentPhoto + 1).padStart(2, '0') + ' / ' + String(photos.length).padStart(2, '0');
  // Warm the neighbours so arrow navigation feels instant.
  [1, -1].forEach(step => { new Image().src = 'assets/' + photos[(currentPhoto + step + photos.length) % photos.length][0]; });
}

$$('[data-gallery]').forEach(button => button.addEventListener('click', () => {
  if (rail.classList.contains('is-dragging')) return;
  galleryTrigger = button;
  showPhoto(Number(button.dataset.gallery), false);
  dialog.showModal();
  document.body.classList.add('no-scroll');
}));
$('#close-gallery').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  document.body.classList.remove('no-scroll');
  galleryTrigger?.focus({ preventScroll: true });
});
$('#previous-photo').addEventListener('click', () => showPhoto(currentPhoto - 1));
$('#next-photo').addEventListener('click', () => showPhoto(currentPhoto + 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
});
let touchStart = null;
photo.addEventListener('touchstart', event => { if (event.touches.length === 1) touchStart = event.touches[0].clientX; }, { passive: true });
photo.addEventListener('touchend', event => {
  if (touchStart === null) return;
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 50) showPhoto(currentPhoto + (distance < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });

/* ---------- mobile enquiry button: hidden over the hero and the form ---------- */
if ('IntersectionObserver' in window) {
  const mobileBook = $('.mobile-book');
  let heroVisible = true;
  let bookingVisible = false;
  const sync = () => mobileBook.classList.toggle('hide', heroVisible || bookingVisible);
  sync();
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; sync(); }, { threshold: .15 }).observe($('.hero'));
  new IntersectionObserver(([entry]) => { bookingVisible = entry.isIntersecting; sync(); }, { threshold: .05 }).observe($('#rezervacija'));
}

/* ---------- inquiry form: configure the recipient in contact-config.js ---------- */
const inquiryForm = $('#inquiry-form');
const status = $('#form-status');
let statusKey = '';

function updateStatus(key, error = true) {
  statusKey = key;
  status.textContent = translate(key);
  status.classList.toggle('error', error);
}

function hiddenField(name) {
  let field = inquiryForm.querySelector(`[name="${name}"]`);
  if (!field) {
    field = document.createElement('input');
    field.type = 'hidden';
    field.name = name;
    inquiryForm.append(field);
  }
  return field;
}

inquiryForm.addEventListener('submit', event => {
  const recipient = (window.VILLA_CONTACT?.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    event.preventDefault();
    updateStatus('Obrazac još nije povezan s e-mail adresom. Upit nije poslan.');
    return;
  }
  if (inquiryForm.elements._honey.value) { event.preventDefault(); return; }
  inquiryForm.action = 'https://formsubmit.co/' + encodeURIComponent(recipient);
  hiddenField('_subject').value = 'Villa Marinko — novi upit / new enquiry';
  hiddenField('language').value = document.documentElement.lang;
  statusKey = '';
  status.textContent = '';
});

/* ---------- language & misc ---------- */
document.addEventListener('languagechange', () => {
  closeMenu();
  menu.setAttribute('aria-label', translate('Otvori izbornik'));
  if (dialog.open) showPhoto(currentPhoto, false);
  if (statusKey) updateStatus(statusKey);
});

$('#year').textContent = new Date().getFullYear();

reducedMotion.addEventListener('change', () => {
  $$('[data-reveal], .facts').forEach(el => el.classList.add('is-visible'));
  updateHero();
});
