/* VR Enterprises — interactions & UI logic */

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initActiveLink();
  initSizeTabs();
  initFAQ();
  initVideoPlay();
  initContactForm();
  initDistributorForm();
  initBatchForm();
  initCookieNotice();
  initLegalModals();
});

/* ---------- Navbar background on scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile menu toggle ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- Scroll reveal animation ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Active nav link based on section in view ---------- */
function initActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navAnchors.length) return;

  const map = new Map();
  navAnchors.forEach((a) => {
    const id = a.getAttribute("href").replace("#", "");
    map.set(id, a);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove("active"));
          const active = map.get(entry.target.id);
          if (active) active.classList.add("active");
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Product size tabs ---------- */
const PRODUCT_DATA = {
  "200ml": {
    label: "200 ml Bottle",
    qty: "200 ml",
    pkg: "Food-grade PET bottle",
    img: "https://images.pexels.com/photos/18708752/pexels-photo-18708752.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "500ml": {
    label: "500 ml Bottle",
    qty: "500 ml",
    pkg: "Food-grade PET bottle",
    img: "https://images.pexels.com/photos/38490934/pexels-photo-38490934.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "1l": {
    label: "1 Litre Bottle",
    qty: "1 Litre",
    pkg: "Food-grade PET bottle",
    img: "https://images.pexels.com/photos/9685233/pexels-photo-9685233.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "2l": {
    label: "2 Litre Bottle",
    qty: "2 Litre",
    pkg: "Food-grade PET bottle",
    img: "https://images.pexels.com/photos/12053219/pexels-photo-12053219.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "5l": {
    label: "5 Litre Can",
    qty: "5 Litre",
    pkg: "Food-grade tin can",
    img: "https://images.pexels.com/photos/6915111/pexels-photo-6915111.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  "10l": {
    label: "10 Litre Can",
    qty: "10 Litre",
    pkg: "Food-grade tin can",
    img: "https://images.pexels.com/photos/12308488/pexels-photo-12308488.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
};

function initSizeTabs() {
  const tabs = document.querySelectorAll(".size-tab");
  const cards = document.querySelectorAll(".product-card");
  if (!tabs.length || !cards.length) return;

  const detailImage = document.getElementById("detailImage");
  const detailSize = document.getElementById("detailSize");
  const detailQty = document.getElementById("detailQty");
  const detailPkg = document.getElementById("detailPkg");

  const selectSize = (size) => {
    tabs.forEach((t) => {
      const active = t.dataset.size === size;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
    });

    cards.forEach((c) => {
      c.classList.remove("dim", "highlight");
      if (c.dataset.size === size) {
        c.classList.add("highlight");
      } else {
        c.classList.add("dim");
      }
    });

    const data = PRODUCT_DATA[size];
    if (data) {
      if (detailImage) {
        detailImage.src = data.img;
        detailImage.alt = `${data.label} — VR cold pressed black mustard oil`;
      }
      if (detailSize) detailSize.textContent = data.label;
      if (detailQty) detailQty.textContent = data.qty;
      if (detailPkg) detailPkg.textContent = data.pkg;
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectSize(tab.dataset.size));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSize(tab.dataset.size);
      }
    });
  });

  cards.forEach((c) => {
    c.addEventListener("click", () => selectSize(c.dataset.size));
    c.style.cursor = "pointer";
  });
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");
    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-a").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ---------- Factory video play ---------- */
function initVideoPlay() {
  const video = document.getElementById("factoryVideo");
  const playBtn = document.getElementById("videoPlayBtn");
  if (!video || !playBtn) return;

  playBtn.addEventListener("click", () => {
    video.play().catch(() => {});
  });

  video.addEventListener("play", () => playBtn.classList.add("hidden"));
  video.addEventListener("pause", () => playBtn.classList.remove("hidden"));
  video.addEventListener("ended", () => playBtn.classList.remove("hidden"));
}

