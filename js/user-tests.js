/* =========================================================
   USER TESTS MODULE
   - Load tests list
   - View test details
   - Start test session
   - Render test questions
========================================================= */

if (!window.ADMIN_ENV || !ADMIN_ENV.API_BASE_URL) {
  console.error("ADMIN_ENV.API_BASE_URL is not defined");
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

    const data = await res.json();
    const tests = Array.isArray(data) ? data : data.tests || [];

    if (tests.length === 0) {
      statusEl.textContent = "No tests available.";
      return;
    }

    statusEl.textContent = "";

    tests.forEach(test => {
      const card = document.createElement("div");
      card.className = "test-card";

      card.innerHTML = `
        <h3>${test.title || test.name || "Untitled Test"}</h3>

        <div class="test-meta">
          <div><strong>Category:</strong> ${test.category || "General"}</div>
          <div><strong>Questions:</strong> ${test.questionCount || "-"}</div>
        </div>

        <p>${test.description || ""}</p>

        <div class="test-actions">
          <button class="btn-view">View</button>
          <button class="btn-start">Start Test</button>
        </div>
      `;

      card.querySelector(".btn-view")
        .addEventListener("click", () => viewTest(test.id));

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
   VIEW TEST DETAILS
================================ */
async function viewTest(testId) {
  try {
    const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests/${testId}`);
    if (!res.ok) throw new Error("Failed to load test");

    const questions = await res.json();
    if (!Array.isArray(questions) || questions.length === 0) {
      alert("No questions found for this test.");
      return;
    }

    alert(
      `TEST DETAILS\n\n` +
      `Title: ${questions[0].name}\n` +
      `Description: ${questions[0].description}\n` +
      `Questions: ${questions.length}`
    );

  } catch (err) {
    console.error(err);
    alert("Failed to load test details.");
  }
}

/* ===============================
   START TEST FLOW
================================ */
async function startTest(testId) {
  try {
    // 1️⃣ Validate Cognito session
    const sessionInfo = await CognitoAuth.getCurrentSession();
    if (!sessionInfo || !sessionInfo.session || !sessionInfo.session.isValid()) {
      alert("You must be logged in to start a test.");
      return;
    }

    const payload = sessionInfo.session.getIdToken().payload;
    const userId = payload.sub;

    // 2️⃣ Start backend session
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
      console.error("SESSION ERROR:", txt);
      throw new Error("Failed to start session");
    }

    console.log("Session started");

    // 3️⃣ Load test questions
    const testRes = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests/${testId}`);
    if (!testRes.ok) throw new Error("Failed to load test content");

    const questions = await testRes.json();
    if (!Array.isArray(questions) || questions.length === 0) {
      alert("No questions available.");
      return;
    }

    // 4️⃣ Build frontend test object
    const test = {
      id: testId,
      title: questions[0].name,
      description: questions[0].description,
      questions
    };

    renderTest(test);

  } catch (err) {
    console.error(err);
    alert(err.message || "Error starting test");
  }
}

/* ===============================
   RENDER TEST QUESTIONS
================================ */
function renderTest(test) {
  const section = document.getElementById("tests");
  if (!section) return;

  section.classList.add("active");
  section.innerHTML = `
    <div class="results-header">
      <h2>${test.title}</h2>
      <p>${test.description || ""}</p>
    </div>

    <form id="testForm">
      <div id="questionsContainer"></div>
      <button type="submit" class="btn-start">
        Submit Test
      </button>
    </form>
  `;

  const qContainer = document.getElementById("questionsContainer");

  test.questions.forEach((q, index) => {
    const block = document.createElement("div");
    block.className = "question-block";

    const optionsHtml = Object.entries(q.choices)
      .map(([key, value]) => `
        <label style="display:block;margin:6px 0;">
          <input type="radio" name="q_${q.id}" value="${key}" required>
          ${value}
        </label>
      `)
      .join("");

    block.innerHTML = `
      <h4>${index + 1}. ${q.question}</h4>
      ${optionsHtml}
    `;

    qContainer.appendChild(block);
  });

  document.getElementById("testForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Submit API will be wired next.");
  });
}

/* ===============================
   AUTO LOAD
================================ */
document.addEventListener("DOMContentLoaded", loadUserTests);
