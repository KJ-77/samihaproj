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
const WHATSAPP_TEXT =
  "Hello Samiha 👋 I just received my personality test results and I’d like to book a session to discuss them.";

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
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

/**
 * ✅ Description formatting:
 * - collapses random line breaks into spaces
 * - keeps "1) 2) 3) ..." as new lines
 * - shows as clean paragraphs with good readability
 */
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
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_TEXT
  )}`;
}

/* ✅ Ask Samiha shortcut (keeps your nav system) */
function goAskSamiha() {
  const btn = document.querySelector('.nav-item[data-section="questions"]');
  if (btn) btn.click();
}

/* ===============================
   BUTTON STYLES (INLINE SAFE)
================================ */
function btnPrimary() {
  return `
    padding:14px 20px;
    border-radius:12px;
    background:#8B7355;
    color:#fff;
    border:none;
    font-size:1rem;
    font-weight:700;
    cursor:pointer;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    gap:8px;
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
      <h2>Your Previous Results</h2>
      <p>History of your completed personality tests</p>
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

  statusEl.textContent = "Loading tests...";
  listEl.innerHTML = "";

  try {
    const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests`);
    if (!res.ok) throw new Error();

    const tests = await res.json();
    statusEl.textContent = "";

    tests.forEach((test) => {
      const card = document.createElement("div");
      card.className = "test-card";

      card.innerHTML = `
        <h3>${escapeHtml(test.name)}</h3>
        <p>${escapeHtml(test.description || "")}</p>
        <button style="${btnPrimary()}" onclick="startTest(${test.id})">
          Start Test
        </button>
      `;

      listEl.appendChild(card);
    });
  } catch {
    statusEl.textContent = "Failed to load tests.";
  }
}

/* ===============================
   START TEST
================================ */
async function startTest(testId) {
  const userId = await ensureUserId();
  if (!userId) return alert("Please login again.");

  CURRENT_TEST_ID = testId;
  CURRENT_Q_INDEX = 0;
  CURRENT_ANSWERS = {};

  // Create session
  const sessionRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, test_id: testId }),
  });

  const session = await sessionRes.json();
  CURRENT_SESSION_ID = session.id || session.session_id;

  // Load questions
  const qRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests/${testId}`);
  const raw = await qRes.json();
  CURRENT_QUESTIONS = Array.isArray(raw) ? raw : raw.questions || [];

  if (!Array.isArray(CURRENT_QUESTIONS) || CURRENT_QUESTIONS.length === 0) {
    alert("No questions found for this test.");
    return;
  }

  renderTestUI();
}

/* ===============================
   TEST UI (SINGLE QUESTION + PROGRESS)
================================ */
function renderTestUI() {
  const section = document.getElementById("tests");

  section.innerHTML = `
    <div class="results-header">
      <h2>${escapeHtml(CURRENT_QUESTIONS[0]?.name || "Test")}</h2>
      <p>Please answer honestly — there are no right or wrong answers.</p>
    </div>

    <div style="max-width:760px;margin:auto;">
      <!-- Progress line + text -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
        <div id="progressText" style="color:#777;font-size:0.95rem;font-weight:600;"></div>
        <div style="color:#777;font-size:0.9rem;">
          Your answers are private
        </div>
      </div>

      <div style="height:10px;background:#eee;border-radius:999px;margin-bottom:18px;overflow:hidden;">
        <div id="progressBar"
             style="height:100%;width:0%;background:#8B7355;border-radius:999px;"></div>
      </div>

      <div id="questionBox"
           style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px;box-shadow:0 2px 12px rgba(0,0,0,0.06);"></div>

      <div style="display:flex;justify-content:space-between;margin-top:18px;gap:12px;flex-wrap:wrap;">
        <button id="prevBtn" style="${btnSecondary()}" disabled>Previous</button>
        <button id="nextBtn" style="${btnPrimary()}">Next</button>
      </div>

      <p style="margin:12px 0 0;color:#777;font-size:0.9rem;">
        Tip: choose the option that feels most true right now.
      </p>
    </div>
  `;

  document.getElementById("prevBtn").onclick = prevQuestion;
  document.getElementById("nextBtn").onclick = nextQuestion;

  renderQuestion();
}

