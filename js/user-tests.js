/* =========================================================
   USER TESTS MODULE – FULL PRODUCTION VERSION (UPDATED UI)
   ✔ Load tests
   ✔ Start session
   ✔ Single-question flow (with saved answers + back/next)
   ✔ Progress bar + clear progress text
   ✔ Submit answers
   ✔ Show latest diagnosis (clean + readable)
   ✔ Show previous diagnoses (with CTAs)
   ✔ View details modal (with CTAs)
   ✔ Download PDF (Print-to-PDF)
   ✔ WhatsApp booking CTA + Ask Samiha CTA everywhere
========================================================= */

/* ===============================
   TRANSLATIONS (i18n)
================================ */
const translations = {
  en: {
    loadingTests: "Loading tests...",
    failedToLoadTests: "Failed to load tests.",
    startTest: "Start Test",
    next: "Next",
    previous: "Previous",
    finishTest: "Finish Test",
    pleaseAnswerHonestly: "Please answer honestly — there are no right or wrong answers.",
    yourAnswersPrivate: "Your answers are private and secure.",
    questionOf: "Question {current} of {total}",
    answerRequired: "* Answer required",
    pleaseSelectAnswer: "Please select an answer.",
    loginAgain: "Please login again.",
    noQuestions: "No questions found for this test.",
    bookWhatsapp: "Book Session",
    askSamiha: "Ask Samiha",
    takeAnotherTest: "Take Another Test",
    readFullExplanation: "Read Full Explanation",
    completedOn: "Completed on {date}",
    leavePageTitle: "Leave this page?",
    leavePageDesc: "If you leave now, your result stays saved, but you’ll exit this screen.",
    confirmLeave: "Yes, Leave",
    cancelLeave: "Stay here",
    previousResults: "Your Previous Results",
    previousResultsDesc: "History of your completed personality tests",
    viewDetails: "View Details",
    downloadPdf: "Download PDF",
    close: "Close",
    submitConfirmTitle: "Submit Test?",
    submitConfirmDesc: "Are you sure you want to submit your answers?",
    confirmSubmit: "Yes, Submit",
    cancelSubmit: "Not yet",
    whatsappText: "Hello Samiha 👋 I just received my personality test results and I’d like to book a session to discuss them.",
    backHome: "Back Home",
    personalityTests: "Personality Tests",
    personalityAssessments: "Personality Assessments",
    testsIntro: "Please choose a test to begin your journey of self-discovery."
  },
  ar: {
    loadingTests: "جاري تحميل الاختبارات...",
    failedToLoadTests: "فشل تحميل الاختبارات.",
    startTest: "ابدأ الاختبار",
    next: "التالي",
    previous: "السابق",
    finishTest: "إنهاء الاختبار",
    pleaseAnswerHonestly: "يرجى الإجابة بصدق - لا توجد إجابات صحيحة أو خاطئة.",
    yourAnswersPrivate: "إجاباتك خاصة وآمنة.",
    questionOf: "السؤال {current} من {total}",
    answerRequired: "* الإجابة مطلوبة",
    pleaseSelectAnswer: "يرجى اختيار إجابة.",
    loginAgain: "يرجى تسجيل الدخول مرة أخرى.",
    noQuestions: "لم يتم العثور على أسئلة لهذا الاختبار.",
    bookWhatsapp: "حجز جلسة",
    askSamiha: "اسأل سميحة",
    takeAnotherTest: "إجراء اختبار آخر",
    readFullExplanation: "اقرأ الشرح الكامل",
    completedOn: "تم الإكمال في {date}",
    leavePageTitle: "مغادرة هذه الصفحة؟",
    leavePageDesc: "إذا غادرت الآن، فستبقى نتيجتك محفوظة، ولكنك ستخرج من هذه الشاشة.",
    confirmLeave: "نعم، غادر",
    cancelLeave: "البقاء هنا",
    previousResults: "نتائجك السابقة",
    previousResultsDesc: "سجل اختبارات الشخصية المكتملة",
    viewDetails: "عرض التفاصيل",
    downloadPdf: "تحميل PDF",
    close: "إغلاق",
    submitConfirmTitle: "إرسال الاختبار؟",
    submitConfirmDesc: "هل أنت متأكد أنك تريد إرسال إجاباتك؟",
    confirmSubmit: "نعم، إرسال",
    cancelSubmit: "ليس بعد",
    whatsappText: "مرحباً سميحة 👋 لقد تلقيت للتو نتائج اختبار الشخصية الخاص بي وأود حجز جلسة لمناقشتها.",
    backHome: "العودة للرئيسية",
    personalityTests: "اختبارات الشخصية",
    personalityAssessments: "تقييمات الشخصية",
    testsIntro: "يرجى اختيار اختبار لبدء رحلة اكتشاف الذات."

  },
  fr: {
    loadingTests: "Chargement des tests...",
    failedToLoadTests: "Échec du chargement des tests.",
    startTest: "Commencer le test",
    next: "Suivant",
    previous: "Précédent",
    finishTest: "Terminer le test",
    pleaseAnswerHonestly: "Veuillez répondre honnêtement — il n'y a pas de bonnes ou de mauvaises réponses.",
    yourAnswersPrivate: "Vos réponses sont privées et sécurisées.",
    questionOf: "Question {current} sur {total}",
    answerRequired: "* Réponse requise",
    pleaseSelectAnswer: "Veuillez sélectionner une réponse.",
    loginAgain: "Veuillez vous reconnecter.",
    noQuestions: "Aucune question trouvée pour ce test.",
    bookWhatsapp: "Réserver une séance",
    askSamiha: "Demander à Samiha",
    takeAnotherTest: "Faire un autre test",
    readFullExplanation: "Lire l'explication complète",
    completedOn: "Terminé le {date}",
    leavePageTitle: "Quitter cette page ?",
    leavePageDesc: "Si vous quittez maintenant, votre résultat reste enregistré, mais vous sortirez de cet écran.",
    confirmLeave: "Oui, quitter",
    cancelLeave: "Rester ici",
    previousResults: "Vos résultats précédents",
    previousResultsDesc: "Historique de vos tests de personnalité complétés",
    viewDetails: "Voir les détails",
    downloadPdf: "Télécharger le PDF",
    close: "Fermer",
    submitConfirmTitle: "Soumettre le test ?",
    submitConfirmDesc: "Êtes-vous sûr de vouloir soumettre vos réponses ?",
    confirmSubmit: "Oui, soumettre",
    cancelSubmit: "Pas encore",
    whatsappText: "Bonjour Samiha 👋 Je viens de recevoir les résultats de mon test de personnalité et j'aimerais réserver une séance pour en discuter.",
    backHome: "Retour à l'accueil",
    personalityTests: "Tests de Personnalité",
    personalityAssessments: "Évaluations de Personnalité",
    testsIntro: "Veuillez choisir un test pour commencer votre voyage de découverte de soi."
  }
};
let TEST_TIMER_INTERVAL = null;
let TEST_START_TIME = null;

