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
  settingsOpen:   false
};

window.state = state;


// ╔════════════════════════════════════════════════════════════╗
// ║  INITIALISATION                                           ║
// ╚════════════════════════════════════════════════════════════╝

function init() {
  // Load settings
  loadSettings();
  applySettings();

  // Load persisted menu or fall back to defaults
  const storedMenu = localStorage.getItem('salwa_menu');
  state.menuItems = storedMenu ? JSON.parse(storedMenu) : [...DEFAULT_MENU_ITEMS];

  // Load persisted orders
  const storedOrders = localStorage.getItem('salwa_orders');
  state.orders = storedOrders ? JSON.parse(storedOrders) : [];

  // Restore cart from sessionStorage (survives page refreshes)
  const storedCart = sessionStorage.getItem('salwa_cart');
  state.cart = storedCart ? JSON.parse(storedCart) : [];

  // Check staff login
  state.isLoggedIn = sessionStorage.getItem('salwa_logged_in') === 'true';

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
}

function handleStorageChange(e) {
  if (e.key === 'salwa_orders') {
    const oldLength = state.orders.length;
    const storedOrders = localStorage.getItem('salwa_orders');
    state.orders = storedOrders ? JSON.parse(storedOrders) : [];
    
    if (state.currentView === 'dashboard' && state.orders.length > oldLength) {
      playNewOrderChime();
      showToast('New order received! 🧁', 'success');
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

  // Append settings modal to the DOM
  app.innerHTML += renderSettingsModal();
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
          <p class="landing-subtitle">${state.language === 'ar' ? 'صنع بكل حب · كندا، تورنتو' : (state.language === 'fr' ? 'Fait à la main avec amour · Canada, GTA' : 'Handcrafted with Love · Canada, GTA')}</p>
          <div class="landing-buttons">
            <a href="#menu" class="btn btn-primary btn-lg">
              <span>🧁</span> ${t('browseMenu')}
            </a>
            <a href="#track-order" class="btn btn-outline btn-lg">
              <span>🔍</span> ${t('trackYourOrder')}
            </a>
            <a href="#staff-login" class="btn btn-outline btn-sm" style="margin-top: 10px; border-color: rgba(26,26,46,0.2); color: var(--text-gray);">
              <span>🔐</span> ${t('staffPortal')}
            </a>
          </div>
          <p class="landing-footer">📍 Canada, GTA · 💌 DM us @salwas.bakery</p>
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
    return `
      <nav class="navbar navbar-staff">
        <a href="#landing" class="navbar-brand">
          <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
          <span>Salwa's Bakery</span>
        </a>
        <div class="navbar-links">
          <button class="nav-tab ${state.dashboardTab === 'orders' ? 'active' : ''}"
                  data-action="switch-dash-tab" data-tab="orders">
            📋 ${t('ordersToday')}
          </button>
          <button class="nav-tab ${state.dashboardTab === 'menu-manage' ? 'active' : ''}"
                  data-action="switch-dash-tab" data-tab="menu-manage">
            📝 ${t('menuItems')}
          </button>
          <button class="btn btn-outline btn-sm" data-action="staff-logout">
            🚪 ${t('logout')}
          </button>
        </div>
      </nav>
    `;
  }

  // Customer navbar
  return `
    <nav class="navbar">
      <a href="#landing" class="navbar-brand">
        <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
        <span>Salwa's Bakery</span>
      </a>
      <div class="navbar-links">
        <a href="#landing" class="nav-link">
          <svg class="nav-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>${t('home')}</span>
        </a>
        <a href="#track-order" class="nav-link">
          <svg class="nav-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>${t('trackOrder')}</span>
        </a>
        <button class="btn-settings" data-action="toggle-settings" aria-label="${t('settings')}">
          <svg class="settings-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
        <button class="btn-cart" data-action="toggle-cart">
          <svg class="cart-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          ${getCartCount() > 0 ? `<span class="cart-badge">${getCartCount()}</span>` : ''}
        </button>
      </div>
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
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.name}</span>
          </button>
        `).join('')}
      </div>

      <!-- Menu Grid -->
      <div class="menu-grid">
        ${items.length === 0
          ? `<div class="empty-state"><p>😔 No items found</p></div>`
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
                  <button class="btn btn-primary btn-sm" data-action="add-to-cart" data-id="${item.id}">
                    + ${t('addToCart')}
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
        <h3>🛒 ${t('yourCart')}</h3>
        <button class="btn-close" data-action="toggle-cart">&times;</button>
      </div>

      <div class="cart-body">
        ${state.cart.length === 0
          ? `<div class="empty-state">
               <p style="font-size:3rem; margin:0;">🧺</p>
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
            <span>🎫</span> ${t('estOrderId')}: SB-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${new Date().getDate().toString().padStart(2,'0')}-XXX
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
      <div class="modal checkout-modal ${state.checkoutOpen ? 'open' : ''}" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>📝 ${t('checkout')}</h3>
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
            <label for="custEmail">${t('email')} (${state.language === 'ar' ? 'اختياري' : (state.language === 'fr' ? 'optionnel' : 'optional')})</label>
            <input type="email" id="custEmail" name="email" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label for="orderType">${t('orderType')}</label>
            <select id="orderType" name="orderType">
              <option value="pickup">🏪 ${t('pickup')}</option>
              <option value="delivery">🚗 ${t('delivery')}</option>
            </select>
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

          <button type="submit" class="btn btn-primary btn-block btn-lg">
            🎉 ${t('placeOrder')}
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
          ${order.email ? `<p><strong>${t('email')}:</strong> ${escapeHtml(order.email)}</p>` : ''}
          <p><strong>${t('orderType')}:</strong> ${order.type === 'pickup' ? `🏪 ${t('pickup')}` : `🚗 ${t('delivery')}`}</p>
          ${order.notes ? `<p><strong>${t('specialNotes')}:</strong> ${escapeHtml(order.notes)}</p>` : ''}
        </div>

        <p class="confirm-msg">📞 ${t('contactConfirm')}</p>

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
          <h2>🔍 ${t('trackYourOrder')}</h2>
          <p class="text-muted">${t('enterOrderNum')}</p>
        </div>

        <form class="track-form" data-form="track">
          <input type="text" name="orderNumber" required 
                 placeholder="e.g. SB-20260620-001" 
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
                  <p><strong>${t('orderType')}:</strong> ${trackedOrder.type === 'pickup' ? `🏪 ${t('pickup')}` : `🚗 ${t('delivery')}`}</p>
                  <p><strong>${t('datePlaced')}:</strong> ${formatDateFull(new Date(trackedOrder.createdAt))} ${state.language === 'ar' ? 'في' : (state.language === 'fr' ? 'à' : 'at')} ${formatTime(trackedOrder.createdAt)}</p>
                  ${trackedOrder.notes ? `<p><strong>${t('specialNotes')}:</strong> ${escapeHtml(trackedOrder.notes)}</p>` : ''}
                </div>
              </div>
            </div>
          ` : `
            <div class="empty-state animate-fade-in">
              <p style="font-size:3rem;">🔎</p>
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
                    <div class="recent-track-status">
                      <span class="status-badge status-${slugify(o.status)}">${t(slugify(o.status))}</span>
                      <span class="recent-total">${formatCurrency(o.total)}</span>
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
    { label: t('orderReceived'), status: 'Pending', icon: '📝', desc: t('orderReceivedDesc') },
    { label: t('completed'), status: 'Completed', icon: '🎉', desc: t('completedDesc') }
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
    render();
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
        <div class="login-icon">🔐</div>
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
          <div id="loginError" class="login-error" style="display:none;">
            ❌ Invalid username or password
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
          <h2>Welcome Back 👋</h2>
          <p>${formatDateFull(new Date())}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <span class="stat-value">${todayOrders.length}</span>
            <span class="stat-label">Orders Today</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <span class="stat-value">${pendingOrders.length}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <span class="stat-value">${formatCurrency(revenueToday)}</span>
            <span class="stat-label">Revenue Today</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🧁</div>
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
             <p style="font-size:3rem;">📭</p>
             <p>No orders ${state.orderFilter !== 'all' ? `with status "${state.orderFilter}"` : 'yet'}</p>
           </div>`
        : `<div class="orders-table-wrapper">
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
                      <span class="text-muted">${escapeHtml(o.phone || '')}</span>
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
                            ✅ ${t('complete')}
                          </button>
                        ` : ''}
                        <button class="btn btn-outline btn-sm btn-print" data-action="print-order" data-id="${o.orderNumber}">
                          🖨️ ${t('print')}
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
           </div>`
      }
    </div>
  `;
}


