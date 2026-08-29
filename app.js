// ============================================================
//  app.js — Salwa's Bakery  |  Digital Menu & Staff Portal
// ============================================================

// ── Global Application State ────────────────────────────────
const state = {
  currentView:      'landing',   // landing | menu | staff-login | dashboard
  selectedCategory: 'all',
  searchQuery:      '',
  menuItems:        [],          // loaded from cloud database or localStorage
  categories:       [],          // loaded from cloud database or localStorage
  isLoggedIn:       false,
  cloudConnected:   null,        // true | false | null (loading)
  lastSyncTime:     null,
  editingItem:      null,        // item being edited (null = adding new)
  menuModalOpen:    false,
  categoryModalOpen:false,
  settingsOpen:     false,
  mobileMenuOpen:   false,
  toasts:           [],
  
  // User Settings (Default: English)
  language:         'en',        // en | fr | ar
  theme:            'light',     // light | dark | cream
  fontSize:         'md',        // sm | md | lg | xl
  reducedMotion:    false,
  highContrast:     false
};

window.state = state;

// ── Clean SVG Vector Icon Registry ───────────────────────────
const SVG_ICONS = {
  all: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`,
  cakes: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2zM12 5V2m-3 0h6M2 17c0 2.2 4 4 10 4s10-1.8 10-4m-20-7v7c0 2.2 4 4 10 4s10-1.8 10-4v-7"/></svg>`,
  cupcakes: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14H18L19.5 21H4.5L6 14ZM12 11c2.5 0 4-1.5 4-3s-1.5-3-4-3-4 1.5-4 3 1.5 3 4 3ZM12 5V2m-2.5.5A1.5 1.5 0 1 1 12 2"/></svg>`,
  cookies: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-1-1.5-1.5-2.5-1.5S17 10 17 8.5s-.5-2.5-1.5-2.5S14 4.5 14 3.5s-.5-1.5-2-1.5zM7.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 2.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8.5-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`,
  pastries: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0-9 9l3 6 4-3 2 4 2-4 4 3 3-6a9 9 0 0 0-9-9zM6 12h12"/></svg>`,
  custom: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v10H4V12m16-4H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zM12 22V8m0 0a4 4 0 0 0 4-4c0-2-2-3-4-1m0 5a4 4 0 0 1-4-4c0-2 2-3 4-1"/></svg>`,
  browseMenu: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  location: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  info: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  search: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  settings: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  lock: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  logout: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>`,
  plus: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  edit: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  trash: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  refresh: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  check: `<svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  menuIcon: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
  close: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

function getCategoryIcon(catId) {
  if (catId === 'cakes') return SVG_ICONS.cakes;
  if (catId === 'cupcakes') return SVG_ICONS.cupcakes;
  if (catId === 'cookies') return SVG_ICONS.cookies;
  if (catId === 'pastries') return SVG_ICONS.pastries;
  if (catId === 'custom') return SVG_ICONS.custom;
  if (catId === 'all') return SVG_ICONS.all;
  return SVG_ICONS.pastries;
}

// ╔════════════════════════════════════════════════════════════╗
// ║  INITIALISATION                                           ║
// ╚════════════════════════════════════════════════════════════╝

function init() {
  loadSettings();
  applySettings();

  // Load initial local data
  const storedCats = localStorage.getItem('salwa_categories');
  if (storedCats) {
    try { CATEGORIES = JSON.parse(storedCats); } catch (e) {}
  }
  state.categories = [...CATEGORIES];

  const storedMenu = localStorage.getItem('salwa_menu');
  if (storedMenu) {
    try { state.menuItems = JSON.parse(storedMenu); } catch (e) {}
  } else {
    state.menuItems = [...DEFAULT_MENU_ITEMS];
  }

  // Restore staff login state
  state.isLoggedIn = localStorage.getItem('salwa_logged_in') === 'true' || 
                     sessionStorage.getItem('salwa_logged_in') === 'true';

  // Listeners for routing and user events
  window.addEventListener('hashchange', router);
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('submit', handleGlobalSubmit);
  document.addEventListener('input', handleGlobalInput);
  document.addEventListener('change', handleGlobalChange);

  // Multi-tab sync via storage events
  window.addEventListener('storage', handleStorageChange);

  // Real-time synchronization when tab gains focus or visibility
  window.addEventListener('focus', () => syncWithCloudDatabase(false));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncWithCloudDatabase(false);
    }
  });

  // Initial routing
  router();

  // Initial cloud fetch (Cloud is authoritative Source of Truth)
  syncWithCloudDatabase(false);

  // Periodic background sync every 15 seconds
  setInterval(() => syncWithCloudDatabase(false), 15000);
}

// ╔════════════════════════════════════════════════════════════╗
// ║  CLOUD DATABASE SYNCHRONIZATION ENGINE                    ║
// ╚════════════════════════════════════════════════════════════╝

