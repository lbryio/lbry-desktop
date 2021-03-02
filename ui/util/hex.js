// @flow

export function toHex(str: string): string {
  const array = Array.from(str);

  let result = '';

  for (var i = 0; i < array.length; i++) {
    const val = array[i];
    const utf = toUTF8Array(val)
      .map((num) => num.toString(16))
      .join('');

    result += utf;
  }

  return result;
}

// https://gist.github.com/joni/3760795
// See comment that fixes an issue in the original gist
function toUTF8Array(str: string): Array<number> {
  var utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      charcode = (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)) + 0x010000;
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }

  return utf8;
}
