import test from 'tape';
// import sync from '../sync.js';
import { generateSalt, generateSaltSeed, deriveSecrets, walletHmac } from './sync.js';
export default function doTest () {

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
    const expectedLbryIdPassword = 'HKo/J+x4Hsy2NkMvj2JB9RI0yrvEiB4QSA/NHPaT/cA=';
    let result;

    function cb(e, r) {
      console.log('result', r)
      assert.equal(r.keys.hmacKey, expectedHmacKey, 'hmac is expected value');
      assert.equal(r.keys.lbryIdPassword, expectedLbryIdPassword, 'lbryid password is expected value');
      assert.end();
    }

    deriveSecrets('pass', email, seed, cb);
  });

  test('CreateHmac', (assert) => {
    const hmacKey = 'bCxUIryLK0Lf9nKg9yiZDlGleMuGJkadLzTje1PAI+8=';
    const sequence = 1;
    const walletState = `zo4MTkyOjE2OjE68QlIU76+W91/v/F1tu8h+kGB0Ee`;
    const expectedHmacHex = '52edbad5b0f9d8cf6189795702790cc2cb92060be24672913ab3e4b69c03698b';

    const input_str = `${sequence}:${walletState}`;
    const hmacHex = walletHmac(input_str);
    assert.equal(hmacHex, expectedHmacHex);
    assert.end();

  });
}

doTest()
