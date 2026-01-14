export default function handler(request, response) {
  response.setHeader('Content-Type', 'application/javascript');
  response.setHeader('Cache-Control', 'no-cache');
  
  const config = `
    window.FIREBASE_CONFIG = {
      apiKey: "${process.env.VITE_FIREBASE_API_KEY}",
      authDomain: "${process.env.VITE_FIREBASE_AUTH_DOMAIN}",
      databaseURL: "${process.env.VITE_FIREBASE_DATABASE_URL}",
      projectId: "${process.env.VITE_FIREBASE_PROJECT_ID}",
      storageBucket: "${process.env.VITE_FIREBASE_STORAGE_BUCKET}",
      messagingSenderId: "${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}",
      appId: "${process.env.VITE_FIREBASE_APP_ID}"
    };
  `;
  
  response.status(200).send(config);
}