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
//sub
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
