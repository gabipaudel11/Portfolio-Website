const R = 'assets/reports/';
const galleries = {
  lcoy26: ['p1 Cover', 'p2 Contents', 'p8 Participant profile', 'p10 Consultation process', 'p20 Programme spread', 'p39 Partners', 'p42 Statement promo', 'p43 Closing page']
    .map(s => ({ src: `${R}lcoy26-${s.split(' ')[0]}.jpg`, cap: `LCOY Nepal 2026 Event Report — ${s.slice(s.indexOf(' ') + 1)}` })),
  lcoy24: ['p1 Cover', 'p2 Contents', 'p9 Delegate demographics', 'p20 Group workshop', 'p36 Organising team', 'p38 Media partners']
    .map(s => ({ src: `${R}lcoy24-${s.split(' ')[0]}.jpg`, cap: `LCOY Nepal 2024 Event Report — ${s.slice(s.indexOf(' ') + 1)}` })),
  sacjc: ['p1 Cover', 'p5 Sessions', 'p6 Sessions', 'p13 Cultural exchange', 'p16 Partners']
    .map(s => ({ src: `${R}sacjc25-${s.split(' ')[0]}.jpg`, cap: `South Asian Climate Justice Camp 2025 — ${s.slice(s.indexOf(' ') + 1)}` })),
  statement: ['p1 Cover', 'p3 Contents', 'p4 Acknowledgement']
    .map(s => ({ src: `${R}statement26-${s.split(' ')[0]}.jpg`, cap: `National Children & Youth Statement 2026 — ${s.slice(s.indexOf(' ') + 1)}` })),
};

const work = [
  ['climate-champions', 'National Climate Champions', 'Call for applications · Harin Nepal, YASEN & partners', 'campaign', 'Call for National Climate Champions poster with a magenta-to-teal gradient over a youth climate march photo'],
  ['lcoy-2024', 'LCOY Nepal 2024 — countdown', 'Event teaser · LCOY Nepal', 'event', 'Green LCOY Nepal 2024 teaser with orange and white headline type'],
  ['climate-strike', 'Global Climate Strike', 'Silent demonstration · YASEN, Bharatpur', 'campaign', 'Global Climate Strike poster in green duotone with an orange slogan banner'],
  ['team-announcement', 'Meet the team leads', 'Team announcement · YASEN', 'announce', 'Team leads announcement with four cut-out portraits on green'],
  ['stakeholder', 'Stakeholders consultation', 'Event poster · YASEN & partners, Kathmandu', 'event', 'Stakeholders consultation and networking meeting poster in green'],
  ['earth-day', 'Earth Day Open Art Competition', 'Competition call · YASEN & Animal Nepal', 'campaign', 'Earth Day art competition poster with globe illustration and bold green type', 'art-competition'],
  ['online-webinar', 'Climate education webinar', 'Speaker card · Sustainable Schools Movement', 'event', 'Blue and yellow webinar poster featuring speaker Pradeep Rijal'],
  ['hiring', 'We’re hiring — EcoTracker Nepal', 'Recruitment post · EcoTracker Nepal', 'announce', 'Mint green hiring post with megaphone illustration and QR code'],
  ['cleanup-program', 'River-side clean-up (Nepali)', 'Bilingual community event · Bharatpur', 'event', 'Nepali-language river clean-up poster with watercolour illustration'],
  ['negotiation', 'Climate negotiation training', 'Save the date · YASEN, funded by YECAP', 'event', 'Climate change negotiation training save-the-date with calendar graphic'],
  ['sacjc', 'SACJC 2025 — report launch', 'Report announcement · South Asian Climate Justice Camp', 'announce', 'Event report is here announcement showing the SACJC report cover'],
  ['post-cop', 'Post COP 29 sharing', 'Event banner · YASEN, FAO, UNICEF & partners', 'event', 'Teal Post COP 29 banner with an illustrated crowd of activists'],
].map(([id, title, sub, cat, alt, file]) => ({ file: file || id, title, sub, cat, alt }));

galleries.work = work.map(w => ({ src: `assets/work/${w.file}.jpg`, cap: `${w.title} — ${w.sub}` }));

// render campaign grid
const grid = document.getElementById('work-grid');
grid.innerHTML = work.map((w, i) => `
  <li data-cat="${w.cat}" class="reveal">
    <button class="card zoom" data-gallery="work" data-index="${i}">
      <img loading="lazy" src="assets/work/thumb/${w.file}.jpg" alt="${w.alt}">
      <h3>${w.title}</h3><p>${w.sub}</p>
    </button>
  </li>`).join('');

// filters
document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(c => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
  const f = chip.dataset.filter;
  grid.querySelectorAll('li').forEach(li => { li.hidden = f !== 'all' && li.dataset.cat !== f; });
}));

// lightbox
const lb = document.getElementById('lightbox'), img = document.getElementById('lb-img'), cap = document.getElementById('lb-cap');
let cur = [], idx = 0, opener = null;
const show = () => { const g = cur[idx]; img.src = g.src; img.alt = g.cap; cap.textContent = `${g.cap}  ·  ${idx + 1} / ${cur.length}`; };
const step = d => { idx = (idx + d + cur.length) % cur.length; show(); };
document.addEventListener('click', e => {
  const z = e.target.closest('.zoom'); if (!z) return;
  cur = galleries[z.dataset.gallery]; idx = +z.dataset.index; opener = z; show(); lb.showModal();
});
lb.querySelector('.lb__close').onclick = () => lb.close();
lb.querySelector('.lb__prev').onclick = () => step(-1);
lb.querySelector('.lb__next').onclick = () => step(1);
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
lb.addEventListener('close', () => opener && opener.focus());
document.addEventListener('keydown', e => { if (!lb.open) return; if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });

// nav border + reveal
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('is-scrolled', scrollY > 8), { passive: true });
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
