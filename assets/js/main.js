/**
 * TRASH QWINS - MAIN INTERACTIVE SCRIPT
 * Brand Colors: Dark Green (#174D32) & Mustard Yellow (#B58A16)
 * Sections 1 to 8 Dynamic Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBusinessTabs();
  initImpactCalculator();
  initPartnerModal();
  initImageLightbox();
});

/**
 * 1. NAVBAR & MOBILE DRAWER NAVIGATION
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle & drawer
  const backdrop = document.getElementById('nav-backdrop');
  const closeBtn = document.getElementById('mobile-close-btn');

  function openMenu() {
    navMenu.classList.add('open');
    mobileToggle.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    mobileToggle.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    // Close mobile nav on link click
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active link scroll spy
  function highlightActiveNavLink() {
    const scrollPosition = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/**
 * 2. CORE BUSINESS AREAS TABS (Section 4)
 */
function initBusinessTabs() {
  const tabButtons = document.querySelectorAll('.business-tab-btn');
  const panes = document.querySelectorAll('.business-pane');

  if (!tabButtons.length || !panes.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update button state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update pane state
      panes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

/**
 * 3. WASTE RECOVERY IMPACT CALCULATOR
 * Simulates real environmental and economic benefits
 */
function initImpactCalculator() {
  const bottlesInput = document.getElementById('calc-bottles');
  const organicsInput = document.getElementById('calc-organics');

  const bottlesValDisplay = document.getElementById('calc-bottles-val');
  const organicsValDisplay = document.getElementById('calc-organics-val');

  const resultGlassKg = document.getElementById('res-glass-kg');
  const resultLarvaeKg = document.getElementById('res-larvae-kg');
  const resultFrassKg = document.getElementById('res-frass-kg');
  const resultCo2Saved = document.getElementById('res-co2-saved');

  if (!bottlesInput || !organicsInput) return;

  function recalculate() {
    const bottlesPerWeek = parseInt(bottlesInput.value, 10) || 0;
    const organicsKgPerWeek = parseInt(organicsInput.value, 10) || 0;

    // Display formatted input values
    bottlesValDisplay.textContent = bottlesPerWeek.toLocaleString();
    organicsValDisplay.textContent = `${organicsKgPerWeek.toLocaleString()} kg`;

    // Calculations:
    // Avg glass bottle weight ~ 0.45 kg
    const annualBottles = bottlesPerWeek * 52;
    const annualGlassTons = (annualBottles * 0.45) / 1000;

    // BSF bioconversion: 1,000 kg organic waste yields ~200 kg live BSF larvae and ~250 kg organic frass
    const annualOrganicsKg = organicsKgPerWeek * 52;
    const annualLarvaeKg = Math.round(annualOrganicsKg * 0.20);
    const annualFrassKg = Math.round(annualOrganicsKg * 0.25);

    // CO2 offset estimate: ~0.3 kg CO2 saved per bottle recycled + ~0.5 kg CO2 per kg organic diverted from landfill
    const co2SavedKg = Math.round((annualBottles * 0.3) + (annualOrganicsKg * 0.5));

    if (resultGlassKg) resultGlassKg.textContent = `${annualGlassTons.toFixed(1)} Tons`;
    if (resultLarvaeKg) resultLarvaeKg.textContent = `${annualLarvaeKg.toLocaleString()} kg`;
    if (resultFrassKg) resultFrassKg.textContent = `${annualFrassKg.toLocaleString()} kg`;
    if (resultCo2Saved) resultCo2Saved.textContent = `${(co2SavedKg / 1000).toFixed(1)} Tons CO₂`;
  }

  bottlesInput.addEventListener('input', recalculate);
  organicsInput.addEventListener('input', recalculate);
  recalculate();
}

/**
 * 4. PARTNER & RECOVERY INQUIRY MODAL
 */
function initPartnerModal() {
  const modal = document.getElementById('partner-modal');
  const openButtons = document.querySelectorAll('.js-open-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const partnerForm = document.getElementById('partner-form');

  if (!modal) return;

  const PARTNER_CATEGORY_MAP = {
    'Hospitality Bottle Recovery': 'Hospitality Recovery',
    'Hospitality Partnership': 'Hospitality Recovery',
    'Community Partnership': 'MRF & CBO Coordination',
    'Aggregation Hub Cooperation': 'MRF & CBO Coordination',
    'Agricultural Inputs': 'BSF Larvae / Frass Offtake',
    'Custom Recovery Plan': 'Training & Advisory',
    'Commercial Partnership': 'General Inquiry',
    'General Contact': 'General Inquiry'
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rawCategory = btn.getAttribute('data-category');
      if (rawCategory && partnerForm) {
        const catSelect = partnerForm.querySelector('select[name="partner_type"]');
        if (catSelect) {
          const mappedCategory = PARTNER_CATEGORY_MAP[rawCategory] || rawCategory;
          const hasOption = Array.from(catSelect.options).some(opt => opt.value === mappedCategory);
          catSelect.value = hasOption ? mappedCategory : 'General Inquiry';
        }
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your inquiry has been received. Our team will contact you promptly.');
      partnerForm.reset();
      closeModal();
    });
  }
}

/**
 * 5. TOAST NOTIFICATION
 */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B58A16" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/**
 * 6. IMAGE LIGHTBOX FOR UPCYCLED GLASSWARE & OPERATIONS
 */
function initImageLightbox() {
  const craftCards = document.querySelectorAll('.craft-card, .strip-item');
  if (!craftCards.length) return;

  // Create modal container if not exists
  let lightbox = document.getElementById('img-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'img-lightbox';
    lightbox.className = 'modal-overlay';
    lightbox.innerHTML = `
      <div class="modal-window" style="max-width: 800px; padding: 0; background: transparent; box-shadow: none;">
        <div style="position: relative; text-align: center;">
          <button class="lightbox-close" style="position: absolute; top: -45px; right: 0; background: rgba(0,0,0,0.6); border: none; color: #fff; font-size: 2rem; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">&times;</button>
          <img id="lightbox-img" src="" alt="Enlarged preview" style="max-height: 80vh; width: auto; max-width: 100%; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.4); margin: 0 auto; display: block;" />
          <p id="lightbox-caption" style="color: #ffffff; background: rgba(15, 51, 33, 0.9); padding: 0.75rem 1.25rem; border-radius: 8px; margin-top: 1rem; display: inline-block; font-weight: 600; font-size: 0.95rem;"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || 'Trash Qwins Circular Economy Gallery';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  craftCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const heading = card.querySelector('h4, h5');
      if (img) {
        openLightbox(img.src, heading ? heading.textContent : '');
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

