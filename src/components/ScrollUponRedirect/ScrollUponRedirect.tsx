import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollUponRedirect() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.split('/')[3] != 'comments') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}