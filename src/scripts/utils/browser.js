const browser = ((() => {
  const userAgent = (window.navigator && navigator.userAgent) || '';

  function detect(pattern) {
    return () => (pattern).test(userAgent);
  }

  const isIE = () => {
    if (navigator.appName === 'Microsoft Internet Explorer') {
      return true;
    } else if (detect(/\bTrident\b/)) {
      return true;
    }
    return false;
  };

  const isDevice = detect(/(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/i);
  const isIOS = detect(/(ipad|iphone|ipod)/i);
  const whoami = () => userAgent;

  return { isDevice, isIOS, whoami, isIE };
})());

export default browser;
