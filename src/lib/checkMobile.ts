/** Return true if run on mobile browser. */
const checkMobile = () => {
  if (typeof window === `undefined`) {
    return false;
  }
  const navigator: Navigator = window.navigator;
  if (!navigator) {
    return false;
  }
  if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
       return true;
    }

  return false;
};

export default checkMobile;
