/** Return true if run on Internet Explorer. */
const checkIE = () => {
  if (navigator.appName === 'Microsoft Internet Explorer'
  || !!(navigator.userAgent.match(/Trident/)
  || navigator.userAgent.match(/rv:11/))
  ) {
    return true;
  }

  return false;
};

export default checkIE;
