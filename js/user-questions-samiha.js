    /* =========================================================
   USER DASHBOARD - QUESTIONS FOR SAMIHA
   - GET /questions-for-samiha (all)
   - Filter by logged-in user_id (Cognito sub)
   - Show Pending/Answered
   - View Answer modal
========================================================= */

(function () {
    const DIRECT_ENDPOINT =
      "https://jej5dh7680.execute-api.me-central-1.amazonaws.com/questions-for-samiha";
  
    function getEndpoint() {
      if (window.ADMIN_ENV && ADMIN_ENV.API_BASE_URL) {
        return `${ADMIN_ENV.API_BASE_URL}/questions-for-samiha`;
      }
      return DIRECT_ENDPOINT;
    }
  
    function el(id) {
      return document.getElementById(id);
    }
  
    function openModal(questionText, answerText) {
      el("userSamihaModalQuestion").textContent = questionText || "";
      el("userSamihaModalAnswer").textContent = answerText || "";
      el("userSamihaAnswerModal").style.display = "flex";
    }
  
    function closeModal() {
      el("userSamihaAnswerModal").style.display = "none";
    }
  
    function renderCards(items) {
      const list = el("userSamihaList");
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
            <div style="font-weight:700;color:#8B7355;">#${q.id}</div>
            ${badge}
          </div>
  
          <div style="color:#333;font-size:14px;line-height:1.45;">
            ${q.question || ""}
          </div>
  
          <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;">
            <button class="user-view-answer-btn"
                    data-q="${encodeURIComponent(q.question || "")}"
                    data-a="${encodeURIComponent(q.answer || "")}"
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
  
      document.querySelectorAll(".user-view-answer-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const qText = decodeURIComponent(btn.getAttribute("data-q") || "");
          const aText = decodeURIComponent(btn.getAttribute("data-a") || "");
          openModal(qText, aText);
        });
      });
    }
  
    async function loadUserQuestions() {
      const status = el("userSamihaStatus");
      const list = el("userSamihaList");
  
      status.textContent = "Loading...";
      list.innerHTML = "";
  
      // 1) Check login
      let userId = null;
      try {
        const sessionInfo = await CognitoAuth.getCurrentSession();
        if (!sessionInfo || !sessionInfo.session || !sessionInfo.session.isValid()) {
          status.innerHTML = `
            Please login to see your questions.
            <br><br>
            <a href="login.html" style="display:inline-block;background:#8B7355;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:700;">
              Go to Login
            </a>
          `;
          return;
        }
        userId = sessionInfo.session.getIdToken().payload.sub;
      } catch (e) {
        console.error("Cognito session error:", e);
        status.textContent = "Login session error. Please login again.";
        return;
      }
  
      // 2) Fetch all questions
      try {
        const res = await fetch(getEndpoint(), {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
  
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Failed to load (HTTP ${res.status})`);
        }
  
        const data = await res.json();
        const all = Array.isArray(data) ? data : (data.questions || []);
  
        // 3) Filter by this user only
        const mine = all.filter((q) => q.user_id === userId);
  
        if (!mine.length) {
          status.textContent = "You haven’t asked any questions yet.";
          return;
        }
  
        status.textContent = "";
        renderCards(mine);
  
      } catch (err) {
        console.error("Load questions error:", err);
        status.textContent = "Failed to load questions. Check console.";
      }
    }
  
    function wireModal() {
      const modal = el("userSamihaAnswerModal");
      const closeBtn = el("closeUserSamihaAnswerModalBtn");
  
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
  
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) closeModal();
        });
      }
    }
  
    function wireRefresh() {
      const btn = el("reloadUserSamihaBtn");
      if (btn) btn.addEventListener("click", loadUserQuestions);
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      wireModal();
      wireRefresh();
      loadUserQuestions();
    });
  })();
  