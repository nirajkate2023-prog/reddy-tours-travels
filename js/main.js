/* ========================================================
   REDDY TOURS & TRAVELS — INTERACTIVE JAVASCRIPT
   Revv-Style Booking Engine, Fleet Filters, WhatsApp Connect
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '919860013081';

  // 1. Set Default Date to Today & Minimum to Today
  const travelDateInput = document.getElementById('travelDate');
  if (travelDateInput) {
    const today = new Date().toISOString().split('T')[0];
    travelDateInput.min = today;
    travelDateInput.value = today;
  }

  // 2. Navbar Scroll Effect & Mobile Menu Toggle
  const mainHeader = document.getElementById('mainHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  const menuBackdrop = document.getElementById('menuBackdrop');

  if (menuToggle && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('open');
      if (menuBackdrop) menuBackdrop.classList.toggle('show', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    menuToggle.addEventListener('click', toggleMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', toggleMenu);

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (menuBackdrop) menuBackdrop.classList.remove('show');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Tab Switching for Revv-Style Booking Engine
  const tabButtons = document.querySelectorAll('.booking-tabs .tab-btn');
  const selectedServiceInput = document.getElementById('selectedService');
  const dropCard = document.getElementById('dropCard');
  const packageSelectCard = document.getElementById('packageSelectCard');
  const pickupCity = document.getElementById('pickupCity');
  const dropCity = document.getElementById('dropCity');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabButtons.forEach(b => b.setAttribute('aria-selected', String(b === btn)));

      const serviceKey = btn.getAttribute('data-service');
      const serviceName = btn.querySelector('span').innerText;
      selectedServiceInput.value = serviceName;

      // Update Form layout depending on service
      if (serviceKey === 'local') {
        dropCard.style.display = 'none';
        packageSelectCard.style.display = 'flex';
        pickupCity.placeholder = 'e.g. Mumbai (Andheri, Dadar, BKC) or Pune';
      } else {
        dropCard.style.display = 'flex';
        packageSelectCard.style.display = 'none';
        if (serviceKey === 'mumbai-pune') {
          pickupCity.placeholder = 'e.g. Mumbai Airport, Dadar, Thane, Vashi';
          dropCity.placeholder = 'e.g. Pune Station, Hinjewadi, Kothrud';
        } else if (serviceKey === 'outstation') {
          pickupCity.placeholder = 'e.g. Mumbai, Pune, Nashik, Kolhapur';
          dropCity.placeholder = 'e.g. Goa, Shirdi, Surat, Mahabaleshwar, All India';
        } else if (serviceKey === 'events') {
          pickupCity.placeholder = 'Event City / Banquet Venue Location';
          dropCity.placeholder = 'Hotel / Resort / Drop Location';
        } else if (serviceKey === 'corporate') {
          pickupCity.placeholder = 'Office / IT Park / Employee Residence';
          dropCity.placeholder = 'Company Campus / Factory Shift Hub';
        } else if (serviceKey === 'self-drive') {
          pickupCity.placeholder = 'Self-Drive Pickup City/Hub';
          dropCity.placeholder = 'Destination / Intercity Return City';
        }
      }

      calcEstimate();
    });
  });

  // 4. Dynamic Fare Estimate Calculator
  window.calcEstimate = function() {
    const activeTab = document.querySelector('.booking-tabs .tab-btn.active');
    const serviceKey = activeTab ? activeTab.getAttribute('data-service') : 'mumbai-pune';
    const vehicle = document.getElementById('vehicleModel').value;
    const estPriceDisplay = document.getElementById('estPriceDisplay');

    let estimateText = '₹1,799 - ₹2,499*';

    if (serviceKey === 'mumbai-pune') {
      if (vehicle.includes('Sedan')) estimateText = '₹1,799 - ₹2,199*';
      else if (vehicle.includes('SUV')) estimateText = '₹2,599 - ₹2,999*';
      else if (vehicle.includes('Innova')) estimateText = '₹3,499 - ₹3,999*';
      else if (vehicle.includes('Hatchback')) estimateText = '₹1,699 - ₹1,899*';
      else if (vehicle.includes('Tempo')) estimateText = '₹5,500 - ₹7,000*';
      else estimateText = '₹1,800/day + fuel';
    } else if (serviceKey === 'local') {
      const pkg = document.getElementById('hourlyPackage').value;
      if (pkg.includes('8 Hours')) {
        estimateText = vehicle.includes('SUV') ? '₹2,699*' : '₹1,999*';
      } else if (pkg.includes('10 Hours')) {
        estimateText = vehicle.includes('SUV') ? '₹3,199*' : '₹2,499*';
      } else if (pkg.includes('12 Hours')) {
        estimateText = vehicle.includes('SUV') ? '₹3,699*' : '₹2,999*';
      }
    } else if (serviceKey === 'outstation') {
      if (vehicle.includes('Sedan')) estimateText = '₹11/km (Min 300km/day)';
      else if (vehicle.includes('SUV')) estimateText = '₹14/km (Min 300km/day)';
      else if (vehicle.includes('Innova')) estimateText = '₹18/km (Min 300km/day)';
      else if (vehicle.includes('Tempo')) estimateText = '₹24/km (Min 300km/day)';
      else estimateText = '₹11/km';
    } else if (serviceKey === 'events') {
      estimateText = 'Custom Event Quote';
    } else if (serviceKey === 'corporate') {
      estimateText = 'Monthly Contract Rates';
    } else if (serviceKey === 'self-drive') {
      estimateText = '₹1,499/day onwards';
    }

    if (estPriceDisplay) {
      estPriceDisplay.innerText = estimateText;
    }
  };

  // Add listeners for estimate updating
  const pickupInput = document.getElementById('pickupCity');
  const dropInput = document.getElementById('dropCity');
  if (pickupInput) pickupInput.addEventListener('input', window.calcEstimate);
  if (dropInput) dropInput.addEventListener('input', window.calcEstimate);

  // 5. Booking Form Submission -> WhatsApp
  window.processBooking = function(event) {
    event.preventDefault();

    const service = document.getElementById('selectedService').value;
    const tripType = document.querySelector('input[name="tripType"]:checked')?.value || 'One Way';
    const pickup = document.getElementById('pickupCity').value.trim();
    const drop = document.getElementById('dropCard').style.display !== 'none' ? document.getElementById('dropCity').value.trim() : 'Local City Tour';
    const hourlyPkg = document.getElementById('packageSelectCard').style.display !== 'none' ? document.getElementById('hourlyPackage').value : '';
    const date = document.getElementById('travelDate').value;
    const time = document.getElementById('travelTime').value;
    const vehicle = document.getElementById('vehicleModel').value;
    const phone = document.getElementById('userPhone').value.trim();
    const estPrice = document.getElementById('estPriceDisplay').innerText;

    let msg = `*🚗 CAB BOOKING INQUIRY — REDDY TOURS & TRAVELS*\n`;
    msg += `----------------------------------------\n`;
    msg += `*Service:* ${service}\n`;
    msg += `*Trip Type:* ${tripType}\n`;
    msg += `*Pickup:* ${pickup}\n`;
    if (hourlyPkg) {
      msg += `*Package:* ${hourlyPkg}\n`;
    } else {
      msg += `*Drop:* ${drop}\n`;
    }
    msg += `*Date & Time:* ${date} at ${time}\n`;
    msg += `*Vehicle:* ${vehicle}\n`;
    msg += `*Estimated Range:* ${estPrice}\n`;
    msg += `*Customer Contact:* +91 ${phone}\n`;
    msg += `----------------------------------------\n`;
    msg += `Please confirm driver availability and final fare details. Thank you!`;

    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;

    showToast('Redirecting to WhatsApp to complete your booking...');

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
  };

  // 6. Fleet Filter Pills
  const filterPills = document.querySelectorAll('.fleet-category-pills .pill-btn');
  const carCards = document.querySelectorAll('.fleet-grid .car-item-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterPills.forEach(p => p.setAttribute('aria-pressed', String(p === pill)));

      const filter = pill.getAttribute('data-filter');

      carCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 7. FAQ Accordion
  const faqRows = document.querySelectorAll('.faq-accordion-box .faq-row');
  faqRows.forEach(row => {
    const questionBtn = row.querySelector('.faq-question');
    const answer = row.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = row.classList.contains('active');

      // Close all
      faqRows.forEach(r => {
        r.classList.remove('active');
        r.querySelector('.faq-answer').style.maxHeight = null;
        r.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open selected if wasn't open
      if (!isOpen) {
        row.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 8. Toast Helper
  function showToast(text) {
    const toast = document.getElementById('toastBox');
    const toastMsg = document.getElementById('toastMsg');
    if (toast) {
      if (toastMsg) toastMsg.innerText = text;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }

  // Initial estimate calculation
  calcEstimate();
});