function renderQuestion() {
  const q = CURRENT_QUESTIONS[CURRENT_Q_INDEX];
  const box = document.getElementById("questionBox");

  const total = CURRENT_QUESTIONS.length;
  const idx = CURRENT_Q_INDEX + 1;
  const progress = (idx / total) * 100;

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `Question ${idx} of ${total}`;

  const saved = CURRENT_ANSWERS[q.id]?.index || null;

  const choicesHtml = Object.entries(q.choices || {})
    .map(([k, v]) => {
      const isSelected = saved === k;
      const border = isSelected ? "2px solid #8B7355" : "1px solid #eee";
      const bg = isSelected ? "#faf7f3" : "#fff";

      return `
        <label style="
          display:block;
          margin:12px 0;
          padding:14px 14px;
          border:${border};
          border-radius:14px;
          cursor:pointer;
          background:${bg};
          transition:background 0.15s ease;
        ">
          <input type="radio" name="q" value="${escapeHtml(k)}" style="margin-right:10px;" ${
            isSelected ? "checked" : ""
          }>
          <strong style="color:#8B7355;">${escapeHtml(k.toUpperCase())}.</strong>
          <span style="color:#333;">${escapeHtml(v)}</span>
        </label>`;
    })
    .join("");

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start;">
      <h3 style="margin:0;color:#333;line-height:1.35;">
        ${escapeHtml(q.question)}
      </h3>
      <span style="color:#999;font-size:0.85rem;">Answer required</span>
    </div>
    <div style="margin-top:10px;">
      ${choicesHtml || `<p style="color:#B00020;">No choices found for this question.</p>`}
    </div>
  `;

  // Update buttons
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (prevBtn) prevBtn.disabled = CURRENT_Q_INDEX === 0;

  if (nextBtn) {
    nextBtn.textContent =
      CURRENT_Q_INDEX < CURRENT_QUESTIONS.length - 1 ? "Next" : "Finish Test";
  }

  // Small UX: selecting option immediately re-renders to show highlighted border/bg
  box.querySelectorAll("input[name='q']").forEach((radio) => {
    radio.addEventListener("change", () => {
      CURRENT_ANSWERS[q.id] = { index: radio.value };
      renderQuestion();
    });
  });
}

function nextQuestion() {
  const q = CURRENT_QUESTIONS[CURRENT_Q_INDEX];
  const selected = document.querySelector("input[name='q']:checked");

  if (!selected) return alert("Please select an answer.");

  // Save current answer
  CURRENT_ANSWERS[q.id] = { index: selected.value };

  if (CURRENT_Q_INDEX < CURRENT_QUESTIONS.length - 1) {
    CURRENT_Q_INDEX++;
    renderQuestion();
  } else {
    submitTest();
  }
}

function prevQuestion() {
  if (CURRENT_Q_INDEX > 0) {
    CURRENT_Q_INDEX--;
    renderQuestion();
  }
}

/* ===============================
   SUBMIT TEST
================================ */
async function submitTest() {
  try {
    await fetch(`${ADMIN_ENV.API_BASE_URL}/sessions/${CURRENT_SESSION_ID}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: CURRENT_ANSWERS }),
    });

    const userId = await ensureUserId();
    if (!userId) return;

    await loadLatestDiagnosis(userId);
    await loadAllDiagnoses(userId);
  } catch (e) {
    console.error(e);
    alert("Something went wrong submitting your test. Please try again.");
  }
}