let currentLanguage = localStorage.getItem("selectedLanguage") || "en";

function tr(key, params = {}) {
  let text = translations[currentLanguage]?.[key] || translations.en?.[key] || key;
  Object.keys(params).forEach(p => {
    text = text.replace(`{${p}}`, params[p]);
  });
  return text;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = tr(key);
  });
  // Handle RTL for Arabic
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
}

/* ===============================
   SAFETY CHECK
================================ */
if (!window.ADMIN_ENV || !ADMIN_ENV.API_BASE_URL) {
  console.error("ADMIN_ENV.API_BASE_URL is not defined");
}

/* ===============================
   GLOBAL STATE
================================ */
let CURRENT_SESSION_ID = null;
let CURRENT_TEST_ID = null;
let CURRENT_QUESTIONS = [];
let CURRENT_USER_ID = null;

let CURRENT_Q_INDEX = 0;
let CURRENT_ANSWERS = {}; // { [questionId]: { index } }

/* ===============================
   CONSTANTS
================================ */
const WHATSAPP_NUMBER = "96103960540";

/* ===============================
   HELPERS
================================ */
function safeText(v) {
  return v === null || v === undefined ? "" : String(v);
}

function escapeHtml(str) {
  return safeText(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(currentLanguage);
  } catch {
    return "";
  }
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(currentLanguage);
  } catch {
    return "";
  }
}

