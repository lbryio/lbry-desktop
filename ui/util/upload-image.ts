import { IMG_CDN_PUBLISH_URL, IMG_CDN_SIZE_LIMIT_BYTES, IMG_CDN_UPLOAD_FIELDS } from "constants/cdn_urls";

// Uploads an image to Odysee's image CDN and resolves to its public URL.
// `file` is a File/Blob, or a React Native style { uri, type, name } object.
export function uploadImage(file: any): Promise<string> {
  if (file && file.size && file.size > IMG_CDN_SIZE_LIMIT_BYTES) {
    return Promise.reject(
      new Error(__("Images must be %max_size% MB or smaller.", { max_size: IMG_CDN_SIZE_LIMIT_BYTES / (1024 * 1024) }))
    );
  }

  const data = new FormData();
  data.append(IMG_CDN_UPLOAD_FIELDS.FILE, file);
  data.append(IMG_CDN_UPLOAD_FIELDS.ACTION, IMG_CDN_UPLOAD_FIELDS.ACTION_VALUE);

  return fetch(IMG_CDN_PUBLISH_URL, { method: "POST", body: data })
    .then((response) => response.text())
    .then((text) => {
      let json;
      try {
        json = JSON.parse(text);
      } catch (e: any) {
        // Rejections come back as plain text.
        throw new Error(text || __("The image upload service sent an empty response."));
      }

      if (json.type !== "success" || !json.message) {
        throw new Error(
          json.message || __("There was an error in the upload. The format or extension might not be supported.")
        );
      }

      return json.message;
    });
}