/* ---------- Contact form validation ---------- */
/* ---------- Contact form with Web3Forms ---------- */
function initContactForm() {
  const form = document.getElementById("enquiryForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset note
    note.className = "form-note";
    note.textContent = "Sending...";

    const data = new FormData(form);

    // Validate required fields
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      note.textContent = "Please fill in your name, email and message.";
      note.classList.add("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = "Please enter a valid email address.";
      note.classList.add("error");
      return;
    }

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: data
        }
      );

      const result = await response.json();

      if (result.success) {
        note.textContent = `Thank you, ${name}! Your enquiry has been sent successfully. We'll respond within few minutes.`;
        note.classList.add("success");
        form.reset();
      } else {
        note.textContent = "Sorry, your enquiry could not be sent. Please try again.";
        note.classList.add("error");
        console.error("Web3Forms error:", result);
      }
    } catch (error) {
      note.textContent = "Something went wrong. Please try again later.";
      note.classList.add("error");
      console.error("Web3Forms error:", error);
    }
  });
}
/* ---------- Distributor form with Web3Forms ---------- */
function initDistributorForm() {
  const form = document.getElementById("distributorForm");
  const note = document.getElementById("distributorNote");
  if (!form || !note) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    note.className = "form-note";
    note.textContent = "Sending...";

    const data = new FormData(form);
    
    // Debug logging
    console.log("=== Distributor Form Submission ===");
    for (let [key, value] of data.entries()) {
      console.log(key + ": " + value);
    }

    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const city = (data.get("city") || "").toString().trim();

    if (!name || !email || !phone || !city) {
      note.textContent = "Please fill in all required fields (Name, Email, Phone, City).";
      note.classList.add("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = "Please enter a valid email address.";
      note.classList.add("error");
      return;
    }

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: data
        }
      );

      const result = await response.json();
      console.log("Web3Forms Response:", result);

      if (result.success) {
        note.textContent = `Thank you, ${name}! Your distributor enquiry has been received. Our partnership team will contact you within one business days.`;
        note.classList.add("success");
        form.reset();
      } else {
        note.textContent = result.message || "Sorry, your enquiry could not be sent. Please try again.";
        note.classList.add("error");
        console.error("Web3Forms error:", result);
      }
    } catch (error) {
      note.textContent = "Something went wrong. Please try again later.";
      note.classList.add("error");
      console.error("Web3Forms error:", error);
    }
  });
}

/* ---------- Batch lookup (demo) ---------- */
function initBatchForm() {
  const form = document.getElementById("batchForm");
  const note = document.getElementById("batchNote");
  const input = document.getElementById("batchInput");
  if (!form || !note) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.className = "batch-note";

    const batch = (input.value || "").toString().trim();
    if (!batch) {
      note.textContent = "Please enter a batch number.";
      note.classList.add("error");
      return;
    }

    note.textContent = `Batch ${batch}: Quality report — Purity: Passed, Moisture: Within limit, Adulteration: Not detected. (This is a demo response. Connect to your quality database for real reports.)`;
    note.classList.add("success");
  });
}

/* ---------- Cookie notice ---------- */
function initCookieNotice() {
  const notice = document.getElementById("cookieNotice");
  const accept = document.getElementById("cookieAccept");
  if (!notice || !accept) return;

  if (sessionStorage.getItem("vr-cookie-accepted") === "1") return;

  setTimeout(() => notice.classList.add("show"), 1200);

  accept.addEventListener("click", () => {
    notice.classList.remove("show");
    sessionStorage.setItem("vr-cookie-accepted", "1");
  });
}

/* ---------- Legal modals (Privacy / Terms / Disclaimer) ---------- */
const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    body: `
      <h4>Information We Collect</h4>
      <p>We collect information you provide through our enquiry and distributor forms — including your name, email, phone number, city and message. We also collect anonymous analytics data to improve our website.</p>
      <h4>How We Use Your Information</h4>
      <p>Your information is used solely to respond to your enquiries, process orders and provide customer support. We do not sell or rent your personal data to third parties.</p>
      <h4>Cookies</h4>
      <p>We use cookies to enhance your browsing experience. You can disable cookies in your browser settings, though some features may not function properly.</p>
      <h4>Data Security</h4>
      <p>We take reasonable measures to protect your personal information from unauthorised access, alteration or disclosure.</p>
      <h4>Contact</h4>
      <p>For privacy-related questions, please contact us using the details on our Contact page. <em>[Full policy to be updated with official details.]</em></p>
    `,
  },
  terms: {
    title: "Terms & Conditions",
    body: `
      <h4>Use of Website</h4>
      <p>By accessing this website, you agree to use it for lawful purposes only and in a manner that does not infringe the rights of others.</p>
      <h4>Product Information</h4>
      <p>We strive to keep product information accurate and up to date. However, specifications, pricing and labelling details may change. Always refer to the product label for the most current information.</p>
      <h4>Orders &amp; Pricing</h4>
      <p>All orders are subject to availability and confirmation. Prices are subject to change without notice. <em>[Detailed terms to be updated.]</em></p>
      <h4>Limitation of Liability</h4>
      <p>VR Enterprises shall not be liable for any indirect or consequential damages arising from the use of our products or website.</p>
      <h4>Governing Law</h4>
      <p>These terms are governed by the laws of India. <em>[Jurisdiction to be updated.]</em></p>
    `,
  },
  disclaimer: {
    title: "Disclaimer",
    body: `
      <h4>General Information</h4>
      <p>The information provided on this website is for general informational purposes only. While we strive to keep information accurate, we make no representations of any kind about completeness or accuracy.</p>
      <h4>No Medical or Health Claims</h4>
      <p>VR Enterprises does not make any medical, therapeutic or health claims about its products. Mustard oil uses described on this website are traditional and culinary. Consult a qualified medical professional for health-related questions.</p>
      <h4>Certification &amp; Licensing</h4>
      <p>All FSSAI licence numbers, certification numbers and regulatory details displayed on this website are placeholders pending official documentation. They will be replaced with actual numbers once issued.</p>
      <h4>External Links</h4>
      <p>Our website may contain links to external sites. We are not responsible for the content or practices of those websites.</p>
    `,
  },
};

