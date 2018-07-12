import mime from 'mime';

const formats = [
  [/\.(mp4|m4v|webm|flv|f4v|ogv)$/i, 'video'],
  [/\.(mp3|m4a|aac|wav|flac|ogg|opus)$/i, 'audio'],
  [/\.(html|htm|xml|pdf|odf|doc|docx|md|markdown|txt|epub|org)$/i, 'document'],
  [/\.(stl|obj|fbx|gcode)$/i, '3D-file'],
];

export default function getMediaType(contentType, fileName) {
  const extName = mime.getExtension(contentType);
  const fileExt = extName ? `.${extName}` : null;
  const testString = fileName || fileExt;

  // Get mediaType from file extension
  if (testString) {
    const res = formats.reduce((ret, testpair) => {
      const [regex, mediaType] = testpair;

      return regex.test(ret) ? mediaType : ret;
    }, testString);

    if (res !== testString) return res;
  }

  // Get mediaType from contentType
  if (contentType) {
    return /^[^/]+/.exec(contentType)[0];
  }

  return 'unknown';
}
