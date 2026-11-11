import React from "react";
// @ts-expect-error - TS2792 - Cannot find module 'electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import { ipcRenderer } from "electron";
import { FormField } from "component/common/form";

// Shows and changes whether the app window is full screen. The main process reports every change,
// including ones made with the keyboard shortcut or the View menu, so the checkbox always matches the window.
export default function SettingFullScreen() {
  const [fullScreen, setFullScreen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const handleChange = (event: unknown, value: unknown) => setFullScreen(Boolean(value));

    ipcRenderer.invoke("get-full-screen").then((value) => {
      if (mounted) setFullScreen(Boolean(value));
    });
    ipcRenderer.on("full-screen-changed", handleChange);

    return () => {
      mounted = false;
      ipcRenderer.removeListener("full-screen-changed", handleChange);
    };
  }, []);

  return (
    <FormField
      type="checkbox"
      name="full_screen"
      // @ts-expect-error - TS2322 - Type '{ type: string; name: string; checked: boolean; onChange: () => any; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
      checked={fullScreen}
      onChange={() => ipcRenderer.send("set-full-screen", !fullScreen)}
    />
  );
}
