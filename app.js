/**
 * S.K. Electronics & Repairing Centre - Main Javascript
 * Handles theme toggles, mobile drawers, scroll metrics, counter updates, and form validations.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initHeader();
  initMobileNav();
  initScrollProgress();
  initBackToTop();
  initCounters();
  initCarousel();
  initAccordions();
  initServicesSearch();
  initGalleryFilter();
  initBookingForm();
  initPwa();
});

/* --- 1. Theme Toggle System --- */
function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

/* --- 2. Header Scroll Effect --- */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* --- 3. Mobile Navigation Drawer --- */
function initMobileNav() {
  const burger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  if (!burger || !mobileNav) return;

  burger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
    // Toggle hamburger icon between open/close
    const icon = burger.querySelector("i");
    if (icon) {
      if (mobileNav.classList.contains("open")) {
        icon.setAttribute("data-lucide", "x");
      } else {
        icon.setAttribute("data-lucide", "menu");
      }
      if (window.lucide) lucide.createIcons();
    }
  });

  // Close when nav links are clicked
  const links = mobileNav.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      const icon = burger.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", "menu");
        if (window.lucide) lucide.createIcons();
      }
    });
  });
}

/* --- 4. Scroll Progress Indicator --- */
function initScrollProgress() {
  const indicator = document.getElementById("scroll-indicator");
  if (!indicator) return;

  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const percentage = (window.scrollY / totalScroll) * 100;
      indicator.style.width = `${percentage}%`;
    }
  });
}

/* --- 5. Back To Top Trigger --- */
function initBackToTop() {
  const btt = document.getElementById("back-to-top");
  if (!btt) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btt.classList.add("visible");
    } else {
      btt.classList.remove("visible");
    }
  });

  btt.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* --- 6. Animated Statistics Counters --- */
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-target"), 10);
        let count = 0;
        const speed = 2000 / target; // Animate in 2 seconds

        const updateCount = () => {
          count += Math.ceil(target / 100);
          if (count >= target) {
            counter.innerText = target + "+";
            obs.unobserve(counter);
          } else {
            counter.innerText = count + "+";
            setTimeout(updateCount, speed);
          }
        };
        updateCount();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* --- 7. Testimonial Carousel --- */
function initCarousel() {
  const container = document.getElementById("carousel-container");
  const dots = document.querySelectorAll(".carousel-dot");
  if (!container || dots.length === 0) return;

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      // Deactivate all dots
      dots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");

      // Scroll container to corresponding slide
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: slideWidth * index,
        behavior: "smooth"
      });
    });
  });

  // Track active slide on scroll
  container.addEventListener("scroll", () => {
    const slideWidth = container.clientWidth;
    const index = Math.round(container.scrollLeft / slideWidth);
    dots.forEach((d, i) => {
      if (i === index) d.classList.add("active");
      else d.classList.remove("active");
    });
  });
}

/* --- 8. Accordion FAQ System --- */
function initAccordions() {
  const items = document.querySelectorAll(".accordion-item");
  if (items.length === 0) return;

  items.forEach(item => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      
      // Close other opened items
      items.forEach(i => i.classList.remove("open"));

      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

/* --- 9. Live Search and Filter (Services Page) --- */
function initServicesSearch() {
  const searchInput = document.getElementById("service-search");
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".service-card");
  if (!searchInput && tabs.length === 0 && cards.length === 0) return;

  let activeFilter = "All Services";
  let activeSearch = "";

  const filterCards = () => {
    let visibleCount = 0;
    cards.forEach(card => {
      const title = card.querySelector("h3").innerText.toLowerCase();
      const desc = card.querySelector(".card-desc").innerText.toLowerCase();
      const category = card.getAttribute("data-category");

      const matchesSearch = title.includes(activeSearch) || desc.includes(activeSearch);
      const matchesTab = activeFilter === "All Services" || category === activeFilter;

      if (matchesSearch && matchesTab) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    const noResults = document.getElementById("no-results");
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearch = e.target.value.toLowerCase();
      filterCards();
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.getAttribute("data-filter");
      filterCards();
    });
  });
}

/* --- 10. Gallery Masonry Portfolio Filters --- */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-card");
  if (filterButtons.length === 0 || galleryItems.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (category === "All" || itemCategory === category) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

/* --- 11. Custom Form Validation & Success Overlay --- */
function initBookingForm() {
  const form = document.getElementById("booking-form");
  const successModal = document.getElementById("success-modal-overlay");
  const closeModalBtn = document.getElementById("close-success-modal");
  
  if (!form) return;

  // Pre-fill service from URL param
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get("service");
  if (serviceParam) {
    const serviceSelect = document.getElementById("booking-service");
    if (serviceSelect) {
      // Find matching option (case insensitive)
      const options = serviceSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].value.toLowerCase() === decodeURIComponent(serviceParam).toLowerCase()) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    form.querySelectorAll(".form-error").forEach(err => err.style.display = "none");
    form.querySelectorAll(".form-control").forEach(inp => inp.style.borderColor = "");

    // Validate Name
    const nameInput = document.getElementById("booking-name");
    if (nameInput.value.trim().length < 3) {
      const err = nameInput.parentElement.querySelector(".form-error");
      if (err) err.style.display = "block";
      nameInput.style.borderColor = "var(--primary)";
      isValid = false;
    }

    // Validate Phone
    const phoneInput = document.getElementById("booking-phone");
    const phonePattern = /^(97|98)\d{8}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
      const err = phoneInput.parentElement.querySelector(".form-error");
      if (err) err.style.display = "block";
      phoneInput.style.borderColor = "var(--primary)";
      isValid = false;
    }

    // Validate Address
    const addressInput = document.getElementById("booking-address");
    if (addressInput.value.trim().length < 5) {
      const err = addressInput.parentElement.querySelector(".form-error");
      if (err) err.style.display = "block";
      addressInput.style.borderColor = "var(--primary)";
      isValid = false;
    }

    // Validate Service
    const serviceInput = document.getElementById("booking-service");
    if (serviceInput.value === "") {
      const err = serviceInput.parentElement.querySelector(".form-error");
      if (err) err.style.display = "block";
      serviceInput.style.borderColor = "var(--primary)";
      isValid = false;
    }

    if (isValid) {
      // Trigger loader state
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-t-transparent; border-radius:50%; animation:spin 1s linear infinite; vertical-align:middle; margin-right:8px;"></span> Booking...`;
      submitBtn.disabled = true;

      // Simulate API submit delay
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Populate Success Modal Details
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const refId = `SKE-2026-${randomNum}`;
        document.getElementById("ref-id-val").innerText = refId;
        document.getElementById("ref-service-val").innerText = serviceInput.value;

        // Open Modal
        if (successModal) successModal.classList.add("open");
        form.reset();
      }, 1500);
    }
  });

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener("click", () => {
      successModal.classList.remove("open");
    });
  }
}

// Add CSS spin keyframes dynamically
const styleNode = document.createElement("style");
styleNode.innerHTML = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleNode);

/* --- 12. PWA Registration & Connectivity Monitoring --- */
function initPwa() {
  const offlineBadge = document.getElementById("offline-badge");

  // Register sw.js service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
        .then((reg) => console.log("Offline SW Scope:", reg.scope))
        .catch((err) => console.log("SW Register Fail:", err));
    });
  }

  // Update connectivity badge
  const updateOnlineStatus = () => {
    if (offlineBadge) {
      offlineBadge.style.display = navigator.onLine ? "none" : "block";
    }
  };

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();
}