function formatDescriptionHtml(text) {
  if (!text) return "";
  const cleaned = escapeHtml(text)
    .replace(/\s*\n\s*/g, " ")
    .replace(/(\d+\))/g, "\n$1");

  return `<div style="white-space:pre-line;margin:0;">${cleaned}</div>`;
}

async function ensureUserId() {
  try {
    const sessionInfo = await CognitoAuth.getCurrentSession();
    if (!sessionInfo || !sessionInfo.session?.isValid()) return null;
    CURRENT_USER_ID = sessionInfo.session.getIdToken().payload.sub;
    return CURRENT_USER_ID;
  } catch {
    return null;
  }
}

function whatsappLink() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(tr("whatsappText"))}`;
}

function goAskSamiha() {
  // Redirect directly to the personalized questions page
  window.location.href = "personalized-questions.html";
}

/* ===============================
   BUTTON STYLES (INLINE SAFE)
================================ */
function btnPrimary() {
  return `
    padding:16px 40px;
    border-radius:35px;
    background:linear-gradient(135deg,#fff4c2,#f4d35e,#d4af37,#c9a227,#fff4c2);
    color:#033A35;
    border:none;
    font-size:1rem;
    font-weight:800;
    cursor:pointer;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    box-shadow:0 10px 25px rgba(212,175,55,0.35);
    transition:all 0.3s ease;
  `;
}

function btnSecondary() {
  return `
    padding:14px 20px;
    border-radius:12px;
    background:#fff;
    border:1px solid #ddd;
    font-size:1rem;
    font-weight:600;
    cursor:pointer;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    gap:8px;
    color:#333;
  `;
}

function btnTertiary() {
  return `
    padding:14px 20px;
    border-radius:12px;
    background:transparent;
    border:1px dashed #ddd;
    font-size:1rem;
    font-weight:600;
    cursor:pointer;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    gap:8px;
    color:#555;
  `;
}

/* ===============================
   ENSURE HISTORY UI
================================ */
function ensureHistoryContainers() {
  const testsSection = document.getElementById("tests");
  if (!testsSection) return;

  if (document.getElementById("previousDiagnosesWrap")) return;

  const wrap = document.createElement("div");
  wrap.id = "previousDiagnosesWrap";
  wrap.style.cssText = "margin-top:40px;display:none;";

  wrap.innerHTML = `
    <div class="results-header">
      <h2 data-i18n="previousResults">${tr("previousResults")}</h2>
      <p data-i18n="previousResultsDesc">${tr("previousResultsDesc")}</p>
    </div>

    <div id="previousDiagnosesList"
         style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
    </div>
  `;

  testsSection.appendChild(wrap);
}

/* ===============================
   LOAD TESTS LIST
================================ */
async function loadUserTests() {
  const listEl = document.getElementById("testsList");
  const statusEl = document.getElementById("testsStatus");

  if (!listEl || !statusEl) return;

  statusEl.textContent = tr("loadingTests");
  listEl.innerHTML = "";

  try {
    const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests`);
    if (!res.ok) throw new Error();

    const allTests = await res.json();
    statusEl.textContent = "";

    // Filter tests based on current language
    const filteredTests = allTests.filter(test => {
      // Check both 'language' and 'languageId' fields from the API
      const testLang = test.language || test.languageId;
      if (!testLang) return true;
      return testLang.toLowerCase() === currentLanguage.toLowerCase();
    });

    if (filteredTests.length === 0) {
      statusEl.textContent = tr("noQuestions"); // Or a more specific "No tests in this language"
    }

    filteredTests.forEach((test) => {
      const card = document.createElement("div");
      card.className = "test-card";

      card.innerHTML = `
        <h3>${escapeHtml(test.name)}</h3>
        <p>${escapeHtml(test.description || "")}</p>
        <button style="${btnPrimary()}" onclick="startTest(${test.id})">
          ${tr("startTest")}
        </button>
      `;

      listEl.appendChild(card);
    });
    applyTranslations();
  } catch {
    statusEl.textContent = tr("failedToLoadTests");
  }
}

/* ===============================
   START TEST
================================ */
async function startTest(testId) {
  
  const userId = await ensureUserId();
  if (!userId) return alert(tr("loginAgain"));

  CURRENT_TEST_ID = testId;
  CURRENT_Q_INDEX = 0;
  CURRENT_ANSWERS = {};

  const sessionRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, test_id: testId }),
  });

  const sessionResponse = await sessionRes.json();

