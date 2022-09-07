// @flow
import * as tus from 'tus-js-client';
import { v4 as uuid } from 'uuid';
import { generateError } from './publish-error';
import { makeUploadRequest } from './publish-v1';
import { makeResumableUploadRequest as makeUploadRequestV3 } from './publish-v3';

// A modified version of Lbry.apiCall that allows
// to perform calling methods at arbitrary urls
// and pass form file fields
export default function apiPublishCallViaWeb(
  apiCall: (any, any, any, any) => any,
  token: string,
  method: string,
  params: FileUploadSdkParams,
  resolve: Function,
  reject: Function
) {
  const { file_path: filePath, preview, remote_url: remoteUrl } = params;
  const isMarkdown = filePath ? typeof filePath === 'object' && filePath.type === 'text/markdown' : false;
  params.isMarkdown = isMarkdown;

  if (!filePath && !remoteUrl) {
    const { claim_id: claimId, isMarkdown, ...otherParams } = params;
    return apiCall(method, otherParams, resolve, reject);
  }

  let fileField = filePath;

  if (preview) {
    // Send dummy file for the preview. The tx-fee calculation does not depend on it.
    const dummyContent = 'x';
    fileField = new File([dummyContent], 'dummy.md', { type: 'text/markdown' });
  }

  // Putting a dummy value here, the server is going to process the POSTed file
  // and set the file_path itself
  if (fileField) {
    params.file_path = '__POST_FILE__';
  }

  // Add a random ID to serve as the redux key.
  // If it already exists, then it is a resumed session.
  if (!params.guid) {
    params.guid = uuid();
  }

  const useV1 = remoteUrl || isMarkdown || preview || !tus.isSupported;
  const makeRequest = useV1 ? makeUploadRequest : makeUploadRequestV3;

  return makeRequest(token, params, fileField, preview)
    .then((xhr) => {
      let error;

      if (preview && xhr === null) {
        return resolve(null);
      }

      if (xhr && xhr.response) {
        if (xhr.status >= 200 && xhr.status < 300 && !xhr.response.error) {
          return resolve(xhr.response.result);
        } else if (xhr.response.error) {
          error = generateError(xhr.response.error.message, params, xhr);
        } else {
          error = generateError(__('Upload likely timed out. Try a smaller file while we work on this.'), params, xhr);
        }
      }

      if (error) {
        return Promise.reject(error);
      }
    })
    .catch(reject);
}
