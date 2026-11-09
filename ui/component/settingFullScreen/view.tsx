import React from 'react';
import { ipcRenderer } from 'electron';
import { FormField } from 'component/common/form';

// Shows and changes whether the app window is full screen. The main process reports every change,
// including ones made with the keyboard shortcut or the View menu, so the checkbox always matches the window.
export default function SettingFullScreen() {
  const [fullScreen, setFullScreen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const handleChange = (event: unknown, value: unknown) => setFullScreen(Boolean(value));

    ipcRenderer.invoke('get-full-screen').then((value) => {
      if (mounted) setFullScreen(Boolean(value));
    });
    ipcRenderer.on('full-screen-changed', handleChange);

    return () => {
      mounted = false;
      ipcRenderer.removeListener('full-screen-changed', handleChange);
    };
  }, []);

  return (
    <FormField
      type="checkbox"
      name="full_screen"
      checked={fullScreen}
      onChange={() => ipcRenderer.send('set-full-screen', !fullScreen)}
    />
  );
}