console.log("🧪 SESSION CREATE RESPONSE:", sessionResponse);

// ✅ FIX: extract nested session id
CURRENT_SESSION_ID =
  sessionResponse?.session?.id ||
  sessionResponse?.id ||
  sessionResponse?.session_id ||
  null;

if (!CURRENT_SESSION_ID) {
  console.error("❌ Session ID missing after creation");
  alert("Session could not be created. Please try again.");
  return;
}

console.log("✅ CURRENT_SESSION_ID SET TO:", CURRENT_SESSION_ID);


  const qRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests/${testId}`);
  const raw = await qRes.json();
  const allQuestions = Array.isArray(raw) ? raw : raw.questions || [];

  // Filter questions based on the current language selected on the website
  CURRENT_QUESTIONS = allQuestions.filter(q => {
    // Check both 'language' and 'languageId' fields from the API
    const qLang = q.language || q.languageId;
    if (!qLang) return true;
    return qLang.toLowerCase() === currentLanguage.toLowerCase();
  });

  if (!Array.isArray(CURRENT_QUESTIONS) || CURRENT_QUESTIONS.length === 0) {
    alert(tr("noQuestions"));
    return;
  }
  TEST_START_TIME = Date.now();

if (TEST_TIMER_INTERVAL) clearInterval(TEST_TIMER_INTERVAL);

TEST_TIMER_INTERVAL = setInterval(() => {
  const elapsed = Math.floor((Date.now() - TEST_START_TIME) / 1000);
  const min = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const sec = String(elapsed % 60).padStart(2, "0");

  const timerEl = document.getElementById("testTimer");
  if (timerEl) timerEl.textContent = `⏱ ${min}:${sec}`;
}, 1000);


  renderTestUI();
}

/* ===============================
   TEST UI (SINGLE QUESTION + PROGRESS)
================================ */
function renderTestUI() {
  const section = document.getElementById("tests");

  section.innerHTML = `
    <div class="results-header">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:30px;flex-wrap:wrap;">
      <div>
      <h2
        style="
          margin:0;
          font-family:'Playfair Display', serif;
          background: linear-gradient(
            135deg,
            #fff4c2,
            #f4d35e,
            #d4af37,
            #c9a227,
            #fff4c2
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          font-weight: 700;
          letter-spacing: 0.5px;
        ">
        ${escapeHtml(CURRENT_QUESTIONS[0]?.name || "Test")}
      </h2>
    
      <p
        data-i18n="pleaseAnswerHonestly"
        style="
          margin:6px 0 0;
          background: linear-gradient(
            135deg,
            #fff4c2,
            #f4d35e,
            #d4af37,
            #c9a227,
            #fff4c2
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          font-weight: 500;
        ">
        ${tr("pleaseAnswerHonestly")}
      </p>
    </div>
    
        <div id="testTimer" style="background:#E6D6A7;padding:10px 22px;border-radius:30px;font-weight:800;color:#033A35;border:2px solid #D4AF37;font-size:0.95rem;white-space:nowrap;">
          ⏱ 00:00
        </div>
      </div>
    </div>

    <div style="max-width:760px;margin:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
        <div id="progressText" style="color:#777;font-size:0.95rem;font-weight:600;"></div>
        <div data-i18n="yourAnswersPrivate" style="color:#777;font-size:0.9rem;">${tr("yourAnswersPrivate")}</div>
      </div>

      <div style="height:10px;background:#eee;border-radius:999px;margin-bottom:18px;overflow:hidden;">
        <div id="progressBar" style="height:100%;width:0%;background:#8B7355;border-radius:999px;"></div>
      </div>

      <div id="questionBox" style="background:#ffffff;border-radius:30px;padding:50px;box-shadow:0 10px 30px rgba(10,56,54,0.12);border:1px solid rgba(0,0,0,0.05);animation:slideUp 0.6s ease-out;">
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:30px;gap:16px;">
        <button id="prevBtn" style="${btnSecondary()}" onclick="prevQuestion()">
          ${tr("previous")}
        </button>
        <button id="nextBtn" style="${btnPrimary()}" onclick="nextQuestion()">
          ${tr("next")}
        </button>
      </div>
    </div>

    <!-- SUBMIT CONFIRM OVERLAY -->
    <div id="submitConfirmOverlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.55);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px;">
      <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:28px;box-shadow:0 15px 40px rgba(0,0,0,0.25);text-align:center;">
        <h3 data-i18n="submitConfirmTitle" style="margin:0 0 10px;font-family:'Playfair Display', serif;color:#033A35;">${tr("submitConfirmTitle")}</h3>
        <p data-i18n="submitConfirmDesc" style="color:#555;font-size:0.95rem;line-height:1.6;margin:0;">${tr("submitConfirmDesc")}</p>
        <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button id="confirmSubmitBtn" style="${btnPrimary()}">${tr("confirmSubmit")}</button>
          <button id="cancelSubmitBtn" style="${btnSecondary()}">${tr("cancelSubmit")}</button>
        </div>
      </div>
    </div>
  `;
  renderQuestion();
}

function renderQuestion() {
  const q = CURRENT_QUESTIONS[CURRENT_Q_INDEX];
  const box = document.getElementById("questionBox");
  const total = CURRENT_QUESTIONS.length;
  const idx = CURRENT_Q_INDEX + 1;

  // Progress
  document.getElementById("progressText").textContent = tr("questionOf", { current: idx, total: total });
  document.getElementById("progressBar").style.width = `${(idx / total) * 100}%`;

  const saved = CURRENT_ANSWERS[q.id]?.index;
  const choicesHtml = Object.entries(q.choices || {}).map(([k, v]) => {
    const isSelected = saved === k;
    // Map keys to A, B, C, D, E
    const labelMap = { 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E' };
    const label = labelMap[k.toUpperCase()] || k;
    
    return `
      <button type="button" data-value="${escapeHtml(k)}" style="width:100%;padding:15px 0;background:transparent;border:none;font-size:1.1rem;font-family:'Lato', sans-serif;font-weight:400;cursor:pointer;text-align:left;display:flex;align-items:center;gap:18px;color:${isSelected ? "#D4AF37" : "#011514"};transition:all 0.2s ease;outline:none;">
        <span style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1.5px solid ${isSelected ? "#D4AF37" : "#033A35"};background:${isSelected ? "#D4AF37" : "transparent"};color:${isSelected ? "#033A35" : "#033A35"};font-weight:700;font-size:1rem;flex-shrink:0;">${label}</span>
        <span style="line-height:1.5;${isSelected ? "font-weight:700;" : ""}">${escapeHtml(v)}</span>
      </button>
    `;
  }).join("");

    box.innerHTML = `
    <div style="text-align:center;margin-bottom:40px;">
      <h3 style="font-family:'Playfair Display', serif;font-size:1.8rem;color:#033A35;margin-bottom:12px;line-height:1.3;font-weight:700;">
        ${escapeHtml(q.question)}
      </h3>
      <p style="color:#8B7355;font-size:0.9rem;font-weight:600;margin:0;letter-spacing:0.5px;text-transform:uppercase;" data-i18n="answerRequired">${tr("answerRequired")}</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;max-width:650px;margin:0 auto;">
      ${choicesHtml}
    </div>
  `;

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (prevBtn) prevBtn.disabled = CURRENT_Q_INDEX === 0;
  if (nextBtn) nextBtn.textContent = CURRENT_Q_INDEX < total - 1 ? tr("next") : tr("finishTest");

  box.querySelectorAll("button[data-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. Immediate visual feedback
      box.querySelectorAll("button[data-value]").forEach(b => {
        const circle = b.querySelector('span:first-child');
        const text = b.querySelector('span:last-child');
        if (b === btn) {
          b.style.color = "#D4AF37";
          if (circle) {
            circle.style.background = "#D4AF37";
            circle.style.borderColor = "#D4AF37";
          }
          if (text) text.style.fontWeight = "700";
        } else {
          b.style.color = "#011514";
          if (circle) {
            circle.style.background = "transparent";
            circle.style.borderColor = "#033A35";
          }
          if (text) text.style.fontWeight = "400";
        }
      });

      // 2. Save answer
      CURRENT_ANSWERS[q.id] = { index: btn.dataset.value.toUpperCase() };
    
      // 3. Delay transition for user to see the highlight
      setTimeout(() => {
        if (CURRENT_Q_INDEX < total - 1) {
          CURRENT_Q_INDEX++;
          renderQuestion();
        } else {
          openSubmitConfirm();
        }
      }, 400); // Slightly longer delay to appreciate the selection
    });
  });
}

function nextQuestion() {
  if (!CURRENT_ANSWERS[CURRENT_QUESTIONS[CURRENT_Q_INDEX].id]) {
    return alert(tr("pleaseSelectAnswer"));
  }
  if (CURRENT_Q_INDEX < CURRENT_QUESTIONS.length - 1) {
    CURRENT_Q_INDEX++;
    renderQuestion();
  } else {
    openSubmitConfirm();
  }
}

function prevQuestion() {
  if (CURRENT_Q_INDEX > 0) {
    CURRENT_Q_INDEX--;
    renderQuestion();
  }
}

function openSubmitConfirm() {
  const overlay = document.getElementById("submitConfirmOverlay");
  if (overlay) overlay.style.display = "flex";
}

function closeSubmitConfirm() {
  const overlay = document.getElementById("submitConfirmOverlay");
  if (overlay) overlay.style.display = "none";
}

async function submitTest() {
  try {
    console.group("🧪 TEST SUBMISSION DEBUG");
console.log("Session ID:", CURRENT_SESSION_ID);
console.log("Test ID:", CURRENT_TEST_ID);
console.log("Raw Answers Object:", CURRENT_ANSWERS);

// Flatten answers for easy reading
const flatAnswers = Object.entries(CURRENT_ANSWERS).map(([qid, obj]) => ({
  question_id: qid,
  selected: obj?.index,
  type: typeof obj?.index,
}));

console.table(flatAnswers);

// Count letters (this mirrors backend logic)
const counts = {};
flatAnswers.forEach(a => {
  if (!a.selected) return;
  counts[a.selected] = (counts[a.selected] || 0) + 1;
});
console.log("Letter counts:", counts);

console.groupEnd();

    await fetch(`${ADMIN_ENV.API_BASE_URL}/sessions/${CURRENT_SESSION_ID}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: CURRENT_ANSWERS }),
    });
    const userId = await ensureUserId();
    if (userId) await loadLatestDiagnosis(userId);
  } catch (e) {
    console.error(e);
    alert(tr("failedToLoadTests"));
  }
  if (TEST_TIMER_INTERVAL) {
    clearInterval(TEST_TIMER_INTERVAL);
    TEST_TIMER_INTERVAL = null;
  }
  
}

