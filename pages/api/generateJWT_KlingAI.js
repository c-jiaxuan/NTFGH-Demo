import jwt from 'jsonwebtoken';

function generateToken(ak, sk) {
  const now = Math.floor(Date.now() / 1000);
  console.log('now: ' + now);
  const payload = {
    iss: ak,
    nbf: now - 5,
    exp: now + 1800,
  };
  return jwt.sign(payload, sk, { algorithm: 'HS256', header: { alg: 'HS256' } });
}

export default generateToken;
