/* =========================================================
   USER DASHBOARD – ASK SAMIHA
   - 700 char limit
   - Logged-in users only
   - POST question with user sub and language
   - Full translations embedded
========================================================= */

(function () {
    const DASHBOARD_API =
      "https://jej5dh7680.execute-api.me-central-1.amazonaws.com/questions-for-samiha";
  
    // ============================================
    // TRANSLATIONS (All languages embedded)
    // ============================================
    const translations = {
      en: {
        backHome: "⬅ Back to Home",
        pageTitle: "Personalized Questions",
        headerTitle: "Your Personal Reflection Space",
        headerDesc: "This is a private space to reflect, ask, and explore your thoughts. Samiha will personally review and respond to your questions.",
        reflectionBox: "“Growth begins when we allow ourselves to ask honest questions — even the ones we don’t yet have answers to.”",
        placeholder: "Write your question to Samiha here… (max 700 characters)",
        sendBtn: "Send to Samiha",
        sending: "Sending your question...",
        success: "✅ Your question has been sent to Samiha.",
        failed: "❌ Failed to send question. Please try again.",
        writeFirst: "Please write your question first.",
        loginRequired: "Please login to ask Samiha a question."
      },
      ar: {
        backHome: "⬅ العودة إلى الرئيسية",
        pageTitle: "أسئلة مخصصة",
        headerTitle: "مساحة التأمل الخاصة بك",
        headerDesc: "هذه مساحة خاصة للتأمل والسؤال واستكشاف أفكارك. ستقوم سميحة بمراجعة أسئلتك والرد عليها شخصياً.",
        reflectionBox: "“يبدأ النمو عندما نسمح لأنفسنا بطرح أسئلة صادقة — حتى تلك التي لا نملك إجابات لها بعد.”",
        placeholder: "اكتب سؤالك لسميحة هنا... (بحد أقصى 700 حرف)",
        sendBtn: "إرسال إلى سميحة",
        sending: "جاري إرسال سؤالك...",
        success: "✅ تم إرسال سؤالك إلى سميحة.",
        failed: "❌ فشل إرسال السؤال. يرجى المحاولة مرة أخرى.",
        writeFirst: "يرجى كتابة سؤالك أولاً.",
        loginRequired: "يرجى تسجيل الدخول لطرح سؤال على سميحة."
      },
      fr: {
        backHome: "⬅ Retour à l'Accueil",
        pageTitle: "Questions Personnalisées",
        headerTitle: "Votre Espace de Réflexion Personnel",
        headerDesc: "C'est un espace privé pour réfléchir, poser des questions et explorer vos pensées. Samiha examinera personnellement vos questions et y répondra.",
        reflectionBox: "« La croissance commence lorsque nous nous autorisons à poser des questions honnêtes — même celles auxquelles nous n'avons pas encore de réponses. »",
        placeholder: "Écrivez votre question à Samiha ici... (max 700 caractères)",
        sendBtn: "Envoyer à Samiha",
        sending: "Envoi de votre question...",
        success: "« Votre question a été envoyée à Samiha. »",
        failed: "« Échec de l'envoi de la question. Veuillez réessayer. »",
        writeFirst: "Veuillez d'abord écrire votre question.",
        loginRequired: "Veuillez vous connecter pour poser une question à Samiha."
      }
    };
  
    let currentLanguage = 'en'; // Track current language
  
    function el(id) {
      return document.getElementById(id);
    }
  
    function t(key) {
      if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
      }
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      return key;
    }
  
    function applyTranslations() {
      const backHomeText = el("backHomeText");
      if (backHomeText) backHomeText.textContent = t("backHome");
      
      const pageTitle = el("pageTitle");
      if (pageTitle) pageTitle.textContent = t("pageTitle");
      
      const headerTitle = el("headerTitle");
      if (headerTitle) headerTitle.textContent = t("headerTitle");
      
      const headerDesc = el("headerDesc");
      if (headerDesc) headerDesc.textContent = t("headerDesc");
      
      const reflectionBox = el("reflectionBox");
      if (reflectionBox) reflectionBox.textContent = t("reflectionBox");
      
      const input = el("dashboardSamihaQuestion");
      if (input) input.placeholder = t("placeholder");
      
      const sendBtn = el("sendBtn");
      if (sendBtn) sendBtn.textContent = t("sendBtn");
      
      // Handle RTL for Arabic
      const htmlElement = document.querySelector('html');
      if (currentLanguage === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
      }
      
      // Update language select
      const select = el("languageSelect");
      if (select) {
        select.value = currentLanguage;
      }
      
      // Save to localStorage
      localStorage.setItem("selectedLanguage", currentLanguage);
    }
  
    /* ===============================
       GET LOGGED USER SUB
    ================================ */
    async function getDashboardUserSub() {
      try {
        const sessionInfo = await CognitoAuth.getCurrentSession();
        if (
          !sessionInfo ||
          !sessionInfo.session ||
          !sessionInfo.session.isValid()
        ) {
          return null;
        }
        return sessionInfo.session.getIdToken().payload.sub;
      } catch (err) {
        return null;
      }
    }
  
    /* ===============================
       SUBMIT QUESTION
    ================================ */
    window.submitDashboardSamihaQuestion = async function() {
      const input = el("dashboardSamihaQuestion");
      const statusEl = el("dashboardSamihaStatus");
  
      const questionText = input.value.trim();
      if (!questionText) {
        statusEl.textContent = t("writeFirst");
        return;
      }
  
      const userSub = await getDashboardUserSub();
      if (!userSub) {
        alert(t("loginRequired"));
        window.location.href = "login.html";
        return;
      }
  
      statusEl.textContent = t("sending");
  
      try {
        const res = await fetch(DASHBOARD_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userSub,
            question: questionText,
            language: currentLanguage // Include the selected language filter
          })
        });
  
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to send");
        }
  
        input.value = "";
        const counter = el("dashboardCharCount");
        if (counter) counter.textContent = "0 / 700";
        statusEl.textContent = t("success");
  
      } catch (err) {
        console.error(err);
        statusEl.textContent = t("failed");
      }
    };
  
    function setupLanguageListener() {
      const select = el("languageSelect");
      if (select) {
        select.addEventListener("change", (event) => {
          currentLanguage = event.target.value;
          applyTranslations();
        });
      }
    }
  
    function setupCharCount() {
      const input = el("dashboardSamihaQuestion");
      const counter = el("dashboardCharCount");
      if (!input || !counter) return;
      input.addEventListener("input", () => {
        counter.textContent = `${input.value.length} / 700`;
      });
    }
  
    function updateCurrentLanguage() {
      const savedLang = localStorage.getItem("selectedLanguage") || "en";
      currentLanguage = savedLang;
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      updateCurrentLanguage();
      applyTranslations();
      setupLanguageListener();
      setupCharCount();
    });
  })();
