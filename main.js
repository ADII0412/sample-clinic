/* LUMEN DENTAL — sample site interactions
   Header state, mobile nav, scroll reveals, counters, slider, FAQ, form. */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Sticky header ---------- */
  const header = $(".site-header");
  const onScroll = () =>
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = $(".nav-toggle");
  const links = $("#nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", links).forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = $$("[data-reveal]");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.revealDelay || 0);
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");

  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    if (reducedMotion) {
      el.textContent = target.toLocaleString("en-US");
      return;
    }
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Testimonials slider ---------- */
  const track = $("#slider-track");
  const dotsWrap = $("#slider-dots");

  if (track && dotsWrap) {
    const slides = $$(".quote-card", track);
    let index = 0;
    let autoTimer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Show review ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });

    const dots = $$(".slider-dot", dotsWrap);

    const goTo = (i, manual = false) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
      if (manual) restartAuto();
    };

    const restartAuto = () => {
      clearInterval(autoTimer);
      if (!reducedMotion) {
        autoTimer = setInterval(() => goTo(index + 1), 6500);
      }
    };

    $("#slider-prev").addEventListener("click", () => goTo(index - 1, true));
    $("#slider-next").addEventListener("click", () => goTo(index + 1, true));
    track.addEventListener("mouseenter", () => clearInterval(autoTimer));
    track.addEventListener("mouseleave", restartAuto);
    restartAuto();
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach((item) => {
    const btn = $(".faq-q", item);
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Booking form ---------- */
  const form = $("#booking-form");
  const note = $("#form-note");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const bad = (sel) => {
        const el = $(sel, form);
        return !el.checkValidity() && el;
      };

      let invalid = null;
      if (!name) invalid = "input[name='name']";
      else if (!phone) invalid = "input[name='phone']";

      if (invalid) {
        note.textContent =
          invalid === "input[name='name']"
            ? "Please add your name so we know who to call back."
            : "Please add a phone number so we can confirm your slot.";
        note.classList.add("is-error");
        $(invalid, form).focus();
        return;
      }

      note.classList.remove("is-error");
      note.textContent = `Request received, ${name} — we'll call you within one business day to confirm a time.`;
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
