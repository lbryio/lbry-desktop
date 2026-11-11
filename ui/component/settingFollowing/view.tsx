import * as ICONS from "constants/icons";
import React from "react";
import Button from "component/button";
import FileExporter from "component/common/file-exporter";
import { buildFollowingFile } from "util/following-file";

type ImportResult = {
  added: number;
  alreadyFollowing: number;
  invalid: Array<string>;
};

type Props = {
  subscriptions: Array<Subscription>;
  following: Array<Following> | null | undefined;
  importFollowing: (arg1: string) => Promise<ImportResult | null | undefined>;
};

const INVALID_SHOWN_MAX = 5;

function readText(file: File): Promise<string> {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(__("Couldn't read this file.")));
    reader.readAsText(file);
  });
}

export default function SettingFollowing(props: Props) {
  const { subscriptions, following, importFollowing } = props;
  const fileInput = React.useRef();
  const [importing, setImporting] = React.useState(false);
  const [result, setResult] = React.useState<ImportResult | null | undefined>(null);
  const [error, setError] = React.useState("");

  const fileData = React.useMemo(() => buildFollowingFile(subscriptions, following || []), [subscriptions, following]);
  const fileName = `lbry-following-${new Date().toISOString().slice(0, 10)}.json`;

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    // Clear the input so choosing the same file again still imports it.
    e.target.value = "";
    if (!file) return;

    setImporting(true);
    setResult(null);
    setError("");

    readText(file)
      .then((text) => importFollowing(text))
      .then((importResult) => {
        setResult(importResult);
        setImporting(false);
      })
      .catch((err) => {
        setError(err.message);
        setImporting(false);
      });
  }

  const invalid = result ? result.invalid : [];
  const invalidShown =
    invalid.slice(0, INVALID_SHOWN_MAX).join(", ") + (invalid.length > INVALID_SHOWN_MAX ? ", …" : "");

  return (
    <>
      <div className="section__actions">
        <FileExporter
          label={__("Export")}
          tooltip={__("Save the channels you follow to a file")}
          data={fileData}
          defaultFileName={fileName}
          disabled={subscriptions.length === 0}
        />
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          button="secondary"
          icon={ICONS.FILE}
          label={importing ? __("Importing...") : __("Import")}
          aria-label={__("Follow the channels in a file")}
          disabled={importing}
          // @ts-expect-error - TS2339 - Property 'click' does not exist on type 'never'.
          onClick={() => fileInput.current && fileInput.current.click()}
        />
        <input
          type="file"
          accept=".json,.txt,application/json,text/plain"
          ref={fileInput}
          style={{ display: "none" }}
          onChange={handleFileChosen}
        />
      </div>

      {error && <p className="error__text">{error}</p>}

      {result && (
        <p className="help">
          {__("Newly followed: %added%. Already followed: %already%.", {
            added: result.added,
            already: result.alreadyFollowing,
          })}
          {invalid.length > 0 && (
            <>
              <br />
              {__("Couldn't find a channel for %count% entries: %entries%", {
                count: invalid.length,
                entries: invalidShown,
              })}
            </>
          )}
        </p>
      )}
    </>
  );
}
