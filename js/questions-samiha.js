/* =========================================================
   QUESTIONS FOR SAMIHA – INDEX PAGE LOGIC
   - Login check
   - Redirect to personalized questions section in dashboard
========================================================= */

/**
 * Handles the "Ask Samiha" link from the home page.
 * Instead of opening a modal that doesn't exist, it redirects to the dashboard.
 */
async function openAskSamiha() {
  if (window.handleProtectedNav) {
    window.handleProtectedNav("custom");
  } else {
    window.location.href = "login.html";
  }
}

/* ===============================
   HIJACK CUSTOM MODAL LINKS
   (replace handleLink for custom)
================================ */
function handleLink(event, type) {
  if (event) event.preventDefault();

  if (type === "custom") {
    openAskSamiha();
    if (window.closeExpandedCard) {
      window.closeExpandedCard();
    }
    return;
  }

  // Use the main navigation logic from script.js
  if (window.handleProtectedNav) {
    window.handleProtectedNav(type);
  } else {
    console.warn("handleProtectedNav not found in script.js");
    window.location.href = "login.html";
  }
}
