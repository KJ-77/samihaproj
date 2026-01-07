/* =========================================================
   ADMIN – QUESTIONS FOR SAMIHA
   - Load all user questions
   - Display answer status
   - Reply to question
========================================================= */

if (!window.ADMIN_ENV || !ADMIN_ENV.API_BASE_URL) {
    console.error("ADMIN_ENV.API_BASE_URL is not defined");
  }
  
  /* ===============================
     LOAD QUESTIONS
  ================================ */
  async function loadAdminQuestions() {
    const statusEl = document.getElementById("questionsStatus");
    const listEl = document.getElementById("questionsList");
  
    if (!statusEl || !listEl) {
      console.warn("Questions container not found");
      return;
    }
  
    statusEl.textContent = "Loading questions...";
    listEl.innerHTML = "";
  
    try {
      const res = await fetch(`${ADMIN_ENV.API_BASE_URL}/questions-for-samiha`);
      if (!res.ok) throw new Error("Failed to load questions");
  
      const data = await res.json();
  
      // ✅ VERY IMPORTANT: normalize response
      const questions = Array.isArray(data)
        ? data
        : data.questions || [];
  
      if (questions.length === 0) {
        statusEl.textContent = "No questions yet.";
        return;
      }
  
      statusEl.textContent = "";
  
      questions.forEach(q => {
        const card = document.createElement("div");
        card.style.background = "#fff";
        card.style.padding = "16px";
        card.style.borderRadius = "8px";
        card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        card.style.marginBottom = "12px";
  
        const answered = q.answer && q.answer.trim() !== "";
  
        card.innerHTML = `
          <p style="margin:0 0 6px;"><strong>Question ID:</strong> ${q.id}</p>
          <p style="margin:0 0 6px;"><strong>User ID:</strong> ${q.user_id}</p>
  
          <p style="margin:8px 0; color:#333;">
            <strong>Question:</strong><br>
            ${q.question}
          </p>
  
          <p style="margin:6px 0;">
            <strong>Status:</strong>
            <span style="color:${answered ? 'green' : '#d17c00'};">
              ${answered ? "Answered" : "Pending"}
            </span>
          </p>
  
          ${
            answered
              ? `
                <p style="margin-top:10px;">
                  <strong>Answer:</strong><br>
                  ${q.answer}
                </p>
              `
              : `
                <textarea
                  id="reply-${q.id}"
                  placeholder="Write reply..."
                  style="width:100%;min-height:80px;padding:10px;margin-top:10px;border:1px solid #ddd;border-radius:6px;"></textarea>
  
                <button
                  style="margin-top:8px;padding:8px 14px;border:none;border-radius:6px;background:#8B7355;color:#fff;cursor:pointer;"
                  onclick="replyToQuestion(${q.id})">
                  Reply
                </button>
              `
          }
        `;
  
        listEl.appendChild(card);
      });
  
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Error loading questions.";
    }
  }
  
  /* ===============================
     REPLY TO QUESTION
  ================================ */
  async function replyToQuestion(questionId) {
    const textarea = document.getElementById(`reply-${questionId}`);
    if (!textarea) return;
  
    const answer = textarea.value.trim();
    if (!answer) {
      alert("Please write an answer first.");
      return;
    }
  
    try {
      const res = await fetch(
        `${ADMIN_ENV.API_BASE_URL}/questions-for-samiha/${questionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer })
        }
      );
  
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to submit answer");
      }
  
      alert("✅ Answer submitted successfully");
  
      // Reload list to reflect update
      loadAdminQuestions();
  
    } catch (err) {
      console.error(err);
      alert(err.message || "Error submitting answer");
    }
  }
  
  /* ===============================
     AUTO LOAD
  ================================ */
  document.addEventListener("DOMContentLoaded", loadAdminQuestions);
  