const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const initFirebase = () => {
  const apps = getApps();
  let app;
  if (apps.length > 0) {
    app = apps[0];
  } else {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'jaaamin-rox';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (projectId && clientEmail && privateKey) {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        }),
        projectId
      });
      console.log(`Firebase Admin SDK initialized successfully with service account for project: ${projectId}`);
    } else {
      // Fallback initialization with project ID for token verification
      app = initializeApp({
        projectId
      });
      console.log(`Firebase Admin SDK initialized for project ID: ${projectId}`);
    }
  }

  const authInstance = getAuth(app);

  return {
    app,
    // Support firebaseAdmin.auth().verifyIdToken()
    auth: () => authInstance,
    getAuth: () => authInstance
  };
};

const firebaseAdmin = initFirebase();

module.exports = firebaseAdmin;
