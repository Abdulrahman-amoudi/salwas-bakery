// ============================================================
//  data.js — Salwa's Bakery  |  Default Data & Helpers
// ============================================================

/**
 * Default menu items grouped by category.
 * Each item has a unique id, display info, price (CAD), and an
 * image path relative to the project root.
 */
const DEFAULT_MENU_ITEMS = [
  // ── CAKES ──────────────────────────────────────────────────
  { id: 1,  name: 'Red Velvet Cake',        description: 'Rich red velvet layers with cream cheese frosting',                          price: 45.00,  category: 'cakes',    image: 'assets/cake.png' },
  { id: 2,  name: 'Chocolate Fudge Cake',   description: 'Decadent dark chocolate layers with fudge ganache',                          price: 42.00,  category: 'cakes',    image: 'assets/cake.png' },
  { id: 3,  name: 'Vanilla Bean Cake',      description: 'Classic vanilla sponge with Madagascar vanilla buttercream',                 price: 38.00,  category: 'cakes',    image: 'assets/cake.png' },
  { id: 4,  name: 'Strawberry Shortcake',   description: 'Light sponge with fresh strawberries and whipped cream',                     price: 40.00,  category: 'cakes',    image: 'assets/cake.png' },

  // ── CUPCAKES ───────────────────────────────────────────────
  { id: 5,  name: 'Classic Vanilla Cupcake',    description: 'Fluffy vanilla cupcake with rose buttercream swirl',                     price: 4.50,   category: 'cupcakes', image: 'assets/cupcake.png' },
  { id: 6,  name: 'Chocolate Ganache Cupcake',  description: 'Rich chocolate cupcake topped with silky ganache',                       price: 5.00,   category: 'cupcakes', image: 'assets/cupcake.png' },
  { id: 7,  name: 'Rose Pistachio Cupcake',     description: 'Delicate rose-flavored cupcake with pistachio crumble',                  price: 5.50,   category: 'cupcakes', image: 'assets/cupcake.png' },
  { id: 8,  name: 'Lemon Blueberry Cupcake',    description: 'Zesty lemon cake with fresh blueberry compote',                          price: 5.00,   category: 'cupcakes', image: 'assets/cupcake.png' },

  // ── COOKIES & MACARONS ─────────────────────────────────────
  { id: 9,  name: 'French Macarons (Box of 6)',     description: 'Assorted flavors: rose, pistachio, vanilla, chocolate, lavender, raspberry', price: 18.00, category: 'cookies', image: 'assets/cookie.png' },
  { id: 10, name: 'Chocolate Chip Cookies (6pc)',    description: 'Classic chewy cookies with Belgian chocolate chunks',                        price: 12.00, category: 'cookies', image: 'assets/cookie.png' },
  { id: 11, name: 'Decorated Sugar Cookies (6pc)',   description: 'Hand-decorated royal icing cookies, customizable designs',                   price: 22.00, category: 'cookies', image: 'assets/cookie.png' },
  { id: 12, name: 'Almond Biscotti (8pc)',           description: 'Twice-baked Italian almond biscotti, perfect with coffee',                   price: 14.00, category: 'cookies', image: 'assets/cookie.png' },

  // ── PASTRIES ───────────────────────────────────────────────
  { id: 13, name: 'Butter Croissant',  description: 'Flaky, golden French-style butter croissant',                price: 4.00,  category: 'pastries', image: 'assets/pastry.png' },
  { id: 14, name: 'Cinnamon Roll',     description: 'Soft, gooey cinnamon roll with cream cheese glaze',          price: 5.50,  category: 'pastries', image: 'assets/pastry.png' },
  { id: 15, name: 'Danish Pastry',     description: 'Flaky pastry filled with seasonal fruit and custard',        price: 4.50,  category: 'pastries', image: 'assets/pastry.png' },
  { id: 16, name: 'Baklava (4pc)',     description: 'Layers of phyllo dough with mixed nuts and honey syrup',     price: 10.00, category: 'pastries', image: 'assets/pastry.png' },

  // ── CUSTOM ORDERS ──────────────────────────────────────────
  { id: 17, name: 'Custom Celebration Cake',  description: 'Personalized cake with your choice of flavor, design & message. Contact us for details.', price: 85.00,  category: 'custom', image: 'assets/custom_cake.png' },
  { id: 18, name: 'Custom Cupcake Box (12pc)', description: 'Box of 12 custom-designed cupcakes for your special event',                              price: 55.00,  category: 'custom', image: 'assets/cupcake.png' },
  { id: 19, name: 'Dessert Table Package',     description: 'Full dessert spread for events: cake, cupcakes, cookies & pastries. Serves 30+',         price: 250.00, category: 'custom', image: 'assets/custom_cake.png' },
];

