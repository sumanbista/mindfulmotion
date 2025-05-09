const admin = require('firebase-admin');
const serviceAccount = require('../firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received Token:', token);

  if (!token) {
    console.error('No token provided in the request headers.');
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { ...decodedToken, _id: decodedToken.uid }; // Map `uid` to `_id`
    console.log('Decoded User:', req.user);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
};

module.exports = authenticateUser;