async function loadLatestDiagnosis(userId) {
  const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/diagnoses/${userId}`);
  const data = await res.json();
  const latest = data.diagnoses?.[0];
  if (latest) showDiagnosisResult(latest);
}

function showDiagnosisResult(d) {
  const section = document.getElementById("tests");
  const dateStr = d.test_completed_at ? formatDate(d.test_completed_at) : "";
  const diagnosisTitle =
  d.diagnosis_text ||
  d.name ||
  d.diagnosis_name ||
  "";


  section.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:30px;flex-wrap:wrap;">
    <div>
    <h2
      style="
        margin:0;
        font-family:'Playfair Display', serif;
        background: linear-gradient(
          135deg,
          #fff4c2,
          #f4d35e,
          #d4af37,
          #c9a227,
          #fff4c2
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        font-weight: 700;
        letter-spacing: 0.5px;
      ">
      ${escapeHtml(CURRENT_QUESTIONS[0]?.name || "Test")}
    </h2>
  
    <p
      data-i18n="pleaseAnswerHonestly"
      style="
        margin:6px 0 0;
        background: linear-gradient(
          135deg,
          #fff4c2,
          #f4d35e,
          #d4af37,
          #c9a227,
          #fff4c2
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        font-weight: 500;
      ">
      ${tr("pleaseAnswerHonestly")}
    </p>
  </div>
    </div>

    <div style="max-width:820px;margin:20px auto 0;background:#fff;padding:26px;border-radius:16px;box-shadow:0 4px 18px rgba(0,0,0,0.08);border:1px solid #eee;">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-end;">
      <h3 style="
      margin:0;
      color:#033A35;
      font-size:1.6rem;
      font-weight:900;
      font-family:'Playfair Display', serif;
    ">
      ${escapeHtml(
        d.diagnosis_text ||
        d.name ||
        d.diagnosis_name ||
        ""
      )}
    </h3>
    
        ${dateStr ? `<span style="color:#777;font-size:0.85rem;">${tr("completedOn", { date: dateStr })}</span>` : ""}
      </div>

      <details style="margin-top:24px;background:#faf7f3;padding:18px;border-radius:14px;border-left:4px solid #D4AF37;">
        <summary style="cursor:pointer;font-weight:700;color:#033A35;margin-bottom:10px;">${tr("readFullExplanation")}</summary>
        <div style="margin-top:10px;line-height:1.85;">${formatDescriptionHtml(d.description)}</div>
      </details>

      <p style="margin:14px 0 0;color:#666;font-size:0.92rem;">${tr("leavePageDesc")}</p>

      <div style="margin-top:18px;display:flex;gap:14px;flex-wrap:wrap;">
        <a href="${whatsappLink()}" target="_blank" style="${btnPrimary()}">${tr("bookWhatsapp")}</a>
        <button type="button" style="${btnPrimary()}" onclick="confirmLeave(() => goAskSamiha())">${tr("askSamiha")}</button>
        <button type="button" style="${btnPrimary()}" onclick="confirmLeave(() => window.location.reload())">${tr("takeAnotherTest")}</button>
      </div>
    </div>

    <!-- LEAVE CONFIRM MODAL -->
    <div id="leaveConfirmOverlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.55);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px;">
      <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:28px;box-shadow:0 15px 40px rgba(0,0,0,0.25);text-align:center;">
        <h3 style="margin:0 0 10px;font-family:'Playfair Display', serif;color:#033A35;">${tr("leavePageTitle")}</h3>
        <p style="color:#555;font-size:0.95rem;line-height:1.6;margin:0;">${tr("leavePageDesc")}</p>
        <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button id="confirmLeaveBtn" style="${btnPrimary()}">${tr("confirmLeave")}</button>
          <button id="cancelLeaveBtn" style="${btnSecondary()}">${tr("cancelLeave")}</button>
        </div>
      </div>
    </div>
  `;
  window.__LATEST_DIAGNOSIS__ = d;
}

