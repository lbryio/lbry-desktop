import mime from 'mime';

const formats = [
  [/\.(mp4|m4v|webm|flv|f4v|ogv)$/i, 'video'],
  [
    /\.(mp3|mp2|m2a|m4a|m4b|aac|aif|aiff|asf|wav|flac|ogg|oga|opus|wma|wv|wvp|spx|dff|dsf)$/i,
    'audio',
  ],
  [/\.(h|go|ja|java|js|jsx|c|cpp|cs|css|rb|scss|sh|php|py)$/i, 'script'],
  [/\.(json|csv|txt|log|md|markdown|docx|pdf|xml|yml|yaml)$/i, 'document'],
  [/\.(pdf|odf|doc|docx|epub|org|rtf)$/i, 'e-book'],
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
