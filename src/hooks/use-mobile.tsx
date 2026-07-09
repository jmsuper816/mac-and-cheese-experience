import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const widthMql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const coarseMql = window.matchMedia("(pointer: coarse)");

    const compute = () => {
      // Treat any touch-first device (phones AND tablets like iPad) as "mobile"
      // so they get the tap-to-select interaction model instead of mouse drag-and-drop.
      const coarse = coarseMql.matches;
      const ua = navigator.userAgent;
      const uaMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
      // iPadOS 13+ reports as Mac; detect via touch points.
      const iPadOS = /Macintosh/i.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
      setIsMobile(
        window.innerWidth < MOBILE_BREAKPOINT || coarse || uaMobile || iPadOS
      );
    };

    compute();
    widthMql.addEventListener("change", compute);
    coarseMql.addEventListener("change", compute);
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);

    return () => {
      widthMql.removeEventListener("change", compute);
      coarseMql.removeEventListener("change", compute);
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  return !!isMobile;
}

export function useIsPortrait() {
  const [isPortrait, setIsPortrait] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  return isPortrait;
}