/* ===============================
   LOAD LATEST DIAGNOSIS
================================ */
async function loadLatestDiagnosis(userId) {
  const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/diagnoses/${userId}`);
  const data = await res.json();

  const latest = data.diagnoses?.[0];
  if (!latest) return;

  showDiagnosisResult(latest);
}

/* ===============================
   DISPLAY RESULT (UPDATED + CLEAR)
================================ */
function showDiagnosisResult(d) {
  const section = document.getElementById("tests");

  const dateStr = d.test_completed_at ? formatDateTime(d.test_completed_at) : "";

  section.innerHTML = `
    <div class="results-header">
      <h2>Your Personality Insight</h2>
      <p>Take a moment to read your result — there’s no rush.</p>
    </div>

    <div style="
      max-width:820px;
      margin:20px auto 0;
      background:#fff;
      padding:26px;
      border-radius:16px;
      box-shadow:0 4px 18px rgba(0,0,0,0.08);
      border:1px solid #eee;
    ">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-end;">
        <h3 style="margin:0;color:#8B7355;">${escapeHtml(d.test_name)}</h3>
        ${dateStr ? `<span style="color:#777;font-size:0.85rem;">Completed on ${escapeHtml(
          dateStr
        )}</span>` : ""}
      </div>

      <div style="
        margin-top:12px;
        font-size:1.15rem;
        font-weight:800;
        color:#333;
        line-height:1.55;
      ">
        ${escapeHtml(d.diagnosis_text)}
      </div>

      <div style="
        margin-top:14px;
        background:#faf7f3;
        padding:18px;
        border-left:4px solid #8B7355;
        border-radius:12px;
        line-height:1.85;
        color:#333;
        font-size:0.98rem;
        overflow-wrap:anywhere;
      ">
        ${formatDescriptionHtml(d.description)}
      </div>

      <p style="margin:14px 0 0;color:#666;font-size:0.92rem;">
        If you'd like, you can discuss this result in a private session.
      </p>

      <div style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="${whatsappLink()}" target="_blank" style="${btnPrimary()}">
          Book a Session on WhatsApp
        </a>

        <button type="button" onclick="openPrintPdfForLatest()" style="${btnSecondary()}">
          Download PDF
        </button>

        <button type="button" onclick="goAskSamiha()" style="${btnTertiary()}">
           Ask Samiha
        </button>
      </div>
    </div>
  `;

  window.__LATEST_DIAGNOSIS__ = d;
}

/* ===============================
   PREVIOUS RESULTS (UPDATED CTAs)
================================ */
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
    card.style.cssText = `
      background:#fff;
      border-radius:14px;
      padding:16px;
      box-shadow:0 2px 10px rgba(0,0,0,0.08);
      border:1px solid #eee;
      display:flex;
      flex-direction:column;
      gap:10px;
    `;

    card.innerHTML = `
      <h4 style="margin:0;color:#8B7355;">${escapeHtml(d.test_name)}</h4>
      <p style="margin:0;font-weight:700;color:#333;line-height:1.5;">
        ${escapeHtml(d.diagnosis_text)}
      </p>
      <p style="margin:0;font-size:0.85rem;color:#777;">
        Completed on ${escapeHtml(formatDate(d.test_completed_at))}
      </p>

      <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;">
        <button type="button"
          onclick='viewDiagnosisDetails(${JSON.stringify(d).replaceAll("'", "\\'")})'
          style="${btnSecondary()}">
          View Details
        </button>

        <button type="button"
          onclick='downloadDiagnosisPDF(${JSON.stringify(d).replaceAll("'", "\\'")})'
          style="${btnSecondary()}">
          Download PDF
        </button>

        <a href="${whatsappLink()}" target="_blank" style="${btnPrimary()}">
           Book Session
        </a>

        <button type="button" onclick="goAskSamiha()" style="${btnTertiary()}">
           Ask Samiha
        </button>
      </div>
    `;

    list.appendChild(card);
  });
}

/* ===============================
   DETAILS MODAL (UPDATED + CTAs)
================================ */
function viewDiagnosisDetails(d) {
  const overlayId = "diagnosisDetailsOverlay";
  const existing = document.getElementById(overlayId);
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;";

  const card = document.createElement("div");
  card.style.cssText =
    "max-width:820px;width:100%;background:#fff;border-radius:16px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,0.18);";

  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
      <h3 style="margin:0;color:#8B7355;">${escapeHtml(d.test_name)}</h3>
      <button type="button" id="closeDiagnosisModalBtn"
              style="border:none;background:transparent;font-size:20px;cursor:pointer;padding:6px 10px;border-radius:10px;">
        ✕
      </button>
    </div>

    <p style="margin:10px 0 6px;font-weight:800;color:#333;line-height:1.55;">
      ${escapeHtml(d.diagnosis_text)}
    </p>

    <p style="margin:0 0 12px;color:#777;font-size:0.9rem;">
      Completed on ${escapeHtml(formatDateTime(d.test_completed_at))}
    </p>

    <div style="background:#faf7f3;padding:16px;border-left:4px solid #8B7355;border-radius:12px;line-height:1.85;">
      ${formatDescriptionHtml(d.description)}
    </div>

    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;">
      <button type="button" id="closeBtn2" style="${btnSecondary()}">Close</button>

      <button type="button"
        onclick='downloadDiagnosisPDF(${JSON.stringify(d).replaceAll("'", "\\'")})'
        style="${btnSecondary()}">
        Download PDF
      </button>

      <a href="${whatsappLink()}" target="_blank" style="${btnPrimary()}">
         Book Session
      </a>

      <button type="button" onclick="goAskSamiha()" style="${btnTerti()}">
        Ask Samiha
      </button>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  card.querySelector("#closeDiagnosisModalBtn").addEventListener("click", close);
  card.querySelector("#closeBtn2").addEventListener("click", close);
}

/* ===============================
   PDF EXPORT (PRINT-TO-PDF)
================================ */
function openPrintPdfForLatest() {
  downloadDiagnosisPDF(window.__LATEST_DIAGNOSIS__);
}

function downloadDiagnosisPDF(d) {
  if (!d) return alert("No diagnosis available to download.");

  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Please allow popups to download PDF.");
    return;
  }

  w.document.open();
  w.document.write(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${escapeHtml(d.test_name)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color:#222; }
          h1 { margin:0 0 10px; }
          h3 { margin:0 0 14px; }
          .box {
            background:#faf7f3;
            border-left:4px solid #8B7355;
            padding:14px;
            border-radius:10px;
            line-height:1.8;
            white-space:pre-wrap;
          }
          .meta { color:#666; margin-bottom:16px; }
          @media print { button { display:none; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(d.test_name)}</h1>
        <div class="meta">Completed on: ${escapeHtml(
          formatDateTime(d.test_completed_at || d.created_at || "")
        )}</div>

        <h3>${escapeHtml(d.diagnosis_text)}</h3>

        <div class="box">${escapeHtml(safeText(d.description))}</div>

        <p style="margin-top:18px;color:#666;">
          Tip: In the print dialog, choose <b>Save as PDF</b>.
        </p>

        <button onclick="window.print()"
          style="padding:10px 14px;border:none;border-radius:10px;background:#8B7355;color:#fff;font-weight:700;cursor:pointer;">
          Print / Save as PDF
        </button>
      </body>
    </html>
  `);
  w.document.close();

  setTimeout(() => {
    try {
      w.print();
    } catch {}
  }, 300);
}

/* ===============================
   AUTO LOAD
================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await loadUserTests();
  const userId = await ensureUserId();
  if (userId) loadAllDiagnoses(userId);
});

