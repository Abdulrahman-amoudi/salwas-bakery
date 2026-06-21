// ============================================================
//  app.js — Salwa's Bakery  |  Main SPA Application
// ============================================================
// This single file drives the entire front-end.  Views are
// rendered as HTML strings into #app; navigation uses hash
// fragments.  State is kept in a plain object and persisted
// to localStorage / sessionStorage where appropriate.
// ============================================================

// ── Global Application State ────────────────────────────────
const state = {
  currentView:    'landing',   // landing | menu | cart | checkout | order-confirm | staff-login | dashboard
  cart:           [],
  selectedCategory: 'all',
  menuItems:      [],          // loaded from localStorage or DEFAULT_MENU_ITEMS
  orders:         [],          // loaded from localStorage
  isLoggedIn:     false,
  lastOrderNumber: null,
  dashboardTab:   'orders',    // orders | menu-manage
  orderFilter:    'all',       // all | Pending | In Progress | Ready | Completed
  toasts:         [],
  cartOpen:       false,
  checkoutOpen:   false,
  editingItem:    null,        // menu item being edited (null = adding new)
  menuModalOpen:  false,
  searchQuery:    '',
  trackedOrderId: null,
  
  // Settings
  language:       'en',        // en | fr | ar
  theme:          'light',     // light | dark | cream
  fontSize:       'md',        // sm | md | lg | xl
  reducedMotion:  false,
  highContrast:   false,
  settingsOpen:   false,

  // New features state
  mobileMenuOpen: false,
  categoryModalOpen: false,
  addedItems:     {},
  cartBouncing:   false
};

window.state = state;

const SVG_ICONS = {
  all: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`,
  cakes: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2zM12 5V2m-3 0h6M2 17c0 2.2 4 4 10 4s10-1.8 10-4m-20-7v7c0 2.2 4 4 10 4s10-1.8 10-4v-7"/></svg>`,
  cupcakes: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14H18L19.5 21H4.5L6 14ZM12 11c2.5 0 4-1.5 4-3s-1.5-3-4-3-4 1.5-4 3 1.5 3 4 3ZM12 5V2m-2.5.5A1.5 1.5 0 1 1 12 2"/></svg>`,
  cookies: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-1-1.5-1.5-2.5-1.5S17 10 17 8.5s-.5-2.5-1.5-2.5S14 4.5 14 3.5s-.5-1.5-2-1.5zM7.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 2.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8.5-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`,
  pastries: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0-9 9l3 6 4-3 2 4 2-4 4 3 3-6a9 9 0 0 0-9-9zM6 12h12"/></svg>`,
  custom: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v10H4V12m16-4H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zM12 22V8m0 0a4 4 0 0 0 4-4c0-2-2-3-4-1m0 5a4 4 0 0 1-4-4c0-2 2-3 4-1"/></svg>`,
  orders: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  pending: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  completed: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  revenue: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  items: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  browseMenu: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  track: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="2" x2="15" y2="9"></line><line x1="22" y1="2" x2="11" y2="2"></line><line x1="22" y1="2" x2="22" y2="13"></line></svg>`,
  lock: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  logout: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>`,
  settings: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  search: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  location: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  notes: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  print: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
  trash: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  phone: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  wave: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px; display: inline-block; vertical-align: middle;"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5m0-5V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6M8 10V8a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8v-3a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/></svg>`,
  cart: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  basket: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; display: inline-block; color: var(--pink-primary); opacity: 0.8;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  ticket: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  error: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px; color: var(--danger);"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
};


// ╔════════════════════════════════════════════════════════════╗
// ║  INITIALISATION                                           ║
// ╚════════════════════════════════════════════════════════════╝

function init() {
  // Load settings
  loadSettings();
  applySettings();

  // Load persisted categories
  const storedCats = localStorage.getItem('salwa_categories');
  if (storedCats) {
    CATEGORIES = JSON.parse(storedCats);
  }

  // Load persisted menu or fall back to defaults
  const storedMenu = localStorage.getItem('salwa_menu');
  state.menuItems = storedMenu ? JSON.parse(storedMenu) : [...DEFAULT_MENU_ITEMS];

  // Load persisted orders and clean up old format ones (e.g. SB-20260620-001)
  const storedOrders = localStorage.getItem('salwa_orders');
  let loadedOrders = storedOrders ? JSON.parse(storedOrders) : [];
  state.orders = loadedOrders.filter(o => o.orderNumber && /^SB-\d{3,4}$/.test(o.orderNumber));
  if (state.orders.length !== loadedOrders.length) {
    saveOrders();
  }

  // Clean up customer history in localStorage
  const storedHistory = localStorage.getItem('salwa_customer_history');
  if (storedHistory) {
    const history = JSON.parse(storedHistory);
    const cleanedHistory = history.filter(num => /^SB-\d{3,4}$/.test(num));
    if (cleanedHistory.length !== history.length) {
      localStorage.setItem('salwa_customer_history', JSON.stringify(cleanedHistory));
    }
  }

  // Restore cart from sessionStorage (survives page refreshes)
  const storedCart = sessionStorage.getItem('salwa_cart');
  state.cart = storedCart ? JSON.parse(storedCart) : [];

  // Check staff login
  state.isLoggedIn = localStorage.getItem('salwa_logged_in') === 'true' || 
                     sessionStorage.getItem('salwa_logged_in') === 'true';

  // Setup router
  window.addEventListener('hashchange', router);

  // Setup global event delegation on #app
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('submit', handleGlobalSubmit);
  document.addEventListener('change', handleGlobalChange);
  document.addEventListener('input', handleGlobalInput);

  // Listen for storage changes across tabs (e.g. customer ordering on another tab)
  window.addEventListener('storage', handleStorageChange);

  // Route to current hash or default
  router();

  // Trigger cloud sync immediately
  syncWithCloudDatabase(true);

  // Periodically sync with cloud database every 20 seconds
  setInterval(() => syncWithCloudDatabase(false), 20000);
}

function handleStorageChange(e) {
  if (e.key === 'salwa_orders') {
    const oldLength = state.orders.length;
    const storedOrders = localStorage.getItem('salwa_orders');
    state.orders = storedOrders ? JSON.parse(storedOrders) : [];
    
    if (state.currentView === 'dashboard' && state.orders.length > oldLength) {
      playNewOrderChime();
      showToast('New order received!', 'success');
    }
    render();
  }
  if (e.key === 'salwa_menu') {
    const storedMenu = localStorage.getItem('salwa_menu');
    state.menuItems = storedMenu ? JSON.parse(storedMenu) : [...DEFAULT_MENU_ITEMS];
    render();
  }
  if (e.key === 'salwa_categories') {
    const storedCats = localStorage.getItem('salwa_categories');
    if (storedCats) {
      CATEGORIES = JSON.parse(storedCats);
      render();
    }
  }
}

function playNewOrderChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Ding 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.8);
    
    // Ding 2 (slightly delayed and higher pitch)
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6 note
      gain2.gain.setValueAtTime(0.15, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 1.0);
    }, 150);
  } catch (err) {
    console.error('Audio chime failed:', err);
  }
}


document.addEventListener('DOMContentLoaded', init);


// ╔════════════════════════════════════════════════════════════╗
// ║  ROUTER                                                   ║
// ╚════════════════════════════════════════════════════════════╝

function router() {
  const hash = window.location.hash.replace('#', '') || 'landing';

  switch (hash) {
    case 'menu':
      state.currentView = 'menu';
      break;
    case 'staff-login':
      if (state.isLoggedIn) {
        window.location.hash = '#dashboard';
        return;
      }
      state.currentView = 'staff-login';
      break;
    case 'dashboard':
      if (!state.isLoggedIn) { window.location.hash = '#staff-login'; return; }
      state.currentView = 'dashboard';
      break;
    case 'order-confirm':
      state.currentView = 'order-confirm';
      break;
    case 'track-order':
      state.currentView = 'track-order';
      break;
    case 'landing':
    default:
      state.currentView = 'landing';
      break;
  }

  render();
}


// ╔════════════════════════════════════════════════════════════╗
// ║  MAIN RENDER                                              ║
// ╚════════════════════════════════════════════════════════════╝

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  switch (state.currentView) {
    case 'landing':       app.innerHTML = renderLanding();           break;
    case 'menu':          app.innerHTML = renderMenu();              break;
    case 'staff-login':   app.innerHTML = renderStaffLogin();        break;
    case 'dashboard':     app.innerHTML = renderDashboard();         break;
    case 'order-confirm': app.innerHTML = renderOrderConfirmation(); break;
    case 'track-order':   app.innerHTML = renderTrackOrder();        break;
    default:              app.innerHTML = renderLanding();
  }

  // Always ensure the toast container exists
  ensureToastContainer();

  // Append settings modal and category modal to the DOM
  app.innerHTML += renderSettingsModal();
  app.innerHTML += renderCategoryModal();
}


// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: LANDING PAGE                                       ║
// ╚════════════════════════════════════════════════════════════╝

