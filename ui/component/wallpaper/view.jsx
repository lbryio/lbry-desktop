// @flow
import React from 'react';
// import { resetColors } from 'util/theme';

type Props = {
  // uri: ?string,
  // cover: ?string,
  // avatar: ?string,
  reset: ?boolean,
};

const Wallpaper = (props: Props) => {
  // const { cover, avatar } = props;

  /*
  if (avatar) {
    toDataUrl(avatar, function (image) {
      if (image) {
        let threshold = 155;
        getAverageRGB(image, function (rgb) {
          let brightness = Math.round((parseInt(rgb.r) * 299 + parseInt(rgb.g) * 587 + parseInt(rgb.b) * 114) / 1000);
          if (colorCompare(rgb) < 15) {
            rgb = colorMixer(rgb, brightness > threshold ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 }, 0.7);
          }

          // Tune link color in light theme
          if (document.documentElement !== null) {
            if (getComputedStyle(document.documentElement).getPropertyValue('--color-text') === ' #000000') {
              let link = colorMixer(
                rgb,
                brightness > threshold ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 },
                0.8
              );
              document.documentElement !== null &&
                document.documentElement.style.setProperty(
                  '--color-link',
                  'rgba(' + link.r + ',' + link.g + ',' + link.b + ', 1)'
                );
            } else {
              document.documentElement !== null &&
                document.documentElement.style.setProperty('--color-link', 'var(--color-primary)');
            }
          }
          document.documentElement !== null &&
            document.documentElement.style.setProperty('--color-primary-dynamic', rgb.r + ',' + rgb.g + ',' + rgb.b);
          document.documentElement !== null &&
            document.documentElement.style.setProperty(
              '--color-primary-contrast',
              brightness > 155 ? 'black' : 'white'
            );

          if (document.documentElement !== null) {
            threshold =
              getComputedStyle(document.documentElement).getPropertyValue('--color-text') === ' #000000' ? 70 : 155;
          }
          let rgbs = colorMixer(rgb, brightness > threshold ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 }, 0.6);
          let brightnesss = Math.round(
            (parseInt(rgbs.r) * 299 + parseInt(rgbs.g) * 587 + parseInt(rgbs.b) * 114) / 1000
          );
          document.documentElement !== null &&
            document.documentElement.style.setProperty(
              '--color-secondary-dynamic',
              rgbs.r + ',' + rgbs.g + ',' + rgbs.b
            );
          document.documentElement !== null &&
            document.documentElement.style.setProperty(
              '--color-secondary-contrast',
              brightnesss > 155 ? 'black' : 'white'
            );
        });
      }
    });
  } else {
    resetColors(true);
  }

  function toDataUrl(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        const image = new Image();
        image.src = reader.result.toString();
        image.onload = () => callback(image);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  function getAverageRGB(img, callback) {
    const blockSize = 5;
    const defaultRGB = { r: 0, g: 0, b: 0 };
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    const rgb = { r: 0, g: 0, b: 0 };
    const rgb_gray = { r: 0, g: 0, b: 0 };
    const blackwhite = { r: 0, g: 0, b: 0 };
    let count = 0;
    let count_gray = 0;
    let count_off = 0;
    let i = -4;
    let data;
    let length;

    if (!context) {
      return defaultRGB;
    }

    const height = (canvas.height = img.naturalHeight || img.offsetHeight || img.height);
    const width = (canvas.width = img.naturalWidth || img.offsetWidth || img.width);

    context.drawImage(img, 0, 0);

    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      if (shadeCheck(data.data, i, 75)) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
      } else if (shadeCheck(data.data, i, 25)) {
        ++count_gray;
        rgb_gray.r += data.data[i];
        rgb_gray.g += data.data[i + 1];
        rgb_gray.b += data.data[i + 2];
      } else {
        ++count_off;
        blackwhite.r += data.data[i];
        blackwhite.g += data.data[i + 1];
        blackwhite.b += data.data[i + 2];
      }
    }

    if ((100 / (count + count_gray + count_off)) * count > 3) {
      rgb.r = ~~(rgb.r / count);
      rgb.g = ~~(rgb.g / count);
      rgb.b = ~~(rgb.b / count);
    } else if (count_gray > count_off) {
      rgb.r = ~~(rgb_gray.r / count_gray);
      rgb.g = ~~(rgb_gray.g / count_gray);
      rgb.b = ~~(rgb_gray.b / count_gray);
    } else {
      let shade = 255;
      if (document.documentElement !== null) {
        shade = getComputedStyle(document.documentElement).getPropertyValue('--color-text') === ' #000000' ? 0 : 255;
      }
      rgb.r = shade;
      rgb.g = shade;
      rgb.b = shade;
    }

    callback(rgb);
  }

  function shadeCheck(data, i, threshold) {
    let white = 0;
    if (data[i] > 255 - threshold) white = white + 1;
    if (data[i + 1] > 255 - threshold) white = white + 1;
    if (data[i + 2] > 255 - threshold) white = white + 1;
    let black = 0;
    if (data[i] < threshold) black = black + 1;
    if (data[i + 1] < threshold) black = black + 1;
    if (data[i + 2] < threshold) black = black + 1;

    if (white > 2 || black > 2) return false;
    else return true;
  }

  function colorChannelMixer(a, b, mix) {
    let channelA = a * mix;
    let channelB = b * (1 - mix);
    return parseInt(channelA + channelB);
  }

  function colorMixer(rgbA, rgbB, mix) {
    let r = colorChannelMixer(rgbA.r, rgbB.r, mix);
    let g = colorChannelMixer(rgbA.g, rgbB.g, mix);
    let b = colorChannelMixer(rgbA.b, rgbB.b, mix);
    return { r: r, g: g, b: b };
  }

  function colorCompare(rgb) {
    let bg = 0;
    if (document.documentElement !== null) {
      bg = getComputedStyle(document.documentElement).getPropertyValue('--color-text') === ' #000000' ? 221 : 32;
    }
    let r = Math.abs(rgb.r - bg);
    let g = Math.abs(rgb.g - bg);
    let b = Math.abs(rgb.b - bg);

    r = r / 255;
    g = g / 255;
    b = b / 255;

    return ((r + g + b) / 3) * 100;
  }
  */

  /*
  if (cover) {
    return (
      cover && (
        <>
          <div className={'background-image'} style={{ backgroundImage: 'url("' + cover + '")' }} />
          <div className={'theme'} />
        </>
      )
    );
  } else {  */
  return (
    <>
      <div
        className={'background-image'}
        style={{
          backgroundImage:
            'url("https://thumbnails.odysee.com/optimize/plain/https://cdn.lbryplayer.xyz/speech/2e9a7dc6c99f0fb9.jpg")',
        }}
      />
      <div className={'theme'} />
    </>
  );
  // }
};

export default Wallpaper;
