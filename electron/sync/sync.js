import crypto from 'crypto';

export function generateSalt(email, seed) {
  const hashInput = (email + ':' + seed).toString('utf8');
  const hash = crypto.createHash('sha256');
  hash.update(hashInput);
  const hash_output = hash.digest('hex').toString('utf8');
  return hash_output;
}

export function generateSaltSeed() {
  return crypto.randomBytes(32).toString('hex');
}

export function createHmac(serverWalletState, hmacKey) {

  return crypto.randomBytes(32).toString('hex');
}

export function checkHmac(serverWalletState, hmacKey, hmac) {
  return crypto.randomBytes(32).toString('hex');
}

export function deriveSecrets(rootPassword, email, saltSeed, callback) {
  const encodedPassword = Buffer.from(rootPassword.normalize('NFKC'));
  const encodedEmail = Buffer.from(email);
  const SCRYPT_N = 1 << 20;
  const SCRYPT_R = 8;
  const SCRYPT_P = 1;
  const KEY_LENGTH = 32;
  const NUM_KEYS = 3;
  const MAXMEM_MULTIPLIER = 256;
  const DEFAULT_MAXMEM = MAXMEM_MULTIPLIER * SCRYPT_N * SCRYPT_R;

  function getKeyParts(key) {
    const providerKey = key.slice(0, KEY_LENGTH).toString('base64');
    const hmacKey = key.slice(KEY_LENGTH, KEY_LENGTH * 2).toString('base64');
    const dataKey = key.slice(KEY_LENGTH * 2).toString('base64');
    return { providerKey, hmacKey, dataKey }; // Buffer aa bb cc 6c
  }

  const salt = generateSalt(encodedEmail, saltSeed);

  const scryptCallback = (err, key) => {
    if (err) {
      // handle error
    }

    callback(err, getKeyParts(key));
  };

  crypto.scrypt(encodedPassword, salt, KEY_LENGTH * NUM_KEYS, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: DEFAULT_MAXMEM }, scryptCallback);
}

export function walletHmac(inputString, hmacKey) {
  const res = crypto.createHmac('sha256', hmacKey)
    .update(inputString.toString('utf8'))
    .digest('hex');
  console.log('hmac res', res)
  return res;
}

export function aesEncrypt(text, key) {
  try {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  } catch (e) {
    return { error: `Wallet decrypt failed error: ${e.message}` };
  }
}

export function aesDecrypt(cipher, key) {
  try {
    let iv = Buffer.from(cipher.iv, 'hex');
    let encryptedText = Buffer.from(cipher.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    // handle errors here
    return { result: decrypted.toString() };
  } catch (e) {
    return { error: `Wallet decrypt failed error: ${e.message}`};
  }
}
