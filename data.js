// ============================================================
//  data.js — Salwa's Bakery  |  Default Data & Helpers
// ============================================================

/**
 * Default menu items grouped by category.
 * Each item has a unique id, display info, price (CAD),
 * image path relative to the project root, and availability status.
 */
const DEFAULT_MENU_ITEMS = [
  // ── CAKES ──────────────────────────────────────────────────
  { id: 1,  name: 'Red Velvet Cake',        description: 'Rich red velvet layers with cream cheese frosting',                          price: 45.00,  category: 'cakes',    image: 'assets/cake.png',        available: true },
  { id: 2,  name: 'Chocolate Fudge Cake',   description: 'Decadent dark chocolate layers with fudge ganache',                          price: 42.00,  category: 'cakes',    image: 'assets/cake.png',        available: true },
  { id: 3,  name: 'Vanilla Bean Cake',      description: 'Classic vanilla sponge with Madagascar vanilla buttercream',                 price: 38.00,  category: 'cakes',    image: 'assets/cake.png',        available: true },
  { id: 4,  name: 'Strawberry Shortcake',   description: 'Light sponge with fresh strawberries and whipped cream',                     price: 40.00,  category: 'cakes',    image: 'assets/cake.png',        available: true },

  // ── CUPCAKES ───────────────────────────────────────────────
  { id: 5,  name: 'Classic Vanilla Cupcake',    description: 'Fluffy vanilla cupcake with rose buttercream swirl',                     price: 4.50,   category: 'cupcakes', image: 'assets/cupcake.png',     available: true },
  { id: 6,  name: 'Chocolate Ganache Cupcake',  description: 'Rich chocolate cupcake topped with silky ganache',                       price: 5.00,   category: 'cupcakes', image: 'assets/cupcake.png',     available: true },
  { id: 7,  name: 'Rose Pistachio Cupcake',     description: 'Delicate rose-flavored cupcake with pistachio crumble',                  price: 5.50,   category: 'cupcakes', image: 'assets/cupcake.png',     available: true },
  { id: 8,  name: 'Lemon Blueberry Cupcake',    description: 'Zesty lemon cake with fresh blueberry compote',                          price: 5.00,   category: 'cupcakes', image: 'assets/cupcake.png',     available: true },

  // ── COOKIES & MACARONS ─────────────────────────────────────
  { id: 9,  name: 'French Macarons (Box of 6)',     description: 'Assorted flavors: rose, pistachio, vanilla, chocolate, lavender, raspberry', price: 18.00, category: 'cookies', image: 'assets/cookie.png',      available: true },
  { id: 10, name: 'Chocolate Chip Cookies (6pc)',    description: 'Classic chewy cookies with Belgian chocolate chunks',                        price: 12.00, category: 'cookies', image: 'assets/cookie.png',      available: true },
  { id: 11, name: 'Decorated Sugar Cookies (6pc)',   description: 'Hand-decorated royal icing cookies, customizable designs',                   price: 22.00, category: 'cookies', image: 'assets/cookie.png',      available: true },
  { id: 12, name: 'Almond Biscotti (8pc)',           description: 'Twice-baked Italian almond biscotti, perfect with coffee',                   price: 14.00, category: 'cookies', image: 'assets/cookie.png',      available: true },

  // ── PASTRIES ───────────────────────────────────────────────
  { id: 13, name: 'Butter Croissant',  description: 'Flaky, golden French-style butter croissant',                price: 4.00,  category: 'pastries', image: 'assets/pastry.png',      available: true },
  { id: 14, name: 'Cinnamon Roll',     description: 'Soft, gooey cinnamon roll with cream cheese glaze',          price: 5.50,  category: 'pastries', image: 'assets/pastry.png',      available: true },
  { id: 15, name: 'Danish Pastry',     description: 'Flaky pastry filled with seasonal fruit and custard',        price: 4.50,  category: 'pastries', image: 'assets/pastry.png',      available: true },
  { id: 16, name: 'Baklava (4pc)',     description: 'Layers of phyllo dough with mixed nuts and honey syrup',     price: 10.00, category: 'pastries', image: 'assets/pastry.png',      available: true },

  // ── CUSTOM ORDERS ──────────────────────────────────────────
  { id: 17, name: 'Custom Celebration Cake',  description: 'Personalized cake with your choice of flavor, design & message. Contact us for details.', price: 85.00,  category: 'custom', image: 'assets/custom_cake.png', available: true },
  { id: 18, name: 'Custom Cupcake Box (12pc)', description: 'Box of 12 custom-designed cupcakes for your special event',                              price: 55.00,  category: 'custom', image: 'assets/cupcake.png',     available: true },
  { id: 19, name: 'Dessert Table Package',     description: 'Full dessert spread for events: cake, cupcakes, cookies & pastries. Serves 30+',         price: 250.00, category: 'custom', image: 'assets/custom_cake.png', available: true },
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

/** Hard-coded staff credentials. */
const STAFF_CREDENTIALS = {
  username: 'salwa',
  password: 'amoudi'
};

// ============================================================
//  TRANSLATIONS & LOCALISATION DICTIONARY
// ============================================================
const TRANSLATIONS = {
  en: {
    brandName: "Salwa's Bakery",
    home: 'Home',
    browseMenu: 'Browse Menu',
    ourMenu: 'Our Menu',
    freshBaked: 'Handcrafted fresh daily with premium ingredients',
    searchMenu: 'Search treats & pastries...',
    allItems: 'All Items',
    noItemsFound: 'No menu items found.',
    available: 'In Stock',
    soldOut: 'Sold Out',
    staffPortal: 'Staff Portal',
    staffLogin: 'Staff Login',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',
    logout: 'Logout',
    welcomeBack: 'Welcome Back',
    menuItems: 'Menu Items',
    categories: 'Categories',
    addNewItem: '+ Add New Item',
    editItem: 'Edit Item',
    deleteItem: 'Delete Item',
    itemName: 'Item Name',
    category: 'Category',
    price: 'Price',
    description: 'Description',
    image: 'Image',
    status: 'Status',
    inStock: 'In Stock',
    outOfStock: 'Sold Out',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    addNewCategory: '+ Add Category',
    categoryId: 'Category ID',
    categoryName: 'Category Name',
    categoryIcon: 'Emoji / Icon',
    confirmDelete: 'Are you sure you want to delete this item?',
    confirmDeleteCat: 'Are you sure you want to delete this category? Items in this category will become uncategorized.',
    cloudSynced: 'Cloud Synced',
    offlineMode: 'Offline Mode (Local Only)',
    syncNow: 'Refresh from Cloud',
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
    goToMenu: 'View Live Menu',
    goToDashboard: 'Staff Dashboard',
    dbSetupNotice: 'Connect a Postgres database in your Vercel project (via Vercel Storage -> Neon or Vercel Postgres) to enable automatic cloud synchronization across all devices.',
    heroTitle: 'Handcrafted with Love,<br/>Baked to Perfection',
    heroSub: 'Artisanal cakes, cupcakes, pastries & custom confections freshly baked every morning in Canada, GTA.',
    valueProp1Title: '100% Fresh Ingredients',
    valueProp1Desc: 'Real butter, organic flour & premium Belgian chocolate',
    valueProp2Title: 'Baked Fresh Daily',
    valueProp2Desc: 'Every single pastry is baked the morning you enjoy it',
    valueProp3Title: 'Custom Cake Designs',
    valueProp3Desc: 'Personalized decorations for your most memorable events',
    exploreCategories: 'Explore Our Categories',
    exploreCategoriesSub: 'From delicate macarons to show-stopping multi-tier celebration cakes',
    featuredTitle: 'Customer Favourites',
    featuredSub: 'Our most cherished baked creations, handpicked for you',
    viewFullMenu: 'View Full Menu &rarr;',
    reviewsTitle: 'What Our Customers Say',
    reviewsSub: 'Over 500+ happy celebrations sweetened by Salwa\'s Bakery'
  },
  fr: {
    brandName: "Salwa's Bakery",
    home: 'Accueil',
    browseMenu: 'Parcourir le Menu',
    ourMenu: 'Notre Menu',
    freshBaked: 'Fait à la main tous les jours avec des ingrédients de qualité',
    searchMenu: 'Rechercher des délices...',
    allItems: 'Tous les articles',
    noItemsFound: 'Aucun article trouvé.',
    available: 'Disponible',
    soldOut: 'Épuisé',
    staffPortal: 'Portail du Personnel',
    staffLogin: 'Connexion Personnel',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    signIn: 'Se Connecter',
    logout: 'Se Déconnecter',
    welcomeBack: 'Bienvenue',
    menuItems: 'Articles du Menu',
    categories: 'Catégories',
    addNewItem: '+ Ajouter un article',
    editItem: 'Modifier l\'article',
    deleteItem: 'Supprimer l\'article',
    itemName: 'Nom de l\'article',
    category: 'Catégorie',
    price: 'Prix',
    description: 'Description',
    image: 'Image',
    status: 'Statut',
    inStock: 'En stock',
    outOfStock: 'Épuisé',
    saveChanges: 'Enregistrer',
    cancel: 'Annuler',
    addNewCategory: '+ Ajouter une catégorie',
    categoryId: 'ID de catégorie',
    categoryName: 'Nom de catégorie',
    categoryIcon: 'Icône / Émoji',
    confirmDelete: 'Voulez-vous vraiment supprimer cet article ?',
    confirmDeleteCat: 'Voulez-vous vraiment supprimer cette catégorie ?',
    cloudSynced: 'Synchronisé avec le Cloud',
    offlineMode: 'Mode Hors-ligne (Local)',
    syncNow: 'Actualiser depuis le Cloud',
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
    goToMenu: 'Voir le Menu en direct',
    goToDashboard: 'Tableau de Bord',
    dbSetupNotice: 'Liez une base Postgres dans Vercel Storage (Neon / Vercel Postgres) pour la synchronisation automatique.',
    heroTitle: 'Fait à la main avec amour,<br/>Cuit à la perfection',
    heroSub: 'Gâteaux artisanaux, cupcakes et pâtisseries cuits frais chaque matin au Canada, GTA.',
    valueProp1Title: 'Ingrédients 100% Frais',
    valueProp1Desc: 'Vrai beurre, farine biologique et chocolat belge de qualité',
    valueProp2Title: 'Cuit Frais Tous les Jours',
    valueProp2Desc: 'Chaque pâtisserie est préparée et cuite le matin même',
    valueProp3Title: 'Créations Personnalisées',
    valueProp3Desc: 'Décorations sur mesure pour vos moments inoubliables',
    exploreCategories: 'Découvrez Nos Catégories',
    exploreCategoriesSub: 'Des macarons délicats aux superbes gâteaux de célébration',
    featuredTitle: 'Les Favoris de nos Clients',
    featuredSub: 'Nos créations les plus appréciées, sélectionnées pour vous',
    viewFullMenu: 'Voir Tout le Menu &rarr;',
    reviewsTitle: 'Ce Que Disent Nos Clients',
    reviewsSub: 'Plus de 500+ célébrations adoucies par Salwa\'s Bakery'
  },
  ar: {
    brandName: 'مخبز سلوى',
    home: 'الرئيسية',
    browseMenu: 'تصفح القائمة',
    ourMenu: 'قائمتنا اللذيذة',
    freshBaked: 'مخبوزات طازجة يومياً بأجود المكونات الطبيعية',
    searchMenu: 'ابحث في أصناف القائمة...',
    allItems: 'جميع الأصناف',
    noItemsFound: 'لم يتم العثور على أي صنف.',
    available: 'متوفر',
    soldOut: 'نفذت الكمية',
    staffPortal: 'بوابة الموظفين',
    staffLogin: 'تسجيل دخول الموظفين',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    welcomeBack: 'مرحباً بك',
    menuItems: 'أصناف القائمة',
    categories: 'التصنيفات',
    addNewItem: '+ إضافة صنف جديد',
    editItem: 'تعديل الصنف',
    deleteItem: 'حذف الصنف',
    itemName: 'اسم الصنف',
    category: 'التصنيف',
    price: 'السعر',
    description: 'الوصف',
    image: 'الصورة',
    status: 'الحالة',
    inStock: 'متوفر',
    outOfStock: 'نفذت الكمية',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    addNewCategory: '+ إضافة تصنيف جديد',
    categoryId: 'معرف التصنيف',
    categoryName: 'اسم التصنيف',
    categoryIcon: 'رمز تعبيري',
    confirmDelete: 'هل أنت متأكد من حذف هذا الصنف؟',
    confirmDeleteCat: 'هل أنت متأكد من حذف هذا التصنيف؟',
    cloudSynced: 'متصل بالسحابة (محدث)',
    offlineMode: 'الوضع المحلي (غير متصل بالسحابة)',
    syncNow: 'تحديث من السحابة',
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
    goToMenu: 'عرض القائمة للعملاء',
    goToDashboard: 'لوحة التحكم',
    dbSetupNotice: 'قم بربط قاعدة بيانات PostgreSQL في Vercel (Neon أو Vercel Postgres) لتفعيل المزامنة الفورية عبر كافة الأجهزة.',
    heroTitle: 'صنع بكل حب،<br/>مخبوز بإتقان',
    heroSub: 'كيك وحلويات ومعجنات فاخرة ومخبوزة طازجة كل صباح في كندا، GTA.',
    valueProp1Title: 'مكونات طبيعية 100%',
    valueProp1Desc: 'زبدة نقية، طحين عضوي، وشوكولاتة بلجيكية فاخرة',
    valueProp2Title: 'مخبوز طازج يومياً',
    valueProp2Desc: 'كل قطعة تخبز بعناية في صباح يوم استلامها',
    valueProp3Title: 'تصاميم كيك مخصصة',
    valueProp3Desc: 'تزيين استثنائي ومخصص لأجمل مناسباتكم واحتفالاتكم',
    exploreCategories: 'استكشف تصنيفاتنا',
    exploreCategoriesSub: 'من الماكرون الفرنسي الرقيق إلى قوالب الكيك الاحتفالية الفاخرة',
    featuredTitle: 'المفضلة لدى عملائنا',
    featuredSub: 'أشهى ابتكاراتنا المختارة بعناية لتنال إعجابكم',
    viewFullMenu: 'عرض كامل القائمة &larr;',
    reviewsTitle: 'آراء عملائنا',
    reviewsSub: 'أكثر من 500+ مناسبة واحتفال تم تحليتها بمخبوزات سلوى'
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

/**
 * Helper to escape HTML characters in strings to prevent XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Helper to format price as currency (CAD / USD)
 */
function formatCurrency(num) {
  const n = Number(num) || 0;
  return `$${n.toFixed(2)}`;
}

/**
 * Capitalize first letter of string
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
