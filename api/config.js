export default function handler(request, response) {
  response.setHeader('Content-Type', 'application/javascript');
  response.setHeader('Cache-Control', 'no-cache');
  
  console.log('API config called!'); // Debug log
  
  const config = `
    window.FIREBASE_CONFIG = {
      apiKey: "${process.env.VITE_FIREBASE_API_KEY || 'MISSING'}",
      authDomain: "${process.env.VITE_FIREBASE_AUTH_DOMAIN || 'MISSING'}",
      databaseURL: "${process.env.VITE_FIREBASE_DATABASE_URL || 'MISSING'}",
      projectId: "${process.env.VITE_FIREBASE_PROJECT_ID || 'MISSING'}",
      storageBucket: "${process.env.VITE_FIREBASE_STORAGE_BUCKET || 'MISSING'}",
      messagingSenderId: "${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'MISSING'}",
      appId: "${process.env.VITE_FIREBASE_APP_ID || 'MISSING'}"
    };
    console.log('Firebase config loaded:', window.FIREBASE_CONFIG);
  `;
  
  response.status(200).send(config);
}