// ── Dashboard: Menu Management Tab ───────────────────────────

function renderMenuManageTab() {
  return `
    <div class="dash-section">
      <div class="section-header">
        <h3>📝 Menu Management</h3>
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
              <button class="btn btn-outline btn-sm" data-action="edit-menu-item" data-id="${item.id}">✏️ Edit</button>
              <button class="btn btn-danger btn-sm" data-action="delete-menu-item" data-id="${item.id}">🗑️ Delete</button>
            </div>
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
      <div class="modal menu-modal ${state.menuModalOpen ? 'open' : ''}" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>${isEdit ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
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
            <label>Image Path</label>
            <input type="text" name="itemImage" placeholder="assets/cake.png" value="${isEdit ? escapeHtml(item.image) : 'assets/cake.png'}" />
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

    case 'switch-dash-tab':
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
  }
}

/**
 * Handle status dropdown changes in the orders table.
 */
function handleGlobalChange(e) {
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
  showToast(`${item ? item.name : 'Item'} added to cart! 🛒`, 'success');
  render();

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

function openCheckout() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  state.cartOpen = false;
  state.checkoutOpen = true;
  render();
}

function closeCheckout() {
  state.checkoutOpen = false;
  render();
}


// ╔════════════════════════════════════════════════════════════╗
// ║  ORDER ACTIONS                                            ║
// ╚════════════════════════════════════════════════════════════╝

function submitOrder(form) {
  const fd = new FormData(form);

  const customerName = fd.get('customerName').trim();
  const phone        = fd.get('phone').trim();
  const email        = (fd.get('email') || '').trim();
  const orderType    = fd.get('orderType');
  const notes        = (fd.get('notes') || '').trim();

  if (!customerName || !phone) {
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
    email,
    items: orderItems,
    total: getCartTotal(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    type: orderType,
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

  if (username === STAFF_CREDENTIALS.username && password === STAFF_CREDENTIALS.password) {
    state.isLoggedIn = true;
    sessionStorage.setItem('salwa_logged_in', 'true');
    showToast('Welcome back! 👋', 'success');
    window.location.hash = '#dashboard';
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
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span>
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

function saveOrders() {
  localStorage.setItem('salwa_orders', JSON.stringify(state.orders));
}

function saveMenu() {
  localStorage.setItem('salwa_menu', JSON.stringify(state.menuItems));
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
          <p><strong>Type:</strong> ${order.type.toUpperCase()}</p>
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
      <div class="modal settings-modal ${state.settingsOpen ? 'open' : ''}" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>⚙️ ${t('settings')}</h3>
          <button class="btn-close" data-action="close-settings">&times;</button>
        </div>
        
        <form id="settingsForm" data-form="settings">
          <!-- Language Select -->
          <div class="form-group">
            <label>${t('language')}</label>
            <select name="language" class="settings-select">
              <option value="en" ${isEn ? 'selected' : ''}>🇺🇸 English</option>
              <option value="fr" ${isFr ? 'selected' : ''}>🇫🇷 Français</option>
              <option value="ar" ${isAr ? 'selected' : ''}>🇸🇦 العربية</option>
            </select>
          </div>

          <!-- Theme Select -->
          <div class="form-group">
            <label>${t('theme')}</label>
            <div class="theme-picker-grid">
              <label class="theme-option">
                <input type="radio" name="theme" value="light" ${state.theme === 'light' ? 'checked' : ''} />
                <span class="theme-preview light-preview"></span>
                <span class="theme-label">${t('light')}</span>
              </label>
              <label class="theme-option">
                <input type="radio" name="theme" value="dark" ${state.theme === 'dark' ? 'checked' : ''} />
                <span class="theme-preview dark-preview"></span>
                <span class="theme-label">${t('dark')}</span>
              </label>
              <label class="theme-option">
                <input type="radio" name="theme" value="cream" ${state.theme === 'cream' ? 'checked' : ''} />
                <span class="theme-preview cream-preview"></span>
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
                <span>A-</span>
                <span class="font-label">${t('sm')}</span>
              </label>
              <label class="font-option">
                <input type="radio" name="fontSize" value="md" ${state.fontSize === 'md' ? 'checked' : ''} />
                <span>A</span>
                <span class="font-label">${t('md')}</span>
              </label>
              <label class="font-option">
                <input type="radio" name="fontSize" value="lg" ${state.fontSize === 'lg' ? 'checked' : ''} />
                <span>A+</span>
                <span class="font-label">${t('lg')}</span>
              </label>
              <label class="font-option">
                <input type="radio" name="fontSize" value="xl" ${state.fontSize === 'xl' ? 'checked' : ''} />
                <span>A++</span>
                <span class="font-label">${t('xl')}</span>
              </label>
            </div>
          </div>

          <!-- Accessibility Checkboxes -->
          <div class="form-group accessibility-checkboxes">
            <label class="checkbox-label">
              <input type="checkbox" name="reducedMotion" ${state.reducedMotion ? 'checked' : ''} />
              <span>🏃‍♂️ ${t('reducedMotion')}</span>
            </label>
            <label class="checkbox-label" style="margin-top: 12px; display: block;">
              <input type="checkbox" name="highContrast" ${state.highContrast ? 'checked' : ''} />
              <span>👁️ ${t('highContrast')}</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 24px;">
            🎉 ${t('saveSettings')}
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
  showToast('Settings saved successfully! ⚙️', 'success');
  render();
}




