import { productsData } from './productData.js';

// JavaScript for interactions
document.addEventListener('DOMContentLoaded', () => {
  // Hero Slider
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  if (slides.length > 0) {
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // Global smooth scroll reveal animations
  const revealElements = document.querySelectorAll('.animate-on-scroll');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // Product Filtering Logic
  const filterCategories = document.querySelectorAll('.filter-category');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('productSearch');

  function updateFilters() {
    // Get checked category
    const checkedCategory = Array.from(filterCategories)
      .find(radio => radio.checked)?.value || 'all';
      
    // Get search term
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // Filter products
    let visibleCount = 0;
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();
      
      const categoryMatch = checkedCategory === 'all' || checkedCategory === cardCategory;
      const searchMatch = !searchTerm || cardText.includes(searchTerm);

      if (categoryMatch && searchMatch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count
    const countElement = document.querySelector('.product-count');
    if (countElement) {
      countElement.innerHTML = `<span class="lang-vi">Hiển thị ${visibleCount} sản phẩm</span><span class="lang-en">Showing ${visibleCount} products</span><span class="lang-ja">${visibleCount} 個の製品を表示</span><span class="lang-ko">${visibleCount}개 제품 표시</span><span class="lang-de">Zeige ${visibleCount} Produkte</span><span class="lang-fr">Affichage de ${visibleCount} produits</span>`;
      // We must call the display updates for languages manually if not dynamically observed,
      // but actually CSS handles the display based on body[data-lang].
    }
  }

  filterCategories.forEach(radio => {
    radio.addEventListener('change', updateFilters);
  });
  
  if (searchInput) {
    searchInput.addEventListener('input', updateFilters);
  }  
  
  // Initial run
  updateFilters();

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Language Switcher Logic
  const body = document.body;
  const langBtns = document.querySelectorAll('.lang-btn');
  const langDropdownBtn = document.getElementById('langDropdownBtn');
  const dropdownMenu = document.querySelector('.lang-switcher .dropdown-menu');
  const currentLangSpan = document.querySelector('.current-lang');

  if (langDropdownBtn && dropdownMenu) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
    });
  }
  
  // Set default language from localStorage or default to 'vi'
  const savedLang = localStorage.getItem('hoainam_lang') || 'vi';
  body.setAttribute('data-lang', savedLang);
  updateActiveLangBtn(savedLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedLang = e.target.dataset.lang;
      body.setAttribute('data-lang', selectedLang);
      localStorage.setItem('hoainam_lang', selectedLang);
      updateActiveLangBtn(selectedLang);
      if (dropdownMenu) dropdownMenu.classList.remove('show');
    });
  });

  function updateActiveLangBtn(lang) {
    if (currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();
    langBtns.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Mobile Menu Logic
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuBtn && mainNav) {
    const hamburgerIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    const closeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = mainNav.classList.toggle('active');
      mobileMenuBtn.innerHTML = isActive ? closeIcon : hamburgerIcon;
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = hamburgerIcon;
      }
    });
  }

  // Product Modal Logic
  const modal = document.getElementById('productModal');
  if (modal && typeof productsData !== 'undefined') {
    const closeBtn = modal.querySelector('.modal-close');
    const mainImg = document.getElementById('modalMainImg');
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalSku = document.getElementById('modalSku');
    const modalTitle = document.getElementById('modalTitle');
    const modalMaterial = document.getElementById('modalMaterial');
    const modalColor = document.getElementById('modalColor');
    const modalMoq = document.getElementById('modalMoq');
    const modalPayment = document.getElementById('modalPayment');
    const modalUsage = document.getElementById('modalUsage');
    const modalInformationText = document.getElementById('modalInformationText');

    function openModal(sku) {
      const data = productsData[sku];
      if (!data) return;

      const lang = document.body.getAttribute('data-lang') || 'vi';

      // Helper to generate multilingual spans
      const renderLang = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return Object.entries(obj).map(([l, text]) => `<span class="lang-${l}">${text}</span>`).join('');
      };

      // Set content
      modalSubtitle.innerHTML = renderLang(data.category);
      modalSku.textContent = data.sku;
      modalTitle.innerHTML = renderLang(data.title);
      modalMaterial.innerHTML = renderLang(data.material);
      
      // Fallback for missing fields
      modalColor.textContent = data.color || "Natural";
      modalMoq.textContent = data.moq || "300 sets";
      modalPayment.textContent = data.paymentTerm || "L/C at sight or T/T 30/70";
      
      const usage = data.usage || {
        vi: "Sử dụng trang trí nhà cửa, khách sạn, nhà hàng và văn phòng",
        en: "Using for home, hotel, restaurant, and office decoration",
        ja: "家庭、ホテル、レストラン、オフィスの装飾用",
        ko: "가정, 호텔, 레스토랑 및 사무실 장식용",
        de: "Für die Dekoration von Häusern, Hotels, Restaurants und Büros",
        fr: "Utilisation pour la décoration de la maison, de l'hôtel, du restaurant et du bureau"
      };
      modalUsage.innerHTML = renderLang(usage);
      
      const infoText = data.information || {
        vi: "Sản phẩm chất lượng cao, màu sắc tự nhiên, bền đẹp.",
        en: "High-quality product, natural color, durable and beautiful.",
        ja: "高品質の製品、自然な色、耐久性があり美しい。",
        ko: "고품질 제품, 자연스러운 색상, 내구성 및 아름다움.",
        de: "Hochwertiges Produkt, natürliche Farbe, langlebig und schön.",
        fr: "Produit de haute qualité, couleur naturelle, durable et beau."
      };
      modalInformationText.innerHTML = renderLang(infoText);

      // Set images (Only the first main image per request)
      mainImg.src = data.images[0];
      thumbnailsContainer.innerHTML = '';
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Attach click listeners to product cards
    productCards.forEach(card => {
      // make it clickable
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        if (id) {
          openModal(id);
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});
