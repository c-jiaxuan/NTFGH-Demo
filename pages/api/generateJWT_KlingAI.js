// import jwt from 'jsonwebtoken';

// async function generateToken(ak, sk) {
//   try {
//     const now = Math.floor(Date.now() / 1000); // Current time in seconds
//     const payload = {
//       iss: ak,
//       nbf: now - 5,          // Not valid before 5 seconds ago
//       exp: now + 1800        // Expires in 30 minutes
//     };

//     const header = {
//       alg: 'HS256',
//       typ: 'JWT'
//     };

//     return jwt.sign(payload, sk, { header: header });
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// }

// export default generateToken;
