import lbry from "lbry";
import { existsSync } from "fs";
import { remote } from "electron";

function setTheme(name) {
  const link = document.getElementById("theme");
  const file = `${name}.css`;
  const path = `${remote.app.getAppPath()}/dist/themes/${file}`;

  if (existsSync(path)) {
    link.href = `./themes/${file}`;
    lbry.setClientSetting("theme", name);
  } else {
    link.href = `./themes/light.css`;
    lbry.setClientSetting("theme", "light");
  }
}

export default setTheme;
