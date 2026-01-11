/* =========================================================
   USER TESTS MODULE – FULL WORKING FLOW (FIXED + ENHANCED)
   ✅ Load tests list
   ✅ Start session
   ✅ Load questions
   ✅ Submit answers
   ✅ Fetch latest diagnosis (with description)
   ✅ Show previous diagnoses history
   ✅ Download PDF (Print-to-PDF)
   ✅ CTAs: Book session + Ask Samiha
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

/* ===============================
   HELPERS
================================ */
function safeText(v) {
  return (v === null || v === undefined) ? "" : String(v);
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

function escapeHtml(str) {
  return safeText(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function ensureUserId() {
  try {
    const sessionInfo = await CognitoAuth.getCurrentSession();
    if (!sessionInfo || !sessionInfo.session || !sessionInfo.session.isValid()) {
      CURRENT_USER_ID = null;
      return null;
    }
    CURRENT_USER_ID = sessionInfo.session.getIdToken().payload.sub;
    return CURRENT_USER_ID;
  } catch (e) {
    console.error("ensureUserId error:", e);
    CURRENT_USER_ID = null;
    return null;
  }
}

/* ===============================
   ENSURE HISTORY UI EXISTS
   (creates containers if you forgot to add them in HTML)
================================ */
function ensureHistoryContainers() {
  const testsSection = document.getElementById("tests");
  if (!testsSection) return;

  let wrap = document.getElementById("previousDiagnosesWrap");
  let list = document.getElementById("previousDiagnosesList");

  if (wrap && list) return;

  // Try to insert after testsList if exists
  const testsList = document.getElementById("testsList");

  wrap = document.createElement("div");
  wrap.id = "previousDiagnosesWrap";
  wrap.style.cssText = "margin-top:30px;display:none;";

  wrap.innerHTML = `
    <div class="results-header">
      <h2>Your Test Results</h2>
      <p>History of your completed personality tests</p>
    </div>

    <div id="previousDiagnosesList"
         style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
    </div>
  `;

  list = wrap.querySelector("#previousDiagnosesList");

  if (testsList && testsList.parentNode) {
    testsList.parentNode.insertBefore(wrap, testsList.nextSibling);
  } else {
    testsSection.appendChild(wrap);
  }
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
    if (!res.ok) throw new Error("Failed to load tests");

    const tests = await res.json();

    if (!Array.isArray(tests) || tests.length === 0) {
      statusEl.textContent = "No tests available.";
      return;
    }

    statusEl.textContent = "";

    tests.forEach(test => {
      const card = document.createElement("div");
      card.className = "test-card";

      card.innerHTML = `
        <h3>${escapeHtml(test.name || "Untitled Test")}</h3>
        <p>${escapeHtml(test.description || "")}</p>

        <div class="test-actions">
          <button class="btn-start">Start Test</button>
        </div>
      `;

      card.querySelector(".btn-start")
        .addEventListener("click", () => startTest(test.id));

      listEl.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error loading tests.";
  }
}

/* ===============================
   START TEST
================================ */
async function startTest(testId) {
  try {
    const userId = await ensureUserId();
    if (!userId) {
      alert("Please login again.");
      return;
    }

    CURRENT_TEST_ID = testId;

    // 1) Create backend session
    const sessionRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        test_id: testId
      })
    });

    if (!sessionRes.ok) {
      const txt = await sessionRes.text();
      throw new Error(txt || "Failed to start session");
    }

    const sessionData = await sessionRes.json();
    CURRENT_SESSION_ID =
      sessionData.id ||
      sessionData.session_id ||
      sessionData.session?.id;

    if (!CURRENT_SESSION_ID) {
      console.error("Session response:", sessionData);
      throw new Error("Session ID not returned from backend");
    }

    // 2) Load questions
    const testRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests/${testId}`);
    if (!testRes.ok) throw new Error("Failed to load test questions");

    CURRENT_QUESTIONS = await testRes.json();
    if (!Array.isArray(CURRENT_QUESTIONS)) {
      throw new Error("Invalid questions format");
    }

    renderTestQuestions(CURRENT_QUESTIONS);

  } catch (err) {
    console.error(err);
    alert(err.message || "Error starting test");
  }
}

/* ===============================
   RENDER QUESTIONS
================================ */
function renderTestQuestions(questions) {
  const section = document.getElementById("tests");
  if (!section) return;

  section.innerHTML = `
    <div class="results-header">
      <h2>${escapeHtml(questions[0]?.name || "Test")}</h2>
      <p>${escapeHtml(questions[0]?.description || "")}</p>
    </div>

    <form id="testForm">
      <div id="questionsContainer"></div>

      <button type="submit" class="btn-start" style="margin-top:20px;">
        Submit Test
      </button>
    </form>
  `;

  const container = document.getElementById("questionsContainer");

  questions.forEach((q, index) => {
    const block = document.createElement("div");
    block.className = "question-block";

    const choicesHtml = Object.entries(q.choices || {})
      .map(([key, text]) => `
        <label style="display:block;margin:6px 0;">
          <input
            type="radio"
            name="question_${q.id}"
            value="${escapeHtml(key)}"
            data-text="${escapeHtml(text)}">
          ${escapeHtml(String(key).toUpperCase())}. ${escapeHtml(text)}
        </label>
      `).join("");

    block.innerHTML = `
      <h4>${index + 1}. ${escapeHtml(q.question || "")}</h4>
      ${choicesHtml}
    `;

    container.appendChild(block);
  });

  document
    .getElementById("testForm")
    .addEventListener("submit", submitTest);
}

/* ===============================
   SUBMIT TEST
================================ */
async function submitTest(e) {
  e.preventDefault();

  if (!CURRENT_SESSION_ID) {
    alert("Session expired. Please restart the test.");
    return;
  }

  const answers = {};

  CURRENT_QUESTIONS.forEach(q => {
    const selected = document.querySelector(
      `input[name="question_${q.id}"]:checked`
    );

    if (selected) {
      answers[q.id] = {
        index: selected.value,
        text: selected.dataset.text,
        question: q.question
      };
    }
  });

  if (Object.keys(answers).length !== CURRENT_QUESTIONS.length) {
    alert("Please answer all questions.");
    return;
  }

  try {
    const submitRes = await fetch(
      `${ADMIN_ENV.API_BASE_URL}/sessions/${CURRENT_SESSION_ID}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      }
    );

    if (!submitRes.ok) {
      const txt = await submitRes.text();
      throw new Error(txt || "Submit failed");
    }

    // After submit: show latest diagnosis + refresh history
    const userId = CURRENT_USER_ID || await ensureUserId();
    if (!userId) {
      alert("Logged in session missing. Please login again.");
      return;
    }

    await loadLatestDiagnosis(userId);
    await loadAllDiagnoses(userId);

  } catch (err) {
    console.error(err);
    alert(err.message || "Error submitting test");
  }
}

