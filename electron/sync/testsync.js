import test from 'tape';
// import sync from '../sync.js';
import { generateSalt, generateSaltSeed, deriveSecrets, walletHmac, aesEncrypt, aesDecrypt } from './sync.js';
import crypto from 'crypto';
import fs from 'fs';
export default function doTest() {
  test('Generate sync seed', (assert) => {
    const seed = generateSaltSeed();
    console.log('seed', seed);
    assert.pass(seed.length === 64);
    assert.end();
  });

  test('Generate salt', (assert) => {
    const seed = '80b3aff252588c4097df8f79ad42c8a5cf8d7c9e5339efec8bdb8bc7c5cf25ca';
    const email = 'example@example.com';
    const salt = generateSalt(email, seed);
    console.log('salt', salt);
    const expected = 'be6074a96f3ce812ea51b95d48e4b10493e14f6a329df7c0816018c6239661fe';
    const actual = salt;

    assert.equal(actual, expected,
      'salt is expected value.');
    assert.end();
  });

  test('Derive Keys', (assert) => {
    const seed = '80b3aff252588c4097df8f79ad42c8a5cf8d7c9e5339efec8bdb8bc7c5cf25ca';
    const email = 'example@example.com';

    const expectedHmacKey = 'bCxUIryLK0Lf9nKg9yiZDlGleMuGJkadLzTje1PAI+8='; //base64
    const expectedProviderKey = 'HKo/J+x4Hsy2NkMvj2JB9RI0yrvEiB4QSA/NHPaT/cA=';
    // add expectedDataKey to test

    function cb(e, r) {
      console.log('derive keys result:', r);
      assert.equal(r.hmacKey, expectedHmacKey, 'hmac is expected value');
      assert.equal(r.providerKey, expectedProviderKey, 'lbryid password is expected value');
      assert.end();
    }

    deriveSecrets('pass', email, seed, cb);
  });

  test('CreateHmac', (assert) => {
    const hmacKey = 'bCxUIryLK0Lf9nKg9yiZDlGleMuGJkadLzTje1PAI+8=';
    const sequence = 1;
    const walletState = `zo4MTkyOjE2OjE68QlIU76+W91/v/F1tu8h+kGB0Ee`;
    const expectedHmacHex = '9fe70ebdeaf85b3afe5ae42e52f946acc54ded0350acacdded821845217839d4';

    const input_str = `${sequence}:${walletState}`;
    const hmacHex = walletHmac(input_str, hmacKey);
    assert.equal(hmacHex, expectedHmacHex);
    assert.end();
  });

  test('Encrypt/Decrypt', (assert) => {
    const key = crypto.randomBytes(32);
    // const wrongKey = crypto.randomBytes(32); // todo: what tests should fail; how much error handling needed?
    // test a handy json file
    const input = fs.readFileSync('../../package.json', 'utf8');
    const cipher = aesEncrypt(input, key);
    console.log('cipher', cipher);
    const output = aesDecrypt(cipher, key);
    assert.equal(input, output.result);
    assert.end();
  });
}

doTest();
