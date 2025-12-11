// ============================================
// SMOOTH SCROLLING WITHOUT GSAP
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for all navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (!href || href === '#' || href === '#home') {
                if (href === '#home' || href === '#') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                return;
            }
            
            // Find target element
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate position with offset for fixed header
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarMenu = document.querySelector('.navbar-menu');
                if (navbarMenu && navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                }
            }
        });
    });
});

// ============================================
// LIFE COACHING TAB SWITCHING
// ============================================
function switchTab(tabId) {
    const onlineTab = document.getElementById('online');
    const inpersonTab = document.getElementById('inperson');
    const tabButtons = document.querySelectorAll('.tab-btn');

    if (tabId === 'online') {
        onlineTab.style.display = 'flex';
        inpersonTab.style.display = 'none';
        tabButtons[0].classList.add('active');
        tabButtons[1].classList.remove('active');
        // Trigger animation visibility
        setTimeout(() => {
            const cards = onlineTab.querySelectorAll('.animate-slide-in-up');
            cards.forEach(card => card.classList.add('visible'));
        }, 50);
    } else if (tabId === 'inperson') {
        onlineTab.style.display = 'none';
        inpersonTab.style.display = 'flex';
        tabButtons[0].classList.remove('active');
        tabButtons[1].classList.add('active');
        // Trigger animation visibility
        setTimeout(() => {
            const cards = inpersonTab.querySelectorAll('.animate-slide-in-up');
            cards.forEach(card => card.classList.add('visible'));
        }, 50);
    }
}

// ============================================
// MODAL CARD FUNCTIONALITY
// ============================================
function expandCard(event, cardType) {
    event.preventDefault();
    event.stopPropagation();
    
    // Hide all modals first
    const allModals = document.querySelectorAll('.expanded-card-modal');
    allModals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Show the overlay
    const overlay = document.getElementById('cardOverlay');
    if (overlay) {
        overlay.style.display = 'block';
    }
    
    // Show the specific modal
    const modalId = cardType + '-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeExpandedCard() {
    // Hide all modals
    const allModals = document.querySelectorAll('.expanded-card-modal');
    allModals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Hide overlay
    const overlay = document.getElementById('cardOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

function handleLink(event, linkType) {
    // For external links, let them work normally
    if (event.target.href && (event.target.href.startsWith('http') || event.target.href.startsWith('https://wa.me'))) {
        return true;
    }
    
    // For internal links that need login or special handling
    event.preventDefault();
    alert('This feature requires login. Please sign in to continue.');
}

// ============================================
// LANGUAGE TRANSLATIONS
// ============================================

const translations = {
  en: {
    about: "About",
    lifeCoaching: "Life Coaching",
    events: "Events",
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
    testTitle: "Test",
    testDesc: "Take your personality test",
    readyTitle: "Ready Question",
    readyDesc: "Pre-made coaching questions",
    customTitle: "Customized Questions",
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
// FADE IN ANIMATIONS ON SCROLL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const fadeElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in-up, .animate-slide-in-left, .animate-slide-in-right, .animate-float-up');
    fadeElements.forEach(el => observer.observe(el));
});
