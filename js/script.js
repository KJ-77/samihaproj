// ====================================================================
//  SCRIPT.JS - MAIN JAVASCRIPT FOR LANDING PAGE
//  Handles smooth scrolling, modal functionality, protected navigation,
//  and dynamic UI updates based on user authentication status.
// ====================================================================

// ============================================
// SMOOTH SCROLLING LOGIC
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
    scrollLinks.forEach(link => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
  
        if (!href || href === "#" || href === "#home") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
  
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
  
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
  
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  
          const navbarMenu = document.querySelector(".navbar-menu");
          if (navbarMenu?.classList.contains("active")) {
            navbarMenu.classList.remove("active");
          }
        }
      });
    });
  });
  
// ============================================
// MODAL CARD FUNCTIONALITY
// ============================================

/**
 * Expands a service card into a modal view.
 * @param {Event} event - The click event.
 * @param {string} cardType - The type of card (e.g., 'test', 'custom').
 */
  function expandCard(event, cardType) {
    event.preventDefault();
    event.stopPropagation();
  
    document
      .querySelectorAll(".expanded-card-modal")
      .forEach(m => (m.style.display = "none"));
  
    const overlay = document.getElementById("cardOverlay");
    if (overlay) overlay.style.display = "block";
  
    const modal = document.getElementById(cardType + "-modal");
    if (modal) modal.style.display = "block";
  
    document.body.style.overflow = "hidden";
  }
  
  /**
 * Closes the currently open expanded card modal.
 */
function closeExpandedCard() {
    document
      .querySelectorAll(".expanded-card-modal")
      .forEach(m => (m.style.display = "none"));
  
    const overlay = document.getElementById("cardOverlay");
    if (overlay) overlay.style.display = "none";
  
    document.body.style.overflow = "auto";
  }
  
// ============================================
// PROTECTED ROUTES MAP (REAL FILE NAMES)
// ============================================

// Maps the service card type to the actual HTML file name for the protected resource.
// This is used by the handleProtectedNav function.
  const PROTECTED_ROUTES = {
    test: "TEST.HTML",
    custom: "personalized-questions.html",
    ready: "ready-questions.html",
    "makenteh-courses": "courses.html"
  };
  
// ============================================
// REDIRECT STORAGE
// ============================================

/**
 * Stores the target URL in localStorage for redirection after a successful login.
 * @param {string} target - The URL to redirect to.
 */
  function setRedirectAfterLogin(target) {
    localStorage.setItem("redirectAfterLogin", target);
  }
  
  /**
 * Retrieves and clears the stored redirect URL from localStorage.
 * @returns {string|null} - The stored URL or null.
 */
function consumeRedirectAfterLogin() {
    const t = localStorage.getItem("redirectAfterLogin");
    if (t) localStorage.removeItem("redirectAfterLogin");
    return t;
  }
  
// ============================================
// SAFE SESSION + ROLE CHECK
// ============================================

/**
 * Checks the user's login status and role (Admin/User) using Cognito.
 * Requires cognito-config.js to be loaded.
 * @returns {Promise<{loggedIn: boolean, isAdmin: boolean}>}
 */
  async function getSessionAndRole() {
    try {
      if (!window.CognitoAuth || !CognitoAuth.getCurrentSession) {
        console.warn("CognitoAuth not ready");
        return { loggedIn: false, isAdmin: false };
      }
  
      const sessionInfo = await CognitoAuth.getCurrentSession();
  
      if (!sessionInfo?.session || !sessionInfo.session.isValid()) {
        return { loggedIn: false, isAdmin: false };
      }
  
      const payload = sessionInfo.session.getIdToken().payload || {};
      const groups = payload["cognito:groups"] || [];
      const isAdmin = Array.isArray(groups) && groups.includes("Admin");
  
      return { loggedIn: true, isAdmin };
    } catch (err) {
      console.error("Session check failed:", err);
      return { loggedIn: false, isAdmin: false };
    }
  }
  
// ============================================
// MAIN PROTECTED NAVIGATION
// ============================================

/**
 * Handles navigation to protected pages, enforcing login and role-based redirection.
 * 1. If not logged in, stores the target and redirects to login.
 * 2. If logged in as Admin, redirects to admin dashboard.
 * 3. If logged in as User, redirects to the target page.
 * @param {string} routeKey - Key from the PROTECTED_ROUTES map (e.g., 'test', 'custom').
 */
  async function handleProtectedNav(routeKey) {
    const target = PROTECTED_ROUTES[routeKey];
  
    if (!target) {
      window.location.href = "login.html";
      return;
    }
  
    const { loggedIn, isAdmin } = await getSessionAndRole();
  
    if (loggedIn && isAdmin) {
      window.location.href = "admin-dashboard.html";
      return;
    }
  
    if (loggedIn) {
      window.location.href = target;
      return;
    }
  
    setRedirectAfterLogin(target);
    window.location.href = "login.html";
  }
  
