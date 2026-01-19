// ====================================================================
//  AWS COGNITO CONFIGURATION AND AUTHENTICATION LOGIC
//  This file handles all client-side interactions with the AWS Cognito
//  User Pool for user sign-up, sign-in, session management, and sign-out.
// ====================================================================

// --- 1. CONFIGURATION CONSTANTS ---
// These values link the application to the specific Cognito User Pool.
// NOTE: The Region is crucial for the AWS SDK to know where to look.
// ===============================
//  Cognito Configuration
// ===============================
const COGNITO_CONFIG = {
  UserPoolId: 'me-central-1_LOdxvPm2z',
  ClientId: '3202mcqviakvekej1323avsvh',  // NEW CLIENT ID
  Region: 'me-central-1'
};

let userPool = null;

// --- 2. INITIALIZATION ---
// Initializes the Cognito User Pool object using the global AmazonCognitoIdentity library.
function initUserPool() {
  if (!userPool && window.AmazonCognitoIdentity) {
    userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: COGNITO_CONFIG.UserPoolId,
      ClientId: COGNITO_CONFIG.ClientId
    });
  }
}

// Ensure the user pool is initialized once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initUserPool);


// ===============================
//  SIGN UP
// ===============================
// Registers a new user with Cognito.
// @param {string} name - The user's full name.
// @param {string} email - The user's email (used as username).
// @param {string} password - The user's chosen password.
// @returns {Promise<object>} - Resolves with the Cognito result object.
function cognitoSignUp(name, email, password) {
  return new Promise((resolve, reject) => {
    initUserPool();
    if (!userPool) return reject(new Error("User pool not initialized"));

    const attrs = [
      new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: name }),
      new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })
    ];

    userPool.signUp(email, password, attrs, null, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}


// ===============================
//  SIGN IN + USER DETAILS STORAGE
// ===============================
// Authenticates a user and stores their basic details (name, email) in localStorage.
// @param {string} email - The user's email.
// @param {string} password - The user's password.
// @returns {Promise<object>} - Resolves with the Cognito user and session objects.
function cognitoSignIn(email, password) {
  return new Promise((resolve, reject) => {
    initUserPool();

    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: session => {
        
        // Load user attributes after login
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) return resolve({ user: cognitoUser, session });

          let name = "";
          let mail = "";

          attributes.forEach(a => {
            if (a.getName() === "email") mail = a.getValue();
            if (a.getName() === "name") name = a.getValue();
          });

          if (!name) name = mail.split("@")[0];

          // Store user info for dashboards
          localStorage.setItem(
            "cognitoUser",
            JSON.stringify({ name, email: mail })
          );

          resolve({ user: cognitoUser, session });
        });
      },

      onFailure: err => reject(err)
    });
  });
}


// ===============================
//  GET CURRENT USER + ATTRIBUTES
// ===============================

// Retrieves the currently logged-in Cognito user object from the user pool.
// @returns {CognitoUser|null} - The current user object or null.
function getCurrentUser() {
  initUserPool();
  return userPool ? userPool.getCurrentUser() : null;
}

// Fetches all attributes (e.g., name, email) for the current user.
// @returns {Promise<object|null>} - Resolves with an object of user attributes.
function getUserAttributes() {
  return new Promise((resolve, reject) => {
    const user = getCurrentUser();
    if (!user) return resolve(null);

    user.getUserAttributes((err, attrs) => {
      if (err) return reject(err);

      const data = {};
      attrs.forEach(a => data[a.getName()] = a.getValue());

      resolve(data);
    });
  });
}


// ===============================
//  SESSION HANDLING
// ===============================

// Retrieves the current valid session for the logged-in user.
// @returns {Promise<object|null>} - Resolves with user and session info, or null if invalid/no session.
function getCurrentSession() {
  return new Promise((resolve, reject) => {
    const user = getCurrentUser();
    if (!user) return resolve(null);

    user.getSession((err, session) => {
      if (err || !session.isValid()) return resolve(null);
      resolve({ user, session });
    });
  });
}

// Attempts to refresh the user's session using the refresh token.
function refreshCognitoSession() {
  const user = getCurrentUser();
  if (!user) return;

  user.getSession((err, session) => {
    if (err) return;

    const refreshToken = session.getRefreshToken();
    user.refreshSession(refreshToken, (err, newSession) => {
      if (err) console.error("Session refresh failed:", err);
    });
  });
}


// ===============================
//  SIGN OUT
// ===============================

// Signs out the current user and clears local storage data.
function cognitoSignOut() {
  const user = getCurrentUser();
  if (user) user.signOut();
  localStorage.removeItem("cognitoUser");
}


// ===============================
//  Public API
// ===============================

// Exposes the core authentication functions globally for use by other scripts.
window.CognitoAuth = {
  cognitoSignUp,
  cognitoSignIn,
  getCurrentUser,
  getCurrentSession,
  getUserAttributes,
  refreshCognitoSession,
  cognitoSignOut
};
