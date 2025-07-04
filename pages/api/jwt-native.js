// Base64URL encoding
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Base64URL decoding
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

// Convert string to Uint8Array
function strToUint8Array(str) {
  return new TextEncoder().encode(str);
}

// HMAC SHA-256 signing using Web Crypto API
async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    strToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, strToUint8Array(data));
  const byteArray = new Uint8Array(signature);
  const binary = String.fromCharCode(...byteArray);
  return base64UrlEncode(binary);
}

// Encode JWT
export async function encodeJWT(payloadObj, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerStr = base64UrlEncode(JSON.stringify(header));
  const payloadStr = base64UrlEncode(JSON.stringify(payloadObj));
  const toSign = `${headerStr}.${payloadStr}`;
  const signature = await hmacSha256(secret, toSign);
  return `${toSign}.${signature}`;
}

// Decode JWT (without verifying)
export function decodeJWT(token) {
  const [headerB64, payloadB64, signature] = token.split('.');
  const header = JSON.parse(base64UrlDecode(headerB64));
  const payload = JSON.parse(base64UrlDecode(payloadB64));
  return { header, payload, signature };
}

