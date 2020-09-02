export default function doLogWarningConsoleMessage() {
  const style = {
    redTitle:
      'color: red; font-size: 36px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;, font-weight: bold;',
    normalText: 'font-size: 18px;',
    redText: 'color: red; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; font-size: 24px;',
  };
  console.clear();
  console.log('%cScam alert!', style.redTitle);

  console.log(
    '%cIf someone told you to copy / paste something here you have a chance of being scammed.',
    style.normalText
  );

  console.log(
    '%cPasting anything in here could give attackers access to your LBRY Credits or wallet.',
    style.normalText
  );

  console.log(
    "%cIf you don't understand exactly what you are doing here, please close this window and keep your LBRY Credits/wallet safe.",
    style.redText
  );

  console.log(
    '%cIf you do understand exactly what you are doing, joins us, earn LBRY Credits, and make LBRY better! All of LBRY is open-source and we have a sweet secret handshake. Get started at https://lbry.tech/contribute',
    style.normalText
  );
}
