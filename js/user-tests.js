/* =========================================================
   USER TESTS MODULE
   - Loads available tests from backend
   - Displays them in User Dashboard > Tests section
   - Provides placeholders for future test flow
   ========================================================= */

/* ===============================
   CONFIG CHECK
================================ */
if (typeof ADMIN_ENV === "undefined" || !ADMIN_ENV.API_BASE_URL) {
    console.error("ADMIN_ENV.API_BASE_URL is not defined.");
  }
  
  /* ===============================
     LOAD TESTS LIST
  ================================ */
  async function loadUserTests() {
    const listEl = document.getElementById("testsList");
    const statusEl = document.getElementById("testsStatus");
  
    if (!listEl || !statusEl) {
      console.warn("Tests container not found in DOM.");
      return;
    }
  
    // Reset UI
    statusEl.textContent = "Loading tests...";
    listEl.innerHTML = "";
  
    try {
      const response = await fetch(`${ADMIN_ENV.API_BASE_URL}/tests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Failed to load tests");
      }
  
      const data = await response.json();
      const tests = Array.isArray(data) ? data : data.tests || [];
  
      if (tests.length === 0) {
        statusEl.textContent = "No tests available at the moment.";
        return;
      }
  
      statusEl.textContent = "";
  
      tests.forEach(test => {
        const card = document.createElement("div");
        card.className = "test-card";
  
        card.innerHTML = `
          <h3 class="test-title">
            ${test.title || "Untitled Test"}
          </h3>
  
          <div class="test-meta">
            <div><strong>Category:</strong> ${test.category || "General"}</div>
            <div><strong>Questions:</strong> ${test.questionCount || "-"}</div>
          </div>
  
          <p class="test-description">
            ${test.description || "This test helps assess your personality or skills."}
          </p>
  
          <div class="test-actions">
            <button class="btn-view" onclick="viewTest('${test.id}')">
              View
            </button>
            <button class="btn-start" onclick="startTest('${test.id}')">
              Start Test
            </button>
          </div>
        `;
  
        listEl.appendChild(card);
      });
  
    } catch (err) {
      console.error("Error loading tests:", err);
      statusEl.textContent = "Failed to load tests. Please try again later.";
    }
  }
  
  /* ===============================
     STEP 4 PLACEHOLDERS
     (WILL BE REPLACED LATER)
  ================================ */
  
  /**
   * View test details (future: show description, rules, preview)
   */
  function viewTest(testId) {
    alert(
      "Test details view will be added next.\n\n" +
      "Test ID:\n" + testId
    );
  }
  
  /**
   * Start test flow
   * (future: load questions, save answers, calculate result)
   */
  function startTest(testId) {
    alert(
      "Test flow not implemented yet.\n\n" +
      "This is where:\n" +
      "- Questions API will be called\n" +
      "- Answers will be recorded\n" +
      "- Result will be calculated\n\n" +
      "Test ID:\n" + testId
    );
  }
  
  /* ===============================
     AUTO LOAD ON DASHBOARD READY
  ================================ */
  document.addEventListener("DOMContentLoaded", () => {
    loadUserTests();
  });
  