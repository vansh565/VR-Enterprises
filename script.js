/* =====================================================================
   VR Enterprises — site behaviour
   All editable content lives in config.js (window.VR_CONFIG).
   ===================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------------
     Config (with safe defaults so a broken config.js never breaks the page)
     ------------------------------------------------------------------ */
  const RAW = window.VR_CONFIG;
  const CFG = RAW && typeof RAW === "object" ? RAW : {};
  const BUSINESS = CFG.business || {};
  const PRODUCTS = Array.isArray(CFG.products) ? CFG.products : [];
  const PRODUCT_INFO = CFG.productInfo || {};
  const BATCHES = Array.isArray(CFG.batches) ? CFG.batches : [];
  const CERTS = Array.isArray(CFG.certificates) ? CFG.certificates : [];
  const REVIEWS = Array.isArray(CFG.testimonials) ? CFG.testimonials : [];
  const RECIPES = Array.isArray(CFG.recipes) ? CFG.recipes : [];
  const FORMS = CFG.forms || {};

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ESC[c]);

  // Only allow same-site relative paths or https URLs from config
  const safeUrl = (u) => {
    const s = String(u || "").trim();
    if (!s) return "";
    if (/^https:\/\//i.test(s)) return s;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(s)) return ""; // block javascript:, data:, etc.
    return s;
  };

  const isNum = (n) => typeof n === "number" && isFinite(n) && n > 0;
  const inr = (n) =>
    "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(n) ? 0 : 2 });

  /** Normalise an Indian phone number to digits with country code, e.g. "917051052310". */
  function toIntlPhone(input) {
    let d = String(input || "").replace(/\D/g, "");
    if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
    if (d.length === 12 && d.startsWith("91")) return d;
    if (d.length === 10) return "91" + d;
    return d.length >= 11 ? d : "";
  }

  /** Validate an Indian mobile number entered by a customer. */
  function validIndianMobile(input) {
    let d = String(input || "").replace(/[\s\-().]/g, "");
    d = d.replace(/^\+?91/, "").replace(/^0/, "");
    return /^[6-9]\d{9}$/.test(d);
  }

  const WA_NUMBER = toIntlPhone(BUSINESS.whatsapp || (BUSINESS.phones || [])[0]);
  const waUrl = (text) =>
    WA_NUMBER ? `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}` : "";

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + (String(iso).length === 10 ? "T00:00:00" : ""));
    return isNaN(d) ? String(iso) : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  /** Inline SVG icon from the sprite in index.html (Font Awesome Free icons). */
  const ic = (name, extra = "") => {
    const n = String(name).replace(/^fa-/, "");
    return `<i class="fa-${n}${extra ? " " + extra : ""}" aria-hidden="true"><svg class="ic"><use href="#i-${n}"></use></svg></i>`;
  };

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }

  /* ------------------------------------------------------------------
     Config error banner
     ------------------------------------------------------------------ */
  function checkConfig() {
    if (!RAW || !PRODUCTS.length) {
      const el = $("#configError");
      if (el) el.hidden = false;
    }
  }

  /* ------------------------------------------------------------------
     Header, mobile nav and active links
     ------------------------------------------------------------------ */
  function initHeader() {
    const header = $("#siteHeader");
    const toggle = $("#navToggle");
    const nav = $("#mainNav");
    if (!header || !toggle || !nav) return;

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1025px)").addEventListener("change", (mq) => {
      if (mq.matches) setOpen(false);
    });

    // Highlight the nav link of the section in view
    const links = $$(".main-nav a[href^='#']");
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = map.get(entry.target.id);
          links.forEach((a) => a.removeAttribute("aria-current"));
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    // Observe every top-level section so passing a section without a nav link clears the highlight
    $$("main > section[id]").forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------------
     Scroll reveal (respects reduced motion via CSS)
     ------------------------------------------------------------------ */
  let revealObserver = null;
  function observeReveal(root = document) {
    const items = $$(".reveal:not(.is-visible)", root);
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          // Elements entering together are revealed one after another (stagger).
          entries
            .filter((e) => e.isIntersecting)
            .forEach((entry, i) => {
              const el = entry.target;
              el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
              el.classList.add("is-visible");
              revealObserver.unobserve(el);
              window.setTimeout(() => (el.style.transitionDelay = ""), 1400);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    items.forEach((el) => revealObserver.observe(el));
  }

  /** Give common blocks an entrance animation without editing every HTML element. */
  function autoReveal() {
    const map = [
      [".section-head", "reveal reveal-head"],
      [".trust-item, .opportunity, .contact-card, .cert-slot, .journey", "reveal"],
      [".split-copy, .locations", "reveal reveal-left"],
      [".form-card, .video-frame, .map-card", "reveal reveal-right"],
      [".purity-board, .comp-details", "reveal"],
      [".comp-ring", "reveal reveal-scale"],
      [".faq-item", "reveal"],
    ];
    map.forEach(([sel, cls]) =>
      $$(sel).forEach((el) => {
        if (!el.classList.contains("reveal")) el.classList.add(...cls.split(" "));
      })
    );
  }

  /** Tell the animation layer that the page layout changed (filters, rendering). */
  const layoutChanged = () => document.dispatchEvent(new CustomEvent("vr:layout"));

  /* ------------------------------------------------------------------
     Announcement bar, footer IDs, hours, social links
     ------------------------------------------------------------------ */
  function initBusinessBits() {
    const ann = CFG.announcement || {};
    const annEl = $("#announcement");
    if (annEl && ann.enabled && ann.text) {
      const link = safeUrl(ann.link);
      annEl.innerHTML =
        `<div class="container"><span>${esc(ann.text)}</span>` +
        (link && ann.linkText ? ` <a href="${esc(link)}">${esc(ann.linkText)} &rarr;</a>` : "") +
        `</div>`;
      annEl.hidden = false;
    }

    const fssai = String(BUSINESS.fssaiNumber || "").trim();
    const gstin = String(BUSINESS.gstin || "").trim();
    const topFssai = $("#topbarFssai");
    if (fssai && topFssai) {
      topFssai.textContent = `FSSAI Lic. No. ${fssai}`;
      topFssai.hidden = false;
    }
    const ids = [fssai && `FSSAI Lic. No. ${fssai}`, gstin && `GSTIN ${gstin}`].filter(Boolean);
    const footerIds = $("#footerIds");
    if (ids.length && footerIds) {
      footerIds.textContent = ids.join("  ·  ");
      footerIds.hidden = false;
    }

    const hoursEl = $("#businessHours");
    if (BUSINESS.hours && hoursEl) {
      hoursEl.innerHTML = `<i class="fa-clock" aria-hidden="true"><svg class="ic"><use href="#i-clock"></use></svg></i> ${esc(BUSINESS.hours)}`;
      hoursEl.hidden = false;
    }

    const social = BUSINESS.social || {};
    const icons = { instagram: "fa-instagram", facebook: "fa-facebook-f", youtube: "fa-youtube" };
    const labels = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube" };
    const socialEl = $("#footerSocial");
    const socialLinks = Object.keys(icons)
      .map((k) => [k, safeUrl(social[k])])
      .filter(([, url]) => /^https:\/\//.test(url));
    if (socialEl && socialLinks.length) {
      socialEl.innerHTML = socialLinks
        .map(
          ([k, url]) =>
            `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="VR Enterprises on ${labels[k]}">${ic(icons[k])}</a>`
        )
        .join("");
      socialEl.hidden = false;
    }

    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------
     WhatsApp links
     ------------------------------------------------------------------ */
  const WA_MESSAGES = {
    general: "Hello VR Enterprises, I would like to know more about your cold pressed black mustard oil.",
    distributor:
      "Hello VR Enterprises, I am interested in becoming a distributor / wholesale partner for VR cold pressed black mustard oil.\n\nBusiness name:\nCity & State:\nBusiness type:\nExpected monthly quantity:",
  };

  function productWaMessage(p, qty) {
    return (
      `Hello VR Enterprises, I would like to enquire about:\n\n` +
      `Product: VR Cold Pressed Black Mustard Oil — ${p.name}\n` +
      `Quantity: ${qty || 1}\n\nPlease share the price and availability.`
    );
  }

  function initWhatsAppLinks() {
    $$(".js-wa").forEach((a) => {
      const url = waUrl(WA_MESSAGES[a.dataset.wa] || WA_MESSAGES.general);
      if (!url) {
        a.hidden = true;
        return;
      }
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ------------------------------------------------------------------
     Dialogs (native <dialog>: focus trapping + Esc handled by browser)
     ------------------------------------------------------------------ */
  let lastFocus = null;
  function openDialog(dlg) {
    if (!dlg) return;
    lastFocus = document.activeElement;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    document.documentElement.classList.add("dialog-open");
    const body = $(".dialog-body", dlg);
    if (body) body.scrollTop = 0;
    const close = $("[data-close]", dlg);
    if (close) close.focus();
  }
  function closeDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === "function") dlg.close();
    else dlg.removeAttribute("open");
  }
  function initDialogs() {
    $$("dialog.dialog").forEach((dlg) => {
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg || e.target.closest("[data-close]")) closeDialog(dlg);
      });
      dlg.addEventListener("close", () => {
        document.documentElement.classList.remove("dialog-open");
        const video = $("video", dlg);
        if (video) video.pause();
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      });
    });
  }

  /* ------------------------------------------------------------------
     Products
     ------------------------------------------------------------------ */
  function priceHtml(p, large) {
    const hasPrice = isNum(p.price);
    const hasMrp = isNum(p.mrp);
    if (!hasPrice && !hasMrp) return `<span class="price-request">Price on request</span>`;
    const main = hasPrice ? p.price : p.mrp;
    let html = `<span class="price-now${large ? " price-lg" : ""}">${inr(main)}</span>`;
    if (hasPrice && hasMrp && p.mrp > p.price) {
      const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      html += ` <span class="price-mrp">MRP <s>${inr(p.mrp)}</s></span>`;
      if (off > 0) html += ` <span class="price-off">${off}% off</span>`;
    } else if (!hasPrice && hasMrp) {
      html = `<span class="price-now${large ? " price-lg" : ""}">MRP ${inr(p.mrp)}</span>`;
    }
    return html + `<span class="price-tax">Inclusive of all taxes</span>`;
  }

  function productImg(p, sizes, extra = "") {
    const base = `assets/img/product-${encodeURIComponent(p.image || p.id)}`;
    return `<img src="${base}-400.webp" srcset="${base}-400.webp 400w, ${base}-800.webp 800w" sizes="${sizes}" width="400" height="500" alt="VR Cold Pressed Black Mustard Oil — ${esc(p.name)}" ${extra} onerror="this.onerror=null;this.closest('[data-img-wrap]').classList.add('img-missing');this.remove();" />`;
  }

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;
    if (!PRODUCTS.length) {
      grid.innerHTML = `<p class="empty-note">Product details are being updated. Please <a href="#contact">contact us</a> for the current range and prices.</p>`;
      return;
    }
    grid.innerHTML = PRODUCTS.map(
      (p, i) => `
      <article class="product-card reveal" data-category="${esc(p.category)}" data-id="${esc(p.id)}">
        <button class="product-media" type="button" data-action="details" aria-label="View details: ${esc(p.name)}" data-img-wrap>
          ${productImg(p, "(max-width: 600px) 45vw, (max-width: 1024px) 30vw, 260px", i > 2 ? 'loading="lazy" decoding="async"' : 'decoding="async"')}
          ${p.tag ? `<span class="product-tag">${esc(p.tag)}</span>` : ""}
        </button>
        <div class="product-body">
          <p class="product-size">${esc(p.size)}</p>
          <h3><button type="button" class="product-title-btn" data-action="details">${esc(p.name)}</button></h3>
          <p class="product-desc">${esc(p.description)}</p>
          <div class="product-price">${priceHtml(p)}</div>
          <div class="product-actions">
            <a class="btn btn-whatsapp btn-sm" href="${esc(waUrl(productWaMessage(p, 1)))}" target="_blank" rel="noopener"><i class="fa-whatsapp" aria-hidden="true"><svg class="ic"><use href="#i-whatsapp"></use></svg></i> Enquire</a>
            <button class="btn btn-outline btn-sm" type="button" data-action="wholesale">Wholesale Price</button>
          </div>
        </div>
      </article>`
    ).join("");

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const card = btn.closest(".product-card");
      const p = PRODUCTS.find((x) => x.id === card.dataset.id);
      if (!p) return;
      if (btn.dataset.action === "details") openProduct(p);
      if (btn.dataset.action === "wholesale") prefillEnquiry(p.id, "Wholesale price");
    });

    observeReveal(grid);
  }

  function initProductFilters() {
    const chips = $$("[data-filter]");
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        const f = chip.dataset.filter;
        chips.forEach((c) => {
          const on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", String(on));
        });
        $$(".product-card").forEach((card) => {
          const show = f === "all" || card.dataset.category === f;
          card.hidden = !show;
          if (show) {
            card.classList.add("is-visible");
            card.classList.remove("is-filtered-in");
            void card.offsetWidth; // restart the entrance animation
            card.classList.add("is-filtered-in");
          }
        });
        layoutChanged();
      })
    );

    // Footer product links open the matching product
    $$("[data-product-link]").forEach((a) =>
      a.addEventListener("click", (e) => {
        const p = PRODUCTS.find((x) => x.id === a.dataset.productLink);
        if (!p) return;
        e.preventDefault();
        openProduct(p);
      })
    );
  }

  function openProduct(p) {
    const body = $("#productDialogBody");
    const dlg = $("#productDialog");
    if (!body || !dlg) return;
    const shelf = PRODUCT_INFO.shelfLife || "As printed on the label";
    const fssai = BUSINESS.fssaiNumber || "";
    body.innerHTML = `
      <div class="pd-grid">
        <div class="pd-media" data-img-wrap>
          ${productImg(p, "(max-width: 760px) 80vw, 360px")}
        </div>
        <div class="pd-info">
          <p class="eyebrow">VR Cold Pressed Black Mustard Oil</p>
          <h2 id="pdTitle">${esc(p.name)}</h2>
          <p class="pd-desc">${esc(p.description)}</p>
          <div class="pd-price">${priceHtml(p, true)}</div>

          <div class="pd-actions">
            <label class="qty" for="pdQty"><span>Qty</span>
              <input id="pdQty" type="number" min="1" max="100000" step="1" value="1" inputmode="numeric" />
            </label>
            <a class="btn btn-whatsapp" id="pdWa" href="${esc(waUrl(productWaMessage(p, 1)))}" target="_blank" rel="noopener"><i class="fa-whatsapp" aria-hidden="true"><svg class="ic"><use href="#i-whatsapp"></use></svg></i> Enquire on WhatsApp</a>
            <button class="btn btn-outline" type="button" id="pdWholesale">Request Wholesale Price</button>
          </div>

          <h3 class="pd-h">Product details</h3>
          <dl class="spec-list">
            <div><dt>Net quantity</dt><dd>${esc(p.size)}</dd></div>
            <div><dt>Packaging</dt><dd>${esc(p.packaging || "—")}</dd></div>
            ${p.idealFor ? `<div><dt>Ideal for</dt><dd>${esc(p.idealFor)}</dd></div>` : ""}
            <div><dt>Ingredients</dt><dd>${esc(PRODUCT_INFO.ingredients || "Cold pressed black mustard oil (100%)")}</dd></div>
            <div><dt>Allergen information</dt><dd>${esc(PRODUCT_INFO.allergens || "Contains mustard.")}</dd></div>
            <div><dt>Additives</dt><dd>${esc(PRODUCT_INFO.additives || "None added")}</dd></div>
            <div><dt>Shelf life</dt><dd>${esc(shelf)}</dd></div>
            <div><dt>Storage</dt><dd>${esc(PRODUCT_INFO.storage || "Store in a cool, dry place away from direct sunlight.")}</dd></div>
            <div><dt>Batch no. / Mfg. / Best before</dt><dd>Printed on each pack — <a href="#batch" data-close>trace your batch</a></dd></div>
            ${fssai ? `<div><dt>FSSAI Lic. No.</dt><dd>${esc(fssai)}</dd></div>` : ""}
            <div><dt>Manufactured by</dt><dd>VR Enterprises, Patoli Bantalab, Jammu, J&amp;K 181206</dd></div>
          </dl>
          <p class="fine-print">Nutritional information is printed on the product label. For culinary use.</p>
        </div>
      </div>`;

    const qty = $("#pdQty", body);
    const wa = $("#pdWa", body);
    qty.addEventListener("input", () => {
      const n = Math.max(1, Math.min(100000, parseInt(qty.value, 10) || 1));
      wa.href = waUrl(productWaMessage(p, n));
    });
    $("#pdWholesale", body).addEventListener("click", () => {
      closeDialog(dlg);
      prefillEnquiry(p.id, "Wholesale price", parseInt(qty.value, 10) || 1);
    });
    $$('a[href="#batch"]', body).forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        closeDialog(dlg);
        scrollToEl($("#batch"));
      })
    );
    openDialog(dlg);
  }

  /** Inject Product structured data only for products with a real configured price. */
  function injectProductSchema() {
    const priced = PRODUCTS.filter((p) => isNum(p.price) || isNum(p.mrp));
    if (!priced.length) return;
    const data = {
      "@context": "https://schema.org",
      "@graph": priced.map((p) => ({
        "@type": "Product",
        name: `VR Cold Pressed Black Mustard Oil — ${p.name}`,
        description: p.description,
        image: `https://www.vrenterprises.in/assets/img/product-${p.image || p.id}-800.webp`,
        brand: { "@type": "Brand", name: "VR Enterprises" },
        manufacturer: { "@id": "https://www.vrenterprises.in/#organization" },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: String(isNum(p.price) ? p.price : p.mrp),
          url: "https://www.vrenterprises.in/#products",
          seller: { "@id": "https://www.vrenterprises.in/#organization" },
        },
      })),
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------
     Forms (Web3Forms + WhatsApp alternative)
     ------------------------------------------------------------------ */
  const INDIAN_STATES = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
    "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
    "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal",
  ];

  function populateSelects() {
    const productSelect = $("#peProduct");
    if (productSelect) {
      productSelect.innerHTML =
        `<option value="">Select a size</option>` +
        PRODUCTS.map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("");
    }
    const stateSelect = $("#dState");
    if (stateSelect) {
      stateSelect.insertAdjacentHTML(
        "beforeend",
        INDIAN_STATES.map((s) => `<option>${s}</option>`).join("")
      );
    }
  }

  function prefillEnquiry(productId, type, qty) {
    const form = $("#productEnquiryForm");
    if (!form) return;
    const sel = $("#peProduct", form);
    if (sel && productId) sel.value = productId;
    if (qty) $("#peQty", form).value = String(qty);
    if (type) {
      const radio = $$('input[name="enquiry_type"]', form).find((r) => r.value === type);
      if (radio) radio.checked = true;
    }
    scrollToEl($("#enquiry"));
    window.setTimeout(() => {
      const target = $("#peName", form);
      if (target) target.focus({ preventScroll: true });
    }, prefersReducedMotion() ? 0 : 600);
  }

  const FORM_RULES = {
    product: {
      subject: "Product Enquiry — VR Enterprises website",
      required: ["product", "quantity", "name", "phone", "city"],
    },
    distributor: {
      subject: "Distributor / Wholesale Enquiry — VR Enterprises website",
      required: ["business_name", "name", "phone", "email", "city", "state", "business_type", "monthly_quantity"],
    },
    contact: {
      subject: "Website Message — VR Enterprises",
      required: ["name", "phone", "message"],
    },
  };

  function fieldError(form, name, msg) {
    const input = form.elements[name];
    if (!input || !input.id) return;
    const err = document.getElementById(input.id + "-err");
    if (msg) {
      input.setAttribute("aria-invalid", "true");
      if (err) {
        err.textContent = msg;
        input.setAttribute("aria-describedby", err.id);
      }
    } else {
      input.removeAttribute("aria-invalid");
      if (err) err.textContent = "";
    }
  }

  function readForm(form) {
    const data = {};
    new FormData(form).forEach((v, k) => {
      if (k === "botcheck") return;
      data[k] = String(v).trim();
    });
    return data;
  }

  function validateForm(form, type) {
    const rules = FORM_RULES[type];
    const d = readForm(form);
    const errors = {};

    rules.required.forEach((k) => {
      if (!d[k]) errors[k] = "This field is required.";
    });
    if (d.name && (d.name.length < 2 || !/[A-Za-zऀ-ॿ]/.test(d.name))) errors.name = "Please enter your full name.";
    if (d.business_name && d.business_name.length < 2) errors.business_name = "Please enter your business name.";
    if (d.phone && !validIndianMobile(d.phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errors.email = "Enter a valid email address.";
    if (d.city && d.city.length < 2) errors.city = "Please enter your city or town.";
    if ("quantity" in d && d.quantity) {
      const q = Number(d.quantity);
      if (!Number.isInteger(q) || q < 1 || q > 100000) errors.quantity = "Enter a quantity between 1 and 100000.";
    }
    if (d.message && d.message.length > 1000) errors.message = "Please keep the message under 1000 characters.";
    if (type === "contact" && d.message && d.message.length < 5) errors.message = "Please write a short message.";

    // Clear old errors, then show new ones
    Array.from(form.elements).forEach((el) => el.name && fieldError(form, el.name, ""));
    Object.entries(errors).forEach(([k, msg]) => fieldError(form, k, msg));
    return { ok: !Object.keys(errors).length, data: d, errors };
  }

  function describeForm(type, d) {
    const p = PRODUCTS.find((x) => x.id === d.product);
    const lines = [];
    if (type === "product") {
      lines.push(
        ["Product", p ? p.name : d.product],
        ["Quantity", d.quantity],
        ["Enquiry type", d.enquiry_type],
        ["Name", d.name],
        ["Mobile", d.phone],
        ["City", d.city],
        ["Email", d.email],
        ["Message", d.message]
      );
    } else if (type === "distributor") {
      lines.push(
        ["Business name", d.business_name],
        ["Contact person", d.name],
        ["Mobile", d.phone],
        ["Email", d.email],
        ["City", d.city],
        ["State", d.state],
        ["Business type", d.business_type],
        ["Expected monthly quantity", d.monthly_quantity],
        ["Message", d.message]
      );
    } else {
      lines.push(["Name", d.name], ["Mobile", d.phone], ["Email", d.email], ["Topic", d.topic], ["Message", d.message]);
    }
    return lines.filter(([, v]) => v);
  }

  function waTextFor(type, d) {
    const intro = {
      product: "Hello VR Enterprises, I would like to place an enquiry:",
      distributor: "Hello VR Enterprises, I am interested in a distributor / wholesale partnership:",
      contact: "Hello VR Enterprises,",
    }[type];
    return intro + "\n\n" + describeForm(type, d).map(([k, v]) => `${k}: ${v}`).join("\n");
  }

  // Simple hash so an identical enquiry isn't sent twice within 10 minutes.
  function hashStr(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return String(h >>> 0);
  }
  const DUP_KEY = "vr-sent-forms";
  function wasRecentlySent(sig) {
    try {
      const store = JSON.parse(sessionStorage.getItem(DUP_KEY) || "{}");
      return store[sig] && Date.now() - store[sig] < 10 * 60 * 1000;
    } catch (_) {
      return false;
    }
  }
  function markSent(sig) {
    try {
      const store = JSON.parse(sessionStorage.getItem(DUP_KEY) || "{}");
      store[sig] = Date.now();
      sessionStorage.setItem(DUP_KEY, JSON.stringify(store));
    } catch (_) {
      /* storage unavailable — in-flight lock still prevents double clicks */
    }
  }

  function setStatus(form, kind, msg) {
    const el = $(".form-status", form);
    if (!el) return;
    el.className = `form-status${kind ? " is-" + kind : ""}`;
    el.textContent = msg;
  }

  function initForms() {
    $$(".js-form").forEach((form) => {
      const type = form.dataset.form;
      if (!FORM_RULES[type]) return;
      const submitBtn = $('button[type="submit"]', form);
      const submitLabel = submitBtn ? submitBtn.textContent : "";
      let sending = false;

      // Clear a field's error as soon as the user fixes it
      form.addEventListener("input", (e) => {
        if (e.target.name && e.target.getAttribute("aria-invalid") === "true") fieldError(form, e.target.name, "");
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (sending) return;

        const { ok, data, errors } = validateForm(form, type);
        if (!ok) {
          setStatus(form, "error", "Please correct the highlighted fields.");
          const first = form.elements[Object.keys(errors)[0]];
          if (first) first.focus();
          return;
        }
        if (form.elements.botcheck && form.elements.botcheck.checked) return; // bot

        const sig = type + ":" + hashStr(JSON.stringify(data));
        if (wasRecentlySent(sig)) {
          setStatus(form, "info", "This enquiry was already sent a few minutes ago. We'll be in touch soon — no need to send it again.");
          return;
        }
        if (!FORMS.web3formsKey) {
          setStatus(form, "error", "Online form is not configured. Please use WhatsApp or call us.");
          return;
        }
        if (!navigator.onLine) {
          setStatus(form, "error", "You appear to be offline. Please check your connection, or send the enquiry on WhatsApp.");
          return;
        }

        sending = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending…";
        }
        setStatus(form, "", "Sending your enquiry…");

        const payload = {
          access_key: FORMS.web3formsKey,
          subject: FORM_RULES[type].subject,
          from_name: FORMS.fromName || "VR Enterprises Website",
          botcheck: "",
        };
        describeForm(type, data).forEach(([k, v]) => (payload[k] = v));
        if (data.email) payload.replyto = data.email;

        // Sent as multipart FormData (a CORS "simple request") so no preflight is needed.
        const body = new FormData();
        Object.entries(payload).forEach(([k, v]) => body.append(k, v));

        const controller = "AbortController" in window ? new AbortController() : null;
        const timer = controller ? window.setTimeout(() => controller.abort(), 20000) : null;
        try {
          const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { Accept: "application/json" },
            body,
            signal: controller ? controller.signal : undefined,
          });
          const result = await res.json().catch(() => ({}));
          if (res.ok && result.success) {
            markSent(sig);
            form.reset();
            setStatus(
              form,
              "success",
              `Thank you, ${data.name.split(" ")[0]}! Your enquiry has been sent. We'll contact you on ${data.phone} shortly.`
            );
          } else {
            setStatus(form, "error", "Sorry, your enquiry could not be sent right now. Please try again, or send it on WhatsApp.");
          }
        } catch (err) {
          setStatus(
            form,
            "error",
            err && err.name === "AbortError"
              ? "The request timed out. Please try again, or send the enquiry on WhatsApp."
              : "Network problem — your enquiry was not sent. Please try again, or send it on WhatsApp."
          );
        } finally {
          if (timer) window.clearTimeout(timer);
          sending = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
        }
      });

      const waBtn = $(".js-form-wa", form);
      if (waBtn) {
        if (!WA_NUMBER) waBtn.hidden = true;
        waBtn.addEventListener("click", () => {
          const { ok, data, errors } = validateForm(form, type);
          if (!ok) {
            setStatus(form, "error", "Please complete the highlighted fields first.");
            const first = form.elements[Object.keys(errors)[0]];
            if (first) first.focus();
            return;
          }
          setStatus(form, "", "");
          window.open(waUrl(waTextFor(type, data)), "_blank", "noopener");
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     Batch lookup — reads published records from config.js
     ------------------------------------------------------------------ */
  const normBatch = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  function initBatchLookup() {
    const form = $("#batchForm");
    const input = $("#batchInput");
    const out = $("#batchResult");
    if (!form || !input || !out) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      const key = normBatch(raw);
      if (!key || key.length < 3) {
        out.innerHTML = `<p class="batch-msg is-error">Please enter the batch number exactly as printed on your pack.</p>`;
        input.focus();
        return;
      }
      const rec = BATCHES.find((b) => normBatch(b.batch) === key);
      const waLink = waUrl(`Hello VR Enterprises, I would like to verify batch number ${raw}.`);
      if (!rec) {
        out.innerHTML = `
          <div class="batch-msg is-info">
            <p><strong>No published record found for “${esc(raw)}”.</strong></p>
            <p>${
              BATCHES.length
                ? "Please check the number on your label and try again."
                : "We are in the process of publishing batch records online."
            } You can also send us the batch number and we will confirm its details.</p>
            ${waLink ? `<a class="btn btn-whatsapp btn-sm" href="${esc(waLink)}" target="_blank" rel="noopener"><i class="fa-whatsapp" aria-hidden="true"><svg class="ic"><use href="#i-whatsapp"></use></svg></i> Verify on WhatsApp</a>` : ""}
          </div>`;
        return;
      }
      const tests = Array.isArray(rec.tests) ? rec.tests.filter((t) => t && t.parameter) : [];
      const report = safeUrl(rec.report);
      out.innerHTML = `
        <div class="batch-record">
          <p class="batch-found"><i class="fa-circle-check" aria-hidden="true"><svg class="ic"><use href="#i-circle-check"></use></svg></i> Batch record found</p>
          <dl class="spec-list spec-compact">
            <div><dt>Batch number</dt><dd>${esc(rec.batch)}</dd></div>
            ${rec.product ? `<div><dt>Product</dt><dd>${esc(rec.product)}</dd></div>` : ""}
            ${rec.mfgDate ? `<div><dt>Manufacturing date</dt><dd>${esc(formatDate(rec.mfgDate))}</dd></div>` : ""}
            ${rec.bestBefore ? `<div><dt>Best before</dt><dd>${esc(formatDate(rec.bestBefore))}</dd></div>` : ""}
            ${rec.status ? `<div><dt>Status</dt><dd>${esc(rec.status)}</dd></div>` : ""}
            ${rec.lab ? `<div><dt>Tested by</dt><dd>${esc(rec.lab)}</dd></div>` : ""}
          </dl>
          ${
            tests.length
              ? `<div class="table-wrap"><table class="test-table"><caption>Test results</caption>
                  <thead><tr><th scope="col">Parameter</th><th scope="col">Result</th><th scope="col">Limit</th></tr></thead>
                  <tbody>${tests
                    .map((t) => `<tr><th scope="row">${esc(t.parameter)}</th><td>${esc(t.result || "—")}</td><td>${esc(t.limit || "—")}</td></tr>`)
                    .join("")}</tbody></table></div>`
              : ""
          }
          ${
            report
              ? `<button class="btn btn-outline btn-sm" type="button" data-doc="${esc(report)}" data-doc-title="Quality report — ${esc(rec.batch)}"><i class="fa-file-lines" aria-hidden="true"><svg class="ic"><use href="#i-file-lines"></use></svg></i> View quality report</button>`
              : `<p class="fine-print">A laboratory report for this batch has not been published online.</p>`
          }
        </div>`;
      const docBtn = $("[data-doc]", out);
      if (docBtn) docBtn.addEventListener("click", () => openDocument(docBtn.dataset.docTitle, docBtn.dataset.doc, ""));
    });
  }

  /* ------------------------------------------------------------------
     Certificates & document viewer
     ------------------------------------------------------------------ */
  const CERT_ICONS = {
    fssai: "fa-certificate",
    manufacturing: "fa-industry",
    "lab-report": "fa-flask-vial",
    quality: "fa-award",
  };

  function renderCertificates() {
    const grid = $("#certGrid");
    if (!grid) return;
    if (!CERTS.length) {
      grid.innerHTML = `<p class="empty-note">Documents will be published here soon.</p>`;
      return;
    }
    grid.innerHTML = CERTS.map((c) => {
      const file = safeUrl(c.file);
      const available = c.status === "available" && file;
      const icon = CERT_ICONS[c.id] || "fa-file-shield";
      const inner = `
        <span class="cert-icon">${ic(icon)}</span>
        <span class="cert-title">${esc(c.title)}</span>
        <span class="cert-issuer">${esc(c.issuer || "")}</span>
        ${available && c.number ? `<span class="cert-number">No. ${esc(c.number)}</span>` : ""}
        ${available && c.validUntil ? `<span class="cert-valid">Valid until ${esc(formatDate(c.validUntil))}</span>` : ""}
        <span class="cert-status ${available ? "is-available" : "is-awaiting"}">
          ${ic(available ? "circle-check" : "hourglass-half")}
          ${available ? "View document" : "Awaiting upload"}
        </span>`;
      return available
        ? `<button type="button" class="cert-card" data-cert="${esc(c.id)}">${inner}</button>`
        : `<div class="cert-card is-awaiting">${inner}</div>`;
    }).join("");

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cert]");
      if (!btn) return;
      const c = CERTS.find((x) => x.id === btn.dataset.cert);
      if (c) openDocument(c.title, safeUrl(c.file), [c.issuer, c.number && `No. ${c.number}`].filter(Boolean).join(" · "));
    });
  }

  function openDocument(title, file, subtitle) {
    const body = $("#docDialogBody");
    const dlg = $("#docDialog");
    if (!body || !dlg || !file) return;
    const isPdf = /\.pdf($|[?#])/i.test(file);
    body.innerHTML = `
      <div class="doc-head">
        <h2 id="ddTitle">${esc(title)}</h2>
        ${subtitle ? `<p>${esc(subtitle)}</p>` : ""}
      </div>
      <div class="doc-view" data-img-wrap>
        ${
          isPdf
            ? `<iframe src="${esc(file)}#view=FitH" title="${esc(title)}"></iframe>`
            : `<img src="${esc(file)}" alt="${esc(title)}" onerror="this.onerror=null;this.closest('[data-img-wrap]').classList.add('img-missing');this.remove();" />`
        }
        <p class="doc-missing">This document could not be loaded. Please contact us for a copy.</p>
      </div>
      <div class="doc-foot">
        <a class="btn btn-outline btn-sm" href="${esc(file)}" target="_blank" rel="noopener"><i class="fa-up-right-from-square" aria-hidden="true"><svg class="ic"><use href="#i-up-right-from-square"></use></svg></i> Open in new tab</a>
      </div>`;
    openDialog(dlg);
  }

  /* ------------------------------------------------------------------
     Reviews
     ------------------------------------------------------------------ */
  function renderReviews() {
    const area = $("#reviewsArea");
    if (!area) return;
    const valid = REVIEWS.filter((r) => r && r.name && r.text);
    const shareWa = waUrl("Hello VR Enterprises, I would like to share a review of your mustard oil:\n\nName:\nCity:\nMy review:");
    const shareLinks = `
      <div class="review-share">
        ${shareWa ? `<a class="btn btn-whatsapp" href="${esc(shareWa)}" target="_blank" rel="noopener"><i class="fa-whatsapp" aria-hidden="true"><svg class="ic"><use href="#i-whatsapp"></use></svg></i> Share your review</a>` : ""}
        <a class="btn btn-outline" href="mailto:vrenterprises.jammu@gmail.com?subject=${encodeURIComponent("My review of VR Mustard Oil")}"><i class="fa-envelope" aria-hidden="true"><svg class="ic"><use href="#i-envelope"></use></svg></i> Email your review</a>
      </div>`;

    const g = BUSINESS.googleReviews || {};
    const googleCard =
      g.rating && Number(g.count) > 0
        ? `<div class="google-rating reveal">
            <span class="g-logo">${ic("google")}</span>
            <div class="g-score">
              <strong>${esc(g.rating)}</strong>
              <span class="g-stars" style="--rating:${Math.max(0, Math.min(5, parseFloat(g.rating) || 0))}" aria-hidden="true">${ic("star")}${ic("star")}${ic("star")}${ic("star")}${ic("star")}</span>
            </div>
            <p>Rated <strong>${esc(g.rating)} out of 5</strong> by ${Number(g.count)} customer${Number(g.count) === 1 ? "" : "s"} on Google${g.asOf ? ` <span class="g-asof">(as of ${esc(g.asOf)})</span>` : ""}.</p>
            <div class="g-actions">
              <a class="btn btn-outline btn-sm" href="${esc(mapsListingUrl())}" target="_blank" rel="noopener">Read reviews on Google</a>
            </div>
          </div>`
        : "";

    if (!valid.length) {
      area.innerHTML = `${googleCard}
        <div class="reviews-empty reveal">
          <i class="fa-quote-left" aria-hidden="true"><svg class="ic"><use href="#i-quote-left"></use></svg></i>
          <h3>Have you cooked with VR mustard oil?</h3>
          <p>We publish only genuine reviews from real customers, with their permission. Tell us about your experience and it may appear here.</p>
          ${shareLinks}
        </div>`;
      observeReveal(area);
      return;
    }
    area.innerHTML =
      googleCard +
      `<div class="review-grid">${valid
        .map((r) => {
          const photo = safeUrl(r.photo);
          const initials = esc(String(r.name).trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase());
          return `
          <figure class="review-card reveal">
            <blockquote><p>${esc(r.text)}</p></blockquote>
            <figcaption>
              ${photo ? `<img src="${esc(photo)}" alt="" width="48" height="48" loading="lazy" />` : `<span class="avatar" aria-hidden="true">${initials}</span>`}
              <span><strong>${esc(r.name)}</strong>${r.city ? `<span>${esc(r.city)}</span>` : ""}${r.date ? `<time datetime="${esc(r.date)}">${esc(formatDate(r.date))}</time>` : ""}</span>
              ${r.verified === true ? `<span class="verified"><i class="fa-circle-check" aria-hidden="true"><svg class="ic"><use href="#i-circle-check"></use></svg></i> Verified purchase</span>` : ""}
            </figcaption>
          </figure>`;
        })
        .join("")}</div>` + shareLinks;
    observeReveal(area);
  }

  /* ------------------------------------------------------------------
     Recipes & knowledge
     ------------------------------------------------------------------ */
  const RECIPE_ICONS = { recipe: "fa-bowl-food", pickle: "fa-jar", regional: "fa-map-location-dot", guide: "fa-book-open" };

  function recipeMedia(r, cls) {
    const img = safeUrl(r.image);
    return img
      ? `<div class="${cls}" data-img-wrap><img src="${esc(img)}" alt="" loading="lazy" decoding="async" width="696" height="436" onerror="this.onerror=null;this.closest('[data-img-wrap]').classList.add('img-missing');this.remove();" />${ic(RECIPE_ICONS[r.category] || "utensils", "media-fallback")}</div>`
      : `<div class="${cls} is-styled cat-${esc(r.category)}">${ic(RECIPE_ICONS[r.category] || "utensils")}</div>`;
  }

  function renderRecipes() {
    const grid = $("#recipeGrid");
    if (!grid) return;
    if (!RECIPES.length) {
      grid.innerHTML = `<p class="empty-note">New recipes are coming soon.</p>`;
      return;
    }
    grid.innerHTML = RECIPES.map(
      (r) => `
      <article class="recipe-card reveal" data-category="${esc(r.category)}">
        ${recipeMedia(r, "recipe-media")}
        <div class="recipe-body">
          <p class="recipe-meta"><span>${esc(r.label || r.category)}</span>${r.time ? `<span><i class="fa-clock" aria-hidden="true"><svg class="ic"><use href="#i-clock"></use></svg></i> ${esc(r.time)}</span>` : ""}</p>
          <h3><button type="button" class="recipe-open" data-recipe="${esc(r.id)}">${esc(r.title)}</button></h3>
          <p>${esc(r.summary)}</p>
          <span class="link-arrow" aria-hidden="true">${r.category === "guide" ? "Read guide" : "View recipe"} ${ic("arrow-right")}</span>
        </div>
      </article>`
    ).join("");

    // Whole card is clickable; the title button is the accessible control.
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".recipe-card");
      if (!card) return;
      const btn = $(".recipe-open", card);
      const r = RECIPES.find((x) => x.id === btn.dataset.recipe);
      if (r) openRecipe(r);
    });

    const chips = $$("[data-rfilter]");
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        const f = chip.dataset.rfilter;
        chips.forEach((c) => {
          const on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", String(on));
        });
        $$(".recipe-card", grid).forEach((card) => {
          const show = f === "all" || card.dataset.category === f;
          card.hidden = !show;
          if (show) {
            card.classList.add("is-visible");
            card.classList.remove("is-filtered-in");
            void card.offsetWidth;
            card.classList.add("is-filtered-in");
          }
        });
        layoutChanged();
      })
    );
    observeReveal(grid);
  }

  function openRecipe(r) {
    const body = $("#recipeDialogBody");
    const dlg = $("#recipeDialog");
    if (!body || !dlg) return;
    const list = (arr, tag) =>
      Array.isArray(arr) && arr.length ? `<${tag}>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</${tag}>` : "";
    const isGuide = r.category === "guide" || Array.isArray(r.sections);
    body.innerHTML = `
      ${recipeMedia(r, "rd-media")}
      <div class="rd-content">
        <p class="eyebrow">${esc(r.label || r.category)}</p>
        <h2 id="rdTitle">${esc(r.title)}</h2>
        <p class="rd-summary">${esc(r.summary)}</p>
        ${
          !isGuide
            ? `<div class="rd-facts">
                ${r.time ? `<span><i class="fa-clock" aria-hidden="true"><svg class="ic"><use href="#i-clock"></use></svg></i> ${esc(r.time)}</span>` : ""}
                ${r.serves ? `<span><i class="fa-utensils" aria-hidden="true"><svg class="ic"><use href="#i-utensils"></use></svg></i> Serves / makes: ${esc(r.serves)}</span>` : ""}
              </div>
              <div class="rd-cols">
                <div><h3>Ingredients</h3>${list(r.ingredients, "ul")}</div>
                <div><h3>Method</h3>${list(r.steps, "ol")}</div>
              </div>
              ${r.tips && r.tips.length ? `<div class="rd-tips"><h3><i class="fa-lightbulb" aria-hidden="true"><svg class="ic"><use href="#i-lightbulb"></use></svg></i> Tips</h3>${list(r.tips, "ul")}</div>` : ""}`
            : (r.sections || [])
                .map((s) => `<section class="rd-section"><h3>${esc(s.heading)}</h3><p>${esc(s.text)}</p></section>`)
                .join("")
        }
        ${
          r.imageCredit && r.imageCredit.text
            ? `<p class="rd-credit">${
                safeUrl(r.imageCredit.url)
                  ? `<a href="${esc(safeUrl(r.imageCredit.url))}" target="_blank" rel="noopener">${esc(r.imageCredit.text)}</a>`
                  : esc(r.imageCredit.text)
              }</p>`
            : ""
        }
        <div class="rd-cta">
          <p>Cook it with VR Cold Pressed Black Mustard Oil.</p>
          <a class="btn btn-gold btn-sm" href="#products" data-close>Shop the range</a>
        </div>
      </div>`;
    $$('a[href="#products"]', body).forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        closeDialog(dlg);
        scrollToEl($("#products"));
      })
    );
    openDialog(dlg);
  }

  /* ------------------------------------------------------------------
     Factory video
     ------------------------------------------------------------------ */
  function initVideo() {
    const video = $("#factoryVideo");
    const btn = $("#videoPlay");
    if (!video || !btn) return;
    const sync = () => btn.classList.toggle("is-hidden", !video.paused);
    btn.addEventListener("click", () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => btn.classList.remove("is-hidden"));
    });
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    video.addEventListener("ended", sync);
    video.addEventListener("error", () => btn.classList.add("is-hidden"), true);
  }

  /* ------------------------------------------------------------------
     Google Maps (manufacturing unit)
     ------------------------------------------------------------------ */
  const LOCATIONS = (Array.isArray(BUSINESS.locations) ? BUSINESS.locations : []).filter(
    (l) => l && l.id && (isFinite(parseFloat(l.lat)) || l.address)
  );
  const LOC_ICONS = { shop: "store", production: "industry" };
  const hasCoords = (l) => isFinite(parseFloat(l.lat)) && isFinite(parseFloat(l.lng));
  const locTarget = (l) => (hasCoords(l) ? `${Number(l.lat)},${Number(l.lng)}` : l.address);
  const locById = (id) => LOCATIONS.find((l) => l.id === id) || LOCATIONS[0];

  function locListingUrl(l) {
    if (!l) return "https://www.google.com/maps/search/?api=1&query=VR+Enterprises+Jammu";
    const custom = safeUrl(l.googleMapsUrl);
    if (/^https:\/\//.test(custom)) return custom;
    const name = encodeURIComponent(l.listingName || l.name || "VR Enterprises").replace(/%20/g, "+");
    return hasCoords(l)
      ? `https://www.google.com/maps/search/${name}/@${locTarget(l)},17z`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`;
  }
  const locDirectionsUrl = (l) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locTarget(l))}`;
  // Kept for the Google rating card: the listing that holds the reviews
  const mapsListingUrl = () => locListingUrl(locById((BUSINESS.googleReviews || {}).location));

  function selectLocation(id, { scroll = false } = {}) {
    const l = locById(id);
    if (!l) return;
    const frame = $("#mapFrame");
    if (frame) {
      const embed = `https://www.google.com/maps?q=${encodeURIComponent(locTarget(l))}&z=${parseInt(BUSINESS.mapZoom, 10) || 17}&output=embed`;
      const norm = (u) => decodeURIComponent(String(u).replace(/\+/g, " "));
      if (norm(frame.getAttribute("src")) !== norm(embed)) frame.src = embed;
      frame.title = `Google Map: ${l.label || ""} — ${l.name || "VR Enterprises"}`;
    }
    $$("#mapSwitch [data-loc]").forEach((b) => {
      const on = b.dataset.loc === l.id;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    $$("#locations .location-card").forEach((c) => c.classList.toggle("is-active", c.dataset.loc === l.id));
    if (scroll) scrollToEl($(".map-card"));
  }

  function initMap() {
    const wrap = $("#locations");
    const sw = $("#mapSwitch");
    if (!LOCATIONS.length || !wrap) return;

    wrap.innerHTML = LOCATIONS.map(
      (l, i) => `
      <article class="location-card${i === 0 ? " is-active" : ""}" data-loc="${esc(l.id)}">
        <span class="loc-ic" aria-hidden="true">${ic(LOC_ICONS[l.id] || "location-dot")}</span>
        <div class="loc-body">
          ${l.label ? `<p class="address-kicker">${esc(l.label)}</p>` : ""}
          <h3>${esc(l.name || "VR Enterprises")}</h3>
          ${l.address ? `<address>${esc(l.address)}</address>` : ""}
          ${l.plusCode ? `<p class="loc-meta">Plus code: ${esc(l.plusCode)}</p>` : ""}
          <div class="address-actions">
            <a class="btn btn-gold btn-sm" href="${esc(locDirectionsUrl(l))}" target="_blank" rel="noopener">${ic("diamond-turn-right")} Directions</a>
            <a class="btn btn-outline-light btn-sm" href="${esc(locListingUrl(l))}" target="_blank" rel="noopener">${ic("google")} Google Maps</a>
            ${LOCATIONS.length > 1 ? `<button type="button" class="loc-show" data-show="${esc(l.id)}">${ic("map-location-dot")} Show on map</button>` : ""}
          </div>
        </div>
      </article>`
    ).join("");

    if (sw) {
      sw.hidden = LOCATIONS.length < 2;
      sw.innerHTML = LOCATIONS.map(
        (l, i) =>
          `<button type="button" class="map-switch-btn${i === 0 ? " is-active" : ""}" data-loc="${esc(l.id)}" aria-pressed="${i === 0}">${ic(LOC_ICONS[l.id] || "location-dot")} ${esc(l.label || l.name)}</button>`
      ).join("");
      sw.addEventListener("click", (e) => {
        const b = e.target.closest("[data-loc]");
        if (b) selectLocation(b.dataset.loc);
      });
    }
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-show]");
      if (b) selectLocation(b.dataset.show, { scroll: window.innerWidth < 1025 });
    });
    selectLocation(LOCATIONS[0].id);
  }

  /* ------------------------------------------------------------------
     100% Mustard Oil Composition & Purity dashboard (config.js → purity)
     ------------------------------------------------------------------ */
  const fmtNum = (n) => {
    const s = String(n);
    const d = s.includes(".") ? s.split(".")[1].length : 0;
    return { text: Number(n).toFixed(d), decimals: d };
  };

  function paramTile(p, verified) {
    const v = Number(p.value);
    const numeric = typeof p.value === "number" && isFinite(v);
    let gauge = "";
    let ref = p.reference ? esc(p.reference) : "";
    let ok = null;

    if (p.type === "max" && numeric && isNum(p.limit)) {
      ok = v <= p.limit;
      const pct = Math.max(2, Math.min(100, (v / p.limit) * 100));
      gauge = `<div class="gauge" aria-hidden="true"><span class="gauge-fill" style="--w:${pct.toFixed(1)}%"></span><span class="gauge-limit" style="--x:100%"></span></div>
               <div class="gauge-scale" aria-hidden="true"><span>0</span><span>Limit ${p.limit}</span></div>`;
      ref = ref || `Reference: not more than ${p.limit}`;
    } else if (p.type === "range" && numeric && isFinite(p.min) && isFinite(p.max)) {
      ok = v >= p.min && v <= p.max;
      const span = p.max - p.min;
      const lo = p.min - span * 0.5;
      const hi = p.max + span * 0.5;
      const pos = (x) => Math.max(0, Math.min(100, ((x - lo) / (hi - lo)) * 100));
      gauge = `<div class="gauge gauge-range" aria-hidden="true"><span class="gauge-band" style="left:${pos(p.min)}%;width:${pos(p.max) - pos(p.min)}%"></span><span class="gauge-marker" style="--x:${pos(v).toFixed(1)}%"></span></div>
               <div class="gauge-scale" aria-hidden="true"><span>${p.min}</span><span>${p.max}</span></div>`;
      ref = ref || `Reference range: ${p.min} – ${p.max}`;
    } else if (p.type === "absent") {
      ok = /not detected|negative|absent|nil/i.test(String(p.value));
    }

    const valueHtml = numeric
      ? (() => {
          const f = fmtNum(p.value);
          return `<strong><span class="js-count" data-to="${f.text}" data-decimals="${f.decimals}">${f.text}</span></strong>${p.unit ? ` <span class="param-unit">${esc(p.unit)}</span>` : ""}`;
        })()
      : `<strong class="param-text">${ok ? ic("circle-check") : ""} ${esc(p.value)}</strong>`;

    const status =
      ok === null
        ? ""
        : `<p class="param-status ${ok ? "is-ok" : "is-bad"}">${ic(ok ? "circle-check" : "triangle-exclamation")} ${
            ok ? "Within reference" : "Outside reference"
          }${verified ? "" : " (sample)"}</p>`;

    return `
      <article class="param reveal">
        <header>
          <span class="param-ic">${ic(p.icon || "flask-vial")}</span>
          <h4>${esc(p.name)}</h4>
          ${verified ? "" : `<span class="tag-sample">Sample</span>`}
        </header>
        <p class="param-value">${valueHtml}</p>
        ${gauge}
        ${ref ? `<p class="param-ref">${ref}</p>` : ""}
        ${status}
      </article>`;
  }

  function renderPurity() {
    const P = CFG.purity;
    const grid = $("#paramGrid");
    if (!P || !grid) return;
    const verified = P.verified === true;
    const report = P.labReport || {};
    const params = Array.isArray(P.parameters) ? P.parameters.filter((p) => p && p.name) : [];

    const flag = $("#purityFlag");
    if (flag) {
      flag.className = `purity-flag ${verified ? "is-verified" : "is-sample"}`;
      flag.innerHTML = verified
        ? `${ic("circle-check")} Laboratory results${report.lab ? ` — ${esc(report.lab)}` : ""}${report.date ? `, ${esc(formatDate(report.date))}` : ""}`
        : `${ic("triangle-exclamation")} ${esc(P.sampleNotice || "Sample Values – Pending Laboratory Verification")}`;
    }

    grid.innerHTML = params.map((p) => paramTile(p, verified)).join("");

    const foot = $("#purityFootnote");
    if (foot) {
      foot.innerHTML = verified
        ? `Results as reported by ${esc(report.lab || "the testing laboratory")}${report.reportNumber ? `, report no. ${esc(report.reportNumber)}` : ""}${
            report.date ? `, dated ${esc(formatDate(report.date))}` : ""
          }. Reference limits: FSSAI Food Products Standards for mustard (rapeseed) oil.`
        : `<strong>Important:</strong> the values above are illustrative sample values shown for design purposes only. They are <strong>not</strong> laboratory results for any VR Enterprises batch and will be replaced with actual results once laboratory testing is complete. Reference limits are based on the FSSAI Food Products Standards for mustard (rapeseed) oil.`;
    }

    // Dedicated FSSAI + lab report spaces
    const fssai = String(BUSINESS.fssaiNumber || "").trim();
    const fssaiSlot = $("#fssaiSlot");
    if (fssaiSlot) {
      fssaiSlot.className = `cert-slot ${fssai ? "is-ready" : "is-awaiting"}`;
      fssaiSlot.innerHTML = `
        <span class="cert-slot-ic">${ic("certificate")}</span>
        <div>
          <h3>FSSAI Licence</h3>
          ${
            fssai
              ? `<p class="cert-slot-value">Lic. No. ${esc(fssai)}</p><a class="link-arrow" href="#certifications">View licence ${ic("arrow-right")}</a>`
              : `<p>Awaiting certification. The FSSAI licence number and certificate will be displayed here once issued.</p><span class="cert-slot-badge">${ic("hourglass-half")} Awaiting</span>`
          }
        </div>`;
    }
    const labSlot = $("#labSlot");
    const reportFile = safeUrl(report.file);
    if (labSlot) {
      labSlot.className = `cert-slot ${reportFile ? "is-ready" : "is-awaiting"}`;
      labSlot.innerHTML = `
        <span class="cert-slot-ic">${ic("flask")}</span>
        <div>
          <h3>Laboratory Test Report</h3>
          ${
            reportFile
              ? `<p class="cert-slot-value">${esc(report.lab || "Laboratory report")}${report.date ? ` · ${esc(formatDate(report.date))}` : ""}</p><button type="button" class="btn btn-gold btn-sm" id="viewLabReport">${ic("file-lines")} View report</button>`
              : `<p>Awaiting laboratory testing. The full test report will be available to view and download here.</p><span class="cert-slot-badge">${ic("hourglass-half")} Awaiting</span>`
          }
        </div>`;
      const btn = $("#viewLabReport", labSlot);
      if (btn) btn.addEventListener("click", () => openDocument("Laboratory Test Report", reportFile, [report.lab, report.reportNumber && `Report ${report.reportNumber}`].filter(Boolean).join(" · ")));
    }
  }

  /* ------------------------------------------------------------------
     Animated number counters (.js-count[data-to])
     ------------------------------------------------------------------ */
  function initCounters() {
    const els = $$(".js-count");
    if (!els.length) return;
    const finish = (el) => (el.textContent = Number(el.dataset.to).toFixed(+el.dataset.decimals || 0));
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) return els.forEach(finish);

    const run = (el) => {
      const to = Number(el.dataset.to);
      const dec = +el.dataset.decimals || 0;
      // Counting down from 9 to 0 reads naturally for "0 additives"; others count up from 0.
      const from = to === 0 ? 9 : 0;
      const dur = to === 0 ? 900 : 1600;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = (from + (to - from) * e).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    els.forEach((el) => (el.textContent = (Number(el.dataset.to) === 0 ? 9 : 0).toFixed(+el.dataset.decimals || 0)));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          run(en.target);
        }),
      { threshold: 0.6 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  /** Run just after the browser has painted the first frame. */
  const afterPaint = (fn) => requestAnimationFrame(() => window.setTimeout(fn, 0));

  function init() {
    window.VR_READY = true;
    checkConfig();
    initMap();
    autoReveal();
    initHeader();
    initBusinessBits();
    initDialogs();
    renderProducts();
    initProductFilters();
    injectProductSchema();
    populateSelects();
    initForms();
    initWhatsAppLinks();
    initBatchLookup();
    initVideo();
    observeReveal();

    // Sections far below the fold are rendered right after first paint so they never
    // delay the page appearing.
    afterPaint(() => {
      renderPurity();
      renderCertificates();
      renderReviews();
      renderRecipes();
      initCounters();
      observeReveal();
      layoutChanged();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
