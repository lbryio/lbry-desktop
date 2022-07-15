// @flow
import * as tus from 'tus-js-client';
import { COMMIT_ID } from 'config';

function generateCause(v1Type: ?string, xhr: ?any, uploader: ?TusUploader = null) {
  return {
    cause: {
      appCommitId: COMMIT_ID,
      ...(xhr ? { xhrResponseURL: xhr.responseURL } : {}),
      ...(xhr ? { xhrStatus: xhr.status } : {}),
      ...(xhr ? { xhrStatusText: xhr.statusText } : {}),
      ...(v1Type ? { type: v1Type } : {}),
      ...(uploader?._fingerprint ? { fingerprint: uploader?._fingerprint } : {}),
      ...(uploader?._retryAttempt ? { retryAttempt: uploader?._retryAttempt } : {}),
      ...(!tus.isSupported ? { isTusSupported: tus.isSupported } : {}),
    },
  };
}

export function generateError(
  errMsg: string,
  params: FileUploadSdkParams,
  xhr: ?any,
  tusUploader: ?TusUploader = null
) {
  const { preview: isPreview, remote_url: remoteUrl, isMarkdown } = params;
  const useV1 = remoteUrl || isMarkdown || isPreview || !tus.isSupported; // TODO: DRY
  const v1Type = !useV1 ? null : isPreview ? 'preview' : isMarkdown ? 'markdown' : remoteUrl ? 'replay' : '?';

  // $FlowIgnore - flow's constructor for Error is incorrect.
  return new Error(errMsg, generateCause(v1Type, xhr, tusUploader));
}