let PENDING_REDIRECT = null;
function confirmLeave(redirectFn) {
  PENDING_REDIRECT = redirectFn;
  const overlay = document.getElementById("leaveConfirmOverlay");
  if (overlay) overlay.style.display = "flex";
}

document.addEventListener("click", (e) => {
  if (e.target?.id === "confirmSubmitBtn") {
    closeSubmitConfirm();
    submitTest();
  }
  if (e.target?.id === "cancelSubmitBtn") closeSubmitConfirm();
  if (e.target?.id === "confirmLeaveBtn") {
    document.getElementById("leaveConfirmOverlay").style.display = "none";
    if (typeof PENDING_REDIRECT === "function") PENDING_REDIRECT();
  }
  if (e.target?.id === "cancelLeaveBtn") document.getElementById("leaveConfirmOverlay").style.display = "none";
});

async function loadAllDiagnoses(userId) {
  ensureHistoryContainers();
  const wrap = document.getElementById("previousDiagnosesWrap");
  const list = document.getElementById("previousDiagnosesList");

  const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/diagnoses/${userId}`);
  const data = await res.json();
  const diagnoses = data.diagnoses || [];

  if (diagnoses.length === 0) return;
  wrap.style.display = "block";
  list.innerHTML = "";

  diagnoses.forEach((d) => {
    const card = document.createElement("div");
    card.style.cssText = "background:#fff;border-radius:14px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,0.08);border:1px solid #eee;display:flex;flex-direction:column;gap:10px;";
    card.innerHTML = `
      <h4 style="margin:0;color:#8B7355;">${escapeHtml(d.test_name)}</h4>
      <p style="margin:0;font-weight:700;color:#333;line-height:1.5;">${escapeHtml(d.diagnosis_text)}</p>
      <p style="margin:0;font-size:0.85rem;color:#777;">${tr("completedOn", { date: formatDate(d.test_completed_at) })}</p>
      <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;">
        <button type="button" onclick='viewDiagnosisDetails(${JSON.stringify(d).replaceAll("'", "\\'")})' style="${btnSecondary()}">${tr("viewDetails")}</button>
        <button type="button" onclick='downloadDiagnosisPDF(${JSON.stringify(d).replaceAll("'", "\\'")})' style="${btnSecondary()}">${tr("downloadPdf")}</button>
        <a href="${whatsappLink()}" target="_blank" style="${btnPrimary()}">${tr("bookWhatsapp")}</a>
        <button type="button" onclick="goAskSamiha()" style="${btnTertiary()}">${tr("askSamiha")}</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function viewDiagnosisDetails(d) {
  const overlayId = "diagnosisDetailsOverlay";
  const existing = document.getElementById(overlayId);
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;";

  const card = document.createElement("div");
  card.style.cssText = "max-width:820px;width:100%;background:#fff;border-radius:16px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,0.18);";

  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
      <h3 style="margin:0;color:#8B7355;">${escapeHtml(d.test_name)}</h3>
      <button type="button" id="closeDiagnosisModalBtn" style="border:none;background:transparent;font-size:20px;cursor:pointer;padding:6px 10px;border-radius:10px;">✕</button>
    </div>
    <p style="margin:10px 0 6px;font-weight:800;color:#333;line-height:1.55;">${escapeHtml(d.diagnosis_text)}</p>
    <p style="margin:0 0 12px;color:#777;font-size:0.9rem;">${tr("completedOn", { date: formatDateTime(d.test_completed_at) })}</p>
    <div style="background:#faf7f3;padding:16px;border-left:4px solid #8B7355;border-radius:12px;line-height:1.85;">${formatDescriptionHtml(d.description)}</div>
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;">
      <button type="button" id="closeBtn2" style="${btnSecondary()}">${tr("close")}</button>
      <button type="button" onclick='downloadDiagnosisPDF(${JSON.stringify(d).replaceAll("'", "\\'")})' style="${btnSecondary()}">${tr("downloadPdf")}</button>
      <a href="${whatsappLink()}" target="_blank" style="${btnPrimary()}">${tr("bookWhatsapp")}</a>
      <button type="button" onclick="goAskSamiha()" style="${btnTertiary()}">${tr("askSamiha")}</button>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  card.querySelector("#closeDiagnosisModalBtn").addEventListener("click", close);
  card.querySelector("#closeBtn2").addEventListener("click", close);
}

function downloadDiagnosisPDF(d) {
  if (!d) return alert("No diagnosis available to download.");
  const w = window.open("", "_blank");
  if (!w) return alert("Popup blocked. Please allow popups to download PDF.");

  w.document.open();
  w.document.write(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${escapeHtml(d.test_name)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color:#222; direction: ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}; }
          h1 { margin:0 0 10px; }
          h3 { margin:0 0 14px; }
          .box { background:#faf7f3; border-left:4px solid #8B7355; padding:14px; border-radius:10px; line-height:1.8; white-space:pre-wrap; }
          .meta { color:#666; margin-bottom:16px; }
          @media print { button { display:none; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(d.test_name)}</h1>
        <div class="meta">${tr("completedOn", { date: formatDateTime(d.test_completed_at || d.created_at || "") })}</div>
        <h3>${escapeHtml(d.diagnosis_text)}</h3>
        <div class="box">${escapeHtml(safeText(d.description))}</div>
        <button onclick="window.print()" style="margin-top:20px;padding:10px 14px;border:none;border-radius:10px;background:#8B7355;color:#fff;font-weight:700;cursor:pointer;">Print / Save as PDF</button>
      </body>
    </html>
  `);
  w.document.close();
  setTimeout(() => { try { w.print(); } catch {} }, 300);
}

document.addEventListener("DOMContentLoaded", async () => {
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.value = currentLanguage;
    langSelect.addEventListener("change", (e) => {
      currentLanguage = e.target.value;
      localStorage.setItem("selectedLanguage", currentLanguage);
      applyTranslations();
      if (CURRENT_QUESTIONS.length > 0) {
        if (CURRENT_SESSION_ID && !window.__LATEST_DIAGNOSIS__) renderTestUI();
        else if (window.__LATEST_DIAGNOSIS__) showDiagnosisResult(window.__LATEST_DIAGNOSIS__);
      } else {
        loadUserTests();
      }
    });
  }
  applyTranslations();
  await loadUserTests();
  const userId = await ensureUserId();
  //if (userId) loadAllDiagnoses(userId);
});