// ============================================
// UNIVERSAL LINK HANDLER (handleLink)
// ============================================

/**
 * Universal handler for links that require authentication.
 * This function is called from the service card modals (e.g., Test, Ask Samiha).
 * @param {Event} event - The click event.
 * @param {string} linkType - The key for the protected route.
 * @returns {boolean} - Always returns false to prevent default link behavior.
 */
  function handleLink(event, linkType) {
    if (event) event.preventDefault();
    if (linkType) {
      handleProtectedNav(linkType);
      return false;
    }
    window.location.href = "login.html";
    return false;
  }
  
// ============================================
// TOP HEADER AUTH UI (LOGIN / DASHBOARD)
// ============================================

/**
 * Updates the top right header buttons based on the user's login status.
 * Shows "Login" / "Sign Up" if logged out.
 * Shows "Dashboard" (linking to user or admin dashboard) if logged in.
 */
  async function updateTopHeaderAuthUI() {
    const loginBtn = document.querySelector(".login-btn");
    const signupBtn = document.querySelector(".signup-btn");
    const container = document.querySelector(".top-header-right");
  
    if (!container) return;
  
    const { loggedIn, isAdmin } = await getSessionAndRole();
  
    const oldDash = document.getElementById("dashboardNavBtn");
    if (oldDash) oldDash.remove();
  
    if (loggedIn) {
      if (loginBtn) loginBtn.style.display = "none";
      if (signupBtn) signupBtn.style.display = "none";
  
      const dash = document.createElement("a");
      dash.id = "dashboardNavBtn";
      dash.className = "login-btn";
      dash.textContent = "Dashboard";
      dash.href = isAdmin ? "admin-dashboard.html" : "user-dashboard.html";
  
      container.appendChild(dash);
    } else {
      if (loginBtn) loginBtn.style.display = "";
      if (signupBtn) signupBtn.style.display = "";
    }
  }
  
// ============================================
// INITIALIZATION AND ANIMATIONS
// ============================================
  document.addEventListener("DOMContentLoaded", () => {
    updateTopHeaderAuthUI();
  
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
  
    document
      .querySelectorAll(
        ".animate-fade-in, .animate-slide-in-up, .animate-slide-in-left, .animate-slide-in-right, .animate-float-up"
      )
      .forEach(el => observer.observe(el));
  });
  // ============================================
// LANGUAGE TRANSLATIONS
// ============================================

