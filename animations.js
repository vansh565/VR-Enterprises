/* =====================================================================
   VR Enterprises — motion & interaction layer
   • CSS keyframes handle entrances (hero, reveals, journey, purity ring).
   • This file adds: floating seeds, smart header, scroll progress,
     magnetic buttons, click ripples, 3D product tilt, hero mouse depth,
     and GSAP ScrollTrigger effects (parallax, process timeline progress).
   • Everything is skipped for visitors who prefer reduced motion, and the
     site works normally if GSAP fails to load.
   ===================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const root = document.documentElement;

  /* ---------------------------------------------------------------
     Floating mustard seeds & light particles (decorative)
     --------------------------------------------------------------- */
  function seedFields() {
    // Dark sections without their own ambient layer get one (glows + seeds)
    $$("#factory-video, #distributor").forEach((sec) => {
      if ($(".section-ambient", sec)) return;
      sec.insertAdjacentHTML(
        "afterbegin",
        '<div class="section-ambient" aria-hidden="true"><span class="glow glow-1"></span><span class="glow glow-2"></span><div class="seed-field" data-seeds="9"></div></div>'
      );
    });

    let s = 7; // tiny deterministic random so the layout is stable between visits
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    $$(".seed-field").forEach((field) => {
      const want = parseInt(field.dataset.seeds, 10) || 12;
      const n = Math.max(0, Math.min(30, window.innerWidth < 760 ? Math.ceil(want / 2) : want));
      let html = "";
      for (let i = 0; i < n; i++) {
        const spark = i % 3 === 2;
        const size = spark ? 3 + rnd() * 4 : 5 + rnd() * 7;
        html += `<span class="${spark ? "spark" : "seed"}" style="--x:${(rnd() * 100).toFixed(1)}%;--y:${(rnd() * 100).toFixed(1)}%;--s:${size.toFixed(1)}px;--d:${(10 + rnd() * 12).toFixed(1)}s;--delay:${(-rnd() * 20).toFixed(1)}s;--dx:${(rnd() * 60 - 30).toFixed(0)}px;--dy:${(-40 - rnd() * 80).toFixed(0)}px;--r:${(rnd() * 360).toFixed(0)}deg"></span>`;
      }
      field.innerHTML = html;
    });

    // Pause continuous animations while their section is off-screen (saves battery/CPU)
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.target.classList.toggle("is-paused", !e.isIntersecting))
    );
    $$(".hero, .purity, .section-dark").forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------
     Scroll progress bar + header that hides on scroll down
     --------------------------------------------------------------- */
  function scrollUi() {
    const bar = $("#scrollProgress");
    const header = $("#siteHeader");
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      if (header && !document.body.classList.contains("nav-open")) {
        const goingDown = y > lastY + 4;
        const goingUp = y < lastY - 4;
        if (goingDown && y > 420) header.classList.add("is-tucked");
        else if (goingUp || y < 200) header.classList.remove("is-tucked");
      }
      lastY = y;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    // Keyboard users: always reveal the header when focus moves into it
    if (header) header.addEventListener("focusin", () => header.classList.remove("is-tucked"));
    update();
  }

  /* ---------------------------------------------------------------
     Buttons: click ripple (all devices) + magnetic pull (mouse only)
     --------------------------------------------------------------- */
  function buttons() {
    document.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest(".btn, .chip");
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const ink = document.createElement("span");
      ink.className = "ripple";
      const size = Math.max(r.width, r.height) * 2;
      ink.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(ink);
      ink.addEventListener("animationend", () => ink.remove());
    });

    if (!finePointer) return;
    $$(".hero .btn, .header-cta, .wa-float, .video-play, .split-copy > .btn").forEach((btn) => {
      const strength = btn.classList.contains("video-play") ? 0.35 : 0.22;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.translate = ""));
    });
  }

  /* ---------------------------------------------------------------
     Product cards: 3D tilt, bottle turn and light sheen (mouse only)
     --------------------------------------------------------------- */
  function productTilt() {
    if (!finePointer) return;
    const bind = (card) => {
      if (card.dataset.tilt) return;
      card.dataset.tilt = "1";
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
        card.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
        card.classList.add("is-tilting");
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        ["--rx", "--ry"].forEach((p) => card.style.setProperty(p, "0deg"));
      });
    };
    $$(".product-card").forEach(bind);
  }

  /* ---------------------------------------------------------------
     Hero: bottles follow the mouse at different depths
     --------------------------------------------------------------- */
  function heroDepth() {
    const hero = $(".hero");
    const visual = $(".hero-visual");
    if (!hero || !visual || !finePointer) return;
    let raf = 0;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        visual.style.setProperty("--px", px.toFixed(3));
        visual.style.setProperty("--py", py.toFixed(3));
      });
    });
    hero.addEventListener("pointerleave", () => {
      visual.style.setProperty("--px", "0");
      visual.style.setProperty("--py", "0");
    });
  }

  /* ---------------------------------------------------------------
     Smooth fade when leaving for another page (privacy / terms)
     --------------------------------------------------------------- */
  function pageTransitions() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href$=".html"]');
      if (!a || a.target === "_blank" || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      root.classList.add("is-leaving");
      window.setTimeout(() => (window.location.href = a.href), 260);
    });
    window.addEventListener("pageshow", () => root.classList.remove("is-leaving"));
  }

  /* ---------------------------------------------------------------
     GSAP ScrollTrigger — parallax & scroll-linked process journey
     --------------------------------------------------------------- */
  function gsapScroll() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("gsap-on");
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const k = mobile ? 0.5 : 1; // gentler motion on phones

    // Process timeline (all devices): golden line fills as you scroll; steps light up
    const progress = $(".timeline-progress span");
    if (progress) {
      gsap.fromTo(
        progress,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".timeline-wrap", start: "top 65%", end: "bottom 65%", scrub: 0.4 },
        }
      );
    }
    $$(".timeline-step").forEach((step) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 65%",
        end: "bottom 65%",
        toggleClass: { targets: step, className: "is-active" },
      })
    );

    // Keep trigger positions correct when the layout changes
    document.addEventListener("vr:layout", () => ScrollTrigger.refresh());

    // Phones stop here: decorative parallax is desktop-only (saves CPU and battery)
    if (mobile) return;

    // Hero: copy and visual drift apart as you scroll away
    gsap.to(".hero-copy", {
      y: 80 * k,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-visual", {
      y: -60 * k,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Process images: gentle zoom-out + parallax inside their frames
    $$(".timeline-media img").forEach((img) => {
      gsap.fromTo(
        img,
        { scale: 1.18, yPercent: -6 * k },
        {
          scale: 1.02,
          yPercent: 6 * k,
          ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });

    // About: layered images move at different speeds
    gsap.to(".about-img-main", {
      y: -30 * k,
      ease: "none",
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".about-img-inset", {
      y: -80 * k,
      ease: "none",
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: true },
    });

    // Factory video frame eases up to full size
    gsap.fromTo(
      ".video-frame",
      { scale: 0.9, rotate: -2 },
      {
        scale: 1,
        rotate: 0,
        ease: "none",
        scrollTrigger: { trigger: "#factory-video", start: "top bottom", end: "center center", scrub: true },
      }
    );

    // Purity ring turns slightly while in view
    gsap.fromTo(
      ".comp-ring > svg",
      { rotate: -40 },
      {
        rotate: 0,
        ease: "none",
        scrollTrigger: { trigger: "#purity", start: "top bottom", end: "center center", scrub: true },
      }
    );

    // Decorative glows drift with scroll
    $$(".section-dark .glow, .hero .glow").forEach((g, i) => {
      gsap.to(g, {
        yPercent: (i % 2 ? -30 : 30) * k,
        ease: "none",
        scrollTrigger: { trigger: g.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
      });
    });

  }

  /** Run after the page has loaded and the browser is idle, so setup never delays first paint. */
  function whenIdle(fn) {
    const go = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(fn, { timeout: 1500 }) : window.setTimeout(fn, 200);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  }

  /* ---------------------------------------------------------------
     Boot
     --------------------------------------------------------------- */
  function init() {
    seedFields();
    scrollUi();
    if (reduce) return; // decorative motion off for reduced-motion users
    root.classList.add("motion-on");
    // Start endless ambient motion (seeds, glows, floating bottles) once the page is idle
    whenIdle(() => window.setTimeout(() => root.classList.add("ambient-on"), 400));
    buttons();
    productTilt();
    heroDepth();
    pageTransitions();
    whenIdle(() => {
      try {
        gsapScroll();
      } catch (err) {
        /* animation library problem — site keeps working without it */
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