async function syncWithCloudDatabase(showToastOnManual = false) {
  try {
    const statusRes = await fetch('/api/db?key=status', { cache: 'no-store' });
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      state.cloudConnected = statusData.connected === true;
    } else {
      state.cloudConnected = false;
    }

    const menuRes = await fetch('/api/db?key=menu', { cache: 'no-store' });
    let menuChanged = false;
    if (menuRes.ok) {
      const menuData = await menuRes.json();
      if (menuData && Array.isArray(menuData.value) && menuData.value.length > 0) {
        const cloudMenuStr = JSON.stringify(menuData.value);
        const localMenuStr = JSON.stringify(state.menuItems);
        if (cloudMenuStr !== localMenuStr) {
          state.menuItems = menuData.value;
          localStorage.setItem('salwa_menu', cloudMenuStr);
          menuChanged = true;
        }
      } else if (menuData && menuData.value === null && state.menuItems.length > 0) {
        await uploadToCloud('menu', state.menuItems);
      }
    }

    const catsRes = await fetch('/api/db?key=categories', { cache: 'no-store' });
    let catsChanged = false;
    if (catsRes.ok) {
      const catsData = await catsRes.json();
      if (catsData && Array.isArray(catsData.value) && catsData.value.length > 0) {
        const cloudCatsStr = JSON.stringify(catsData.value);
        const localCatsStr = JSON.stringify(CATEGORIES);
        if (cloudCatsStr !== localCatsStr) {
          CATEGORIES = catsData.value;
          state.categories = [...CATEGORIES];
          localStorage.setItem('salwa_categories', cloudCatsStr);
          catsChanged = true;
        }
      } else if (catsData && catsData.value === null && CATEGORIES.length > 0) {
        await uploadToCloud('categories', CATEGORIES);
      }
    }

    state.lastSyncTime = new Date();

    if (menuChanged || catsChanged) {
      render();
    }

    if (showToastOnManual) {
      if (state.cloudConnected) {
        showToast('Menu synchronized with cloud database ✓', 'success');
      } else {
        showToast('Running in local mode (Database not connected)', 'info');
      }
    }
  } catch (err) {
    console.warn('Cloud sync offline or unavailable:', err);
    state.cloudConnected = false;
  }
}

