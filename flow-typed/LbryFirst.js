// @flow
declare type LbryFirstStatusResponse = {
  Version: string,
  Message: string,
  Running: boolean,
  Commit: string,
};

declare type LbryFirstVersionResponse = {
  build: string,
  lbrynet_version: string,
  os_release: string,
  os_system: string,
  platform: string,
  processor: string,
  python_version: string,
};
/* SAMPLE UPLOAD RESPONSE (FULL)
"Video": {
            "etag": "\"Dn5xIderbhAnUk5TAW0qkFFir0M/xlGLrlTox7VFTRcR8F77RbKtaU4\"",
            "id": "8InjtdvVmwE",
            "kind": "youtube#video",
            "snippet": {
                "categoryId": "22",
                "channelId": "UCXiVsGTU88fJjheB2rqF0rA",
                "channelTitle": "Mark Beamer",
                "liveBroadcastContent": "none",
                "localized": {
                    "title": "my title"
                },
                "publishedAt": "2020-05-05T04:17:53.000Z",
                "thumbnails": {
                    "default": {
                        "height": 90,
                        "url": "https://i9.ytimg.com/vi/8InjtdvVmwE/default.jpg?sqp=CMTQw_UF&rs=AOn4CLB6dlhZMSMrazDlWRsitPgCsn8fVw",
                        "width": 120
                    },
                    "high": {
                        "height": 360,
                        "url": "https://i9.ytimg.com/vi/8InjtdvVmwE/hqdefault.jpg?sqp=CMTQw_UF&rs=AOn4CLB-Je_7l6qvASRAR_bSGWZHaXaJWQ",
                        "width": 480
                    },
                    "medium": {
                        "height": 180,
                        "url": "https://i9.ytimg.com/vi/8InjtdvVmwE/mqdefault.jpg?sqp=CMTQw_UF&rs=AOn4CLCvSnDLqVznRNMKuvJ_0misY_chPQ",
                        "width": 320
                    }
                },
                "title": "my title"
            },
            "status": {
                "embeddable": true,
                "license": "youtube",
                "privacyStatus": "private",
                "publicStatsViewable": true,
                "uploadStatus": "uploaded"
            }
        }
 */
declare type UploadResponse = {
  Video: {
    id: string,
    snippet: {
      channelId: string,
    },
    status: {
      uploadStatus: string,
    },
  },
};

declare type HasYTAuthResponse = {
  HashAuth: boolean,
};

declare type YTSignupResponse = {};

//
// Types used in the generic LbryFirst object that is exported
//
declare type LbryFirstTypes = {
  isConnected: boolean,
  connectPromise: ?Promise<any>,
  connect: () => void,
  lbryFirstConnectionString: string,
  apiRequestHeaders: { [key: string]: string },
  setApiHeader: (string, string) => void,
  unsetApiHeader: string => void,
  overrides: { [string]: ?Function },
  setOverride: (string, Function) => void,

  // LbryFirst Methods
  stop: () => Promise<string>,
  status: () => Promise<StatusResponse>,
  version: () => Promise<VersionResponse>,
  upload: any => Promise<?UploadResponse>,
  hasYTAuth: string => Promise<HasYTAuthResponse>,
  ytSignup: () => Promise<YTSignupResponse>,
};
