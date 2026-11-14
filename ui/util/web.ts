import { URL, LBRY_WEB_STREAMING_API } from "config";

const CONTINENT_COOKIE = "continent";

function generateStreamUrl(claimName: string, claimId: string): string {
  return `${LBRY_WEB_STREAMING_API}/content/claims/${encodeURIComponent(claimName)
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")}/${claimId}/stream`;
}

function generateEmbedUrl(
  claimName: string,
  claimId: string,
  includeStartTime: boolean,
  startTime: number | string,
  referralLink: string | null | undefined
): string {
  const urlParams = new URLSearchParams();
  if (includeStartTime && startTime) {
    urlParams.append("t", String(startTime));
  }

  if (referralLink) {
    urlParams.append("r", referralLink);
  }

  return `${URL}/$/embed/${encodeURIComponent(claimName)
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")}/${claimId}?${urlParams.toString()}`;
}

function generateDownloadUrl(claimName: string, claimId: string): string {
  return `${URL}/$/download/${claimName}/${claimId}`;
}

function generateDirectUrl(claimName: string, claimId: string): string {
  return `${URL}/$/stream/${claimName}/${claimId}`;
}

// module.exports needed since the web server imports this function
export { generateStreamUrl, generateEmbedUrl, generateDownloadUrl, generateDirectUrl, CONTINENT_COOKIE };
