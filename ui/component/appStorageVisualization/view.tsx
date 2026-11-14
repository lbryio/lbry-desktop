import * as React from "react";
import I18nMessage from "component/i18nMessage";
// @ts-expect-error - TS2792 - Cannot find module 'electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import { ipcRenderer } from "electron";

type Props = {
  // --- select ---
  diskSpace: DiskSpace; // KB,
  viewHostingLimit: number; // MB,
  autoHostingLimit: number;
  viewBlobSpace: number;
  autoBlobSpace: number;
  privateBlobSpace: number;
};

function StorageViz(props: Props) {
  const { diskSpace, viewHostingLimit, autoHostingLimit, viewBlobSpace, autoBlobSpace, privateBlobSpace } = props;
  React.useEffect(() => {
    ipcRenderer.send("get-disk-space");
  }, []);

  if (!diskSpace || !diskSpace.total) {
    return (
      <div className={"storage__wrapper"}>
        <div className={"storage__bar"}>
          <div className="help">{__("Cannot get disk space information.")}</div>
        </div>
      </div>
    );
  }

  const totalMB = diskSpace && Math.floor(diskSpace.total / 1024);
  const freeMB = diskSpace && Math.floor(diskSpace.free / 1024);
  const otherMB = totalMB - (freeMB + viewBlobSpace + autoBlobSpace + privateBlobSpace);
  const autoFree = autoHostingLimit - autoBlobSpace;
  const viewFree = viewHostingLimit > 0 ? viewHostingLimit - viewBlobSpace : freeMB - autoFree;
  const unallocFree = freeMB - viewFree - autoFree;
  const viewLimit =
    viewHostingLimit === 0
      ? freeMB - (autoHostingLimit - autoBlobSpace) + viewBlobSpace
      : viewHostingLimit + viewBlobSpace;

  // @ts-expect-error - TS2362 - The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
  const getPercent = (val: unknown, lim = totalMB) => (val / lim) * 100;
  const getGB = (val: unknown) => (Number(val) / 1024).toFixed(2);

  const otherPercent = getPercent(otherMB);
  const privatePercent = getPercent(privateBlobSpace);
  const autoLimitPercent = getPercent(autoHostingLimit);
  const viewLimitPercent = getPercent(viewLimit);
  const viewUsedPercentOfLimit = getPercent(viewBlobSpace, viewLimit);
  const autoUsedPercentOfLimit = getPercent(autoBlobSpace, autoHostingLimit);

  return (
    <div className={"storage__wrapper"}>
      <div className={"storage__bar"}>
        <div className={"storage__other"} style={{ width: `${otherPercent}%` }} />
        <div className={"storage__private"} style={{ width: `${privatePercent}%` }} />
        <div className={"storage__auto"} style={{ width: `${autoLimitPercent}%` }}>
          <div className={"storage__auto--used"} style={{ width: `${autoUsedPercentOfLimit}%` }} />
          <div className={"storage__auto--free"} />
        </div>
        <div className={"storage__viewed"} style={{ width: `${viewLimitPercent}%` }}>
          <div className={"storage__viewed--used"} style={{ width: `${viewUsedPercentOfLimit}%` }} />
          <div className={"storage__viewed--free"} />
        </div>
        {/* @ts-expect-error - TS2353 (ts-migration) */}
        {viewHostingLimit !== 0 && <div style={{ "background-color": "unset" }} />}
      </div>
      <div className={"storage__legend-wrapper"}>
        <div className={"storage__legend-item"}>
          <div className={"storage__legend-item-swatch storage__legend-item-swatch--private"} />
          <div className={"storage__legend-item-label"}>
            <label>{__("Publishes --[legend, storage category]--")}</label>
            <div className={"help"}>{`${getGB(privateBlobSpace)} GB`}</div>
          </div>
        </div>
        <div className={"storage__legend-item"}>
          <div className={"storage__legend-item-swatch storage__legend-item-swatch--auto"} />
          <div className={"storage__legend-item-label"}>
            <label>{__("Auto Hosting --[legend, storage category]--")}</label>
            <div className={"help"}>
              {autoHostingLimit === 0 ? (
                __("Disabled")
              ) : (
                // @ts-expect-error - TS2745 (ts-migration)
                <I18nMessage
                  // @ts-expect-error - TS2322 (ts-migration)
                  tokens={{
                    spaceUsed: getGB(autoBlobSpace),
                    limit: getGB(autoHostingLimit),
                  }}
                >
                  %spaceUsed% of %limit% GB
                </I18nMessage>
              )}
            </div>
          </div>
        </div>
        <div className={"storage__legend-item"}>
          <div className={"storage__legend-item-swatch storage__legend-item-swatch--viewed"} />
          <div className={"storage__legend-item-label"}>
            <label>{__("View Hosting --[legend, storage category]--")}</label>
            <div className={"help"}>
              {viewHostingLimit === 1 ? (
                __("Disabled")
              ) : (
                // @ts-expect-error - TS2745 (ts-migration)
                <I18nMessage
                  // @ts-expect-error - TS2322 (ts-migration)
                  tokens={{
                    spaceUsed: getGB(viewBlobSpace),
                    limit: viewHostingLimit !== 0 ? getGB(viewHostingLimit) : getGB(viewFree),
                  }}
                >
                  %spaceUsed% of %limit% Free GB
                </I18nMessage>
              )}
            </div>
          </div>
        </div>
        {viewHostingLimit !== 0 && (
          <div className={"storage__legend-item"}>
            <div className={"storage__legend-item-swatch storage__legend-item-swatch--free"} />
            <div className={"storage__legend-item-label"}>
              <label>{__("Free --[legend, unused disk space]--")}</label>
              <div className={"help"}>{`${getGB(unallocFree)} GB`}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StorageViz;
