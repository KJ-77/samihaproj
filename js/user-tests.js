/* =========================================================
   USER TESTS MODULE – FULL WORKING FLOW
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
        <h3>${test.name || "Untitled Test"}</h3>
        <p>${test.description || ""}</p>

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
    const sessionInfo = await CognitoAuth.getCurrentSession();
    if (!sessionInfo || !sessionInfo.session || !sessionInfo.session.isValid()) {
      alert("Please login again.");
      return;
    }

    const payload = sessionInfo.session.getIdToken().payload;
    CURRENT_USER_ID = payload.sub;
    CURRENT_TEST_ID = testId;

    // 1️⃣ Create backend session
    const sessionRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: CURRENT_USER_ID,
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
      throw new Error("Session ID not returned from backend");
    }

    // 2️⃣ Load questions
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

  section.innerHTML = `
    <div class="results-header">
      <h2>${questions[0]?.name || "Test"}</h2>
      <p>${questions[0]?.description || ""}</p>
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

    block.innerHTML = `
      <h4>${index + 1}. ${q.question}</h4>

      ${Object.entries(q.choices).map(([key, text]) => `
        <label style="display:block;margin:6px 0;">
          <input
            type="radio"
            name="question_${q.id}"
            value="${key}"
            data-text="${text}">
          ${key.toUpperCase()}. ${text}
        </label>
      `).join("")}
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

    // 2️⃣ Load diagnosis created by backend
    await loadLatestDiagnosis(CURRENT_USER_ID);

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
    const res = await fetch(
      `${ADMIN_ENV.API_BASE_URL}/diagnoses/${userId}`
    );

    if (!res.ok) throw new Error("Failed to load diagnoses");

    const data = await res.json();

    if (
      !data.diagnoses ||
      !Array.isArray(data.diagnoses) ||
      data.diagnoses.length === 0
    ) {
      showDiagnosisResult("No diagnosis available");
      return;
    }

    const latest = data.diagnoses[0];

    showDiagnosisResult(
      latest.diagnosis_text,
      latest.test_name,
      latest.test_completed_at
    );

  } catch (err) {
    console.error(err);
    showDiagnosisResult("No diagnosis available");
  }
}

/* ===============================
   DISPLAY RESULT
================================ */
function showDiagnosisResult(text, testName = "", completedAt = "") {
  const section = document.getElementById("tests");

  const dateStr = completedAt
    ? new Date(completedAt).toLocaleString()
    : "";

  section.innerHTML = `
    <div class="results-header">
      <h2>Your Result</h2>
      <p>Based on your most recent test</p>
    </div>

    <div class="test-result-card" style="margin-top:20px;">
      <h3>${testName || "Diagnosis"}</h3>

      <p style="font-size:1.1rem;margin-top:10px;">
        <strong>${text}</strong>
      </p>

      ${dateStr ? `
        <p style="color:#777;margin-top:8px;">
          Completed on ${dateStr}
        </p>` : ""}
    </div>
  `;
}

/* ===============================
   AUTO LOAD
================================ */
document.addEventListener("DOMContentLoaded", loadUserTests);
