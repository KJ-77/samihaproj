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
    login: "Login",
    signUp: "Sign Up",
    logout: "Logout",

    Bookss: "Take your test",
    lifeCoaching: "Book Your Session",
    events: "Happenings",
    courses: "COURSES",
    blog: "BLOG",
    contact: "CONTACT",

    heroLine1: "Life Coach",
    heroLine2: "Samiha",
    heroLine3: "Zeineddine",

    testTitle: "Tests",
    testDesc: "Take your personality test",

    readyTitle: "Paid Ready Questions and Answers",
    readyDesc: "Pre-made coaching questions",

    customTitle: "Ask samiha a Questions",
    customDesc: "Personalized coaching questions",

    coursesTitle: "Courses",
    coursesDesc: "Explore our coaching courses",

    bookTitle: "Book",
    bookDesc: "Schedule your session",

    viewDetails: "VIEW DETAILS",

    /* ===== TEST MODAL ===== */
    testModalTitle: "Personality Tests",
    testModalDesc:
      "Discover your personality type and unlock your potential through our comprehensive assessment.",
    whatYouGet: "What You'll Get:",
    testPoint1: "Complete personality profile analysis",
    testPoint2: "Detailed strength and weakness assessment",
    testPoint3: "Action plan for personal growth",
    takeTestNow: "Take the Test Now",

    /* ===== READY MODAL ===== */
    readyModalTitle: "Ready Questions",
    readyModalDesc:
      "Explore our collection of pre-made coaching questions designed to guide your personal development journey.",
    availableQuestionSets: "Available Question Sets:",
    readyQ1: "Self-Discovery Questions",
    readyQ2: "Goal Setting & Achievement",
    readyQ3: "Emotional Intelligence Development",
    readyQ4: "Relationship & Communication",
    readyQ5: "Career & Life Purpose",
    viewQuestions: "View Questions Now",

    /* ===== CUSTOM MODAL ===== */
    customModalTitle: "Ask samihaa  question",
    customModalDesc:
      "Ask Samiha your personalized coaching questions. After logging in, you will be redirected to your dashboard where you can submit your questions and view responses.",
    loginAsk: "Login and ask Questions",

    /* ===== COURSES MODAL ===== */
    coursesModalTitle: "Courses",
    coursesModalDesc:
      "Explore our comprehensive coaching courses designed to enhance your skills and knowledge.",
    availableCourses: "Available Courses:",
    course1: "Self-Discovery Masterclass",
    course2: "Emotional Intelligence Training",
    course3: "Body Language & Communication",
    course4: "Self-Love & Confidence Building",
    course5: "Advanced Coaching Techniques",
    loginEnroll: "Login and Enroll now",

    /* ===== BOOK SESSION MODAL ===== */
    bookModalTitle: "Book Your Session",
    bookModalDesc:
      "Schedule your personalized coaching session and start your transformation journey today.",
    sessionOptions: "Session Options:",
    session1: "One-to-One Coaching Session",
    session2: "Personality Test Assessment",
    session3: "Group Workshop Session",
    session4: "Corporate Training Program",
    whatsappNow: "💬 WhatsApp Now",
    contactSectionLink: "Contact us section",

    /* ===== LIFE COACHING SECTION ===== */
    bookServices: "Book Services",

    onlineCoaching: "Online Coaching",
    inPersonCoaching: "In-Person Coaching",

    bookOnlineWhatsApp: "Book Online via WhatsApp",
    bookOnlineEmail: "Book Online via Email",
    bookInPersonWhatsApp: "Book In-Person via WhatsApp",
    bookInPersonEmail: "Book In-Person via Email",

    bookOnlineWhatsAppDesc:
      "Click to start a WhatsApp chat and book your personalized online coaching session.",
    bookOnlineEmailDesc:
      "Send us an email to schedule your personalized online coaching session.",
    bookInPersonWhatsAppDesc:
      "Click to start a WhatsApp chat and book your personalized in-person coaching session.",
    bookInPersonEmailDesc:
      "Send us an email to schedule your personalized in-person coaching session.",

    askSamihaBtn: "Ask Samiha a Question",
    askSamihaHint: "Have a specific question? Ask Samiha directly!",

    selfDiscovery: "Self Discovery",
    selfDiscoveryDesc: "Discover your true self and unlock potential",
    emotionalPsychology: "Emotional Psychology",
    emotionalPsychologyDesc: "Master emotional intelligence",
    bodyLanguage: "Body Language",
    bodyLanguageDesc: "Learn non-verbal communication",
    selfLove: "Self Love",
    selfLoveDesc: "Cultivate self-compassion",

    blogTitle: "The Journey of Self-Discovery",
    readMore: "Read More",

    getInTouch: "Get in Touch",
    connectWithSamiha: "Connect with Samiha",
    contactDesc:
      "Ready to start your journey? Reach out through your preferred channel.",

    bookOnlineSession: "Book Online Session",
    bookInPersonSession: "Book In-Person Session",
    takePersonalityTest: "Take Personality Test",
    askSamihaBtn: "Ask Samiha a Question",
    askSamihaHint: "Have a specific question? Ask Samiha directly!",

    blogTitle: "The Journey of Self-Discovery",
    blogExcerpt:
      "In a world that constantly demands our attention, finding a moment for self-reflection can be a revolutionary act. The journey of self-discovery is not a linear path, but a spiral, where we revisit themes with new perspectives. It is about peeling back the layers of societal expectations and finding the authentic core of who we are. This process, though challenging, is the foundation for true personal growth and lasting fulfillment. Embrace the unknown within, for it holds the map to your greatest potential.",
    readMore: "Read More",

    getInTouch: "Get in Touch",
    connectWithSamiha: "Connect with Samiha",
    contactDesc: "Ready to start your journey? Reach out through your preferred channel.",
    
    contactWhatsapp: "WhatsApp: +961 03960540",
    contactEmail: "Email: contact@coaching.com",
    contactInstagram: "Instagram: @lifecoach.samiha",
    
    bookSession: "Book Your Session",
    bookFooterDesc: "Use the links below to schedule your one-on-one or test session.",
    bookOnlineSession: "Book Online Session",
