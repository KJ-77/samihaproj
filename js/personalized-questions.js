/* =========================================================
readuy questions
   PERSONALIZED QUESTIONS (Ready Answers)
     // Later: you can change this to “Unlock with payment”
   - GET /personalized-questions
   - Render cards
   - View Answer modal
========================================================= */

(function () {
    const DIRECT_ENDPOINT =
      "https://jej5dh7680.execute-api.me-central-1.amazonaws.com/personalized-questions";
  
    function getEndpoint() {
      // If ADMIN_ENV is defined, we use it.
      // Otherwise fallback to the full API URL you provided.
      if (window.ADMIN_ENV && ADMIN_ENV.API_BASE_URL) {
        return `${ADMIN_ENV.API_BASE_URL}/personalized-questions`;
      }
      return DIRECT_ENDPOINT;
    }
  
    function el(id) {
      return document.getElementById(id);
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
  
    function openModal(questionText, answerText, answered) {
      const modal = el("viewAnswerModal");
      const qEl = el("viewAnswerQuestionText");
      const body = el("viewAnswerBody");
      const hint = el("viewAnswerHint");
  
      qEl.textContent = questionText || "";
      body.textContent = answerText || "";
  
      if (!answered) {
        hint.textContent = "This question has not been answered yet.";
      } else {
        // Later: you can change this to “Unlock with payment”
        hint.textContent = "Tip: Payment lock can be added here later.";
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
               Answered
             </span>`
          : `<span style="display:inline-block;background:#f8f9fa;color:#666;border:1px solid #eee;padding:4px 8px;border-radius:999px;font-size:12px;">
               Pending
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
              View Answer
            </button>
  
            <span style="font-size:12px;color:#777;">
              ${answered ? "Tap to read" : "Not answered yet"}
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
  
    async function loadPersonalizedQuestions() {
      const status = el("personalizedQuestionsStatus");
      const list = el("personalizedQuestionsList");
  
      if (!status || !list) return;
  
      status.textContent = "Loading...";
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
  
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.questions)
          ? data.questions
          : [];
  
        if (!items.length) {
          status.textContent = "No questions available yet.";
          return;
        }
  
        status.textContent = "";
        renderCards(items);
      } catch (err) {
        console.error("personalized-questions load error:", err);
        status.textContent = "Failed to load questions. Check console.";
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
  
    document.addEventListener("DOMContentLoaded", () => {
      wireModal();
      wireRefresh();
      loadPersonalizedQuestions();
    });
  })();
  