function initLegalModals() {
  const overlay = document.getElementById("legalModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.getElementById("modalClose");
  if (!overlay) return;

  const openModal = (key) => {
    const content = LEGAL_CONTENT[key];
    if (!content) return;
    modalTitle.textContent = content.title;
    modalBody.innerHTML = content.body;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeModal = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll('a[href="#privacy"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("privacy");
    })
  );
  document.querySelectorAll('a[href="#terms"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("terms");
    })
  );
  document.querySelectorAll('a[href="#disclaimer"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("disclaimer");
    })
  );

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
}
/* ===== Product Modal (Popup) ===== */
function initProductModal() {
  const modal = document.getElementById("productModal");
  const closeBtn = document.getElementById("productModalClose");
  const productCards = document.querySelectorAll(".product-card");
  
  if (!modal || !closeBtn) return;

  // Get references to modal elements
  const modalImage = document.getElementById("modalProductImage");
  const modalTitle = document.getElementById("productModalTitle");
  const modalSize = document.getElementById("modalProductSize");
  const modalQty = document.getElementById("modalProductQty");
  const modalPkg = document.getElementById("modalProductPkg");

  // Product data mapping - matches your product-detail section
  const productData = {
    "200ml": {
      label: "200 ml Bottle",
      qty: "200 ml",
      pkg: "Food-grade PET bottle",
      img: "assets/200ml.png"
    },
    "500ml": {
      label: "500 ml Bottle",
      qty: "500 ml",
      pkg: "Food-grade PET bottle",
      img: "assets/500.png"
    },
    "1l": {
      label: "1 Litre Bottle",
      qty: "1 Litre",
      pkg: "Food-grade PET bottle",
      img: "assets/1kg.png"
    },
    "2l": {
      label: "2 Litre Bottle",
      qty: "2 Litre",
      pkg: "Food-grade PET bottle",
      img: "assets/2kg.png"
    },
    "5l": {
      label: "5 Litre Can",
      qty: "5 Litre",
      pkg: "Food-grade tin can",
      img: "assets/5kg.png"
    },
    "10l": {
      label: "Pack of 1 kg — 5 Pieces",
      qty: "1 Litre * 5",
      pkg: "Food-grade tin can",
      img: "assets/pack.png"
    }
  };

  // Open modal function
  const openProductModal = (size) => {
    const data = productData[size];
    if (!data) return;

    // Update modal content with product details
    if (modalImage) {
      modalImage.src = data.img;
      modalImage.alt = `${data.label} — VR cold pressed black mustard oil`;
    }
    if (modalTitle) modalTitle.textContent = data.label;
    if (modalSize) modalSize.textContent = data.label;
    if (modalQty) modalQty.textContent = data.qty;
    if (modalPkg) modalPkg.textContent = data.pkg;

    // Show modal
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  // Close modal function - make it global for the enquire button
  window.closeProductModal = function() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  // Click on product card to open modal
  productCards.forEach((card) => {
    // Make the whole card clickable
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      // Don't open if clicking on a link or button inside the card
      if (e.target.closest("a") || e.target.closest("button")) return;
      const size = card.dataset.size;
      if (size) openProductModal(size);
    });

    // Also make the product media (image area) clickable
    const media = card.querySelector(".product-media");
    if (media) {
      media.style.cursor = "pointer";
      media.addEventListener("click", (e) => {
        e.stopPropagation();
        const size = card.dataset.size;
        if (size) openProductModal(size);
      });
    }
  });

  // Close modal events
  closeBtn.addEventListener("click", window.closeProductModal);
  
  // Click outside to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) window.closeProductModal();
  });
  
  // Escape key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      window.closeProductModal();
    }
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // ... your other init functions ...
  initProductModal();
});