async function uploadToCloud(key, data) {
  try {
    const res = await fetch(`/api/db?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      state.cloudConnected = true;
      state.lastSyncTime = new Date();
      return true;
    } else {
      console.warn(`Failed to push ${key} to cloud database. Server status:`, res.status);
      state.cloudConnected = false;
      return false;
    }
  } catch (e) {
    console.warn(`Network error pushing ${key} to cloud database:`, e);
    state.cloudConnected = false;
    return false;
  }
}

async function saveMenu() {
  localStorage.setItem('salwa_menu', JSON.stringify(state.menuItems));
  const uploaded = await uploadToCloud('menu', state.menuItems);
  if (!uploaded && state.cloudConnected === false) {
    showToast('Saved locally (Database not connected on Vercel)', 'info');
  } else {
    showToast('Menu saved and synchronized! ✓', 'success');
  }
}

async function saveCategories() {
  localStorage.setItem('salwa_categories', JSON.stringify(CATEGORIES));
  state.categories = [...CATEGORIES];
  const uploaded = await uploadToCloud('categories', CATEGORIES);
  if (!uploaded && state.cloudConnected === false) {
    showToast('Categories saved locally (Database not connected)', 'info');
  } else {
    showToast('Categories updated and synchronized! ✓', 'success');
  }
}

function handleStorageChange(e) {
  if (e.key === 'salwa_menu' && e.newValue) {
    try {
      state.menuItems = JSON.parse(e.newValue);
      render();
    } catch (err) {}
  }
  if (e.key === 'salwa_categories' && e.newValue) {
    try {
      CATEGORIES = JSON.parse(e.newValue);
      state.categories = [...CATEGORIES];
      render();
    } catch (err) {}
  }
}

// ╔════════════════════════════════════════════════════════════╗
// ║  ROUTING & RENDERING                                       ║
// ╚════════════════════════════════════════════════════════════╝

function router() {
  const hash = window.location.hash.slice(1).split('?')[0] || 'landing';

  if (hash === 'dashboard') {
    if (!state.isLoggedIn) {
      window.location.hash = '#staff-login';
      return;
    }
    state.currentView = 'dashboard';
  } else if (hash === 'staff-login') {
    if (state.isLoggedIn) {
      window.location.hash = '#dashboard';
      return;
    }
    state.currentView = 'staff-login';
  } else if (hash === 'menu') {
    state.currentView = 'menu';
  } else {
    state.currentView = 'landing';
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  render();
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  switch (state.currentView) {
    case 'staff-login':
      app.innerHTML = renderStaffLogin();
      break;
    case 'dashboard':
      app.innerHTML = renderDashboard();
      break;
    case 'menu':
      app.innerHTML = renderMenu();
      break;
    case 'landing':
    default:
      app.innerHTML = renderLanding();
      break;
  }

  renderSettingsModal();
}

// ╔════════════════════════════════════════════════════════════╗
// ║  COMPONENTS: NAVBAR & SETTINGS                            ║
// ╚════════════════════════════════════════════════════════════╝

function renderNavbar() {
  return `
    <header class="navbar">
      <div class="nav-container">
        <a href="#landing" class="brand-logo">
          <img src="assets/logo.png" alt="Salwa's Bakery Logo" class="brand-img" onerror="this.style.display='none'" />
          <span class="brand-text">${t('brandName')}</span>
        </a>

        <nav class="nav-links">
          <a href="#landing" class="nav-link ${state.currentView === 'landing' ? 'active' : ''}">
            ${t('home')}
          </a>

          <a href="#menu" class="nav-link ${state.currentView === 'menu' ? 'active' : ''}">
            ${t('browseMenu')}
          </a>

          ${state.isLoggedIn ? `
            <a href="#dashboard" class="nav-link ${state.currentView === 'dashboard' ? 'active' : ''}">
              ${t('goToDashboard')}
            </a>
          ` : `
            <a href="#staff-login" class="nav-link ${state.currentView === 'staff-login' ? 'active' : ''}">
              ${SVG_ICONS.lock} ${t('staffPortal')}
            </a>
          `}

          <button class="nav-btn-icon" data-action="toggle-settings" title="${t('settings')}">
            ${SVG_ICONS.settings}
          </button>
        </nav>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" data-action="toggle-mobile-nav" aria-label="Toggle navigation">
          ${state.mobileMenuOpen ? SVG_ICONS.close : SVG_ICONS.menuIcon}
        </button>
      </div>

      <!-- Mobile Dropdown -->
      ${state.mobileMenuOpen ? `
        <div class="mobile-nav-menu animate-fade-in">
          <a href="#landing" class="mobile-nav-link" data-action="close-mobile-nav">${t('home')}</a>
          <a href="#menu" class="mobile-nav-link" data-action="close-mobile-nav">${t('browseMenu')}</a>
          ${state.isLoggedIn ? `
            <a href="#dashboard" class="mobile-nav-link" data-action="close-mobile-nav">${t('goToDashboard')}</a>
            <button class="mobile-nav-link text-danger" data-action="staff-logout">${t('logout')}</button>
          ` : `
            <a href="#staff-login" class="mobile-nav-link" data-action="close-mobile-nav">${t('staffPortal')}</a>
          `}
          <button class="mobile-nav-link" data-action="toggle-settings">${t('settings')}</button>
        </div>
      ` : ''}
    </header>
  `;
}

function renderSettingsModal() {
  let modalEl = document.getElementById('settingsModalWrapper');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'settingsModalWrapper';
    document.body.appendChild(modalEl);
  }

  if (!state.settingsOpen) {
    modalEl.innerHTML = '';
    return;
  }

  modalEl.innerHTML = `
    <div class="modal-overlay open" data-action="toggle-settings">
      <div class="modal settings-modal open">
        <div class="modal-header">
          <h3>${SVG_ICONS.settings} ${t('settings')}</h3>
          <button class="btn-close" data-action="toggle-settings">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>${t('language')}</label>
            <div class="segmented-control">
              <button class="seg-btn ${state.language === 'en' ? 'active' : ''}" data-action="set-lang" data-val="en">English</button>
              <button class="seg-btn ${state.language === 'fr' ? 'active' : ''}" data-action="set-lang" data-val="fr">Français</button>
              <button class="seg-btn ${state.language === 'ar' ? 'active' : ''}" data-action="set-lang" data-val="ar">العربية</button>
            </div>
          </div>

          <div class="form-group">
            <label>${t('theme')}</label>
            <div class="segmented-control">
              <button class="seg-btn ${state.theme === 'light' ? 'active' : ''}" data-action="set-theme" data-val="light">${t('light')}</button>
              <button class="seg-btn ${state.theme === 'dark' ? 'active' : ''}" data-action="set-theme" data-val="dark">${t('dark')}</button>
              <button class="seg-btn ${state.theme === 'cream' ? 'active' : ''}" data-action="set-theme" data-val="cream">${t('cream')}</button>
            </div>
          </div>

          <div class="form-group">
            <label>${t('fontSize')}</label>
            <div class="segmented-control">
              <button class="seg-btn ${state.fontSize === 'sm' ? 'active' : ''}" data-action="set-font" data-val="sm">${t('sm')}</button>
              <button class="seg-btn ${state.fontSize === 'md' ? 'active' : ''}" data-action="set-font" data-val="md">${t('md')}</button>
              <button class="seg-btn ${state.fontSize === 'lg' ? 'active' : ''}" data-action="set-font" data-val="lg">${t('lg')}</button>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="custom-checkbox">
              <input type="checkbox" id="reducedMotionCheck" ${state.reducedMotion ? 'checked' : ''} data-action="toggle-motion" />
              <span>${t('reducedMotion')}</span>
            </label>
          </div>

          <button class="btn btn-primary btn-block" data-action="toggle-settings" style="margin-top: 20px;">
            ${t('close')}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: ORIGINAL GLASSMORPHIC LANDING PAGE                 ║
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
            <a href="#staff-login" class="btn btn-outline btn-sm" style="margin-top: 10px; border-color: rgba(26,26,46,0.2); color: var(--text-muted); display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
              ${SVG_ICONS.lock} ${t('staffPortal')}
            </a>
          </div>
          <p class="landing-footer">
            <span style="display: inline-flex; align-items: center; gap: 4px;">${SVG_ICONS.location} Canada, GTA</span> · 
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
// ║  VIEW: CUSTOMER DIGITAL MENU                              ║
// ╚════════════════════════════════════════════════════════════╝

function renderMenu() {
  const filtered = state.selectedCategory === 'all'
    ? state.menuItems
    : state.menuItems.filter(i => i.category === state.selectedCategory);

  const items = state.searchQuery
    ? filtered.filter(i =>
        i.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(state.searchQuery.toLowerCase()))
    : filtered;

  return `
    ${renderNavbar()}

    <main class="menu-page">
      <!-- Header -->
      <section class="menu-hero-compact">
        <div class="hero-content">
          <h1 class="hero-title">${t('ourMenu')}</h1>
          <p class="hero-subtitle">${t('freshBaked')}</p>
        </div>
        <div class="hero-search-wrapper">
          <div class="search-box">
            <span class="search-icon">${SVG_ICONS.search}</span>
            <input type="text" id="menuSearch" class="search-input"
                   placeholder="${t('searchMenu')}" value="${escapeHtml(state.searchQuery)}" />
            ${state.searchQuery ? `
              <button class="search-clear-btn" data-action="clear-search">&times;</button>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs -->
      <section class="category-section">
        <div class="category-tabs-scroll">
          <div class="category-tabs">
            ${CATEGORIES.map(cat => {
              const count = cat.id === 'all'
                ? state.menuItems.length
                : state.menuItems.filter(i => i.category === cat.id).length;
              return `
                <button class="cat-tab ${state.selectedCategory === cat.id ? 'active' : ''}"
                        data-action="select-category" data-category="${cat.id}">
                  <span class="cat-icon">${getCategoryIcon(cat.id)}</span>
                  <span class="cat-name">${escapeHtml(cat.name)}</span>
                  <span class="cat-count">(${count})</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </section>

      <!-- Menu Grid -->
      <section class="menu-grid-section">
        ${items.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">${SVG_ICONS.search}</div>
            <h3>${t('noItemsFound')}</h3>
            <p class="text-muted">${state.searchQuery ? `No treats match "${escapeHtml(state.searchQuery)}"` : 'Please check back soon.'}</p>
            ${state.searchQuery ? `
              <button class="btn btn-outline btn-sm" data-action="clear-search" style="margin-top: 12px;">Clear Search</button>
            ` : ''}
          </div>
        ` : `
          <div class="menu-grid">
            ${items.map((item, index) => {
              const isAvailable = item.available !== false;
              const catObj = CATEGORIES.find(c => c.id === item.category);
              const catName = catObj ? catObj.name : capitalize(item.category);

              return `
                <article class="menu-card ${!isAvailable ? 'card-sold-out' : ''}" style="animation-delay: ${index * 0.04}s">
                  <div class="card-image-wrap">
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='assets/cake.png'" />
                    <span class="card-category-badge">${getCategoryIcon(item.category)} ${escapeHtml(catName)}</span>
                    ${!isAvailable ? `<span class="badge-sold-out">${t('soldOut')}</span>` : ''}
                  </div>
                  <div class="card-body">
                    <div class="card-header-row">
                      <h3 class="card-title">${escapeHtml(item.name)}</h3>
                      <span class="card-price">${formatCurrency(item.price)}</span>
                    </div>
                    <p class="card-desc">${escapeHtml(item.description)}</p>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        `}
      </section>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <p class="footer-copy">© ${new Date().getFullYear()} ${t('brandName')}. All rights reserved.</p>
        <div class="footer-links">
          <a href="#staff-login" class="footer-staff-link">${SVG_ICONS.lock} ${t('staffPortal')}</a>
        </div>
      </div>
    </footer>
  `;
}

// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: STAFF LOGIN                                        ║
// ╚════════════════════════════════════════════════════════════╝

function renderStaffLogin() {
  return `
    ${renderNavbar()}

    <div class="auth-container">
      <div class="auth-card animate-slide-up">
        <div class="auth-header">
          <div class="auth-icon">${SVG_ICONS.lock}</div>
          <h2>${t('staffPortal')}</h2>
          <p class="text-muted">Sign in to manage bakery menu & categories</p>
        </div>

        <form id="staffLoginForm" data-form="staff-login">
          <div class="form-group">
            <label>${t('username')}</label>
            <input type="text" name="username" required autocomplete="username" placeholder="e.g. salwa" autofocus />
          </div>

          <div class="form-group">
            <label>${t('password')}</label>
            <input type="password" name="password" required autocomplete="current-password" placeholder="••••••••" />
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="margin-top: 16px;">
            ${t('signIn')}
          </button>
        </form>

        <div class="auth-footer">
          <a href="#menu" class="btn btn-link btn-sm">${t('goToMenu')}</a>
        </div>
      </div>
    </div>
  `;
}

// ╔════════════════════════════════════════════════════════════╗
// ║  VIEW: STAFF DASHBOARD (PORTAL)                           ║
// ╚════════════════════════════════════════════════════════════╝

function renderDashboard() {
  const inStockCount = state.menuItems.filter(i => i.available !== false).length;
  const soldOutCount = state.menuItems.filter(i => i.available === false).length;

  return `
    ${renderNavbar()}

    <div class="dashboard-page animate-fade-in">
      <div class="portal-header">
        <div>
          <h2>${SVG_ICONS.settings} ${t('staffPortal')}</h2>
          <p class="text-muted">Manage real-time digital menu, prices & item availability</p>
        </div>

        <div class="portal-header-actions">
          <div class="sync-status-pill ${state.cloudConnected ? 'status-synced' : 'status-local'}" title="${state.cloudConnected ? 'Connected to PostgreSQL' : 'Local storage mode'}">
            <span class="status-dot"></span>
            <span>${state.cloudConnected ? t('cloudSynced') : t('offlineMode')}</span>
          </div>

          <button class="btn btn-outline btn-sm" data-action="manual-sync" title="Pull latest changes from cloud">
            ${SVG_ICONS.refresh} ${t('syncNow')}
          </button>

          <a href="#menu" class="btn btn-outline btn-sm">
            ${t('goToMenu')}
          </a>

          <button class="btn btn-danger btn-sm" data-action="staff-logout">
            ${SVG_ICONS.logout} ${t('logout')}
          </button>
        </div>
      </div>

      ${state.cloudConnected === false ? `
        <div class="db-notice-card">
          <div class="db-notice-icon">${SVG_ICONS.info}</div>
          <div class="db-notice-body">
            <strong>Cross-Device Sync Setup:</strong>
            <p>${t('dbSetupNotice')}</p>
          </div>
        </div>
      ` : ''}

      <div class="portal-metrics-grid">
        <div class="metric-card">
          <span class="metric-num">${state.menuItems.length}</span>
          <span class="metric-label">${t('menuItems')}</span>
        </div>
        <div class="metric-card">
          <span class="metric-num text-success">${inStockCount}</span>
          <span class="metric-label">${t('inStock')}</span>
        </div>
        <div class="metric-card">
          <span class="metric-num text-warning">${soldOutCount}</span>
          <span class="metric-label">${t('outOfStock')}</span>
        </div>
        <div class="metric-card">
          <span class="metric-num">${CATEGORIES.filter(c => c.id !== 'all').length}</span>
          <span class="metric-label">${t('categories')}</span>
        </div>
      </div>

      <!-- Section: Menu Items Management -->
      <div class="dash-section">
        <div class="section-header-flex">
          <div>
            <h3>${SVG_ICONS.cakes} ${t('menuItems')}</h3>
            <p class="text-muted">Click "In Stock" to toggle sold out status instantly</p>
          </div>
          <button class="btn btn-primary" data-action="open-add-menu-item">
            ${SVG_ICONS.plus} ${t('addNewItem')}
          </button>
        </div>

        <div class="manage-table-wrapper">
          <table class="manage-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.menuItems.map(item => {
                const isAvail = item.available !== false;
                const catObj = CATEGORIES.find(c => c.id === item.category);
                const catName = catObj ? catObj.name : item.category;

                return `
                  <tr>
                    <td class="item-title-cell">
                      <img src="${escapeHtml(item.image)}" alt="" class="manage-thumb" onerror="this.src='assets/cake.png'" />
                      <div>
                        <strong>${escapeHtml(item.name)}</strong>
                        <p class="manage-desc text-muted">${escapeHtml(item.description)}</p>
                      </div>
                    </td>
                    <td>
                      <span class="category-tag">${escapeHtml(catName)}</span>
                    </td>
                    <td>
                      <strong>${formatCurrency(item.price)}</strong>
                    </td>
                    <td>
                      <button class="btn-toggle-stock ${isAvail ? 'in-stock' : 'sold-out'}"
                              data-action="toggle-availability" data-id="${item.id}"
                              title="Click to toggle availability">
                        ${isAvail ? `✓ ${t('inStock')}` : `✕ ${t('soldOut')}`}
                      </button>
                    </td>
                    <td style="text-align: right;">
                      <div class="action-btn-group">
                        <button class="btn btn-outline btn-sm" data-action="edit-menu-item" data-id="${item.id}">
                          ${SVG_ICONS.edit} ${t('editItem')}
                        </button>
                        <button class="btn btn-danger btn-sm" data-action="delete-menu-item" data-id="${item.id}">
                          ${SVG_ICONS.trash}
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section: Categories Management -->
      <div class="dash-section" style="margin-top: 32px;">
        <div class="section-header-flex">
          <div>
            <h3>${SVG_ICONS.custom} ${t('categories')}</h3>
            <p class="text-muted">Organize items into distinct menu categories</p>
          </div>
          <button class="btn btn-primary btn-sm" data-action="open-add-category">
            ${SVG_ICONS.plus} ${t('addNewCategory')}
          </button>
        </div>

        <div class="categories-grid">
          ${CATEGORIES.filter(c => c.id !== 'all').map(cat => {
            const count = state.menuItems.filter(i => i.category === cat.id).length;
            return `
              <div class="category-card">
                <div class="cat-card-info">
                  <span class="cat-card-icon">${getCategoryIcon(cat.id)}</span>
                  <div>
                    <h4>${escapeHtml(cat.name)}</h4>
                    <span class="text-muted" style="font-size: 0.8rem;">ID: ${escapeHtml(cat.id)} • ${count} items</span>
                  </div>
                </div>
                <button class="btn btn-danger btn-sm" data-action="delete-category" data-id="${cat.id}" title="Delete Category">
                  ${SVG_ICONS.trash}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Modals -->
    ${renderMenuItemModal()}
    ${renderCategoryModal()}
  `;
}

// ╔════════════════════════════════════════════════════════════╗
// ║  MODALS: ADD/EDIT MENU ITEM & CATEGORY                    ║
// ╚════════════════════════════════════════════════════════════╝

function renderMenuItemModal() {
  if (!state.menuModalOpen) return '';

  const item = state.editingItem;
  const isEdit = item !== null;
  const currentImg = isEdit ? item.image : 'assets/cake.png';

  return `
    <div class="modal-overlay open" data-action="close-menu-modal">
      <div class="modal menu-modal open">
        <div class="modal-header">
          <h3>${isEdit ? t('editItem') : t('addNewItem')}</h3>
          <button class="btn-close" data-action="close-menu-modal">&times;</button>
        </div>

        <form id="menuItemForm" data-form="menu-item">
          ${isEdit ? `<input type="hidden" name="itemId" value="${item.id}" />` : ''}

          <div class="form-group">
            <label>${t('itemName')} *</label>
            <input type="text" name="itemName" required placeholder="e.g. Red Velvet Cake" value="${isEdit ? escapeHtml(item.name) : ''}" />
          </div>

          <div class="form-group">
            <label>${t('description')} *</label>
            <textarea name="itemDesc" required rows="2" placeholder="Describe the flavors, texture & ingredients">${isEdit ? escapeHtml(item.description) : ''}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>${t('price')} ($ CAD) *</label>
              <input type="number" name="itemPrice" required min="0" step="0.01" placeholder="0.00" value="${isEdit ? item.price : ''}" />
            </div>

            <div class="form-group">
              <label>${t('category')} *</label>
              <select name="itemCategory" required>
                ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
                  <option value="${c.id}" ${isEdit && item.category === c.id ? 'selected' : ''}>
                    ${c.name}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>${t('image')} (Upload File, Choose Preset, or Enter URL)</label>
            
            <div class="image-picker-row">
              <div class="image-preview-box">
                <img id="itemImagePreview" src="${escapeHtml(currentImg)}" alt="Preview" onerror="this.src='assets/cake.png'" />
              </div>

              <div class="image-controls">
                <label class="btn btn-outline btn-sm file-upload-btn">
                  <span>Upload Image File</span>
                  <input type="file" id="itemImageFile" accept="image/*" style="display: none;" />
                </label>

                <input type="text" name="itemImageUrl" id="itemImageUrlInput"
                       class="form-control" style="margin-top: 8px; font-size: 0.85rem;"
                       placeholder="or paste image URL / asset path" value="${escapeHtml(currentImg)}" />
                <input type="hidden" name="itemImage" id="itemImageBase64" value="${escapeHtml(currentImg)}" />
              </div>
            </div>

            <div class="preset-assets-selector">
              <span class="text-muted" style="font-size: 0.8rem;">Presets:</span>
              <button type="button" class="preset-pill" data-action="pick-preset-img" data-img="assets/cake.png">Cake</button>
              <button type="button" class="preset-pill" data-action="pick-preset-img" data-img="assets/cupcake.png">Cupcake</button>
              <button type="button" class="preset-pill" data-action="pick-preset-img" data-img="assets/cookie.png">Cookie</button>
              <button type="button" class="preset-pill" data-action="pick-preset-img" data-img="assets/pastry.png">Pastry</button>
              <button type="button" class="preset-pill" data-action="pick-preset-img" data-img="assets/custom_cake.png">Custom</button>
            </div>
          </div>

          <div class="form-group checkbox-group" style="margin-top: 12px;">
            <label class="custom-checkbox">
              <input type="checkbox" name="itemAvailable" ${!isEdit || item.available !== false ? 'checked' : ''} />
              <span><strong>${t('inStock')}</strong> (Uncheck to mark as Sold Out)</span>
            </label>
          </div>

          <div class="modal-footer-btns">
            <button type="button" class="btn btn-outline" data-action="close-menu-modal">${t('cancel')}</button>
            <button type="submit" class="btn btn-primary">${t('saveChanges')}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderCategoryModal() {
  if (!state.categoryModalOpen) return '';

  return `
    <div class="modal-overlay open" data-action="close-category-modal">
      <div class="modal category-modal open">
        <div class="modal-header">
          <h3>${t('addNewCategory')}</h3>
          <button class="btn-close" data-action="close-category-modal">&times;</button>
        </div>

        <form id="categoryForm" data-form="add-category">
          <div class="form-group">
            <label>${t('categoryName')} *</label>
            <input type="text" name="catName" required placeholder="e.g. Cold Drinks" />
          </div>

          <div class="form-group">
            <label>${t('categoryId')} (slug) *</label>
            <input type="text" name="catId" required placeholder="e.g. drinks" />
          </div>

          <div class="modal-footer-btns">
            <button type="button" class="btn btn-outline" data-action="close-category-modal">${t('cancel')}</button>
            <button type="submit" class="btn btn-primary">${t('addNewCategory')}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ╔════════════════════════════════════════════════════════════╗
// ║  EVENT DELEGATION & ACTIONS                                ║
// ╚════════════════════════════════════════════════════════════╝

function handleGlobalClick(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  if (target.classList.contains('modal-overlay') && e.target !== target) {
    return;
  }

  const action = target.dataset.action;

  switch (action) {
    case 'select-category':
      state.selectedCategory = target.dataset.category;
      render();
      break;

    case 'clear-search':
      state.searchQuery = '';
      const input = document.getElementById('menuSearch');
      if (input) input.value = '';
      render();
      break;

    case 'toggle-settings':
      state.settingsOpen = !state.settingsOpen;
      renderSettingsModal();
      break;

    case 'set-lang':
      state.language = target.dataset.val;
      saveSettings();
      applySettings();
      render();
      break;

    case 'set-theme':
      state.theme = target.dataset.val;
      saveSettings();
      applySettings();
      render();
      break;

    case 'set-font':
      state.fontSize = target.dataset.val;
      saveSettings();
      applySettings();
      render();
      break;

    case 'toggle-motion':
      state.reducedMotion = target.checked;
      saveSettings();
      applySettings();
      break;

    case 'toggle-mobile-nav':
      state.mobileMenuOpen = !state.mobileMenuOpen;
      render();
      break;

    case 'close-mobile-nav':
      state.mobileMenuOpen = false;
      break;

    case 'manual-sync':
      syncWithCloudDatabase(true);
      break;

    case 'staff-logout':
      state.isLoggedIn = false;
      localStorage.removeItem('salwa_logged_in');
      sessionStorage.removeItem('salwa_logged_in');
      state.mobileMenuOpen = false;
      window.location.hash = '#landing';
      showToast('Logged out of Staff Portal', 'info');
      render();
      break;

    case 'open-add-menu-item':
      state.editingItem = null;
      state.menuModalOpen = true;
      render();
      break;

    case 'edit-menu-item':
      const editId = Number(target.dataset.id);
      const foundItem = state.menuItems.find(i => i.id === editId);
      if (foundItem) {
        state.editingItem = { ...foundItem };
        state.menuModalOpen = true;
        render();
      }
      break;

    case 'delete-menu-item':
      const delId = Number(target.dataset.id);
      if (confirm(t('confirmDelete'))) {
        state.menuItems = state.menuItems.filter(i => i.id !== delId);
        saveMenu();
        render();
      }
      break;

    case 'toggle-availability':
      const toggleId = Number(target.dataset.id);
      const itemToToggle = state.menuItems.find(i => i.id === toggleId);
      if (itemToToggle) {
        itemToToggle.available = itemToToggle.available === false ? true : false;
        saveMenu();
        render();
      }
      break;

    case 'close-menu-modal':
      state.menuModalOpen = false;
      state.editingItem = null;
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
      const catId = target.dataset.id;
      if (confirm(t('confirmDeleteCat'))) {
        CATEGORIES = CATEGORIES.filter(c => c.id !== catId);
        saveCategories();
        render();
      }
      break;

    case 'pick-preset-img':
      const presetImg = target.dataset.img;
      const previewImg = document.getElementById('itemImagePreview');
      const hiddenInput = document.getElementById('itemImageBase64');
      const urlInput = document.getElementById('itemImageUrlInput');
      if (previewImg) previewImg.src = presetImg;
      if (hiddenInput) hiddenInput.value = presetImg;
      if (urlInput) urlInput.value = presetImg;
      break;
  }
}

function handleGlobalSubmit(e) {
  const form = e.target.closest('[data-form]');
  if (!form) return;
  e.preventDefault();

  const formType = form.dataset.form;

  // Staff Login Handler
  if (formType === 'staff-login') {
    const data = new FormData(form);
    const u = (data.get('username') || '').trim();
    const p = (data.get('password') || '').trim();

    if (u.toLowerCase() === STAFF_CREDENTIALS.username && p === STAFF_CREDENTIALS.password) {
      state.isLoggedIn = true;
      localStorage.setItem('salwa_logged_in', 'true');
      showToast('Welcome to Staff Portal! ✓', 'success');
      window.location.hash = '#dashboard';
      render();
    } else {
      showToast('Invalid username or password', 'error');
    }
  }

  // Add / Edit Menu Item Handler
  if (formType === 'menu-item') {
    const data = new FormData(form);
    const idField = data.get('itemId');
    const name = (data.get('itemName') || '').trim();
    const desc = (data.get('itemDesc') || '').trim();
    const price = parseFloat(data.get('itemPrice')) || 0;
    const category = data.get('itemCategory');
    const image = (data.get('itemImage') || 'assets/cake.png').trim();
    const available = form.querySelector('[name="itemAvailable"]') ? form.querySelector('[name="itemAvailable"]').checked : true;

    if (idField) {
      const editId = Number(idField);
      const idx = state.menuItems.findIndex(i => i.id === editId);
      if (idx !== -1) {
        state.menuItems[idx] = {
          ...state.menuItems[idx],
          name,
          description: desc,
          price,
          category,
          image,
          available
        };
      }
    } else {
      const nextId = state.menuItems.reduce((max, i) => Math.max(max, i.id), 0) + 1;
      state.menuItems.push({
        id: nextId,
        name,
        description: desc,
        price,
        category,
        image,
        available
      });
    }

    state.menuModalOpen = false;
    state.editingItem = null;
    saveMenu();
    render();
  }

  // Add Category Handler
  if (formType === 'add-category') {
    const data = new FormData(form);
    const name = (data.get('catName') || '').trim();
    let id = (data.get('catId') || '').trim().toLowerCase().replace(/\s+/g, '-');

    if (!id) id = name.toLowerCase().replace(/\s+/g, '-');

    if (CATEGORIES.some(c => c.id === id)) {
      showToast('Category ID already exists', 'error');
      return;
    }

    CATEGORIES.push({ id, name, iconKey: id });
    state.categoryModalOpen = false;
    saveCategories();
    render();
  }
}

function handleGlobalInput(e) {
  if (e.target.id === 'menuSearch') {
    state.searchQuery = e.target.value;
    const gridSection = document.querySelector('.menu-grid-section');
    if (gridSection) {
      const filtered = state.selectedCategory === 'all'
        ? state.menuItems
        : state.menuItems.filter(i => i.category === state.selectedCategory);

      const items = state.searchQuery
        ? filtered.filter(i =>
            i.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            i.description.toLowerCase().includes(state.searchQuery.toLowerCase()))
        : filtered;

      if (items.length === 0) {
        gridSection.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">${SVG_ICONS.search}</div>
            <h3>${t('noItemsFound')}</h3>
            <p class="text-muted">No treats match "${escapeHtml(state.searchQuery)}"</p>
          </div>
        `;
      } else {
        gridSection.innerHTML = `
          <div class="menu-grid">
            ${items.map((item, index) => {
              const isAvailable = item.available !== false;
              const catObj = CATEGORIES.find(c => c.id === item.category);
              const catName = catObj ? catObj.name : capitalize(item.category);

              return `
                <article class="menu-card ${!isAvailable ? 'card-sold-out' : ''}">
                  <div class="card-image-wrap">
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='assets/cake.png'" />
                    <span class="card-category-badge">${getCategoryIcon(item.category)} ${escapeHtml(catName)}</span>
                    ${!isAvailable ? `<span class="badge-sold-out">${t('soldOut')}</span>` : ''}
                  </div>
                  <div class="card-body">
                    <div class="card-header-row">
                      <h3 class="card-title">${escapeHtml(item.name)}</h3>
                      <span class="card-price">${formatCurrency(item.price)}</span>
                    </div>
                    <p class="card-desc">${escapeHtml(item.description)}</p>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        `;
      }
    }
  }

  if (e.target.id === 'itemImageUrlInput') {
    const val = e.target.value.trim();
    const preview = document.getElementById('itemImagePreview');
    const hidden = document.getElementById('itemImageBase64');
    if (preview && val) preview.src = val;
    if (hidden && val) hidden.value = val;
  }
}

function handleGlobalChange(e) {
  if (e.target.id === 'itemImageFile') {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        const preview = document.getElementById('itemImagePreview');
        const hidden = document.getElementById('itemImageBase64');
        const urlInput = document.getElementById('itemImageUrlInput');

        if (preview) preview.src = dataUrl;
        if (hidden) hidden.value = dataUrl;
        if (urlInput) urlInput.value = dataUrl.substring(0, 32) + '... (Uploaded image)';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// ╔════════════════════════════════════════════════════════════╗
// ║  SETTINGS & LOCALIZATION                                   ║
// ╚════════════════════════════════════════════════════════════╝

function loadSettings() {
  const stored = localStorage.getItem('salwa_settings');
  if (stored) {
    try {
      const s = JSON.parse(stored);
      if (s.language) state.language = s.language;
      if (s.theme) state.theme = s.theme;
      if (s.fontSize) state.fontSize = s.fontSize;
      if (s.reducedMotion !== undefined) state.reducedMotion = s.reducedMotion;
      if (s.highContrast !== undefined) state.highContrast = s.highContrast;
    } catch (e) {}
  }
}

function saveSettings() {
  localStorage.setItem('salwa_settings', JSON.stringify({
    language: state.language,
    theme: state.theme,
    fontSize: state.fontSize,
    reducedMotion: state.reducedMotion,
    highContrast: state.highContrast
  }));
}

function applySettings() {
  const root = document.documentElement;
  root.setAttribute('data-theme', state.theme);
  root.setAttribute('data-font-size', state.fontSize);
  root.setAttribute('lang', state.language);
  root.setAttribute('dir', state.language === 'ar' ? 'rtl' : 'ltr');

  if (state.reducedMotion) {
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }
}

// ╔════════════════════════════════════════════════════════════╗
// ║  TOAST NOTIFICATIONS                                       ║
// ╚════════════════════════════════════════════════════════════╝

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slide-up`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Startup ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
