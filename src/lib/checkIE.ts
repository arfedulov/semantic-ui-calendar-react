/** Return true if run on Internet Explorer. */
const checkIE = () => {
  if (typeof window === `undefined`) {
    return false;
  }
  const navigator: Navigator = window.navigator;
  if (!navigator) {
    return false;
  }
  if (navigator.appName === 'Microsoft Internet Explorer'
  || !!(navigator.userAgent.match(/Trident/)
  || navigator.userAgent.match(/rv:11/))
  ) {
    return true;
  }

  return false;
};

export default checkIE;
