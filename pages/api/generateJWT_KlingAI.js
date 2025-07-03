import jwt from 'jsonwebtoken';

const generateToken = (ak, sk) => {
  try {
    const expiresInSeconds = 1800; // 30 minutes
    const notBeforeSeconds = -5;   // 5 seconds before now

    const now = Math.floor(Date.now() / 1000); // in seconds

    const payload = {};
    const options = {
      algorithm: 'HS256',
      header: { alg: 'HS256' },
      issuer: ak,
      expiresIn: expiresInSeconds,
      notBefore: notBeforeSeconds,
    };

    const token = jwt.sign(payload, sk, options);
    return token;
  } catch (error) {
    console.error('JWT generation error:', error);
    return null;
  }
};

export default generateToken;
