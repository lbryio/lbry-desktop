import isDev from 'electron-is-dev';

export default function doLogWarningConsoleMessage(activeOnDev = false) {
  if (isDev && !activeOnDev) return;
  const style = {
    redTitle:
      'color: red; font-size: 50px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;, font-weight: bold;',
    normalText: 'font-size: 24px;',
    redText:
      'color: red; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; font-size: 24px;',
  };
  console.clear();
  console.log('%cScam alert!', style.redTitle);

  console.log(
    '%cIf someone told you to copy / paste something here you have a chance of being scammed.',
    style.normalText
  );

  console.log(
    '%cPasting anything in here could give attackers access to your LBC credits or wallet.',
    style.normalText
  );

  console.log(
    "%cIf you don't understand exactly what you are doing here, please close this window and keep your LBC credits/wallet safe.",
    style.redText
  );

  console.log(
    '%cIf you do understand exactly what you are doing, joins us, earn LBC, and make LBRY better! All of LBRY is open-source and we have a sweet secret handshake. Get started at https://lbry.tech/contribute',
    style.normalText
  );
}
