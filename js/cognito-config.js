// ===============================
//  Cognito Configuration
// ===============================
const COGNITO_CONFIG = {
  UserPoolId: 'me-central-1_LOdxvPm2z',
  ClientId: '3202mcqviakvekej1323avsvh',  // NEW CLIENT ID
  Region: 'me-central-1'
};

let userPool = null;

// Initialize user pool safely
function initUserPool() {
  if (!userPool && window.AmazonCognitoIdentity) {
    userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: COGNITO_CONFIG.UserPoolId,
      ClientId: COGNITO_CONFIG.ClientId
    });
  }
}

document.addEventListener("DOMContentLoaded", initUserPool);


// ===============================
//  SIGN UP
// ===============================
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
function getCurrentUser() {
  initUserPool();
  return userPool ? userPool.getCurrentUser() : null;
}

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
function cognitoSignOut() {
  const user = getCurrentUser();
  if (user) user.signOut();
  localStorage.removeItem("cognitoUser");
}


// ===============================
//  Public API
// ===============================
window.CognitoAuth = {
  cognitoSignUp,
  cognitoSignIn,
  getCurrentUser,
  getCurrentSession,
  getUserAttributes,
  refreshCognitoSession,
  cognitoSignOut
};
