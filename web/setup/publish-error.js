// @flow
import * as tus from 'tus-js-client';
import { COMMIT_ID } from 'config';
import { platform } from 'util/platform';

function generateCause(
  v1Type: ?string,
  xhr: ?any,
  uploader: ?TusUploader = null,
  originalMsg: ?(string | Error) = null
) {
  return {
    cause: {
      app: `${COMMIT_ID ? COMMIT_ID.slice(0, 8) : '?'} | ${platform.os()} | ${platform.browser()}`,
      ...(xhr ? { xhrResponseURL: xhr.responseURL } : {}),
      ...(xhr ? { xhrStatus: `${xhr.status} (${xhr.statusText})` } : {}),
      ...(v1Type ? { type: v1Type } : {}),
      ...(uploader?._fingerprint ? { fingerprint: uploader?._fingerprint } : {}),
      ...(uploader?._retryAttempt ? { retryAttempt: uploader?._retryAttempt } : {}),
      ...(!tus.isSupported ? { isTusSupported: tus.isSupported } : {}),
      ...(originalMsg ? { original: typeof originalMsg === 'string' ? originalMsg : originalMsg.message } : {}),
    },
  };
}

export function generateError(
  errMsg: string,
  params: FileUploadSdkParams,
  xhr: ?any,
  tusUploader: ?TusUploader = null,
  originalErrMsg: ?(string | Error) = null
) {
  const { preview: isPreview, remote_url: remoteUrl, isMarkdown } = params;
  const useV1 = remoteUrl || isMarkdown || isPreview || !tus.isSupported; // TODO: DRY
  const v1Type = !useV1 ? null : isPreview ? 'preview' : isMarkdown ? 'markdown' : remoteUrl ? 'replay' : '?';

  // $FlowIgnore - flow's constructor for Error is incorrect.
  return new Error(errMsg, generateCause(v1Type, xhr, tusUploader, originalErrMsg));
}
