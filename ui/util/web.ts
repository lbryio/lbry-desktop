//@ts-nocheck
import { URL, LBRY_WEB_STREAMING_API } from "config";

const CONTINENT_COOKIE = "continent";

function generateStreamUrl(claimName: unknown, claimId: unknown) {
  return `${LBRY_WEB_STREAMING_API}/content/claims/${encodeURIComponent(claimName)
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")}/${claimId}/stream`;
}

function generateEmbedUrl(
  claimName: unknown,
  claimId: unknown,
  includeStartTime: unknown,
  startTime: unknown,
  referralLink: unknown
) {
  const urlParams = new URLSearchParams();
  if (includeStartTime && startTime) {
    urlParams.append("t", startTime);
  }

  if (referralLink) {
    urlParams.append("r", referralLink);
  }

  return `${URL}/$/embed/${encodeURIComponent(claimName)
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")}/${claimId}?${urlParams.toString()}`;
}

function generateDownloadUrl(claimName: unknown, claimId: unknown) {
  return `${URL}/$/download/${claimName}/${claimId}`;
}

function generateDirectUrl(claimName: unknown, claimId: unknown) {
  return `${URL}/$/stream/${claimName}/${claimId}`;
}

// module.exports needed since the web server imports this function
export { generateStreamUrl, generateEmbedUrl, generateDownloadUrl, generateDirectUrl, CONTINENT_COOKIE };