bookInPersonSession: "Book In-Person Session",
takePersonalityTest: "Take Personality Test",

    home: "Home",
    
    footerRights:
      "© 2025 @ Samiha Zeindine Professional Life Coach. All rights reserved."
  },

  ar: {
    login: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    logout: "تسجيل الخروج",

    Bookss: "إجراء الاختبار",
    lifeCoaching: "احجز جلستك",
    events: "الفعاليات",
    courses: "الدورات",
    blog: "المدونة",
    contact: "تواصل معنا",

    heroLine1: "مدربة حياة",
    heroLine2: "سميحة",
    heroLine3: "زين الدين",

    testTitle: "الاختبارات",
    testDesc: "قم بإجراء اختبار الشخصية",

    readyTitle: "أسئلة وأجوبة جاهزة مدفوعة",
    readyDesc: "أسئلة تدريبية جاهزة",

    customTitle: "اسأل سميحة سؤالاً",
    customDesc: "أسئلة تدريبية مخصصة",

    coursesTitle: "الدورات",
    coursesDesc: "استكشف دورات التدريب",

    bookTitle: "احجز",
    bookDesc: "حدد موعد جلستك",

    viewDetails: "عرض التفاصيل",

    testModalTitle: "اختبارات الشخصية",
    testModalDesc:
      "اكتشف نوع شخصيتك وافتح إمكانياتك من خلال تقييم شامل.",
    whatYouGet: "ماذا ستحصل:",
    testPoint1: "تحليل كامل للشخصية",
    testPoint2: "تقييم نقاط القوة والضعف",
    testPoint3: "خطة عمل للنمو الشخصي",
    takeTestNow: "ابدأ الاختبار الآن",

    readyModalTitle: "أسئلة جاهزة",
    readyModalDesc:
      "استكشف مجموعتنا من الأسئلة التدريبية الجاهزة لدعم رحلتك في التطور الشخصي.",
    availableQuestionSets: "مجموعات الأسئلة:",
    readyQ1: "أسئلة اكتشاف الذات",
    readyQ2: "تحديد الأهداف وتحقيقها",
    readyQ3: "تطوير الذكاء العاطفي",
    readyQ4: "العلاقات والتواصل",
    readyQ5: "المسار المهني ومعنى الحياة",
    viewQuestions: "عرض الأسئلة",

    customModalTitle: "اسأل سميحة سؤالاً",
    customModalDesc:
      "بعد تسجيل الدخول، سيتم توجيهك إلى لوحة التحكم حيث يمكنك إرسال أسئلتك ومتابعة الردود.",
    loginAsk: "سجّل الدخول واطرح سؤالك",

    coursesModalTitle: "الدورات",
    coursesModalDesc:
      "استكشف دورات التدريب الشاملة لتطوير مهاراتك ومعرفتك.",
    availableCourses: "الدورات المتاحة:",
    course1: "دورة اكتشاف الذات",
    course2: "تدريب الذكاء العاطفي",
    course3: "لغة الجسد والتواصل",
    course4: "بناء حب الذات والثقة",
    course5: "تقنيات تدريب متقدمة",
    loginEnroll: "سجّل الدخول وسجّل الآن",

    bookModalTitle: "احجز جلستك",
    bookModalDesc:
      "حدد جلستك التدريبية الشخصية وابدأ رحلة التغيير اليوم.",
    sessionOptions: "خيارات الجلسة:",
    session1: "جلسة فردية",
    session2: "تقييم اختبار الشخصية",
    session3: "ورشة جماعية",
    session4: "برنامج تدريبي للشركات",
    whatsappNow: "واتساب الآن",
    contactSectionLink: "قسم التواصل",

    bookServices: "حجز الخدمات",

    onlineCoaching: "تدريب عبر الإنترنت",
    inPersonCoaching: "تدريب حضوري",

    bookOnlineWhatsApp: "احجز عبر واتساب",
    bookOnlineEmail: "احجز عبر البريد الإلكتروني",
    bookInPersonWhatsApp: "احجز حضوري عبر واتساب",
    bookInPersonEmail: "احجز حضوري عبر البريد",

    bookOnlineWhatsAppDesc:
      "اضغط لبدء محادثة واتساب وحجز جلستك التدريبية عبر الإنترنت.",
    bookOnlineEmailDesc:
      "أرسل لنا بريدًا إلكترونيًا لحجز جلستك التدريبية عبر الإنترنت.",
    bookInPersonWhatsAppDesc:
      "اضغط لبدء محادثة واتساب وحجز جلستك التدريبية الحضورية.",
    bookInPersonEmailDesc:
      "أرسل لنا بريدًا إلكترونيًا لحجز جلستك التدريبية الحضورية.",
    askSamihaBtn: "اسأل سميحة سؤالاً",
    askSamihaHint: "هل لديك سؤال محدد؟ اسأل سميحة مباشرة!",
  
    blogTitle: "رحلة اكتشاف الذات",
    blogExcerpt:
        "في عالم يطالب باهتمامنا باستمرار، يصبح العثور على لحظة للتأمل الذاتي فعلًا ثوريًا. رحلة اكتشاف الذات ليست طريقًا مستقيمًا، بل مسارًا دائريًا نعود فيه إلى المواضيع نفسها برؤى جديدة. إنها عملية إزالة طبقات التوقعات الاجتماعية للوصول إلى جوهرنا الحقيقي. ورغم صعوبتها، فهي الأساس للنمو الشخصي الحقيقي والرضا الدائم. احتضن المجهول بداخلك، فهو يحمل خريطة أعظم إمكانياتك.",
    readMore: "اقرأ المزيد",
    courses: "الدورات",
    coursesTitle: "الدورات",
   coursesDesc: "استكشف دورات التدريب",

   selfDiscovery: "اكتشاف الذات",
  selfDiscoveryDesc: "اكتشف ذاتك الحقيقية وحرر إمكانياتك",

    emotionalPsychology: "علم النفس العاطفي",
    emotionalPsychologyDesc: "إتقان الذكاء العاطفي",

    bodyLanguage: "لغة الجسد",
  bodyLanguageDesc: "تعلم التواصل غير اللفظي",

    selfLove: "حب الذات",
  selfLoveDesc: "تنمية التعاطف مع الذات",
  getInTouch: "تواصل معنا",
  connectWithSamiha: "تواصل مع سميحة",
  contactDesc: "هل أنت مستعد لبدء رحلتك؟ تواصل معنا عبر الوسيلة التي تفضلها.",
  
  contactWhatsapp: "واتساب: ‎+961 03960540",
  contactEmail: "البريد الإلكتروني: contact@coaching.com",
  contactInstagram: "إنستغرام: lifecoach.samiha",
  
  bookSession: "احجز جلستك",
  bookFooterDesc: "استخدم الروابط أدناه لحجز جلستك الفردية أو اختبار الشخصية.",
  bookOnlineSession: "احجز جلسة أونلاين",
bookInPersonSession: "احجز جلسة حضورية",
takePersonalityTest: "قم بإجراء اختبار الشخصية",

  home: "الرئيسية",
  

    footerRights:
      "© 2025 سميحة زين الدين. جميع الحقوق محفوظة."
  },

  fr: {
    login: "Connexion",
    signUp: "S’inscrire",
    logout: "Déconnexion",

    Bookss: "Passer le test",
    lifeCoaching: "Réservez votre séance",
    events: "Événements",
    courses: "COURS",
    blog: "BLOG",
    contact: "CONTACT",

    heroLine1: "Coach de vie",
    heroLine2: "Samiha",
    heroLine3: "Zeineddine",

    testTitle: "Tests",
    testDesc: "Passez votre test de personnalité",

    readyTitle: "Questions et réponses prêtes payantes",
    readyDesc: "Questions de coaching prêtes",

    customTitle: "Poser une question à Samiha",
    customDesc: "Questions de coaching personnalisées",

    coursesTitle: "Cours",
    coursesDesc: "Découvrez nos cours de coaching",

    bookTitle: "Réserver",
    bookDesc: "Planifiez votre séance",

    viewDetails: "VOIR LES DÉTAILS",

    testModalTitle: "Tests de personnalité",
    testModalDesc:
      "Découvrez votre type de personnalité et libérez votre potentiel grâce à une évaluation complète.",
    whatYouGet: "Ce que vous obtiendrez :",
    testPoint1: "Analyse complète du profil de personnalité",
    testPoint2: "Évaluation détaillée des forces et faiblesses",
    testPoint3: "Plan d’action pour le développement personnel",
    takeTestNow: "Passer le test maintenant",
    askSamihaBtn: "Poser une question à Samiha",
    askSamihaHint: "Vous avez une question précise ? Demandez directement à Samiha !",

    blogTitle: "Le voyage de la découverte de soi",
    blogExcerpt:
      "Dans un monde qui exige constamment notre attention, trouver un moment de réflexion personnelle peut être un acte révolutionnaire. Le chemin de la découverte de soi n’est pas linéaire, mais cyclique, nous revenons aux mêmes thèmes avec de nouvelles perspectives. Il s’agit de retirer les couches des attentes sociales pour trouver notre véritable essence. Bien que difficile, ce processus est la base d’un épanouissement personnel durable. Accueillez l’inconnu en vous, il contient la carte de votre plus grand potentiel.",
    readMore: "Lire la suite",
    getInTouch: "Contactez-nous",
connectWithSamiha: "Contactez Samiha",
contactDesc: "Prêt à commencer votre parcours ? Contactez-nous par le moyen de votre choix.",

contactWhatsapp: "WhatsApp : +961 03960540",
contactEmail: "Email : contact@coaching.com",
contactInstagram: "Instagram : lifecoach.samiha",

bookSession: "Réserver votre séance",
bookFooterDesc: "Utilisez les liens ci-dessous pour réserver votre séance individuelle ou votre test.",

home: "Accueil",
bookOnlineSession: "Réserver une séance en ligne",
bookInPersonSession: "Réserver une séance en présentiel",
takePersonalityTest: "Passer le test de personnalité",


    footerRights:
      "© 2025 Samiha Zeineddine Coach de vie professionnelle. Tous droits réservés."
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
  