function renderLanding() {
  return `
    <div class="landing-page" style="background-image: url('assets/hero.png')">
      <div class="landing-overlay"></div>
      <div class="landing-content">
        <div class="glass-card landing-card">
          <img src="assets/logo.png" alt="Salwa's Bakery Logo" class="landing-logo" />
          <h1 class="landing-title">Salwa's Bakery</h1>
          <p class="landing-subtitle">${state.language === 'ar' ? 'صنع بكل حب · كندا، GTA' : (state.language === 'fr' ? 'Fait à la main avec amour · Canada, GTA' : 'Handcrafted with Love · Canada, GTA')}</p>
          <div class="landing-buttons">
            <a href="#menu" class="btn btn-primary btn-lg">
              ${SVG_ICONS.browseMenu} ${t('browseMenu')}
            </a>
            <a href="#track-order" class="btn btn-outline btn-lg">
              ${SVG_ICONS.track} ${t('trackYourOrder')}
            </a>
            <a href="#staff-login" class="btn btn-outline btn-sm" style="margin-top: 10px; border-color: rgba(26,26,46,0.2); color: var(--text-gray); display: inline-flex; align-items: center; gap: 6px;">
              ${SVG_ICONS.lock} ${t('staffPortal')}
            </a>
          </div>
          <p class="landing-footer">
            <span>📍 Canada, GTA</span> · 
            <a href="https://www.instagram.com/salwas.bakery" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display: inline-block; vertical-align: middle;">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span>@salwas.bakery</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  COMPONENT: NAVBAR                                        ║
// ╚════════════════════════════════════════════════════════════╝

function renderNavbar(isStaff = false) {
  if (isStaff) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders   = state.orders.filter(o => o.createdAt && o.createdAt.slice(0, 10) === todayStr);
    const pendingOrders = state.orders.filter(o => o.status === 'Pending');
    const revenueToday  = todayOrders.reduce((s, o) => s + (o.total || 0), 0);

    return `
      <nav class="navbar navbar-staff animate-fade-in">
        <!-- Mobile Burger Toggle (only visible on mobile) -->
        <button class="btn-burger mobile-only" data-action="toggle-mobile-menu" aria-label="Toggle Menu">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <a href="#landing" class="navbar-brand">
          <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
          <span>Salwa's Bakery</span>
        </a>

        <!-- Desktop Links (hidden on mobile) -->
        <div class="navbar-links desktop-only">
          <button class="nav-tab ${state.dashboardTab === 'orders' ? 'active' : ''}"
                  data-action="switch-dash-tab" data-tab="orders">
            ${SVG_ICONS.orders} ${t('ordersToday')}
          </button>
          <button class="nav-tab ${state.dashboardTab === 'menu-manage' ? 'active' : ''}"
                  data-action="switch-dash-tab" data-tab="menu-manage">
            ${SVG_ICONS.items} ${t('menuItems')}
          </button>
          <button class="btn-settings" data-action="toggle-settings" aria-label="${t('settings')}" style="background: none; border: none; color: var(--text-dark); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; transition: background 0.2s;">
            ${SVG_ICONS.settings}
          </button>
          <button class="btn btn-outline btn-sm" data-action="staff-logout" style="display: inline-flex; align-items: center; gap: 6px;">
            ${SVG_ICONS.logout} ${t('logout')}
          </button>
        </div>

        <!-- Mobile Right Items (only visible on mobile) -->
        <div class="mobile-right-items mobile-only">
          <button class="btn-logout-icon" data-action="staff-logout" aria-label="${t('logout')}">
            ${SVG_ICONS.logout}
          </button>
        </div>

        <!-- Mobile Sidebar Navigation Drawer -->
        <div class="mobile-nav-overlay ${state.mobileMenuOpen ? 'open' : ''}" data-action="toggle-mobile-menu"></div>
        <aside class="mobile-nav-sidebar ${state.mobileMenuOpen ? 'open' : ''}">
          <div class="mobile-nav-header">
            <div class="navbar-brand">
              <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
              <span>Salwa's Bakery</span>
            </div>
            <button class="btn-close" data-action="toggle-mobile-menu">&times;</button>
          </div>
          
          <!-- Live Stats (Mobile only burger drawer) -->
          <div class="mobile-drawer-stats">
            <div class="drawer-stat-item">
              <span class="drawer-stat-icon">${SVG_ICONS.orders}</span>
              <div class="drawer-stat-info">
                <span class="drawer-stat-value">${todayOrders.length}</span>
                <span class="drawer-stat-label">${t('ordersToday') || 'Orders Today'}</span>
              </div>
            </div>
            <div class="drawer-stat-item">
              <span class="drawer-stat-icon">${SVG_ICONS.pending}</span>
              <div class="drawer-stat-info">
                <span class="drawer-stat-value">${pendingOrders.length}</span>
                <span class="drawer-stat-label">${t('pending') || 'Pending'}</span>
              </div>
            </div>
            <div class="drawer-stat-item">
              <span class="drawer-stat-icon">${SVG_ICONS.revenue}</span>
              <div class="drawer-stat-info">
                <span class="drawer-stat-value">${formatCurrency(revenueToday)}</span>
                <span class="drawer-stat-label">${t('revenueToday') || 'Revenue Today'}</span>
              </div>
            </div>
          </div>

          <div class="mobile-nav-body">
            <button class="mobile-nav-item mobile-nav-btn ${state.dashboardTab === 'orders' ? 'active' : ''}"
                    data-action="switch-dash-tab-mobile" data-tab="orders">
              ${SVG_ICONS.orders}
              <span>${t('ordersToday')}</span>
            </button>
            <button class="mobile-nav-item mobile-nav-btn ${state.dashboardTab === 'menu-manage' ? 'active' : ''}"
                    data-action="switch-dash-tab-mobile" data-tab="menu-manage">
              ${SVG_ICONS.items}
              <span>${t('menuItems')}</span>
            </button>
            <button class="mobile-nav-item mobile-nav-btn" data-action="mobile-open-settings">
              ${SVG_ICONS.settings}
              <span>${t('settings')}</span>
            </button>
            <button class="mobile-nav-item mobile-nav-btn" data-action="staff-logout-mobile" style="margin-top: 20px; border-top: 1px solid var(--gray-border); padding-top: 20px;">
              ${SVG_ICONS.logout}
              <span>${t('logout')}</span>
            </button>
          </div>
        </aside>
      </nav>
    `;
  }

  // Customer navbar
  return `
    <nav class="navbar animate-fade-in">
      <!-- Mobile Burger Toggle (only visible on mobile) -->
      <button class="btn-burger mobile-only" data-action="toggle-mobile-menu" aria-label="Toggle Menu">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <a href="#landing" class="navbar-brand">
        <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
        <span>Salwa's Bakery</span>
      </a>

      <!-- Desktop Links (hidden on mobile) -->
      <div class="navbar-links desktop-only">
        <a href="#landing" class="nav-link">
          <svg class="nav-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>${t('home')}</span>
        </a>
        <a href="#track-order" class="nav-link">
          <svg class="nav-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>${t('trackOrder')}</span>
        </a>
        <button class="btn-settings" data-action="toggle-settings" aria-label="${t('settings')}">
          ${SVG_ICONS.settings}
        </button>
        <button class="btn-cart ${state.cartBouncing ? 'cart-bounce-active' : ''}" data-action="toggle-cart">
          <svg class="cart-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          ${getCartCount() > 0 ? `<span class="cart-badge">${getCartCount()}</span>` : ''}
        </button>
      </div>

      <!-- Mobile Right Items (only visible on mobile, keeping cart visible) -->
      <div class="mobile-right-items mobile-only">
        <button class="btn-cart ${state.cartBouncing ? 'cart-bounce-active' : ''}" data-action="toggle-cart">
          <svg class="cart-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          ${getCartCount() > 0 ? `<span class="cart-badge">${getCartCount()}</span>` : ''}
        </button>
      </div>
      
      <!-- Mobile Sidebar Navigation Drawer -->
      <div class="mobile-nav-overlay ${state.mobileMenuOpen ? 'open' : ''}" data-action="toggle-mobile-menu"></div>
      <aside class="mobile-nav-sidebar ${state.mobileMenuOpen ? 'open' : ''}">
        <div class="mobile-nav-header">
          <div class="navbar-brand">
            <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
            <span>Salwa's Bakery</span>
          </div>
          <button class="btn-close" data-action="toggle-mobile-menu">&times;</button>
        </div>
        <div class="mobile-nav-body">
          <a href="#landing" class="mobile-nav-item" data-action="toggle-mobile-menu">
            <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>${t('home')}</span>
          </a>
          <a href="#track-order" class="mobile-nav-item" data-action="toggle-mobile-menu">
            <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>${t('trackOrder')}</span>
          </a>
          <button class="mobile-nav-item mobile-nav-btn" data-action="mobile-open-settings">
            ${SVG_ICONS.settings}
            <span>${t('settings')}</span>
          </button>
          <a href="#staff-login" class="mobile-nav-item" data-action="toggle-mobile-menu" style="margin-top: 20px; border-top: 1px solid var(--gray-border); padding-top: 20px;">
            ${SVG_ICONS.lock}
            <span>${t('staffPortal')}</span>
          </a>
        </div>
      </aside>
    </nav>
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: MENU                                               ║
// ╚════════════════════════════════════════════════════════════╝

function renderMenu() {
  // Filter items
  const filtered = state.selectedCategory === 'all'
    ? state.menuItems
    : state.menuItems.filter(i => i.category === state.selectedCategory);

  // Apply search
  const items = state.searchQuery
    ? filtered.filter(i =>
        i.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(state.searchQuery.toLowerCase()))
    : filtered;

  return `
    ${renderNavbar(false)}

    <div class="menu-page">
      <!-- Header -->
      <div class="menu-header">
        <h2 class="menu-title">${t('ourMenu')}</h2>
        <p class="menu-subtitle">${t('freshBaked')}</p>
        <div class="menu-search">
          <input type="text" id="menuSearch" class="search-input"
                 placeholder="🔍 ${t('searchMenu')}" value="${escapeHtml(state.searchQuery)}" />
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        ${CATEGORIES.map(cat => `
          <button class="cat-tab ${state.selectedCategory === cat.id ? 'active' : ''}"
                  data-action="select-category" data-category="${cat.id}">
            <span class="cat-icon">${getCategoryIcon(cat.id)}</span>
            <span class="cat-name">${cat.name}</span>
          </button>
        `).join('')}
      </div>

      <!-- Menu Grid -->
      <div class="menu-grid">
        ${items.length === 0
          ? `<div class="empty-state"><p style="font-size:3rem; opacity:0.3; display:inline-block; margin-bottom:8px;">${SVG_ICONS.search}</p><p>No items found</p></div>`
          : items.map((item, index) => `
            <div class="menu-card" style="animation-delay: ${index * 0.06}s">
              <div class="card-image">
                <img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" />
                <span class="card-category">${getCategoryIcon(item.category)} ${capitalize(item.category)}</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">${escapeHtml(item.name)}</h3>
                <p class="card-desc">${escapeHtml(item.description)}</p>
                <div class="card-footer">
                  <span class="card-price">${formatCurrency(item.price)}</span>
                  <button class="btn ${state.addedItems[item.id] ? 'btn-success btn-added' : 'btn-primary'} btn-sm" data-action="add-to-cart" data-id="${item.id}">
                    ${state.addedItems[item.id] ? `✓ ${t('addedSuccess')}` : `+ ${t('addToCart')}`}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
      </div>
    </div>

    <!-- Cart Sidebar -->
    ${renderCartSidebar()}

    <!-- Checkout Modal -->
    ${renderCheckoutModal()}
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  COMPONENT: CART SIDEBAR                                  ║
// ╚════════════════════════════════════════════════════════════╝

function renderCartSidebar() {
  return `
    <div class="cart-overlay ${state.cartOpen ? 'open' : ''}" data-action="toggle-cart"></div>
    <aside class="cart-sidebar ${state.cartOpen ? 'open' : ''}">
      <div class="cart-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">${SVG_ICONS.cart} ${t('yourCart')}</h3>
        <button class="btn-close" data-action="toggle-cart">&times;</button>
      </div>

      <div class="cart-body">
        ${state.cart.length === 0
          ? `<div class="empty-state">
               <p style="font-size:3rem; margin:0; display:inline-block;">${SVG_ICONS.basket}</p>
               <p>${t('cartEmpty')}</p>
               <p class="text-muted">${t('addTreats')}</p>
             </div>`
          : state.cart.map(ci => {
              const item = state.menuItems.find(m => m.id === ci.id);
              if (!item) return '';
              return `
                <div class="cart-item">
                  <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-item-img" />
                  <div class="cart-item-info">
                    <h4>${escapeHtml(item.name)}</h4>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                    <div class="qty-controls">
                      <button class="qty-btn" data-action="update-qty" data-id="${ci.id}" data-delta="-1">−</button>
                      <span class="qty-value">${ci.qty}</span>
                      <button class="qty-btn" data-action="update-qty" data-id="${ci.id}" data-delta="1">+</button>
                    </div>
                  </div>
                  <button class="btn-remove" data-action="remove-from-cart" data-id="${ci.id}">&times;</button>
                </div>
              `;
            }).join('')}
      </div>

      ${state.cart.length > 0 ? `
        <div class="cart-footer">
          <div class="cart-order-preview">
            ${SVG_ICONS.ticket} <span>${t('estOrderId')}: ${generateOrderNumber()}</span>
          </div>
          <div class="cart-total">
            <span>${t('total')}</span>
            <span class="total-price">${formatCurrency(getCartTotal())}</span>
          </div>
          <button class="btn btn-primary btn-block" data-action="open-checkout">
            ${t('proceedCheckout')}
          </button>
        </div>
      ` : ''}
    </aside>
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  COMPONENT: CHECKOUT MODAL                                ║
// ╚════════════════════════════════════════════════════════════╝

function renderCheckoutModal() {
  return `
    <div class="modal-overlay ${state.checkoutOpen ? 'open' : ''}" data-action="close-checkout">
      <div class="modal checkout-modal ${state.checkoutOpen ? 'open' : ''}">
        <div class="modal-header">
          <h3>${SVG_ICONS.orders} ${t('checkout')}</h3>
          <button class="btn-close" data-action="close-checkout">&times;</button>
        </div>
        <form id="checkoutForm" data-form="checkout">
          <div class="form-group">
            <label for="custName">${t('customerName')} *</label>
            <input type="text" id="custName" name="customerName" required placeholder="${t('customerName')}" />
          </div>
          <div class="form-group">
            <label for="custPhone">${t('phone')} *</label>
            <input type="tel" id="custPhone" name="phone" required placeholder="${t('phone')}" />
          </div>
          <div class="form-group">
            <label for="custLocation">${t('location')} *</label>
            <div class="input-with-icon" style="position: relative; display: flex; align-items: center;">
              <input type="text" id="custLocation" name="location" required placeholder="${t('locationPlaceholder')}" autocomplete="off" style="padding-right: 36px; width: 100%;" />
              <span class="location-search-icon" style="position: absolute; right: 12px; color: var(--text-light); cursor: pointer; display: inline-flex; align-items: center;">${SVG_ICONS.search}</span>
            </div>
            <!-- Autocomplete suggestions dropdown -->
            <div id="locationSuggestions" class="location-suggestions-dropdown" style="display: none;"></div>
            <!-- Map preview container -->
            <div id="locationMapPreview" class="location-map-preview-container" style="display: block; margin-top: 12px; overflow: hidden; border-radius: 12px; border: 1px solid var(--gray-border); box-shadow: var(--shadow-sm);">
              <div id="checkoutMap" style="height: 180px; width: 100%;"></div>
              <div id="locationMetaInfo" style="padding: 12px; background: var(--white); border-top: 1px solid var(--gray-border); display: flex; align-items: center; gap: 12px;">
                <img id="locationMetaPic" src="assets/logo.png" alt="Location preview" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" />
                <div>
                  <h5 id="locationMetaTitle" style="margin: 0; font-family: var(--font-family); color: var(--text-dark); font-size: 0.9rem;">Toronto, Canada</h5>
                  <p id="locationMetaDesc" class="text-muted" style="margin: 0; font-size: 0.75rem;">Selected location</p>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="orderNotes">${t('specialNotes')}</label>
            <textarea id="orderNotes" name="notes" rows="3" placeholder="..."></textarea>
          </div>

          <div class="checkout-summary">
            <h4>${t('orderSummary')}</h4>
            ${state.cart.map(ci => {
              const item = state.menuItems.find(m => m.id === ci.id);
              if (!item) return '';
              return `<div class="summary-row">
                <span>${escapeHtml(item.name)} × ${ci.qty}</span>
                <span>${formatCurrency(item.price * ci.qty)}</span>
              </div>`;
            }).join('')}
            <div class="summary-row summary-total">
              <span>${t('total')}</span>
              <span>${formatCurrency(getCartTotal())}</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            ${SVG_ICONS.completed} ${t('placeOrder')}
          </button>
        </form>
      </div>
    </div>
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: ORDER CONFIRMATION                                 ║
// ╚════════════════════════════════════════════════════════════╝

function renderOrderConfirmation() {
  const order = state.orders.find(o => o.orderNumber === state.lastOrderNumber);

  if (!order) {
    return `
      ${renderNavbar(false)}
      <div class="confirm-page">
        <div class="empty-state">
          <p>${t('orderNotFound')}</p>
          <a href="#menu" class="btn btn-primary">${t('backMenu')}</a>
        </div>
      </div>
    `;
  }

  return `
    ${renderNavbar(false)}
    <div class="confirm-page">
      <div class="confirm-card glass-card">
        <div class="confirm-icon">✓</div>
        <h2>${t('placedSuccess')}</h2>
        <div class="order-number-box">${order.orderNumber}</div>

        <div class="confirm-details">
          <h4>${t('orderSummary')}</h4>
          ${order.items.map(ci => `
            <div class="summary-row">
              <span>${escapeHtml(ci.name)} × ${ci.qty}</span>
              <span>${formatCurrency(ci.price * ci.qty)}</span>
            </div>
          `).join('')}
          <div class="summary-row summary-total">
            <span>${t('total')}</span>
            <span>${formatCurrency(order.total)}</span>
          </div>
        </div>

        <div class="confirm-info">
          <p><strong>${t('customer')}:</strong> ${escapeHtml(order.customerName)}</p>
          <p><strong>${t('phone')}:</strong> ${escapeHtml(order.phone)}</p>
          <p><strong>${t('location')}:</strong> ${escapeHtml(order.location)}</p>
          ${order.notes ? `<p><strong>${t('specialNotes')}:</strong> ${escapeHtml(order.notes)}</p>` : ''}
        </div>

        <p class="confirm-msg" style="display: flex; align-items: center; justify-content: center; gap: 6px;">
          ${SVG_ICONS.phone} <span>${t('contactConfirm')}</span>
        </p>

        <a href="#menu" class="btn btn-primary btn-lg">← ${t('backMenu')}</a>
      </div>
    </div>
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: ORDER TRACKING                                     ║
// ╚════════════════════════════════════════════════════════════╝

function renderTrackOrder() {
  const recentOrders = getCustomerOrderHistory();
  const trackedOrder = state.trackedOrderId 
    ? state.orders.find(o => o.orderNumber.toUpperCase() === state.trackedOrderId.toUpperCase()) 
    : null;

  return `
    ${renderNavbar(false)}
    <div class="track-page">
      <div class="track-container glass-card animate-fade-in">
        <div class="track-header">
          <h2 style="display: flex; align-items: center; justify-content: center; gap: 8px;">${SVG_ICONS.track} ${t('trackYourOrder')}</h2>
          <p class="text-muted">${t('enterOrderNum')}</p>
        </div>

        <form class="track-form" data-form="track">
          <input type="text" name="orderNumber" required 
                 placeholder="e.g. SB-101" 
                 value="${state.trackedOrderId || ''}" 
                 class="search-input track-input" />
          <button type="submit" class="btn btn-primary">${t('trackOrder')}</button>
        </form>

        ${state.trackedOrderId ? `
          ${trackedOrder ? `
            <div class="track-results animate-fade-in">
              <div class="track-order-meta">
                <div>
                  <span class="order-id-label">${t('orderNum')}</span>
                  <h3 class="order-id-value">${trackedOrder.orderNumber}</h3>
                </div>
                <div class="status-badge-container">
                  <span class="order-id-label">${t('currentStatus')}</span>
                  <span class="status-badge status-${slugify(trackedOrder.status)}">${t(slugify(trackedOrder.status))}</span>
                </div>
              </div>

              <!-- Tracking Stepper -->
              ${renderTrackingStepper(trackedOrder.status)}

              <div class="track-details">
                <h4>${t('orderSummary')}</h4>
                ${trackedOrder.items.map(ci => `
                  <div class="summary-row">
                    <span>${escapeHtml(ci.name)} × ${ci.qty}</span>
                    <span>${formatCurrency(ci.price * ci.qty)}</span>
                  </div>
                `).join('')}
                <div class="summary-row summary-total">
                  <span>${t('totalPaid')}</span>
                  <span>${formatCurrency(trackedOrder.total)}</span>
                </div>
                <div class="track-meta-info">
                  <p><strong>${t('customer')}:</strong> ${escapeHtml(trackedOrder.customerName)}</p>
                  <p><strong>${t('location')}:</strong> ${escapeHtml(trackedOrder.location)}</p>
                  <p><strong>${t('datePlaced')}:</strong> ${formatDateFull(new Date(trackedOrder.createdAt))} ${state.language === 'ar' ? 'في' : (state.language === 'fr' ? 'à' : 'at')} ${formatTime(trackedOrder.createdAt)}</p>
                  ${trackedOrder.notes ? `<p><strong>${t('specialNotes')}:</strong> ${escapeHtml(trackedOrder.notes)}</p>` : ''}
                </div>
              </div>
            </div>
          ` : `
            <div class="empty-state animate-fade-in">
              <p style="font-size:3rem; opacity:0.3; display:inline-block;">${SVG_ICONS.track}</p>
              <h3>${t('orderNotFound')}</h3>
              <p class="text-muted">${state.language === 'ar' ? `لم نتمكن من العثور على طلب بالرقم <strong>"${escapeHtml(state.trackedOrderId)}"</strong>. يرجى التحقق مرة أخرى.` : (state.language === 'fr' ? `Impossible de trouver une commande avec le numéro <strong>"${escapeHtml(state.trackedOrderId)}"</strong>.` : `We couldn't find an order with number <strong>"${escapeHtml(state.trackedOrderId)}"</strong>. Please double-check and try again.`)}</p>
            </div>
          `}
        ` : ''}

        ${recentOrders.length > 0 ? `
          <div class="recent-tracks">
            <h4>${t('recentOrders')}</h4>
            <div class="recent-tracks-list">
              ${recentOrders.map(num => {
                const o = state.orders.find(ord => ord.orderNumber === num);
                if (!o) return '';
                return `
                  <div class="recent-track-item" data-action="select-track-order" data-id="${o.orderNumber}">
                    <div class="recent-track-meta">
                      <span class="recent-num">${o.orderNumber}</span>
                      <span class="recent-date">${formatDate(o.createdAt)}</span>
                    </div>
                    <div class="recent-track-status" style="display: flex; align-items: center; gap: 8px;">
                      <span class="status-badge status-${slugify(o.status)}">${t(slugify(o.status))}</span>
                      <span class="recent-total">${formatCurrency(o.total)}</span>
                      <button class="btn-remove-track" data-action="remove-track-history" data-id="${o.orderNumber}" title="Remove from history">&times;</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : `
          ${!state.trackedOrderId ? `
            <div class="track-intro-graphic">
              <div class="pastry-float-icon">🧁</div>
              <p class="text-muted">${state.language === 'ar' ? 'قدم طلبك في المتجر وتتبع مسار تحضيره خطوة بخطوة!' : (state.language === 'fr' ? 'Passez une commande en boutique et suivez sa préparation en direct !' : 'Place an order in the store, and check its progress live as our chefs prepare it!')}</p>
            </div>
          ` : ''}
        `}
      </div>
    </div>
  `;
}

function renderTrackingStepper(status) {
  const steps = [
    { label: t('orderReceived'), status: 'Pending', icon: SVG_ICONS.orders, desc: t('orderReceivedDesc') },
    { label: t('completed'), status: 'Completed', icon: SVG_ICONS.completed, desc: t('completedDesc') }
  ];

  const currentIndex = steps.findIndex(s => s.status === status);

  return `
    <div class="tracking-stepper">
      ${steps.map((step, idx) => {
        let stepClass = 'step-upcoming';
        if (idx < currentIndex) stepClass = 'step-completed';
        else if (idx === currentIndex) stepClass = 'step-active';

        return `
          <div class="stepper-step ${stepClass}">
            <div class="step-icon-wrapper">
              <span class="step-icon">${step.icon}</span>
              ${idx < steps.length - 1 ? `<div class="step-connector"></div>` : ''}
            </div>
            <div class="step-content">
              <span class="step-label">${step.label}</span>
              <span class="step-desc">${step.desc}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function trackOrderSubmit(form) {
  const fd = new FormData(form);
  const orderNumber = fd.get('orderNumber').trim().toUpperCase();
  if (orderNumber) {
    state.trackedOrderId = orderNumber;
    saveCustomerOrder(orderNumber);
    syncWithCloudDatabase(true).then(() => {
      render();
    });
  }
}



// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: STAFF LOGIN                                        ║
// ╚════════════════════════════════════════════════════════════╝

function renderStaffLogin() {
  return `
    <nav class="navbar">
      <a href="#landing" class="navbar-brand">
        <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
        <span>Salwa's Bakery</span>
      </a>
    </nav>

    <div class="login-page">
      <div class="glass-card login-card">
        <div class="login-icon" style="display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 50%; background: var(--pink-lightest); color: var(--pink-primary); margin: 0 auto 20px;">${SVG_ICONS.lock}</div>
        <h2>Staff Portal</h2>
        <p class="text-muted">Sign in to manage orders</p>

        <form id="loginForm" data-form="login">
          <div class="form-group">
            <label for="loginUser">Username</label>
            <input type="text" id="loginUser" name="username" required placeholder="Username" autocomplete="username" />
          </div>
          <div class="form-group">
            <label for="loginPass">Password</label>
            <input type="password" id="loginPass" name="password" required placeholder="Password" autocomplete="current-password" />
          </div>
          <div class="form-group remember-me-group" style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <input type="checkbox" id="loginRemember" name="remember" checked style="width: auto; height: auto; margin: 0; cursor: pointer;" />
            <label for="loginRemember" style="margin: 0; font-weight: normal; cursor: pointer; font-size: 0.9rem;">Remember this device</label>
          </div>
          <div id="loginError" class="login-error" style="display:none;">
            ${SVG_ICONS.error} Invalid username or password
          </div>
          <button type="submit" class="btn btn-primary btn-block">Sign In</button>
        </form>

        <a href="#landing" class="back-link">← Back to Home</a>
      </div>
    </div>
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: STAFF DASHBOARD                                    ║
// ╚════════════════════════════════════════════════════════════╝

function renderDashboard() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders   = state.orders.filter(o => o.createdAt && o.createdAt.slice(0, 10) === todayStr);
  const pendingOrders = state.orders.filter(o => o.status === 'Pending');
  const revenueToday  = todayOrders.reduce((s, o) => s + (o.total || 0), 0);

  return `
    ${renderNavbar(true)}

    <div class="dashboard-page">
      <!-- Dashboard Header -->
      <div class="dash-header">
        <div>
          <h2 style="display: flex; align-items: center; gap: 8px;">Welcome Back ${SVG_ICONS.wave}</h2>
          <p>${formatDateFull(new Date())}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">${SVG_ICONS.orders}</div>
          <div class="stat-info">
            <span class="stat-value">${todayOrders.length}</span>
            <span class="stat-label">Orders Today</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">${SVG_ICONS.pending}</div>
          <div class="stat-info">
            <span class="stat-value">${pendingOrders.length}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">${SVG_ICONS.revenue}</div>
          <div class="stat-info">
            <span class="stat-value">${formatCurrency(revenueToday)}</span>
            <span class="stat-label">Revenue Today</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">${SVG_ICONS.items}</div>
          <div class="stat-info">
            <span class="stat-value">${state.menuItems.length}</span>
            <span class="stat-label">Menu Items</span>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      ${state.dashboardTab === 'orders' ? renderOrdersTab() : renderMenuManageTab()}
    </div>

    <!-- Menu Item Modal (for add / edit) -->
    ${renderMenuItemModal()}
  `;
}


// ── Dashboard: Orders Tab ────────────────────────────────────

function renderOrdersTab() {
  const filterStatuses = ['all', ...ORDER_STATUSES];

  let orders = [...state.orders].reverse();  // newest first
  if (state.orderFilter !== 'all') {
    orders = orders.filter(o => o.status === state.orderFilter);
  }

  return `
    <div class="dash-section">
      <div class="section-header">
        <h3>📋 Orders</h3>
        <div class="filter-buttons">
          ${filterStatuses.map(s => `
            <button class="filter-btn ${state.orderFilter === s ? 'active' : ''}"
                    data-action="filter-orders" data-status="${s}">
              ${s === 'all' ? 'All' : s}
            </button>
          `).join('')}
        </div>
      </div>

      ${orders.length === 0
        ? `<div class="empty-state">
             <p style="font-size:3rem; opacity:0.3; display:inline-block;">${SVG_ICONS.orders}</p>
             <p>No orders ${state.orderFilter !== 'all' ? `with status "${state.orderFilter}"` : 'yet'}</p>
           </div>`
        : `
          <!-- Desktop Orders Table -->
          <div class="orders-table-wrapper desktop-only">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr>
                    <td class="order-num">${o.orderNumber}</td>
                    <td>
                      <strong>${escapeHtml(o.customerName)}</strong><br/>
                      <span class="text-muted">${escapeHtml(o.phone || '')}</span><br/>
                      <span class="order-loc-badge">${SVG_ICONS.location} ${escapeHtml(o.location || '')}</span>
                      ${o.notes ? `<br/><span class="order-notes-badge">${SVG_ICONS.notes} ${escapeHtml(o.notes)}</span>` : ''}
                    </td>
                    <td class="items-cell">
                      ${(o.items || []).map(i => `${escapeHtml(i.name)} ×${i.qty}`).join('<br/>')}
                    </td>
                    <td>${formatCurrency(o.total)}</td>
                    <td><span class="status-badge status-${slugify(o.status)}">${o.status}</span></td>
                    <td class="text-muted">${formatTime(o.createdAt)}</td>
                    <td class="actions-cell">
                      <div class="action-buttons-group">
                        ${o.status === 'Pending' ? `
                          <button class="btn btn-success btn-sm btn-quick" data-action="quick-status" data-order-id="${o.orderNumber}" data-status="Completed">
                            ${SVG_ICONS.completed} ${t('complete')}
                          </button>
                        ` : ''}
                        <button class="btn btn-outline btn-sm btn-print" data-action="print-order" data-id="${o.orderNumber}">
                          ${SVG_ICONS.print} ${t('print')}
                        </button>
                        <button class="btn btn-danger btn-sm" data-action="delete-order" data-id="${o.orderNumber}" title="Delete Order">
                          ${SVG_ICONS.trash}
                        </button>
                      </div>
                      
                      <select class="status-select" data-action="update-order-status" data-order-id="${o.orderNumber}">
                        ${ORDER_STATUSES.map(s => `
                          <option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>
                        `).join('')}
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Mobile Orders Card Layout (No swiping required) -->
          <div class="orders-cards-mobile mobile-only">
            ${orders.map(o => `
              <div class="mobile-order-card animate-fade-in">
                <div class="card-header">
                  <span class="order-num">${o.orderNumber}</span>
                  <span class="status-badge status-${slugify(o.status)}">${o.status}</span>
                </div>
                <div class="card-body-details">
                  <div class="cust-sec">
                    <strong>${escapeHtml(o.customerName)}</strong>
                    ${o.phone ? `<br/><a href="tel:${escapeHtml(o.phone)}" class="phone-link">${escapeHtml(o.phone)}</a>` : ''}
                  </div>
                  <div class="loc-sec">
                    ${SVG_ICONS.location} <span>${escapeHtml(o.location || '')}</span>
                  </div>
                  ${o.notes ? `
                    <div class="notes-sec">
                      ${SVG_ICONS.notes} <span>${escapeHtml(o.notes)}</span>
                    </div>
                  ` : ''}
                  <div class="items-sec">
                    ${(o.items || []).map(i => `
                      <div class="item-row">
                        <span>${escapeHtml(i.name)}</span>
                        <span>×${i.qty}</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="total-sec">
                    <span>Total:</span>
                    <strong>${formatCurrency(o.total)}</strong>
                  </div>
                  <div class="time-sec text-muted">
                    <span>${formatTime(o.createdAt)}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <div class="action-buttons-group">
                    ${o.status === 'Pending' ? `
                      <button class="btn btn-success btn-sm btn-quick" data-action="quick-status" data-order-id="${o.orderNumber}" data-status="Completed">
                        ${SVG_ICONS.completed} ${t('complete')}
                      </button>
                    ` : ''}
                    <button class="btn btn-outline btn-sm btn-print" data-action="print-order" data-id="${o.orderNumber}">
                      ${SVG_ICONS.print} ${t('print')}
                    </button>
                    <button class="btn btn-danger btn-sm" data-action="delete-order" data-id="${o.orderNumber}" title="Delete Order">
                      ${SVG_ICONS.trash}
                    </button>
                  </div>
                  <div class="select-wrapper">
                    <select class="status-select" data-action="update-order-status" data-order-id="${o.orderNumber}">
                      ${ORDER_STATUSES.map(s => `
                        <option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `
      }
    </div>
  `;
}


function renderMenuManageTab() {
  return `
    <div class="dash-section">
      <div class="section-header">
        <h3>📝 Menu Items</h3>
        <button class="btn btn-primary btn-sm" data-action="open-add-menu-item">
          + Add New Item
        </button>
      </div>

      <div class="menu-manage-grid">
        ${state.menuItems.map(item => `
          <div class="manage-card">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="manage-card-img" />
            <div class="manage-card-body">
              <h4>${escapeHtml(item.name)}</h4>
              <p class="text-muted">${escapeHtml(item.description)}</p>
              <p class="card-price">${formatCurrency(item.price)}</p>
              <span class="card-category-tag">${getCategoryIcon(item.category)} ${capitalize(item.category)}</span>
            </div>
            <div class="manage-card-actions">
              <button class="btn btn-outline btn-sm" data-action="edit-menu-item" data-id="${item.id}">Edit</button>
              <button class="btn btn-danger btn-sm" data-action="delete-menu-item" data-id="${item.id}">${SVG_ICONS.trash} Delete</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="divider" style="margin: 40px 0 20px 0; border-top: 1px solid var(--gray-border);"></div>

      <div class="section-header">
        <h3 style="display: flex; align-items: center; gap: 8px;">${SVG_ICONS.custom} Categories</h3>
        <button class="btn btn-primary btn-sm" data-action="open-add-category">
          + Add New Category
        </button>
      </div>

      <div class="categories-manage-grid">
        ${CATEGORIES.filter(c => c.id !== 'all').map(cat => `
          <div class="manage-card category-manage-card" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">${getCategoryIcon(cat.id)}</span>
              <div>
                <h4 style="margin:0; font-family:var(--font-family); color:var(--text-dark);">${escapeHtml(cat.name)}</h4>
                <p class="text-muted" style="margin:0; font-size:0.8rem;">ID: ${escapeHtml(cat.id)}</p>
              </div>
            </div>
            <button class="btn btn-danger btn-sm" data-action="delete-category" data-id="${cat.id}">${SVG_ICONS.trash} Delete</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}


// ── Dashboard: Menu Item Add/Edit Modal ──────────────────────

function renderMenuItemModal() {
  const item = state.editingItem;
  const isEdit = item !== null;

  return `
    <div class="modal-overlay ${state.menuModalOpen ? 'open' : ''}" data-action="close-menu-modal">
      <div class="modal menu-modal ${state.menuModalOpen ? 'open' : ''}">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Item' : 'Add New Item'}</h3>
          <button class="btn-close" data-action="close-menu-modal">&times;</button>
        </div>
        <form id="menuItemForm" data-form="menu-item">
          ${isEdit ? `<input type="hidden" name="itemId" value="${item.id}" />` : ''}
          <div class="form-group">
            <label>Item Name *</label>
            <input type="text" name="itemName" required placeholder="e.g. Chocolate Cake" value="${isEdit ? escapeHtml(item.name) : ''}" />
          </div>
          <div class="form-group">
            <label>Description *</label>
            <textarea name="itemDesc" required rows="2" placeholder="Describe this delicious item">${isEdit ? escapeHtml(item.description) : ''}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Price ($) *</label>
              <input type="number" name="itemPrice" required min="0" step="0.01" placeholder="0.00" value="${isEdit ? item.price : ''}" />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select name="itemCategory" required>
                ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
                  <option value="${c.id}" ${isEdit && item.category === c.id ? 'selected' : ''}>
                    ${c.icon} ${c.name}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Upload Image *</label>
            <div style="display: flex; gap: 12px; align-items: center; margin-top: 6px;">
              <label class="btn btn-outline btn-sm" style="margin: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                Choose Image File
                <input type="file" id="itemImageFile" accept="image/*" style="display: none;" />
              </label>
              <input type="hidden" name="itemImage" id="itemImageBase64" value="${isEdit ? escapeHtml(item.image) : 'assets/cake.png'}" />
              <div id="itemImagePreviewContainer" style="width: 48px; height: 48px; border-radius: 8px; border: 1px solid var(--gray-border); overflow: hidden; background: var(--gray-light); display: flex; align-items: center; justify-content: center;">
                <img id="itemImagePreview" src="${isEdit ? item.image : 'assets/cake.png'}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">
            ${isEdit ? 'Save Changes' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  `;
}


// ╔════════════════════════════════════════════════════════════╗
// ║  EVENT DELEGATION                                         ║
// ╚════════════════════════════════════════════════════════════╝

/**
 * A single click handler on the document handles every button
 * click by reading `data-action` attributes.  This is crucial
 * because the DOM is rebuilt on every render().
 */
function handleGlobalClick(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  // Ignore modal-overlay triggers if click actually happened inside the modal content
  if (target.classList.contains('modal-overlay') && e.target !== target) {
    return;
  }

  const action = target.dataset.action;

  switch (action) {
    case 'add-to-cart':
      addToCart(Number(target.dataset.id));
      break;

    case 'remove-from-cart':
      removeFromCart(Number(target.dataset.id));
      break;

    case 'update-qty':
      updateCartQty(Number(target.dataset.id), Number(target.dataset.delta));
      break;

    case 'toggle-cart':
      toggleCart();
      break;

    case 'open-checkout':
      openCheckout();
      break;

    case 'close-checkout':
      closeCheckout();
      break;

    case 'staff-logout':
      staffLogout();
      break;

    case 'staff-logout-mobile':
      state.mobileMenuOpen = false;
      staffLogout();
      break;

    case 'switch-dash-tab':
      switchDashTab(target.dataset.tab);
      break;

    case 'select-location': {
      const lat = parseFloat(target.dataset.lat);
      const lon = parseFloat(target.dataset.lon);
      const name = target.dataset.display;
      
      const input = document.getElementById('custLocation');
      if (input) input.value = name;
      
      const suggestionsDiv = document.getElementById('locationSuggestions');
      if (suggestionsDiv) suggestionsDiv.style.display = 'none';
      
      initCheckoutMap(lat, lon, name);
      break;
    }

    case 'delete-order': {
      const orderId = target.dataset.id;
      if (!confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
      state.orders = state.orders.filter(o => o.orderNumber !== orderId);
      saveOrders();
      showToast(`Order ${orderId} deleted`, 'success');
      render();
      break;
    }

    case 'remove-track-history': {
      const orderNum = target.dataset.id;
      let history = getCustomerOrderHistory();
      history = history.filter(num => num !== orderNum);
      localStorage.setItem('salwa_customer_history', JSON.stringify(history));
      showToast('Order removed from history', 'success');
      render();
      break;
    }

    case 'switch-dash-tab-mobile':
      state.mobileMenuOpen = false;
      switchDashTab(target.dataset.tab);
      break;

    case 'filter-orders':
      filterOrders(target.dataset.status);
      break;

    case 'open-add-menu-item':
      state.editingItem = null;
      state.menuModalOpen = true;
      render();
      break;

    case 'edit-menu-item':
      editMenuItem(Number(target.dataset.id));
      break;

    case 'delete-menu-item':
      deleteMenuItem(Number(target.dataset.id));
      break;

    case 'close-menu-modal':
      state.menuModalOpen = false;
      state.editingItem = null;
      render();
      break;

    case 'select-category':
      state.selectedCategory = target.dataset.category;
      render();
      break;
    case 'select-track-order':
      state.trackedOrderId = target.dataset.id;
      render();
      break;
    case 'quick-status':
      updateOrderStatus(target.dataset.orderId, target.dataset.status);
      break;
    case 'print-order':
      printOrder(target.dataset.id);
      break;
    case 'toggle-settings':
      state.settingsOpen = !state.settingsOpen;
      render();
      break;
    case 'close-settings':
      state.settingsOpen = false;
      render();
      break;
    case 'toggle-mobile-menu':
      state.mobileMenuOpen = !state.mobileMenuOpen;
      render();
      break;
    case 'mobile-open-settings':
      state.mobileMenuOpen = false;
      state.settingsOpen = true;
      render();
      break;
    case 'open-add-category':
      state.categoryModalOpen = true;
      render();
      break;
    case 'close-category-modal':
      state.categoryModalOpen = false;
      render();
      break;
    case 'delete-category':
      deleteCategory(target.dataset.id);
      break;
  }
}

/**
 * Central form submission handler.
 * We identify forms by a `data-form` attribute.
 */
function handleGlobalSubmit(e) {
  const form = e.target.closest('[data-form]');
  if (!form) return;
  e.preventDefault();

  const formType = form.dataset.form;

  switch (formType) {
    case 'checkout': submitOrder(form);    break;
    case 'login':    staffLogin(form);     break;
    case 'menu-item': saveMenuItem(form);  break;
    case 'track':    trackOrderSubmit(form); break;
    case 'settings': saveSettingsForm(form); break;
    case 'category': saveCategory(form);   break;
  }
}

/**
 * Handle status dropdown changes in the orders table.
 */
function handleGlobalChange(e) {
  if (e.target.id === 'itemImageFile') {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64 = evt.target.result;
        const hiddenInput = document.getElementById('itemImageBase64');
        const imgPreview = document.getElementById('itemImagePreview');
        if (hiddenInput) hiddenInput.value = base64;
        if (imgPreview) imgPreview.src = base64;
        showToast('Image loaded successfully! 📸', 'success');
      };
      reader.readAsDataURL(file);
    }
    return;
  }

  const target = e.target.closest('[data-action="update-order-status"]');
  if (!target) return;
  updateOrderStatus(target.dataset.orderId, target.value);
}

/**
 * Handle search input in real-time.
 */
function handleGlobalInput(e) {
  if (e.target.id === 'menuSearch') {
    state.searchQuery = e.target.value;
    // Debounced re-render for the menu grid only
    clearTimeout(state._searchTimer);
    state._searchTimer = setTimeout(() => render(), 200);
  }
  
  if (e.target.id === 'custLocation') {
    const query = e.target.value.trim();
    const suggestionsDiv = document.getElementById('locationSuggestions');
    if (!suggestionsDiv) return;
    
    if (query.length < 3) {
      suggestionsDiv.style.display = 'none';
      return;
    }
    
    clearTimeout(state._locationTimer);
    state._locationTimer = setTimeout(() => {
      const MOCK_LOCATIONS = [
        { display_name: "Salwa's Bakery (Pickup) - Canada, GTA", lat: 43.6532, lon: -79.3832 },
        { display_name: "123 Main St, Toronto, ON, Canada", lat: 43.6841, lon: -79.3105 },
        { display_name: "456 Yonge St, Toronto, ON, Canada", lat: 43.6617, lon: -79.3852 },
        { display_name: "789 Queen St W, Toronto, ON, Canada", lat: 43.6456, lon: -79.4024 },
        { display_name: "100 Baker St, North York, ON, Canada", lat: 43.7615, lon: -79.4110 },
        { display_name: "10 Bay St, Toronto, ON, Canada", lat: 43.6410, lon: -79.3785 }
      ];
      
      const localFiltered = MOCK_LOCATIONS.filter(loc => 
        loc.display_name.toLowerCase().includes(query.toLowerCase())
      );
      
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          const combined = [...localFiltered];
          data.forEach(item => {
            if (!combined.some(c => c.display_name === item.display_name)) {
              combined.push({
                display_name: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon)
              });
            }
          });
          
          if (combined.length === 0) {
            suggestionsDiv.innerHTML = '<div class="suggestion-item text-muted" style="padding: 10px;">No locations found</div>';
          } else {
            suggestionsDiv.innerHTML = combined.map(item => `
              <div class="suggestion-item" data-action="select-location" 
                   data-lat="${item.lat}" data-lon="${item.lon}" 
                   data-display="${escapeHtml(item.display_name)}">
                📍 ${escapeHtml(item.display_name)}
              </div>
            `).join('');
          }
          suggestionsDiv.style.display = 'block';
        })
        .catch(err => {
          if (localFiltered.length > 0) {
            suggestionsDiv.innerHTML = localFiltered.map(item => `
              <div class="suggestion-item" data-action="select-location" 
                   data-lat="${item.lat}" data-lon="${item.lon}" 
                   data-display="${escapeHtml(item.display_name)}">
                📍 ${escapeHtml(item.display_name)}
              </div>
            `).join('');
            suggestionsDiv.style.display = 'block';
          } else {
            suggestionsDiv.style.display = 'none';
          }
        });
    }, 300);
  }
}


// ╔════════════════════════════════════════════════════════════╗
// ║  CART ACTIONS                                             ║
// ╚════════════════════════════════════════════════════════════╝

function addToCart(itemId) {
  const existing = state.cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ id: itemId, qty: 1 });
  }
  saveCart();
  const item = state.menuItems.find(m => m.id === itemId);
  
  // Trigger button micro-interaction feedback
  state.addedItems[itemId] = true;
  state.cartBouncing = true;
  
  showToast(`${item ? item.name : 'Item'} added to cart! 🛒`, 'success');
  render();

  setTimeout(() => {
    state.cartBouncing = false;
    render();
  }, 600);

  setTimeout(() => {
    if (state.addedItems[itemId]) {
      delete state.addedItems[itemId];
      render();
    }
  }, 1500);

  // Restore search input focus after render
  restoreSearchFocus();
}

function removeFromCart(itemId) {
  state.cart = state.cart.filter(c => c.id !== itemId);
  saveCart();
  render();
}

function updateCartQty(itemId, delta) {
  const item = state.cart.find(c => c.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(c => c.id !== itemId);
  }
  saveCart();
  render();
}

function toggleCart() {
  state.cartOpen = !state.cartOpen;
  render();
}

function initCheckoutMap(lat = 43.6532, lon = -79.3832, name = "Toronto, GTA") {
  const previewContainer = document.getElementById('locationMapPreview');
  if (previewContainer) previewContainer.style.display = 'block';

  setTimeout(() => {
    try {
      const mapEl = document.getElementById('checkoutMap');
      if (!mapEl) return;

      const leafIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      if (window.checkoutLMap) {
        window.checkoutLMap.setView([lat, lon], 13);
        if (window.checkoutLMarker) {
          window.checkoutLMarker.setLatLng([lat, lon]);
        } else {
          window.checkoutLMarker = L.marker([lat, lon], { icon: leafIcon }).addTo(window.checkoutLMap);
        }
      } else {
        window.checkoutLMap = L.map('checkoutMap').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(window.checkoutLMap);
        window.checkoutLMarker = L.marker([lat, lon], { icon: leafIcon }).addTo(window.checkoutLMap);
      }

      // Update preview info card
      const picEl = document.getElementById('locationMetaPic');
      const titleEl = document.getElementById('locationMetaTitle');
      const descEl = document.getElementById('locationMetaDesc');

      if (titleEl) titleEl.textContent = name.split(',')[0] || name;
      if (descEl) descEl.textContent = name;
      if (picEl) {
        picEl.src = "assets/logo.png";
      }

      window.checkoutLMap.invalidateSize();
    } catch (e) {
      console.error("Leaflet init error:", e);
    }
  }, 100);
}

function openCheckout() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  state.cartOpen = false;
  state.checkoutOpen = true;
  render();
  initCheckoutMap();
}

function closeCheckout() {
  state.checkoutOpen = false;
  if (window.checkoutLMap) {
    try {
      window.checkoutLMap.remove();
    } catch (e) {
      console.error(e);
    }
    window.checkoutLMap = null;
    window.checkoutLMarker = null;
  }
  render();
}


// ╔════════════════════════════════════════════════════════════╗
// ║  ORDER ACTIONS                                            ║
// ╚════════════════════════════════════════════════════════════╝

function submitOrder(form) {
  const fd = new FormData(form);

  const customerName = fd.get('customerName').trim();
  const phone        = fd.get('phone').trim();
  const location     = fd.get('location').trim();
  const notes        = (fd.get('notes') || '').trim();

  if (!customerName || !phone || !location) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const orderNumber = generateOrderNumber();

  // Build order items with snapshotted names & prices
  const orderItems = state.cart.map(ci => {
    const mi = state.menuItems.find(m => m.id === ci.id);
    return {
      id:    ci.id,
      name:  mi ? mi.name : 'Unknown',
      price: mi ? mi.price : 0,
      qty:   ci.qty
    };
  });

  const order = {
    orderNumber,
    customerName,
    phone,
    location,
    items: orderItems,
    total: getCartTotal(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    notes
  };

  state.orders.push(order);
  saveOrders();
  saveCustomerOrder(orderNumber);

  // Clear cart
  state.cart = [];
  saveCart();

  state.lastOrderNumber = orderNumber;
  state.checkoutOpen = false;

  showToast('Order placed successfully! 🎉', 'success');
  window.location.hash = '#order-confirm';
}

function updateOrderStatus(orderNumber, newStatus) {
  const order = state.orders.find(o => o.orderNumber === orderNumber);
  if (!order) return;
  order.status = newStatus;
  saveOrders();
  showToast(`Order ${orderNumber} → ${newStatus}`, 'success');
  render();
}


// ╔════════════════════════════════════════════════════════════╗
// ║  STAFF ACTIONS                                            ║
// ╚════════════════════════════════════════════════════════════╝

function staffLogin(form) {
  const fd       = new FormData(form);
  const username = fd.get('username').trim();
  const password = fd.get('password');
  const remember = form.elements['remember'] ? form.elements['remember'].checked : false;

  if (username === STAFF_CREDENTIALS.username && password === STAFF_CREDENTIALS.password) {
    state.isLoggedIn = true;
    if (remember) {
      localStorage.setItem('salwa_logged_in', 'true');
    } else {
      sessionStorage.setItem('salwa_logged_in', 'true');
    }
    showToast('Welcome back!', 'success');
    window.location.hash = '#dashboard';
    syncWithCloudDatabase(true);
  } else {
    // Show error with shake
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
      errorDiv.style.display = 'block';
      const card = document.querySelector('.login-card');
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
      }
    }
  }
}

function staffLogout() {
  state.isLoggedIn = false;
  localStorage.removeItem('salwa_logged_in');
  sessionStorage.removeItem('salwa_logged_in');
  showToast('Logged out successfully', 'success');
  window.location.hash = '#landing';
}


// ╔════════════════════════════════════════════════════════════╗
// ║  MENU MANAGEMENT ACTIONS                                  ║
// ╚════════════════════════════════════════════════════════════╝

function editMenuItem(itemId) {
  const item = state.menuItems.find(m => m.id === itemId);
  if (!item) return;
  state.editingItem = { ...item };
  state.menuModalOpen = true;
  render();
}

function deleteMenuItem(itemId) {
  const item = state.menuItems.find(m => m.id === itemId);
  if (!item) return;
  if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

  state.menuItems = state.menuItems.filter(m => m.id !== itemId);
  saveMenu();
  showToast(`"${item.name}" deleted`, 'success');
  render();
}

function saveMenuItem(form) {
  const fd = new FormData(form);

  const name     = fd.get('itemName').trim();
  const desc     = fd.get('itemDesc').trim();
  const price    = parseFloat(fd.get('itemPrice'));
  const category = fd.get('itemCategory');
  const image    = fd.get('itemImage').trim() || 'assets/cake.png';

  if (!name || !desc || isNaN(price)) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const existingId = fd.get('itemId');

  if (existingId) {
    // Editing
    const item = state.menuItems.find(m => m.id === Number(existingId));
    if (item) {
      item.name        = name;
      item.description = desc;
      item.price       = price;
      item.category    = category;
      item.image       = image;
      showToast(`"${name}" updated! ✏️`, 'success');
    }
  } else {
    // Adding
    const maxId = state.menuItems.reduce((max, m) => Math.max(max, m.id), 0);
    state.menuItems.push({
      id: maxId + 1,
      name,
      description: desc,
      price,
      category,
      image
    });
    showToast(`"${name}" added to menu! 🎉`, 'success');
  }

  saveMenu();
  state.menuModalOpen = false;
  state.editingItem = null;
  render();
}

function switchDashTab(tab) {
  state.dashboardTab = tab;
  render();
}

function filterOrders(status) {
  state.orderFilter = status;
  render();
}


// ╔════════════════════════════════════════════════════════════╗
// ║  TOAST NOTIFICATION SYSTEM                                ║
// ╚════════════════════════════════════════════════════════════╝

function ensureToastContainer() {
  if (!document.getElementById('toast-container')) {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
}

function showToast(message, type = 'success') {
  ensureToastContainer();
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--warning);"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => toast.classList.add('show'));

  // Auto-remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}


// ╔════════════════════════════════════════════════════════════╗
// ║  PERSISTENCE HELPERS                                      ║
// ╚════════════════════════════════════════════════════════════╝

async function uploadToCloud(key) {
  let localData = null;
  if (key === 'menu') localData = state.menuItems;
  else if (key === 'categories') localData = CATEGORIES;
  else if (key === 'orders') localData = state.orders;
  
  if (!localData) return;
  try {
    await fetch(`/api/db?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localData)
    });
  } catch (e) {
    console.warn(`Failed to upload ${key} to cloud database:`, e);
  }
}

async function syncWithCloudDatabase(forceAllKeys = false) {
  if (document.visibilityState !== 'visible') return;

  // Optimize KV request count:
  // If not forcing all keys, only poll if logged in (staff dashboard) or tracking an order.
  if (!forceAllKeys) {
    if (!state.isLoggedIn && !state.trackedOrderId) {
      return;
    }
  }

  // Customers only pull 'orders' to get status updates for their tracked order.
  // Staff dashboard pulls all keys to stay fully synchronized.
  const keys = (forceAllKeys || state.isLoggedIn) ? ['menu', 'categories', 'orders'] : ['orders'];
  let hasChanges = false;
  
  for (const key of keys) {
    try {
      const res = await fetch(`/api/db?key=${key}`);
      if (!res.ok) continue;
      const data = await res.json();
      
      if (data && data.value) {
        const cloudStr = JSON.stringify(data.value);
        let localStr = '';
        if (key === 'menu') {
          localStr = JSON.stringify(state.menuItems);
          if (cloudStr !== localStr) {
            state.menuItems = data.value;
            localStorage.setItem('salwa_menu', cloudStr);
            hasChanges = true;
          }
        } else if (key === 'categories') {
          localStr = JSON.stringify(CATEGORIES);
          if (cloudStr !== localStr) {
            CATEGORIES = data.value;
            localStorage.setItem('salwa_categories', cloudStr);
            hasChanges = true;
          }
        } else if (key === 'orders') {
          localStr = JSON.stringify(state.orders);
          if (cloudStr !== localStr) {
            const oldLength = state.orders.length;
            state.orders = data.value;
            localStorage.setItem('salwa_orders', cloudStr);
            hasChanges = true;
            
            // Check for new orders if logged in on dashboard
            if (state.isLoggedIn && state.currentView === 'dashboard' && state.orders.length > oldLength) {
              playNewOrderChime();
              showToast('New order received!', 'success');
            }
          }
        }
      } else {
        // If cloud database has no data, upload local data to populate it
        await uploadToCloud(key);
      }
    } catch (e) {
      console.warn(`Cloud sync failed for ${key}, using local data:`, e);
    }
  }
  
  if (hasChanges) {
    render();
  }
}

function saveOrders() {
  localStorage.setItem('salwa_orders', JSON.stringify(state.orders));
  uploadToCloud('orders');
}

function saveMenu() {
  localStorage.setItem('salwa_menu', JSON.stringify(state.menuItems));
  uploadToCloud('menu');
}

function saveCategories() {
  localStorage.setItem('salwa_categories', JSON.stringify(CATEGORIES));
  uploadToCloud('categories');
}

function saveCart() {
  sessionStorage.setItem('salwa_cart', JSON.stringify(state.cart));
}

function saveCustomerOrder(orderNumber) {
  const history = getCustomerOrderHistory();
  if (!history.includes(orderNumber)) {
    history.push(orderNumber);
    localStorage.setItem('salwa_customer_history', JSON.stringify(history));
  }
}

function getCustomerOrderHistory() {
  const stored = localStorage.getItem('salwa_customer_history');
  return stored ? JSON.parse(stored) : [];
}

function saveSettings() {
  const settings = {
    language: state.language,
    theme: state.theme,
    fontSize: state.fontSize,
    reducedMotion: state.reducedMotion,
    highContrast: state.highContrast
  };
  localStorage.setItem('salwa_settings', JSON.stringify(settings));
}

function loadSettings() {
  const stored = localStorage.getItem('salwa_settings');
  if (stored) {
    const settings = JSON.parse(stored);
    state.language = settings.language || 'en';
    state.theme = settings.theme || 'light';
    state.fontSize = settings.fontSize || 'md';
    state.reducedMotion = !!settings.reducedMotion;
    state.highContrast = !!settings.highContrast;
  }
}

function applySettings() {
  const body = document.body;
  if (!body) return;

  // 1. Language RTL check
  if (state.language === 'ar') {
    body.setAttribute('dir', 'rtl');
    body.classList.add('rtl-layout');
  } else {
    body.removeAttribute('dir');
    body.classList.remove('rtl-layout');
  }

  // 2. Theme class
  body.className = body.className.replace(/\btheme-\S+/g, '');
  body.classList.add(`theme-${state.theme}`);

  // 3. Font Size class
  body.className = body.className.replace(/\bfont-\S+/g, '');
  body.classList.add(`font-${state.fontSize}`);

  // 4. Accessibility classes
  if (state.reducedMotion) {
    body.classList.add('reduced-motion');
  } else {
    body.classList.remove('reduced-motion');
  }

  if (state.highContrast) {
    body.classList.add('high-contrast');
  } else {
    body.classList.remove('high-contrast');
  }
}


// ╔════════════════════════════════════════════════════════════╗
// ║  FORMATTING & UTILITY HELPERS                             ║
// ╚════════════════════════════════════════════════════════════╝

function getCartTotal() {
  return state.cart.reduce((sum, ci) => {
    const item = state.menuItems.find(m => m.id === ci.id);
    return sum + (item ? item.price * ci.qty : 0);
  }, 0);
}

function getCartCount() {
  return state.cart.reduce((sum, ci) => sum + ci.qty, 0);
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateFull(date) {
  return date.toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str) {
  return (str || '').toLowerCase().replace(/\s+/g, '-');
}

function getCategoryIcon(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (SVG_ICONS[categoryId]) {
    return SVG_ICONS[categoryId];
  }
  return cat ? cat.icon : '✨';
}

/**
 * After rendering, restore focus to the search input so the
 * user can keep typing without interruption.
 */
function restoreSearchFocus() {
  if (state.currentView === 'menu' && state.searchQuery) {
    requestAnimationFrame(() => {
      const input = document.getElementById('menuSearch');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }
}

function printOrder(orderNumber) {
  const order = state.orders.find(o => o.orderNumber === orderNumber);
  if (!order) return;
  
  const printWindow = window.open('', '_blank', 'width=600,height=800');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Order ${order.orderNumber}</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 20px; color: #000; }
          .ticket { max-width: 300px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 1.2em; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h3>SALWA'S BAKERY</h3>
            <p>GTA, Canada</p>
            <h2>ORDER TICKET</h2>
            <p><strong>${order.orderNumber}</strong></p>
          </div>
          <div class="divider"></div>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Location:</strong> ${escapeHtml(order.location)}</p>
          <div class="divider"></div>
          ${order.items.map(i => `
            <div class="row">
              <span>${i.name} x${i.qty}</span>
              <span>$${(i.price * i.qty).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="row total">
            <span>TOTAL</span>
            <span>$${order.total.toFixed(2)}</span>
          </div>
          ${order.notes ? `
            <div class="divider"></div>
            <p><strong>Notes:</strong><br/>${order.notes}</p>
          ` : ''}
          <div class="divider"></div>
          <div class="footer">
            <p>Thank you for baking with us!</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function renderSettingsModal() {
  const isEn = state.language === 'en';
  const isFr = state.language === 'fr';
  const isAr = state.language === 'ar';

  return `
    <div class="modal-overlay ${state.settingsOpen ? 'open' : ''}" data-action="close-settings">
      <div class="modal settings-modal ${state.settingsOpen ? 'open' : ''}">
        <div class="modal-header">
          <div class="modal-title-group">
            <svg class="modal-header-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <h3>${t('settings')}</h3>
          </div>
          <button class="btn-close" data-action="close-settings">&times;</button>
        </div>
        
        <form id="settingsForm" data-form="settings">
          <!-- Language Select -->
          <div class="form-group">
            <label>${t('language')}</label>
            <div class="lang-picker-group">
              <label class="lang-option">
                <input type="radio" name="language" value="en" ${isEn ? 'checked' : ''} />
                <span class="lang-pill">English</span>
              </label>
              <label class="lang-option">
                <input type="radio" name="language" value="fr" ${isFr ? 'checked' : ''} />
                <span class="lang-pill">Français</span>
              </label>
              <label class="lang-option">
                <input type="radio" name="language" value="ar" ${isAr ? 'checked' : ''} />
                <span class="lang-pill">العربية</span>
              </label>
            </div>
          </div>

          <!-- Theme Select -->
          <div class="form-group">
            <label>${t('theme')}</label>
            <div class="theme-picker-grid">
              <label class="theme-option">
                <input type="radio" name="theme" value="light" ${state.theme === 'light' ? 'checked' : ''} />
                <div class="theme-card-preview light-card-preview">
                  <div class="mini-header"></div>
                  <div class="mini-text"></div>
                  <div class="mini-button"></div>
                </div>
                <span class="theme-label">${t('light')}</span>
              </label>
              <label class="theme-option">
                <input type="radio" name="theme" value="dark" ${state.theme === 'dark' ? 'checked' : ''} />
                <div class="theme-card-preview dark-card-preview">
                  <div class="mini-header"></div>
                  <div class="mini-text"></div>
                  <div class="mini-button"></div>
                </div>
                <span class="theme-label">${t('dark')}</span>
              </label>
              <label class="theme-option">
                <input type="radio" name="theme" value="cream" ${state.theme === 'cream' ? 'checked' : ''} />
                <div class="theme-card-preview cream-card-preview">
                  <div class="mini-header"></div>
                  <div class="mini-text"></div>
                  <div class="mini-button"></div>
                </div>
                <span class="theme-label">${t('cream')}</span>
              </label>
            </div>
          </div>

          <!-- Font Size Select -->
          <div class="form-group">
            <label>${t('fontSize')}</label>
            <div class="font-picker-group">
              <label class="font-option">
                <input type="radio" name="fontSize" value="sm" ${state.fontSize === 'sm' ? 'checked' : ''} />
                <span class="font-preview-label font-preview-sm">A</span>
                <span class="font-label">${t('sm')}</span>
              </label>
              <label class="font-option">
                <input type="radio" name="fontSize" value="md" ${state.fontSize === 'md' ? 'checked' : ''} />
                <span class="font-preview-label font-preview-md">A</span>
                <span class="font-label">${t('md')}</span>
              </label>
              <label class="font-option">
                <input type="radio" name="fontSize" value="lg" ${state.fontSize === 'lg' ? 'checked' : ''} />
                <span class="font-preview-label font-preview-lg">A</span>
                <span class="font-label">${t('lg')}</span>
              </label>
              <label class="font-option">
                <input type="radio" name="fontSize" value="xl" ${state.fontSize === 'xl' ? 'checked' : ''} />
                <span class="font-preview-label font-preview-xl">A</span>
                <span class="font-label">${t('xl')}</span>
              </label>
            </div>
          </div>

          <!-- Accessibility Options -->
          <div class="form-group accessibility-options-group" style="margin-top: 20px;">
            <div class="toggle-option-row">
              <div class="toggle-info">
                <span class="toggle-title">${t('reducedMotion')}</span>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" name="reducedMotion" ${state.reducedMotion ? 'checked' : ''} />
                <span class="slider-round"></span>
              </label>
            </div>
            <div class="toggle-option-row" style="margin-top: 16px;">
              <div class="toggle-info">
                <span class="toggle-title">${t('highContrast')}</span>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" name="highContrast" ${state.highContrast ? 'checked' : ''} />
                <span class="slider-round"></span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 28px;">
            ${t('saveSettings')}
          </button>
        </form>
      </div>
    </div>
  `;
}

function saveSettingsForm(form) {
  const fd = new FormData(form);
  
  state.language = fd.get('language');
  state.theme = fd.get('theme');
  state.fontSize = fd.get('fontSize');
  state.reducedMotion = fd.has('reducedMotion');
  state.highContrast = fd.has('highContrast');

  saveSettings();
  applySettings();
  
  state.settingsOpen = false;
  showToast('Settings saved successfully!', 'success');
  render();
}

function renderCategoryModal() {
  return `
    <div class="modal-overlay ${state.categoryModalOpen ? 'open' : ''}" data-action="close-category-modal">
      <div class="modal category-modal ${state.categoryModalOpen ? 'open' : ''}">
        <div class="modal-header">
          <h3>${t('addCategory') || 'Add New Category'}</h3>
          <button class="btn-close" data-action="close-category-modal">&times;</button>
        </div>
        <form id="categoryForm" data-form="category">
          <div class="form-group">
            <label>${t('categoryId') || 'Category ID'} * (lowercase, no spaces, e.g. brownies)</label>
            <input type="text" name="catId" required placeholder="brownies" pattern="[a-z0-9-]+" title="Only lowercase letters, numbers, and dashes" />
          </div>
          <div class="form-group">
            <label>${t('categoryName') || 'Category Name'} * (e.g. Fudgy Brownies)</label>
            <input type="text" name="catName" required placeholder="Fudgy Brownies" />
          </div>
          <div class="form-group">
            <label>${t('categoryIcon') || 'Emoji Icon'} * (e.g. 🍫)</label>
            <input type="text" name="catIcon" required placeholder="🍫" style="font-size: 1.2rem;" />
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 16px;">
            ${t('addCategory') || 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  `;
}

function saveCategory(form) {
  const fd = new FormData(form);
  const id = fd.get('catId').trim().toLowerCase();
  const name = fd.get('catName').trim();
  const icon = fd.get('catIcon').trim();

  if (!id || !name || !icon) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Check if ID already exists
  if (CATEGORIES.some(c => c.id === id)) {
    showToast('Category ID already exists', 'error');
    return;
  }

  CATEGORIES.push({ id, name, icon });
  saveCategories();
  
  state.categoryModalOpen = false;
  showToast(`Category "${name}" added successfully!`, 'success');
  render();
}

function deleteCategory(catId) {
  if (catId === 'all') return;
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  // Confirm delete
  if (!confirm(`Delete category "${cat.name}"? Items under this category will NOT be deleted, but they won't belong to any category.`)) return;

  CATEGORIES = CATEGORIES.filter(c => c.id !== catId);
  saveCategories();
  showToast(`Category "${cat.name}" deleted`, 'success');
  render();
}




