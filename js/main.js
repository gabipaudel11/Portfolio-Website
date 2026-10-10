const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (min-width: 861px)').matches;
const hasGsap = window.gsap && window.ScrollTrigger;

/* ---------- data ---------- */
const R = 'assets/reports/';
const pages = (key, file, title, list) => list.map(s => {
  const [p, ...rest] = s.split(' ');
  return { src: `${R}${file}-${p}.jpg`, cap: `${title} · ${rest.join(' ')}` };
});
const galleries = {
  lcoy26: pages('lcoy26', 'lcoy26', 'LCOY Nepal 2026', ['p1 Cover', 'p2 Contents', 'p8 Delegate profile', 'p10 Consultation map', 'p20 Programme', 'p39 Partners', 'p42 Statement page', 'p43 Back cover']),
  lcoy24: pages('lcoy24', 'lcoy24', 'LCOY Nepal 2024', ['p1 Cover', 'p2 Contents', 'p9 Delegate profile', 'p20 Group work', 'p36 Organising team', 'p38 Media partners']),
  sacjc: pages('sacjc', 'sacjc25', 'South Asian Climate Justice Camp 2025', ['p1 Cover', 'p5 Sessions', 'p6 Sessions', 'p13 Cultural exchange', 'p16 Partners']),
  statement: pages('statement', 'statement26', 'Youth Statement on Climate Change 2026', ['p1 Cover', 'p3 Contents', 'p4 Acknowledgement']),
};
const work = [
  ['climate-champions', 'Climate Champions', 'Open call'],
  ['climate-strike', 'Global Climate Strike', 'Protest poster'],
  ['lcoy-2024', 'LCOY Nepal 2024', 'Event teaser'],
  ['team-announcement', 'Team leads', 'Announcement'],
  ['art-competition', 'Earth Day art competition', 'Open call'],
  ['stakeholder', 'Stakeholder meeting', 'Event'],
  ['cleanup-program', 'River clean-up', 'Nepali, print'],
  ['hiring', 'EcoTracker hiring', 'Recruitment'],
  ['online-webinar', 'School eco clubs', 'Webinar'],
  ['negotiation', 'Negotiation training', 'Save the date'],
  ['sacjc', 'SACJC report launch', 'Announcement'],
  ['post-cop', 'Post COP 29', 'Event banner'],
];
galleries.work = work.map(([f, t, k]) => ({ src: `assets/work/${f}.jpg`, cap: `${t} · ${k}` }));

document.getElementById('poster-grid').innerHTML = work.map(([f, t, k], i) => `
  <figure class="poster" data-gallery="work" data-index="${i}" tabindex="0" role="button" aria-label="View ${t}">
    <div class="poster__img"><img loading="lazy" src="assets/work/thumb/${f}.jpg" alt="${t}, ${k.toLowerCase()}"></div>
    <figcaption class="mono"><span>${t}</span><span>${k}</span></figcaption>
  </figure>`).join('');

/* ---------- lightbox ---------- */
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lb-img'), lbCap = document.getElementById('lb-cap');
let cur = [], idx = 0, opener = null;
const show = () => { const g = cur[idx]; lbImg.src = g.src; lbImg.alt = g.cap; lbCap.textContent = `${g.cap}  —  ${idx + 1}/${cur.length}`; };
const step = d => { idx = (idx + d + cur.length) % cur.length; show(); };
const open = el => { cur = galleries[el.dataset.gallery]; idx = +(el.dataset.index || 0); opener = el; show(); lb.showModal(); lenis && lenis.stop(); };
document.addEventListener('click', e => { const el = e.target.closest('[data-gallery]'); if (el) open(el); });
document.addEventListener('keydown', e => {
  if (lb.open) { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); return; }
  const el = e.target.closest && e.target.closest('[data-gallery]'); if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(el); }
});
document.querySelectorAll('.index__row').forEach(r => { r.tabIndex = 0; r.setAttribute('role', 'button'); });
lb.querySelector('.lb__close').onclick = () => lb.close();
lb.querySelector('.lb__prev').onclick = () => step(-1);
lb.querySelector('.lb__next').onclick = () => step(1);
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
lb.addEventListener('close', () => { lenis && lenis.start(); opener && opener.focus && opener.focus(); });