/**
 * Menu categories with display names and emoji icons.
 * "all" is a virtual category showing every item.
 */
let CATEGORIES = [
  { id: 'all',      name: 'All Items',          icon: '✨' },
  { id: 'cakes',    name: 'Cakes',              icon: '🎂' },
  { id: 'cupcakes', name: 'Cupcakes',           icon: '🧁' },
  { id: 'cookies',  name: 'Cookies & Macarons', icon: '🍪' },
  { id: 'pastries', name: 'Pastries',           icon: '🥐' },
  { id: 'custom',   name: 'Custom Orders',      icon: '🎀' },
];

/** Hard-coded staff credentials (demo only). */
const STAFF_CREDENTIALS = {
  username: 'salwa',
  password: 'amoudi'
};

/** Possible order lifecycle statuses. */
const ORDER_STATUSES = ['Pending', 'Completed'];

/**
 * Generate a unique, human-readable order number.
 * Format: SB-101, SB-102, sequential.
 */
function generateOrderNumber() {
  const orders = JSON.parse(localStorage.getItem('salwa_orders') || '[]');
  let nextSeq = 101;
  if (orders.length > 0) {
    const seqs = orders.map(o => {
      if (o.orderNumber && o.orderNumber.startsWith('SB-')) {
        const num = parseInt(o.orderNumber.substring(3), 10);
        // Ignore large date-based numbers (e.g. YYYYMMDD)
        if (!isNaN(num) && num < 100000) {
          return num;
        }
      }
      return 0;
    });
    const maxSeq = Math.max(...seqs);
    if (maxSeq >= 101) {
      nextSeq = maxSeq + 1;
    } else {
      nextSeq = 101 + orders.length;
    }
  }
  return `SB-${nextSeq}`;
}

