/* =========================================================
   PERSONALIZED QUESTIONS (Ready Answers)
     - GET /personalized-questions
     - Render cards with language filtering
     - View Answer modal
     - Full translations embedded
========================================================= */

(function () {
    const DIRECT_ENDPOINT =
      "https://jej5dh7680.execute-api.me-central-1.amazonaws.com/personalized-questions";
  
    // ============================================
    // TRANSLATIONS (All languages embedded)
    // ============================================
    const translations = {
      en: {
        backHome: "⬅ Back to Home",
        pageTitle: "Ready Questions",
        headerTitle: "Ready Questions",
        headerDesc: "Browse thoughtful coaching questions with ready answers from Samiha. This space is designed to help you reflect, understand yourself, and gain clarity.",
        libraryTitle: "Your Q&A Library",
        refresh: "Refresh",
        loading: "Loading...",
        noQuestions: "No questions available yet.",
        noQuestionsLanguage: "No questions available in this language.",
        failed: "Failed to load questions. Check console.",
        modalTitle: "Answer",
        notAnswered: "This question has not been answered yet.",
        tapToRead: "Tap to read",
        notAnsweredYet: "Not answered yet",
        answered: "Answered",
        pending: "Pending",
        viewAnswer: "View Answer"
      },
      ar: {
        backHome: "⬅ العودة إلى الرئيسية",
        pageTitle: "أسئلة جاهزة",
        headerTitle: "أسئلة جاهزة",
        headerDesc: "استكشف أسئلة تدريب مدروسة مع إجابات جاهزة من سميحة. تم تصميم هذا المساحة لمساعدتك على التأمل وفهم نفسك واكتساب الوضوح.",
        libraryTitle: "مكتبة الأسئلة والأجوبة الخاصة بك",
        refresh: "تحديث",
        loading: "جاري التحميل...",
        noQuestions: "لا توجد أسئلة متاحة حتى الآن.",
        noQuestionsLanguage: "لا توجد أسئلة متاحة بهذه اللغة.",
        failed: "فشل تحميل الأسئلة. تحقق من وحدة التحكم.",
        modalTitle: "الإجابة",
        notAnswered: "لم تتم الإجابة على هذا السؤال حتى الآن.",
        tapToRead: "اضغط للقراءة",
        notAnsweredYet: "لم تتم الإجابة حتى الآن",
        answered: "تمت الإجابة",
        pending: "قيد الانتظار",
        viewAnswer: "عرض الإجابة"
      },
      fr: {
        backHome: "⬅ Retour à l'Accueil",
        pageTitle: "Questions Prêtes",
        headerTitle: "Questions Prêtes",
        headerDesc: "Explorez des questions de coaching réfléchies avec des réponses prêtes de Samiha. Cet espace est conçu pour vous aider à réfléchir, à vous comprendre et à gagner en clarté.",
        libraryTitle: "Votre Bibliothèque Q&R",
        refresh: "Actualiser",
        loading: "Chargement...",
        noQuestions: "Aucune question disponible pour le moment.",
        noQuestionsLanguage: "Aucune question disponible dans cette langue.",
        failed: "Échec du chargement des questions. Vérifiez la console.",
        modalTitle: "Réponse",
        notAnswered: "Cette question n'a pas encore reçu de réponse.",
        tapToRead: "Appuyez pour lire",
        notAnsweredYet: "Pas encore répondu",
        answered: "Répondu",
        pending: "En attente",
        viewAnswer: "Voir la Réponse"
      }
    };
  
    let allQuestions = []; // Store all questions
    let currentLanguage = 'en'; // Track current language
  
    function getEndpoint() {
      if (window.ADMIN_ENV && ADMIN_ENV.API_BASE_URL) {
        return `${ADMIN_ENV.API_BASE_URL}/personalized-questions`;
      }
      return DIRECT_ENDPOINT;
    }
  
    function el(id) {
      return document.getElementById(id);
    }
  
    function t(key) {
      // Get translation for current language, fallback to English
      if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
      }
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      return key;
    }
  
    function escapeHtml(str) {
      if (str === null || str === undefined) return "";
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  
    function applyTranslations() {
      // Update all UI text based on current language
      const backHomeBtn = el("backHomeBtn");
      if (backHomeBtn) backHomeBtn.textContent = t("backHome");
      
      const pageTitle = el("pageTitle");
      if (pageTitle) pageTitle.textContent = t("pageTitle");
      
      const headerTitle = el("headerTitle");
      if (headerTitle) headerTitle.textContent = t("headerTitle");
      
      const headerDesc = el("headerDesc");
      if (headerDesc) headerDesc.textContent = t("headerDesc");
      
      const libraryTitle = el("libraryTitle");
      if (libraryTitle) libraryTitle.textContent = t("libraryTitle");
      
      const refreshBtn = el("reloadPersonalizedBtn");
      if (refreshBtn) refreshBtn.textContent = t("refresh");
      
      const modalTitle = el("modalTitle");
      if (modalTitle) modalTitle.textContent = t("modalTitle");
      
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
  
    function openModal(questionText, answerText, answered) {
      const modal = el("viewAnswerModal");
      const qEl = el("viewAnswerQuestionText");
      const body = el("viewAnswerBody");
      const hint = el("viewAnswerHint");
  
      qEl.textContent = questionText || "";
      body.textContent = answerText || "";
  
      if (!answered) {
        hint.textContent = t("notAnswered");
      } else {
        hint.textContent = "";
      }
  
      modal.style.display = "flex";
    }
  
    function closeModal() {
      const modal = el("viewAnswerModal");
      modal.style.display = "none";
    }
  
    function renderCards(items) {
      const list = el("personalizedQuestionsList");
      list.innerHTML = "";
  
      items.forEach((q) => {
        const answered = !!q.answer;
  
        const card = document.createElement("div");
        card.style.background = "#fff";
        card.style.border = "1px solid #eee";
        card.style.borderRadius = "12px";
        card.style.padding = "14px";
        card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.justifyContent = "space-between";
        card.style.gap = "10px";
  
        const badge = answered
          ? `<span style="display:inline-block;background:#e9f7ef;color:#1e7e34;border:1px solid #ccebd8;padding:4px 8px;border-radius:999px;font-size:12px;">
               ${t("answered")}
             </span>`
          : `<span style="display:inline-block;background:#f8f9fa;color:#666;border:1px solid #eee;padding:4px 8px;border-radius:999px;font-size:12px;">
               ${t("pending")}
             </span>`;
  
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
            <div style="font-weight:700;color:#8B7355;">Q${escapeHtml(q.id)}</div>
            ${badge}
          </div>
  
          <div style="color:#333;font-size:14px;line-height:1.45;">
            ${escapeHtml(q.question)}
          </div>
  
          <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <button class="view-answer-btn"
                    data-question="${escapeHtml(q.question)}"
                    data-answer="${escapeHtml(q.answer || "")}"
                    data-answered="${answered ? "1" : "0"}"
                    style="flex:1;min-width:140px;border:none;border-radius:10px;padding:10px 12px;cursor:pointer;font-weight:700;
                           background:${answered ? "#8B7355" : "#eee"};
                           color:${answered ? "#fff" : "#999"};"
                    ${answered ? "" : "disabled"}>
              ${t("viewAnswer")}
            </button>
  
            <span style="font-size:12px;color:#777;">
              ${answered ? t("tapToRead") : t("notAnsweredYet")}
            </span>
          </div>
        `;
  
        list.appendChild(card);
      });
  
      // Attach modal open events
      document.querySelectorAll(".view-answer-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const questionText = btn.getAttribute("data-question") || "";
          const answerText = btn.getAttribute("data-answer") || "";
          const answered = btn.getAttribute("data-answered") === "1";
          openModal(questionText, answerText, answered);
        });
      });
    }
  
    function filterQuestionsByLanguage(questions, language) {
      // Filter questions to only show those matching the current language
      return questions.filter(q => q.language === language);
    }
  
    function displayQuestions() {
      // Filter questions based on current language
      const filteredQuestions = filterQuestionsByLanguage(allQuestions, currentLanguage);
      
      if (!filteredQuestions.length) {
        const status = el("personalizedQuestionsStatus");
        if (status) {
          status.textContent = allQuestions.length === 0 ? t("noQuestions") : t("noQuestionsLanguage");
        }
        const list = el("personalizedQuestionsList");
        if (list) {
          list.innerHTML = "";
        }
        return;
      }
  
      const status = el("personalizedQuestionsStatus");
      if (status) {
        status.textContent = "";
      }
      
      renderCards(filteredQuestions);
    }
  
    async function loadPersonalizedQuestions() {
      const status = el("personalizedQuestionsStatus");
      const list = el("personalizedQuestionsList");
  
      if (!status || !list) return;
  
      status.textContent = t("loading");
      list.innerHTML = "";
  
      try {
        const res = await fetch(getEndpoint(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Failed to load (HTTP ${res.status})`);
        }
  
        const data = await res.json();
  
        allQuestions = Array.isArray(data)
          ? data
          : Array.isArray(data.questions)
          ? data.questions
          : [];
  
        if (!allQuestions.length) {
          status.textContent = t("noQuestions");
          return;
        }
  
        // Display questions filtered by current language
        displayQuestions();
      } catch (err) {
        console.error("personalized-questions load error:", err);
        status.textContent = t("failed");
      }
    }
  
    function wireModal() {
      const modal = el("viewAnswerModal");
      const closeBtn = el("closeViewAnswerModalBtn");
  
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
  
      // close when clicking outside card
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) closeModal();
        });
      }
    }
  
    function wireRefresh() {
      const btn = el("reloadPersonalizedBtn");
      if (btn) btn.addEventListener("click", loadPersonalizedQuestions);
    }
  
    function setupLanguageListener() {
      const select = el("languageSelect");
      if (select) {
        select.addEventListener("change", (event) => {
          currentLanguage = event.target.value;
          applyTranslations();
          displayQuestions();
        });
      }
    }
  
    function updateCurrentLanguage() {
      // Get the current language from localStorage or default to 'en'
      const savedLang = localStorage.getItem("selectedLanguage") || "en";
      currentLanguage = savedLang;
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      updateCurrentLanguage();
      applyTranslations();
      wireModal();
      wireRefresh();
      setupLanguageListener();
      loadPersonalizedQuestions();
    });
  })();
