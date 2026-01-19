// ====================================================================
//  ADMIN API CLIENT
//  This file provides helper functions for making authenticated requests
//  to the AWS API Gateway endpoint defined in admin-config.js.
// ====================================================================

/**
 * Makes an authenticated GET request to the admin API.
 * It automatically retrieves the Cognito JWT and includes it in the Authorization header.
 * @param {string} path - The API endpoint path (e.g., "/users").
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws {Error} - If not authenticated or if the API returns an error status.
 */
async function adminApiGet(path) {
  const sessionInfo = await CognitoAuth.getCurrentSession();

  if (!sessionInfo || !sessionInfo.session) {
    throw new Error("Not authenticated");
  }

  const jwt = sessionInfo.session
    .getIdToken()
    .getJwtToken();

  const response = await fetch(
    `${ADMIN_ENV.API_BASE_URL}${path}`,
    {
      method: "GET",
      headers: {
        Authorization: jwt,
        "Content-Type": "application/json"
      }
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
}
/**
 * Makes an unauthenticated POST request to the admin API.
 * NOTE: This function does not currently include the JWT token, which may be a security oversight
 * if the endpoint requires authentication. It is primarily used for data submission.
 * @param {string} path - The API endpoint path (e.g., "/questions").
 * @param {object} body - The data payload to send as JSON.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws {Error} - If the API returns an error status.
 */
async function adminApiPost(path, body) {
  const response = await fetch(`${ADMIN_ENV.API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "POST failed");
  }

  return response.json().catch(() => ({}));
}
