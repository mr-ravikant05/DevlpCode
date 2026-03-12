/* =========================================================
   DevGrow — External JS only
   - Mobile menu
   - Active nav link
   - Back to top
   - FAQ accordion
   - Portfolio filter
   - Testimonials slider
   - Contact form validation + Firebase toast
========================================================= */

(function () {
  const $ = (q, p = document) => p.querySelector(q);
  const $$ = (q, p = document) => [...p.querySelectorAll(q)];

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const nav = $("#navLinks");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove("open");
      }
    });
  }

  // Active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  // Back to top
  const backTop = $("#backTop");
  const toggleBackTop = () => {
    if (!backTop) return;
    if (window.scrollY > 600) backTop.classList.add("show");
    else backTop.classList.remove("show");
  };
  toggleBackTop();
  window.addEventListener("scroll", toggleBackTop);
  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // FAQ accordion
  $$(".faq-item .faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;
      item.classList.toggle("open");
    });
  });

  // Portfolio filter
  const filterTabs = $$(".tab[data-filter]");
  const works = $$(".work[data-type]");
  if (filterTabs.length && works.length) {
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const filter = tab.dataset.filter;
        works.forEach((w) => {
          const type = w.dataset.type;
          w.style.display = filter === "all" || type === filter ? "" : "none";
        });
      });
    });
  }

  // Testimonials slider
  const slider = $("#testimonialSlider");
  const slidesWrap = slider ? $(".slides", slider) : null;
  const slides = slidesWrap ? $$(".slide", slidesWrap) : [];
  const prevBtn = $("#tPrev");
  const nextBtn = $("#tNext");
  let idx = 0;

  function go(i) {
    if (!slidesWrap || !slides.length) return;
    idx = (i + slides.length) % slides.length;
    slidesWrap.style.transform = `translateX(-${idx * 100}%)`;
  }

  if (prevBtn && nextBtn && slides.length) {
    prevBtn.addEventListener("click", () => go(idx - 1));
    nextBtn.addEventListener("click", () => go(idx + 1));
    setInterval(() => go(idx + 1), 7000);
  }

  // Toast
  const toast = $("#toast");
  const toastMsg = $("#toastMsg");

  function showToast(title, msg) {
    if (!toast) return;
    const strong = $("strong", toast);
    if (strong) strong.textContent = title;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4200);
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  }

  // Contact form + Firebase
  const form = $("#contactForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = $("#name");
      const email = $("#email");
      const topic = $("#topic");
      const message = $("#message");

      const n = name ? name.value.trim() : "";
      const em = email ? email.value.trim() : "";
      const tp = topic ? topic.value.trim() : "";
      const msg = message ? message.value.trim() : "";

      if (n.length < 2) {
        return showToast("Check your name", "Please enter a valid name (min 2 characters).");
      }

      if (!isEmail(em)) {
        return showToast("Invalid email", "Please enter a valid email address.");
      }

      if (!tp) {
        return showToast("Select a topic", "Please choose what you need help with.");
      }

      if (msg.length < 12) {
        return showToast("Message too short", "Please write at least 12 characters.");
      }

      if (!window.db || !window.collection || !window.addDoc) {
        return showToast("Firebase not ready", "Please check your Firebase script in contact.html.");
      }

      try {
        await window.addDoc(window.collection(window.db, "messages"), {
          name: n,
          email: em,
          topic: tp,
          message: msg,
          createdAt: new Date().toISOString()
        });

        form.reset();
        showToast("Message sent!", "Thanks — we’ll reply within 24–48 hours.");
      } catch (err) {
        console.error("Firebase save error:", err);
        showToast("Send failed", "Could not save message. Please try again.");
      }
    });
  }
})();

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Counter animation
const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const counter = entry.target;
    const target = +counter.getAttribute("data-target");

    if (entry.isIntersecting) {
      let count = 0;

      const updateCounter = () => {
        const increment = target / 100;

        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };

      updateCounter();
    } else {
      counter.innerText = "0";
    }
  });
}, { threshold: 0.6 });

counters.forEach((counter) => {
  observer.observe(counter);
});