// ============================================================
//  TRANSLATIONS & LOCALISATION DICTIONARY
// ============================================================
const TRANSLATIONS = {
  en: {
    home: 'Home',
    trackOrder: 'Track Order',
    trackYourOrder: 'Track Your Order',
    browseMenu: 'Browse Our Menu',
    staffPortal: 'Staff Portal',
    ourMenu: 'Our Menu',
    freshBaked: 'Fresh-baked daily with the finest ingredients',
    searchMenu: 'Search our menu...',
    addToCart: 'Add to Cart',
    addedToCart: 'added to cart!',
    yourCart: 'Your Cart',
    cartEmpty: 'Your Cart is Empty',
    addTreats: 'Add some delicious treats!',
    total: 'Total',
    proceedCheckout: 'Proceed to Checkout',
    checkout: 'Checkout',
    customerName: 'Customer Name',
    phone: 'Phone Number',
    email: 'Email',
    orderType: 'Order Type',
    specialNotes: 'Special Notes',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',
    placedSuccess: 'Order Placed Successfully!',
    backMenu: 'Back to Menu',
    datePlaced: 'Date Placed',
    totalPaid: 'Total Paid',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    fontSize: 'Font Size',
    reducedMotion: 'Reduced Motion',
    highContrast: 'High Contrast',
    saveSettings: 'Save Settings',
    close: 'Close',
    light: 'Light (Classic)',
    dark: 'Dark (Night Rose)',
    cream: 'Cream (Warm Honey)',
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'Extra Large',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',
    logout: 'Logout',
    welcomeBack: 'Welcome Back',
    ordersToday: 'Orders Today',
    pending: 'Pending',
    revenueToday: 'Revenue Today',
    menuItems: 'Menu Items',
    prep: 'Prep',
    ready: 'Ready',
    complete: 'Complete',
    print: 'Print',
    actions: 'Actions',
    time: 'Time',
    customer: 'Customer',
    items: 'Items',
    orderNum: 'Order #',
    status: 'Status',
    currentStatus: 'Current Status',
    recentOrders: 'Your Recent Orders',
    enterOrderNum: 'Enter your order number to check the status',
    orderNotFound: 'Order Not Found',
    noRecentOrders: 'No recent orders found.',
    estOrderId: 'Est. Order ID',
    pickup: 'Pickup',
    delivery: 'Delivery',
    contactConfirm: 'We\'ll contact you shortly to confirm your order',
    bakingTimer: 'Chef Salwa is baking',
    orderReceivedDesc: 'We have received your order',
    preparingDesc: 'Chef Salwa is baking',
    readyDesc: 'Ready for pickup/delivery',
    completedDesc: 'Picked up or delivered',
    orderReceived: 'Order Received',
    preparing: 'Preparing',
    completed: 'Completed',
    location: 'Delivery Address or "Pickup"',
    locationPlaceholder: 'e.g. Pickup from store, or 123 Main St, Toronto',
    addedSuccess: 'Added! ✓',
    categories: 'Categories',
    addCategory: 'Add Category',
    categoryId: 'Category ID',
    categoryName: 'Category Name',
    categoryIcon: 'Emoji Icon'
  },
  fr: {
    home: 'Accueil',
    trackOrder: 'Suivi de Commande',
    trackYourOrder: 'Suivre Votre Commande',
    browseMenu: 'Parcourir Notre Menu',
    staffPortal: 'Portail du Personnel',
    ourMenu: 'Notre Menu',
    freshBaked: 'Cuit frais tous les jours avec les meilleurs ingrédients',
    searchMenu: 'Rechercher dans notre menu...',
    addToCart: 'Ajouter au Panier',
    addedToCart: 'ajouté au panier !',
    yourCart: 'Votre Panier',
    cartEmpty: 'Votre panier est vide',
    addTreats: 'Ajoutez de délicieuses friandises !',
    total: 'Total',
    proceedCheckout: 'Passer à la Caisse',
    checkout: 'Caisse',
    customerName: 'Nom du Client',
    phone: 'Numéro de Téléphone',
    email: 'E-mail',
    orderType: 'Type de Commande',
    specialNotes: 'Notes Spéciales',
    orderSummary: 'Résumé de la Commande',
    placeOrder: 'Passer la Commande',
    placedSuccess: 'Commande passée avec succès !',
    backMenu: 'Retour au Menu',
    datePlaced: 'Date de Commande',
    totalPaid: 'Total Payé',
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    fontSize: 'Taille de Police',
    reducedMotion: 'Mouvement Réduit',
    highContrast: 'Contraste Élevé',
    saveSettings: 'Enregistrer',
    close: 'Fermer',
    light: 'Clair (Classique)',
    dark: 'Sombre (Rose de Nuit)',
    cream: 'Crème (Miel Chaud)',
    sm: 'Petit',
    md: 'Moyen',
    lg: 'Grand',
    xl: 'Très Grand',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    signIn: 'Se Connecter',
    logout: 'Se Déconnecter',
    welcomeBack: 'Bon retour',
    ordersToday: 'Commandes Aujourd\'hui',
    pending: 'En attente',
    revenueToday: 'Revenu Aujourd\'hui',
    menuItems: 'Articles du Menu',
    prep: 'Prép',
    ready: 'Prêt',
    complete: 'Terminer',
    print: 'Imprimer',
    actions: 'Actions',
    time: 'Heure',
    customer: 'Client',
    items: 'Articles',
    orderNum: 'Commande #',
    status: 'Statut',
    currentStatus: 'Statut Actuel',
    recentOrders: 'Vos Commandes Récentes',
    enterOrderNum: 'Entrez votre numéro de commande pour vérifier le statut',
    orderNotFound: 'Commande Non Trouvée',
    noRecentOrders: 'Aucune commande récente trouvée.',
    estOrderId: 'ID Estimé',
    pickup: 'Ramassage',
    delivery: 'Livraison',
    contactConfirm: 'Nous vous contacterons bientôt pour confirmer votre commande',
    bakingTimer: 'Le chef Salwa cuisine',
    orderReceivedDesc: 'Nous avons reçu votre commande',
    preparingDesc: 'Le chef Salwa cuisine',
    readyDesc: 'Prêt pour ramassage/livraison',
    completedDesc: 'Récupéré ou livré',
    orderReceived: 'Commande Reçue',
    preparing: 'En Préparation',
    completed: 'Terminé',
    location: 'Adresse de livraison ou "Ramassage"',
    locationPlaceholder: 'Ex: Ramassage en magasin, ou 123 Rue Principale, Toronto',
    addedSuccess: 'Ajouté! ✓',
    categories: 'Catégories',
    addCategory: 'Ajouter une catégorie',
    categoryId: 'ID de catégorie',
    categoryName: 'Nom de la catégorie',
    categoryIcon: 'Icône émoji'
  },
  ar: {
    home: 'الرئيسية',
    trackOrder: 'تتبع الطلب',
    trackYourOrder: 'تتبع طلبك',
    browseMenu: 'تصفح قائمتنا',
    staffPortal: 'بوابة الموظفين',
    ourMenu: 'قائمتنا',
    freshBaked: 'خبز طازج يومياً بأجود المكونات',
    searchMenu: 'ابحث في القائمة...',
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت إضافته إلى السلة!',
    yourCart: 'سلة المشتريات',
    cartEmpty: 'السلة فارغة',
    addTreats: 'أضف بعض الحلويات اللذيذة!',
    total: 'المجموع',
    proceedCheckout: 'متابعة الدفع',
    checkout: 'إتمام الطلب',
    customerName: 'اسم العميل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    orderType: 'نوع الطلب',
    specialNotes: 'ملاحظات خاصة',
    orderSummary: 'ملخص الطلب',
    placeOrder: 'إرسال الطلب',
    placedSuccess: 'تم تقديم الطلب بنجاح!',
    backMenu: 'العودة للقائمة',
    datePlaced: 'تاريخ الطلب',
    totalPaid: 'المجموع المدفوع',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    fontSize: 'حجم الخط',
    reducedMotion: 'تقليل الحركة',
    highContrast: 'تباين عالٍ',
    saveSettings: 'حفظ الإعدادات',
    close: 'إغلاق',
    light: 'فاتح (كلاسيكي)',
    dark: 'داكن (وردة الليل)',
    cream: 'كريمي (العسل الدافئ)',
    sm: 'صغير',
    md: 'متوسط',
    lg: 'كبير',
    xl: 'كبير جداً',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    welcomeBack: 'مرحباً بعودتك',
    ordersToday: 'طلبات اليوم',
    pending: 'قيد الانتظار',
    revenueToday: 'أرباح اليوم',
    menuItems: 'أصناف القائمة',
    prep: 'تجهيز',
    ready: 'جاهز',
    complete: 'مكتمل',
    print: 'طباعة',
    actions: 'إجراءات',
    time: 'الوقت',
    customer: 'العميل',
    items: 'الطلبات',
    orderNum: 'رقم الطلب',
    status: 'الحالة',
    currentStatus: 'الحالة الحالية',
    recentOrders: 'طلباتك الأخيرة',
    enterOrderNum: 'أدخل رقم طلبك للتحقق من الحالة',
    orderNotFound: 'الطلب غير موجود',
    noRecentOrders: 'لا توجد طلبات حديثة.',
    estOrderId: 'رقم الطلب المتوقع',
    pickup: 'استلام من المتجر',
    delivery: 'توصيل',
    contactConfirm: 'سنتصل بك قريباً لتأكيد طلبك',
    bakingTimer: 'الشيف سلوى تقوم بالخبز الآن',
    orderReceivedDesc: 'لقد استلمنا طلبك بنجاح',
    preparingDesc: 'الشيف سلوى تقوم بالخبز',
    readyDesc: 'الطلب جاهز للاستلام/التوصيل',
    completedDesc: 'تم الاستلام أو التوصيل',
    orderReceived: 'تم استلام الطلب',
    preparing: 'قيد التحضير',
    completed: 'مكتمل',
    location: 'العنوان أو "استلام من المتجر"',
    locationPlaceholder: 'مثال: استلام من المتجر، أو 123 الشارع الرئيسي، تورونتو',
    addedSuccess: 'تمت الإضافة! ✓',
    categories: 'الفئات',
    addCategory: 'إضافة فئة',
    categoryId: 'معرف الفئة',
    categoryName: 'اسم الفئة',
    categoryIcon: 'رمز تعبيري'
  }
};

/**
 * Get translation for a key based on state.language.
 * Fallback to English if translation is missing.
 */
function t(key) {
  const lang = (window.state && window.state.language) || 'en';
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] || key);
}