const translations = {
  en: {
    about: "About",
    lifeCoaching: "Book Your Session",
    events: "Happening",
    courses: "Courses",
    blog: "Blog",
    contact: "Contact",
    whoIsSamiha: "Who is Samiha",
    bookServices: "Book Services",
    online: "Online",
    inPerson: "In person",
    oneToOne: "One-to-One Session",
    oneToOneOnline: "Book your online one-to-one meeting",
    onlineBookingDesc: "Click to book your personalized online coaching session via WhatsApp.",
    oneToOneInPerson: "Book your in-person meeting",
    inPersonBookingDesc: "Click to book your personalized in-person coaching session via WhatsApp.",
    personalizedCoaching: "Personalized coaching tailored to your needs",
    personalityTest: "Personality Test",
    discoverPersonality: "Discover your personality type",
    workshop: "Workshop",
    selfAwarenessWorkshop: "Self-Awareness Workshop",
    registerNow: "Register Now",
    masterClass: "Master Class",
    certifiedLifeCoach: "Certified Life Coach Training",
    previousEvents: "Previous Events",
    selfDiscovery: "Self Discovery",
    emotionalPsychology: "Emotional Psychology",
    bodyLanguage: "Body Language",
    selfLove: "Self Love",
    signIn: "Sign in",
    takeTest: "Take your personality test",
    thePowerOfSelfDiscovery: "The Power of Self-Discovery",
    emotionalIntelligence: "Emotional Intelligence in Daily Life",
    bookYour: "Book your:",
    moreInfo: "More Info:",
    aboutServices: "About Services",
    courseDetails: "Course Details",
    contactOnWhatsApp: "Contact on WhatsApp",
    quickLinks: "Quick Links",
    contactInfo: "Contact Info",
    followUs: "Follow Us",
    onlineCoaching: "Online Coaching",
    getMotivation: "Get motivation. Any time. Any place.",
    transformYourLife: "Transform Your Life",
    discoverPotential: "Discover your true potential",
    personalGrowth: "Personal Growth",
    unlockPotential: "Unlock your potential and achieve goals",
    selfDiscoveryDesc: "Discover your true self and unlock potential",
    emotionalPsychologyDesc: "Master emotional intelligence",
    bodyLanguageDesc: "Learn non-verbal communication",
    selfLoveDesc: "Cultivate self-compassion",
    adminDashboard: "Admin Dashboard",
    userDashboard: "User Dashboard",
    testTitle: "Tests",
    testDesc: "Take your personality test",
    readyTitle: "Paid Ready Questions and Answers",
    readyDesc: "Pre-made coaching questions",
    customTitle: "Your Questions For Samiha",
    customDesc: "Personalized coaching questions",
    coursesTitle: "Courses",
    coursesDesc: "Explore our coaching courses",
    bookTitle: "Book",
    bookDesc: "Schedule your session",
    home: "Home",
    logout: "Logout",
    login: "Login",
    signUp: "Sign Up"
  },
  ar: {
    about: "حول",
    lifeCoaching: "تدريب الحياة",
    events: "الأحداث",
    courses: "الدورات",
    blog: "المدونة",
    contact: "اتصل",
    whoIsSamiha: "من هي سميحة",
    bookServices: "احجز الخدمات",
    online: "أونلاين",
    inPerson: "وجهاً لوجه",
    oneToOne: "جلسة فردية",
    oneToOneOnline: "احجز اجتماعك الفردي عبر الإنترنت",
    onlineBookingDesc: "انقر لحجز جلسة التدريب الشخصية عبر الإنترنت عبر واتساب.",
    oneToOneInPerson: "احجز اجتماعك الشخصي",
    inPersonBookingDesc: "انقر لحجز جلسة التدريب الشخصية وجهاً لوجه عبر واتساب.",
    personalizedCoaching: "تدريب شخصي مخصص لاحتياجاتك",
    personalityTest: "اختبار الشخصية",
    discoverPersonality: "اكتشف نوع شخصيتك",
    workshop: "ورشة عمل",
    selfAwarenessWorkshop: "ورشة الوعي الذاتي",
    registerNow: "سجل الآن",
    masterClass: "فئة رئيسية",
    certifiedLifeCoach: "تدريب مدرب الحياة المعتمد",
    previousEvents: "الأحداث السابقة",
    selfDiscovery: "اكتشاف الذات",
    emotionalPsychology: "علم النفس العاطفي",
    bodyLanguage: "لغة الجسد",
    selfLove: "حب النفس",
    signIn: "تسجيل الدخول",
    takeTest: "خذ اختبار الشخصية الخاص بك",
    thePowerOfSelfDiscovery: "قوة اكتشاف الذات",
    emotionalIntelligence: "الذكاء العاطفي في الحياة اليومية",
    bookYour: "احجز:",
    moreInfo: "معلومات أخرى:",
    aboutServices: "حول الخدمات",
    courseDetails: "تفاصيل الدورة",
    contactOnWhatsApp: "اتصل على WhatsApp",
    quickLinks: "روابط سريعة",
    contactInfo: "معلومات الاتصال",
    followUs: "تابعنا",
    onlineCoaching: "التدريب عبر الإنترنت",
    getMotivation: "احصل على الحافز. في أي وقت. في أي مكان.",
    transformYourLife: "غيّر حياتك",
    discoverPotential: "اكتشف إمكانياتك الحقيقية",
    personalGrowth: "النمو الشخصي",
    unlockPotential: "افتح إمكانياتك وحقق أهدافك",
    selfDiscoveryDesc: "اكتشف ذاتك الحقيقية وافتح الإمكانات",
    emotionalPsychologyDesc: "إتقان الذكاء العاطفي",
    bodyLanguageDesc: "تعلم التواصل غير اللفظي",
    selfLoveDesc: "زرع التعاطف مع الذات",
    adminDashboard: "لوحة تحكم المسؤول",
    userDashboard: "لوحة تحكم المستخدم",
    testTitle: "اختبار",
    testDesc: "خذ اختبار الشخصية الخاص بك",
    readyTitle: "سؤال جاهز",
    readyDesc: "أسئلة تدريب جاهزة",
    customTitle: "أسئلة مخصصة",
    customDesc: "أسئلة تدريب شخصية",
    coursesTitle: "الدورات",
    coursesDesc: "استكشف دوراتنا التدريبية",
    bookTitle: "احجز",
    bookDesc: "حدد موعد جلستك",
    home: "الرئيسية",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    signUp: "التسجيل"
  },
  fr: {
    about: "À propos",
    lifeCoaching: "Coaching de vie",
    events: "Événements",
    courses: "Cours",
    blog: "Blog",
    contact: "Contact",
    whoIsSamiha: "Qui est Samiha",
    bookServices: "Réserver des services",
    online: "En ligne",
    inPerson: "En personne",
    oneToOne: "Séance individuelle",
    oneToOneOnline: "Réservez votre réunion individuelle en ligne",
    onlineBookingDesc: "Cliquez pour réserver votre session de coaching personnalisée en ligne via WhatsApp.",
    oneToOneInPerson: "Réservez votre réunion en personne",
    inPersonBookingDesc: "Cliquez pour réserver votre session de coaching personnalisée en personne via WhatsApp.",
    personalizedCoaching: "Coaching personnalisé adapté à vos besoins",
    personalityTest: "Test de personnalité",
    discoverPersonality: "Découvrez votre type de personnalité",
    workshop: "Atelier",
    selfAwarenessWorkshop: "Atelier de sensibilisation",
    registerNow: "S'inscrire maintenant",
    masterClass: "Classe de maître",
    certifiedLifeCoach: "Formation de coach de vie certifiée",
    previousEvents: "Événements précédents",
    selfDiscovery: "Découverte de soi",
    emotionalPsychology: "Psychologie émotionnelle",
    bodyLanguage: "Langage corporel",
    selfLove: "Amour de soi",
    signIn: "Se connecter",
    takeTest: "Faites votre test de personnalité",
    thePowerOfSelfDiscovery: "Le pouvoir de la découverte de soi",
    emotionalIntelligence: "L'intelligence émotionnelle dans la vie quotidienne",
    bookYour: "Réservez votre:",
    moreInfo: "Plus d'informations:",
    aboutServices: "À propos des services",
    courseDetails: "Détails du cours",
    contactOnWhatsApp: "Contacter sur WhatsApp",
    quickLinks: "Liens rapides",
    contactInfo: "Informations de contact",
    followUs: "Nous suivre",
    onlineCoaching: "Coaching en ligne",
    getMotivation: "Obtenez de la motivation. N'importe quand. N'importe où.",
    transformYourLife: "Transformez votre vie",
    discoverPotential: "Découvrez votre vrai potentiel",
    personalGrowth: "Croissance personnelle",
    unlockPotential: "Libérez votre potentiel et atteignez vos objectifs",
    selfDiscoveryDesc: "Découvrez votre vrai moi et libérez votre potentiel",
    emotionalPsychologyDesc: "Maîtriser l'intelligence émotionnelle",
    bodyLanguageDesc: "Apprendre la communication non verbale",
    selfLoveDesc: "Cultiver l'auto-compassion",
    adminDashboard: "Tableau de bord Admin",
    userDashboard: "Tableau de bord Utilisateur",
    testTitle: "Test",
    testDesc: "Faites votre test de personnalité",
    readyTitle: "Question Prête",
    readyDesc: "Questions de coaching pré-faites",
    customTitle: "Questions Personnalisées",
    customDesc: "Questions de coaching personnalisées",
    coursesTitle: "Cours",
    coursesDesc: "Explorez nos cours de coaching",
    bookTitle: "Réserver",
    bookDesc: "Planifiez votre session",
    home: "Accueil",
    logout: "Déconnexion",
    login: "Connexion",
    signUp: "S'inscrire"
  }
};

let currentLanguage = 'en';

// ============================================
// LANGUAGE SWITCHING
// ============================================
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update HTML dir attribute for RTL languages
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        // Load saved language preference
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        languageSelect.value = savedLang;
        changeLanguage(savedLang);
        
        // Add change listener
        languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
});

// ============================================
// EXPOSE FUNCTIONS GLOBALLY
// These functions must be exposed to the global window object so they can be
// called directly from inline HTML event handlers (e.g., onclick="expandCard(...)").
// ============================================
  window.handleProtectedNav = handleProtectedNav;
  window.handleLink = handleLink;
  window.expandCard = expandCard;
  window.closeExpandedCard = closeExpandedCard;
  