/* ---------- clock ---------- */
const clock = document.getElementById('clock');
const tick = () => clock.textContent = 'Bharatpur ' + new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit' });
tick(); setInterval(tick, 30000);

/* ---------- smooth scroll ---------- */
let lenis = null;
if (!reduce && window.Lenis) {
  lenis = new Lenis({ lerp: 0.09 });
  if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.4 }); }
  }));
}

/* ---------- cursor, peek, magnetic ---------- */
if (fine && !reduce) {
  const c = document.querySelector('.cursor'), peek = document.querySelector('.peek'), pImg = peek.querySelector('img');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, px = x, py = y;
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * .22; cy += (y - cy) * .22; px += (x - px) * .1; py += (y - py) * .1;
    c.style.transform = `translate(${cx}px,${cy}px)`;
    peek.style.left = px + 'px'; peek.style.top = py + 'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    const g = e.target.closest('[data-gallery]'), l = e.target.closest('a,button');
    c.classList.toggle('is-view', !!g); c.classList.toggle('is-link', !g && !!l);
    const row = e.target.closest('[data-peek]');
    if (row) { pImg.src = row.dataset.peek; peek.classList.add('is-on'); } else peek.classList.remove('is-on');
  });
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${dx * .25}px,${dy * .35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; el.style.transform = ''; setTimeout(() => el.style.transition = '', 600); });
  });
}

/* ---------- split text into words ---------- */
document.querySelectorAll('.split').forEach(el => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="line" style="display:inline-block;vertical-align:top"><span class="word">${w}</span></span>`).join(' ');
});

/* ---------- animations ---------- */
const counters = () => document.querySelectorAll('[data-count]').forEach(el => {
  const end = +el.dataset.count;
  if (reduce || !hasGsap) { el.textContent = end; return; }
  const o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) }) });
});

const loader = document.querySelector('.loader');
if (!hasGsap || reduce) { loader.remove(); counters(); }
else {
  gsap.registerPlugin(ScrollTrigger);
  lenis && lenis.stop();
  const num = loader.querySelector('b'), o = { v: 0 };
  gsap.set('.hero__title .word', { yPercent: 110 });
  gsap.set('.hero__portrait', { scaleX: 0 });
  gsap.set(['.hero__top', '.hero__bottom', '.nav'], { opacity: 0 });
  gsap.timeline()
    .from('.loader__name span > *', { yPercent: 110, duration: 1, stagger: .1, ease: 'expo.out' })
    .to(o, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => num.textContent = Math.round(o.v) }, 0)
    .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '+=.1')
    .to('.hero__title .word', { yPercent: 0, duration: 1.3, stagger: .12, ease: 'expo.out' }, '-=.55')
    .to('.hero__portrait', { scaleX: 1, duration: 1.2, ease: 'expo.out' }, '-=.9')
    .to(['.nav', '.hero__top', '.hero__bottom'], { opacity: 1, duration: .8, stagger: .1 }, '-=.9')
    .add(() => { loader.remove(); lenis && lenis.start(); });

  // hero drifts on scroll
  gsap.to('.hero__portrait img', { scale: 1.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // section titles and split paragraphs rise word by word
  document.querySelectorAll('.split:not(.hero__intro)').forEach(el => {
    gsap.from(el.querySelectorAll('.word'), { yPercent: 110, duration: 1.1, stagger: .025, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.from('.hero__intro .word', { opacity: 0, y: 12, duration: .8, stagger: .015, delay: 2.6 });

  // index rows
  gsap.utils.toArray('.index__row, .roles li').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));

  // horizontal case study
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      const track = document.querySelector('.case__track');
      const dist = () => track.scrollWidth - (innerWidth - track.getBoundingClientRect().left) + 40;
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.case', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
    }
  });

  // posters: reveal + parallax
  gsap.utils.toArray('.poster').forEach((p, i) => {
    gsap.from(p.querySelector('.poster__img'), { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 90%' } });
    if (innerWidth > 760) gsap.to(p.querySelector('img'), { yPercent: -6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // about image parallax
  gsap.to('.about__img img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });

  // contact
  gsap.from('.contact__big .word', { yPercent: 110, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 75%' } });

  counters();
  addEventListener('load', () => ScrollTrigger.refresh());
}
