(() => {
  const EMAIL = 'info@tipsymonkey.com';
  // Paste Gary's IMDb profile URL here; every [data-imdb] link picks it up.
  const IMDB_URL = '';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = [...document.querySelectorAll('.nav__list a')];

  // Header turns solid once the page scrolls.
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hero parallax: the photo drifts down at 40% of the scroll speed and zooms in
  // a little, while the copy lifts and fades. Where the browser has scroll-driven
  // animations, CSS does this on the compositor so it never lags the page. This
  // function is the fallback for browsers without them.
  // Griffin wanted all of this visible on his PC, which reports reduced motion,
  // so it runs either way.
  const hero = document.querySelector('.hero');
  const heroMedia = document.querySelector('.hero__media');
  const heroContent = document.querySelector('.hero__content');
  const cssParallax = window.CSS && CSS.supports('animation-timeline: view()');
  const drift = () => {
    if (cssParallax || !hero || !heroMedia) return;
    const h = hero.offsetHeight;
    const y = Math.min(Math.max(window.scrollY, 0), h);
    const p = y / h;
    heroMedia.style.transform = `translate3d(0, ${(y * 0.4).toFixed(1)}px, 0) scale(${(1 + p * 0.12).toFixed(4)})`;
    if (heroContent) {
      heroContent.style.transform = `translate3d(0, ${(y * -0.12).toFixed(1)}px, 0)`;
      heroContent.style.opacity = Math.max(0, 1 - p * 1.1).toFixed(3);
    }
  };
  drift();

  // Smooth scrolling. A mouse wheel moves the page 100px a notch, and with
  // Windows animations off Chrome shows each notch as a jump, parallax included.
  // Wheel input sets a target instead. Each frame the page closes part of the
  // gap, sized by the real time since the last frame, so the glide is the same
  // at 60, 120 or 144 Hz. In-page links get an eased glide too. Touch, keyboard
  // and scrollbar stay native, and the scroller just follows them.
  const root = document.documentElement;
  const TAU = 140; // ms for the page to close about 63% of the remaining distance
  let target = window.scrollY;
  let current = target;
  let running = false;
  let lastTime = 0;
  let glide = null; // { from, to, start, duration } for in-page links

  const maxScroll = () => root.scrollHeight - window.innerHeight;
  const clampScroll = y => Math.min(Math.max(y, 0), maxScroll());
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const follow = () => {
    running = false;
    glide = null;
    target = current = window.scrollY;
    drift();
  };

  const frame = now => {
    const dt = Math.min(now - lastTime, 50);
    lastTime = now;
    // Something else moved the page mid-glide (scrollbar, keys, find): let it win.
    if (Math.abs(window.scrollY - current) > 2) return follow();
    if (glide) {
      const t = Math.min((now - glide.start) / glide.duration, 1);
      current = glide.from + (glide.to - glide.from) * ease(t);
      if (t === 1) {
        glide = null;
        target = current;
      }
    } else {
      current += (target - current) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(target - current) < 0.5) current = target;
    }
    window.scrollTo(0, current);
    drift();
    if (glide || current !== target) requestAnimationFrame(frame);
    else running = false;
  };

  const run = () => {
    if (running) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(frame);
  };

  // A textarea or other scroll box under the pointer that can still move gets the wheel.
  const scrollsInside = (el, dy) => {
    for (; el && el !== document.body && el !== root; el = el.parentElement) {
      if (!/(auto|scroll)/.test(getComputedStyle(el).overflowY) || el.scrollHeight <= el.clientHeight) continue;
      if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
    }
    return false;
  };

  window.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (scrollsInside(e.target, e.deltaY)) return;
    e.preventDefault();
    if (!running) target = current = window.scrollY;
    glide = null;
    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
    target = clampScroll(target + e.deltaY * unit);
    run();
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (!running) follow();
  }, { passive: true });
  window.addEventListener('resize', drift);

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const hash = link.getAttribute('href');
    if (hash === '#') return;
    const dest = document.querySelector(hash);
    if (!dest) return;
    e.preventDefault();
    const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const to = dest === header ? 0 : clampScroll(dest.getBoundingClientRect().top + window.scrollY - pad);
    const from = window.scrollY;
    history.pushState(null, '', hash);
    if (!dest.matches('a, button, input, select, textarea, [tabindex]')) dest.setAttribute('tabindex', '-1');
    dest.focus({ preventScroll: true });
    if (Math.abs(to - from) < 1) return;
    current = from;
    target = to;
    glide = { from, to, start: performance.now(), duration: Math.min(Math.max(Math.abs(to - from) * 0.45, 450), 1200) };
    run();
  });

  // Mobile menu.
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  navLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // Highlight the nav link for the section in view.
  const sections = navLinks
    .map(a => a.getAttribute('href'))
    .filter(h => h.startsWith('#') && h.length > 1)
    .map(h => document.querySelector(h))
    .filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        if (!a.classList.contains('btn')) a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  // The hero has no id, so reaching it clears every link.
  [document.querySelector('.hero'), ...sections].forEach(s => s && spy.observe(s));

  // Scroll reveal, staggered within each group.
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const seen = new Map();
    reveals.forEach(el => {
      const i = seen.get(el.parentElement) || 0;
      seen.set(el.parentElement, i + 1);
      el.style.setProperty('--d', Math.min(i * 80, 400) + 'ms');
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // Running timecode in the hero viewfinder, 24 fps from 01:00:00:00. Changing
  // digits are not motion, so it runs even when reduced motion is set.
  const tc = document.getElementById('timecode');
  if (tc) {
    const FPS = 24;
    const t0 = performance.now();
    let last = -1;
    const pad = n => String(n).padStart(2, '0');
    const tick = now => {
      const frames = FPS * 3600 + Math.floor((now - t0) * FPS / 1000);
      if (frames !== last) {
        last = frames;
        const s = Math.floor(frames / FPS);
        tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frames % FPS)}`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Service cards open and close their description.
  document.querySelectorAll('.service__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.closest('.service').classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Founder photos fall back to initials until the real files are in assets/team/.
  document.querySelectorAll('.portrait img').forEach(img => {
    const fail = () => img.closest('.portrait').classList.add('no-photo');
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener('error', fail, { once: true });
  });

  // IMDb links stay hidden until the URL is set.
  document.querySelectorAll('[data-imdb]').forEach(a => {
    if (IMDB_URL) {
      a.href = IMDB_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.closest('li, .founder__links').hidden = true;
    }
  });

  // Copy the email address.
  document.querySelectorAll('[data-copy]').forEach(btn => {
    const label = btn.querySelector('span');
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = Object.assign(document.createElement('textarea'), { value: text });
        document.body.append(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      label.textContent = 'Copied';
      setTimeout(() => { label.textContent = 'Copy'; }, 1800);
    });
  });

  // Inquiry form: no server, so it hands a filled-in message to the visitor's email app.
  const form = document.getElementById('inquiry');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      Object.keys(data).forEach(k => { data[k] = String(data[k]).trim(); });

      let firstBad = null;
      form.querySelectorAll('[required]').forEach(input => {
        const bad = !input.value.trim() || (input.type === 'email' && !input.checkValidity());
        input.closest('.field').classList.toggle('is-invalid', bad);
        input.setAttribute('aria-invalid', String(bad));
        if (bad && !firstBad) firstBad = input;
      });
      if (firstBad) {
        status.textContent = 'Please add your name, a valid email and a few words about the project.';
        firstBad.focus();
        return;
      }

      const lines = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.company && `Production company: ${data.company}`,
        data.type && `Production type: ${data.type}`,
        data.where && `Locations: ${data.where}`,
        data.dates && `Estimated shoot dates: ${data.dates}`,
      ].filter(Boolean);
      const body = `${lines.join('\n')}\n\n${data.message}`;
      const subject = `Production inquiry${data.company ? ': ' + data.company : ` from ${data.name}`}`;

      const link = Object.assign(document.createElement('a'), {
        href: `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      });
      document.body.append(link);
      link.click();
      link.remove();
      status.textContent = `Your email app should open with the message ready to send. If it does not, write to ${EMAIL}.`;
    });

    form.addEventListener('input', e => {
      const field = e.target.closest('.field');
      if (field && field.classList.contains('is-invalid') && e.target.value.trim()) {
        field.classList.remove('is-invalid');
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