/* ===============================
   LOAD LATEST DIAGNOSIS
================================ */
async function loadLatestDiagnosis(userId) {
  try {
    const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/diagnoses/${userId}`);
    if (!res.ok) throw new Error("Failed to load diagnoses");

    const data = await res.json();

    if (!data.diagnoses || !Array.isArray(data.diagnoses) || data.diagnoses.length === 0) {
      showDiagnosisResult({
        diagnosis_text: "No diagnosis available",
        description: "",
        test_name: "",
        test_completed_at: ""
      });
      return;
    }

    // Backend returns newest first (based on your examples)
    const latest = data.diagnoses[0];

    showDiagnosisResult({
      diagnosis_text: latest.diagnosis_text,
      description: latest.description,
      test_name: latest.test_name,
      test_completed_at: latest.test_completed_at
    });

  } catch (err) {
    console.error(err);
    showDiagnosisResult({
      diagnosis_text: "No diagnosis available",
      description: "",
      test_name: "",
      test_completed_at: ""
    });
  }
}

/* ===============================
   DISPLAY LATEST RESULT (WITH DESCRIPTION)
================================ */
function showDiagnosisResult(latestObj) {
  const section = document.getElementById("tests");
  if (!section) return;

  const text = safeText(latestObj?.diagnosis_text);
  const description = safeText(latestObj?.description);
  const testName = safeText(latestObj?.test_name);
  const completedAt = safeText(latestObj?.test_completed_at);

  const dateStr = formatDateTime(completedAt);
  const formattedDescription = description
    ? escapeHtml(description).replace(/\n/g, "<br>")
    : "";

  section.innerHTML = `
    <div class="results-header">
      <h2>Your Result</h2>
      <p>Based on your most recent test</p>
    </div>

    <div class="test-result-card" style="margin-top:20px;">
      <h3>${escapeHtml(testName || "Diagnosis")}</h3>

      <p style="font-size:1.15rem;margin-top:10px;">
        <strong>${escapeHtml(text)}</strong>
      </p>

      ${formattedDescription ? `
        <div style="
          margin-top:14px;
          padding:16px;
          background:#faf7f3;
          border-left:4px solid #8B7355;
          border-radius:8px;
          color:#333;
          line-height:1.8;
          white-space:normal;
        ">
          ${formattedDescription}
        </div>
      ` : ""}

      ${dateStr ? `
        <p style="color:#777;margin-top:12px;">
          Completed on ${escapeHtml(dateStr)}
        </p>
      ` : ""}

      <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn-start"
                type="button"
                onclick="openPrintPdfForLatest()"
                style="padding:10px 14px;border-radius:10px;">
          Download PDF
        </button>

        <a href="https://wa.me/96103960540"
           target="_blank"
           style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;background:#8B7355;color:#fff;padding:10px 14px;border-radius:10px;font-weight:600;">
          📅 Book a session with Samiha
        </a>
  <a href="#"
          onclick="
            document.querySelector('.nav-item[data-section=&quot;questions&quot;]')?.click();
          "
          style="color:#555;text-decoration:underline;">
         ❓ Ask Samiha
       </a>
      </div>
    </div>
  `;

  // store latest for PDF printing
  window.__LATEST_DIAGNOSIS__ = {
    diagnosis_text: text,
    description,
    test_name: testName,
    test_completed_at: completedAt
  };
}

/* ===============================
   PREVIOUS DIAGNOSES HISTORY
================================ */
async function loadAllDiagnoses(userId) {
  ensureHistoryContainers();

  const wrap = document.getElementById("previousDiagnosesWrap");
  const list = document.getElementById("previousDiagnosesList");

  if (!wrap || !list) return;

  list.innerHTML = "";
  wrap.style.display = "block";

  try {
    const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/diagnoses/${userId}`);
    if (!res.ok) throw new Error("Failed to load diagnoses");

    const data = await res.json();
    const diagnoses = Array.isArray(data.diagnoses) ? data.diagnoses : [];

    if (diagnoses.length === 0) {
      list.innerHTML = "<p style='color:#666;'>No completed tests yet.</p>";
      return;
    }

    diagnoses.forEach(d => {
      const card = document.createElement("div");
      card.style.cssText = `
        background:#fff;
        border-radius:10px;
        padding:16px;
        box-shadow:0 2px 10px rgba(0,0,0,0.08);
        display:flex;
        flex-direction:column;
        gap:10px;
      `;

      const dateStr = formatDate(d.test_completed_at);

      card.innerHTML = `
        <h4 style="margin:0;color:#8B7355;">${escapeHtml(d.test_name || "Test")}</h4>

        <p style="margin:0;font-weight:600;">
          ${escapeHtml(d.diagnosis_text || "")}
        </p>

        <p style="margin:0;color:#777;font-size:0.85rem;">
          Completed on ${escapeHtml(dateStr)}
        </p>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
          <button type="button"
                  onclick='viewDiagnosisDetails(${JSON.stringify(d).replaceAll("'", "\\'")})'
                  style="padding:8px 12px;border-radius:8px;border:1px solid #ddd;background:#faf7f3;cursor:pointer;">
            View Details
          </button>

          <button type="button"
                  onclick='downloadDiagnosisPDF(${JSON.stringify(d).replaceAll("'", "\\'")})'
                  style="padding:8px 12px;border-radius:8px;border:none;background:#8B7355;color:#fff;cursor:pointer;">
            Download PDF
          </button>
        </div>

        <div style="margin-top:8px;border-top:1px dashed #eee;padding-top:8px;">
          <a href="https://wa.me/96103960540" target="_blank"
             style="display:inline-block;margin-right:10px;color:#8B7355;font-weight:600;text-decoration:none;">
            📅 Book a Session
          </a>

          <a href="user-dashboard.html?section=questions">❓ Ask Samiha</a>

        </div>
      `;

      list.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p style='color:red;'>Failed to load results.</p>";
  }
}

/* ===============================
   DETAILS MODAL (CREATED ON THE FLY)
================================ */
function viewDiagnosisDetails(d) {
  // d is the full diagnosis object
  const overlayId = "diagnosisDetailsOverlay";
  const existing = document.getElementById(overlayId);
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.cssText = `
    position:fixed; inset:0;
    background:rgba(0,0,0,0.55);
    display:flex; align-items:center; justify-content:center;
    z-index:9999;
    padding:16px;
  `;

  const card = document.createElement("div");
  card.style.cssText = `
    width:min(820px, 100%);
    background:#fff;
    border-radius:14px;
    padding:16px 16px 14px;
    box-shadow:0 10px 30px rgba(0,0,0,0.18);
  `;

  const desc = safeText(d.description);
  const descHtml = desc ? escapeHtml(desc).replace(/\n/g, "<br>") : "No description available.";

  card.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
      <h2 style="margin:0;color:#8B7355;">${escapeHtml(d.test_name || "Test Result")}</h2>
      <button type="button" id="closeDiagnosisDetailsBtn"
              style="border:none;background:transparent;font-size:20px;cursor:pointer;padding:6px 10px;border-radius:10px;">
        ✕
      </button>
    </div>

    <p style="margin:10px 0 6px;font-weight:700;">${escapeHtml(d.diagnosis_text || "")}</p>
    <p style="margin:0 0 12px;color:#777;">Completed on ${escapeHtml(formatDateTime(d.test_completed_at))}</p>

    <div style="
      margin-top:12px;
      padding:14px;
      background:#faf7f3;
      border-left:4px solid #8B7355;
      border-radius:10px;
      color:#333;
      line-height:1.8;
    ">
      ${descHtml}
    </div>

    <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;">
      <button type="button"
              onclick='downloadDiagnosisPDF(${JSON.stringify(d).replaceAll("'", "\\'")})'
              style="padding:10px 14px;border-radius:10px;border:none;background:#8B7355;color:#fff;cursor:pointer;font-weight:700;">
        Download PDF
      </button>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  card.querySelector("#closeDiagnosisDetailsBtn").addEventListener("click", close);
}

/* ===============================
   DOWNLOAD PDF (PRINT-TO-PDF)
   - Opens a printable page
   - User saves as PDF from browser print dialog
================================ */
function openPrintWindowForDiagnosis(d) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Please allow popups to download PDF.");
    return;
  }

  const title = safeText(d.test_name || "Diagnosis");
  const diag = safeText(d.diagnosis_text || "");
  const when = formatDateTime(d.test_completed_at || d.created_at || "");
  const desc = safeText(d.description || "");

  w.document.open();
  w.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>${escapeHtml(title)} - PDF</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color:#222; }
          h1 { margin:0 0 8px; }
          .meta { color:#666; margin-bottom:16px; }
          .box { background:#faf7f3; border-left:4px solid #8B7355; padding:14px; border-radius:10px; line-height:1.8; white-space:pre-wrap; }
          .label { font-weight:700; margin-top:14px; }
          @media print { button { display:none; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <div class="meta">Completed on: ${escapeHtml(when)}</div>

        <div class="label">Diagnosis:</div>
        <div class="box">${escapeHtml(diag)}</div>

        <div class="label">Description:</div>
        <div class="box">${escapeHtml(desc || "No description available.")}</div>

        <p style="margin-top:18px;color:#666;">
          Tip: In the print dialog, choose <b>Save as PDF</b>.
        </p>

        <button onclick="window.print()" style="padding:10px 14px;border:none;border-radius:10px;background:#8B7355;color:#fff;font-weight:700;cursor:pointer;">
          Print / Save as PDF
        </button>
      </body>
    </html>
  `);
  w.document.close();

  // Auto-open print dialog (some browsers may block it; user can click the button)
  setTimeout(() => {
    try { w.print(); } catch {}
  }, 350);
}

function downloadDiagnosisPDF(d) {
  openPrintWindowForDiagnosis(d);
}

function openPrintPdfForLatest() {
  const d = window.__LATEST_DIAGNOSIS__;
  if (!d) {
    alert("No diagnosis to download yet.");
    return;
  }
  openPrintWindowForDiagnosis(d);
}

/* ===============================
   AUTO LOAD
================================ */
document.addEventListener("DOMContentLoaded", async () => {
  // Always load tests list
  await loadUserTests();

  // If logged in, load history immediately
  const userId = await ensureUserId();
  if (userId) {
    ensureHistoryContainers();
    await loadAllDiagnoses(userId);
  }
});

